```bash
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install notebook ipykernel
python -m ipykernel install --user --name=learning-python --display-name "Python (learning-python)"
python -m pip install jupyterlab pandas matplotlib numpy
jupyter kernelspec list  # 验证是否成功
```
