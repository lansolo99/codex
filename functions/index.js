// Imports
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const getHours = require('date-fns/get_hours')
const setHours = require('date-fns/set_hours')
const differenceInSeconds = require('date-fns/difference_in_seconds')
const endOfToday = require('date-fns/end_of_today')
const getISODay = require('date-fns/get_iso_day')
const {
  convertToLocalTime
} = require('date-fns-timezone/dist/convertToLocalTime')

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
        if (doc.data().profile.notifications.token && doc.data().profile.notifications.token !== '') {
          console.info('user has token')

          // If user has tasks
          if (doc.data().tasks) {
            console.info('user has tasks')

            const serverHour = getHours(new Date(Date.now()))
            const userDefinedHour = doc.data().profile.notifications.dailyTaskReminder.time
            const userPushTTL = differenceInSeconds(new Date(Date.now()), endOfToday())
            const userDate = setHours(new Date(Date.now()), userDefinedHour)
            const userTimeZone = doc.data().profile.notifications.timezone
            const userConvertedDate = convertToLocalTime(userDate, {
              timeZone: userTimeZone
            })
            const userConvertedToServerHour = getHours(userConvertedDate)
            console.log('serverHour = ' + serverHour)
            console.log('userConvertedToServerHour = ' + userConvertedToServerHour)

            if (serverHour === userConvertedToServerHour) {
              console.info(`a user has defined an hour that match the current one which is ${serverHour}`)
            }
            // End hour test

            // User defined hour is the right one
            if (serverHour === userConvertedToServerHour) {
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
                var plural = ""
                var countDailyTasks = dailyTasks.length
                if (dailyTasks.length > 1) {
                  plural = "s"
                } else {
                  plural = ""
                }

                // Admin SDK
                let message = {
                  data: {
                    title: 'Weekx',
                    body: `You have ${countDailyTasks} task${plural} today!'`
                  },
                  token: doc.data().profile.notifications.token,
                  "webpush": {
                    "headers": {
                      "TTL": userPushTTL
                    },
                    "notification": {
                      "title": "Weekx",
                      "body": `You have ${countDailyTasks} task${plural} today!'`,
                      "icon": 'https://weekx.netlify.com/img/icons/android-chrome-512x512.png',
                      "click_action": "https://weekx.netlify.com",
                      "badge": 'https://weekx.netlify.com/img/icons/notification-badge.png'
                    },
                    "fcm_options": {
                      "link": "https://weekx.netlify.com"
                    }
                  }
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
