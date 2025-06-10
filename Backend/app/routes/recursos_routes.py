from flask import Blueprint, request, jsonify
from app import db
from app.models.recursos import Recurso
from app.models.actividad_recurso import ActividadRecurso
from app.models.evento_actividad import EventoActividad
recursos_bp = Blueprint('recursos', __name__)

@recursos_bp.route('/', methods=['POST'])
def crear_recurso():
    try:
        data = request.json
        recursos = data.get('recursos_array',[])
        for recurso in recursos:
            if recurso.get('tipo') != 'paquete':
                recurso['contenido_paquete'] = 0
            else:
                recurso['contenido_paquete'] = recurso['contenido_paquete'] 

            nuevo_recurso = Recurso(
                nombre=recurso['nombre'],
                cantidad=recurso['cantidad'],
                es_patrocinado=recurso['es_patrocinado'],
                evento_id=recurso['idevento'],
                eliminar = 0,
                tipo=recurso['tipo'],
                contenido_paquete=recurso['contenido_paquete']

            )  
            db.session.add(nuevo_recurso)

        db.session.commit()

        return jsonify({'mensaje': 'Recurso creado con éxito'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@recursos_bp.route('get_recurso/<int:idrecurso>', methods=['GET'])
def getRecurso(idrecurso):
    try:
        recurso = Recurso.query.get(idrecurso)
        recurso_json = {
            "idrecurso": recurso.idrecurso,
            "nombre": recurso.nombre,
            "cantidad": recurso.cantidad,
            "es_patrocinado": recurso.es_patrocinado,
            "evento_id": recurso.evento_id,
            "tipo": recurso.tipo,
            "contenido_paquete": recurso.contenido_paquete
        }
        return jsonify(recurso_json),200
    except SQLAlchemyError as e:
        db.session.rollback 
        return jsonify({"error": str(e)}), 500   

@recursos_bp.route('/<int:idevento>', methods=['GET'])
def obtener_recursos(idevento):
    try:
        recursos_activos = Recurso.query.filter_by(evento_id=idevento, eliminar=0).all()

        recursos_json = [
            {
                "idrecurso": recurso.idrecurso,
                "nombre": recurso.nombre,
                "cantidad": recurso.cantidad,
                "es_patrocinado": recurso.es_patrocinado,
                "evento_id": recurso.evento_id,
                "tipo": recurso.tipo,
                "contenido_paquete": recurso.contenido_paquete
            }
            for recurso in recursos_activos
        ]

        return jsonify( recursos_json), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@recursos_bp.route('recursos_eliminados/<int:idevento>', methods=['GET'])
def obtener_recursos_inactivos(idevento):
    try:
        recursos_inactivos = Recurso.query.filter_by(evento_id=idevento, eliminar=1).all()

        recursos_json = [
            {
                "idrecurso": recurso.idrecurso,
                "nombre": recurso.nombre,
                "cantidad": recurso.cantidad,
                "es_patrocinado": recurso.es_patrocinado,
                "evento_id": recurso.evento_id,
                "tipo": recurso.tipo,
                "contenido_paquete": recurso.contenido_paquete
            }
            for recurso in recursos_inactivos
        ]

        return jsonify( recursos_json), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500        



@recursos_bp.route('eliminar_patrocinado/<int:idrecurso>', methods=['DELETE'])
def eliminar_recurso_patrocinado(idrecurso):
    try:
        recurso_patrocinado = Recurso.query.get(idrecurso)
        db.session.delete(recurso_patrocinado)
        db.session.commit()
        return jsonify({"mensaje": "Recurso eliminado correctamente."})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@recursos_bp.route('eliminar_recurso/<int:idrecurso>', methods=['DELETE'])
def eliminar_recurso(idrecurso):
    try:
        recurso = Recurso.query.get(idrecurso)
        recurso.eliminar = 1
        db.session.commit() 
        return jsonify({"mensaje": "Recurso eliminado correctamente."})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@recursos_bp.route('recuperar_recurso/<int:idrecurso>', methods=['PUT'])
def recuperar_recurso(idrecurso):
    try:
        recurso = Recurso.query.get(idrecurso)
        recurso.eliminar = 0
        db.session.commit() 
        return jsonify({"mensaje": "Recurso eliminado correctamente."})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@recursos_bp.route('editar_recurso/<int:idrecurso>/<int:idevento>', methods=['PUT'])
def editar_recurso(idrecurso,idevento):
    try:
        data = request.json
        if data['tipo'] != 'paquete':  #  Si no es un paquete
            contenido_paquete = 0
        else:
            contenido_paquete = data['contenido_paquete']
         #Obtener todas las asignaciones del recurso en el evento
        total_asignado = db.session.query(db.func.sum(ActividadRecurso.cantidad_utilizada)).filter(
            ActividadRecurso.recurso_id == idrecurso,
            ActividadRecurso.id_evento_actividad.in_(
                db.session.query(EventoActividad.idevento_actividad).filter(EventoActividad.evento_id == idevento)
            )
        ).scalar() or 0  # Si no hay asignaciones, total_asignado será 0
        nueva_cantidad = data['cantidad']
        recurso = Recurso.query.get(idrecurso)
        if nueva_cantidad < total_asignado:
         return jsonify({"error": f"No puedes cambiar la cantidad a {nueva_cantidad}. Ya se han asignado {total_asignado} {recurso.tipo}"}), 400
        else:
         recurso.nombre=data['nombre']
         recurso.cantidad=data['cantidad']
         recurso.evento_id=data['evento_id']
         recurso.tipo=data['tipo'] 
         recurso.contenido_paquete=contenido_paquete
         db.session.commit()
         return jsonify({"mensaje": "Recurso editado correctamente."})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@recursos_bp.route('validar_cambio_recurso/<int:idrecurso>', methods=['GET'])
def validar_cambio_recurso(idrecurso):
    try:
        recurso_asignado = ActividadRecurso.query.filter_by(recurso_id=idrecurso).first()
        if recurso_asignado:
            return jsonify({"asignado": True}), 200
        else:
            return jsonify({"asignado": False}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 


@recursos_bp.route('/get_recursos_actividad/<int:idactividadevento>', methods=['GET'])
def getRecursosActividad(idactividadevento):
    try:
        recursos_actividad = ActividadRecurso().query.filter_by(id_evento_actividad=idactividadevento).all()
        recursos_actividad_JSON = [
        {

         'recurso_id': recurso.recurso_id,
         'nombre_recurso': recurso.recurso.nombre,
         'cantidad_utilizada': recurso.cantidad_utilizada

        }
        for recurso in recursos_actividad
        ]
        return jsonify(recursos_actividad_JSON),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500