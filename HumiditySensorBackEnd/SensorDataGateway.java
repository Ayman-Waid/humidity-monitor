import py4j.GatewayServer;
import java.rmi.Naming;

public class SensorDataGateway {
    private SensorDataInterface sensorDataInterface;

    public SensorDataGateway() {
        try {
            // Lookup RMI service
            sensorDataInterface = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Exposed method to be called from Python via Py4J
    public void sendDataToRMI(String data) {
        try {
            if (sensorDataInterface != null) {
                System.out.println("Sending message to RMI: " + data);
                sensorDataInterface.storeSensorData(data);  // Forward data to RMI server
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        SensorDataGateway app = new SensorDataGateway();     // Initialize the gateway
        GatewayServer server = new GatewayServer(app);       // Start Py4J server
        server.start();
        System.out.println("GatewayServer started");
    }
}
