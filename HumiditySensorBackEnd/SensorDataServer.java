import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.LinkedList;

public class SensorDataServer extends UnicastRemoteObject implements SensorDataInterface {
    private LinkedList<String> dataList = new LinkedList<>();  // Buffer to store last 10 sensor readings

    protected SensorDataServer() throws RemoteException {
        super();
    }

    @Override
    public void storeSensorData(String data) {
        if (dataList.size() >= 10) dataList.removeFirst();  // Keep only the last 10 entries
        dataList.add(data);                                  // Add new data
        System.out.println("Data received from Python: " + data);
    }

    @Override
    public String[] getLastSensorData() {
        return dataList.toArray(new String[0]);  // Return data as array
    }

    public static void main(String[] args) {
        try {
            java.rmi.registry.LocateRegistry.createRegistry(1099);  // Start RMI registry
            SensorDataServer server = new SensorDataServer();
            java.rmi.Naming.rebind("SensorData", server);           // Bind service name
            System.out.println("RMI server is running...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
