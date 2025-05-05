import py4j.GatewayServer;
import java.rmi.Naming;

public class SensorDataGateway {
    private SensorDataInterface sensorDataInterface;

    public SensorDataGateway() {
        try {
<<<<<<< HEAD
=======
            // Lookup RMI service
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
            sensorDataInterface = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

<<<<<<< HEAD
    // Expose the method to Py4J so Python can call it
=======
    // Exposed method to be called from Python via Py4J
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
    public void sendDataToRMI(String data) {
        try {
            if (sensorDataInterface != null) {
                System.out.println("Sending message to RMI: " + data);
<<<<<<< HEAD
                sensorDataInterface.storeSensorData(data);
=======
                sensorDataInterface.storeSensorData(data);  // Forward data to RMI server
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
<<<<<<< HEAD
        SensorDataGateway app = new SensorDataGateway();
        GatewayServer server = new GatewayServer(app);
=======
        SensorDataGateway app = new SensorDataGateway();     // Initialize the gateway
        GatewayServer server = new GatewayServer(app);       // Start Py4J server
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
        server.start();
        System.out.println("GatewayServer started");
    }
}
