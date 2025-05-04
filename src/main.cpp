#include <Arduino.h>

void setup() {
  Serial.begin(9600);
  delay(1000); // Wait for Serial to initialize
}

void loop() {
  Serial.println("Humidity=45%");
  delay(2000);
}
