from tickflow import TickFlow
import pandas as pd

tf = TickFlow.free()
# 获取 500 个交易日数据，确保 MA250 有足够的历史数据
df = tf.klines.get("512890.SH", period="1d", count=500, as_dataframe=True)

df['close'] = pd.to_numeric(df['close'])
df['MA20'] = df['close'].rolling(20).mean()
df['MA60'] = df['close'].rolling(60).mean()
df['MA250'] = df['close'].rolling(250).mean()

latest = df.iloc[-1]
print(f"收盘价：{latest['close']}")
print(f"MA20：{latest['MA20']}")
print(f"MA60：{latest['MA60']}")
print(f"MA250：{latest['MA250']}")

import sys
print(sys.executable)
print(sys.version)

import 