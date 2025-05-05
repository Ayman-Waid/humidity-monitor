import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.LinkedList;

public class SensorDataServer extends UnicastRemoteObject implements SensorDataInterface {
    private LinkedList<String> dataList = new LinkedList<>();

    protected SensorDataServer() throws RemoteException {
        super();
    }

    @Override
    public void storeSensorData(String data) {
        if (dataList.size() >= 10) dataList.removeFirst();
        dataList.add(data);
        System.out.println("Data received from Python: " + data);
    }

    @Override
    public String[] getLastSensorData() {
        return dataList.toArray(new String[0]);
    }

    public static void main(String[] args) {
        try {
            java.rmi.registry.LocateRegistry.createRegistry(1099);
            SensorDataServer server = new SensorDataServer();
            java.rmi.Naming.rebind("SensorData", server);
            System.out.println("RMI server is running...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
