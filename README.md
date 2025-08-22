# 🎌 东京旅游推荐助手

基于智谱AI + shadcn/ui + Tailwind CSS 构建的现代化智能旅游助手，专注为用户提供个性化的东京旅游推荐和行程规划。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-blue.svg)

## ✨ 功能特性

- 🤖 **AI智能对话**: 基于智谱AI GLM-4.5-air模型的自然语言交互
- 🎌 **东京专业推荐**: 专注东京旅游，提供精准的本地化建议
- 💰 **智能预算规划**: 根据用户预算推荐最合适的景点和活动
- 🎭 **产品推荐集成**: 无缝集成旅游产品卡片，支持直接购票
- ⚡ **实时流式传输**: 支持AI思考过程和内容生成的流式显示
- 🎨 **现代化UI设计**: 使用shadcn/ui + Tailwind CSS打造精美界面
- 📱 **完全响应式**: 移动优先的设计，完美适配各种设备
- 🌟 **优雅动画**: 流畅的交互动画和过渡效果

## 🛠️ 技术栈

### 核心框架
- **前端框架**: React 18.3 + TypeScript 5.8
- **构建工具**: Vite 6.3
- **路由**: React Router 7.6

### UI & 样式
- **组件库**: shadcn/ui (基于 Radix UI)
- **样式框架**: Tailwind CSS 4.1
- **图标**: Lucide React
- **动画**: Tailwind CSS 动画系统

### AI & 数据
- **大模型**: 智谱AI GLM-4.5-air
- **流式传输**: 支持thinking和content的实时流式显示
- **数据处理**: TypeScript 接口定义

### 开发工具
- **代码质量**: ESLint + Prettier + Husky + lint-staged
- **类型检查**: TypeScript 严格模式
- **包管理**: pnpm

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
2. 在项目根目录创建 `.env` 文件：

```bash
# 智谱AI配置
VITE_ZHIPUAI_API_KEY=your_zhipu_ai_api_key_here
VITE_ZHIPUAI_API_BASE=https://open.bigmodel.cn/api/paas/v4/chat/completions

# 应用配置
VITE_APP_TITLE=东京旅游推荐助手
VITE_APP_DESCRIPTION=基于AI的智能东京旅游推荐系统
```

**💡 提示**: 如果不配置API密钥，系统将自动使用模拟回复进行演示。

### 4. 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3300` 启动

### 5. 构建生产版本

```bash
pnpm build
```

## 🎨 设计亮点

### 现代化界面设计

- **渐变背景**: 紫色到蓝色的现代渐变背景
- **毛玻璃效果**: 主聊天容器采用毛玻璃效果
- **圆角设计**: 大圆角设计语言，更加现代
- **阴影层次**: 多层次阴影系统，增强视觉深度

### 智能欢迎界面

- **动态头像**: 机器人头像配合黄色星形装饰
- **快速开始**: 6个精心设计的快速操作按钮
- **功能展示**: 清晰的功能介绍和使用指引
- **响应式布局**: 完美适配桌面和移动设备

### 流式对话体验

- **思考阶段**: 显示"AI 正在思考中..."的加载动画
- **内容生成**: 实时流式显示AI回复内容
- **智能切换**: 自动从思考状态切换到内容显示
- **产品卡片**: 无缝集成的旅游产品推荐卡片

## 📁 项目结构

```
src/
├── components/
│   ├── ui/                     # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── avatar.tsx
│   │   └── separator.tsx
│   └── ChatBot/
│       └── ChatBot.tsx         # 主聊天组件
├── lib/
│   └── utils.ts                # Tailwind 工具函数
├── styles/
│   └── index.css               # 全局样式和主题变量
├── services/
│   ├── zhipuai.ts             # 智谱AI服务
│   └── tourism.ts             # 旅游数据服务
├── data/
│   └── tourism-data.json      # 东京旅游产品数据
├── views/
│   └── Home/
│       └── Home.tsx           # 首页组件
└── App.tsx                    # 应用根组件
```

## 🎯 核心功能

### AI智能对话

- **自然语言理解**: 准确理解用户的旅游需求
- **预算解析**: 自动识别用户提到的预算信息
- **个性化推荐**: 基于用户偏好提供定制化建议
- **上下文理解**: 支持多轮对话和语境理解

### 东京旅游专业知识

- **景点推荐**: 涵盖东京主要旅游景点
- **交通指南**: 详细的交通路线和费用信息
- **文化体验**: 传统文化和现代都市的完美结合
- **实用信息**: 开放时间、票价、注意事项等

### 产品推荐系统

- **智能匹配**: 根据用户需求匹配相关旅游产品
- **实时展示**: 在对话中自然融入产品推荐
- **详细信息**: 价格、时长、标签等完整信息
- **直接购买**: 提供购票链接，支持直接跳转

## 🔧 开发配置

### 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `VITE_ZHIPUAI_API_KEY` | 智谱AI API密钥 | - | 否* |
| `VITE_ZHIPUAI_API_BASE` | 智谱AI API基础URL | 官方API地址 | 否 |
| `VITE_APP_TITLE` | 应用标题 | 东京旅游推荐助手 | 否 |
| `VITE_APP_DESCRIPTION` | 应用描述 | - | 否 |

*不配置API密钥时将使用模拟回复演示

### shadcn/ui 配置

项目使用 shadcn/ui 作为组件库，配置文件 `components.json`:

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Tailwind CSS 主题

支持明暗主题切换，主要颜色变量：

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  /* ... 更多颜色变量 */
}
```

## 📋 可用脚本

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm start            # 启动开发服务器（别名）

# 构建
pnpm build            # 构建生产版本
pnpm preview          # 预览生产版本

# 代码质量
pnpm lint             # ESLint检查并修复
pnpm format           # Prettier格式化代码

# Git hooks
pnpm prepare          # 安装Husky hooks
```

## 🌟 设计系统

### 色彩系统

- **主色**: 蓝色系 (`primary`)
- **辅助色**: 灰色系 (`secondary`, `muted`)
- **强调色**: 红色 (`destructive`)
- **背景**: 渐变紫蓝色

### 组件设计原则

- **一致性**: 统一的设计语言和交互模式
- **可访问性**: 符合WCAG标准的无障碍设计
- **响应式**: 移动优先的响应式设计
- **性能**: 优化的组件渲染和动画性能

### 动画系统

- **微交互**: 按钮悬停、点击反馈
- **页面转场**: 流畅的页面切换动画
- **加载状态**: 优雅的加载和等待动画
- **消息动画**: 聊天消息的滑入动画

## 🔄 从 Antd 到 shadcn/ui 的迁移

本项目经历了一次完整的UI框架迁移，主要改进：

### 技术升级

- ✅ **组件库**: Antd → shadcn/ui + Radix UI
- ✅ **样式系统**: CSS Modules → Tailwind CSS
- ✅ **设计语言**: 企业级 → 现代化
- ✅ **性能优化**: 更小的打包体积和更好的性能

### 用户体验提升

- ✅ **视觉设计**: 更加现代和精美的界面
- ✅ **交互体验**: 更流畅的动画和反馈
- ✅ **响应式**: 更好的移动端适配
- ✅ **可定制性**: 更灵活的主题和样式定制

## 📝 开发计划

- [ ] 🌍 **多城市支持**: 扩展到更多日本城市
- [ ] 🗺️ **地图集成**: 添加互动地图显示
- [ ] 📷 **图片识别**: 支持上传图片获取景点信息
- [ ] 🎵 **语音交互**: 添加语音输入和播放功能
- [ ] 📱 **PWA支持**: 支持离线使用和安装
- [ ] 🌐 **多语言**: 支持英文、中文、日文界面
- [ ] 💾 **历史记录**: 用户对话历史保存
- [ ] 🔔 **智能提醒**: 旅行计划提醒功能

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 遵循项目的ESLint和Prettier配置
- 使用TypeScript严格模式
- 组件采用函数式组件 + Hooks
- 样式优先使用Tailwind CSS类名
- 提交信息遵循Conventional Commits规范

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [智谱AI](https://open.bigmodel.cn/) - 提供强大的大语言模型支持
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的React组件库
- [Tailwind CSS](https://tailwindcss.com/) - 现代化的CSS框架
- [Radix UI](https://www.radix-ui.com/) - 高质量的原始组件
- [Lucide](https://lucide.dev/) - 精美的图标库
- [Vite](https://vitejs.dev/) - 快速的前端构建工具
- [React](https://reactjs.org/) - 优秀的用户界面库

---

> 💡 **提示**: 这是一个现代化的AI旅游助手项目，展示了如何将传统UI框架迁移到现代设计系统。如需帮助或有任何问题，请创建Issue或查看项目文档。

🎌 **让AI为您的东京之旅保驾护航！**
