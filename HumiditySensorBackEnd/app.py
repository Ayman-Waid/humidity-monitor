from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/data")
def get_data():
    try:
        with open("data.txt", "r") as f:  # <-- Make sure path is correct
            lines = f.readlines()
        return jsonify(lines=[line.strip() for line in lines[-10:]])  # Last 10 lines
    except FileNotFoundError:
        return jsonify(lines=[])

@app.route("/")
def home():
    return "Flask server is running. Go to /data to see the latest sensor values."

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
