import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 从 URL hash 或 query 获取 access_token
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Supabase 会把 token 放在 URL #access_token=xxx
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hash.get("access_token");
    if (accessToken) {
      setToken(accessToken);
      setMessage("已验证邮箱，请输入新密码。");
    } else {
      setError("链接无效或已过期。");
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("缺少访问令牌，无法更新密码。");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("https://api01.riplon.net/v1/updatepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 带上 token
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "更新失败");

      setMessage("密码更新成功！即将跳转到登录页面...");
      setTimeout(() => navigate("/signin"), 2500);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">设置新密码</h1>
        </div>
        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              新密码
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "更新中..." : "更新密码"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
