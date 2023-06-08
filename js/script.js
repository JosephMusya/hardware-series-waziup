/*
Waziup API documentation ->   https://api.waziup.io/docs/

Waziup cloud dashboard   ->   https://dashboard.waziup.io

*/

console.log("Hardware series workshop...")

//Set your device ID
const deviceID = "6482372168f3190729fdbcde"

//API definition
const baseUrl = 'https://api.waziup.io/api/v2'


let temperature = "---";

//Username for the cloud (email)
const username = "muciajoe@gmail.com"

//MQTT subscription
function mqttSubscription(device) {
    var reconnectTimeout = 2000;
    var mqtt = new window['Paho'].MQTT.Client("api.waziup.io", Number(443), "/websocket", "clientjs");
    var options = {
        useSSL: true,
        timeout: 5,
        onSuccess: onConnect,
        onFailure: onFailure
    };

    mqtt.connect(options)
    mqtt.onMessageArrived = onMessageArrived;

    async function getData(url) {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)         
    }

    //Device connected succesfully
    function onConnect() {
        console.log("MQTT Connected!")
        const baseUrl = "devices/" + deviceID
        mqtt.subscribe(baseUrl+ "/#")
        console.log("Subscribed to: ", device.name)
    }

    //Device failed to connect
    function onFailure(message) {
        console.log("Failed: ", message);
        setTimeout(window['MQTTconnect'], reconnectTimeout);
    }

    //Some updates occured on the device
    function onMessageArrived(msg) {
        const val = (JSON.parse(msg.payloadString).value)
        document.getElementById("temperature").innerHTML = val + " &degC"                                  
        console.log(JSON.parse(msg.payloadString))
    }
}

//Fetch available devices
async function getDevice(id) {

    const res = await fetch(
        `https://api.waziup.io/api/v2/devices/${id}?q=owner==` + username,
    );

    const data = await res.json();
    const sensors = data.sensors
    
    //Set the current temperature value
    sensors.map((sensor)=>{
        temperature = sensor.value.value
        document.getElementById("temperature").innerHTML = temperature + " &degC"              
    })

    return data
}

//Get devices and subscribe
getDevice(deviceID).then(device=>{    
    mqttSubscription(device)
})