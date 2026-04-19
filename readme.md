# StudyAssistant

AI智学助手（StudyAssistant）是一个面向 K12 的 AI 个性化学习平台项目。当前仓库采用 Angular + ASP.NET Core 的前后端一体化方案，并以 docs 中的 PRD 与原型作为开发依据。

## 1. 项目目标

基于 [docs/prd.md](docs/prd.md) 的核心目标：

- 作业智能分析：拍照上传、题目识别、薄弱点诊断
- 智能出题：按知识点和难度生成针对性练习
- AI 笔记：自动生成结构化复习笔记
- 用户体系：用户登录、用户资料管理、角色权限扩展
- AI 配置中心：AI 模型接入配置、参数配置与路由策略
- 学习成长：学习看板、学习报告、阶段性追踪

## 2. 当前技术栈

本仓库当前实际技术栈如下：

- 前端：Angular 21（位于 `studyassistant.client`）
- 后端：ASP.NET Core 10（位于 `StudyAssistant.Server`）
- 数据访问：Entity Framework Core（EF Core）
- 数据库模式：SQLite（开发与本地环境默认支持）
- 开发形态：ASP.NET Core + SPA Proxy（开发时自动联调 Angular）

说明：PRD 中技术建议部分为产品级建议，代码仓库当前以 .NET + Angular 实现为准。

## 3. 仓库结构

```text
StudyAssistant/
|- docs/
|  |- prd.md
|  |- architecture/ANGULAR_TEMPLATE_GUIDELINES.md
|  \- prototype/index.html
|- studyassistant.client/      # Angular 前端
|- StudyAssistant.Server/      # ASP.NET Core 后端
|- StudyAssistant.slnx
\- readme.md
```

## 4. 开发规范（必须遵守）

前端开发请优先遵循 [docs/architecture/ANGULAR_TEMPLATE_GUIDELINES.md](docs/architecture/ANGULAR_TEMPLATE_GUIDELINES.md)：

- 模板控制流使用 `@if/@else` 与 `@for`，避免引入新的 `*ngIf/*ngFor`
- `@for` 必须提供 `track`
- 新组件优先使用 standalone component
- 组件内状态优先使用 signals
- 数据录入场景优先使用 Reactive Forms
- 一次性异步流程优先使用 `async/await + try/catch/finally`

## 5. 本地启动

### 5.1 环境要求

- .NET SDK 10.x
- Node.js 20+
- npm 10+
- SQLite（或通过 EF Core SQLite Provider 使用内置文件库）
- 开发证书（HTTPS）

### 5.2 安装依赖

在项目根目录执行：

```powershell
cd studyassistant.client
npm install
cd ..
```

### 5.3 启动后端（联动前端）

在项目根目录执行：

```powershell
dotnet restore
dotnet run --project StudyAssistant.Server
```

如果数据库使用 SQLite 模式，推荐在首次运行前执行迁移：

```powershell
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project StudyAssistant.Server
dotnet ef database update --project StudyAssistant.Server
```

默认地址（以本地配置为准）：

- https://localhost:7086
- http://localhost:5032

开发模式下，后端会通过 SPA Proxy 自动拉起 Angular 开发服务器。

### 5.5 默认演示账号

系统启动时会自动同步内置演示账号，默认密码统一为 `abc@123`：

- 管理员：`admin` / `abc@123`
- 学生：`student1` / `abc@123`

说明：应用启动时会刷新这两个内置演示账号的密码和基础资料，用于开发与联调验证。

### 5.4 单独启动前端

```powershell
cd studyassistant.client
npm start
```

## 6. 测试与构建

前端：

```powershell
cd studyassistant.client
npm run build
npm run test
```

后端：

```powershell
dotnet build StudyAssistant.Server/StudyAssistant.Server.csproj
```

## 7. 业务模块规划（按 PRD 拆分）

建议按以下里程碑推进：

### Milestone 1（MVP）

- 首页信息聚合（学习概览、快速入口）
- 拍照上传入口与作业分析流程骨架
- 薄弱点诊断结果页
- 基础针对性练习（题目展示、提交、判分）
- 用户登录与基础资料管理
- AI 模型基础配置（单模型）

### Milestone 2（增强）

- 智能出题参数化（学科、知识点、难度）
- AI 笔记生成与笔记管理
- 学习报告（周/月维度）
- 用户管理后台（用户列表/角色/状态）
- 多模型路由与参数化配置

### Milestone 3（扩展）

- 成就激励体系
- 家长视图/报告分享
- 更丰富的专题训练与组卷能力

## 8. 路由与页面建议

可参考 PRD 页面清单，在 Angular 中按 feature folder 落地：

- `/`：首页
- `/camera`：拍照分析
- `/report`：诊断报告
- `/practice`：练习中心
- `/quiz`：答题页
- `/notes`：笔记列表
- `/note-generate`：生成笔记
- `/profile`：个人中心
- `/login`：登录页
- `/admin/users`：用户管理页
- `/admin/ai-models`：AI 模型配置页

## 9. 当前状态说明

当前仓库仍处于早期阶段：

- 前端为基础 Angular 工程
- 后端为基础 ASP.NET Core 模板（含示例接口）
- 数据层规划为 EF Core，支持 SQLite 模式
- 业务能力需按 PRD 分阶段补齐

当前已落地的开发骨架：

- EF Core + SQLite 数据层初始化与内置种子数据
- 用户登录接口、JWT 鉴权、管理员权限控制
- 用户管理接口与 AI 模型配置接口
- Angular 登录页、用户管理页、AI 模型配置页基础路由

建议开发顺序：先完成 Milestone 1 的端到端闭环，再接入 AI 能力与数据分析。

## 10. 参考文档

- 产品需求： [docs/prd.md](docs/prd.md)
- 前端规范： [docs/architecture/ANGULAR_TEMPLATE_GUIDELINES.md](docs/architecture/ANGULAR_TEMPLATE_GUIDELINES.md)
- 界面原型： [docs/prototype/index.html](docs/prototype/index.html)
