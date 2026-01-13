#!/bin/bash
pactl load-module module-null-sink sink_name=mixeur sink_properties=device.description="Mixeur_Voix_PC"
pactl load-module module-loopback source=@DEFAULT_SINK@.monitor sink=mixeur
pactl load-module module-loopback source=@DEFAULT_SOURCE@ sink=mixeur