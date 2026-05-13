#ifndef SERVER_MANAGER_H
#define SERVER_MANAGER_H

#include <WiFi.h>
#include <HTTPClient.h>
#include "config.h"

void sendStatus(int slot, bool occupied) {

  Serial.println("Entering sendStatus()");

  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;

    String status = occupied ? "occupied" : "vacant";

    String json = "{";
    json += "\"slotId\":" + String(slot + 1) + ",";
    json += "\"status\":\"" + status + "\"";
    json += "}";

    String url = String(SERVER_URL) + "/update-slot";

    Serial.print("Sending POST request to: ");
    Serial.println(url);

    Serial.print("Payload: ");
    Serial.println(json);

    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(json);

    Serial.print("HTTP Code: ");
    Serial.println(httpCode);

    if (httpCode > 0) {

      String payload = http.getString();

      Serial.print("Server Response: ");
      Serial.println(payload);

    } 
    else {

      Serial.print("HTTP Error: ");
      Serial.println(http.errorToString(httpCode));

    }

    http.end();

  } 
  else {

    Serial.println("WiFi NOT connected, skipping request");

  }
}

#endif