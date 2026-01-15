from flask import Flask, jsonify
import random

app = Flask(__name__)

@app.route('/generate', methods=['GET'])
def generate_silly_content():
    silly_contents = [
        "Un éléphant qui danse le tango.",
        "Un chat qui joue au poker avec des souris.",
        "Une pizza qui chante des chansons d'amour.",
        "Un robot qui fait du jardinage.",
        "Un poisson qui porte des lunettes de soleil."
    ]
    return jsonify({"silly_content": random.choice(silly_contents)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)