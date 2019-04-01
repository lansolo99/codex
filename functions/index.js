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
    return admin.messaging().sendToDevice('fedcKkCXKns:APA91bHhX5GfHc_slAJCgIhkt7qetYprdoEI3vm2pqrX5VvmOByUz0CKuxllHCjV-pcBhNqmjEXzZXEVff9kd9KwwEBisYdA0NPDWPWOGRONESPUnvqkbEk3jY8S0wcjh71lrURpQRzO', payload)
      .then((response) => console.info(response))

  })
