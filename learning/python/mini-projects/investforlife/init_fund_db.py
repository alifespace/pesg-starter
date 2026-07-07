#!/usr/bin/env python3
"""
初始化基金数据库并导入 110011 测试数据
"""

import sqlite3
import akshare as ak
from pathlib import Path
from datetime import datetime

DB_PATH = Path("fund.db")
SCHEMA_PATH = Path("schema.sql")

# ── 1. 建表 ──
print("🔧 初始化数据库...")
conn = sqlite3.connect(DB_PATH)
conn.executescript(SCHEMA_PATH.read_text())
print(f"   ✅ 数据库: {DB_PATH}")

# ── 2. 导入基金 110011 ──
FUND_CODE = "110011"
print(f"\n📥 导入基金 {FUND_CODE}...")

# 2.1 基金基本信息
info = ak.fund_individual_basic_info_xq(symbol=FUND_CODE)
info_dict = dict(zip(info["item"], info["value"]))
conn.execute("""
    INSERT OR REPLACE INTO fund_info
    (fund_code, fund_name, fund_full_name, fund_type, establish_date,
     fund_company, custodian_bank, benchmark, strategy, objective, update_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    FUND_CODE,
    info_dict.get("基金名称"),
    info_dict.get("基金全称"),
    info_dict.get("基金类型"),
    info_dict.get("成立时间"),
    info_dict.get("基金公司"),
    info_dict.get("托管银行"),
    info_dict.get("业绩比较基准"),
    info_dict.get("投资策略"),
    info_dict.get("投资目标"),
    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
))
print(f"   ✅ 基金信息: {info_dict.get('基金名称')}")

# 2.2 基金经理
manager_str = info_dict.get("基金经理", "")
for name in manager_str.split():
    name = name.strip()
    if name:
        conn.execute("""
            INSERT OR REPLACE INTO fund_manager (fund_code, manager_name, is_current)
            VALUES (?, ?, 1)
        """, (FUND_CODE, name))
print(f"   ✅ 基金经理: {manager_str}")

# 2.3 单位净值 + 累计净值
print(f"   📈 导入净值数据...")
df_nav = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="单位净值走势")
df_cum = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="累计净值走势")

# 统一列名
df_nav.columns = ["nav_date", "unit_nav", "daily_return"]
df_cum.columns = ["nav_date", "cumulative_nav"]

# 转换日期格式
df_nav["nav_date"] = df_nav["nav_date"].astype(str)
df_cum["nav_date"] = df_cum["nav_date"].astype(str)

# 合并：以单位净值表为主，左连接累计净值
df_merged = df_nav.merge(df_cum, on="nav_date", how="left")
df_merged["fund_code"] = FUND_CODE

conn.executemany("""
    INSERT OR REPLACE INTO fund_nav (fund_code, nav_date, unit_nav, cumulative_nav, daily_return)
    VALUES (?, ?, ?, ?, ?)
""", df_merged[["fund_code", "nav_date", "unit_nav", "cumulative_nav", "daily_return"]].values.tolist())
print(f"   ✅ 净值: {len(df_merged)} 条")

# 2.4 分红记录
df_div = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="分红送配详情")
if len(df_div) > 0:
    for _, row in df_div.iterrows():
        # 解析分红金额
        div_text = row.get("每份分红", "")
        div_amount = None
        if "派现金" in div_text:
            try:
                div_amount = float(div_text.split("派现金")[1].replace("元", ""))
            except:
                pass

        conn.execute("""
            INSERT OR REPLACE INTO fund_dividend
            (fund_code, dividend_year, record_date, ex_date, dividend_per_share, dividend_amount, payment_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            FUND_CODE,
            row.get("年份"),
            row.get("权益登记日"),
            row.get("除息日"),
            div_text,
            div_amount,
            row.get("分红发放日"),
        ))
    print(f"   ✅ 分红: {len(df_div)} 条")

# 2.5 持仓数据
print(f"   📋 导入持仓数据...")
df_hold = ak.fund_portfolio_hold_em(symbol=FUND_CODE, date="2025")
if len(df_hold) > 0:
    for _, row in df_hold.iterrows():
        conn.execute("""
            INSERT OR REPLACE INTO fund_holding
            (fund_code, report_period, stock_code, stock_name, weight_pct, shares, market_value)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            FUND_CODE,
            row.get("季度"),
            row.get("股票代码"),
            row.get("股票名称"),
            row.get("占净值比例"),
            row.get("持股数"),
            row.get("持仓市值"),
        ))
    print(f"   ✅ 持仓: {len(df_hold)} 条")

conn.commit()

# ── 3. 验证 ──
print(f"\n📊 数据库验证:")
for table in ["fund_info", "fund_nav", "fund_dividend", "fund_holding", "fund_manager"]:
    count = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"   {table}: {count} 条")

# 显示汇总视图
print(f"\n📋 基金汇总:")
for row in conn.execute("SELECT * FROM v_fund_summary").fetchall():
    print(f"   {row}")

conn.close()
print(f"\n✅ 完成！数据库: {DB_PATH.absolute()}")
