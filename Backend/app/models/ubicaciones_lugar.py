from app import db
class UbicacionesLugar(db.Model):
    __tablename__ = 'ubicaciones_lugar'
    idubicaciones_lugar = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    capacidad = db.Column(db.Integer, nullable=False)
    ubicacion_id = db.Column(db.Integer, db.ForeignKey('ubicaciones.idUbicaciones', ondelete='CASCADE'), nullable=False) 
    eliminar = db.Column(db.Integer, nullable=False)