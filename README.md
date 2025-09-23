# Research Website

这是一个基于Next.js和Supabase的学术研究管理系统项目。

## 项目结构

```
research-website/
├── app/                    # Next.js App Router页面
├── components/             # React组件
├── lib/                    # 工具函数和配置
├── public/                 # 静态资源
├── scripts/               # 数据库脚本
├── styles/                # 样式文件
├── package.json           # 项目依赖配置
├── next.config.mjs        # Next.js配置
├── tsconfig.json          # TypeScript配置
├── components.json        # UI组件配置
├── postcss.config.mjs     # PostCSS配置
├── middleware.ts          # Next.js中间件
└── README.md              # 项目说明
```

## 🚨 重要：环境配置文件说明

### 不要复制/下载的文件和文件夹

以下文件和文件夹包含本地环境配置、构建产物或敏感信息，**复制项目时请勿下载**：

#### 📁 自动生成的文件夹
```
node_modules/           # 依赖包（通过包管理器安装）
.next/                  # Next.js构建产物
.vercel/                # Vercel部署配置（本地）
.git/                   # Git版本控制信息（可选）
```

#### 🔒 环境变量文件
```
.env.local              # 本地环境变量（包含敏感信息）
.env.development.local  # 开发环境变量
.env.production.local   # 生产环境变量
.env*.local             # 所有本地环境变量文件
```

#### 📦 包管理器文件
```
bun.lock               # Bun锁定文件（可选，建议保留）
pnpm-lock.yaml         # PNPM锁定文件（可选，建议保留）
package-lock.json      # NPM锁定文件（可选，建议保留）
```

#### 💾 临时和缓存文件
```
*.log                  # 日志文件
.DS_Store             # macOS系统文件
Thumbs.db             # Windows系统文件
```

### ✅ 需要复制的核心文件

以下是项目的核心文件，复制项目时**必须包含**：

```
├── app/                # 页面和路由
├── components/         # React组件
├── lib/               # 工具函数
├── public/            # 静态资源
├── scripts/           # 数据库脚本
├── styles/            # 样式文件
├── package.json       # 依赖配置
├── next.config.mjs    # Next.js配置
├── tsconfig.json      # TypeScript配置
├── components.json    # UI组件配置
├── postcss.config.mjs # CSS配置
├── middleware.ts      # 中间件
├── .gitignore         # Git忽略规则
└── README.md          # 项目文档
```

## 🚀 项目设置和运行

### 1. 克隆项目

```bash
git clone https://github.com/wanhei1/reaseach_website.git
cd reaseach_website
```

### 2. 安装依赖

选择您喜欢的包管理器：

```bash
# 使用bun（推荐，更快）
bun install

# 或使用npm
npm install

# 或使用pnpm
pnpm install

# 或使用yarn
yarn install
```

### 3. 环境变量配置

复制环境变量模板并配置：

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量文件
# 在 .env.local 中配置以下变量：
```

#### 必需的环境变量：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的supabase服务角色密钥

# 数据库配置
POSTGRES_URL=你的数据库连接字符串
POSTGRES_PRISMA_URL=你的Prisma数据库连接字符串
POSTGRES_URL_NON_POOLING=你的非池化数据库连接字符串

# 开发环境配置
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. 运行项目

```bash
# 开发模式
bun dev
# 或
npm run dev

# 构建项目
bun run build
# 或
npm run build

# 生产模式运行
bun start
# 或
npm start
```

### 5. 访问项目

项目运行后，访问：
- 开发环境：http://localhost:3000
- 生产环境：您的部署域名

## 📋 功能特性

- 🔐 用户认证和授权
- 📚 研究论文管理
- 👥 学者档案系统
- 🔍 高级搜索功能
- 📊 数据仪表板
- 🌐 知识图谱可视化
- 📱 响应式设计
- 🚀 服务端渲染(SSR)

## 🛠 技术栈

- **前端**: Next.js 14, React, TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **部署**: Vercel
- **包管理器**: Bun/NPM/PNPM

## 📦 依赖说明

### 生产依赖
- `next`: React框架
- `react`: UI库
- `@supabase/supabase-js`: Supabase客户端
- `tailwindcss`: CSS框架

### 开发依赖
- `typescript`: 类型检查
- `@types/*`: TypeScript类型定义
- `eslint`: 代码检查
- `prettier`: 代码格式化

## 🔧 开发指南

### 代码规范

项目使用以下代码规范：
- TypeScript严格模式
- ESLint代码检查
- Prettier代码格式化

### Git工作流

1. 从main分支创建功能分支
2. 开发并测试功能
3. 提交时使用语义化提交信息
4. 创建Pull Request进行代码审查
5. 合并到main分支后自动部署

### 数据库迁移

```bash
# 运行数据库初始化脚本
psql -d your_database < scripts/001_create_tables.sql
psql -d your_database < scripts/002_seed_data.sql
psql -d your_database < scripts/003_create_functions.sql
```

## 🚨 注意事项

1. **环境变量安全**：
   - 绝不要将`.env.local`等环境变量文件提交到Git
   - 生产环境变量应在部署平台配置

2. **依赖管理**：
   - 锁定文件(`bun.lock`, `pnpm-lock.yaml`)建议提交到Git
   - 确保团队使用相同的包管理器

3. **构建产物**：
   - `.next/`文件夹包含构建产物，不要提交到Git
   - 每次部署时会重新构建

4. **数据库安全**：
   - 数据库连接字符串包含敏感信息
   - 使用环境变量而非硬编码

## 🔗 相关链接

- [Next.js文档](https://nextjs.org/docs)
- [Supabase文档](https://supabase.com/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [TypeScript文档](https://www.typescriptlang.org/docs)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改善这个项目！
