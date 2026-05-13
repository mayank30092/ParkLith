#include "config.h"
#include "wifi_manager.h"
#include "sensor_manager.h"
#include "server_manager.h"

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27,16,2);

bool lastStatus[TOTAL_SPOTS] = {false,false,false};

void setup(){

  Serial.begin(115200);

  for(int i=0;i<TOTAL_SPOTS;i++){
    pinMode(TRIG_PINS[i],OUTPUT);
    pinMode(ECHO_PINS[i],INPUT);
  }

  Wire.begin(21,22);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("SMART PARKING");

  lcd.setCursor(0,1);
  lcd.print("Starting...");

  delay(2000);

  connectWiFi();

  // 🔹 Sync initial status with server
  for(int i=0;i<TOTAL_SPOTS;i++){
    sendStatus(i,false);
  }
}

void loop(){

  checkWiFi();

  int occupiedSpots = 0;

  for(int i=0;i<TOTAL_SPOTS;i++){

    float distance = getFilteredDistance(TRIG_PINS[i],ECHO_PINS[i]);
      bool occ = checkOccupied(distance,i);

      if(occ) occupiedSpots++;

      Serial.print("Slot ");
      Serial.print(i+1);
      Serial.print(": ");
      Serial.println(occ ? "OCCUPIED" : "VACANT");

      // 🔹 Send update only if status changed
      if(occ != lastStatus[i]){

        Serial.println("Status changed → sending update");

        sendStatus(i,occ);

        lastStatus[i] = occ;

      }

  }

  int vacantSpots = TOTAL_SPOTS - occupiedSpots;

  lcd.clear();

  lcd.setCursor(0,0);
  lcd.print("Total:");
  lcd.print(TOTAL_SPOTS);

  lcd.setCursor(10,0);
  lcd.print("Free:");
  lcd.print(vacantSpots);

  lcd.setCursor(0,1);
  lcd.print("Occ:");
  lcd.print(occupiedSpots);

  Serial.println("----------------");

  delay(2000);   // 🔹 increased delay for stable WiFi
}