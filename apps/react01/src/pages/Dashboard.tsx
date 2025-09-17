import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 定义一个类型来描述我们期望从 API 收到的数据结构
type ApiResponse = {
  message: string;
  jwt_payload: object; // 假设后端会返回解码后的 payload
  timestamp: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- 新增 State ---
  // 用于存储来自 /rtest/03 API 的响应
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  // 用于跟踪 API 调用的加载状态
  const [isApiLoading, setIsApiLoading] = useState(false);
  // 用于存储 API 调用的错误信息
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("获取会话失败:", error);
        navigate("/signin");
        return;
      }

      if (data.session) {
        setUser(data.session.user);
      } else {
        alert("请先登录以访问此页面。");
        navigate("/signin");
      }
      setLoading(false);
    };

    checkUserSession();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("退出登录时出错:", error);
    } else {
      navigate("/signin");
    }
  };

  // --- 新增 API 调用函数 ---
  const handleApiCall = async () => {
    // 重置状态
    setIsApiLoading(true);
    setApiError(null);
    setApiResponse(null);

    try {
      // 1. 获取当前会话，其中包含 access_token (JWT)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("用户未认证，无法获取 JWT。");
      }

      // 2. 使用 fetch API 调用后端接口，并附带 Authorization header
      console.log(`${API_BASE_URL}/rtest/03`);
      const response = await fetch(`${API_BASE_URL}/rtest/03`, {
        method: "GET",
        headers: {
          // 'Authorization' 是标准，'Bearer' 是规范
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        // 如果 HTTP 状态码不是 2xx，则抛出错误
        throw new Error(`API 请求失败，状态码: ${response.status}`);
      }

      // 3. 解析 JSON 响应并更新 state
      const result: ApiResponse = await response.json();
      setApiResponse(result);
    } catch (err: unknown) {
      // 1. 将类型从 any 改为 unknown
      console.error("调用 API 时出错:", err);

      // 2. 添加类型守卫来安全地访问 .message 属性
      if (err instanceof Error) {
        // 在这个代码块里, TypeScript 知道 err 是一个 Error 对象
        setApiError(err.message);
      } else {
        // 如果抛出的不是一个 Error 对象，提供一个通用错误信息
        setApiError("发生了一个未知的错误");
      }
    } finally {
      // 无论成功或失败，都结束加载状态
      setIsApiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">正在验证您的身份...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">欢迎来到仪表盘</h1>
          {user && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md">
              <p className="text-lg text-green-800">
                用户: <span className="font-semibold">{user.email}</span>{" "}
                已成功登录。
              </p>
            </div>
          )}
          <p className="mt-2 text-gray-600">
            这里是只有登录用户才能看到的内容。
          </p>
        </div>

        {/* --- 新增 UI 元素 --- */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            后端 API 测试
          </h2>
          <button
            onClick={handleApiCall}
            disabled={isApiLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isApiLoading ? "正在请求..." : "请求 /rtest/03 (携带JWT)"}
          </button>

          {/* 根据状态显示 API 响应、错误或加载信息 */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md min-h-[100px] text-left">
            {isApiLoading && (
              <p className="text-gray-500">正在等待后端响应...</p>
            )}
            {apiError && (
              <p className="text-red-600">
                <strong>错误:</strong> {apiError}
              </p>
            )}
            {apiResponse && (
              <div>
                <h3 className="font-bold text-gray-700">API 响应成功:</h3>
                {/* 使用 pre 标签可以很好地格式化 JSON 输出 */}
                <pre className="mt-2 text-sm text-gray-800 bg-gray-200 p-2 rounded overflow-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
            {!isApiLoading && !apiError && !apiResponse && (
              <p className="text-gray-500">点击按钮以获取数据。</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
