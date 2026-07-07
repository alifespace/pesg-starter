#!/usr/bin/env python3
"""
基金 110011（易方达优质精选混合）历史数据测试
"""

import akshare as ak
import pandas as pd
from pathlib import Path

FUND_CODE = "110011"
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

print(f"{'='*60}")
print(f"📊 基金 {FUND_CODE} 历史数据获取测试")
print(f"{'='*60}")

# ── 1. 单位净值 ──
print(f"\n📈 1. 单位净值走势")
df_nav = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="单位净值走势")
print(f"   共 {len(df_nav)} 条 | 最新 5 条:")
print(df_nav.tail(5).to_string(index=False))
df_nav.to_csv(OUTPUT_DIR / f"{FUND_CODE}_单位净值.csv", index=False)

# ── 2. 累计净值 ──
print(f"\n📈 2. 累计净值走势")
df_cum = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="累计净值走势")
print(f"   共 {len(df_cum)} 条 | 最新 5 条:")
print(df_cum.tail(5).to_string(index=False))
df_cum.to_csv(OUTPUT_DIR / f"{FUND_CODE}_累计净值.csv", index=False)

# ── 3. 分红记录 ──
print(f"\n💰 3. 历史分红")
df_div = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="分红送配详情")
if len(df_div) > 0:
    print(df_div.to_string(index=False))
    df_div.to_csv(OUTPUT_DIR / f"{FUND_CODE}_分红.csv", index=False)
else:
    print("   无分红记录")

# ── 4. 拆分记录 ──
print(f"\n✂️  4. 拆分详情")
df_split = ak.fund_open_fund_info_em(symbol=FUND_CODE, indicator="拆分详情")
if len(df_split) > 0:
    print(df_split.to_string(index=False))
else:
    print("   无拆分记录")

# ── 5. 基金详情（含基金经理）──
print(f"\n👤 5. 基金详情")
df_info = ak.fund_individual_basic_info_xq(symbol=FUND_CODE)
for _, row in df_info.iterrows():
    val = str(row["value"])[:80]
    print(f"   {row['item']}: {val}")

# ── 6. 基金持仓 ──
print(f"\n📋 6. 最新季报持仓 Top 10")
df_hold = ak.fund_portfolio_hold_em(symbol=FUND_CODE, date="2025")
if len(df_hold) > 0:
    # 只取第一条（最新季度）
    latest_q = df_hold["季度"].unique()[0]
    df_latest = df_hold[df_hold["季度"] == latest_q].head(10)
    print(f"   {latest_q}")
    print(df_latest[["序号", "股票代码", "股票名称", "占净值比例"]].to_string(index=False))
    df_hold.to_csv(OUTPUT_DIR / f"{FUND_CODE}_持仓.csv", index=False)
else:
    print("   无持仓数据")

# ── 汇总 ──
print(f"\n{'='*60}")
print(f"✅ 数据已保存到 {OUTPUT_DIR}/")
print(f"   - {FUND_CODE}_单位净值.csv")
print(f"   - {FUND_CODE}_累计净值.csv")
print(f"   - {FUND_CODE}_分红.csv")
print(f"   - {FUND_CODE}_持仓.csv")
print(f"{'='*60}")
