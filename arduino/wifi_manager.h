#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include "config.h"

unsigned long lastReconnectAttempt = 0;

void connectWiFi() {

  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);   // ensure station mode
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("WiFi Connected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

  } else {

    Serial.println("WiFi Failed! Restarting...");
    ESP.restart();

  }
}

void checkWiFi() {

  if (WiFi.status() != WL_CONNECTED) {

    unsigned long now = millis();

    if (now - lastReconnectAttempt > 5000) {

      Serial.println("WiFi Lost! Reconnecting...");

      WiFi.disconnect(true);
      delay(500);

      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

      lastReconnectAttempt = now;

    }

  }

}

#endif