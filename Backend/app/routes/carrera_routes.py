from flask import Blueprint, request, jsonify
from app import db
from app.models.carrera import Carrera

carrera_bp = Blueprint('carrera', __name__)

@carrera_bp.route('/' methods=['GET'])
  def get_carreras():
    carreras = Carrera.query.all()