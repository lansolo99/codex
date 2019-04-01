const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
//admin.initializeApp()

// Send Notification
exports.sendNotifications = functions.firestore
  .document('users/{userID}')
  .onWrite((change, context) => {
    //exports.sendNotifications = functions.https.onCall((data, context) => {
    console.info(change);

    const payload = {
      notification: {
        title: 'Notification title',
        body: 'Notification info',
        icon: 'http://i.imgur.com/image.png',
        click_action: 'https://weekx.netlify.com'
      }
    }

    console.info(payload)
    return admin.messaging().sendToDevice('fVyaCagfOqU:APA91bE9fRiT-mqzxS_wlJjnhvSMPduJ77jKnXRL0_nQsfDeRO8P0v2QUEz6SfgCXGYDB_jGoxM2e59KisNsNJdCyJ-KDguqi6JKwtik09PB08C82h3AjVYhISImistbMIYx81ZUkqOm', payload)
      .then((response) => console.info(response))

  })
