<h1 align="center">🚗 ParkLith — Smart IoT Parking System</h1>

<p align="center">
IoT-based smart parking system that detects parking availability using sensors and displays real-time status on a web dashboard.
</p>

<p align="center">

<img src="https://img.shields.io/badge/IoT-ESP32-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb"/>
<img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel"/>

</p>

<p align="center">

<a href="https://parklith.vercel.app">
<img src="https://img.shields.io/badge/🚀 Live Dashboard-Visit-success?style=for-the-badge"/>
</a>

<a href="https://github.com/mayank30092">
<img src="https://img.shields.io/badge/GitHub-Mayank%20Mittal-black?style=for-the-badge&logo=github"/>
</a>

</p>

---

# 📌 Project Overview

**ParkLith** is an **IoT-powered smart parking system** that detects parking slot availability using sensors and updates the status in **real time on a web dashboard**.

The system integrates **ESP32 hardware, sensor detection, a backend API, and a React dashboard** to provide an efficient parking monitoring solution.

---

# ⚡ Features

🚗 Real-time parking slot detection  

📡 ESP32 sensor data transmission  

📊 Live web dashboard for slot monitoring  

📟 LCD display showing available slots  

⚡ Fast REST API communication  

🌐 Accessible from any device via web dashboard  

---

## 🧠 System Architecture

```mermaid
flowchart LR

A[🚗 Vehicle] --> B[📡 Ultrasonic Sensor]

B --> C[⚡ ESP32 Microcontroller]

C --> D[📶 WiFi Network]

D --> E[🌐 Node.js Backend API]

E --> F[🗄 MongoDB Database]

E --> G[📊 React Dashboard]

G --> H[👤 User / Parking Manager]

```

---

# 🛠 Hardware Components

- ESP32 Microcontroller  
- Ultrasonic Sensors  
- LCD Display (I2C)  
- Breadboard  
- Jumper Wires  
- USB Power Supply  

---

# 💻 Tech Stack

## Hardware
- ESP32
- Ultrasonic Sensors
- LCD Display (I2C)

## Backend
- Node.js
- Express.js
- REST API

## Frontend
- React.js
- Vite
- CSS

## Database
- MongoDB

## Deployment
- Frontend → Vercel  
- Backend → Render  

---

# 📂 Project Structure

```bash
ParkLith
│
├── parking-dashboard/      # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── parking-server/         # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── server.js
│
├── esp32-code/             # ESP32 firmware
│   ├── config.h
│   ├── sensor_manager.h
│   ├── wifi_manager.h
│   └── main.ino
│
└── README.md

```
---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/mayank30092/parklith.git
cd parklith
```

## 2️⃣ Setup Backend

```bash
cd parking-server
npm install
node server.js
```

## 3️⃣ Setup Frontend

```bash
cd parking-dashboard
npm install
npm run dev
```

## 4️⃣ Upload ESP32 Firmware

1. Open **Arduino IDE**
2. Install the **ESP32 Board Support Package**

```bash
File → Preferences → Additional Board Manager URLs
https://dl.espressif.com/dl/package_esp32_index.json
```

3. Install the ESP32 board:
   
```bash
Tools → Board → Boards Manager → ESP32
```

4. Connect your **ESP32 via USB**

5. Open the firmware from the **esp32-code** folder.

6. Update WiFi credentials and backend server URL inside `config.h`.

Example configuration:

```cpp
#define WIFI_SSID "Your_WiFi_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"

#define SERVER_URL "https://your-backend-url.com/update-slot"
```
7. Select the correct board:

```bash
Tools → Board → ESP32 Dev Module
```

 8. Click Upload to flash the firmware.

---

## 🔐 Environment Variables
Create a .env file inside the parking-server folder.

- PORT=5000
- MONGO_URI=your_mongodb_connection_string

### Example MongoDB connection:

- mongodb+srv://username:password@cluster.mongodb.net/parklith

## 📡 API Endpoint
ESP32 sends slot updates to the backend server.


### POST /update-slot
Example request body:
```json
{
  "slotId": 1,
  "occupied": true
}
```

# 📊 Future Improvements

- 📱 Mobile app for parking monitoring
- 🅿️ Parking reservation system
- 💳 Payment gateway integration
- 🛰 GPS-based parking discovery
- 🏢 Multi-floor parking support

 
# 👨‍💻 Author

**Mayank Mittal**
<p> <a href="https://github.com/mayank30092"> <img src="https://img.shields.io/badge/GitHub-mayank30092-black?style=for-the-badge&logo=github"/> </a> <a href="https://linkedin.com/in/mayankmittal30092"> <img src="https://img.shields.io/badge/LinkedIn-Mayank%20Mittal-blue?style=for-the-badge&logo=linkedin"/> </a> <a href="https://portfolio-lake-nine-37.vercel.app"> <img src="https://img.shields.io/badge/Portfolio-Visit-success?style=for-the-badge"/> </a> </p>
<p align="center"> ⭐ If you like this project, consider giving it a star! </p>
