import bpy
import bmesh
from mathutils import Vector

def cut_cube(cube, points):
    point1, point2, point3 = points

    #もとのCubeを複製して残す
    original_cube = cube.copy()
    original_cube.data = cube.data.copy()
    bpy.context.collection.objects.link(original_cube)
    original_cube.name = "Cube"

    # BMeshで切断
    bm = bmesh.new()
    bm.from_mesh(cube.data)

    # 平面の法線を計算
    plane_normal = (point2 - point1).cross(point3 - point1).normalized()
    plane_co = point1

    # 平面で切断
    result = bmesh.ops.bisect_plane(
        bm,
        geom=bm.faces[:] + bm.edges[:] + bm.verts[:],
        dist=0.001,
        plane_co=plane_co,
        plane_no=plane_normal,
    )

    # 切断後のジオメトリをフィルタリングしてエッジを取得
    edges = [ele for ele in result["geom_cut"] if isinstance(ele, bmesh.types.BMEdge)]

    # 分割処理（必要なら分割されたエッジに対して適用）
    if edges:
        bmesh.ops.split_edges(bm, edges=edges)

    # 結果をメッシュに適用
    bm.to_mesh(cube.data)
    bm.free()

    # メッシュを更新
    cube.data.update()
    bpy.context.view_layer.update()  # 表示の更新

    # オブジェクトを2つに分けるために、編集モードで切断面を分ける
    bpy.context.view_layer.objects.active = cube
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')

    # 切断後のオブジェクトを取得
    separated_objects = [obj for obj in bpy.context.view_layer.objects if obj != original_cube]

    # 切断後のオブジェクトに Geometry001, Geometry002 を付ける
    for i, obj in enumerate(separated_objects):
        obj.name = f"Geometry{i+1:03}"

    # 切断面を追加
    for obj in separated_objects:
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='DESELECT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.fill_holes(sides=0)  # 全ての穴を埋める
        bpy.ops.object.mode_set(mode='OBJECT')

    return separated_objects  # 2つのオブジェクトがリストとして返される
