#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

MAX30105 particleSensor;

const int avgReadNum = 1;
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred
float extTemp = 0;
float extHumid = 0;
float beatsPerMinute, beatRet;
int beatAvg, avgRet;
#if defined(__AVR_ATmega328P__) || defined(__AVR_ATmega168__)
//Arduino Uno doesn't have enough SRAM to store 100 samples of IR led data and red led data in 32-bit format
//To solve this problem, 16-bit MSB of the sampled data will be truncated. Samples become 16-bit data.
uint16_t irBuffer[100]; //infrared LED sensor data
uint16_t redBuffer[100];  //red LED sensor data
#else
uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data
#endif

int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int fspo2 = -1;
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

#if SIMULATED_DATA


void initSensor()
{
    // use SIMULATED_DATA, no sensor need to be inited
}

float readTemperature()
{
    return random(20, 30);
}

float readHumidity()
{
    return random(30, 40);
}

#else

static DHT dht(DHT_PIN, DHT_TYPE);
void initSensor()
{
  dht.begin();
  //  Serial.begin(9600);
  Serial.println("Making initial calibrations");

  // Initialize sensor
  if (particleSensor.begin() == false)
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }

  particleSensor.setup(); //Configure sensor. Use 6.4mA for LED drive
   particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0);
// particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);
}

float readTemperature()
{
    return dht.readTemperature();
}

float readHumidity()
{
    return dht.readHumidity();
}

#endif

bool readMessage(int messageId, char *payload)
{
    bufferLength = 100;
    for (byte i = 0 ; i < bufferLength ; i++)
  {
    while (particleSensor.available() == false) //do we have new data?
      particleSensor.check(); //Check the sensor for new data

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample(); //We're finished with this sample so move to next sample

//    Serial.print(F("red="));
//    Serial.print(redBuffer[i]);
//    Serial.print(F(", ir="));
//    Serial.println(irBuffer[i]);
  }
    float temperature = particleSensor.readTemperatureF();
    while(particleSensor.getIR() < 6000){
      Serial.println("Please put your finger on sensor");
    }
    StaticJsonBuffer<MESSAGE_MAX_LEN> jsonBuffer;
    JsonObject &root = jsonBuffer.createObject();
    root["deviceId"] = DEVICE_ID;
    root["messageId"] = messageId;
   // float red = particleSensor.getRed();
   int r=0;
   extTemp = dht.readTemperature();
    extHumid = dht.readHumidity();
   // Serial.print("External Temperature is : ");
  //  Serial.println(extTemp);
   // Serial.print("External Humidity is : ");
 //   Serial.print(extHumid);
   while(r < avgReadNum){ 
    float IR = particleSensor.getIR();
    float green = particleSensor.getGreen();
    
    bool temperatureAlert = false;
    if (checkForBeat(IR) == true)
  {
    long delta = millis() - lastBeat;
    lastBeat = millis();
     beatsPerMinute = 60 / (delta / 1000.0);
     if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
    for (byte i = 25; i < 100; i++)
    {
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }

    //take 25 sets of samples before calculating the heart rate.
    for (byte i = 75; i < 100; i++)
    {
      while (particleSensor.available() == false) //do we have new data?
        particleSensor.check(); //Check the sensor for new data

    //  digitalWrite(readLED, !digitalRead(readLED)); //Blink onboard LED with every data read

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample(); //We're finished with this sample so move to next sample

      //send samples and calculation result to terminal program through UART
//      Serial.print(F("red="));
//      Serial.print(redBuffer[i]);
//      Serial.print(F(", ir="));
//      Serial.print(irBuffer[i]);
//
//      Serial.print(F(", HR="));
//      Serial.print(heartRate);
//
//      Serial.print(F(", HRvalid="));
//      Serial.print(validHeartRate);
//
//      Serial.print(F(", SPO2="));
//      Serial.print(spo2);
//
//      Serial.print(F(", SPO2Valid="));
//      Serial.println(validSPO2);
    if(validSPO2 == 1 && spo2<106 && spo2 > 84)
      fspo2 = spo2;
    }

    //After gathering 25 new samples recalculate HR and SP02
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
      beatsPerMinute = map(beatsPerMinute, 20, 220, 65, 210);
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
      Serial.print("beatAvg is ");
      Serial.println(beatAvg);
      Serial.print("bpm is ");
      Serial.println(beatsPerMinute);
      Serial.print("r is ");
      Serial.println(r);
      beatRet += beatsPerMinute;
      avgRet += beatAvg;
      Serial.print("bpmRet is ");
      Serial.println(beatRet);
       Serial.print("avgRet is ");
      Serial.println(avgRet);
      Serial.print("spo2 is ");
      Serial.println(fspo2);
      delay(4);
       r++;
    }
    }
  }

    // NAN is not the valid json, change it to NULL
//    if (std::isnan(red))
//    {
//        root["red"] = NULL;
//    }
//    else
//    {
//        root["red"] = red;
//       
//    }
    extTemp = dht.readTemperature();
    extHumid = dht.readHumidity();
 //   Serial.print("External Temperature is : ");
  //  Serial.println(extTemp);
  //  Serial.print("External Humidity is : ");
  //  Serial.print(extHumid);
    if (std::isnan(temperature))
    {
        root["red"] = NULL;
    }
    else
    {
        root["red"] = temperature;  
    }
    if (fspo2 == -1)
    {
        root["fspo2"] = NULL;
    }
    else
    {
        root["fspo2"] = fspo2;  
    }
    if (std::isnan(beatRet))
    {
        root["IR"] = NULL;
    }
    else
    {
        root["IR"] = beatRet/avgReadNum;
        beatRet = 0;
    }

    if (std::isnan(avgRet))
    {
        root["green"] = NULL;
    }
    else
    {
        root["green"] = avgRet/avgReadNum;
        avgRet = 0;
    }
    if(beatAvg > 0 && beatsPerMinute > 0) 
    root.printTo(payload, MESSAGE_MAX_LEN);
    if(beatAvg == 0 || beatsPerMinute == 0.0)
    return false;
    return true;
}

void parseTwinMessage(char *message)
{
    StaticJsonBuffer<MESSAGE_MAX_LEN> jsonBuffer;
    JsonObject &root = jsonBuffer.parseObject(message);
    if (!root.success())
    {
        Serial.printf("Parse %s failed.\r\n", message);
        return;
    }

    if (root["desired"]["interval"].success())
    {
        interval = root["desired"]["interval"];
    }
    else if (root.containsKey("interval"))
    {
        interval = root["interval"];
    }
}
