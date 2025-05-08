public class SensorValueClient {
    public static void main(String[] args) {
        try {
            SensorDataInterface sensorDataInterface = (SensorDataInterface) java.rmi.Naming.lookup("rmi://localhost/SensorData");

            // Loop through zones and sensors, assuming there are 4 zones and 2 sensors per zone
            for (int zone = 0; zone < 4; zone++) {
                for (int sensor = 0; sensor < 2; sensor++) {
                    String result = sensorDataInterface.getSensorValue(zone, sensor);
                    System.out.println("Humidity for Zone " + zone + ", Sensor " + sensor + ": " + result + "%");
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
