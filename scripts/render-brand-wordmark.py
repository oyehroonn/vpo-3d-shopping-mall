"""Offline artwork: custom wide letterforms, beveled chrome, studio reflections.

Run with Blender 5: blender -b --python scripts/render-brand-wordmark.py --
  --output /tmp/vpo-wordmark.png --width 7680 --samples 64
The transparent render is exported to WebP for the CSS marquee; no WebGL is
needed to display it. Letter outlines are original, not a font dependency.
"""
import argparse
import math
import re
import sys
from pathlib import Path

import bpy
from mathutils import Vector


GLYPHS = {
    "V": "M 3 200 L 75 200 L 128 61 L 181 200 L 253 200 L 171 0 L 85 0 Z",
    "P": "M 0 0 L 0 200 L 191 200 Q 250 200 250 145 L 250 119 Q 250 66 191 66 L 67 66 L 67 0 Z M 67 119 L 174 119 Q 184 119 184 129 L 184 138 Q 184 148 174 148 L 67 148 Z",
    "O": "M 57 0 Q 0 0 0 55 L 0 145 Q 0 200 57 200 L 193 200 Q 250 200 250 145 L 250 55 Q 250 0 193 0 Z M 79 53 L 171 53 Q 184 53 184 66 L 184 134 Q 184 147 171 147 L 79 147 Q 66 147 66 134 L 66 66 Q 66 53 79 53 Z",
    "F": "M 0 0 L 0 200 L 239 200 L 239 147 L 67 147 L 67 113 L 216 113 L 216 61 L 67 61 L 67 0 Z",
    "R": "M 0 0 L 0 200 L 191 200 Q 250 200 250 147 L 250 127 Q 250 84 212 76 L 258 0 L 183 0 L 141 72 L 67 72 L 67 0 Z M 67 124 L 173 124 Q 184 124 184 134 L 184 139 Q 184 149 173 149 L 67 149 Z",
    "B": "M 0 0 L 0 200 L 189 200 Q 242 200 242 156 L 242 143 Q 242 112 218 102 Q 250 92 250 59 L 250 46 Q 250 0 196 0 Z M 67 123 L 169 123 Q 179 123 179 133 L 179 139 Q 179 149 169 149 L 67 149 Z M 67 51 L 176 51 Q 186 51 186 61 L 186 67 Q 186 77 176 77 L 67 77 Z",
    "A": "M 0 0 L 86 200 L 178 200 L 264 0 L 192 0 L 178 37 L 85 37 L 71 0 Z M 105 88 L 158 88 L 132 158 Z",
    "N": "M 0 0 L 0 200 L 77 200 L 184 81 L 184 200 L 250 200 L 250 0 L 174 0 L 66 119 L 66 0 Z",
    "D": "M 0 0 L 0 200 L 181 200 Q 250 200 250 134 L 250 66 Q 250 0 181 0 Z M 67 54 L 162 54 Q 184 54 184 76 L 184 124 Q 184 146 162 146 L 67 146 Z",
    "S": "M 0 0 L 0 53 L 172 53 Q 183 53 183 63 Q 183 73 172 73 L 60 73 Q 0 73 0 127 L 0 146 Q 0 200 60 200 L 242 200 L 242 147 L 78 147 Q 67 147 67 137 Q 67 127 78 127 L 190 127 Q 250 127 250 73 L 250 54 Q 250 0 190 0 Z",
}


def contours(path):
    """Sample our small M/L/Q/Z outline vocabulary, keeping closed counters."""
    tokens = re.findall(r"[MLQZ]|-?\d+(?:\.\d+)?", path)
    result, points, i = [], [], 0
    while i < len(tokens):
        command = tokens[i]
        i += 1
        if command in ("M", "L"):
            points.append((float(tokens[i]), float(tokens[i + 1])))
            i += 2
        elif command == "Q":
            start = points[-1]
            control = (float(tokens[i]), float(tokens[i + 1]))
            end = (float(tokens[i + 2]), float(tokens[i + 3]))
            i += 4
            for j in range(1, 17):
                t = j / 16
                points.append(tuple((1 - t) ** 2 * start[k] + 2 * (1 - t) * t * control[k] + t * t * end[k] for k in (0, 1)))
        elif command == "Z":
            result.append(points)
            points = []
    return result


def chrome_material():
    material = bpy.data.materials.new("Smoked platinum / cyan and champagne softboxes")
    material.use_nodes = True
    nodes, links = material.node_tree.nodes, material.node_tree.links
    shader = nodes.get("Principled BSDF")
    shader.inputs["Metallic"].default_value = 0.96
    shader.inputs["Roughness"].default_value = 0.24
    shader.inputs["Coat Weight"].default_value = 0.32
    shader.inputs["Coat Roughness"].default_value = 0.16

    coords = nodes.new("ShaderNodeNewGeometry")
    separate = nodes.new("ShaderNodeSeparateXYZ")
    links.new(coords.outputs["Position"], separate.inputs[0])
    ramp = nodes.new("ShaderNodeValToRGB")
    # The front has a gently curved reflection horizon. The actual rounded
    # geometry supplies the fine edge reflections and the recessed counters.
    stops = [
        (0.00, (0.80, 0.83, 0.88, 1)),
        (0.16, (0.49, 0.52, 0.55, 1)),
        (0.43, (0.10, 0.10, 0.12, 1)),
        (0.57, (0.25, 0.17, 0.11, 1)),
        (0.65, (0.87, 0.83, 0.70, 1)),
        (0.70, (0.65, 0.84, 0.95, 1)),
        (0.79, (0.025, 0.035, 0.045, 1)),
        (1.00, (0.012, 0.016, 0.02, 1)),
    ]
    ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
    for i, (position, color) in enumerate(stops):
        element = ramp.color_ramp.elements[0] if i == 0 else ramp.color_ramp.elements.new(position)
        element.position, element.color = position, color
    ramp.color_ramp.interpolation = "B_SPLINE"
    links.new(separate.outputs["Y"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], shader.inputs["Base Color"])
    links.new(ramp.outputs["Color"], shader.inputs["Emission Color"])
    shader.inputs["Emission Strength"].default_value = 0.65
    return material


def softbox(name, position, scale, color, power, target):
    bpy.ops.mesh.primitive_plane_add(size=1, location=position)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("Z", "Y").to_euler()
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    emission, output = nodes.new("ShaderNodeEmission"), nodes.new("ShaderNodeOutputMaterial")
    emission.inputs[0].default_value = (*color, 1)
    emission.inputs[1].default_value = power
    material.node_tree.links.new(emission.outputs[0], output.inputs[0])
    obj.data.materials.append(material)
    obj.visible_camera = False
    obj.visible_shadow = False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="/tmp/vpo-wordmark.png")
    parser.add_argument("--width", type=int, default=7680)
    parser.add_argument("--samples", type=int, default=64)
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    material = chrome_material()
    cursor, letters = 0, []
    for character in "VPO FOR BRANDS":
        if character == " ":
            cursor += 0.44
            continue
        outlines = contours(GLYPHS[character])
        curve = bpy.data.curves.new(character, "CURVE")
        curve.dimensions, curve.fill_mode = "2D", "BOTH"
        curve.resolution_u = 16
        curve.extrude = 0.034
        curve.bevel_depth = 0.028
        curve.bevel_resolution = 8
        for points in outlines:
            spline = curve.splines.new("POLY")
            spline.points.add(len(points) - 1)
            for point, (x, y) in zip(spline.points, points):
                point.co = (x / 200, y / 200, 0, 1)
            spline.use_cyclic_u = True
        obj = bpy.data.objects.new("VPO chrome / " + character, curve)
        bpy.context.collection.objects.link(obj)
        obj.location.x = cursor
        obj.data.materials.append(material)
        letters.append(obj)
        cursor += max(p[0] for outline in outlines for p in outline) / 200 + 0.105

    width = cursor - 0.105
    center = (width / 2, 0.5, 0)
    softbox("Upper pearl rim", (width / 2, 3.6, 2.0), (width * 1.5, 1.4, 1), (0.76, 0.85, 1), 4, center)
    softbox("Lower silver sweep", (width / 2, -2.8, 3), (width * 1.5, 3, 1), (1, 0.98, 0.93), 3.5, center)
    softbox("Long cool reflection", (width / 2, 1.8, 4), (width * 1.5, 0.45, 1), (0.61, 0.85, 1), 3, center)
    softbox("Champagne bounce", (width / 2, -0.8, 4.5), (width * 1.5, 0.6, 1), (1, 0.74, 0.46), 1.4, center)
    for x in (-1, width + 1):
        softbox("Edge card", (x, 0.5, 1.4), (0.65, 3, 1), (0.81, 0.89, 1), 5, center)

    bpy.ops.object.camera_add(location=(width / 2, 0.64, 15))
    camera = bpy.context.object
    camera.location.y = 0.5
    camera.rotation_euler = (0, 0, 0)
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = width + 0.28
    scene = bpy.context.scene
    scene.camera = camera
    scene.render.engine = "CYCLES"
    scene.cycles.samples = args.samples
    scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.world.color = (0.08, 0.08, 0.08)
    scene.render.resolution_x = args.width
    scene.render.resolution_y = round(args.width * 1.30 / camera.data.ortho_scale)
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "AgX"
    scene.render.filepath = str(Path(args.output).resolve())
    bpy.ops.wm.save_as_mainfile(filepath=str(Path(args.output).with_suffix(".blend").resolve()))
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
