---
sidebar_position: 1
---

# 简介

## 全栈开发

全栈开发涉及多个技术、产品和服务。从大的方面来说，至少包括三个层次：

- 前端：主要用于页面的展现，实现与用户的交互；
- 后端：实现各种业务功能，并且保障业务的平稳运行；
- 服务商：负责提供各种后端服务的基础架构，包括服务器、域名处理等；

仅前端的技术就包括 _Javascript/Typescript_, _html, css_, 各类框架, 后端的技术包括数据库，鉴权， 函数调用，消息队列，文件存储，文档处理，域名托管，与 _AI_ 互动等诸多事项。对于服务商，也要考虑这些服务商能提供的服务种类以及成本。并且还包括在这之下的开发工具，工具链的选择，软件版本/仓库管理，冲突解决等事宜。

## 目标

本教程的目标还是为了把各个技术环节用最简要的信息提供最基础的功能，使得在这个技术迅速进展的时代，能够用合理的方法快速搭建出一套基本能够满足日常需要的 _Web_ 应用。

## 服务选择

主要的服务选择包括 _Cloudflare_，_Google Cloud Platform_，_Supabase_，_Vercel_。选择这几家的服务主要是考虑功能和价格的因素，在初期主要集中在 _Cloudflare_ 和 _Supabase_。其中 _cloudflare_ 完成了大部分服务的提供，如：网站、云函数、存储、数据库、_KV_、消息队列等功能。_Supabase_ 则实现了大部分鉴权、授权、高并发数据库的功能。

### _Cloudflare_

- _Workers & Web Pages Functions: Up to 10ms CPU time per request, Up to 100,000 per day (UTC+0)_；
- _R2: Storage 10 GB-month / month, Class A Operations 1 million requests / month, Class B Operations 10 million requests / month, Egress (data transfer to Internet) Free_；
- _D1: Serverless SQL database, Up to 5 million rows read per day, Up to 100,000 rows written per day, 5GB of included storage_；
- _KV: Global low-latency key-value edge storage, Up to 100,000 read operations per day, Up to 1,000 write, delete, list operations per day_；
- _Durable Objects: Serverless compute and SQL database, Up to 100,000 requests per day, Up to 13,000 GB-sec of duration per day, Up to 5 million rows read per day, Up to 100,000 rows written per day, 5GB of included storage_；

### _Supabase_

- 无限 _API_ 请求；
- 每月 _50,000_ 活跃用户（_MAU_）；
- 数据库容量：_500 MB_；
- 共享 _CPU + 500 MB RAM_；
- 带宽出口（_Egress_）：_5 GB_；
- 缓存带宽出口：_5 GB_；
- 文件存储容量：_1 GB_；

### 前端技术栈

- 开发语言：_Javascript/Typescript, Tailwindcss_；
- 框架结构：_Vue, Nuxt_；
- 仓库管理：_Monorepo, pnpm_；
- 开发软体：_VSCode_；

### 后端技术栈

- 开发语言：_Javascript/Typescript_；
- 数据库：_SQLite, PostgreSQL_；
- 文档管理后台：_Docusaurus_；
- 服务 _API_：_Wrangler, Supabase_；