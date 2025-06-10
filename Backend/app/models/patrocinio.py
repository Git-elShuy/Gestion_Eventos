from app import db
from sqlalchemy import Enum
class Patrocinio(db.Model):
   __tablename__ = 'patrocinios'
   idpatrocinio =  db.Column(db.Integer, primary_key=True)
   nombrePatrocinador = db.Column(db.String(100), nullable=False)
   evento_id = db.Column(db.Integer, nullable=False)
   eliminar = db.Column(db.Integer, nullable=False)

