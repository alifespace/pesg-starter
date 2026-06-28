"""
使用 TickFlow 获取开放式场外基金信息（净值、收益率等）

开放式基金的"收盘价"就是基金净值（NAV, Net Asset Value），
通常分为：
  - 单位净值 (unit_nav):  每份基金的价值
  - 累计净值 (acc_nav):   单位净值 + 历史分红再投资
"""

from tickflow import TickFlow
import pandas as pd
from datetime import datetime, timedelta


# ====== 配置区域 ======
# 要查询的开放式基金代码（6位数字，无后缀）
FUND_CODES = ["110011", "000001", "005827", "161725"]
# =====================


def get_fund_basic_info(tf: TickFlow, fund_code: str):
    """获取基金基本信息"""
    try:
        info = tf.instruments.info(f"{fund_code}.OF")  # OF = Open-end Fund
        if info:
            print(f"  基金代码: {fund_code}")
            print(f"  基金名称: {info.get('name', 'N/A')}")
            print(f"  基金类型: {info.get('fund_type', 'N/A')}")
            print(f"  成立日期: {info.get('establish_date', 'N/A')}")
            print(f"  基金管理人: {info.get('fund_manager', 'N/A')}")
            return info
    except Exception as e:
        print(f"  ⚠️ 获取 {fund_code} 基本信息失败: {e}")
        return None


def get_fund_nav(tf: TickFlow, fund_code: str, count: int = 120):
    """获取基金历史净值数据（基金的"收盘价"）"""
    try:
        # 尝试获取基金净值数据
        symbol = f"{fund_code}.OF"
        df = tf.klines.get(symbol, period="1d", count=count, as_dataframe=True)

        if df is None or df.empty:
            return None

        # 标准化的净值数据列名
        nav_col = [c for c in df.columns if c.lower() in ('nav', 'unit_nav', 'close')]
        acc_nav_col = [c for c in df.columns if c.lower() in ('acc_nav', 'accumulated_nav')]
        date_col = [c for c in df.columns if c.lower() in ('date', 'trade_date', 'nav_date')]

        print(f"\n📊 {fund_code} 最近 {len(df)} 个交易日净值数据")
        print("-" * 65)
        print(f"{'日期':<12} {'单位净值':>10} {'累计净值':>10} {'日涨跌幅':>10}")
        print("-" * 65)

        # 显示前 5 条和后 5 条
        head = df.head(5)
        tail = df.tail(5)

        def print_rows(rows):
            for _, row in rows.iterrows():
                date_val = row.get('date', row.get('trade_date', ''))
                close_val = row.get('close', row.get('unit_nav', 0))
                acc_val = row.get('acc_nav', row.get('accumulated_nav', 0))
                pct_chg = row.get('pct_chg', row.get('change_pct', None))

                line = f"{str(date_val)[:10]:<12} {float(close_val):>10.4f} {float(acc_val):>10.4f}"
                if pct_chg is not None:
                    line += f" {float(pct_chg):>+9.2%}"
                else:
                    # 自己计算涨跌幅
                    line += "       N/A"
                print(line)

        print_rows(head)

        if len(df) > 10:
            print("  ... (中间省略) ...")

        print_rows(tail)

        # 统计信息
        print("-" * 65)
        latest = {
            'date': df['date'].iloc[-1] if 'date' in df.columns else 'N/A',
            'nav': df['close'].iloc[-1] if 'close' in df.columns else df.iloc[-1, :].iloc[0],
        }
        print(f"📈 最新净值日期: {latest['date']}")
        print(f"  最新单位净值: {latest['nav']:.4f}")

        if 'close' in df.columns and len(df) > 1:
            pct_1m = (df['close'].iloc[-1] / df['close'].iloc[-min(21, len(df))] - 1) * 100
            pct_3m = (df['close'].iloc[-1] / df['close'].iloc[-min(63, len(df))] - 1) * 100
            pct_6m = (df['close'].iloc[-1] / df['close'].iloc[-min(126, len(df))] - 1) * 100
            pct_1y = (df['close'].iloc[-1] / df['close'].iloc[0] - 1) * 100

            print(f"  近1月收益: {pct_1m:+.2f}%")
            print(f"  近3月收益: {pct_3m:+.2f}%")
            print(f"  近6月收益: {pct_6m:+.2f}%")
            print(f"  区间收益:  {pct_1y:+.2f}%")

        return df

    except Exception as e:
        print(f"  ⚠️ 获取 {fund_code} 净值数据失败: {e}")
        return None


def main():
    print("=" * 65)
    print("🚀 TickFlow 开放式基金净值查询工具")
    print(f"   查询基金: {', '.join(FUND_CODES)}")
    print("=" * 65)

    # 初始化 TickFlow
    tf = TickFlow.free()

    # 遍历每个基金
    for code in FUND_CODES:
        print(f"\n{'=' * 65}")
        print(f"🔍 [{code}]")
        print(f"{'=' * 65}")

        # 1. 获取基金基本信息
        print("\n📋 基本信息:")
        print("-" * 40)
        get_fund_basic_info(tf, code)

        # 2. 获取基金历史净值（基金的"收盘价"）
        get_fund_nav(tf, code, count=252)  # 约一年数据

    print(f"\n{'=' * 65}")
    print("✅ 查询完成！")
    print("=" * 65)


if __name__ == "__main__":
    main()