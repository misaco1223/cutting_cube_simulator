import { useState, useEffect } from "react";

export const useGetGlbUrl = (id: string | undefined) => {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCutCube = async (id: string | undefined) => {
      if (!id) return;
      try {
        const response = await fetch(`/api/cut_cube/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("通信に失敗しました");

        const data = await response.json();
        if (data.glb_url) {
          setGlbUrl(data.glb_url);
        }
      } catch (error) {
        console.error("cut_cubeの取得に失敗しました", error);
      }
    };

    fetchCutCube(id);
  }, [id]);

  return glbUrl;
};
