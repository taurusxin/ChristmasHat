# 🚀 部署检查清单

## 📦 文件清单

确认 `build` 文件夹包含以下文件：

- [x] `sitemap.xml` - 主站点地图索引
- [x] `robots.txt` - 爬虫控制文件
- [x] `.htaccess` - Apache 服务器配置（如果使用 Apache）
- [x] `README.md` - 部署说明文档

---

## 📋 部署步骤

### 步骤 1：上传文件到服务器根目录

```bash
# 目标位置：tools.taurusxin.com 的根目录
# 不是 /hat/ 目录！

上传以下文件到根目录：
✅ sitemap.xml       → /sitemap.xml
✅ robots.txt        → /robots.txt
✅ .htaccess         → /.htaccess (如果使用 Apache)
```

**重要提醒：**
- ⚠️ 不要覆盖 `/hat/` 目录下的文件！
- ⚠️ 只上传到根目录
- ⚠️ 如果根目录已有这些文件，请备份后再覆盖

---

### 步骤 2：验证文件可访问

在浏览器中打开以下 URL，确保都能正常访问：

```
□ https://tools.taurusxin.com/sitemap.xml
   → 应该显示 XML 格式的站点地图索引

□ https://tools.taurusxin.com/robots.txt
   → 应该显示文本格式的爬虫规则

□ https://tools.taurusxin.com/hat/sitemap.xml
   → 确认子项目 sitemap 仍然可访问

□ https://tools.taurusxin.com/hat/robots.txt
   → 确认子项目 robots.txt 仍然可访问
```

---

### 步骤 3：提交到搜索引擎

#### Google Search Console

1. **登录：** https://search.google.com/search-console

2. **选择网站：** tools.taurusxin.com

3. **提交站点地图：**
   ```
   左侧菜单 → 站点地图 → 添加新的站点地图
   输入：sitemap.xml
   点击：提交
   ```

4. **等待索引：**
   - 24小时内开始抓取
   - 3-7天完成初始索引

---

#### Bing Webmaster Tools

1. **登录：** https://www.bing.com/webmasters

2. **添加站点地图：**
   ```
   站点地图 → 提交站点地图
   输入：https://tools.taurusxin.com/sitemap.xml
   提交
   ```

---

#### 百度搜索资源平台

1. **登录：** https://ziyuan.baidu.com

2. **提交链接：**
   ```
   站点管理 → 数据引入 → 链接提交
   sitemap → 提交
   输入：https://tools.taurusxin.com/sitemap.xml
   ```

---

## ✅ 验证清单

### 文件访问验证

```bash
# 使用 curl 命令测试（可选）
curl -I https://tools.taurusxin.com/sitemap.xml
# 应该返回：HTTP/2 200

curl -I https://tools.taurusxin.com/robots.txt
# 应该返回：HTTP/2 200
```

### XML 格式验证

**在线工具：**
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- 输入：https://tools.taurusxin.com/sitemap.xml
- 检查是否有错误

### robots.txt 验证

**Google Search Console：**
```
左侧菜单 → 设置 → 爬网 → robots.txt 测试工具
检查 robots.txt 是否正确配置
```

---

## 📊 监控和维护

### 每周检查（推荐）

```
□ Google Search Console → 覆盖率报告
  查看索引状态和错误

□ 查看搜索分析
  监控展示次数和点击率

□ 检查站点地图状态
  确保没有错误
```

### 每月更新（如有需要）

```
□ 更新 sitemap.xml 的 <lastmod> 日期
□ 如有新工具，添加到 sitemap.xml
□ 重新提交到搜索引擎
```

---

## 🎯 常见问题

### Q1: 上传后显示 404 错误？

**解决方案：**
1. 确认文件上传到正确位置（根目录，不是 /hat/）
2. 检查文件权限（应该是 644）
3. 检查文件名是否正确（注意大小写）

### Q2: XML 格式错误？

**解决方案：**
1. 使用在线 XML 验证工具检查
2. 确保所有 URL 都是完整的（包含 https://）
3. 检查日期格式（应该是 YYYY-MM-DD）

### Q3: Google 未识别站点地图？

**解决方案：**
1. 等待 24-48 小时
2. 在 Google Search Console 手动提交
3. 检查 robots.txt 是否正确引用了 sitemap
4. 确保 sitemap.xml 可以公开访问

### Q4: 子项目 sitemap 失效？

**检查：**
1. 确认没有覆盖 `/hat/sitemap.xml`
2. 确认 URL 正确：`https://tools.taurusxin.com/hat/sitemap.xml`
3. 子项目的 sitemap 应该独立存在

---

## 📱 快速命令参考

### 测试文件访问

```bash
# 测试主 sitemap
curl -I https://tools.taurusxin.com/sitemap.xml

# 测试 robots.txt
curl -I https://tools.taurusxin.com/robots.txt

# 下载并查看内容
curl https://tools.taurusxin.com/sitemap.xml
```

### 文件权限设置（SSH）

```bash
# 如果通过 SSH 上传
cd /path/to/webroot
chmod 644 sitemap.xml
chmod 644 robots.txt
chmod 644 .htaccess
```

---

## 🎉 完成确认

部署完成后，确认以下项目都已完成：

### 基础部署
- [ ] 文件已上传到根目录
- [ ] 所有 URL 都可以访问（200 状态码）
- [ ] XML 格式验证通过
- [ ] robots.txt 正确引用 sitemap

### 搜索引擎
- [ ] 已提交到 Google Search Console
- [ ] 已提交到 Bing Webmaster Tools
- [ ] （可选）已提交到百度搜索资源平台

### 验证测试
- [ ] 主 sitemap 可访问
- [ ] 子项目 sitemap 仍然可访问
- [ ] 没有 404 或 500 错误
- [ ] Google Search Console 显示"成功"状态

---

## 🎄  恭喜！

如果所有项目都已完成，你的 SEO 配置就已经完美了！

接下来：
- ⏰ 等待 24-48 小时让搜索引擎抓取
- 📊 定期查看 Google Search Console 报告
- 🔄 有新工具时更新 sitemap.xml

祝你的工具网站流量暴涨！🎄✨
