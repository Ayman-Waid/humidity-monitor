import serial
import time

# Initialize serial port (adjust COM port as needed)
ser = serial.Serial('COM2', 9600, timeout=1)
print("Serial reading started...")

# Shared variables
latest_value = None
new_data_available = False
saving = False  # Used for file saving

data_file = "data.txt"

def decode_byte(byte_val):
    zone_id = (byte_val >> 6) & 0b11
    sensor_id = (byte_val >> 5) & 0b1
    humidity_raw = byte_val & 0b11111
    humidity_percent = humidity_raw * 100 / 31
    return zone_id, sensor_id, humidity_percent

def read_serial():
    global latest_value, new_data_available
    while True:
        if ser.in_waiting > 0:
            byte_read = ser.read(1)
            if byte_read:
                byte_val = int.from_bytes(byte_read, byteorder='big')
                zone, sensor, humidity = decode_byte(byte_val)
                latest_value = f"{zone},{sensor},{humidity:.2f}"
                new_data_available = True

                print(f"Received byte: {format(byte_val, '08b')}")
                print(f"Decoded - Zone: {zone}, Sensor: {sensor}, Humidity: {humidity:.2f}%")

                if saving:
                    with open(data_file, "a") as f:
                        f.write(latest_value + "\n")
        time.sleep(0.1)

# Functions to start/stop saving externally from Flask
def start_saving():
    global saving
    saving = True

def stop_saving():
    global saving
    saving = False
