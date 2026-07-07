-- ============================================
-- 中国基金数据库设计
-- 适用: SQLite3
-- 支持: 多只基金的历史净值、分红、持仓、基金经理
-- ============================================

-- 1. 基金基本信息（主表）
CREATE TABLE IF NOT EXISTS fund_info (
    fund_code       TEXT PRIMARY KEY,        -- 基金代码 (如 110011)
    fund_name       TEXT NOT NULL,           -- 基金名称
    fund_full_name  TEXT,                    -- 基金全称
    fund_type       TEXT,                    -- 基金类型 (混合/股票/债券/QDII等)
    establish_date  TEXT,                    -- 成立日期
    fund_company    TEXT,                    -- 基金公司
    custodian_bank  TEXT,                    -- 扣管银行
    benchmark       TEXT,                    -- 业绩比较基准
    strategy        TEXT,                    -- 投资策略
    objective       TEXT,                    -- 投资目标
    latest_scale    REAL,                    -- 最新规模(亿份)
    update_time     TEXT                     -- 最后更新时间
);

-- 2. 每日净值（核心高频表）
CREATE TABLE IF NOT EXISTS fund_nav (
    fund_code       TEXT NOT NULL,           -- 基金代码
    nav_date        TEXT NOT NULL,           -- 净值日期 (YYYY-MM-DD)
    unit_nav        REAL,                    -- 单位净值
    cumulative_nav  REAL,                    -- 累计净值
    daily_return    REAL,                    -- 日增长率 (%)
    PRIMARY KEY (fund_code, nav_date),
    FOREIGN KEY (fund_code) REFERENCES fund_info(fund_code)
);

-- 3. 分红记录
CREATE TABLE IF NOT EXISTS fund_dividend (
    fund_code       TEXT NOT NULL,           -- 基金代码
    dividend_year   TEXT,                    -- 年份 (如 2021年)
    record_date     TEXT,                    -- 权益登记日
    ex_date         TEXT,                    -- 除息日
    dividend_per_share TEXT,                 -- 每份分红 (如 每份派现金0.9000元)
    dividend_amount REAL,                    -- 每份分红金额(元) - 解析后的数值
    payment_date    TEXT,                    -- 分红发放日
    PRIMARY KEY (fund_code, record_date),
    FOREIGN KEY (fund_code) REFERENCES fund_info(fund_code)
);

-- 4. 持仓明细（季报/年报）
CREATE TABLE IF NOT EXISTS fund_holding (
    fund_code       TEXT NOT NULL,           -- 基金代码
    report_period   TEXT NOT NULL,           -- 报告期 (如 2025年1季度)
    stock_code      TEXT,                    -- 股票代码
    stock_name      TEXT,                    -- 股票名称
    weight_pct      REAL,                    -- 占净值比例 (%)
    shares          REAL,                    -- 持股数(万股)
    market_value    REAL,                    -- 持仓市值(万元)
    PRIMARY KEY (fund_code, report_period, stock_code),
    FOREIGN KEY (fund_code) REFERENCES fund_info(fund_code)
);

-- 5. 基金经理（当前 & 历史变更）
CREATE TABLE IF NOT EXISTS fund_manager (
    fund_code       TEXT NOT NULL,           -- 基金代码
    manager_name    TEXT NOT NULL,           -- 基金经理姓名
    is_current      INTEGER DEFAULT 1,       -- 是否现任 (1=现任, 0=离任)
    start_date      TEXT,                    -- 任职日期
    end_date        TEXT,                    -- 离任日期 (NULL=在任)
    PRIMARY KEY (fund_code, manager_name),
    FOREIGN KEY (fund_code) REFERENCES fund_info(fund_code)
);

-- ============================================
-- 索引（加速查询）
-- ============================================
CREATE INDEX IF NOT EXISTS idx_nav_date ON fund_nav(nav_date);
CREATE INDEX IF NOT EXISTS idx_nav_code ON fund_nav(fund_code);
CREATE INDEX IF NOT EXISTS idx_holding_period ON fund_holding(report_period);
CREATE INDEX IF NOT EXISTS idx_dividend_code ON fund_dividend(fund_code);

-- ============================================
-- 视图（常用查询）
-- ============================================

-- 最新净值视图
CREATE VIEW IF NOT EXISTS v_latest_nav AS
SELECT n.fund_code, f.fund_name, n.nav_date, n.unit_nav, n.cumulative_nav, n.daily_return
FROM fund_nav n
JOIN fund_info f ON n.fund_code = f.fund_code
WHERE n.nav_date = (
    SELECT MAX(nav_date) FROM fund_nav WHERE fund_code = n.fund_code
);

-- 基金汇总视图
CREATE VIEW IF NOT EXISTS v_fund_summary AS
SELECT
    f.fund_code,
    f.fund_name,
    f.fund_type,
    f.latest_scale,
    (SELECT COUNT(*) FROM fund_nav WHERE fund_code = f.fund_code) AS nav_days,
    (SELECT COUNT(*) FROM fund_dividend WHERE fund_code = f.fund_code) AS dividend_count,
    (SELECT unit_nav FROM fund_nav WHERE fund_code = f.fund_code ORDER BY nav_date DESC LIMIT 1) AS latest_nav,
    GROUP_CONCAT(DISTINCT m.manager_name) AS managers
FROM fund_info f
LEFT JOIN fund_manager m ON f.fund_code = m.fund_code AND m.is_current = 1
GROUP BY f.fund_code;
