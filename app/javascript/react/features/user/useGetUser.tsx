import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"

export const useGetUser= () => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const { isLoggedIn, userName, logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userName || !isLoggedIn) return;

      try {
        const response = await fetch(`/api/users/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("通信に失敗しました");

        const data = await response.json();
        if (data.user && data.user.name === userName) {
          setName(data.user.name);
          setEmail(data.user.email);
        } else {
          logout();
        }
      } catch (error) {
        console.error("cut_cubeの取得に失敗しました", error);
      }
    };

    fetchUser();
  }, [isLoggedIn, userName, logout]);

  return { name, setName, email, setEmail };
};
