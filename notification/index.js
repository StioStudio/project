const img = "../assets/icon/mail.svg";
const text = `HEY! Your task "${"HELLO"}" is now overdue.`;
const notification = new Notification("To do list", { body: text, icon: img,  });

const n = new Notification("Closes when page is visible");
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // The tab has become visible so clear the now-stale Notification.
    n.close();
  }
});
