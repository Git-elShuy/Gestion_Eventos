from app import db

class Usuario(db.Model):
    __tablename__ = 'Usuarios' 
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
