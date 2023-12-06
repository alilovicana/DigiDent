import fetch from 'cross-fetch';

async function refreshToken(refreshToken : string, clientId : string, clientSecret : string){
    let response = await fetch('https://oauth-login.cloud.huawei.com/oauth2/v3/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: `grant_type=refresh_token&client_id=${encodeURIComponent(clientId)}`
            + `&client_secret=${encodeURIComponent(clientSecret)}&`
            + `refresh_token=${encodeURIComponent(refreshToken)}`
    })
    let data = await response.json() as any;
    return data.access_token;
    
}


async function readSmartwatchData(accessToken : string){

    let now = new Date().getTime();
    let tenMinutes = 10*60*1000
    let tenMinutesAgo = now - tenMinutes;

    let requestBody = { "polymerizeWith": [ 
        { "dataTypeName": "com.huawei.instantaneous.heart_rate" },  
        { "dataTypeName": "com.huawei.instantaneous.spo2" }, 
        { "dataTypeName": "com.huawei.instantaneous.skin.temperature"}],
        "endTime": now,
        "startTime": tenMinutesAgo,
        "groupByTime": { "duration": tenMinutes}
    }
    console.log(now);
    console.log(tenMinutesAgo)
    let requestHeaders = {
        'Authorization' : 'Bearer ' + accessToken,
        'Content-Type' : 'application/json'
    }

    let response = await fetch('https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:polymerize', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers : requestHeaders
    });
    console.log(requestBody)
    console.log(requestHeaders)
    let data = await response.json();

    console.log(data);
    if(data.error) throw("Unauthorized");

    let latestReadings = data.group[0].sampleSet;
    console.log(latestReadings)
    console.log(latestReadings[0].samplePoints)

    let skinTemperature = latestReadings[2].samplePoints[0] ? latestReadings[2].samplePoints[0].value[0].floatValue : -1;

    let instantDataUrl = 'https://health-api.cloud.huawei.com/healthkit/v1/sampleSets/latestSamplePoint?dataType=com.huawei.instantaneous.heart_rate&dataType=com.huawei.instantaneous.spo2'
    response = await fetch(instantDataUrl, {
        method: 'GET',
        headers: requestHeaders
    })
    data = await response.json();
    console.log(data);
    if(data.error) throw("Unauthorized");

    let heartRate = -1;
    try {
        heartRate = data.samplePoints["com.huawei.instantaneous.heart_rate"].value[0].floatValue;
    } catch { }

    let bloodOxygenation = -1;
    try {
        bloodOxygenation = data.samplePoints["com.huawei.instantaneous.spo2"].value[0].floatValue;
    } catch { }

    return { heartRate, bloodOxygenation, skinTemperature }
}

export { refreshToken, readSmartwatchData }