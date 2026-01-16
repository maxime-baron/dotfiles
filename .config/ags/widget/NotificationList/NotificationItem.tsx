import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Adw from "gi://Adw"
import GLib from "gi://GLib"
import AstalNotifd from "gi://AstalNotifd"
import Pango from "gi://Pango"

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

export default function NotificationItem({ notification: n }: NotificationProps) {
  /**
   * Handles mouse click events on the notification.
   * Left click invokes the default action, middle click dismisses the notification.
   */
  const clickHanlder = (source: Gtk.GestureClick) => {
    const button = source.get_current_button()

    switch (button) {
      case Gdk.BUTTON_PRIMARY: // Left click
        n.invoke("default")
        break

      case Gdk.BUTTON_MIDDLE: // Middle click
        n.dismiss()
        break

      default:
        break
    }
  }

  return (
      <Adw.Clamp maximumSize={258}>
        <box
          widthRequest={258}
          class={`Notification ${urgency(n)}`}
          orientation={Gtk.Orientation.VERTICAL}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
        >
          <Gtk.GestureClick button={0} onPressed={clickHanlder} />
          <box class="header">
            {(n.appIcon || isIcon(n.desktopEntry) || fileExists(n.image)) && (
              <image
                class="app-icon"
                visible={Boolean(n.appIcon || n.desktopEntry || n.image)}
                iconName={n.appIcon || n.desktopEntry}
                {...(!n.appIcon &&
                !isIcon(n.desktopEntry) &&
                fileExists(n.image)
                  ? { file: n.image }
                  : {})}
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
