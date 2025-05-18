import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.rmi.Naming;
import java.util.ArrayList;
import java.util.List;

public class SensorValueHTTPServer {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/sensor", new SensorHandler());
        server.createContext("/api/zones", new ZoneHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("HTTP Server started on http://localhost:8080");
    }

    static class SensorHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "";

            try {
                // Allow CORS requests from any origin
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                
                SensorDataInterface rmi = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");

                String query = exchange.getRequestURI().getQuery();
                int zone = 0, sensor = 0;
                if (query != null) {
                    String[] params = query.split("&");
                    for (String param : params) {
                        String[] kv = param.split("=");
                        if (kv.length == 2) {
                            if (kv[0].equals("zone")) zone = Integer.parseInt(kv[1]);
                            if (kv[0].equals("sensor")) sensor = Integer.parseInt(kv[1]);
                        }
                    }
                }

                String value = rmi.getSensorValue(zone, sensor);
                response = "{\"value\": \"" + value + "\"}";

            } catch (Exception e) {
                response = "{\"error\": \"" + e.getMessage() + "\"}";
                e.printStackTrace();
            }

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }

    static class ZoneHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response;

            try {
                // Allow CORS requests from any origin
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");

                SensorDataInterface rmi = (SensorDataInterface) Naming.lookup("rmi://localhost/SensorData");

                List<String> zonesList = new ArrayList<>();
                List<String> alertsList = new ArrayList<>();

                double totalMoisture = 0;
                int count = 0;

                for (int zone = 0; zone < 4; zone++) {
                    String val0 = rmi.getSensorValue(zone, 0);
                    String val1 = rmi.getSensorValue(zone, 1);

                    double m0 = parseDouble(val0);
                    double m1 = parseDouble(val1);
                    double avg = (m0 + m1) / 2.0;

                    totalMoisture += avg;
                    count++;

                    String zoneJson = "{"
                            + "\"id\": " + (zone + 1) + ", "
                            + "\"name\": \"Zone " + (zone + 1) + "\", "
                            + "\"sensorValues\": [" + m0 + ", " + m1 + "], "
                            + "\"moisture\": " + avg + ", "
                            + "\"coords\": [48.8584, 2.2945]"
                            + "}";

                    zonesList.add(zoneJson);

                    if (avg < 15) {
                        alertsList.add("{\"zoneId\": " + (zone + 1) + ", \"alertType\": \"critical\"}");
                    } else if (avg < 30) {
                        alertsList.add("{\"zoneId\": " + (zone + 1) + ", \"alertType\": \"warning\"}");
                    }
                }

                double avgMoisture = count > 0 ? totalMoisture / count : 0;

                response = "{"
                        + "\"zones\": [" + String.join(",", zonesList) + "], "
                        + "\"averageMoisture\": " + avgMoisture + ", "
                        + "\"activeAlerts\": [" + String.join(",", alertsList) + "]"
                        + "}";

            } catch (Exception e) {
                response = "{\"error\": \"" + e.getMessage() + "\"}";
                e.printStackTrace();
            }

            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }

        private double parseDouble(String val) {
            try {
                return Double.parseDouble(val);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
    }
}
