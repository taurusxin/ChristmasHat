# ChristmasHat 🎄

一个在线给头像添加圣诞帽的 Web 应用。上传图片，选择帽子，拖拽调整位置和大小，一键导出。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite |
| UI 组件 | Naive UI |
| 图像处理 | Fabric.js |
| 文件下载 | FileSaver.js |

## 业务流程

```
上传头像 → 选择帽子样式 → 拖拽/缩放/旋转调整 → 预览 → 下载 PNG
```

## 项目结构

```
src/
├── App.vue              # 根组件，主题配置
├── main.ts              # 应用入口
├── router/index.ts      # 路由配置
├── views/
│   └── HomeView.vue     # 核心页面（所有业务逻辑）
└── assets/              # 样式文件
```

## 核心逻辑 (HomeView.vue)

| 功能模块 | 说明 |
|----------|------|
| 帽子加载 | `onMounted` 从 `hats.json` 或 CDN 获取帽子列表 |
| 图片上传 | `handleUploadImage` + `loadImage` 使用 FileReader 加载图片到 Canvas |
| Canvas 初始化 | `fabric.Canvas` 创建画布，设置背景图并自适应缩放 |
| 帽子控制 | `switchHatInCanvas` 添加可交互的帽子对象，支持拖拽、缩放、旋转 |
| 图片导出 | `save` 生成预览，`download` 使用 FileSaver 下载 PNG |

## 开发

```bash
pnpm install    # 安装依赖
pnpm dev        # 启动开发服务器
pnpm build      # 构建生产版本
pnpm preview    # 预览构建结果
```

## 特性

- 响应式设计，适配移动端和桌面端
- 跟随系统的深色/浅色主题
- 支持多种帽子样式切换
- Canvas 实时预览编辑效果
