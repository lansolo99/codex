const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// Send Notification
// Pubsub trigger
exports.sendNotificationsReminder = functions.pubsub.topic('weekx-reminders').onPublish((message) => {
  console.info(message);

  const payload = {
    notification: {
      title: 'Weekx',
      body: 'You have some tasks today!',
      click_action: 'https://weekx.netlify.com',
      icon: 'https://weekx.netlify.com/img/icons/android-chrome-512x512.png'
    }
  }

  console.info(payload)
  return admin.messaging().sendToDevice('cCybL4vS5A8:APA91bGP4PxBviIl8CSrd1vdGJ1j7ca9mNqNm8A9O3tf70iaR9_jVRN77rThKX0Gd1vXGbkqMtKm2jJRQPQeakaBui62INzCFGF048DojZHlpYSWfSnJt67F9AQSEbCErleQnyaCHyIX', payload)
    .then((response) => console.info(response))

})
