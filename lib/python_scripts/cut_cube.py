import bpy
import bmesh
from mathutils import Vector
import mathutils
import math


def convex_hull(verts):
    # Z軸で投影した2D座標のリスト
    points_2d = [(v.co.x, v.co.y) for v in verts]

    try:
        indices = mathutils.geometry.convex_hull_2d(points_2d)
    except ValueError as e:
        print("convex_hull_2d failed:", e)
        return []

    # インデックスから並び替えた頂点を返す
    sorted_verts = [verts[i] for i in indices]
    return sorted_verts

def calculate_volume(bm):
    # すべての面を三角形化してbm.facesにする
    bmesh.ops.triangulate(bm, faces=bm.faces[:])

    # 全頂点の平均（重心）を計算
    all_coords = [v.co for v in bm.verts]
    if not all_coords:
        return 0.0
    center = sum(all_coords, Vector()) / len(all_coords)

    total_volume = 0.0

    for face in bm.faces:
        # 三角形の時だけ進む
        if len(face.verts) != 3:
            continue 

        # 三角形の頂点座標を取得
        v1, v2, v3 = [v.co for v in face.verts]

        # 三角錐の体積 = |(v1 - center) ⋅ ((v2 - center) × (v3 - center))| / 6
        vec1 = v1 - center
        vec2 = v2 - center
        vec3 = v3 - center

        volume = abs(vec1.dot(vec2.cross(vec3))) / 6.0
        total_volume += volume

    return total_volume

def cut_cube(cube, points):
    point1, point2, point3 = points

    # もとのCubeを複製して残す
    # original_cube = cube.copy()
    # original_cube.data = cube.data.copy()
    # bpy.context.collection.objects.link(original_cube)
    # original_cube.name = "Cube"

    # BMeshで切断
    bm = bmesh.new()
    bm.from_mesh(cube.data)

    # 切断面に関するジオメトリ
    bm_cut = bmesh.new()

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
    edges = [ele for ele in result["geom_cut"]
             if isinstance(ele, bmesh.types.BMEdge)]

    if edges:
        # 切断によって分割されたエッジを適用
        bmesh.ops.split_edges(bm, edges=edges)
        for edge in edges:
            # それぞれのエッジのBMVertジオメトリを取得
            verts_in_face = [edge.verts[0].co, edge.verts[1].co]
            bm_cut.verts.new(verts_in_face[0])
            bm_cut.verts.new(verts_in_face[1])
    
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
    # separated_objects = [obj for obj in bpy.context.view_layer.objects if obj != original_cube]
    separated_objects = [obj for obj in bpy.context.view_layer.objects if obj]

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
    
    # 体積計算
    obj_volume = separated_objects[0]
    bm_volume = bmesh.new()
    bm_volume.from_mesh(obj_volume.data)
    volume = calculate_volume(bm_volume)
    bm_volume.free()
    ratio = volume/8
    print ("ratio:", ratio)

    # 切断面のためにリスト化する
    unique_verts = list(bm_cut.verts)

    # 頂点の順番を整える
    sorted_verts = convex_hull(unique_verts)
    
    if len(sorted_verts) >= 3:
        try:
            bm_cut.faces.new(sorted_verts)  # 頂点順に面を作成
        except ValueError:
            print("面の作成に失敗しました。頂点数が足りないか、他のエラーが発生しています。")
    else:
        print("頂点が不足しています。面を作成できません。")
       
    # bm_cutのジオメトリに法線を与える
    bm_cut.normal_update()

    # mesh_cutというメッシュオブジェクトにする
    mesh_cut = bpy.data.meshes.new("CutFace")
    bm_cut.to_mesh(mesh_cut)
    bm_cut.free()
    
    # object_cutという3Dオブジェクトにする
    obj_cut = bpy.data.objects.new("Geometry003", mesh_cut)
    bpy.context.collection.objects.link(obj_cut)

    return (separated_objects + [obj_cut], ratio)
