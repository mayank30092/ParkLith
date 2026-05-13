#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include "config.h"

unsigned long obstacleStart[TOTAL_SPOTS] = {0};
bool occupied[TOTAL_SPOTS] = {false};

float readDistance(int trigPin, int echoPin) {

  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 20000);

  if(duration == 0) return -1;

  float distance = duration * 0.0343 / 2;

  return distance;
}

float getFilteredDistance(int trigPin, int echoPin) {

  const int samples = 5;   // reduced for faster response

  float sum = 0;
  int valid = 0;

  for(int i=0;i<samples;i++){

    float d = readDistance(trigPin, echoPin);

    if(d > 5 && d < 350){
      sum += d;
      valid++;
    }

    delay(40);   // reduced delay
  }

  if(valid == 0) return -1;

  return sum / valid;
}

bool checkOccupied(float distance, int index){

  if(distance > 0 && distance < DETECT_DISTANCE){

    if(obstacleStart[index] == 0)
      obstacleStart[index] = millis();

    if(millis() - obstacleStart[index] > 1500)
      occupied[index] = true;

  }
  else{

    obstacleStart[index] = 0;
    occupied[index] = false;

  }

  return occupied[index];
}

#endif