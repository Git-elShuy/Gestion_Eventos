from flask import Blueprint, request, jsonify
from app import db
from app.models.ubicaciones import Ubicaciones
from app.models.ubicaciones_lugar import UbicacionesLugar

ubicaciones_bp = Blueprint('ubicaciones', __name__)

@ubicaciones_bp.route('/', methods=['POST'])
def crear_ubicacion():
    try:
        data = request.json
        nueva_ubicacion = Ubicaciones(
            nombre=data['nombre'],
            direccion=data['direccion'],
            colonia=data['colonia'],
            contacto=data['contacto'],
            eliminar = 0
        )
        db.session.add(nueva_ubicacion)
        db.session.flush()  # Esto permite obtener el id de la ubicación sin hacer commit
        lugares = data.get('lugares_ubicacion', [])
        print(lugares)
        for lugar in lugares:
            nuevo_lugar = UbicacionesLugar(
                nombre=lugar['nombreLugar'],
                capacidad=lugar['capacidad'],
                ubicacion_id=nueva_ubicacion.idUbicaciones,
                eliminar = 0
            )
            db.session.add(nuevo_lugar)

        db.session.commit()

        return jsonify({'mensaje': 'Ubicación y lugares creados con éxito'}), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    #data = request.json
    #nueva_ubicacion = Ubicaciones(nombre=data['nombre'], direccion=data['direccion'])

@ubicaciones_bp.route('/', methods=['GET'])
def get_ubicaciones():
    try:
        #ubicaciones = Ubicaciones.query.all()
        # Filtrar ubicaciones donde eliminar sea 0
        ubicaciones = Ubicaciones.query.filter_by(eliminar=0).all()
        data = []
        for ubicacion in ubicaciones:
         data.append({
            'idUbicaciones': ubicacion.idUbicaciones,
            'nombre': ubicacion.nombre,
            'direccion': ubicacion.direccion,
            'colonia': ubicacion.colonia,
            'contacto': ubicacion.contacto
         })
        return jsonify(data),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error' : str(e)}), 500


@ubicaciones_bp.route('/eliminadas/', methods=['GET'])
def get_ubicaciones_eliminadas():
    try:
        #ubicaciones = Ubicaciones.query.all()
        # Filtrar ubicaciones donde eliminar sea 0
        ubicaciones = Ubicaciones.query.filter_by(eliminar=1).all()
        data = []
        for ubicacion in ubicaciones:
         data.append({
            'idUbicaciones': ubicacion.idUbicaciones,
            'nombre': ubicacion.nombre,
            'direccion': ubicacion.direccion,
            'colonia': ubicacion.colonia,
            'contacto': ubicacion.contacto
         })
        return jsonify(data),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error' : str(e)}), 500

@ubicaciones_bp.route('/editar/<int:id>', methods=['GET'])
def get_ubicacion_con_lugares(id):
    try:
        ubicacion = Ubicaciones.query.get(id)
        if not ubicacion:
            return jsonify({'error': f'No se encontró la ubicación con ID {id}'}), 404
        #lugares = UbicacionesLugar.query.filter_by(ubicacion_id=id).all()
        lugares = UbicacionesLugar.query.filter(UbicacionesLugar.ubicacion_id == id, UbicacionesLugar.eliminar == 0).all()
        data = {
            #'ubicacion':{
                'idUbicaciones': ubicacion.idUbicaciones,
                'nombre': ubicacion.nombre,
                'direccion': ubicacion.direccion,
                'colonia': ubicacion.colonia,
                'contacto': ubicacion.contacto,
                'lugares':[
                {
                    'idubicaciones_lugar': lugar.idubicaciones_lugar,
                    'nombreLugar': lugar.nombre,
                    'capacidad': lugar.capacidad,
                    'eliminar': lugar.eliminar
                    #'ubicacion_id': lugar.ubicacion_id

                }
                for lugar in lugares
            ]

            #}
        }
        return jsonify(data),200
    except SQLAlchemyError as e:
        print(f"Error al obtener datos: {e}")
        return jsonify({'error': 'Error al obtener datos de la base de datos'}), 500
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify({'error:' 'Error inesperado en el servidor'}),500



@ubicaciones_bp.route('/lugares_eliminados/<int:id_ubicacion>', methods=['GET'])
def obtener_lugaresByidUbicacion(id_ubicacion):
    try:
        lugares = UbicacionesLugar.query.filter_by(ubicacion_id=id_ubicacion, eliminar=1).all()

        #if not lugares:
            #return jsonify({'mensaje': 'No se encontraron lugares para esta ubicación'},{}), 404

        lugares_json = [
            {
                'idubicaciones_lugar': lugar.idubicaciones_lugar,
                'nombreLugar': lugar.nombre,
                'capacidad': lugar.capacidad,
            }
            for lugar in lugares
        ]

        return jsonify(lugares_json), 200

    except Exception as e:
        print(f"Error al obtener lugares: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@ubicaciones_bp.route('/recuperar_lugar/<int:lugar_id>', methods=['PUT'])
def recuperar_lugares(lugar_id):
    try:
        # Buscar el lugar en la base de datos
        lugar_existente = UbicacionesLugar.query.get(lugar_id)

        if not lugar_existente:
            return jsonify({'error': f'No se encontró el lugar con ID {lugar_id}'}), 404

        # Restaurar el lugar eliminándolo de la lista de lugares eliminados
        lugar_existente.eliminar = 0  
        db.session.commit()
        print(f"Lugar con ID {lugar_id} ha sido restaurado.")

        return jsonify({'mensaje': f'El lugar con ID {lugar_id} ha sido recuperado correctamente'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al recuperar lugar: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@ubicaciones_bp.route('/actualizar/<int:id_ubicacion>', methods=['PUT'])
def actualizar_ubicacion(id_ubicacion):
    try:
        data = request.json

        # Obtener la ubicación que se actualizará
        ubicacion = Ubicaciones.query.get(id_ubicacion)
        if not ubicacion:
            return jsonify({'error': 'Ubicación no encontrada'}), 404

        # Actualizar datos de la ubicación
        ubicacion.nombre = data['nombre']
        ubicacion.direccion = data['direccion']
        ubicacion.colonia = data['colonia']
        ubicacion.contacto = data['contacto']
        db.session.commit()

        # Procesar lugares: actualizar, agregar nuevos o marcar como eliminados
        for lugar in data['lugares_ubicacion']:
            if 'idubicaciones_lugar' in lugar:  # Si el lugar tiene ID, actualizarlo
                lugar_existente = UbicacionesLugar.query.get(lugar['idubicaciones_lugar'])
                if lugar_existente:
                    lugar_existente.nombre = lugar['nombreLugar']
                    lugar_existente.capacidad = lugar['capacidad']
                    db.session.commit()
                else:
                    return jsonify({'error': f'Lugar con ID {lugar["idubicaciones_lugar"]} no encontrado'}), 404
            else:  # Si no tiene ID, es un nuevo lugar
                nuevo_lugar = UbicacionesLugar(
                    nombre=lugar['nombreLugar'],
                    capacidad=lugar['capacidad'],
                    ubicacion_id=id_ubicacion,
                    eliminar=0  # Se crea activo (0) por defecto
                )
                db.session.add(nuevo_lugar)
                db.session.commit()

        # Marcar como eliminados los lugares que estén en la lista lugaresEliminados
        print("Lugares eliminados recibidos:", data.get('lugaresEliminados', []))
        for lugar_id in data.get('lugaresEliminados', []):  
            lugar_existente = UbicacionesLugar.query.get(lugar_id)
            if lugar_existente:
                lugar_existente.eliminar = 1  # Marcar como eliminado en la BD
                db.session.commit()

        return jsonify({'mensaje': 'Ubicación y lugares actualizados correctamente'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar ubicación: {e}")
        return jsonify({'error': 'Error en el servidor'}), 500



 

@ubicaciones_bp.route('/eliminar_ubicacion/<int:id>', methods=['DELETE'])
def eliminar_ubicacion(id):
    try:
        ubicacion = Ubicaciones.query.get(id)
        if not ubicacion:
            return jsonify({"error": f"No se encontró la ubicación con ID {id}"}), 404

        ubicacion.eliminar = 1
        db.session.commit()
        return jsonify({"mensaje": f"Ubicación con ID {id} eliminada correctamente"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error:", e)
        return jsonify({"error": "Error interno del servidor"}), 500


@ubicaciones_bp.route('/recuperar_ubicacion/<int:idubicacion>', methods=['PUT'])
def recuperar_ubicacion(idubicacion):
    try:
        
        ubicacion = Ubicaciones.query.get(idubicacion)

        if not ubicacion:
            return jsonify({'error': f'No se encontró el lugar con ID {idubicacion}'}), 404

       
        ubicacion.eliminar = 0  
        db.session.commit()
        print(f"Lugar con ID {idubicacion} ha sido restaurado.")

        return jsonify({'mensaje': f'El lugar con ID {idubicacion} ha sido recuperado correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al recuperar lugar: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500        

