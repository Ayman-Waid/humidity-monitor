import java.rmi.Remote;
import java.rmi.RemoteException;

// RMI interface to define methods that can be called remotely
public interface SensorDataInterface extends Remote {
    void storeSensorData(String data) throws RemoteException;      // Store sensor data
    String[] getLastSensorData() throws RemoteException;           // Retrieve last readings
}
