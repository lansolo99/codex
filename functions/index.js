// Imports
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getHours = require('date-fns/get_hours')
const getISODay = require('date-fns/get_iso_day')

admin.initializeApp(functions.config().firebase)

// Utils
const isoToWeekDays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
}
const getStringFromIsoDay = isoDay => {
  return isoToWeekDays[isoDay]
}

console.info('getStringFromIsoDay = ' + getStringFromIsoDay(getISODay(Date.now())))
// Send notifications reminder
exports.sendNotificationsReminder = functions.pubsub.topic('weekx-reminders').onPublish((message) => {
  console.info(message)

  // Filter notification elligible users test
  return admin.firestore()
    .collection('users')
    .get()
    .then(users => {

      /*=============================================
                          LOOP
      =============================================*/

      users.forEach(doc => {
        // If user has a non-empty token
        if (doc.data().profile.token && doc.data().profile.token !== '') {
          console.info('user has token')

          // If user has tasks
          if (doc.data().tasks) {
            console.info('user has tasks')
            // Hour test
            const currentHour = getHours(new Date(Date.now()))
            console.info('currentHour = ' + currentHour)
            const currentUserDefinedHour = doc.data().profile.notifications.dailyTaskReminder.time
            console.info('currentUserDefinedHour = ' + currentUserDefinedHour)
            if (currentHour === currentUserDefinedHour) {
              console.info(`a user has defined an hour that match the current one which is ${currentHour}`)
            }
            // End hour test

            // User defined hour is the right one
            if (currentHour === currentUserDefinedHour) {
              const dailyTasks = Object.keys(doc.data().tasks)
                .map(e => doc.data().tasks[e])
                .filter(task => {
                  return (task.schedule.periodicity === 'Weekly' &&
                      task.schedule.weekly === 'Everyday') ||
                    (task.schedule.periodicity === 'On specific days' &&
                      task.schedule.specificDays.find(v => {
                        return v === getStringFromIsoDay(getISODay(Date.now()))
                      })) ||
                    (task.schedule.periodicity === 'Once' &&
                      task.schedule.once === 'single')
                })
                .filter(task => {
                  return task.checked === false
                })

              if (dailyTasks.length) {
                // Send notification
                console.log('user has daily tasks')
                let message = {
                  data: {
                    score: '850',
                    time: '2:45'
                  },
                  token: doc.data().profile.token
                }
                admin.messaging().send(message)
              }
            } // End right hour
          } // End has task
        } else {
          console.log('no token')
        }
      })
      return
    })
})
