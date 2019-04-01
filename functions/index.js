const functions = require('firebase-functions')
const admin = require('firebase-admin')
// admin.initializeApp(functions.config().firebase)
admin.initializeApp()

// Send Notification
exports.sendNotifications = functions.https.onCall((data, context) => {

  const payload = {
    notification: {
      title: 'Notification title',
      body: 'Notification info',
      icon: 'http://i.imgur.com/image.png',
      click_action: 'https://weekx.netlify.com'
    }
  }

  console.info(payload)

  return admin.messaging().sendToDevice(data, payload)

})
