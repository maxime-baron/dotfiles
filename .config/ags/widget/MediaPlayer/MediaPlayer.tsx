import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Adw from "gi://Adw"
import Mpris from "gi://AstalMpris"
import Pango from "gi://Pango"
import { fileExists} from '../../utils/fsUtils'
import GLib from 'gi://GLib?version=2.0'
import { createBinding } from 'gnim'
import app from 'ags/gtk4/app'

interface NotificationProps {
  mediaPlayer: Mpris.Player
}

const iconPath = GLib.get_home_dir() + "/Documents/Projects/dotfiles/.config/waybar/icons/media-player/"

export default function MediaPlayer({ mediaPlayer: mp }: NotificationProps) {
  const playbackStatus = createBinding(mp, "playbackStatus");
  const position = createBinding(mp, "position");
  const length = createBinding(mp, "length");

  return (
      <Adw.Clamp maximumSize={258}>
        <box
          widthRequest={300}
          class="media-player"
          orientation={Gtk.Orientation.VERTICAL}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
        >
          {/* <Gtk.GestureClick button={0} onPressed={clickHanlder} />
          <Gtk.EventControllerMotion onEnter={() => stopTimeout()} onLeave={() => startTimeout()}/> */}
          <box spacing={16}>
            <box class="track-data" hexpand={true} spacing={8}>
              {(fileExists(mp.get_cover_art())) && (
                <image
                  class="cover"
                  visible={Boolean(mp.get_cover_art())}
                  file={mp.get_cover_art()}
                  pixelSize={48}
                  overflow={Gtk.Overflow.HIDDEN}
                />
              )}
              <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} spacing={2}>
                <label
                  class="title"
                  halign={Gtk.Align.START}
                  ellipsize={Pango.EllipsizeMode.END}
                  label={mp.get_title() || "Unknown"}
                />
                <label
                  class="artist"
                  halign={Gtk.Align.START}
                  ellipsize={Pango.EllipsizeMode.END}
                  label={mp.get_artist() || "Unknown"}
                />
              </box>
            </box>
            <box class="track-actions" hexpand={false}>
              <button onClicked={()=>mp.previous()}><image class="track-action" file={`${iconPath}media-player-backward.svg`} pixelSize={20}/></button>
              <button onClicked={()=>mp.play_pause()}><image class="track-action" file={`${iconPath}${playbackStatus() === Mpris.PlaybackStatus.PLAYING ? 'media-player-pause.svg' : 'media-player-resume.svg'}`} pixelSize={20}/></button>
              <button onClicked={()=>mp.next()}><image class="track-action" file={`${iconPath}media-player-forward.svg`} pixelSize={20}/></button>
            </box>
          </box>
          <slider
            visible={app.get_window("mediaplayer-popup")?.isActive}
            orientation={Gtk.Orientation.HORIZONTAL}
            hexpand={true}
            value={position}
            min={0}
            max={length}
            step={5}
            onChangeValue={(_, __, value) => {mp.position = value; return false}}
          />
        </box>
      </Adw.Clamp>
  )
}
