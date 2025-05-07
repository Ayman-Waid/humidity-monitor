import threading
import time
from flask import Flask
from py4j.java_gateway import JavaGateway
import read_serial

app = Flask(__name__)  

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
                print(f"Error sending data to Java: {e}")
            read_serial.new_data_available = False  
        time.sleep(0.1)  

@app.route("/")
def index():
    return "Flask is running"

if __name__ == "__main__":
    threading.Thread(target=read_serial.read_serial, daemon=True).start()  
    threading.Thread(target=send_data_to_java, daemon=True).start()        
    app.run(debug=True, use_reloader=False)                               
 