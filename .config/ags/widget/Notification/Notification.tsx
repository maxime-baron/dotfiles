import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Adw from "gi://Adw"
import GLib from "gi://GLib"
import AstalNotifd from "gi://AstalNotifd"
import Pango from "gi://Pango"
import { onCleanup } from 'gnim'

function isIcon(icon?: string | null) {
  const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
  return icon && iconTheme.has_icon(icon)
}

function fileExists(path: string) {
  return GLib.file_test(path, GLib.FileTest.EXISTS)
}

function time(time: number, format = "%H:%M") {
  return GLib.DateTime.new_from_unix_local(time).format(format)!
}

function urgency(n: AstalNotifd.Notification) {
  const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency
  switch (n.urgency) {
    case LOW:
      return "low"
    case CRITICAL:
      return "critical"
    case NORMAL:
    default:
      return "normal"
  }
}

interface NotificationProps {
  notification: AstalNotifd.Notification
}

export default function Notification({ notification: n }: NotificationProps) {
  const timeoutDuration = n.urgency === AstalNotifd.Urgency.CRITICAL ? 5 : 3 // 5s for critical, 3s for others

  // Timeout to automatically close the notification
  const timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, timeoutDuration, () => {
    n.dismiss()
    return GLib.SOURCE_REMOVE
  })

  return (
    <Adw.Clamp maximumSize={258}>
      <box
        widthRequest={258}
        class={`Notification ${urgency(n)}`}
        orientation={Gtk.Orientation.VERTICAL}
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
      >
        <Gtk.GestureClick onPressed={() => n.invoke("default")} />
        <box class="header">
          {(n.appIcon || isIcon(n.desktopEntry) || fileExists(n.image)) && (
            <image
              class="app-icon"
              visible={Boolean(n.appIcon || n.desktopEntry || n.image)}
              iconName={n.appIcon || n.desktopEntry}
              {...(!n.appIcon && !isIcon(n.desktopEntry) && fileExists(n.image) ? { file: n.image } : {})}
            />
          )}
          <label
            class="summary"
            halign={Gtk.Align.START}
            ellipsize={Pango.EllipsizeMode.END}
            label={n.summary || "Unknown"}
          />
          <label
            class="time"
            hexpand
            halign={Gtk.Align.END}
            label={time(n.time)}
          />
        </box>
        <box class="content">
          <box orientation={Gtk.Orientation.VERTICAL}>
            {n.body && (
              <label
                class="body"
                ellipsize={Pango.EllipsizeMode.END}
                lines={2}
                xalign={0}
                wrap
                label={n.body}
              />
            )}
          </box>
        </box>
      </box>
    </Adw.Clamp>
  )
}