#ifndef CONFIG_H
#define CONFIG_H

// -----------------------
// WiFi credentials
// -----------------------
#define WIFI_SSID "OPPO A5s"
#define WIFI_PASSWORD "81234567"

// -----------------------
// Server API
// -----------------------
#define SERVER_URL "https://parklith-backend-fohb.onrender.com"

// -----------------------
// Parking configuration
// -----------------------
#define TOTAL_SPOTS 3

// -----------------------
// Sensor pins
// -----------------------
const int TRIG_PINS[TOTAL_SPOTS] = {5, 17, 16};
const int ECHO_PINS[TOTAL_SPOTS] = {18, 19, 4};

// -----------------------
// Detection distance (cm)
// -----------------------
#define DETECT_DISTANCE 70

#endif
