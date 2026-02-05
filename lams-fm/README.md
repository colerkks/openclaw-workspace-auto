# LAMS-FM - 功能医学慢病管理系统

## 项目简介

LAMS-FM (Functional Medicine Chronic Disease Management Subsystem) 是一个基于功能医学矩阵理论的慢病管理系统，通过七大核心失衡评估和 5R 干预协议，为用户提供个性化的健康管理方案。

## 技术栈

- **前端框架**: Next.js 16 (App Router) + TypeScript
- **样式系统**: Tailwind CSS + Shadcn/UI
- **数据库**: MySQL (兼容 PlanetScale)
- **ORM**: Drizzle ORM
- **验证**: Zod
- **AI Agent**: Vercel AI SDK

## 核心功能

### 七大功能医学维度 (The Matrix)

1. **同化** - 消化、吸收、肠道微生物
2. **防御与修复** - 免疫、炎症、感染
3. **能量** - 线粒体功能、氧化应激
4. **生物转化与排泄** - 毒素处理、肝脏解毒
5. **输送** - 心血管、淋巴系统
6. **通讯** - 内分泌、神经递质
7. **结构** - 细胞膜完整性、骨骼肌肉

### 5R 干预协议

1. **Remove (移除)** - 过敏原、病原体
2. **Replace (补充)** - 消化酶、胃酸
3. **Reinoculate (再接种)** - 益生菌
4. **Repair (修复)** - 肠道粘膜
5. **Rebalance (再平衡)** - 生活方式、心理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

复制 `.env.example` 为 `.env` 并配置数据库连接：

```bash
cp .env.example .env
# 编辑 .env 文件，设置 DATABASE_URL
```

### 3. 初始化数据库

```bash
npm run db:generate  # 生成迁移文件
npm run db:push     # 推送 schema 到数据库
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 数据库架构

### 核心表结构

- `users` - 用户基本信息
- `fm_profiles` - 功能医学档案
- `matrix_scores` - 矩阵评分
- `matrix_score_history` - 评分历史记录
- `questionnaire_responses` - 问卷响应
- `lab_results` - 实验室检查结果
- `interventions` - 干预方案（5R协议）
- `daily_tracking` - 每日追踪记录
- `ai_consultations` - AI 咨询记录

## 开发指南

### 数据库迁移

```bash
npm run db:generate  # 生成迁移文件
npm run db:push     # 推送 schema 到数据库
npm run db:studio   # 打开 Drizzle Studio 可视化工具
```

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 Next.js App Router 约定
- Server Actions 用于后端端点
- Zod 用于数据验证

## 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量 `DATABASE_URL`
3. 部署

### PlanetScale 数据库

推荐使用 PlanetScale 作为生产数据库：

1. 创建数据库
2. 获取连接字符串
3. 设置 `DATABASE_URL` 环境变量

## 许可证

MIT
