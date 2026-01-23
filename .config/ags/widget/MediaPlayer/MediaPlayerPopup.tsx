import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Mpris from "gi://AstalMpris"
import { createBinding, For, createState, onCleanup, With } from "ags"
import MediaPlayer from './MediaPlayer'

export default function MediaPlayerPopup() {
  const monitors = createBinding(app, "monitors")
  const mpris = Mpris.get_default()

  const [player, setPlayer] = createState<Mpris.Player | undefined>(undefined)
  const [visibility, setVisibility] = createState<boolean>(false)
  const notifyHandlers = new Map<Mpris.Player, number>()

  const playerAddedHandler = mpris.connect("player-added", (_, addedPlayer) => {
    console.log(addedPlayer.busName)
    const notifyId = addedPlayer.connect('notify::playback-status', () => {
      console.log(addedPlayer.busName)
      setPlayer(addedPlayer)
      setVisibility(true)
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
    <For each={monitors}>
      {(monitor) => (
        <window
          $={(self) => onCleanup(() => self.destroy())}
          name="mediaplayer-popup"
          class="mediaplayer-popup"
          namespace="mediaplayer-popup"
          application={app}
          gdkmonitor={monitor}
          visible={visibility}
          anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        >
          <With value={player}>
            {(mediaPlayer)=> mediaPlayer && <MediaPlayer mediaPlayer={mediaPlayer}/>}
          </With>
        </window>
      )}
    </For>
  )
}