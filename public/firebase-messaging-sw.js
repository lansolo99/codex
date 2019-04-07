// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close()
//   event.waitUntil(self.clients.openWindow('https://weekx.netlify.com'))
// })

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '545270095530'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  var notificationTitle = 'Weekx'
  var notificationOptions = {
    body: payload.data.body,
    icon: 'https://weekx.netlify.com/img/icons/android-chrome-512x512.png',
    click_action: 'https://weekx.netlify.com'
  }

  return self.registration.showNotification(notificationTitle,
    notificationOptions)
})
