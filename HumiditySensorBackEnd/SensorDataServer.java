import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;
import java.net.HttpURLConnection;
import java.net.URL;

public class SensorDataServer extends UnicastRemoteObject implements SensorDataInterface {
    private final Map<String, String> sensorDataMap = new HashMap<>();

    protected SensorDataServer() throws RemoteException {
        super();
    }

    @Override
    public void storeSensorData(String data) {
        String[] parts = data.split(",");
        if (parts.length == 3) {
            String key = parts[0] + "," + parts[1]; // zone,sensor
            sensorDataMap.put(key, parts[2]);
            System.out.println("Stored: Zone " + parts[0] + " Sensor " + parts[1] + " = " + parts[2]);
        }
    }

    @Override
    public String[] getLastSensorData() {
        return sensorDataMap.values().toArray(new String[0]);
    }

    @Override
    public String getSensorValue(int zone, int sensor) {
        String key = zone + "," + sensor;
        return sensorDataMap.getOrDefault(key, "No data");
    }

    @Override
    public void startSaving() throws RemoteException {
        sendFlaskCommand("start");
    }

    @Override
    public void stopSaving() throws RemoteException {
        sendFlaskCommand("stop");
    }

    private void sendFlaskCommand(String command) {
        try {
            URL url = new URL("http://localhost:5000/" + command);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.getResponseCode();
            System.out.println("Flask command sent: " + command);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        try {
            SensorDataServer server = new SensorDataServer();
            java.rmi.Naming.rebind("SensorData", server);
            System.out.println("RMI server is running...");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
