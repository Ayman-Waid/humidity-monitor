import java.rmi.Remote;
import java.rmi.RemoteException;

public interface SensorDataInterface extends Remote {
    void storeSensorData(String data) throws RemoteException;
    String[] getLastSensorData() throws RemoteException;
    String getSensorValue(int zone, int sensor) throws RemoteException;
    void startSaving() throws RemoteException;
    void stopSaving() throws RemoteException;
}
