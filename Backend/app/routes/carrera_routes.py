from flask import Blueprint, request, jsonify
from app import db
from app.models.carrera import Carrera

carrera_bp = Blueprint('carrera', __name__)

@carrera_bp.route('/', methods=['GET'])
def get_carreras():
  try:
   carreras = Carrera.query.filter_by(eliminar=0).all()
   carreras_json = [
    {
    'idcarreras': carrera.idcarreras,
    'nombre': carrera.nombre,
    'abreviatura': carrera.abreviatura
    }
    for carrera in carreras
   ]
   return jsonify(carreras_json), 200
  except SQLAlchemyError as e:
    db.session.rollback()
    return jsonify({'error' : str(e)}), 500

@carrera_bp.route('/get_carrera/<int:idcarrera>', methods=['GET'])
def get_carrerabyId(idcarrera):
  try:
   carrera = Carrera.query.get(idcarrera)
   carrera_json = {
    'idcarreras': carrera.idcarreras,
    'nombre': carrera.nombre,
    'abreviatura': carrera.abreviatura
    }
   return jsonify(carrera_json), 200
  except SQLAlchemyError as e:
    db.session.rollback()
    return jsonify({'error' : str(e)}), 500    

@carrera_bp.route('/eliminadas', methods=['GET'])
def get_carreras_eliminadas():
  try:
   carreras = Carrera.query.filter_by(eliminar=1).all()
   carreras_json = [
    {
    'idcarreras': carrera.idcarreras,
    'nombre': carrera.nombre,
    'abreviatura': carrera.abreviatura
    }
    for carrera in carreras
   ]
   return jsonify(carreras_json), 200
  except SQLAlchemyError as e:
    db.session.rollback()
    return jsonify({'error' : str(e)}), 500    

@carrera_bp.route('/', methods=['POST'])
def nueva_carrera():
    try:
        data = request.json

        # Crear una nueva carrera con eliminación lógica por defecto
        carrera = Carrera(
            nombre=data['nombre'],
            abreviatura=data['abreviatura'],
            eliminar=0
        )

        db.session.add(carrera)
        db.session.commit()

        return jsonify({'mensaje': 'Creado con éxito'}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@carrera_bp.route('/eliminar_carrera/<int:idcarrera>', methods=['DELETE'])
def eliminar_carrera(idcarrera):
  try:
    carrera = Carrera.query.get(idcarrera)
    carrera.eliminar = 1
    db.session.commit()
    return jsonify({"mensaje": f"Carrera con ID {idcarrera} eliminada correctamente"}), 200
  except SQLAlchemyError as e:
    db.session.rollback()
    return jsonify({'error': str(e)}), 500


@carrera_bp.route('/recuperar_carrera/<int:idcarrera>', methods=['PUT'])
def recuperar_carrera(idcarrera):
  try:
    carrera = Carrera.query.get(idcarrera)
    carrera.eliminar = 0
    db.session.commit()
    return jsonify({"mensaje": f"Carrera con ID {idcarrera} restaurada correctamente"}), 200
  except SQLAlchemyError as e:
    db.session.rollback()
    return jsonify({'error': str(e)}), 500


@carrera_bp.route('/actualizar/<int:idcarrera>', methods=['PUT'])
def actualizar_carrera(idcarrera):
  try:
    data = request.json
    carrera = Carrera.query.get(idcarrera)
    carrera.nombre = data['nombre'] 
    carrera.abreviatura = data['abreviatura']
    db.session.commit()
    return jsonify({"mensaje": f"Carrera con ID {idcarrera} actualizada correctamente"}), 200
  except SQLAlchemyError as e:
   db.session.rollback()
   return jsonify({'error': str(e)}), 500


