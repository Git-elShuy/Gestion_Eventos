from app import db
class EventoActividad(db.Model):
 __tablename__ = 'evento_actividad'
 idevento_actividad =  db.Column(db.Integer, primary_key=True)
 nombre = db.Column(db.String(100), nullable=False)
 hora_inicio = db.Column(db.String(100), nullable=False)
 hora_fin = db.Column(db.String(100), nullable=False)
 evento_id = db.Column(db.Integer, nullable=False)
 lugar_id = db.Column(db.Integer, nullable=False)
 id_tipoactv = db.Column(db.Integer, nullable=False)
 eliminar = db.Column(db.Integer, nullable=False)
 fecha = db.Column(db.String(100), nullable=False)
 expositor = db.Column(db.String(100), nullable=False)