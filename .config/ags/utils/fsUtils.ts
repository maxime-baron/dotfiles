import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import GLib from "gi://GLib"

export function isIcon(icon?: string | null) {
  const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
  return icon && iconTheme.has_icon(icon)
}

export function fileExists(path: string) {
  return GLib.file_test(path, GLib.FileTest.EXISTS)
}