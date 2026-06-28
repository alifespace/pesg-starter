CREATE TABLE index_constituents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    index_code TEXT NOT NULL,         -- 指数代码，如 000300.SH（沪深300）
    stock_code TEXT NOT NULL,         -- 股票代码
    stock_market TEXT NOT NULL,
    in_date DATE NOT NULL,            -- 调入日期
    out_date DATE,                    -- 调出日期（NULL代表仍在成分股中）
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_idx_constituent ON index_constituents(index_code, stock_code);