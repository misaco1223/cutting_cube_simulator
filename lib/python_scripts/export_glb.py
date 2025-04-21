import bpy


def export_glb(file_path, objects):
    bpy.ops.export_scene.gltf(
        filepath=file_path,
        export_format='GLB',
        export_apply=True,
        use_selection=True,
        export_yup=True,
        export_lights=False,
        export_cameras=False
    )
    print(f"GLBファイルをエクスポートしました: {file_path}")
