from app import db
class TipoActividades(db.Model):
    __tablename__ = 'tipo_actividades'
    idtipoactividad = db.Column(db.Integer, primary_key=True) 
    nombre = db.Column(db.String(100), nullable=False)