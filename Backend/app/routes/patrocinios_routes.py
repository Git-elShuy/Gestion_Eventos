from flask import Blueprint, request, jsonify
from app import db
from app import jwt
from app.models.patrocinio import Patrocinio
from app.models.recursos import Recurso
from app.models.actividad_recurso import ActividadRecurso
from app.models.evento_actividad import EventoActividad
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import and_
patrocinios_bp = Blueprint('patrocinios', __name__)

@patrocinios_bp.route('/', methods=['POST'])
#@jwt_required() 
def crear_patrocinio():
    try:
        #usuario_actual = get_jwt_identity()
        data = request.json
        nombre_normalizado = data['nombrePatrocinador'].strip().upper()
        patrocinio_existente = Patrocinio.query.filter(
            and_(Patrocinio.nombrePatrocinador.ilike(f"%{nombre_normalizado}%"), Patrocinio.evento_id == data['evento_id'])
        ).first()
        if patrocinio_existente:
            return jsonify({'error': 'Ya existe este patrocinio'}), 400
        else:
         nuevo_patrocinio = Patrocinio(
         nombrePatrocinador=nombre_normalizado,
         evento_id=data['evento_id'],
         eliminar=0,
         )
        db.session.add(nuevo_patrocinio)
        db.session.commit()
        print(data)
        return jsonify({'mensaje': 'Patrocinio creado con éxito'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@patrocinios_bp.route('/<int:idevento>', methods=['GET'])
#@jwt_required() 
def obtener_patrocinios(idevento):
    try:

        #usuario_actual = get_jwt_identity()
        #print(f"Headers recibidos: {request.headers}") 
        patrocinios = Patrocinio.query.filter(Patrocinio.evento_id == idevento , Patrocinio.eliminar==0).all()
        patrocinios_json = [
            {
                'idpatrocinio': patrocinio.idpatrocinio,
                'nombrePatrocinador': patrocinio.nombrePatrocinador,
                'evento_id': patrocinio.evento_id,
                'eliminar': patrocinio.eliminar

            }
            for patrocinio in patrocinios
        ]

        return jsonify(patrocinios_json), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patrocinios_bp.route('eliminados/<int:idevento>', methods=['GET'])
#@jwt_required() 
def obtener_patrociniosEliminados(idevento):
    try:
        patrocinios = Patrocinio.query.filter(Patrocinio.evento_id == idevento , Patrocinio.eliminar==1).all()
        patrocinios_json = [
            {
                'idpatrocinio': patrocinio.idpatrocinio,
                'nombrePatrocinador': patrocinio.nombrePatrocinador,
                'evento_id': patrocinio.evento_id,
                'eliminar': patrocinio.eliminar
            }
            for patrocinio in patrocinios
        ]

        return jsonify(patrocinios_json), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
 
@patrocinios_bp.route('eliminar_patrocinio/<int:idpatrocinio>', methods=['DELETE'])
#@jwt_required() 
def eliminar_patrocinio(idpatrocinio):
    try:
        patrocinio = Patrocinio.query.get(idpatrocinio)
        patrocinio.eliminar = 1
        db.session.commit()
        return jsonify({'mensaje': 'eliminado'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patrocinios_bp.route('recuperar_patrocinio/<int:idpatrocinio>', methods=['PUT'])
#@jwt_required() 
def recuperar_patrocinio(idpatrocinio):
    try:
        patrocinio = Patrocinio.query.get(idpatrocinio)
        patrocinio.eliminar = 0
        db.session.commit()
        return jsonify({'mensaje': 'recuperado'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 

@patrocinios_bp.route('patrocinio_Byid/<int:idpatrocinio>', methods=['GET'])
#@jwt_required() 
def patrocinio_Byid(idpatrocinio):
    try:
        patrocinio = Patrocinio.query.get(idpatrocinio)
        patrocinio_json = {
            'idpatrocinio':patrocinio.idpatrocinio,
            'nombrePatrocinador':patrocinio.nombrePatrocinador,
            'evento_id':patrocinio.evento_id,
            'eliminar':patrocinio.eliminar
        }
        return jsonify(patrocinio_json), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@patrocinios_bp.route('editar_patrocinio/<int:idpatrocinio>', methods=['PUT'])
#@jwt_required() 
def editar_patrocinio(idpatrocinio):
    try:
        data = request.json
        patrocinio = Patrocinio.query.get(idpatrocinio)
        patrocinio.nombrePatrocinador = data['nombrePatrocinador']
        patrocinio.evento_id = data['evento_id']
        db.session.commit()
        return jsonify({"mensaje": f"Patrocinio con ID {idpatrocinio} actualizado correctamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500     


@patrocinios_bp.route('validar_cambio_patrocinio/<int:idpatrocinio>', methods=['GET'])
def validar_cambio_patrocinio(idpatrocinio):
    try:
        recurso_asignado = Recurso.query.filter_by(es_patrocinado=idpatrocinio).first()
        if recurso_asignado:
            return jsonify({"asignado": True}), 200
        else:
            return jsonify({"asignado": False}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 



@patrocinios_bp.route('nombre_patrocinador/<int:idpatrocinio>', methods=['GET'])
def obtener_patrocinador(idpatrocinio):
    #print(f'IDPATROCINIO {idpatrocinio}')
    patrocinador = Patrocinio.query.filter_by(idpatrocinio=idpatrocinio).first()
    if patrocinador:
        return jsonify({"nombrePatrocinador": patrocinador.nombrePatrocinador})
    return jsonify({"error": "Patrocinador no encontrado"}), 404
                                                 