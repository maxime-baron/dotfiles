import app from "ags/gtk4/app"
import style from "./style.scss"
import NotificationPopup from './widget/NotificationPopup/NotificationPopup'
import NotificationList from './widget/NotificationList/NotificationList'

app.start({
  css: style,
  main() {
    NotificationList()
    NotificationPopup()
  },
})
