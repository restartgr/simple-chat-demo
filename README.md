# 智能旅游聊天机器人

基于LangChain + 智谱AI + Ant Design 构建的智能旅游助手，可以为用户推荐旅游路线、景点信息，并提供票务链接。

## ✨ 功能特性

- 🤖 **智能对话**: 基于智谱AI GLM-4.5-air模型的自然语言交互
- 🗺️ **路线推荐**: 根据用户偏好智能推荐旅游路线
- 🎭 **景点介绍**: 提供详细的景点信息和购票链接
- 💰 **预算规划**: 根据预算范围推荐合适的旅游方案
- 📅 **时间规划**: 支持按旅行天数筛选推荐内容
- 🎨 **现代UI**: 使用Ant Design构建专业的对话界面
- 🌍 **国际化**: 支持多语言切换 (i18n)

## 🛠️ 技术栈

- **前端框架**: React 18.3 + TypeScript 5.8
- **UI组件库**: Ant Design 5.26 + Ant Design Icons 6.0
- **大模型**: 智谱AI GLM-4.5-air
- **AI框架**: LangChain 0.3
- **状态管理**: MobX 6.13
- **路由**: React Router 7.6
- **构建工具**: Vite 6.3 + TypeScript
- **包管理**: pnpm
- **代码质量**: ESLint + Prettier + Husky + lint-staged
- **样式**: CSS Modules + PostCSS + Autoprefixer
- **图标**: SVG组件化支持

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd personal-chat-demo
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置智谱AI API

1. 前往 [智谱AI开放平台](https://open.bigmodel.cn/) 注册并获取API密钥
2. 在项目根目录创建 `.env` 文件，配置环境变量：

```bash
# 智谱AI配置
VITE_ZHIPUAI_API_KEY=your_zhipu_ai_api_key_here
VITE_ZHIPUAI_API_BASE=https://open.bigmodel.cn/api/paas/v4/chat/completions

# 应用配置
VITE_APP_TITLE=智能旅游助手
VITE_APP_DESCRIPTION=基于大模型的智能旅游推荐系统
```

**注意**: 如果不配置API密钥，系统将使用模拟回复进行演示。

### 4. 配置旅游数据

1. 进入 `src/data` 目录
2. 参考 `tourism-data.example.json` 创建 `tourism-data.json` 文件
3. 根据需要添加旅游景点数据

### 5. 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3300` 启动

### 6. 构建生产版本

```bash
pnpm build
```

## 📁 项目结构

```
src/
├── assets/                 # 静态资源
├── components/             # 可复用组件
│   └── ChatBot/           # 聊天机器人组件
│       ├── ChatBot.tsx    # 主要聊天组件  
│       └── chatbot.module.css # 样式文件
├── constants/              # 常量定义
├── data/                   # 数据文件
│   ├── README.md          # 数据配置说明
│   └── tourism-data.example.json # 旅游数据示例
├── hooks/                  # 自定义React Hooks
├── i18n/                   # 国际化配置
├── layouts/                # 布局组件  
├── routes/                 # 路由配置
├── services/               # 业务服务层
│   ├── zhipuai.ts         # 智谱AI服务
│   └── tourism.ts         # 旅游数据服务
├── stores/                 # MobX状态管理
├── styles/                 # 全局样式
├── utils/                  # 工具函数
├── vendors/                # 第三方库适配
├── views/                  # 页面组件
│   ├── Home/              # 首页
│   └── NotFound/          # 404页面
├── App.tsx                # 应用根组件
├── main.tsx               # 应用入口
└── vite-env.d.ts          # Vite类型定义
```

## 🎯 主要功能

### 智能对话

- 自然语言理解用户的旅游需求
- 解析预算、时间、主题等关键信息
- 提供个性化的旅游建议
- 支持连续对话和上下文理解

### 景点推荐

- 覆盖多个热门旅游城市
- 包含门票价格、游览时长等实用信息
- 提供直接购票链接
- 支持按标签筛选景点

### 路线规划

- 多日游路线推荐
- 预算估算和最佳季节建议
- 城市间连接规划
- 个性化行程定制

## 🔧 开发配置

### 环境变量配置

创建 `.env` 文件配置以下环境变量：

| 变量名                  | 说明              | 默认值       | 必需 |
| ----------------------- | ----------------- | ------------ | ---- |
| `VITE_ZHIPUAI_API_KEY`  | 智谱AI API密钥    | -            | 否\* |
| `VITE_ZHIPUAI_API_BASE` | 智谱AI API基础URL | 官方API地址  | 否   |
| `VITE_APP_TITLE`        | 应用标题          | 智能旅游助手 | 否   |
| `VITE_APP_DESCRIPTION`  | 应用描述          | -            | 否   |

\*不配置API密钥时将使用模拟回复

### 添加新的旅游数据

编辑 `src/data/tourism-data.json` 文件，按照以下格式添加：

```json
{
  "destinations": [
    {
      "id": "城市ID",
      "name": "城市名称",
      "description": "城市描述",
      "attractions": [
        {
          "id": "景点唯一ID",
          "name": "景点名称",
          "description": "景点详细描述",
          "price": 100,
          "bookingUrl": "https://example.com",
          "tags": ["标签1", "标签2"],
          "duration": "2-3小时",
          "thumbnailUrl": "图片URL",
          "recommendation": "推荐理由"
        }
      ]
    }
  ]
}
```

### 更换AI模型

修改 `src/services/zhipuai.ts` 中的模型配置：

```typescript
model: 'glm-4.5-air', // 可选: glm-4, glm-4-plus, glm-4-flash 等
```

### 自定义UI主题

- 全局样式: `src/styles/`
- 组件样式: 使用CSS Modules，如 `src/components/ChatBot/chatbot.module.css`
- 支持PostCSS插件: nested、custom-media、autoprefixer

## 🌟 特色组件

### Ant Design 组件集成

使用了企业级UI组件库，包括：

- `Input` - 输入框组件
- `Button` - 按钮组件  
- `Card` - 卡片组件
- `List` - 列表组件
- `Message` - 消息提示组件
- `Layout` - 布局组件

### 智能解析

自动从用户消息中提取：

- 预算信息（如"3000元"）
- 时间信息（如"5天"）
- 城市偏好（如"北京"、"上海"）
- 主题偏好（如"历史文化"、"现代都市"）

### 代码质量保证

- **ESLint**: 代码规范检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks自动化
- **lint-staged**: 提交前代码检查
- **TypeScript**: 静态类型检查

## 📋 可用脚本

```bash
# 开发
pnpm dev          # 启动开发服务器
pnpm start        # 启动开发服务器（别名）

# 构建
pnpm build        # 构建生产版本
pnpm preview      # 预览生产版本

# 代码质量
pnpm lint         # ESLint检查并修复
pnpm format       # Prettier格式化代码

# Git hooks
pnpm prepare      # 安装Husky hooks
```

## 📝 开发计划

- [ ] 增加更多城市和景点数据
- [ ] 支持实时票务价格查询API集成
- [ ] 添加天气信息集成
- [ ] 完善多语言支持（英文界面）
- [ ] 添加用户历史对话记录功能
- [ ] 集成地图显示功能
- [ ] 支持图片上传和识别
- [ ] 添加语音对话功能
- [ ] 移动端响应式优化
- [ ] PWA支持

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 遵循项目的ESLint和Prettier配置
- 提交信息遵循Conventional Commits规范
- 确保所有测试通过
- 添加适当的注释和文档

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [智谱AI](https://open.bigmodel.cn/) - 提供强大的大语言模型
- [Ant Design](https://ant.design/) - 企业级UI设计语言和React组件库
- [LangChain](https://langchain.com/) - 优秀的AI应用开发框架
- [Vite](https://vitejs.dev/) - 快速的前端构建工具
- [React](https://reactjs.org/) - 用户界面库

---

> 💡 **提示**: 如需帮助或有任何问题，请查看项目的Issue页面或创建新的Issue。
