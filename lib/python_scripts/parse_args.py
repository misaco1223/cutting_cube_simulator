import sys
import json
from mathutils import Vector


def parse_args():
    args = sys.argv

    if "--" in args:
        args = args[args.index("--") + 1:]  # "--"以降の引数を取得
    else:
        args = []

    if len(args) != 1:
        raise ValueError("座標データ(JSON)が必要です")

    cut_data = json.loads(args[0])

    cut_id = cut_data.get("id")
    cut_points = cut_data.get("points")

    if not cut_id:
        raise ValueError("IDが見つかりません")

    if not cut_points or len(cut_points) != 3:
        raise ValueError("3つの座標が見つかりません")

    points = [
        Vector((point[0], point[1], point[2]))
        for point in cut_points
    ]

    return cut_id, points
