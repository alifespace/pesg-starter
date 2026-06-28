import sqlite3
import pandas as pd
from datetime import datetime, date
from tickflow import TickFlow

# 1. 连接数据库
conn = sqlite3.connect('cn_stock.db')
cursor = conn.cursor()

# 2. 初始化 TickFlow（免费版，无需 API key）
tf = TickFlow.free()

# 3. 获取标的信息（以 512890 为例）
symbol = "512890.SH"
instruments = tf.instruments.batch(symbols=[symbol])
print(f"标的信息: {instruments}")

# 4. 获取历史日K线数据（拉取全部可用历史）
df = tf.klines.get(symbol, period="1d", count=10000, as_dataframe=True)
# 或者用 count=1000 限制条数，-1 拉取全量，但免费服务可能有条数上限限制

# 5. 数据预处理
df = df.rename(columns={
    'date': 'trade_date',
    'open': 'open',
    'high': 'high',
    'low': 'low',
    'close': 'close',
    'volume': 'volume',
    'amount': 'amount'
})
df['code'] = symbol.split('.')[0]
df['market'] = symbol.split('.')[1]

# 6. 写入数据库（覆盖更新：INSERT OR REPLACE）
for _, row in df.iterrows():
    cursor.execute("""
        INSERT OR REPLACE INTO daily_klines 
        (code, market, trade_date, open, high, low, close, volume, amount, data_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        row['code'], row['market'], row['trade_date'],
        row['open'], row['high'], row['low'], row['close'],
        row['volume'], row['amount'], 'tickflow'
    ))

conn.commit()
conn.close()
print("数据写入完成！")