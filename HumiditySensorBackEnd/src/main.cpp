#include <Arduino.h>

void setup() {
  Serial.begin(9600);       // Initialize serial communication at 9600 baud rate
  delay(1000);              // Give the serial port time to initialize
}

void loop() {
  Serial.println("Humidity=45%");  // Send a humidity reading over serial
  delay(2000);                    // Wait 2 seconds before sending next reading
}
