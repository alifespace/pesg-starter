CREATE TABLE securities (
    code TEXT NOT NULL,
    market TEXT NOT NULL,
    name TEXT,
    instrument_type TEXT NOT NULL,
    list_date DATE,
    delist_date DATE,
    is_active BOOLEAN DEFAULT 1,
    notes TEXT,
    extra_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (code, market)
);