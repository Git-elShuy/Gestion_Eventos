from app import db

class Carrera(db.Model):
    __tablename__ = 'carreras' 
    idcarreras = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    abreviatura = db.Column(db.String(100), nullable=False)
    eliminar = db.Column(db.Integer, nullable=False)