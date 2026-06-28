CREATE TABLE adjustments (
    code TEXT NOT NULL,
    market TEXT NOT NULL,
    trade_date DATE NOT NULL,
    adj_factor REAL NOT NULL,         -- 复权因子
    adjust_type TEXT DEFAULT 'hfq',   -- 复权类型：hfq(后复权)/qfq(前复权)
    data_source TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, market, trade_date, adjust_type)
);