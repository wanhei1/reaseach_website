<<<<<<< HEAD
# Research Website

这是一个研究网站项目，展示如何从零开始创建、部署和维护一个学术研究网站。

## 项目概述

本项目提供了一个完整的工作流程，教您如何：
- 创建基本的研究网站
- 使用Git进行版本控制
- 通过Vercel进行自动部署
- 连接GitHub和Vercel实现持续集成

## 目录结构

```
research-website/
├── index.html          # 主页 - 网站的入口点
├── README.md           # 项目说明文档
├── .gitignore          # Git忽略文件配置
└── .vercel/            # Vercel配置文件夹（自动生成）
    ├── project.json    # 项目配置
    └── .env.development.local  # 开发环境变量
```

## 使用教程

### 步骤1：克隆项目到本地

```bash
git clone https://github.com/wanhei1/reaseach-website.git
cd research-website
```

**理由**：
- 克隆项目让您获得完整的代码副本
- 进入项目目录确保后续命令在正确的位置执行

### 步骤2：本地查看网站

直接在浏览器中打开 `index.html` 文件

**理由**：
- 这是一个纯静态网站，无需服务器即可运行
- 本地预览帮助您在修改前了解网站结构

### 步骤3：安装Vercel CLI（可选）

```bash
# 使用npm安装
npm install -g vercel

# 或使用bun安装（更快）
bun install -g vercel
```

**理由**：
- Vercel CLI允许您从命令行管理部署
- 可以查看项目状态、环境变量等详细信息
- 支持本地开发和预览功能

### 步骤4：登录Vercel（如果安装了CLI）

```bash
vercel login
```

**理由**：
- 连接您的Vercel账户进行项目管理
- 授权CLI访问您的项目和部署

### 步骤5：链接现有项目（如果有）

```bash
vercel link
```

**理由**：
- 将本地代码与Vercel项目关联
- 允许本地修改同步到线上部署

## 开发工作流程

### 修改网站内容

1. **编辑 `index.html`**：
   ```html
   <!-- 修改标题 -->
   <h1>您的研究领域</h1>
   
   <!-- 添加研究内容 -->
   <div class="content">
       <p>介绍您的研究方向和成果</p>
   </div>
   ```

2. **本地预览更改**：
   在浏览器中刷新 `index.html` 查看效果

**理由**：
- 本地修改和预览确保更改正确无误
- 避免直接在生产环境中出现错误

### 提交更改到Git

```bash
# 查看更改状态
git status

# 添加文件到暂存区
git add .

# 提交更改
git commit -m "描述您的更改内容"

# 推送到GitHub
git push
```

**理由**：
- `git status`：了解哪些文件被修改，确保提交正确的内容
- `git add .`：将所有更改添加到暂存区准备提交
- `git commit`：创建版本记录，便于后续回滚或查看历史
- `git push`：将更改同步到GitHub，触发自动部署

### 自动部署到Vercel

当您推送代码到GitHub后，Vercel会自动：
1. 检测到新的提交
2. 开始构建部署
3. 更新线上网站

**理由**：
- 自动化部署减少手动操作错误
- 每次提交都有对应的部署记录
- 支持快速回滚到之前的版本

## Git工作流程详解

### 为什么使用Git？

1. **版本控制**：跟踪每次更改，可以回滚到任意版本
2. **协作开发**：多人可以同时工作而不冲突
3. **备份安全**：代码存储在多个位置（本地、GitHub、Vercel）

### 分支策略

```bash
# 创建新功能分支
git checkout -b feature/new-section

# 在分支上开发
# ... 修改文件 ...

# 提交分支更改
git add .
git commit -m "Add new research section"

# 推送分支到GitHub
git push -u origin feature/new-section

# 合并到主分支
git checkout main
git merge feature/new-section
git push
```

**理由**：
- 主分支（main）保持稳定，用于生产部署
- 功能分支允许并行开发多个特性
- 合并前可以进行代码审查

## Vercel部署详解

### 为什么选择Vercel？

1. **零配置部署**：自动检测项目类型并配置构建
2. **全球CDN**：网站在全球加速访问
3. **自动HTTPS**：免费SSL证书和安全连接
4. **预览部署**：每个分支都有独立的预览URL

### 环境管理

```bash
# 查看环境变量
vercel env ls

# 添加环境变量
vercel env add

# 拉取最新配置
vercel pull
```

**理由**：
- 环境变量安全存储敏感信息
- 不同环境（开发、预览、生产）可以有不同配置

## 故障排除

### 常见问题

1. **推送失败**：
   ```bash
   # 检查远程仓库配置
   git remote -v
   
   # 重新设置远程地址
   git remote set-url origin https://github.com/您的用户名/仓库名.git
   ```

2. **部署失败**：
   - 检查Vercel控制台的构建日志
   - 确认文件路径和语法正确

3. **网站无法访问**：
   - 检查DNS设置
   - 确认域名配置正确

### 网络连接问题

```bash
# 测试GitHub连接
ping github.com

# 使用HTTPS而非SSH
git remote set-url origin https://github.com/用户名/仓库名.git
```

**理由**：
- HTTPS通常比SSH有更好的网络兼容性
- 企业网络环境可能阻止SSH连接

## 扩展功能

### 添加更多页面

1. 创建新的HTML文件（如 `about.html`）
2. 在 `index.html` 中添加导航链接
3. 保持一致的样式和结构

### 集成分析工具

添加Google Analytics或其他分析工具追踪访问数据

### 自定义域名

在Vercel控制台添加您的域名并配置DNS

## 最佳实践

1. **定期提交**：每完成一个小功能就提交
2. **清晰的提交信息**：描述具体改动内容
3. **测试后部署**：本地验证无误后再推送
4. **备份重要数据**：定期下载重要文件
5. **监控网站状态**：关注部署成功和网站可用性

## 进阶学习

- 学习CSS和JavaScript增强网站功能
- 了解SEO优化提升搜索排名
- 探索静态网站生成器（如Next.js、Gatsby）
- 学习响应式设计适配移动设备

## 联系支持

- GitHub Issues：报告问题和功能请求
- Vercel文档：https://vercel.com/docs
- Git教程：https://git-scm.com/docs
