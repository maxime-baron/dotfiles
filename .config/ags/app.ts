import app from "ags/gtk4/app"
import style from "./style.scss"
import NotificationPopup from './widget/NotificationPopup/NotificationPopup'
import NotificationList from './widget/NotificationList/NotificationList'
import MediaPlayerPopup from './widget/MediaPlayer/MediaPlayerPopup'

app.start({
  css: style,
  main() {
    MediaPlayerPopup()
    NotificationList()
    NotificationPopup()
  },
})
