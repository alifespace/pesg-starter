// src/App.jsx (或 .tsx)

function App() {
  return (
    // 使用 Flexbox 让整个页面内容垂直水平居中
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      {/* 卡片容器 */}
      <div className="max-w-md w-full p-8 space-y-6 bg-slate-800 rounded-xl shadow-lg">
        {/* 头部 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400">
            Tailwind CSS Test
          </h1>
          <p className="mt-2 text-slate-400">Vite + React + Hono Stack</p>
        </div>

        {/* 分隔线 */}
        <hr className="border-slate-600" />

        {/* 内容区域 */}
        <div className="space-y-4">
          <p>
            如果这个卡片样式正常显示，说明 Tailwind CSS 已经成功集成到你的 Vite
            + React 项目中了。
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Flexbox 和间距 (Spacing)</li>
            <li>颜色 (Colors) 和字体 (Typography)</li>
            <li>圆角 (Rounded corners) 和阴影 (Shadows)</li>
          </ul>
        </div>

        {/* 交互式按钮 */}
        <button className="w-full px-4 py-2 font-semibold text-black bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200">
          Hover over me!
        </button>
      </div>
    </div>
  );
}

export default App;
