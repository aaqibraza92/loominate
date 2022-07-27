/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// importScripts("https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/9.4.1/firebase-messaging.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.4.1/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.4.1/firebase-messaging-compat.js"
// );

// const firebaseConfig = {
//   apiKey: "AIzaSyBL9_j6L59vQhwCVx2SR5FiGHCNfHdyrjI",
//   authDomain: "loominate-2021.firebaseapp.com",
//   databaseURL:
//     "https://loominate-2021-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "loominate-2021",
//   storageBucket: "loominate-2021.appspot.com",
//   messagingSenderId: "951207115901",
//   appId: "1:951207115901:web:ec068d1138c404064cc514",
// };

// // eslint-disable-next-line no-undef
// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// // eslint-disable-next-line no-undef
// const messaging = firebase.messaging();

try {
  self.addEventListener("push", function (event) {
    if (Notification.permission === "granted") {
      console.log("onBackgroundMessage", event);
      try {
        var data = event.data.json();
        var title = data.notification.title || "Loominate";
        var body = data.notification.body || "No message";
        const options = {
          body: body,
          tag: data.notification.tag,
          icon: "/logo192.png",
          requireInteraction: true,
        };
        event.waitUntil(self.registration.showNotification(title, options));
      } catch (error) {
        console.log(error);
      }
    }
  });

  function openPushNotification(event) {
    console.log(
      "[Service Worker] Notification click Received.",
      event.notification.data
    );
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
  }

  self.addEventListener("notificationclick", openPushNotification);
} catch (error) {
  console.log(error);
}
