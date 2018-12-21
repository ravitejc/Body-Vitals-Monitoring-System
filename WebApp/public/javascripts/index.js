$(document).ready(function () {
                  var timeData = [],
                  heartRateData = [],
                  threshold = 0,
                  defaultThreshold = 250,
                  initialValues = [],
                  tempData = [],
                  repCount = 0,
                  spo2Data = [],
                  spo2Data1 = [],
                  maxHeartRate = -100000,
                  minHeartRate = 100000,
                  maxTemp = -100000,
                  minTemp = 100000,
                  maxSPO2 = -100000,
                  minSPO2 = 100000,
                  curHealthMsg = "",
                  ageSet = 25,
                  count = 0,
                  colorRed = 0,
                  flag = 0;

                  var data = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'Heart Rate',
                             yAxisID: 'Peaks',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: heartRateData
                             },
                             {
                                fill: false,
                                label: 'BeatsAvg',
                                yAxisID: 'BeatsAvg',
                                borderColor: "rgba(24, 120, 240, 1)",
                                pointBoarderColor: "rgba(24, 120, 240, 1)",
                                backgroundColor: "rgba(24, 120, 240, 0.4)",
                                pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                                pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                                data: spo2Data
                                }
                             ]
                  }
                  
                  var data2 = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'SPO2',
                             yAxisID: 'SPO2',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: spo2Data1
                             }
                             ]
                  }
                  
                  var data3 = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'Temperature',
                             yAxisID: 'Temperature',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: tempData
                             }
                             ]
                  }
                  
                  var basicOption3 = {
                  title: {
                  display: true,
                  text: 'Temperature Real-time Data',
                  fontSize: 20
                  },
                  scales: {
                  yAxes: [{
                          id: 'Temperature',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'Temperature',
                          display: true
                          },
                          position: 'left',
                          }]
                  }
                  }
                  
                  var basicOption2 = {
                  title: {
                  display: true,
                  text: 'SPO2 Real-time Data',
                  fontSize: 20
                  },
                  scales: {
                  yAxes: [{
                          id: 'SPO2',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'SPO2',
                          display: true
                          },
                          position: 'left',
                          }]
                  }
                  }
                  
                  var basicOption = {
                  title: {
                  display: true,
                  text: 'Heart Rate & BeatsAvg Real-time Data',
                  fontSize: 20
                  },
                  scales: {
                  yAxes: [{
                          id: 'Peaks',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'Heart Rate',
                          display: true
                          },
                          position: 'left',
                          },
                          {
                            id: 'BeatsAvg',
                            type: 'linear',
                            scaleLabel: {
                            labelString: 'BeatsAvg',
                            display: true
                            },
                            position: 'right',
                            }]
                  }
                  }
                  
                  //Get the context of the canvas element we want to select
                  var ctx = document.getElementById("myChart").getContext("2d");
                  var ctx2 = document.getElementById("myChart2").getContext("2d");
                  var ctx3 = document.getElementById("myChart3").getContext("2d");
                  var optionsNoAnimation = { animation: false }
                  var myLineChart = new Chart(ctx, {
                                              type: 'line',
                                              data: data,
                                              options: basicOption
                                              });
                  
                  var myLineChart2 = new Chart(ctx2, {
                                              type: 'line',
                                              data: data2,
                                              options: basicOption2
                                              });
                  
                  var myLineChart3 = new Chart(ctx3, {
                                               type: 'line',
                                               data: data3,
                                               options: basicOption3
                                               });
                  
                  var ws = new WebSocket('wss://' + location.host);

                  ws.onopen = function () {
                    console.log('Successfully connect WebSocket');
                  }

                  ws.onmessage = function (message) {
                    console.log('receive message' + message.data);
                    try {
                        curHealthMsg = '';

                        flag = 0;

                        var obj = JSON.parse(message.data);
                        
                        timeData.push(obj.time);

                        heartRateData.push(obj.IR);
                        
                        spo2Data.push(obj.green);
                        tempData.push(obj.red);
                        spo2Data1.push(obj.fspo2);

                        // only keep no more than 50 points in the line chart
                        const maxLen = 50;
                        var len = timeData.length;
                        if (len > maxLen) {
                            timeData.shift();
                            heartRateData.shift();
                            spo2Data.shift();
                            tempData.shift();
                        }
                        
                        myLineChart.update();
                        myLineChart2.update();
                        myLineChart3.update();

                        if (maxHeartRate<obj.IR || maxHeartRate>220){
                            if(obj.IR>220){
                                maxHeartRate = 220;
                            }
                            else{
                                maxHeartRate = obj.IR;
                            }
                            
                        }
                        if (minHeartRate>obj.IR || minHeartRate<65){
                            if(obj.IR<65){
                                minHeartRate = 65;
                            }
                            else{
                                minHeartRate = obj.IR;
                            }
                        }
                        
                        if (maxSPO2<obj.fspo2 || maxSPO2>105){
                            if(obj.fspo2>105){
                                maxSPO2 = 105;
                            }
                            else{
                                maxSPO2 = obj.fspo2;
                            }
                            
                        }
                        if (minSPO2>obj.fspo2 || minSPO2<85){
                            if(obj.fspo2<85){
                                minSPO2 = 85;
                            }
                            else{
                                minSPO2 = obj.fspo2;
                            }
                            
                        }
                        
                        if (maxTemp<obj.red || maxTemp > 101){
                            if(obj.red>101){
                                maxTemp = 101;
                            }
                            else{
                                maxTemp = obj.red;
                            }
                            
                        }
                        if (minTemp>obj.red || minTemp < 78){
                            if(obj.red<78){
                                minTemp = 78;
                            }
                            else{
                                minTemp = obj.red;
                            }
                            
                        }

                        ageSet = document.getElementById("demo").innerHTML;

                        if(obj.IR>=152){
                            count = count+1;
                        }

                        $("#label1").html(maxHeartRate);
				        $("#label2").html(minHeartRate);
                        $("#label3").html(maxSPO2);
                        $("#label4").html(minSPO2);
				        $("#label5").html(maxTemp);
                        $("#label6").html(minTemp);
                        $("#label7").html(count);

                        var l1 = document.getElementById("label1");
                        var l2 = document.getElementById("label2");
                        var l3 = document.getElementById("label3");
                        var l4 = document.getElementById("label4");
                        var l5 = document.getElementById("label5");
                        var l6 = document.getElementById("label6");
                        colorRed = 0;
                        var l7 = document.getElementById("curHealth");

                        if (maxHeartRate>152){
                            l1.style.backgroundColor = "red";
                            flag = 1;
                        }
                        else{
                            l1.style.backgroundColor = "white";
                        }

                        if (maxSPO2>100){
                            l3.style.backgroundColor = "red";
                            flag = 1;
                        }
                        else{
                            l1.style.backgroundColor = "white";
                        }

                        if (minSPO2<95){
                            l4.style.backgroundColor = "red";
                            flag = 1;
                        }
                        else{
                            l1.style.backgroundColor = "white";
                        }

                        if (maxTemp>101){
                            l5.style.backgroundColor = "red";
                            flag = 1;
                        }
                        else if(minTemp<78){
                            l6.style.backgroundColor = "red";
                            flag = 1;
                        }
                        else{
                            l5.style.backgroundColor = "white";
                            l6.style.backgroundColor = "white";
                        }      
                        
                        if(obj.IR>=(208-(0.7 * parseInt(ageSet)))){
                            curHealthMsg = curHealthMsg + "<br/>Heart Rate according to your age is above the maximum heart rate (" + obj.IR + ")";
                            flag = 1;
                            colorRed = 1;
                        }
                        else{
                            curHealthMsg = curHealthMsg + "<br/>Heart Rate according to your age is in normal range (" + obj.IR + ")";
                        }
                        

                        if(obj.IR<=89){
                            curHealthMsg = curHealthMsg + "<br/><br/>Heart Rate range: Normal (" + obj.IR + ")";
                        }
                        else if(obj.IR<=110){
                            curHealthMsg = curHealthMsg + "<br/><br/>Heart Rate range: Out of Zone (" + obj.IR + ")";
                        }
                        else if(obj.IR<=135){
                            curHealthMsg = curHealthMsg + "<br/><br/>Heart Rate range: Fat Burn Zone (" + obj.IR + ")";
                        }
                        else if(obj.IR<=152){
                            curHealthMsg = curHealthMsg + "<br/><br/>Heart Rate range: Cardio Zone (" + obj.IR + ")";
                        }
                        else{
                            curHealthMsg = curHealthMsg + "<br/><br/>Heart Rate range: Peak Zone (" + obj.IR + ")";
                            colorRed = 1;
                        }

                        if(obj.fspo2>100){
                            curHealthMsg = curHealthMsg + "<br/><br/>SPO2 range: Reach out to doctor!! (" + obj.fspo2 + ")";
                            flag = 1;
                            colorRed=1;
                        }
                        else if(obj.fspo2<=95){
                            curHealthMsg = curHealthMsg + "<br/><br/>SPO2 range: Potential Hypoxia (" + obj.fspo2 + ")";
                            flag = 1;
                            colorRed=1;
                        }
                        else{
                            curHealthMsg = curHealthMsg + "<br/><br/>SPO2 is in normal range (" + obj.fspo2 + ")";
                        }

                        if(obj.red<78){
                            curHealthMsg = curHealthMsg + "<br/><br/>Temperature range: Warm up warning (" + obj.red + ")";
                            flag=1;
                            colorRed=1;
                        }
                        else if(obj.red>=101 && obj.red<=104){
                            curHealthMsg = curHealthMsg + "<br/><br/>Temperature range: Fever (" +  obj.red + ")";
                            flag=1;
                            colorRed=1;
                        }
                        else if(obj.red>104){
                            curHealthMsg = curHealthMsg + "<br/><br/>Temperature range: Hyperpyrexia, Reach out to doctor!! (" +  obj.red + ")";
                            flag=1;
                            colorRed=1;
                        }
                        else{
                            curHealthMsg = curHealthMsg + "<br/><br/>Temperature range: Normal Range (" + obj.red + ")";
                        }

                        $("#curHealth").html(curHealthMsg);
                        if (flag==1){
                            email();
                        }

                        if(colorRed==1){
                            l7.style.backgroundColor = "red";
                        }
                        else{
                            l7.style.backgroundColor = "white";
                        }
                
                    } catch (err) {
                        console.error(err);
                    }
                  }
});
