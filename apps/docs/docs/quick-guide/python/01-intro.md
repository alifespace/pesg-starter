---
title: python 环境设置
id: 1
---

## 安装 _uv_
```powershell
scoop install uv
```

## 使用 _uv_ 管理 _python_ 环境
```powershell
# 创建虚拟环境
uv venv --python 3.12

# python包管理
uv pip install requests

# 从 requirements.txt 安装所有依赖
uv pip install -r requirements.txt

# 卸载指定包
uv pip uninstall requests

# 显示已经安装的包
uv pip list

# 显示包信息
uv pip show requests

# 以 requirements.txt 格式列出所有已安装的包
uv pip freeze
```

