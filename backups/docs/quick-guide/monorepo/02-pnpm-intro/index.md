# pnpm 介绍

## _pnpm run_ 语法糖

_pnpm_（和 _npm/yarn_ 类似）对一些常见脚本名做了语法糖，可以省略 _run_：

| 脚本名       | 等价命令                                | 说明                                |
| --------- | ----------------------------------- | --------------------------------- |
| `start`   | `pnpm start` → `pnpm run start`     | **默认入口**，如果你只输入 `pnpm start`，就会跑它 |
| `test`    | `pnpm test` → `pnpm run test`       | 测试常用                              |
| `dev`     | `pnpm dev` → `pnpm run dev`         | 开发模式（_Nuxt/Vite_ 常见）                |
| `stop`    | `pnpm stop` → `pnpm run stop`       | 用得少，一般服务停止脚本                      |
| `restart` | `pnpm restart` → `pnpm run restart` | 停止后再启动                            |
