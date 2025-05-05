import threading
import time
from flask import Flask
from py4j.java_gateway import JavaGateway
import read_serial

app = Flask(__name__)

@app.route("/data")
def get_data():
    try:
        with open("HumiditySensorBackEnd/data.txt", "r") as f:
            lines = f.readlines()
        return jsonify(lines=[line.strip() for line in lines[-10:]])  # return last 10 lines
    except FileNotFoundError:
        return jsonify(lines=[])

@app.route("/")
def index():
    return "Flask is running"

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)