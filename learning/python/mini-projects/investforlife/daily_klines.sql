CREATE TABLE daily_klines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,               -- 标的代码
    market TEXT NOT NULL,             -- 市场
    trade_date DATE NOT NULL,         -- 交易日
    open REAL,                        -- 开盘价
    high REAL,                        -- 最高价
    low REAL,                         -- 最低价
    close REAL,                       -- 收盘价
    volume REAL,                      -- 成交量（单位：手）
    amount REAL,                      -- 成交额（单位：元）
    turnover_rate REAL,               -- 换手率（%）
    pe_ttm REAL,                      -- 滚动市盈率（仅股票）
    pb REAL,                          -- 市净率（仅股票）
    total_mv REAL,                    -- 总市值（元，仅股票）
    free_mv REAL,                     -- 流通市值（元，仅股票）
    data_source TEXT,                 -- 数据来源（tickflow/akshare/tushare）
    extra_data TEXT,                  -- JSON扩展字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, market, trade_date)  -- 重要：确保覆盖更新
);

CREATE INDEX idx_daily_code_date ON daily_klines(code, market, trade_date);
CREATE INDEX idx_daily_trade_date ON daily_klines(trade_date);