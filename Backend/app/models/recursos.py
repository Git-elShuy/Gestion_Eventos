from app import db
from sqlalchemy import Enum
class Recurso(db.Model):
    __tablename__ = 'recursos'
    idrecurso =  db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    cantidad =  db.Column(db.Integer)
    es_patrocinado =  db.Column(db.Integer)
    evento_id = db.Column(db.Integer)
    eliminar = db.Column(db.Integer)
    tipo = db.Column(Enum('unidad', 'paquete', 'kilogramos', name='tipo_enum'), nullable=False)
    contenido_paquete = db.Column(db.Integer, nullable=False)