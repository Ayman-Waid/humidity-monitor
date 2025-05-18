import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;

public class SensorDataImpl extends UnicastRemoteObject implements SensorDataInterface {
    private final String[][] data = {
        {"50", "52"},  // Zone 0, Sensors 0 and 1
        {"47", "49"}   // Zone 1, Sensors 0 and 1
    };

    public SensorDataImpl() throws RemoteException {}

    public void storeSensorData(String d) throws RemoteException {
        System.out.println("Received: " + d);
    }

    public String[] getLastSensorData() throws RemoteException {
        return new String[] { "Zone1: 50%", "Zone2: 47%" };
    }

    public String getSensorValue(int zone, int sensor) throws RemoteException {
        return data[zone][sensor];
    }

    public void startSaving() throws RemoteException {}
    public void stopSaving() throws RemoteException {}
}
