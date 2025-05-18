# AgriMoist Pro Backend - Humidity Sensor Monitoring System

This backend project handles reading humidity data from Arduino-connected sensors, transferring data through Python and Java RMI layers, and exposing sensor data via a lightweight HTTP server for frontend consumption. It supports real-time data reading, remote start/stop of data saving, and data querying.

## Project Structure

### Python Components
- `app.py`: Flask server that:
  - Reads serial data from Arduino in a background thread.
  - Sends sensor data to Java RMI backend via Py4J gateway.
  - Provides HTTP endpoints to start/stop saving data and for diagnostics.
- `read_serial.py`: (optional) Reads serial data continuously; integrated now into `app.py`.
- `data.txt`: Log file for saved sensor data with timestamps when saving is enabled.
- Py4J Gateway: embedded within `SensorDataGateway.java` (Java side) to receive calls from Python.

### Java Components
- `SensorDataInterface.java`: RMI interface defining methods to store and retrieve sensor data, control saving, etc.
- `SensorDataServer.java`: RMI server implementation that stores sensor data in memory and manages saving commands by calling Flask HTTP endpoints.
- `SensorDataGateway.java`: Py4J gateway server bridging Python Flask and Java RMI.
- `SensorValueClient.java`: Java RMI client to query sensor values per zone and sensor.
- `DiagnosticClient.java`: Java client to remotely start/stop saving data via RMI.
- `SensorValueHTTPServer.java`: Lightweight HTTP server exposing REST endpoints for sensor data and aggregated zone info (including alerts).

## Requirements

### Python
- Python 3.x
- Install dependencies with:
  ```
  pip install flask py4j pyserial
  ```

### Java
- Java JDK 8 or newer
- RMI Registry (comes with JDK)
- Py4J jar file (tested with py4j-0.10.9.9.jar)

## Running the Project

1. Start RMI Registry:
   ```
   rmiregistry
   ```
2. Run Java RMI server:
   ```
   java SensorDataServer
   ```
3. Run Java Py4J gateway server:
   ```
   java -cp ".;py4j-0.10.9.9.jar" SensorDataGateway
   ```
4. Run Flask app to read serial data and forward it:
   ```
   python app.py
   ```
5. (Optional) Run Proteus simulation file `SRD.pdsprj`.

6. Use diagnostic client to start/stop data saving remotely:
   ```
   java DiagnosticClient
   ```
7. Access sensor data via HTTP REST API on port 8080:
   - Single sensor: `http://localhost:8080/api/sensor?zone=0&sensor=1`
   - Zones summary: `http://localhost:8080/api/zones`

## File Format for Saved Data

The `sensor_data.txt` file format (CSV) is:

```
Zone,Sensor,Humidity,Timestamp
0,0,19.35,2025-05-08 15:34:12
1,0,87.10,2025-05-08 15:34:15
```

## Notes

- Sensor data is sent from Arduino as a single byte encoding zone, sensor, and humidity.
- Flask and Java communicate directly via Py4J, avoiding intermediate files.
- The HTTP server provides easy data access for frontend developers with JSON responses and CORS enabled.
- Alerts are generated based on humidity thresholds (e.g., critical if < 15%).

## License

Open-source roject by Ahmed MOUHIB.
