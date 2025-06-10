from flask import Blueprint, request, jsonify
from app import db
from app.models.evento import Evento
from app.models.tipo_actividades import TipoActividades
from app.models.evento_actividad import EventoActividad
from app.models.actividad_recurso import ActividadRecurso
from app.models.actividad_usuarios import ActividadUsuario
from app.models.recursos import Recurso
from datetime import datetime
eventos_bp = Blueprint('eventos', __name__)
@eventos_bp.route('/eventos_carrera/<int:idcarrera>', methods=['GET'])
def get_eventos(idcarrera):
    try:
        eventos = Evento.query.filter(Evento.carrera_id == idcarrera , Evento.eliminar==0).all()  #Obtener todos los eventos de la carrera
        eventos_json = [
        {
        'idevento': evento.idevento,
        'nombre': evento.nombre,
        'fechainicio': evento.fechainicio,
        'fechafin': evento.fechafin,
        'hora': evento.hora,
        'ubicacion_id': evento.ubicacion_id,
        'descripcion': evento.descripcion,
        'carrera_id': evento.carrera_id
        }
        for evento in eventos
        ]
        return jsonify(eventos_json), 200 
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/evento_ById/<int:idevento>', methods=['GET'])
def get_eventoById(idevento):
    try:
        evento = Evento.query.get(idevento)
        evento_json = {
        'idevento': evento.idevento,
        'nombre': evento.nombre,
        'fechainicio': evento.fechainicio,
        'fechafin': evento.fechafin,
        'hora': evento.hora,
        'ubicacion_id': evento.ubicacion_id,
        'descripcion': evento.descripcion,
        'carrera_id': evento.carrera_id
        }
        return jsonify(evento_json), 200 
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@eventos_bp.route('/', methods=['POST'])
def crear_evento():
    try:
        data = request.json
        nuevo_evento = Evento(
            nombre=data['nombre'],
            fechainicio=data['fechainicio'],
            fechafin=data['fechafin'],
            hora=data['hora'],
            ubicacion_id=data['ubicacion_id'],
            descripcion=data['descripcion'],
            carrera_id=data['carrera_id'],
            eliminar=0
        )
        db.session.add(nuevo_evento)
        db.session.commit()
        return jsonify({'mensaje': 'Evento creado con éxito'}), 200
    except SQLAlchemyError as e:
     db.session.rollback()
     return jsonify({'error': str(e)}), 500 


@eventos_bp.route('/actualizar/<int:idevento>', methods=['PUT'])
def actualizar_evento(idevento):
    try:
        data = request.json
        evento = Evento.query.get(idevento)
        evento.idevento =data['idevento']
        evento.nombre =data['nombre']
        evento.fechainicio =data['fechainicio']
        evento.fechafin =data['fechafin']
        evento.hora =data['hora']
        evento.ubicacion_id =data['ubicacion_id']
        evento.descripcion =data['descripcion']
        evento.carrera_id =data['carrera_id']
        db.session.commit()
        return jsonify({"mensaje": f"Evento con ID {idevento} actualizado correctamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 



@eventos_bp.route('/getUbicacion_byEventoId/<int:idevento>', methods=['GET'])
def getUbicacion_byEventoId(idevento):
    try:
     evento = Evento.query.get(idevento)
     return jsonify(evento.ubicacion_id)      
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@eventos_bp.route('/get_tipo_actividades', methods=['GET'])
def getTipoActividades():
    try:
        tipo_actividades = TipoActividades.query.all()
        tipo_actividadesJSON = [
            {
                'idtipoactividad': tipo_actividad.idtipoactividad,
                'nombre': tipo_actividad.nombre
            }
            for tipo_actividad in tipo_actividades
        ]
        return jsonify(tipo_actividadesJSON), 200 
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500




@eventos_bp.route('/get_Fechas/<int:idevento>', methods=['GET'])            
def getFechas(idevento):
    try:
        evento = Evento.query.get(idevento)
        fechas_json = {
          'fechainicio': evento.fechainicio,
          'fechafin'  : evento.fechafin
        }
        return jsonify(fechas_json),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500    



@eventos_bp.route('/add_actividad/', methods=['POST'])
def addActividad():
    try:
        data = request.json
        hora_inicio_nueva = datetime.strptime(data['hora_inicio'], "%I:%M %p").time()  
        hora_fin_nueva = datetime.strptime(data['hora_fin'], "%I:%M %p").time()

        #actividad_existente = EventoActividad.query.filter(
        #EventoActividad.fecha == data['fecha'],
        #EventoActividad.lugar_id == data['lugar_id'],
        #(hora_inicio_nueva < EventoActividad.hora_fin) &
        #(hora_fin_nueva > EventoActividad.hora_inicio)
        #).first()
        # Validar traslape manualmente
        actividades = EventoActividad.query.filter(
            EventoActividad.fecha == data['fecha'],
            EventoActividad.lugar_id == data['lugar_id']
        ).all()
        for act in actividades:
         hora_inicio_existente = datetime.strptime(act.hora_inicio, "%I:%M %p").time()
         hora_fin_existente = datetime.strptime(act.hora_fin, "%I:%M %p").time()
         if hora_inicio_nueva < hora_fin_existente and hora_fin_nueva > hora_inicio_existente:
          return jsonify({"error": "📌 Conflicto de horario con otra actividad"}), 400


        #if actividad_existente:
         #return jsonify({"error": "📌 Conflicto de horario con otra actividad"}), 400
        expositor = 'NULL'
        print("📌 Hora recibida en backend:", data.get('hora_inicio'), data.get('hora_fin'))
        if data['id_tipoactv'] == '4'or data['id_tipoactv'] == '5':
            expositor = data['expositor']
        evento_actividad = EventoActividad(
            nombre=data['nombre'],
            hora_inicio=data['hora_inicio'],
            hora_fin=data['hora_fin'],
            evento_id=data['evento_id'],
            lugar_id=data['lugar_id'],
            id_tipoactv=data['id_tipoactv'],
            eliminar = 0,
            fecha=data['fecha'],
            expositor = expositor
        )
        db.session.add(evento_actividad)
        db.session.flush()
        idactividad = evento_actividad.idevento_actividad
        recursos = data.get('recursos_id', [])
        for recurso in recursos:
            nuevo_recurso = ActividadRecurso(
                id_evento_actividad = idactividad,
                recurso_id = recurso['id'],
                cantidad_utilizada = recurso['cantidad_utilizada']
            )
            recurso_asignado = Recurso.query.get(recurso['id'])
            recurso_asignado.cantidad -= recurso['cantidad_utilizada']
            #recurso.cantidad -= recurso.cantidad_utilizada
            db.session.add(nuevo_recurso)
        asistentes = data.get('asistentes',[])
        for asistente in asistentes:
            nuevo_asistente = ActividadUsuario(
                id_actividad = idactividad,
                matricula_usuario = asistente['matricula'],
                descripcion_actividad = asistente['descripcion_actividad']
            )
            db.session.add(nuevo_asistente)
        db.session.commit()
        return jsonify({'mensaje': 'Actividad creada con éxito'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500                      

@eventos_bp.route('/get_actividades/<int:idevento>', methods=['GET'])
def getActividades(idevento):
    try:
        evento_actividades = EventoActividad.query.filter_by(evento_id=idevento).all()
        evento_actividadesJSON = [
        {
            'idevento_actividad': actividad.idevento_actividad,
            'nombre': actividad.nombre,
            'hora_inicio': actividad.hora_inicio,
            'hora_fin': actividad.hora_fin,
            'evento_id': actividad.evento_id,
            'lugar_id': actividad.lugar_id,
            'id_tipoactv': actividad.id_tipoactv,
            'eliminar': actividad.eliminar,
            'fecha': actividad.fecha,
            'expositor': actividad.expositor
        }
        for actividad in evento_actividades
        ]
        return jsonify(evento_actividadesJSON),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500




@eventos_bp.route('/get_actividad/<int:idactividadevento>', methods=['GET'])
def getActividad(idactividadevento):
    try:
        evento_actividad = EventoActividad.query.get(idactividadevento)
        evento_actividadJSON = {
            'nombre': EventoActividad.nombre,
            'hora_inicio': EventoActividad.hora_inicio,
            'hora_fin': EventoActividad.hora_fin,
            'evento_id': EventoActividad.evento_id,
            'lugar_id': EventoActividad.lugar_id,
            'id_tipoactv': EventoActividad.id_tipoactv,
            'fecha': EventoActividad.fecha,
            'expositor': EventoActividad.expositor
        }
        return jsonify(evento_actividadJSON),200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

                 

