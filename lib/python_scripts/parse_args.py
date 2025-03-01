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
    
    cut_points = json.loads(args[0])

    points = [
        Vector((point[0], point[1], point[2]))
        for point in cut_points
    ]

    if len(points) != 3:
        raise ValueError("3つの座標が必要です")
    
    return points