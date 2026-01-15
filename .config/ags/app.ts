import app from "ags/gtk4/app"
import style from "./style.scss"
import NotificationPopups from "./widget/Notification/NotificationPopups"

app.start({
  css: style,
  main() {
    NotificationPopups()
  },
})
