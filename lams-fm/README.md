# LAMS-FM - 功能医学慢病管理系统

## 📋 项目概述

LAMS-FM (Functional Medicine Chronic Disease Management Subsystem) 是一个基于功能医学矩阵理论的慢病管理系统，通过七大核心失衡评估和 5R 干预协议，为用户提供个性化的健康管理方案。

## 🎯 核心创新

**生命算力（Life Force Hashrate）** - 将健康行为量化为可计算的投资回报

- **任务难度和健康影响加权**
- **生物反馈奖励机制**（血糖、睡眠、压力、能量、情绪）
- **连续天数激励系统**
- **EBIO（Earned Biological Investment）** - 健康资产数字化
- **ROHI（Return on Health Investment）** - 健康投资回报率

---

## 🏗️ 项目结构

```
lams-fm/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── globals.css        # 全局样式
│   │   ├── middleware.ts       # Clerk auth 中间件
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # 仪表盘页面
│   │   │   └── error.tsx      # 错误边界
│   │   ├── assessment/
│   │   │   └── page.tsx       # 评估问卷页面
│   │   └── api/
│   │       ├── chat/route.ts    # Dr. Kyle AI API
│   │       └── cron/
│   │           └── daily-reset/route.ts  # Cron Job
│   │
│   ├── components/             # React 组件
│   │   ├── matrix-radar.tsx   # 矩阵雷达图
│   │   ├── matrix-cards.tsx   # 维度详情卡片
│   │   ├── ai-chat.tsx        # AI 聊天组件
│   │   └── hashrate-display.tsx  # 生命算力显示
│   │
│   ├── lib/                   # 核心库
│   │   ├── schema.ts          # Drizzle ORM Schema（9个表）
│   │   ├── db.ts              # 数据库连接
│   │   ├── matrix-engine.ts   # 矩阵评分算法
│   │   ├── dr-kyle.ts         # AI 系统提示词
│   │   ├── economics.ts        # 生命算力引擎
│   │   └── seed.ts            # 种子数据生成
│   │
│   └── actions/               # Server Actions
│       └── questionnaire.ts    # 问卷提交处理
│
├── Configuration Files
│   ├── package.json             # 依赖配置
│   ├── tsconfig.json            # TypeScript 配置
│   ├── tailwind.config.ts       # Tailwind CSS 配置
│   ├── drizzle.config.ts        # Drizzle 配置
│   ├── next.config.js           # Next.js 配置
│   ├── postcss.config.js        # PostCSS 配置
│   └── vercel.json             # Vercel Cron Jobs
│
└── Documentation
    ├── README.md                # 本文档
    ├── PHASE4_COMPLETION.md    # Phase 4 完成报告
    ├── PHASE4_INTEGRATION_REPORT.md  # Phase 4 集成报告
    └── PHASE5_COMPLETION.md    # Phase 5 完成报告
```

---

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

### 3. 生命算力系统 (Life Force Economics)

**Hashrate 计算公式**：
```
Hashrate = Task Score × Biofeedback Bonus × Streak Bonus
```

**组成部分**：
- **Task Score** - 完成任务 × 难度 × 健康影响 × 10
- **Biofeedback Bonus** - 生物指标奖励（最多 +50%）
  - 血糖正常（70-99 mg/dL）：+10%
  - 良好睡眠（7-9 小时）：+15%
  - 低压力（1-3）：+10%
  - 高能量（7-10）：+10%
  - 好情绪（7-10）：+5%
- **Streak Bonus** - 连续天数奖励
  - 4-7 天：1.2x
  - 8-14 天：1.5x
  - 15+ 天：2.0x

**Hashrate 等级系统**：
- **Beginner** (0-49)
- **Intermediate** (50-99)
- **Advanced** (100-199)
- **Expert** (200-499)
- **Master** (500+)

### 4. AI 智能分析

- **Dr. Kyle** - AI 助手基于症状和实验室结果生成个性化建议
- 实时矩阵评分计算
- 自动干预方案生成
- RAG（检索增强生成）架构

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 15 (App Router) + TypeScript |
| **身份验证** | Clerk |
| **样式** | Tailwind CSS + Recharts |
| **数据库** | MySQL / PlanetScale |
| **ORM** | Drizzle ORM |
| **验证** | Zod |
| **部署** | Vercel + Cron Jobs |

---

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

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```env
# Clerk Auth (从 https://dashboard.clerk.com/ 获取)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY

# Database
DATABASE_URL="mysql://user:password@host/database"

# Cron Secret (可选，用于 cron job 认证)
CRON_SECRET=your-secret-here
```

### 4. 初始化数据库

```bash
npm run db:generate  # 生成迁移文件
npm run db:push     # 推送 schema 到数据库
npm run db:seed     # 生成测试数据（可选）
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 📊 数据库架构

### 核心表

| 表名 | 描述 |
|------|------|
| `users` | 用户基本信息（Clerk ID 同步） |
| `fm_profiles` | 功能医学档案 |
| `matrix_scores` | 矩阵评分（当前分数） |
| `matrix_score_history` | 评分历史（趋势追踪） |
| `questionnaire_responses` | 问卷响应 |
| `lab_results` | 实验室检查结果 |
| `interventions` | 干预方案（5R协议） |
| `daily_tracking` | 每日追踪记录 |
| `ai_consultations` | AI 咨询记录 |

---

## 🧪 测试

### 运行单元测试

```bash
npx tsx src/lib/matrix-engine.test.ts
```

### 运行系统验证

```bash
npm run verify
```

测试覆盖：
- ✅ 矩阵引擎单元测试（8 个测试用例）
- ✅ 文件结构验证（25 个必需文件）
- ✅ 依赖配置验证
- ✅ TypeScript 配置验证

---

## 🎨 页面说明

| 路径 | 功能 | 技术栈 |
|------|------|--------|
| `/` | 首页 - 功能介绍 | Next.js + Tailwind |
| `/dashboard` | 仪表盘 - 矩阵可视化 + 生命算力 | Recharts + Server Actions |
| `/assessment` | 评估问卷 - 交互式表单 | React Hooks + Zod |
| `/sign-in` | 登录页面 | Clerk |
| `/sign-up` | 注册页面 | Clerk |

---

## 🔧 开发命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint

# 数据库
npm run db:seed      # 生成测试数据
npm run db:push      # 推送 schema 到数据库
npm run db:generate   # 生成数据库迁移
npm run db:studio    # 打开 Drizzle Studio

# 验证
npm run verify       # 验证系统完整性
```

---

## 📈 项目进度

| 阶段 | 任务 | 状态 |
|------|------|------|
| Phase 1 | 数据库 Schema（9个表） | ✅ 完成 |
| Phase 2 | 矩阵引擎算法 + 测试 | ✅ 完成 |
| Phase 3 | 前端界面 + 仪表盘 | ✅ 完成 |
| Phase 4 | 系统联调与 AI 集成 | ✅ 完成 |
| Phase 5 | 生命算力引擎 + 生产部署 | ✅ 完成 |

**总体完成度**: 100% ✅

---

## 📈 项目统计

| 指标 | 数值 |
|------|------|
| 总代码行数 | 4,800+ |
| 项目大小 | 200+ KB |
| 数据库表数 | 9 |
| 页面数 | 4 |
| 组件数 | 5 |
| API 路由数 | 2 |
| Cron Jobs | 1 |
| 症状映射数 | 50+ |
| 单元测试数 | 8 |
| Hashrate 等级 | 5 (Beginner to Master) |

---

## 🌐 部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
   - `CRON_SECRET`
3. 点击 "Deploy"

### Vercel Cron Jobs

Cron Job 已配置在 `vercel.json` 中，每天 00:00 UTC 自动：
- 遍历所有活跃用户
- 基于活跃干预方案生成每日任务
- 创建新的 daily_tracking 记录

### PlanetScale 数据库

1. 创建数据库：https://app.planetscale.com/
2. 获取连接字符串
3. 设置 `DATABASE_URL` 环境变量

---

## 📝 开发规范

- 使用 TypeScript 严格模式
- 遵循 Next.js App Router 约定
- Server Actions 用于后端逻辑
- Zod 用于数据验证
- 提交前运行 `npm run lint`

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT

---

## 📮 联系方式

- **作者**: colerkks
- **GitHub**: https://github.com/colerkks
- **仓库**: https://github.com/colerkks/openclaw-workspace-auto
- **状态**: ✅ Production Ready

---

## ✨ 完整功能列表

### Phase 1 ✅ - 数据库架构
- 9 个核心表
- Drizzle ORM
- PlanetScale/MySQL 兼容

### Phase 2 ✅ - 矩阵引擎
- 50+ 症状映射
- 实验室结果整合
- 8 个单元测试通过

### Phase 3 ✅ - 前端界面
- 4 个页面
- 矩阵雷达图
- 交互式问卷
- 响应式设计

### Phase 4 ✅ - 系统联调
- 种子数据生成
- Dr. Kyle AI 集成
- RAG 架构
- 实时健康数据上下文

### Phase 5 ✅ - 生命算力与生产部署
- Clerk 身份验证
- 生命算力算法引擎
- EBIO & ROHE 计算
- Hashrate 等级系统
- Cron Job 自动化
- 错误边界
- 生产环境配置

---

**SYSTEM LAMS-FM IS FULLY FUNCTIONAL AND PRODUCTION READY.** 🎉
