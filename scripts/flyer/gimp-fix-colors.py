#!/usr/bin/env python3
"""MeyGOD — fix colors: make crop guides translucent, add red glow layers
under glowing text (site-style). Idempotent.

Run: flatpak run --command=gimp-console org.gimp.GIMP -i \
  --batch-interpreter python-fu-eval \
  -b "exec(open('/home/annekin/workspace/meygod/scripts/flyer/gimp-fix-colors.py').read())"
"""

import sys

import gi

gi.require_version("Gimp", "3.0")
gi.require_version("Gegl", "0.4")
from gi.repository import Gimp, Gio, Gegl  # noqa: E402

XCF = "/home/annekin/workspace/meygod/assets/gimp/meygod_festival_flyre_2.xcf"
GLOW_HEX = "#ff0606"
GUIDE_OPACITY = 45.0

# layer name -> gaussian blur radius (px). Cast names/roles matched by prefix.
BLUR = {
    "WHERE AND WHEN": 13,
    "THE CAST": 13,
    "DATE": 9,
    "VENUE": 9,
    "TIME": 22,
    "name": 10,
    "role": 5,
    "WAKE UP!": 7,
    "heading-What is": 12,
    "heading-Mey": 12,
    "heading-GOD": 12,
    "heading-?": 12,
    "BUTTON CREED": 6,
    "BUTTON REVELATIONS": 6,
}


def blur_for(name):
    if name in BLUR:
        return BLUR[name]
    if name.startswith("name"):
        return BLUR["name"]
    if name.startswith("role"):
        return BLUR["role"]
    return None


def walk(img, layer):
    name = Gimp.Item.get_name(layer)

    if "guide" in name.lower():
        Gimp.Layer.set_opacity(layer, GUIDE_OPACITY)
        print("guide opacity ->", GUIDE_OPACITY, ":", name)

    if Gimp.Layer.is_text_layer(layer) and not name.endswith(" glow"):
        b = blur_for(name)
        if b:
            parent = Gimp.Item.get_parent(layer)
            if parent is not None and Gimp.Layer.is_group(parent):
                sibs = Gimp.Layer.get_children(parent)
                idx = sibs.index(layer)
                has_glow = any(
                    Gimp.Item.get_name(s) == f"{name} glow" for s in sibs
                )
                if not has_glow:
                    copy = Gimp.Layer.copy(layer)
                    Gimp.Item.set_name(copy, f"{name} glow")
                    Gimp.TextLayer.set_color(copy, Gegl.Color.new(GLOW_HEX))
                    Gimp.Image.insert_layer(img, copy, parent, idx + 1)
                    flt = Gimp.DrawableFilter.new(copy, "gegl:gaussian-blur", None)
                    cfg = Gimp.DrawableFilter.get_config(flt)
                    cfg.set_property("std-dev-x", float(b))
                    cfg.set_property("std-dev-y", float(b))
                    Gimp.Layer.append_filter(copy, flt)
                    Gimp.DrawableFilter.update(flt)
                    Gimp.Layer.set_opacity(copy, 85.0)
                    print("glow added:", name, "blur", b)

    if Gimp.Layer.is_group(layer):
        for ch in Gimp.Layer.get_children(layer):
            walk(img, ch)


def main():
    img = Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path(XCF))
    for top in Gimp.Image.get_layers(img):
        walk(img, top)
    Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, img, Gio.File.new_for_path(XCF))
    print("saved")


try:
    main()
except Exception as e:  # noqa: BLE001
    print("FIX ERROR:", repr(e))
    sys.exit(1)
finally:
    try:
        Gimp.quit(0)
    except Exception:
        pass
