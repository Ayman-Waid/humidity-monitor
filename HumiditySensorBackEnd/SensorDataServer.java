import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.LinkedList;

public class SensorDataServer extends UnicastRemoteObject implements SensorDataInterface {
<<<<<<< HEAD
    private LinkedList<String> dataList = new LinkedList<>();
=======
    private LinkedList<String> dataList = new LinkedList<>();  // Buffer to store last 10 sensor readings
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369

    protected SensorDataServer() throws RemoteException {
        super();
    }

    @Override
    public void storeSensorData(String data) {
<<<<<<< HEAD
        if (dataList.size() >= 10) dataList.removeFirst();
        dataList.add(data);
=======
        if (dataList.size() >= 10) dataList.removeFirst();  // Keep only the last 10 entries
        dataList.add(data);                                  // Add new data
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
        System.out.println("Data received from Python: " + data);
    }

    @Override
    public String[] getLastSensorData() {
<<<<<<< HEAD
        return dataList.toArray(new String[0]);
=======
        return dataList.toArray(new String[0]);  // Return data as array
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
    }

    public static void main(String[] args) {
        try {
<<<<<<< HEAD
            java.rmi.registry.LocateRegistry.createRegistry(1099);
            SensorDataServer server = new SensorDataServer();
            java.rmi.Naming.rebind("SensorData", server);
=======
            java.rmi.registry.LocateRegistry.createRegistry(1099);  // Start RMI registry
            SensorDataServer server = new SensorDataServer();
            java.rmi.Naming.rebind("SensorData", server);           // Bind service name
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
            System.out.println("RMI server is running...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
