import py4j.GatewayServer;
import java.rmi.Naming;

public class SensorDataGateway {
    private SensorDataInterface sensorDataInterface;

    public SensorDataGateway() {
        try {
            sensorDataInterface = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Expose the method to Py4J so Python can call it
    public void sendDataToRMI(String data) {
        try {
            if (sensorDataInterface != null) {
                System.out.println("Sending message to RMI: " + data);
                sensorDataInterface.storeSensorData(data);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        SensorDataGateway app = new SensorDataGateway();
        GatewayServer server = new GatewayServer(app);
        server.start();
        System.out.println("GatewayServer started");
    }
}
