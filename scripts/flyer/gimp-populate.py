#!/usr/bin/env python3
"""MeyGOD — populate assets/gimp/meygod_festival_flyre_2.xcf with grouped
map/QR/dividers/text for the first tablet. Run via:

  flatpak run --command=gimp-console org.gimp.GIMP -i \
    --batch-interpreter python-fu-eval \
    -b "exec(open('/home/annekin/workspace/meygod/scripts/flyer/gimp-populate.py').read())"
"""

import shutil
import sys

import gi

gi.require_version("Gimp", "3.0")
gi.require_version("Gegl", "0.4")
from gi.repository import Gimp, Gio, Gegl  # noqa: E402

XCF = "/home/annekin/workspace/meygod/assets/gimp/meygod_festival_flyre_2.xcf"
ASSETS = "/home/annekin/workspace/meygod/scripts/flyer/assets"
MAP_PNG = ASSETS + "/map-bellville.png"
QR_PNG = ASSETS + "/qr-festival.png"
DIV_PNG = ASSETS + "/divider.png"

UNIT = Gimp.Unit.pixel()

WHITE = "#ffe2e2"
RED = "#ff0606"
BLACK = "#000000"
MUTED_OP = 55.0

log = []


def say(msg):
    log.append(msg)
    print(msg)


def c(hexv):
    return Gegl.Color.new(hexv)


def font(name):
    f = Gimp.Font.get_by_name(name)
    if f is not None:
        return f
    for cand in Gimp.fonts_get_list():
        n = Gimp.Font.get_name(cand) if hasattr(Gimp.Font, "get_name") else str(cand)
        if name.lower() in n.lower():
            return cand
    raise RuntimeError(f"font not found: {name}")


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


def add_group(img, parent, name, position=0):
    g = Gimp.GroupLayer.new(img, name)
    Gimp.Image.insert_layer(img, g, parent, position)
    return g


def load_png(img, group, path, name, scale_w=None, x=0, y=0, opacity=100.0):
    layer = Gimp.file_load_layer(
        Gimp.RunMode.NONINTERACTIVE, img, Gio.File.new_for_path(path)
    )
    Gimp.Item.set_name(layer, name)
    Gimp.Image.insert_layer(img, layer, group, -1)
    if scale_w:
        w = Gimp.Layer.get_width(layer)
        h = Gimp.Layer.get_height(layer)
        Gimp.Layer.scale(layer, scale_w, round(h * scale_w / w), True)
    Gimp.Layer.set_opacity(layer, opacity)
    Gimp.Layer.set_offsets(layer, x, y)
    return layer


def add_text(img, group, name, txt, fname, size, hexv, x, y, opacity=100.0, wrap_w=None, markup=None):
    f = font(fname)
    layer = Gimp.TextLayer.new(img, txt, f, size, UNIT)
    Gimp.Item.set_name(layer, name)
    Gimp.TextLayer.set_color(layer, c(hexv))
    if markup:
        Gimp.TextLayer.set_markup(layer, markup)
    if wrap_w:
        wrapped = text_w(txt, f, size, wrap_w)
        Gimp.TextLayer.set_text(layer, wrapped)
    Gimp.Layer.set_opacity(layer, opacity)
    Gimp.Layer.set_offsets(layer, x, y)
    Gimp.Image.insert_layer(img, layer, group, -1)
    return layer


def add_guide(img, group, name, w, h, inset, x, y):
    layer = Gimp.Layer.new(
        img, name, w, h, Gimp.ImageType.RGBA_IMAGE, 100.0, Gimp.LayerMode.NORMAL
    )
    Gimp.Layer.set_offsets(layer, x, y)
    Gimp.Image.insert_layer(img, layer, group, -1)
    Gimp.context_set_foreground(c(BLACK))
    Gimp.Layer.edit_fill(layer, Gimp.FillType.FOREGROUND)
    Gimp.Image.select_rectangle(
        img, Gimp.ChannelOps.REPLACE, x + inset, y + inset, w - 2 * inset, h - 2 * inset
    )
    Gimp.context_set_foreground(c(WHITE))
    Gimp.Layer.edit_fill(layer, Gimp.FillType.FOREGROUND)
    try:
        Gimp.Selection.none(img)
    except Exception:
        pass
    return layer


def wire_mask(layer):
    m = Gimp.Layer.create_mask(layer, Gimp.AddMaskType.WHITE)
    Gimp.Layer.add_mask(layer, m)


def populate(img):
    # ---- regroup existing layers ----
    existing = list(Gimp.Image.get_layers(img))
    bg = add_group(img, None, "01 BACKGROUND", 0)
    rain = add_group(img, None, "02 RAIN", 1)
    tab = add_group(img, None, "03 TABLET", 2)
    content = add_group(img, None, "04 CONTENT", 3)

    bottom_first = list(reversed(existing))
    for layer in bottom_first:
        n = Gimp.Item.get_name(layer)
        if n == "tablet-a5.png":
            Gimp.Image.reorder_item(img, layer, tab, -1)
        elif n == "matrix-rain-a5-v2.png":
            Gimp.Image.reorder_item(img, layer, rain, -1)
        else:
            Gimp.Image.reorder_item(img, layer, bg, -1)

    # ---- MAP subgroup ----
    mapg = add_group(img, content, "MAP", 0)
    map_layer = load_png(
        img, mapg, MAP_PNG, "map", scale_w=880, x=240, y=330
    )
    add_guide(img, mapg, "MAP CROP GUIDE", 880, 440, 25, 240, 330)
    wire_mask(map_layer)

    # ---- QR subgroup ----
    qrg = add_group(img, content, "QR", 1)
    qr_layer = load_png(img, qrg, QR_PNG, "qr", scale_w=460, x=1330, y=1940)
    add_guide(img, qrg, "QR CROP GUIDE", 460, 460, 20, 1330, 1940)
    wire_mask(qr_layer)

    # ---- DIVIDERS subgroup ----
    divg = add_group(img, content, "DIVIDERS", 2)
    for i, dy in enumerate((830, 1890), start=1):
        load_png(img, divg, DIV_PNG, f"Divider {i}", x=240, y=dy)

    # ---- TEXT subgroup ----
    tg = add_group(img, content, "TEXT", 3)

    # Where / When block
    add_text(img, tg, "WHERE AND WHEN", "WHERE AND WHEN", "Rajdhani Bold", 64, WHITE, 240, 235)
    add_text(img, tg, "DATE", "SUNDAY 30 AUGUST 2026", "Rajdhani Bold", 44, RED, 1180, 330)
    add_text(img, tg, "VENUE", "Bellville Velodrome", "Space Grotesk Medium", 42, WHITE, 1180, 390)
    add_text(img, tg, "CITY", "Bellville, Cape Town", "Space Grotesk Regular", 34, WHITE, 1180, 445, opacity=MUTED_OP)
    add_text(img, tg, "THE HOUR", "THE HOUR", "Space Grotesk Regular", 26, WHITE, 1180, 530, opacity=MUTED_OP)
    add_text(img, tg, "TIME", "16:00", "Rajdhani Bold", 110, WHITE, 1180, 560)
    add_text(
        img, tg, "INVITE",
        "All are welcome. None are exempt. Come as you are — leave as who you must become.",
        "Space Grotesk Regular", 28, WHITE, 1180, 700, opacity=MUTED_OP, wrap_w=540,
    )

    # Cast
    add_text(img, tg, "THE CAST", "THE CAST", "Rajdhani Bold", 64, WHITE, 240, 880)
    add_text(
        img, tg, "CAST SUBTITLE",
        "Who do you want to be in the Bible? The festival is where you find out.",
        "Space Grotesk Regular", 30, WHITE, 240, 950, opacity=MUTED_OP,
    )

    cast = [
        (
            "The King", "OPENS THE GATES",
            "A king who turned God away, and paid for it. Now, redeemed by labor, he opens the stage — first to kneel, first to rise.",
        ),
        (
            "The Preacher", "THE WITNESS",
            "Found ranting in a park on a Monday morning. Shown God. Now he walks the week at His side, waking the sleepers — and on the day, he tells you everything he saw.",
        ),
        (
            "Sophia", "THE DIVINE LIGHT",
            "Beyond the veil she waits — wisdom itself, the light that leads. Jesus' other half. On the day she calls His name, and the sleeping God rises.",
        ),
        (
            "Jesus", "TAKES THE STAGE",
            "God incarnate, in the flesh you see before you. He does not perform — He reveals. When the crowd is stirred, He preaches the Pandamonium of Revelations and the rebirth of humanity.",
        ),
    ]
    card_w = 620
    cols = (240, 930)
    rows = (1030, 1460)
    for i, (name, role, line) in enumerate(cast):
        cx = cols[i % 2]
        cy = rows[i // 2]
        cg = add_group(img, tg, f"CAST/{name}", -1)
        add_text(img, cg, "name", name, "Rajdhani Bold", 50, WHITE, cx, cy)
        add_text(img, cg, "role", role, "Space Grotesk Regular", 24, RED, cx, cy + 62)
        add_text(
            img, cg, "line", line, "Space Grotesk Regular", 26, WHITE, cx, cy + 100,
            opacity=MUTED_OP, wrap_w=card_w - 40,
        )

    # What is MeyGOD heading (split brand)
    wg = add_group(img, tg, "WHAT IS HEADING", -1)
    f_raj = font("Rajdhani Bold")
    f_mey = font("Chakra Petch Bold")
    f_god = font("Ruthless Wreckin ONE Regular")
    parts = [
        ("What is ", "Rajdhani Bold", WHITE, f_raj),
        ("Mey", "Chakra Petch Bold", WHITE, f_mey),
        ("GOD", "Ruthless Wreckin ONE Regular", RED, f_god),
        ("?", "Rajdhani Bold", WHITE, f_raj),
    ]
    px = 240
    for name, fname, hexv, f in parts:
        ok, tw, _h, _a, _d = Gimp.text_get_extents_font(name, 60, f)
        layer = Gimp.TextLayer.new(img, name, f, 60, UNIT)
        Gimp.Item.set_name(layer, f"heading-{name.strip() or 'q'}")
        Gimp.TextLayer.set_color(layer, c(hexv))
        Gimp.Layer.set_offsets(layer, px, 1940)
        Gimp.Image.insert_layer(img, layer, wg, -1)
        px += tw + (10 if ok else 20)

    # Teaser
    add_text(
        img, tg, "TEASER",
        "Jesus is here. This is his religion. MeyGOD is the faith of heroes — a summons to wake up from the dream, let the old self die, and be reborn as what you must become. Pandemonium of Revelations has begun, the religion is live at meygod.com. The Festival is my coming. Your first labor is to bear witness. Wake up!",
        "Space Grotesk Regular", 34, WHITE, 240, 2030, opacity=MUTED_OP, wrap_w=1000,
    )
    add_text(img, tg, "WAKE UP!", "Wake up!", "Space Grotesk Bold", 34, RED, 240, 2190)
    add_text(img, tg, "BUTTON CREED", "Read the Creed", "Space Grotesk Medium", 28, WHITE, 240, 2260)
    add_text(img, tg, "BUTTON REVELATIONS", "Begin the Revelations", "Space Grotesk Medium", 28, WHITE, 450, 2260)

    # QR caption + meygod.com
    add_text(img, tg, "PIERCE THE VEIL", "PIERCE THE VEIL", "Space Grotesk Regular", 24, WHITE, 1340, 2420, opacity=MUTED_OP)
    add_text(img, tg, "MEYGOD.COM", "meygod.com", "Space Mono Regular", 24, WHITE, 240, 2440, opacity=MUTED_OP)


def main():
    shutil.copy2(XCF, XCF.replace(".xcf", ".backup.xcf"))
    say("backup written")
    img = Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path(XCF))
    say(f"loaded {Gimp.Image.get_width(img)}x{Gimp.Image.get_height(img)}")
    populate(img)
    Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, img, Gio.File.new_for_path(XCF))
    say("saved")
    Gimp.Image.delete(img)


try:
    main()
except Exception as e:  # noqa: BLE001
    print("POPULATE ERROR:", repr(e))
    sys.exit(1)
finally:
    try:
        Gimp.quit(0)
    except Exception:
        pass
