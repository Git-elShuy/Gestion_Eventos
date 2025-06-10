from app import db
class Evento(db.Model):
    __tablename__ = 'eventos'
    idevento =  db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    fechainicio = db.Column(db.String(100), nullable=False)
    fechafin = db.Column(db.String(100), nullable=False)
    hora = db.Column(db.String(100), nullable=False)
    ubicacion_id = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.String(100), nullable=False)
    carrera_id = db.Column(db.Integer, nullable=False)
    eliminar = db.Column(db.Integer, nullable=False)