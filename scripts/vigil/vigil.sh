#!/usr/bin/env bash
set -euo pipefail

SITE_URL="https://meygod.com/festival/countdown"
CHROME_DIR="$HOME/.config/meygod-vigil"
SPAWN_FLAG="/run/user/$(id -u)/vigil-last-spawn"

for _ in $(seq 1 60); do
  if curl -sf -o /dev/null "$SITE_URL"; then break; fi
  sleep 1
done

pkill -f "class=Vigil" 2>/dev/null || true
sleep 1

xset s off -dpms
xset s noblank

unclutter-xfixes --start-hidden &

pkill -f "devilspie2" 2>/dev/null || true
devilspie2 &

while read -r output; do
  geom=$(xrandr --query | awk -v o="$output" '$1 == o && $2 == "connected" { for (i = 3; i <= NF; i++) if ($i ~ /^[0-9]+x[0-9]+\+/) { print $i; exit } }')
  [[ -z "$geom" || "$geom" == --* ]] && continue
  pos="${geom%%+*}"
  rest="${geom#*+}"
  x="${rest%%+*}"
  y="${rest#*+}"
  w="${pos%%x*}"
  h="${pos#*x}"
  cls="Vigil-${output}"

  chromium \
    --app="$SITE_URL" \
    --class="$cls" \
    --user-data-dir="$CHROME_DIR-$output" \
    --noerrdialogs \
    --disable-infobars \
    --no-first-run \
    --disable-session-crashed-bubble \
    --disable-component-update \
    --check-for-update-interval=31536000 \
    --password-store=basic &

  # Chromium ignores --window-position/--window-size, and Mutter ignores
  # window-type changes once the window is shown. So classify and size the
  # window the instant it appears, before it gets mapped to the screen.
  WID=""
  for _ in $(seq 1 200); do
    WID=$(wmctrl -lx 2>/dev/null | awk -v c="$cls" 'index($3, c) > 0 { print $1; exit }')
    [ -n "$WID" ] && break
    sleep 0.05
  done
  if [ -n "$WID" ]; then
    xprop -id "$WID" -f _NET_WM_WINDOW_TYPE 32a -set _NET_WM_WINDOW_TYPE _NET_WM_WINDOW_TYPE_DESKTOP
    wmctrl -i -r "$WID" -e "0,$x,$y,$w,$h"
  fi
done < <(xrandr --query | awk '$2 == "connected" { print $1 }')

touch "$SPAWN_FLAG"

wait
