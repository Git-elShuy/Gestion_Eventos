from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Configurar CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": "http://localhost:4200",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Middleware para manejar solicitudes preflight (OPTIONS)
    @app.before_request
    def handle_options_request():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers["Access-Control-Allow-Origin"] = "http://localhost:4200"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

    # Inicializar extensiones
    db.init_app(app)

    # Registrar blueprints
    from app.routes.usuario_routes import usuario_bp
    from app.routes.ubicaciones_routes import ubicaciones_bp
    app.register_blueprint(usuario_bp, url_prefix="/api/usuarios")
    app.register_blueprint(ubicaciones_bp, url_prefix="/api/ubicaciones")

    return app
