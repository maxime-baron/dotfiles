import GLib from "gi://GLib"

export function time(time: number, format = "%H:%M") {
  return GLib.DateTime.new_from_unix_local(time).format(format)!
}

export function getTimeFormat(timestamp: number): string {
  const date = GLib.DateTime.new_from_unix_local(timestamp);
  const now = GLib.DateTime.new_now_local();
  
  const daysDiff = now.difference(date) / (1000000 * 60 * 60 * 24);
  
  if (daysDiff < 1) {
    return "%H:%M";
  } else if (daysDiff < 2) {
    return "Yesterday";
  } else if (daysDiff < 7) {
    return "%A";
  } else {
    return "%d %b";
  }
}