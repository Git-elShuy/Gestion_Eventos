from app import db
class PatrocinioRecurso(db.Model):
    __tablename__ = 'recursos'
    idpatrocinio_recurso = db.Column(db.Integer, primary_key=True)
    id_patrocinio = db.Column(db.Integer)
    id_recurso = db.Column(db.Integer)
    eliminar = db.Column(db.Integer)    