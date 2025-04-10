from app import db

class Carrera(db.Model):
    __tablename__ = 'Carreras' 
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)