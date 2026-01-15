import app from "ags/gtk4/app"
import style from "./style.scss"
import NotificationPopup from './widget/NotificationPopup/NotificationPopup'

app.start({
  css: style,
  main() {
    NotificationPopup()
  },
})
