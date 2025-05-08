import threading
import time
from flask import Flask
from py4j.java_gateway import JavaGateway
import read_serial
from datetime import datetime

app = Flask(__name__)

saving_enabled = False

@app.route("/")
def index():
    return "Flask is running"

@app.route("/start")
def start_saving():
    global saving_enabled
    saving_enabled = True
    return "Started saving data to file."

@app.route("/stop")
def stop_saving():
    global saving_enabled
    saving_enabled = False
    return "Stopped saving data to file."

@app.route("/diagnostic")
def diagnostic():
    try:
        with open("data.txt", "r") as f:
            lines = f.readlines()

        formatted_lines = []
        for line in lines:
            parts = line.strip().split(",")
            if len(parts) == 4:
                zone, sensor, humidity, timestamp = parts
                humidity = str(round(float(humidity)))
                formatted_lines.append(f"{timestamp} - Zone {zone}, Sensor {sensor}: {humidity}%")

        return "<br>".join(formatted_lines)

    except FileNotFoundError:
        return "No data file found."

def send_data_to_java():
    gateway = JavaGateway()
    java_gateway = gateway.entry_point

    while True:
        if read_serial.new_data_available:
            message = read_serial.latest_value
            print(f"Sending to Java: {message}")
            try:
                java_gateway.sendDataToRMI(message)
            except Exception as e:
                print(f"Error sending to Java: {e}")

            if saving_enabled:
                try:
                    with open("data.txt", "a") as f:
                        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        f.write(f"{message},{now}\n")
                except Exception as e:
                    print(f"Error writing to file: {e}")

            read_serial.new_data_available = False
        time.sleep(0.1)

if __name__ == "__main__":
    threading.Thread(target=read_serial.read_serial, daemon=True).start()
    threading.Thread(target=send_data_to_java, daemon=True).start()
    app.run(debug=True, use_reloader=False)
