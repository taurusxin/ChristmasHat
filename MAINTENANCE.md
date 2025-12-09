# 维护文档

本文档记录当前实现中可优化的部分，按优先级和类别分类。

## 代码质量

### 1. 过多使用 DOM 查询

**位置**: `src/views/HomeView.vue:57-58, 104, 132-133`

**问题**: 多处使用 `document.querySelector` 直接操作 DOM，不符合 Vue 的响应式理念。

```typescript
// 当前实现
let cvs: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
let img: HTMLImageElement = document.querySelector('#image') as HTMLImageElement
```

**建议**: 使用 Vue 的 `ref` 配合 `template ref` 获取 DOM 元素。

```typescript
// 优化方案
const cvsRef = ref<HTMLCanvasElement>()
const imgRef = ref<HTMLImageElement>()
```

---

### 2. 非响应式变量混用

**位置**: `src/views/HomeView.vue:13-17`

**问题**: `canvasFabric`、`hatInstance`、`imageWidth`、`imageHeight`、`isMobile` 使用普通变量而非响应式变量，可能导致状态同步问题。

```typescript
// 当前实现
let canvasFabric: fabric.Canvas
let hatInstance: fabric.Image
let imageWidth: number
let isMobile = window.innerWidth <= 768
```

**建议**:
- `isMobile` 应使用响应式变量并监听 `resize` 事件
- Canvas 相关变量可用 `shallowRef` 包装，避免深层响应式开销

---

### 3. 魔法数字散落

**位置**: `src/views/HomeView.vue:75, 111, 118-119, 126`

**问题**: 800、1600、40、36 等数值直接硬编码，含义不明确。

```typescript
let e = isMobile ? 800 : 1600
hatInstance = new fabric.Image(hatChoose, {
  top: 40,
  cornerSize: 36,
})
```

**建议**: 提取为常量或配置对象。

```typescript
const CONFIG = {
  maxCanvasWidth: { mobile: 800, desktop: 1600 },
  hat: { initialTop: 40, cornerSize: 36 }
}
```

---

### 4. 遗留的调试代码

**位置**: `src/views/HomeView.vue:86`

**问题**: 生产代码中保留了 `console.log`。

```typescript
console.log(scale)
```

**建议**: 删除或替换为条件编译。

---

### 5. 未使用的导入

**位置**: `src/App.vue:3`

**问题**: `UploadFileInfo` 类型导入但未使用。

```typescript
import { useOsTheme, darkTheme, type UploadFileInfo } from 'naive-ui'
```

**建议**: 移除未使用的导入。

---

## 架构优化

### 6. 组件职责过重

**位置**: `src/views/HomeView.vue`

**问题**: 单个文件包含所有业务逻辑（371 行），包括：
- 图片上传处理
- Canvas 操作
- 帽子管理
- 导出功能
- UI 渲染

**建议**: 拆分为多个组合式函数（composables）：

```
src/
├── composables/
│   ├── useImageUpload.ts    # 图片上传逻辑
│   ├── useCanvasEditor.ts   # Canvas 操作
│   └── useHatManager.ts     # 帽子管理
├── views/
│   └── HomeView.vue         # 仅负责组装和 UI
```

---

### 7. 缺少错误处理 UI

**位置**: `src/views/HomeView.vue:19-29`

**问题**: 帽子加载失败时静默回退到 CDN，用户无感知。图片加载也没有错误处理。

```typescript
try {
  const res = await fetch('./hats.json')
  // ...
} catch (_) {
  // 静默回退
}
```

**建议**: 添加加载状态和错误提示。

---

### 8. Canvas 实例泄漏

**位置**: `src/views/HomeView.vue:73`

**问题**: 每次加载新图片都创建新的 `fabric.Canvas` 实例，但未销毁旧实例。

```typescript
canvasFabric = new fabric.Canvas('cvs')
```

**建议**: 在创建新实例前调用 `canvasFabric.dispose()`，或复用实例。

---

## 用户体验

### 9. 缺少加载状态

**问题**: 帽子列表加载、图片处理时没有 loading 指示器。

**建议**: 添加 `n-spin` 或 `n-skeleton` 组件显示加载状态。

---

### 10. 导出质量选项

**问题**: 目前只能导出默认质量的 PNG。

**建议**: 提供质量/格式选择（如原始尺寸、压缩尺寸、JPEG/PNG）。

---

### 11. 帽子选中状态不明显

**位置**: `src/views/HomeView.vue:205-213`

**问题**: 轮播中选中的帽子没有明显的视觉区分。

**建议**: 为当前选中项添加高亮边框或放大效果。

---

## 依赖与构建

### 12. 依赖版本陈旧

**位置**: `package.json`

| 依赖 | 当前版本 | 最新主版本 |
|------|----------|------------|
| Vue | 3.2.41 | 3.4+ |
| Vite | 3.1.8 | 5.x |
| TypeScript | 4.7.4 | 5.x |
| Naive UI | 2.33.5 | 2.38+ |

**建议**: 定期更新依赖，尤其是 Vite 5 带来显著的构建性能提升。

---

### 13. 缺少代码质量工具

**问题**: 项目未配置 ESLint、Prettier、husky 等工具。

**建议**: 添加以下配置：
- ESLint + @vue/eslint-config-typescript
- Prettier
- husky + lint-staged（提交前检查）

---

## 优化优先级建议

| 优先级 | 项目 | 原因 |
|--------|------|------|
| 高 | Canvas 实例泄漏 (#8) | 内存问题，长时间使用可能导致性能下降 |
| 高 | 删除调试代码 (#4) | 生产环境不应有调试输出 |
| 中 | 组件拆分 (#6) | 提高可维护性 |
| 中 | 依赖更新 (#12) | 安全性和性能 |
| 中 | 添加错误处理 (#7) | 用户体验 |
| 低 | DOM 查询优化 (#1) | 代码风格，功能不受影响 |
| 低 | 魔法数字 (#3) | 代码可读性 |
