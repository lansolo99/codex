const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getHours = require('date-fns/get_hours')
const getISODay = require('date-fns/get_iso_day')

admin.initializeApp(functions.config().firebase)

const isoToWeekDays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
}

const isoDay = getISODay(new Date(Date.now()))
const getStringFromIsoDay = isoDay => {
  return isoToWeekDays[isoDay]
}


// Send Notification
// Pubsub trigger
exports.sendNotificationsReminder = functions.pubsub.topic('weekx-reminders').onPublish((message) => {
  console.info(message)

  const payload = {
    notification: {
      title: 'Weekx',
      body: 'You have some task(s) due today!',
      //body: elligibleUsers,
      click_action: 'https://weekx.netlify.com',
      icon: 'https://weekx.netlify.com/img/icons/android-chrome-512x512.png'
    }
  }


  // Filter notification elligible users test
  return admin.firestore()
    .collection('users')
    .get()
    .then(users => {

      let elligibleUsers = []

      users.forEach(doc => {
        // If user has a non-empty token
        if (doc.data().profile.token && doc.data().profile.token !== '') {
          console.log('has token')
          console.info('has token')
          const userToken = doc.data().profile.token
          // If user has tasks
          if (doc.data().tasks) {
            console.log('user has tasks')

            const currentHour = getHours(new Date(Date.now()))
            console.info('currentHour = ' + currentHour)
            const currentUserDefinedHour = doc.data().profile.notifications.dailyTaskReminder.time
            if (currentHour === currentUserDefinedHour) {
              console.info(`a user has defined an hour that match the current one which is ${currentHour}`)
            }

            const dailyTasks = Object.keys(doc.data().tasks)
              .map(e => doc.data().tasks[e])
              .filter(task => {
                return (task.schedule.periodicity === 'Weekly' &&
                    task.schedule.weekly === 'Everyday') ||
                  (task.schedule.periodicity === 'On specific days' &&
                    task.schedule.specificDays.find(v => {
                      return v === getStringFromIsoDay(this.time.isoDay)
                    })) ||
                  (task.schedule.periodicity === 'Once' &&
                    task.schedule.once === 'single')
              })

            if (dailyTasks.length) {
              console.log('user has daily tasks')
              elligibleUsers.push(userToken)
            }
          }
        } else {
          console.log('no token')
        }
      })

      return admin.messaging().sendToDevice(elligibleUsers, payload)
      //return admin.messaging().sendToDevice('cCybL4vS5A8:APA91bGP4PxBviIl8CSrd1vdGJ1j7ca9mNqNm8A9O3tf70iaR9_jVRN77rThKX0Gd1vXGbkqMtKm2jJRQPQeakaBui62INzCFGF048DojZHlpYSWfSnJt67F9AQSEbCErleQnyaCHyIX', payload)


    })




})
