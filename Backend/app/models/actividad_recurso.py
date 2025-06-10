from app import db
class ActividadRecurso(db.Model):
 __tablename__ = 'actividad_recurso'
 idactividad_recurso =  db.Column(db.Integer, primary_key=True)
 id_evento_actividad = db.Column(db.Integer, nullable=False)
 recurso_id = db.Column(db.Integer, db.ForeignKey('recursos.idrecurso'), nullable=False)
 cantidad_utilizada = db.Column(db.Integer, nullable=False)
 recurso = db.relationship('Recurso', backref='recursos_actividad') 