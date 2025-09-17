import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 这个useEffect用来处理从邮件链接中获取的session
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Supabase在URL hash中设置了恢复所需的session
        // 这里不需要我们手动做什么，Supabase客户端会自动处理
        // 我们可以给用户一些提示
        setMessage("已验证邮箱，请输入您的新密码。");
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("密码更新成功！即将跳转到登录页面...");
      setTimeout(() => navigate("/signin"), 3000);
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
