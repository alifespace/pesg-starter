# 目录结构、路由和布局

## 目录结构

以下是一个 _Nuxt 4.x_ 常见的目录结构：

```bash
my-nuxt-app/
├─ .nuxt/                  # Nuxt 自动生成的构建缓存（不要手动修改）
├─ node_modules/
├─ public/                 # 静态文件目录（原样复制到构建产物，不会被打包）
│   └─ favicon.ico
│
├─ app/                    # ✅ Nuxt 4 新推荐入口目录
│   ├─ layouts/            # 页面布局（原来的根目录 layouts/ 也还能用）
│   │   └─ default.vue
│   ├─ pages/              # 路由页面（原来的根目录 pages/ 也还能用）
│   │   ├─ index.vue
│   │   └─ about.vue
│   ├─ plugins/            # 插件 (运行在 Vue 应用初始化前)
│   │   └─ my-plugin.ts
│   ├─ components/         # 自动导入的 Vue 组件
│   │   └─ HelloWorld.vue
│   ├─ assets/             # 需要经过构建工具处理的资源（CSS、SCSS、图片…）
│   │   └─ main.css
│   ├─ middleware/         # 路由中间件
│   │   └─ auth.ts
│   └─ app.vue             # 应用根组件 (Nuxt 入口)
│
├─ server/                 # ✅ 后端 API 和 server 中间件 (Nitro)
│   └─ api/
│       └─ hello.ts        # GET /api/hello
│
├─ nuxt.config.ts          # Nuxt 配置文件
├─ package.json
├─ tsconfig.json           # TypeScript 配置
└─ .gitignore
```

## 布局

在 _Nuxt 4.x_ 中，布局的设置文件需要放在 `app/layouts` 目录下。

### 默认布局

可以在`layouts`目录下新建一个布局文件 `default.vue`，内容如下：

```vue
<template>
  <div>
    <div>
      <nav>
        <ul>
          <li>
            <NuxtLink to="/">Main</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/about">About</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    <slot></slot>
  </div>
</template>
```

修改`app.vue`，就可以全局生效：

```vue
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

也可以通过指定一个`layouts`目录下的 _vue_ 文件名，来全局生效
```vue
<template>
  <div>
    <NuxtLayout :name="layout1">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const layout1 = "another";
</script>
```

### 自定义布局

新建一个布局文件`another.vue`，内容如下：

```vue
<template>
  <div>
    <div>This is another Layout</div>
    <slot></slot>
  </div>
</template>
```

将以上布局应用在一个页面中，比如`about.vue`：

```vue
<template>
  <div>This page is about me.</div>
</template>

<script>
// 以下这段代码可以放在 <script> 或者 <script setup> 中
definePageMeta({
  layout: "another",
});
</script>
```

### 动态改变布局

可以动态改变页面的布局，比如针对页面 _/about_，修改`about.vue`：
```vue
<template>
  <div>This page is about me.</div>
  <button @click="enableCustomLayout">Change Layout</button>
</template>

<script setup>
// 动态改变布局
function enableCustomLayout() {
  setPageLayout("another");
}
</script>
```

