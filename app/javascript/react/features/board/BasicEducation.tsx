const BasicEducation = () => {
    return(
      <div className="py-2 space-y-4">
        <div>
          <h2 className="font-bold text-lg space-y-1">切断とは</h2>
            <p> 切断とは、<b>2つの立体に分けること</b>です。</p>
            <p> そのとき、<b>切断面は平ら</b>になっていなければなりません。</p>
            <p> NG: 切断面が曲がっていたり、ジグザグになっていたりする。</p>
            <p> OK: 切断面が平らで、完全に2つに分けることができた。</p>
            <p>切断するときは、大きな平らな包丁で一気に切り落とす、ようなイメージを持ちましょう。</p>
        </div>

        <div>
          <h2 className="font-bold text-lg space-y-1">切断の手順 3つ</h2>
          <h3>その1: 点が同じ面にある時、結んで良し!</h3>
          <h3>その2: 平行な面には、平行な切断線を引いて良し!</h3>
          <h3>その3: うつ手がなくなったら、延長すべし!(難易度: 高)</h3>
        </div>

        <div>
          <h2 className="font-bold text-lg space-y-1">気をつけること</h2>
          <b>切断線は、立体の表面だけありますか？</b>
          <p>切断とは完全に2つに分けることなのですから、表面に線がないのはおかしいです。</p>
          <p>もし切断線が立体の表面にない場合、それは切断が中途半端に終わっていることを意味します。</p>
          <p>つまり包丁が立方体の途中で止まってしまい、切断しきれていない状態です。</p>
        </div>

        <div>
         <h2 className="font-bold text-lg space-y-1">練習問題</h2>
        </div>
      </div>
    );
  };
  
  export default BasicEducation;
  