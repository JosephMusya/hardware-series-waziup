console.log("Hardware series workshop...")

//API definition
const baseUrl = 'https://api.waziup.io/api/v2'

//Username for the cloud
const username = "muciajoe@gmail.com"

//cloudurl
//https://dashboard.waziup.io/


//MQTT subscription
function mqttSubscription(devices) {
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
        return devices.map((device) => {
            const deviceId = device.id
            const baseUrl = "devices/" + deviceId
            device.sensors.map(sensor => {
                const sensorUrl = baseUrl + "/sensors/" + sensor.id
                mqtt.subscribe(baseUrl + "/#")
                console.log("Subscribed to sensor ->", sensor.name)
            })
        })
    }

    //Device failed to connect
    function onFailure(message) {
        console.log("Failed: ", message);
        setTimeout(window['MQTTconnect'], reconnectTimeout);
    }

    //Some updates occured on the device
    function onMessageArrived(msg) {
        const val = (JSON.parse(msg.payloadString).value)
        console.log(val)                                   
    }
}

//Fetch available devices
async function getDevices() {
    const res = await fetch(
        'https://api.waziup.io/api/v2/devices?q=owner==' + username,
    );
    const data = await res.json();
    data.splice(0, 1);

    return data
}

getDevices().then(devices=>{    
    mqttSubscription(devices)
})
