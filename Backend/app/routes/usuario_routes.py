from flask import Blueprint, request, jsonify
from app import db
from app.models.usuario import Usuario

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{'id': u.id, 'nombre': u.nombre, 'email': u.email} for u in usuarios])

@usuario_bp.route('/', methods=['POST'])
def crear_usuario():
    data = request.json
    nuevo = Usuario(nombre=data['nombre'], email=data['email'])
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({'message': 'Usuario creado'}), 201
