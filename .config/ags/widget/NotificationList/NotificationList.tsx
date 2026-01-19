import { Astal, Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import { createState, For, onCleanup } from "gnim"
import NotificationItem from "../NotificationList/NotificationItem"
import app from "ags/gtk4/app"

export default function NotificationList() {
  const notifd = Notifd.get_default()

  const [notifications, setNotifications] = createState<Notifd.Notification[]>(
    notifd.notifications.sort((a, b) => b.time - a.time),
  )

  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
    const notification = notifd.get_notification(id)
    if (!notification) return

    if (replaced) {
      setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)))
    } else {
      setNotifications((ns) => [notification, ...ns])
    }
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
      namespace="notification-list"
      application={app}
      visible={false}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      class="notification-window"
      widthRequest={245}
    >
      <box
        class="notification-container"
        orientation={Gtk.Orientation.VERTICAL}
      >
        <box class="header">
          <label
            class="title"
            label="Notifications"
            halign={Gtk.Align.START}
            hexpand={true}
          />
          <switch 
            active={!notifd.dontDisturb}
            onStateSet={(_source, state) => notifd.set_dont_disturb(!notifd.dontDisturb)}
          />
        </box>
        <Gtk.Separator
          orientation={Gtk.Orientation.HORIZONTAL}
          class="separator"
        />
        <scrolledwindow
          maxContentHeight={260}
          propagateNaturalHeight={true}
          hscrollbarPolicy={Gtk.PolicyType.NEVER}
          class="scroll"
        >
          <box orientation={Gtk.Orientation.VERTICAL} class="notification-list">
            <For each={notifications}>
              {(notification, index) => (
                <box orientation={Gtk.Orientation.VERTICAL}>
                  <NotificationItem notification={notification} />
                  {index() + 1 !== notifd.notifications.length  && <Gtk.Separator
                    orientation={Gtk.Orientation.HORIZONTAL}
                    class="separator"
                  />}
                </box>
              )}
            </For>
          </box>
        </scrolledwindow>
      </box>
    </window>
  )
}
