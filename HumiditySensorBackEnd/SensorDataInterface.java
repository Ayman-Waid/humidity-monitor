import java.rmi.Remote;
import java.rmi.RemoteException;

public interface SensorDataInterface extends Remote {
    void storeSensorData(String data) throws RemoteException;
    String[] getLastSensorData() throws RemoteException;
}
