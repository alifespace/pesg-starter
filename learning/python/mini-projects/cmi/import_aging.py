#!/usr/bin/env python3
"""
将 US AR Aging Excel 文件导入 cmidata.db

用法:
    python import_aging.py <excel文件路径>

示例:
    python import_aging.py "/path/to/US AR Aging_20260624.xlsx"
"""

import sys
import re
import sqlite3
from pathlib import Path
from datetime import datetime

import pandas as pd

# ---------- 默认路径 ----------
DB_PATH = "/Users/jamesl/Library/CloudStorage/GoogleDrive-nxtagentimes@gmail.com/我的云端硬盘/6. CMI/数据集/cmidata.db"


def parse_import_date(excel_path: str) -> str:
    """从文件名末尾提取8位日期，转为 YYYY-MM-DD 格式。"""
    stem = Path(excel_path).stem
    m = re.search(r"(\d{8})$", stem)
    if m:
        return datetime.strptime(m.group(1), "%Y%m%d").strftime("%Y-%m-%d")
    # fallback: 取文件修改时间
    mtime = Path(excel_path).stat().st_mtime
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")


def read_and_clean(excel_path: str) -> pd.DataFrame:
    """读取 Excel 第一个 sheet，自动识别 header，清洗数据。"""
    # 找 header 行（包含 "Customer" 的行）
    df_raw = pd.read_excel(excel_path, sheet_name=0, header=None)
    header_row = None
    for i, row in df_raw.iterrows():
        if any(str(v).strip() == "Customer" for v in row.values if pd.notna(v)):
            header_row = i
            break
    if header_row is None:
        raise ValueError("无法在 Excel 中找到 'Customer' 列头")

    # 读取数据
    df = pd.read_excel(excel_path, sheet_name=0, header=header_row)
    df.columns = [str(c).strip() for c in df.columns]

    # 去除空行和 Grand Total 汇总行
    df = df[df["Customer"].notna() & (df["Customer"] != "Grand Total")].copy()

    # 金额列转数值
    amount_cols = ["0", "30", "90", "180", "360", "1+ Year", "Credit Note", "Grand Total"]
    for col in amount_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    return df.reset_index(drop=True)


def import_to_db(df: pd.DataFrame, import_date: str, db_path: str = DB_PATH) -> None:
    """将数据导入 SQLite，同一天重复导入会先删除旧数据。"""
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # 建表
    cur.execute("""
        CREATE TABLE IF NOT EXISTS ar_aging (
            customer     TEXT,
            currency     TEXT,
            aging_0      REAL,
            aging_30     REAL,
            aging_90     REAL,
            aging_180    REAL,
            aging_360    REAL,
            aging_1y     REAL,
            credit_note  REAL,
            grand_total  REAL,
            import_date  TEXT
        )
    """)

    # 删除同一天旧数据
    cur.execute("DELETE FROM ar_aging WHERE import_date = ?", (import_date,))
    deleted = cur.rowcount
    print(f"🗑️  删除旧记录: {deleted} 条")

    # 写入
    rows = []
    for _, r in df.iterrows():
        rows.append((
            r["Customer"], r["Currency"],
            r.get("0", 0), r.get("30", 0), r.get("90", 0),
            r.get("180", 0), r.get("360", 0), r.get("1+ Year", 0),
            r.get("Credit Note", 0), r.get("Grand Total", 0),
            import_date,
        ))

    cur.executemany("""
        INSERT INTO ar_aging
            (customer, currency, aging_0, aging_30, aging_90,
             aging_180, aging_360, aging_1y, credit_note, grand_total, import_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()

    # 汇总
    cur.execute("SELECT COUNT(*) FROM ar_aging WHERE import_date = ?", (import_date,))
    count = cur.fetchone()[0]

    stats = [
        ("aging_0",     "0"),
        ("aging_30",    "30"),
        ("aging_90",    "90"),
        ("aging_180",   "180"),
        ("aging_360",   "360"),
        ("aging_1y",    "1+ Year"),
        ("grand_total", "Grand Total"),
    ]

    print(f"\n✅ 导入完成！")
    print(f"{'─'*40}")
    print(f"📅 导入日期:  {import_date}")
    print(f"📋 记录条数:  {count}")
    print(f"{'─'*40}")
    for col, label in stats:
        cur.execute(f"SELECT SUM({col}) FROM ar_aging WHERE import_date = ?", (import_date,))
        total = cur.fetchone()[0] or 0
        print(f"  💰 {label:15s} {total:>15,.2f}")
    print(f"{'─'*40}")

    conn.close()


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    excel_path = sys.argv[1]
    if not Path(excel_path).exists():
        print(f"❌ 文件不存在: {excel_path}")
        sys.exit(1)

    print(f"📂 Excel 文件: {excel_path}")

    import_date = parse_import_date(excel_path)
    print(f"📅 导入日期: {import_date}")

    df = read_and_clean(excel_path)
    print(f"📊 读取 {len(df)} 条记录")

    import_to_db(df, import_date)


if __name__ == "__main__":
    main()
