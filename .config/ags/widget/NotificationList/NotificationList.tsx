import { Astal, Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import { createState, For, onCleanup } from "gnim"
import NotificationItem from '../NotificationList/NotificationItem'
import app from 'ags/gtk4/app'

export default function NotificationList() {
  const notifd = Notifd.get_default()
  
  
  const [notifications, setNotifications] = createState<Notifd.Notification[]>(
    notifd.notifications
  )
  
  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
    const notification = notifd.get_notification(id)
    if (!notification) return
    
    if (replaced) {
      setNotifications((ns) => 
        ns.map((n) => n.id === id ? notification : n)
    )
  } else {
    setNotifications((ns) => [notification, ...ns])
  }
  console.log(notifications)
  })

  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })

  onCleanup(() => {
    notifd.disconnect(notifiedHandler)
    notifd.disconnect(resolvedHandler)
  })

  return (
    <window
      name="notification-list"
      application={app}
      visible={false}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      class="notification-list"
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <For each={notifications}>
          {(notification) => <NotificationItem notification={notification} />}
        </For>
      </box>
    </window>
  )
}
