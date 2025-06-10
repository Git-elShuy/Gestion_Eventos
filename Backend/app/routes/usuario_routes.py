from flask import Blueprint, request, jsonify
from app import db
from app import jwt
from flask_jwt_extended import create_access_token
#import jwt
#import datetime
from app.models.usuario import Usuario
from app.models.permisos import Permisos
from app.models.carrera import Carrera
from app.models.actividad_usuarios import ActividadUsuario
usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{'id': u.id, 'nombre': u.nombre, 'email': u.email} for u in usuarios])

@usuario_bp.route('/', methods=['POST'])
def crear_usuario():
    try:
     data = request.json
     nuevo_usuario = Usuario(
        matricula=data['matricula'],
        nombre=data['nombre'],
        apellido=data['apellido'],
        celular=data['celular'],         
        email=data['email'],
        id_permiso=data['idpermiso'],
        id_carrera=data['idcarrera'],
        eliminar=0,
        password = "P@ssw0rd123"
    )
     db.session.add(nuevo_usuario)
     db.session.commit()
     return jsonify({'message': 'Usuario creado'}), 201
    except SQLAlchemyError as e:
     db.session.rollback()
     return jsonify({'error': str(e)}), 500


@usuario_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()  #  Obtener datos del frontend

        #  Corrección de 'matricula' (evita que se guarde como una tupla)
        matricula = data['matricula']
        password = data['password']

        #  Buscar usuario en la base de datos
        usuario = Usuario.query.filter_by(matricula=matricula).first()

        if usuario and usuario.password == password:
            #  Generar Token JWT usando Flask-JWT-Extended
            token = create_access_token(identity={"matricula": usuario.matricula, "nombre": usuario.nombre})
            #token = create_access_token(identity=str(usuario.matricula))


            return jsonify({
                'mensaje': 'Login exitoso',
                'token': token
            }), 200
        else:
         return jsonify({'error': 'Credenciales incorrectas'}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@usuario_bp.route('/permisos', methods=['GET'])
def get_permits():
    try:
        permisos = Permisos.query.all()
        permisos_json = [
        {
        'idpermiso': permiso.idpermiso,
        'nombre': permiso.nombre
        }
        for permiso in permisos
        ]
        return jsonify(permisos_json), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error' : str(e)}), 500

@usuario_bp.route('/permisos_admin', methods=['GET'])
def get_permits_dos():
    try:
        #filtrar solo por permisos que son 2 y 3
         permisos = Permisos.query.filter(Permisos.idpermiso.in_([2, 3])).all()
         permisos_json = [
         {
         'idpermiso': permiso.idpermiso,
         'nombre': permiso.nombre
         }
         for permiso in permisos
        ]
         return jsonify(permisos_json), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error' : str(e)}), 500               


@usuario_bp.route('/user_permits/<string:matricula>', methods=['GET'])
def get_userPermits(matricula):
    try:
        usuario = Usuario.query.filter_by(matricula=matricula).first()
        if usuario:
            permisos = usuario.id_permiso
            print(f"Permiso del usuario: {usuario.id_permiso}")
            return jsonify( permisos), 200
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404 
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error' : str(e)}), 500 

@usuario_bp.route('/user_carrera/<string:matricula>', methods=['GET'])
def get_userCarrera(matricula):
    try:
        usuario = Usuario.query.filter_by(matricula=matricula).first()
        carrera = Carrera.query.get(usuario.id_carrera)
        return jsonify(carrera.idcarreras), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error' : str(e)}), 500 

@usuario_bp.route('/admin_carreras/<int:idcarrera>', methods=['GET'])
def get_admin_carreras(idcarrera):
    try:
        # Filtrar usuarios con idcarrera específico y permiso 2 o 3, esto es para la vista de super admins
        usuarios = Usuario.query.filter(Usuario.id_carrera == idcarrera, Usuario.id_permiso.in_([2, 3])).all()

        # Formatear los datos en una lista de diccionarios
        resultado_json = [
            {"matricula": usuario.matricula, 
            "nombre": usuario.nombre, 
            "email": usuario.email, 
            "apellido": usuario.apellido,
            "idpermiso": usuario.id_permiso,
            "idcarrera": usuario.id_carrera,
            "eliminar": usuario.eliminar
            }
            for usuario in usuarios
        ]

        return jsonify(resultado_json), 200  # Enviar los usuarios encontrados

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
        





@usuario_bp.route('/asistentes_carreras/<int:idcarrera>', methods=['GET'])
def get_asistentes_carreras(idcarrera):
    try:
        # Filtrar usuarios con idcarrera específico y permiso 3 , esto es para la vista de admins
        usuarios = Usuario.query.filter(Usuario.id_carrera == idcarrera, Usuario.id_permiso == 3).all()

        # Formatear los datos en una lista de diccionarios
        resultado_json = [
            {
                "matricula": usuario.matricula, 
                "nombre": usuario.nombre, 
                "email": usuario.email, 
                "apellido": usuario.apellido,
                "idpermiso": usuario.id_permiso,
                "idcarrera": usuario.id_carrera,
                "eliminar": usuario.eliminar
            }
            for usuario in usuarios
        ]

        return jsonify(resultado_json), 200  # Enviar los usuarios encontrados

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500







@usuario_bp.route('/cambiar_<campo>', methods=['POST'])
def gestionar_usuarios(campo):
    #este metodo solo lo usaran los sa y los admin para gestionar usuarios
    try:
        data = request.get_json()
        matricula = data.get("matricula")
        nuevo_valor = data.get(campo)
        print(f"🔹 Datos recibidos: {data}")  # Verifica qué datos están llegando
        print(f"🔹 Campo a actualizar: {campo}")
        print(f"🔹 Nuevo valor: {nuevo_valor}")

        print(f"✅ Cambio recibido: {campo} → {nuevo_valor} para usuario {matricula}")

        usuario = Usuario.query.filter_by(matricula=matricula).first()

        if usuario:
            setattr(usuario, campo, nuevo_valor)  #Actualiza el campo dinámicamente
            db.session.commit()
            return jsonify({"mensaje": f"{campo} actualizado correctamente"}), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@usuario_bp.route('/usuarios_actividad/<int:idactividadevento>', methods=['GET'])
def usuarios_actividad(idactividadevento):
    try:
        usuarios_asignados = ActividadUsuario.query.filter_by(id_actividad=idactividadevento).all()
        usuarios_asignadosJSON = [
        {
         'id_actividad': usuario.id_actividad,
         'matricula_usuario': usuario.matricula_usuario,
         'nombre_usuario': usuario.usuario.nombre,
         'descripcion_actividad': usuario.descripcion_actividad
        }
        for usuario in usuarios_asignados
        ]
        return jsonify(usuarios_asignadosJSON),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

