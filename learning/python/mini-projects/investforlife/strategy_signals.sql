CREATE TABLE strategy_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy_name TEXT NOT NULL,
    code TEXT NOT NULL,
    market TEXT NOT NULL,
    signal_date DATE NOT NULL,
    signal_type TEXT,                 -- buy/sell/hold
    price REAL,                       -- 触发信号时的价格
    signal_strength REAL,             -- 信号强度（0-1）
    params TEXT,                      -- 策略参数快照（JSON格式）
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(strategy_name, code, market, signal_date)
);

CREATE INDEX idx_signal_strategy_date ON strategy_signals(strategy_name, signal_date);