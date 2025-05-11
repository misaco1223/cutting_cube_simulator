import sys
import os
import bpy
from mathutils import Vector

script_dir = os.path.dirname(__file__)  # lib/python_scripts のパスになる
sys.path.append(script_dir)

from export_glb import export_glb
from cut_cube import cut_cube
from cube import create_cube
from parse_args import parse_args

def clear_scene():
    """ Blenderのシーン内の全オブジェクトを削除する """
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()


def main():
    clear_scene()

    cut_id, points = parse_args()
    cube = create_cube()
    objects,ratio = cut_cube(cube, points)

    if len(objects) == 3:
        # print("切断完了: 立方体を分割しました")
        # for obj in objects:
            # print(f"オブジェクト名: {obj.name}, 型: {type(obj)}")
        # print("id:", cut_id, "points:", points)

        for obj in objects:
            obj.select_set(True)

        shared_dir = os.path.join(script_dir, "../../shared")
        os.makedirs(shared_dir, exist_ok=True)

        export_path = os.path.join(shared_dir, f"exported_cube_{cut_id}.glb")
        export_glb(export_path, objects)

        ratio_export_path = os.path.join(shared_dir, f"ratio_{cut_id}.txt")
        with open(ratio_export_path, 'w') as f:
            f.write(str(ratio))


if __name__ == "__main__":
    main()
