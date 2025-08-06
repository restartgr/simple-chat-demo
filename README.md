# 智能旅游聊天机器人

基于LangChain + 智谱AI + Ant Design 构建的智能旅游助手，可以为用户推荐旅游路线、景点信息，并提供票务链接。

## ✨ 功能特性

- 🤖 **智能对话**: 基于智谱AI GLM-4模型的自然语言交互
- 🗺️ **路线推荐**: 根据用户偏好智能推荐旅游路线
- 🎭 **景点介绍**: 提供详细的景点信息和购票链接
- 💰 **预算规划**: 根据预算范围推荐合适的旅游方案
- 📅 **时间规划**: 支持按旅行天数筛选推荐内容
- 🎨 **现代UI**: 使用Ant Design X构建专业的AI对话界面

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **AI组件库**: @ant-design/x - 专为AI应用设计的组件库
- **UI组件**: Ant Design
- **大模型**: 智谱AI GLM-4
- **AI框架**: LangChain
- **状态管理**: MobX
- **路由**: React Router 7
- **构建工具**: Vite
- **包管理**: pnpm

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置智谱AI API

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

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 构建生产版本

```bash
pnpm build
```

## 📁 项目结构

```
src/
├── components/
│   └── ChatBot/           # 聊天机器人组件
│       ├── ChatBot.tsx    # 主要聊天组件
│       └── chatbot.module.css # 样式文件
├── data/
│   └── tourism-data.json  # 旅游数据（模拟数据库）
├── services/
│   ├── zhipuai.ts         # 智谱AI服务
│   └── tourism.ts         # 旅游数据服务
├── views/
│   └── Home/              # 首页
└── ...
```

## 🎯 主要功能

### 智能对话

- 自然语言理解用户的旅游需求
- 解析预算、时间、主题等关键信息
- 提供个性化的旅游建议

### 景点推荐

- 覆盖北京、上海、杭州、广州等热门城市
- 包含门票价格、游览时长等实用信息
- 提供直接购票链接

### 路线规划

- 多日游路线推荐
- 预算估算和最佳季节建议
- 城市间连接规划

## 🔧 自定义配置

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

编辑 `src/data/tourism-data.json` 文件，按照现有格式添加：

```json
{
  "destinations": [...],
}
```

### 更换AI模型

修改 `src/services/zhipuai.ts` 中的模型配置：

```typescript
model: 'glm-4-flash', // 可选: glm-4, glm-4-plus 等
```

### 自定义UI主题

修改 `src/views/Home/home.module.css` 和 `src/components/ChatBot/chatbot.module.css` 中的样式。

## 🌟 特色组件

### @ant-design/x 集成

使用了专为AI应用设计的组件库，包括：

- `Bubble` - 消息气泡
- `Sender` - 消息发送
- `Welcome` - 欢迎界面
- `Prompts` - 快速提示
- `useXAgent` - AI代理管理
- `useXChat` - 对话管理

### 智能解析

自动从用户消息中提取：

- 预算信息（如"3000元"）
- 时间信息（如"5天"）
- 城市偏好（如"北京"、"上海"）
- 主题偏好（如"历史文化"、"现代都市"）

## 📝 开发计划

- [ ] 增加更多城市和景点数据
- [ ] 支持实时票务价格查询
- [ ] 添加天气信息集成
- [ ] 支持多语言（英文）
- [ ] 添加用户历史对话记录
- [ ] 集成地图显示功能
- [ ] 支持图片上传和识别

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [智谱AI](https://open.bigmodel.cn/) - 提供强大的大语言模型
- [Ant Design X](https://x.ant.design/) - 专业的AI组件库
- [LangChain](https://langchain.com/) - 优秀的AI应用开发框架
