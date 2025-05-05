import serial

# Initialize serial connection to COM2 at 9600 baud with a timeout of 1 second
ser = serial.Serial('COM2', 9600, timeout=1)
print("Serial reading started...")

latest_value = None              # Holds the latest received value
new_data_available = False       # Flag to indicate if new data has arrived

def read_serial():
    global latest_value, new_data_available
    while True:
        if ser.in_waiting > 0:                          # Check if data is available
            line = ser.readline().decode('utf-8').strip()  # Read and decode line
            print(f"Received: {line}")
            latest_value = line                         # Store latest data
            new_data_available = True                   # Flag that new data is ready
