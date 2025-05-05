import java.rmi.Remote;
import java.rmi.RemoteException;

<<<<<<< HEAD
public interface SensorDataInterface extends Remote {
    void storeSensorData(String data) throws RemoteException;
    String[] getLastSensorData() throws RemoteException;
=======
// RMI interface to define methods that can be called remotely
public interface SensorDataInterface extends Remote {
    void storeSensorData(String data) throws RemoteException;      // Store sensor data
    String[] getLastSensorData() throws RemoteException;           // Retrieve last readings
>>>>>>> 124836990bb3b20c9157d4d6611e192b83215369
}
