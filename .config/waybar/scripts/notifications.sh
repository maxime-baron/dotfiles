#!/bin/bash

# Intervalle de mise à jour en secondes
INTERVAL=2

# Fonction pour afficher l'état
update_status() {
  # OPTIMISATION : On pipe directement la sortie vers jq pour ne récupérer que le nombre.
  # On ne stocke jamais le gros JSON dans une variable Bash.
  count=$(astal-notifd -l 2>/dev/null | jq 'length' 2>/dev/null || echo "0")
  
  if [ "$count" -gt 0 ]; then
    echo "{\"text\":\"$count\", \"alt\":\"has-notifications\", \"tooltip\":\"$count notification(s)\", \"class\":\"has-notifications\"}"
  else
    echo "{\"text\":\"\", \"alt\":\"no-notifications\", \"tooltip\":\"Aucune notification\", \"class\":\"no-notifications\"}"
  fi
}

# Boucle infinie (Polling)
while true; do
  update_status
  sleep $INTERVAL
done