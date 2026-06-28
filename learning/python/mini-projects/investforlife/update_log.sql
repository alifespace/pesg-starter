CREATE TABLE update_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    market TEXT NOT NULL,
    last_update_date DATE,            -- 最后成功更新的日期
    last_attempt_date DATE,           -- 最后尝试更新的日期
    error_count INTEGER DEFAULT 0,    -- 连续失败次数
    status TEXT DEFAULT 'active',     -- active/suspended/failed
    notes TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, market)
);