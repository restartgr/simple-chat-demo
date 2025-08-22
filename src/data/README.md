# 数据配置说明

## 旅游数据配置

### 文件说明

- `tourism-data.example.json` - 数据结构示例文件

### 如何配置

1. 新建 `tourism-data.json` 文件，参考示例文件的数据结构：

   ```bash
   touch tourism-data.json
   ```

2. 将 `tourism-data.example.json` 中的数据结构复制到新建的文件中，并替换为真实数据

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
          "price": "价格数字",
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

### 注意事项

- 所有 ID 必须唯一
- 价格使用数字类型
- URL 需要是有效的链接格式
