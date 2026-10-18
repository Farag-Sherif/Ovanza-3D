import bpy
import os
import math
import mathutils
import re

scratch_base = r"C:\Users\Andalus\.gemini\antigravity\brain\6625dce4-1cbe-4c1b-bc77-a3ba2b41c416\scratch\uploaded_models"
out_dir = r"d:\Blue Brain\ovanzalast-main\ovanza-frontend\ovanza-frontend\public\assets\models"
os.makedirs(out_dir, exist_ok=True)

configs = [
    {
        "name": "red-wax",
        "blend": os.path.join(scratch_base, "wax", "red wax.blend1"),
        "img_dir": os.path.join(scratch_base, "wax"),
        "objects": ["Cylinder.004", "Cylinder.005", "Circle.002", "Circle.003", "Circle.005"],
        "target_max_dim": 1.42,
    },
    {
        "name": "black-wax",
        "blend": os.path.join(scratch_base, "wax", "wax black.blend1"),
        "img_dir": os.path.join(scratch_base, "wax"),
        "objects": ["Cylinder.010", "Cylinder.011", "Circle.012", "Circle.013", "Circle.014"],
        "target_max_dim": 1.42,
    },
    {
        "name": "without-up",
        "blend": os.path.join(scratch_base, "source", "without up.blend"),
        "img_dir": os.path.join(scratch_base, "source"),
        "objects": ["Cylinder", "Cylinder.001", "cream", "up"],
        "bbox_objects": ["Cylinder", "Cylinder.001", "cream"],
        "target_max_dim": 1.25,
    },
    {
        "name": "colonia-bottle",
        "blend": os.path.join(scratch_base, "colonia", "COLONIA.blend1"),
        "img_dir": os.path.join(scratch_base, "colonia"),
        "objects": ["Cylinder.002", "LIQUID", "BézierCurve.005", "Cylinder.029", "out.001", "Cylinder.003", "Cylinder", "UP", "Cylinder.001", "lable.001"],
        "target_max_dim": 1.80,
    },
    {
        "name": "pump-bottle",
        "blend": os.path.join(scratch_base, "shaving", "untitled.blend1"),
        "img_dir": os.path.join(scratch_base, "shaving"),
        "objects": ["body", "jel.002", "BézierCurve", "Cylinder", "sup head", "Cube", "laple"],
        "target_max_dim": 1.65,
    },
]

for cfg in configs:
    print("=" * 70)
    print(f"Processing {cfg['name']} from {cfg['blend']}")
    bpy.ops.wm.open_mainfile(filepath=cfg["blend"])

    # Reload local images
    img_dir = cfg["img_dir"]
    for img in bpy.data.images:
        if not img.filepath:
            continue
        fn = re.split(r'[\\/]', img.filepath)[-1]
        local_p = os.path.join(img_dir, fn)
        if os.path.exists(local_p):
            img.filepath = local_p
            try:
                img.reload()
                print(f"  Reloaded img: {img.name} ({fn}) -> {img.size[:]}")
            except Exception as e:
                print(f"  Error reloading {fn}: {e}")
        else:
            print(f"  Image not found locally: {fn}")

    target_names = set(cfg["objects"])

    # Unparent target objects keeping world transform
    bpy.ops.object.select_all(action='DESELECT')
    for oname in cfg["objects"]:
        o = bpy.data.objects.get(oname)
        if o:
            o.hide_set(False)
            o.hide_viewport = False
            o.hide_render = False
            o.select_set(True)
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')

    # Delete non-target objects
    for o in list(bpy.data.objects):
        if o.name not in target_names:
            bpy.data.objects.remove(o, do_unlink=True)

    # Process modifiers on each target object
    for oname in cfg["objects"]:
        o = bpy.data.objects.get(oname)
        if not o or o.type != 'MESH':
            continue
        bpy.context.view_layer.objects.active = o
        for mod in list(o.modifiers):
            if mod.type == 'PARTICLE_SYSTEM':
                o.modifiers.remove(mod)
            elif mod.type == 'SUBSURF':
                mod.levels = 1
                mod.render_levels = 1
                try:
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                except Exception as e:
                    print(f"  Could not apply {mod.name}: {e}")
            elif mod.type == 'NODES':
                try:
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                except Exception as e:
                    print(f"  Could not apply NODES {mod.name}: {e}")

    # Apply rotation & scale
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    # Compute combined world bbox
    bbox_names = cfg.get("bbox_objects", cfg["objects"])
    min_v = [float('inf')] * 3
    max_v = [float('-inf')] * 3
    for oname in bbox_names:
        o = bpy.data.objects.get(oname)
        if not o or o.type != 'MESH':
            continue
        for corner in o.bound_box:
            wc = o.matrix_world @ mathutils.Vector(corner)
            for i in range(3):
                if wc[i] < min_v[i]: min_v[i] = wc[i]
                if wc[i] > max_v[i]: max_v[i] = wc[i]

    center = mathutils.Vector([(min_v[i] + max_v[i]) * 0.5 for i in range(3)])
    dims = [max_v[i] - min_v[i] for i in range(3)]
    max_dim = max(dims)
    scale_factor = cfg["target_max_dim"] / max_dim

    print(f"  Original center={tuple(round(x, 3) for x in center)}, dims={tuple(round(x, 3) for x in dims)}, scale_factor={scale_factor:.4f}")

    # Recenter and scale all objects around world origin
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.location = (o.location - center) * scale_factor
            o.scale = (scale_factor, scale_factor, scale_factor)

    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # Clean up empty/unused textures or materials
    for mat in bpy.data.materials:
        if mat.use_nodes and mat.node_tree:
            for node in list(mat.node_tree.nodes):
                if node.type == 'TEX_IMAGE' and (not node.image or node.image.size[0] == 0):
                    print(f"  Removing missing tex node in {mat.name}: {node.name}")
                    mat.node_tree.nodes.remove(node)

    # Export GLB with materials
    out_path = os.path.join(out_dir, f"{cfg['name']}.glb")
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True,
        export_materials='EXPORT',
        export_image_format='AUTO',
    )
    print(f"  Exported -> {out_path} ({os.path.getsize(out_path)} bytes)")

print("=" * 70)
print("All 5 models exported successfully!")
