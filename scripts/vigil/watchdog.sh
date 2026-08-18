#!/usr/bin/env bash
set -euo pipefail

SPAWN_FLAG="/run/user/$(id -u)/vigil-last-spawn"

mapfile -t wins < <(wmctrl -lx | awk '$3 ~ /\.Vigil/ { print $1 }')

# If all wallpaper windows died (chromium crash), respawn the whole service.
if [ ${#wins[@]} -eq 0 ]; then
  if [ -f "$SPAWN_FLAG" ]; then
    age=$(( $(date +%s) - $(stat -c %Y "$SPAWN_FLAG") ))
    if [ "$age" -gt 120 ]; then
      systemctl --user restart meygod-vigil.service
    fi
  fi
  exit 0
fi

# Re-pin the Vigil windows: un-hide (Super+D recovery), below, sticky, no taskbar.
for id in "${wins[@]}"; do
  wmctrl -i -r "$id" -b remove,hidden
  wmctrl -i -r "$id" -b add,below,sticky
  wmctrl -i -r "$id" -b add,skip_taskbar,skip_pager
done

# Keep the desktop icons layer above the wallpaper.
mapfile -t iconwins < <(wmctrl -lx | awk '$3 == "gjs.gjs" && $0 ~ /BDHF/ { print $1 }')
for id in "${iconwins[@]}"; do
  xdotool windowraise "$id"
done
