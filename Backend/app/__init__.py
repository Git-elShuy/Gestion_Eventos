from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import datetime

db = SQLAlchemy()
jwt = JWTManager()  # ✅ Instancia global

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    app.config["JWT_SECRET_KEY"] = "s3cr3tP@ssw0rd"
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1)

    # ✅ Inicializar extensiones
    db.init_app(app)
    jwt.init_app(app)

    # CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": "http://localhost:4200",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    @app.before_request
    def handle_options_request():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers["Access-Control-Allow-Origin"] = "http://localhost:4200"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

    # Blueprints
    from app.routes.usuario_routes import usuario_bp
    from app.routes.ubicaciones_routes import ubicaciones_bp
    from app.routes.carrera_routes import carrera_bp
    from app.routes.eventos_routes import eventos_bp
    from app.routes.patrocinios_routes import patrocinios_bp
    from app.routes.recursos_routes import recursos_bp

    app.register_blueprint(usuario_bp, url_prefix="/api/usuarios")
    app.register_blueprint(ubicaciones_bp, url_prefix="/api/ubicaciones")
    app.register_blueprint(carrera_bp, url_prefix="/api/carreras")
    app.register_blueprint(eventos_bp, url_prefix="/api/eventos")
    app.register_blueprint(patrocinios_bp, url_prefix="/api/patrocinios")
    app.register_blueprint(recursos_bp, url_prefix="/api/recursos")

    return app
