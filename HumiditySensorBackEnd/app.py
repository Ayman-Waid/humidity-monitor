import threading
import time
from flask import Flask
from py4j.java_gateway import JavaGateway
import read_serial

app = Flask(__name__)  # Initialize Flask app

def send_data_to_java():
    gateway = JavaGateway()              # Connect to Java via Py4J
    java_gateway = gateway.entry_point   # Get the Java object reference

    while True:
        if read_serial.new_data_available:      # If new data is available
            message = read_serial.latest_value  # Get latest data
            print(f"Sending to Java: {message}")
            try:
                java_gateway.sendDataToRMI(message)  # Send to Java RMI backend
            except Exception as e:
                print(f"Error sending data to Java: {e}")
            read_serial.new_data_available = False  # Mark data as sent
        time.sleep(0.1)  # Prevent CPU overuse

@app.route("/")
def index():
    return "Flask is running"

if __name__ == "__main__":
    threading.Thread(target=read_serial.read_serial, daemon=True).start()  # Start serial reading
    threading.Thread(target=send_data_to_java, daemon=True).start()        # Start data sending
    app.run(debug=True, use_reloader=False)                                # Start Flask server
