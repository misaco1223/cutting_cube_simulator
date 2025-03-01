import bpy

def export_gltf(file_path):
    bpy.ops.export_scene.gltf(
        filepath=file_path,
        export_format='GLTF_SEPARATE',
        export_materials='EXPORT',
        export_apply=True
    )
    print(f"GLTFファイルをエクスポートしました: {file_path}")