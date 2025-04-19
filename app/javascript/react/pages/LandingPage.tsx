import React from 'react';
import {useNavigate} from "react-router-dom"
import BoardCubeModel from '../features/board/create/BoardCubeModel';
import * as THREE from "three";
import LandCubeModel from '../hooks/LandCubeModel';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900">
      {/*ヒーロ-*/}
      <section
        className="text-white py-12 px-4"
        style={{ backgroundImage: 'url("/hero.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="max-w-7xl mx-auto text-center">
        <h1 className="lg:text-4xl text-xl font-extrabold leading-tight">立方体を切って学べる3D教材</h1>
        <p className="mt-4 lg:text-xl">
          切断・観察を通して、立体問題に強くなろう。
        </p>
        <div className="mt-6 mx-auto h-32 w-2/3">
          <LandCubeModel cutPoints={[new THREE.Vector3(-1, 1, 1), new THREE.Vector3(1, 1, -1), new THREE.Vector3(1, -1, 1)]}/>
        </div>
        <button onClick={() => navigate("/home")} className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition duration-300">
          今すぐ切断する
        </button>
      </div>
    </section>

    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-bold">アプリの特徴</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">シミュレーション機能</h3>
            <p className="mt-4">切断点を選び、切断して観察。</p>
            <img src="/landsec_feature1.png" className="mt-4 mx-auto w-full" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">学習サポート機能</h3>
            <p className="mt-4">履歴やマイページで、ふり返りをサポート。</p>
            <img src="/landsec_feature2.png"className="mt-4 mx-auto w-full" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">掲示板機能</h3>
            <p className="mt-4">
              切断を利用して問題を作成。<br/>
              掲示板で、学習をもっと楽しく。
            </p>
            <img src="/landsec_feature3.png" className="mt-4 mx-auto w-full" />
          </div>
        </div>
      </div>
    </section>

    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-bold">小学生にも使いやすく</h2>
        <p className="mt-4">
          切断点は辺の比の形式で直感的に選べます。</p>
          <img src="/landsec_support.png" className="h-full mx-auto max-w-72" />
      </div>
    </section>

    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-bold">切断ギャラリー</h2>
        <div className="mt-8">
          <p>立方体を自由に操作して、切断後の形を観察できます。</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 justify-center w-full">
          <img src="landsec_gallery1.gif" className="mx-auto"/>
          <img src="landsec_gallery2.gif" className="mx-auto"/>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default LandingPage;
