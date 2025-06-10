from app import db

class Usuario(db.Model):
    __tablename__ = 'usuarios' 
    matricula = db.Column(db.String(100), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(100), nullable=False)
    #email = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    id_permiso = db.Column(db.Integer, nullable=False)
    id_carrera = db.Column(db.Integer, nullable=False)
    eliminar = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(100), nullable=False)
