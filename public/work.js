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
