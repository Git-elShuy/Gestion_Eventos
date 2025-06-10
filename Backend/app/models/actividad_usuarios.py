from app import db
class ActividadUsuario(db.Model):
 __tablename__ = 'actividad_usuarios'
 idactividad_usuarios =  db.Column(db.Integer, primary_key=True)
 id_actividad = db.Column(db.Integer, nullable=False)
 matricula_usuario = db.Column(db.String(100), db.ForeignKey('usuarios.matricula'), nullable=False)
 descripcion_actividad = db.Column(db.String(100), nullable=False)
 usuario = db.relationship('Usuario', backref='usuarios_actividad')    