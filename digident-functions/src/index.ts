import * as functions from "firebase-functions";
import { firebase } from './firebase'
import { readSmartwatchData, refreshToken } from './huawei';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getSmartwatchData = functions.region('europe-west1').https.onCall(async (data, context) => {
    let smartwatch = (await firebase.firestore().doc(`smartwatches/${data.smartwatchId}`).get()).data() as any;
    let readings = await readSmartwatchData(smartwatch.accessToken)
    return readings;
})

export const refreshAccessTokens = functions.region('europe-west1').pubsub.schedule('every 50 minutes').onRun(async (context) => {
    const smartwatches = (await firebase.firestore().collection('smartwatches').get()).docs.map(d => d.data());
    smartwatches.forEach(async smartwatch => {
        if(!smartwatch.initialised) return;
        let newtoken = await refreshToken(smartwatch.refreshToken, smartwatch.clientId, smartwatch.clientSecret)
        console.log(newtoken)
        await firebase.firestore().doc(`smartwatches/${smartwatch.id}`).update({
            accessToken : newtoken
        })
    })
})
