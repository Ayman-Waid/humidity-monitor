import serial
import time

# Initialize serial port on COM2 with baud rate 9600 and 1s timeout
ser = serial.Serial('COM2', 9600, timeout=1)
print("Serial reading started...")

latest_value = None           # Latest decoded value as string
new_data_available = False    # Flag to indicate new data is ready

def decode_byte(byte_val):
    """
    Decode the 8-bit byte into:
    - 2 bits: zone ID (0–3)
    - 1 bit: sensor ID (0 or 1)
    - 5 bits: humidity (0–31, mapped back to %)
    """
    zone_id = (byte_val >> 6) & 0b11
    sensor_id = (byte_val >> 5) & 0b1
    humidity_raw = byte_val & 0b11111
    humidity_percent = humidity_raw * 100 / 31  # Convert back to %
    return zone_id, sensor_id, humidity_percent

def read_serial():
    """
    Continuously read bytes from serial port, decode them,
    and set shared variables for Flask to forward.
    """
    global latest_value, new_data_available
    while True:
        if ser.in_waiting > 0:
            byte_read = ser.read(1)  # Read one byte
            if byte_read:
                byte_val = int.from_bytes(byte_read, byteorder='big')
                zone, sensor, humidity = decode_byte(byte_val)

                # Store the decoded info in a formatted string
                latest_value = f"{zone},{sensor},{humidity:.2f}"
                new_data_available = True

                # Debug output
                print(f"Received byte: {format(byte_val, '08b')}")
                print(f"Decoded - Zone: {zone}, Sensor: {sensor}, Humidity: {humidity:.2f}%")

        time.sleep(0.1)  # Prevent busy-waiting
 