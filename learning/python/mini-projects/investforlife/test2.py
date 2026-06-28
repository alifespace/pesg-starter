from tickflow import TickFlow

# 初始化免费客户端
tf = TickFlow.free()

# 定义关注的标的
symbols = ["600000.SH", "512890.SH"]  # 可以替换成你的关注列表

# 方法一：为多个标的分别获取不同周期的数据（示例）
for symbol in symbols:
    # 获取日线 (1d) 数据
    df_daily = tf.klines.get(symbol, period="1d", count=10, as_dataframe=True)
    
    # 获取周线 (1w) 数据
    df_weekly = tf.klines.get(symbol, period="1w", count=10, as_dataframe=True)

    # 获取年线 (1Y) 数据
    df_yearly = tf.klines.get(symbol, period="1Y", count=10, as_dataframe=True)


print(df_daily,df_weekly, df_yearly)