from app import db
class Ubicaciones(db.Model):
    __tablename__ = 'ubicaciones'
    idUbicaciones = db.Column(db.Integer, primary_key=True) 
    nombre = db.Column(db.String(100), nullable=False)
    direccion = db.Column(db.String(100), nullable=False)
    colonia = db.Column(db.String(100), nullable=False)
    contacto = db.Column(db.String(100), nullable=False)
    eliminar = db.Column(db.Integer, nullable=False)