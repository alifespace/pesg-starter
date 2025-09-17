import React from "react";
import { Link } from "react-router-dom";

const WorkInProgress: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">页面建设中</h1>
      <p className="text-lg text-gray-600 mb-8">此功能即将上线，敬请期待！</p>
      <Link
        to="/signin" // 提供一个返回登录页的链接
        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        返回登录
      </Link>
    </div>
  );
};

export default WorkInProgress;
