import sys
import os
import bpy
from mathutils import Vector

script_dir = os.path.dirname(__file__)  # lib/python_scripts のパスになる
sys.path.append(script_dir) 

from parse_args import parse_args
from cube import create_cube
from cut_cube import cut_cube
from export_gltf import export_gltf

def clear_scene():
    """ Blenderのシーン内の全オブジェクトを削除する """
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def main():
    clear_scene()
    
    points = parse_args()
    cube = create_cube()
    objects = cut_cube(cube, points)

    if len(objects) == 2:
        print("切断完了: 立方体を分割しました")
        for obj in objects:
            print(f"オブジェクト名: {obj.name}")

        shared_dir = os.path.join(script_dir, "../../shared")
        os.makedirs(shared_dir, exist_ok=True)

        export_path = os.path.join(shared_dir, "exported_cube.gltf")
        export_gltf(export_path)    

if __name__ == "__main__":
    main()