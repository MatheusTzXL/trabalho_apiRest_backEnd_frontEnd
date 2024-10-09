from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///banco.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

CORS(app)

class Veiculo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    modelo = db.Column(db.String(80), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    preco = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'modelo': self.modelo,
            'ano': self.ano,
            'preco': self.preco,
        }

def create_tables():
    db.create_all()

with app.app_context():
    create_tables()

@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

@app.route('/veiculos', methods=['GET'])
def get_veiculos():
    veiculos = Veiculo.query.all()
    return jsonify([veiculo.serialize() for veiculo in veiculos])

@app.route('/veiculos', methods=['POST'])
def create_veiculo():
    dados = request.get_json()
    novo_veiculo = Veiculo(modelo=dados['modelo'], ano=dados['ano'], preco=dados['preco'])
    db.session.add(novo_veiculo)
    db.session.commit()
    return jsonify(novo_veiculo.serialize()), 201

@app.route('/veiculos/<int:veiculo_id>', methods=['DELETE'])
def delete_veiculo(veiculo_id):
    veiculo = Veiculo.query.get(veiculo_id)
    if veiculo is None:
        return jsonify({'mensagem': 'Veículo não encontrado'}), 404
    db.session.delete(veiculo)
    db.session.commit()
    return jsonify({'mensagem': 'Veículo excluído com sucesso'}), 200

@app.route('/veiculos/<int:veiculo_id>', methods=['PUT'])
def update_veiculo(veiculo_id):
    dados = request.get_json()
    veiculo = Veiculo.query.get(veiculo_id)
    
    if veiculo is None:
        return jsonify({'mensagem': 'Veículo não encontrado'}), 404
    
    # Atualiza os dados do veículo
    veiculo.modelo = dados['modelo']
    veiculo.ano = dados['ano']
    veiculo.preco = dados['preco']
    db.session.commit()
    
    return jsonify(veiculo.serialize())

if __name__ == '__main__':
    app.run(debug=True)
