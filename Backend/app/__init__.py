from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuración
    app.config.from_object('app.config.Config')

    # Inicializar extensiones
    db.init_app(app)

    # Importar y registrar rutas
    from app.routes.usuario_routes import usuario_bp
    app.register_blueprint(usuario_bp, url_prefix="/api/usuarios")

    return app
