# LAMS-FM - 功能医学慢病管理系统

## 📋 项目概述

LAMS-FM (Functional Medicine Chronic Disease Management Subsystem) 是一个基于功能医学矩阵理论的慢病管理系统，通过七大核心失衡评估和 5R 干预协议，为用户提供个性化的健康管理方案。

## 🏗️ 项目结构

```
lams-fm/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── globals.css        # 全局样式
│   │   ├── dashboard/
│   │   │   └── page.tsx       # 仪表盘页面
│   │   └── assessment/
│   │       └── page.tsx       # 评估问卷页面
│   │
│   ├── components/             # React 组件
│   │   ├── matrix-radar.tsx   # 矩阵雷达图
│   │   └── matrix-cards.tsx   # 维度详情卡片
│   │
│   ├── lib/                   # 核心库
│   │   ├── schema.ts          # Drizzle ORM Schema（9个表）
│   │   ├── db.ts              # 数据库连接
│   │   └── matrix-engine.ts   # 矩阵评分算法
│   │
│   └── actions/               # Server Actions
│       └── questionnaire.ts    # 问卷提交处理
│
├── drizzle.config.ts          # Drizzle 配置
├── tsconfig.json              # TypeScript 配置
├── tailwind.config.ts         # Tailwind CSS 配置
├── package.json               # 依赖配置
└── README.md                  # 本文档
```

## 🎯 核心功能

### 1. 七大功能医学维度 (The Matrix)

| 维度 | 英文 | 描述 |
|------|------|------|
| 同化 | Assimilation | 消化、吸收、肠道微生物 |
| 防御与修复 | Defense & Repair | 免疫、炎症、感染 |
| 能量 | Energy | 线粒体功能、氧化应激 |
| 生物转化与排泄 | Biotransformation | 毒素处理、肝脏解毒 |
| 输送 | Transport | 心血管、淋巴系统 |
| 通讯 | Communication | 内分泌、神经递质 |
| 结构 | Structural | 细胞膜完整性、骨骼肌肉 |

### 2. 5R 干预协议 (The 5R Protocol)

1. **Remove (移除)** - 过敏原、病原体
2. **Replace (补充)** - 消化酶、胃酸
3. **Reinoculate (再接种)** - 益生菌
4. **Repair (修复)** - 肠道粘膜
5. **Rebalance (再平衡)** - 生活方式、心理

### 3. AI 智能分析

- **Dr. Kyle** - AI 助手基于症状和实验室结果生成个性化建议
- 实时矩阵评分计算
- 自动干预方案生成

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16 (App Router) + TypeScript |
| **样式** | Tailwind CSS + Recharts |
| **数据库** | MySQL / PlanetScale |
| **ORM** | Drizzle ORM |
| **验证** | Zod |
| **部署** | Vercel |

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/colerkks/openclaw-workspace-auto.git
cd lams-fm
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置数据库

复制 `.env.example` 为 `.env` 并配置数据库连接：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置 `DATABASE_URL`：

```env
# PlanetScale（推荐）
DATABASE_URL="mysql://user:password@aws.connect.psdb.cloud/lams_fm"

# 或本地 MySQL
DATABASE_URL="mysql://root:password@localhost:3306/lams_fm"
```

### 4. 初始化数据库

```bash
npm run db:generate  # 生成迁移文件
npm run db:push     # 推送 schema 到数据库
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📊 数据库架构

### 核心表

| 表名 | 描述 |
|------|------|
| `users` | 用户基本信息 |
| `fm_profiles` | 功能医学档案 |
| `matrix_scores` | 矩阵评分（当前分数） |
| `matrix_score_history` | 评分历史（趋势追踪） |
| `questionnaire_responses` | 问卷响应 |
| `lab_results` | 实验室检查结果 |
| `interventions` | 干预方案（5R协议） |
| `daily_tracking` | 每日追踪记录 |
| `ai_consultations` | AI 咨询记录 |

## 🧪 测试

### 运行单元测试

```bash
npx tsx src/lib/matrix-engine.test.ts
```

测试覆盖：
- ✅ 空问卷基准分数（70分）
- ✅ 单一症状维度影响
- ✅ 多症状累积效应
- ✅ 实验室结果整合
- ✅ 综合多维度案例
- ✅ 正常实验室结果无影响
- ✅ 工具函数验证
- ✅ 分数边界约束（0-100）

## 🎨 页面说明

| 路径 | 功能 | 技术栈 |
|------|------|--------|
| `/` | 首页 - 功能介绍 | Next.js + Tailwind |
| `/dashboard` | 仪表盘 - 矩阵可视化 | Recharts + Server Actions |
| `/assessment` | 评估问卷 - 交互式表单 | React Hooks + Zod |

## 🔧 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npmnpm run start     # 启动生产服务器
npm run lint         # 运行 ESLint

npm run db:generate  # 生成数据库迁移
npm run db:push     # 推送 schema 到数据库
npm run db:studio   # 打开 Drizzle Studio
```

## 📝 开发规范

- 使用 TypeScript 严格模式
- 遵循 Next.js App Router 约定
- Server Actions 用于后端逻辑
- Zod 用于数据验证
- 提交前运行 `npm run lint`

## 🌐 部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量：
   - `DATABASE_URL`: PlanetScale/MySQL 连接字符串
3. 点击 "Deploy"

### PlanetScale 数据库

1. 创建数据库：https://app.planetscale.com/
2. 获取连接字符串
3. 设置 `DATABASE_URL` 环境变量

## 📈 项目进度

| 阶段 | 任务 | 状态 |
|------|------|------|
| Phase 1 | 数据库 Schema（9个表） | ✅ 完成 |
| Phase 2 | 矩阵引擎算法 + 测试 | ✅ 完成 |
| Phase 3 | 前端界面 + 仪表盘 | ✅ 完成 |
| Phase 4 | 调试与完善 | 🔄 进行中 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

## 📮 联系方式

- 作者: colerkks
- GitHub: https://github.com/colerkks
- 仓库: https://github.com/colerkks/openclaw-workspace-auto
