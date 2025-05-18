import java.io.*;
import java.net.*;
import java.rmi.Naming;

public class HttpRmiBridgeServer {
    public static void main(String[] args) throws Exception {
        SensorDataInterface rmi = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");
        ServerSocket server = new ServerSocket(8080);
        System.out.println("HTTP Server running at http://localhost:8080");

        while (true) {
            Socket client = server.accept();
            BufferedReader reader = new BufferedReader(new InputStreamReader(client.getInputStream()));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(client.getOutputStream()));

            String line = reader.readLine(); // GET /api/sensor?zone=0&sensor=1
            if (line == null) continue;

            String[] parts = line.split(" ");
            if (parts.length < 2) continue;

            String path = parts[1];
            if (path.startsWith("/api/sensor")) {
                int zone = 0, sensor = 0;
                if (path.contains("?")) {
                    String[] params = path.split("\\?")[1].split("&");
                    for (String param : params) {
                        String[] kv = param.split("=");
                        if (kv.length == 2) {
                            if (kv[0].equals("zone")) zone = Integer.parseInt(kv[1]);
                            if (kv[0].equals("sensor")) sensor = Integer.parseInt(kv[1]);
                        }
                    }
                }

                String result = rmi.getSensorValue(zone, sensor);

                writer.write("HTTP/1.1 200 OK\r\n");
                writer.write("Content-Type: application/json\r\n");
                writer.write("\r\n");
                writer.write("{\"value\": \"" + result + "\"}");
            } else {
                writer.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }

            writer.flush();
            client.close();
        }
    }
}