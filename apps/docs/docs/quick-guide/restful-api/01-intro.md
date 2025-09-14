---
title: 建立 restful API 能力
id: 1
---

## 为什么 _Serverless_ 适合 _Restful API_

**1. 按需伸缩**
- _REST API_ 往往是事件驱动（请求来了就处理，没请求就闲着）；
- _Serverless_ 正好是这种模式：请求触发 → 执行 → 返回 → 释放资源；
- 省钱：流量少的时候几乎没有成本；

**2.快速开发 & 部署**
- _REST API_ 大多数路由逻辑相对独立（`/users、/orders` 等），用 _Serverless_ 可以按函数/文件划分，天然模块化；
- 配合 _Cloudflare Worker、Vercel、Netlify_，改一行代码就能快速上线；

**3.高可用 & 全球分布**
- 比如 _Cloudflare Worker_ → 全球边缘节点运行 → _REST API_ 的响应速度比传统单一区域服务器更快；

## 潜在限制

**1.长连接 / 状态保持差**
- _REST API_ 偏向短请求，很合适；
- 但如果需要 _WebSocket_、长轮询、流式推送，_Serverless_ 就比较受限；

**2.性能和冷启动**
- 对于高 _QPS_、低延迟要求极高的 _API，Serverless_ 的冷启动可能是瓶颈；
- 不过在 _Cloudflare Worker_ 这种 _V8 isolate_ 模型里，冷启动几乎可以忽略；

**3.数据库连接池问题**

- _Serverless_ 没有常驻进程，传统数据库连接池（如 _Postgres pg-pool_）会失效；
- 解决方式：
    - 用支持 _HTTP_ 协议的驱动/中间件（_Supabase、Prisma Data Proxy、Drizzle + Postgres.js_）；
    - 或者用 _Cloudflare D1_ 这类“_Serverless Native_”的数据库；

## 总结
- _Serverless + REST API_ 是非常合适的组合，特别适合事件驱动的业务逻辑（认证、_CRUD_、Webhook）。
- 需要注意的是连接池问题、长连接场景，这两类情况要么换技术（如 _GraphQL over HTTP_、消息队列），要么落到常驻服务上；