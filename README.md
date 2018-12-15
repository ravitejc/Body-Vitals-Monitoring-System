# Body-Vitals-Monitoring-System
Introduction:
We have used MAX30105 Particle sensor to monitor body vitals like ventricular rate, body temperature and SPO2 through Photoplethysmography (PPG). This project aims at warning individuals whenever that heartrate exceeds the maximum heart rate that a person can have. We take age of the user as input in the web application for this purpose. We calculate Maximum Heart Rate allowed for that age and warn if the current heart rate exceeds that as that can cause tear in muscles of heart. We also calculate peripheral capillary oxygen saturation (spo2) of the person using the same PPG methodology. We calibrate body temperature and provide appropriate suggestions based on its value. We also monitor the current zone of the heart. We also indicate the heart rate zone of the person whose heart rate is being monitored and predict the current physical activity of that person based on this. We also warn individuals with Tachycardia to meet a doctor.
Absorption of light in the blood stream:  
Pulse oximetry is a process where light emitting diodes radiate red and infrared light, which penetrates the skin cells and tissue. Emitted light from the sensor is mostly absorbed by the tissue, blood and bone, the remainder of the light is reflected back to the receiver end of the sensor. The sensor is usually attached to extremities like the finger, toe or ear where the arterial blood is closer to the skin. This reduces the amount of light absorbed by the tissues and get a better reading from the sensor. To isolate the amount of light absorbed in the blood, the sensor only takes the reading where the absorption amount changes in short intervals. This is due to the pulsation of the arteries as the blood is pumped from the heart. The absorption rate at different molecular constitution is shown in Figure:

 
Heart Rate Monitoring:
The heart rate actually means the ventricular rate, which is associated with the patient’s pulse. QRS complex on the ECG is produced by the depolarization of the ventricles. So the rate of QRS complexes are measured to determine the heart rate. Bradycardia is usually defined as a heart rate below 60 beats/min. Tachycardia is usually defined as a heart rate above 100 beats/min. Identification of cardiac rhythm is required for the patients with tachycardia.
We monitor resting heart rate of an individual and warn him/her about tachycardia.
Harvard's Men's Health Watch published an explanation last year that sheds some new light on this matter. A couple of Colorado scientists did some exercise test reality checking and reviewed the results of 18,712 men and women of all ages. Based on this real-life data they came up with a new formula:
Maximum heart rate = 208 - (0.7 x age in years).
Our system warns whenever the heart rate of a person exceeds this which can usually happen due to extreme cardio.
SpO2:
MAX30105 is used in this project as a peripheral capillary oxygen saturation (SpO2) detection sensor. SaO2 is the blood-oxygen saturation reading that indicated the percentage of hemoglobin molecules that are saturated with oxygen in the arterial blood. The determination of SaO2 from pulse oximetry is known as SpO2. SpO2 has a lot of medical significance in the diagnosis of diseases. For a healthy person at sea level, the SpO2 percentage can vary from 96% to 99% and should be above 94% to be considered healthy. At 1600 meters oxygen saturation should be 12 above 92%. If the percentage falls below 90% it can lead to hypoxia, a medical condition which deprives the body or a part of the body of oxygen. Since Irvine is at Sea level, we warn user if SpO2 falls below 96 or raises above 100.

Temperature Sensing:
Human body temperature varies according to age, exertion, infection, sex, time of day, reproductive status of the subject, the place in body at which the measurement is made the subject’s state of consciousness, and emotional state. Usually the body temperature of a normal human ranges from 36.5-37.5 °C (97.7-99.5 °F). Since we are measuring temperature at finger, we would suggest to get layered up if temperature falls below 88°F. We would recommend meeting a doctor if it raises above 101 °F. It could be hyperpyrexia if temperature rises above 104°F. We warn hyperpyrexia and urge user on meeting doctor as early as possible.
Hardware Components

Components Used:
1.	Sparkfun ESP8266 Thing Dev
2.	MAX30105 particle sensor
Architecture:
*WIFI Wireless protocol
*Sensor-Cloud (Architecture 2)

(Individual) Wireless sensor node 		Wi-Fi (Sparkfun ESP8266)


 (End User) Web Application			Cloud services (Microsoft Azure)

PROJECT WORKFLOW
User End:
Setup at the client includes MAX30105 sensor and ESP8266 Thing Dev. This sensor initially asks for user to place finger on sensor and then calibrates heart rate and SpO2 initially. Once calibration is done, sensor continuously monitors Body Temperature (degree Fahrenheit), Ventricular Rate, SpO2 and send that data over cloud to Web Application. We have added this code at the end of the report.
 

Cloud Server (Microsoft Azure):
We are sending data from client’s end to the Azure server, where we have hosted our Web
Application. Our device is registered at the server and using our IOT Hub’s connection key and
Device registration connection key, we are making connection between our local system and
the remote server.
 
Screenshot with Device Details on Azure Cloud.
 
Screenshot with hosted Web Application details on Azure Cloud.
Web Application:
Individual whoever uses our Body Vitals Monitoring System can monitor their vitals at this web application. This shows a lot of information to the user. Below is the information that is displayed:
1.	Graph showing Average Heart Rate in BPM and current Heart Rate in BPM.
 
2.	Graph showing SpO2.
 
3.	Graph showing current body temperature.
 
4.	Resting Heart Rate, Number of times heart rate went beyond max allowed value.
 
5.	Suggestions based on Body temperature.
6.	Suggestions based on current SpO2.
7.	Current body motion state based on Heart Rate
8.	Current Heart Rate Zone based on age.
 
9.	Warning if any vital goes abnormal.
 

Benefits:
Health monitoring is always a must. We are monitoring all the vitals that a patient gets checked once he/she gets admitted to a hospital (Body temperature, SpO2, pulse rate). 
1.	Our Heart Rate Zone and Resting Heart Rate analysis gives user the perfect idea about the state of their Heart and Lungs. This helps every individual in protecting themselves from cardio and pulmonary diseases.
2.	We monitor SpO2 which helps monitoring for Hypoxia which is very vital in preventing failure of body parts.
3.	We suggest the user to reduce cardio if heartrate exceeds the maximum value for his/her age keeping the client’s heart safe.
4.	We also suggest client to get layered up/meet a doctor and monitor hyperpyrexia which is an emergency and needs immediate attention from a medical professional.

References: 
1.	Thesis on Cardiac Health Monitoring
2.	UC Irvine CS244P lab demos
3.	Fitbit Heart Rate Zone Help Article
4.	Harvard's Men's Health Watch publication on Max Heart Rate
5.	MAX30105 Particle and Pulse Ox Sensor Hookup Guide
6.	ESP8266 Thing Hookup Guide
