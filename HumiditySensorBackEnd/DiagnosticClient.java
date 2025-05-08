import java.rmi.Naming;

public class DiagnosticClient {
    public static void main(String[] args) {
        try {
            SensorDataInterface stub = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");

            // Start saving
            stub.startSaving();
            System.out.println("Requested Flask to start saving data.");

            // Wait some time or do something else...
            Thread.sleep(10000); // optional delay

            // Stop saving
            stub.stopSaving();
            System.out.println("Requested Flask to stop saving data.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
