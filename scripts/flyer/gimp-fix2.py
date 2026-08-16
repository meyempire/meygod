#!/usr/bin/env python3
"""MeyGOD — fix 2: hide crop guides (toggle on only when sizing) and re-wrap
the long text layers (wrapping was silently dropped pre-insertion).

Run: flatpak run --command=gimp-console org.gimp.GIMP -i \
  --batch-interpreter python-fu-eval \
  -b "exec(open('/home/annekin/workspace/meygod/scripts/flyer/gimp-fix2.py').read())"
"""

import sys

import gi

gi.require_version("Gimp", "3.0")
from gi.repository import Gimp, Gio  # noqa: E402

XCF = "/home/annekin/workspace/meygod/assets/gimp/meygod_festival_flyre_2.xcf"

# name -> (font, size px, wrap width px)
REWRAP = {
    "TEASER": ("Space Grotesk Regular", 34, 1000),
    "INVITE": ("Space Grotesk Regular", 28, 540),
}


def text_w(txt, f, size, maxw):
    words = txt.split()
    lines, cur = [], ""
    for w in words:
        t = f"{cur} {w}" if cur else w
        ok, tw, _h, _a, _d = Gimp.text_get_extents_font(t, size, f)
        if ok and tw > maxw and cur:
            lines.append(cur)
            cur = w
        else:
            cur = t
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def walk(img, layer):
    name = Gimp.Item.get_name(layer)

    if name in ("MAP CROP GUIDE", "QR CROP GUIDE"):
        Gimp.Item.set_visible(layer, False)
        print("hidden:", name)

    if Gimp.Layer.is_text_layer(layer):
        if name in REWRAP:
            fname, size, wrapw = REWRAP[name]
            f = Gimp.Font.get_by_name(fname)
            Gimp.TextLayer.set_text(layer, text_w(Gimp.TextLayer.get_text(layer), f, size, wrapw))
            print("rewrapped:", name)
        elif name == "line" or name.startswith("line "):
            f = Gimp.Font.get_by_name("Space Grotesk Regular")
            Gimp.TextLayer.set_text(
                layer, text_w(Gimp.TextLayer.get_text(layer), f, 26, 580)
            )
            print("rewrapped:", name)

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
    print("FIX2 ERROR:", repr(e))
    sys.exit(1)
finally:
    try:
        Gimp.quit(0)
    except Exception:
        pass
