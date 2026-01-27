import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Mpris from "gi://AstalMpris"
import { createBinding, For, createState, onCleanup, With } from "ags"
import MediaPlayer from './MediaPlayer'
import GLib from 'gi://GLib'

const TIMEOUT_DURATION = 3

export default function MediaPlayerPopup() {
  const mpris = Mpris.get_default()

  const [player, setPlayer] = createState<Mpris.Player | undefined>(undefined)
  const [visibility, setVisibility] = createState<boolean>(false)
  const notifyHandlers = new Map<Mpris.Player, number>()

  // Timeout to automatically close the notification
  let timeoutId: number | null = null

  const startTimeout = () => {
    if (timeoutId) return
    timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, TIMEOUT_DURATION, () => {
      setVisibility(false)
      timeoutId = null
      return false
    })
  }

  const stopTimeout = () => {
    if (timeoutId) {
      GLib.source_remove(timeoutId)
      timeoutId = null
    }
  }

  const playerAddedHandler = mpris.connect("player-added", (_, addedPlayer) => {
    const notifyId = addedPlayer.connect('notify::playback-status', () => {
      setPlayer(addedPlayer)
      setVisibility(true)
      startTimeout()
    })
    
    notifyHandlers.set(addedPlayer, notifyId)
  })

  const playerClosedHandler = mpris.connect("player-closed", (_, closedPlayer) => {
    // Disconnect the notify signal
    const notifyId = notifyHandlers.get(closedPlayer)
    if (notifyId !== undefined) {
      closedPlayer.disconnect(notifyId)
      notifyHandlers.delete(closedPlayer)
    }
    
    setPlayer((currentPlayer) => {
      // Check if the closedPlayer is in state
      if (currentPlayer === closedPlayer) {
        return undefined
      }
      return currentPlayer
    })
  })

  onCleanup(() => {
    mpris.disconnect(playerAddedHandler)
    mpris.disconnect(playerClosedHandler)
  })

  return (
    <window
      $={(self) => onCleanup(() => self.destroy())}
      name="mediaplayer-popup"
      class="mediaplayer-popup"
      namespace="mediaplayer-popup"
      application={app}
      visible={visibility}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    >
      <Gtk.EventControllerMotion onEnter={() => stopTimeout()} onLeave={() => startTimeout()}/>
      <With value={player}>
        {(mediaPlayer)=> mediaPlayer && <MediaPlayer mediaPlayer={mediaPlayer}/>}
      </With>
    </window>
  )
}