self.addEventListener("push", (e) => {
  const data = e.data.json();
  const date = new Date(data.date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString();
  const formattedMinutes = minutes.toString().padStart(2, "0");

  const options = {
    body: data.title,
    icon: "/list.png",
    tag: "unique-notification-tag",
  };
  e.waitUntil(
    self.registration.showNotification(
      `Pending task: ${formattedHours}:${formattedMinutes} ${ampm}`,
      options
    )
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  let redirectUrl = event.currentTarget.registration.scope;
  if (redirectUrl.endsWith("/")) {
    redirectUrl = redirectUrl.slice(0, -1);
  }
  if (redirectUrl) {
    event.waitUntil(
      (async function () {
        const allClients = await clients.matchAll({
          includeUncontrolled: true,
        });
        let chatClient;
        for (let i = 0; i < allClients.length; i++) {
          let client = allClients[i];
          if (client["url"].indexOf(redirectUrl) >= 0) {
            client.focus();
            chatClient = client;
            break;
          }
        }
        if (chatClient == null || chatClient == "undefined") {
          chatClient = clients.openWindow(redirectUrl);
          return chatClient;
        }
      })()
    );
  }
});
