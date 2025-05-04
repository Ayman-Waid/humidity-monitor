import serial

ser = serial.Serial('COM2', 9600, timeout=1)
print("Serial reading started...")

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()
        print(f"Received: {line}")
        with open("data.txt", "a") as f:
            f.write(line + "\n")
