# 数据配置说明

## 旅游数据配置

### 文件说明
- `tourism-data.json` - 实际的旅游数据文件（已添加到 .gitignore）
- `tourism-data.example.json` - 数据结构示例文件

### 如何配置

1. 复制示例文件：
   ```bash
   cp tourism-data.example.json tourism-data.json
   ```

2. 编辑 `tourism-data.json` 文件，替换示例数据为真实数据

### 数据结构说明

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
          "price": 价格数字,
          "bookingUrl": "预订链接",
          "tags": ["标签数组"],
          "duration": "游玩时长",
          "thumbnailUrl": "缩略图URL",
          "recommendation": "推荐理由"
        }
      ]
    }
  ]
}
```

### 可用标签类型
- `ATTRACTION` - 景点
- `SHOW` - 表演
- `CULTURE` - 文化
- `CRUISES` - 巡游
- `NIGHT_VIEW` - 夜景
- `RAILWAY_TICKET` - 交通票券
- `PASS` - 通票
- `TOWER_BUILDING` - 高塔建筑
- `BUNDLE` - 套票

### 注意事项
- 所有 ID 必须唯一
- 价格使用数字类型
- URL 需要是有效的链接格式
- 标签应使用预定义的类型 