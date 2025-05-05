import serial
from py4j.java_gateway import JavaGateway

# Connect to Py4J Gateway (started by SensorDataGateway.java)
gateway = JavaGateway()
java_gateway = gateway.entry_point

ser = serial.Serial('COM2', 9600, timeout=1)
print("Serial reading started...")

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()
        print(f"Received: {line}")

        # Write to file
        with open("data.txt", "a") as f:
            f.write(line + "\n")

        # Send to Java
        print(f"Sending to Java: {line}")
        java_gateway.sendDataToRMI(line)
