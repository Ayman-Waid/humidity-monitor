#include <DHT.h>  // Library to interact with DHT sensors

#define DHTTYPE DHT11  // Define sensor type as DHT11

// Matrix holding the pin numbers for 4 zones, each with 2 sensors
const int sensorPins[4][2] = {
  {2, 3},  // Zone 0: Sensor 0 on pin 2, Sensor 1 on pin 3
  {4, 5},  // Zone 1: Sensor 0 on pin 4, Sensor 1 on pin 5
  {6, 7},  // Zone 2: Sensor 0 on pin 6, Sensor 1 on pin 7
  {8, 9}   // Zone 3: Sensor 0 on pin 8, Sensor 1 on pin 9
};

// 2D array of DHT sensor objects [zone][sensor]
DHT sensors[4][2] = {
  { DHT(2, DHTTYPE), DHT(3, DHTTYPE) },
  { DHT(4, DHTTYPE), DHT(5, DHTTYPE) },
  { DHT(6, DHTTYPE), DHT(7, DHTTYPE) },
  { DHT(8, DHTTYPE), DHT(9, DHTTYPE) }
};

void setup() {
  Serial.begin(9600);  // Start serial communication
  for (int zone = 0; zone < 4; zone++) {
    for (int sensor = 0; sensor < 2; sensor++) {
      sensors[zone][sensor].begin();  // Initialize each sensor
    }
  }
}
 
void loop() {
  for (int zone = 0; zone < 4; zone++) {
    for (int sensor = 0; sensor < 2; sensor++) {
      float humidity = sensors[zone][sensor].readHumidity();  // Read humidity
      if (isnan(humidity)) continue;  // Skip if reading failed

      // Map humidity from 0–100% to 0–31 (5-bit scale)
      int scaledHumidity = map(humidity, 0, 100, 0, 31);

      // Encode zone (2 bits), sensor (1 bit), and humidity (5 bits) into 1 byte
      byte encoded = (zone << 6) | (sensor << 5) | (scaledHumidity & 0x1F);

      Serial.write(encoded);  // Send encoded byte
      delay(100);             // Short delay between sensors
    }
  }

  delay(2000);  // Wait before looping again
}
