from app import db
class Permisos(db.Model):
    __tablename__ = 'permisos'
    idpermiso = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False) 