# 主目录部署文件

## 📁 文件说明

这个文件夹包含需要部署到 **tools.taurusxin.com 根目录**的文件。

### 文件列表

1. **sitemap.xml** - 主站点地图索引
   - 引用所有子项目的 sitemap
   - 便于搜索引擎发现所有工具

2. **robots.txt** - 根目录爬虫控制文件
   - 指向主站点地图索引
   - 配置搜索引擎爬虫规则

---

## 🚀 部署步骤

### 1. 上传文件到服务器根目录

将这个文件夹中的文件上传到服务器的根目录：

```bash
# 通过 FTP/SFTP 上传
tools.taurusxin.com/
├── sitemap.xml          👈 上传这个
├── robots.txt           👈 上传这个
└── hat/
    ├── sitemap.xml      (已存在，不要覆盖)
    └── robots.txt       (已存在，不要覆盖)
```

### 2. 验证文件可访问

在浏览器中测试以下 URL：

```
✅ https://tools.taurusxin.com/sitemap.xml
✅ https://tools.taurusxin.com/robots.txt
✅ https://tools.taurusxin.com/hat/sitemap.xml
✅ https://tools.taurusxin.com/hat/robots.txt
```

### 3. 提交到搜索引擎

#### Google Search Console
1. 访问：https://search.google.com/search-console
2. 选择网站：tools.taurusxin.com
3. 站点地图 → 添加新的站点地图
4. 输入：`sitemap.xml`
5. 点击提交

#### Bing Webmaster Tools
1. 访问：https://www.bing.com/webmasters
2. 站点地图 → 提交站点地图
3. 输入：`https://tools.taurusxin.com/sitemap.xml`
4. 提交

#### 百度搜索资源平台
1. 访问：https://ziyuan.baidu.com
2. 站点管理 → 数据引入 → 链接提交
3. sitemap → 提交完整 URL
4. 输入：`https://tools.taurusxin.com/sitemap.xml`

---

## 📝 维护说明

### 何时需要更新这些文件？

**sitemap.xml 需要更新的情况：**
- ✅ 添加新的工具项目时
- ✅ 删除某个工具项目时
- ✅ 子项目的 sitemap URL 发生变化时

**如何更新：**
1. 编辑 `sitemap.xml`
2. 添加新的 `<sitemap>` 条目
3. 更新 `<lastmod>` 日期为今天
4. 重新上传到服务器
5. 在 Google Search Console 重新提交

### 示例：添加新工具项目

假设你新增了一个 "二维码生成器" 工具，部署在 `/qrcode/` 路径下：

```xml
<!-- 在 sitemap.xml 中添加 -->
<sitemap>
  <loc>https://tools.taurusxin.com/qrcode/sitemap.xml</loc>
  <lastmod>2025-12-15</lastmod>
</sitemap>
```

```txt
# 在 robots.txt 中添加（可选）
Sitemap: https://tools.taurusxin.com/qrcode/sitemap.xml
```

---

## ⚠️ 注意事项

### 1. 不要覆盖子项目文件

**重要：** 上传时只覆盖**根目录**的文件，不要覆盖子项目目录的文件！

```
❌ 不要覆盖：/hat/sitemap.xml
❌ 不要覆盖：/hat/robots.txt
✅ 只上传到根目录
```

### 2. URL 必须正确

确保 sitemap.xml 中的所有 URL 都可以访问（返回 200 状态码）。

### 3. 日期格式

`<lastmod>` 使用 ISO 8601 格式：`YYYY-MM-DD`

### 4. 子项目独立性

每个子项目（如 /hat/）应该保持自己的 sitemap.xml，根目录的 sitemap.xml 只是索引。

---

## 🔍 验证工具

### 在线验证工具

1. **XML Sitemap Validator**
   - https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - 验证 XML 格式是否正确

2. **Google Search Console**
   - 提交后查看"覆盖率"报告
   - 检查是否有错误

3. **Sitemap 测试工具**
   ```bash
   # 使用 curl 测试
   curl -I https://tools.taurusxin.com/sitemap.xml
   curl -I https://tools.taurusxin.com/robots.txt
   ```

---

## 📊 预期效果

### 部署后的好处

1. **统一 SEO 管理**
   - 一个主 sitemap 管理所有工具
   - 搜索引擎更容易发现所有内容

2. **便于扩展**
   - 新增工具只需在主 sitemap 添加一行
   - 不需要重新配置搜索引擎

3. **更好的索引**
   - Google/Bing 会定期检查主 sitemap
   - 自动发现新增的子项目

### 时间线

- **24小时内**：Google 开始抓取主 sitemap
- **3-7天**：子项目页面开始被索引
- **1-2周**：搜索结果中开始显示

---

## 📞 需要帮助？

如果部署过程中遇到问题：

1. **文件无法访问（404）**
   - 检查文件是否上传到正确位置
   - 检查文件权限（应该是 644）

2. **sitemap 格式错误**
   - 使用 XML 验证工具检查
   - 确保 URL 都是完整的（包含 https://）

3. **搜索引擎未识别**
   - 等待 24-48 小时
   - 在 Google Search Console 手动提交
   - 检查 robots.txt 是否正确

---

**部署完成后，记得在 Google Search Console 提交主 sitemap！**

🎄  祝你的工具网站 SEO 成功！
