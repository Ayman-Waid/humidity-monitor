# Humidity Sensor Monitoring System

This project involves reading humidity data from sensors, sending it to a Java RMI server, and saving it into a text file that can be viewed via a Flask-based web interface.

## Project Structure
	### Python Files
		- `app.py`: Flask app that receives sensor data, communicates with the Java RMI backend, and exposes endpoints to start/stop saving data and to view saved data.
		- `read_serial.py`: Continuously reads humidity data from the Arduino via serial, decodes it, and updates shared memory variables used by `app.py`.
		- `sensor_data.txt`: File where sensor data (with timestamps) is saved when enabled via `/start`.
		- `gateway_server.py`: Starts a Py4J gateway to bridge Python and Java (if used separately).

	### Java Files
		- `SensorDataInterface.java`: RMI interface defining methods like `storeSensorData()`, `getSensorValue()`, `startSaving()`, and `stopSaving()`.
		- `SensorDataServer.java`: Implements the RMI server, stores incoming data, and makes HTTP requests to Flask to start/stop saving.
		- `SensorValueClient.java`: Java RMI client that fetches humidity values for specific zone/sensor.
		- `DataControlClient.java`: Java client to remotely start or stop saving the data file via RMI.

## Requirements

	### Python
		- Python 3.x
		- Install required Python libraries:
	  		- Flask
	  		- py4j
	  		- pyserial

	  Install using pip:
	  	pip install flask py4j pyserial

	### Java
		- Java JDK 8 or above
		- RMI Registry (Usually comes with the JDK)

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Running the Project

1. Start the Java RMI server:
   - Run the following commands to start the Java server:
     rmiregistry
     java SensorDataServer
     java -cp ".;py4j-0.10.9.9.jar" SensorDataGateway

2. Run the Flask app:
     python app.py

2. Run the simulation in Proteus:
   - Open SRD.pdsprj

3. Diagnostic:
     java DiagnosticClient

4. View the data:
   - To view the data in the sensor_data.txt file, visit:
     http://localhost:5000/diagnotic

## File Format

The sensor_data.txt file will store data in the following format:
Zone,Sensor,Humidity,Timestamp
0,0,19.35,2025-05-08 15:34:12
1,0,87.10,2025-05-08 15:34:15


## License

This project is open-source by Ahmed MOUHIB.
