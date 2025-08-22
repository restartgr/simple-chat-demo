export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ZhipuAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

class ZhipuAIService {
  private baseURL: string;
  private apiKey: string;

  constructor(apiKey?: string, baseURL?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_ZHIPUAI_API_KEY || '';
    this.baseURL =
      baseURL ||
      import.meta.env.VITE_ZHIPUAI_API_BASE ||
      'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    if (!this.apiKey) {
      console.warn('智谱AI API密钥未设置，将使用模拟回复');
    }
  }

  async chatCompletion(messages: ChatMessage[]): Promise<string> {
    // 如果没有API密钥，直接返回模拟回复
    if (!this.apiKey) {
      return '抱歉，我现在无法回答您的问题。';
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'glm-4.5-air',
          messages: messages,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
          enable_search: false,
          do_sample: true,
          tools: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ZhipuAIResponse = await response.json();

      return (
        data.choices[0]?.message?.content || '抱歉，我现在无法回答您的问题。'
      );
    } catch (error) {
      console.error('智谱AI调用失败:', error);
      // 模拟回复用于演示
      return '抱歉，我现在无法回答您的问题。';
    }
  }

  // 流式传输方法
  async chatCompletionStream(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: (fullContent: string) => void
  ): Promise<void> {
    // 如果没有API密钥，使用模拟流式传输
    if (!this.apiKey) {
      this.simulateStreamResponse(onChunk, onComplete);
      return;
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'glm-4.5-air',
          messages: messages,
          temperature: 0.7,
          top_p: 0.9,
          stream: true,
          enable_search: false,
          do_sample: true,
          tools: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const data = line.trim().slice(6);
            if (data === '[DONE]') {
              console.log('流式传输完成标志');
              onComplete(fullContent);
              return;
            }

            // 跳过空数据
            if (!data.trim()) {
              continue;
            }

            try {
              const parsed = JSON.parse(data);

              const delta = parsed.choices?.[0]?.delta;
              if (delta) {
                // 只使用正式内容，忽略思考过程
                const content = delta.content || '';

                if (content) {
                  fullContent += content;
                  onChunk(content);
                }
              }
            } catch (parseError) {
              console.log('解析错误:', parseError, '原始数据:', data);
            }
          }
        }
      }

      onComplete(fullContent);
    } catch (error) {
      console.error('流式传输失败:', error);
      // 降级到模拟流式传输
      this.simulateStreamResponse(onChunk, onComplete);
    }
  }

  // 模拟流式传输（用于演示或API失败时的后备方案）
  private simulateStreamResponse(
    onChunk: (chunk: string) => void,
    onComplete: (fullContent: string) => void
  ): void {
    console.log('开始模拟流式传输...');

    const mockResponse = `## 三日游行程安排：

### 第一天：东京市区观光
- 上午：抵达羽田机场后，建议选择我们的机场接送服务，7座埃尔法豪华体验

[PRODUCT:LINKTIVITY-2IV2I]

- 下午：前往东京晴空塔，推荐超值套票，包含展望台门票和地铁24小时通票

[PRODUCT:LINKTIVITY-3PWVV]

### 第二天：传统文化体验
- 晚上：在新宿欣赏精彩的忍者&歌舞伎表演，体验日本传统文化的现代演绎

[PRODUCT:Ninja-Kabuki-Tokyo]

### 第三天：夜景巡航
- 夜晚：乘坐东京双塔水上巴士夜间巡航，欣赏隅田川和东京湾的璀璨夜景

[PRODUCT:LINKTIVITY-RHT5G]

## 总预算：约¥15,200

这个行程安排让您既能体验东京的现代魅力，又能感受传统文化的底蕴，相信会给您留下难忘的回忆！`;

    const chunks = mockResponse.split('');
    let index = 0;
    let fullContent = '';

    // 稍微延迟开始，模拟真实API的延迟
    setTimeout(() => {
      const interval = setInterval(() => {
        if (index < chunks.length) {
          const chunk = chunks[index];
          fullContent += chunk;
          onChunk(chunk);
          index++;

          // 每输出100个字符打印一次调试信息
          if (index % 100 === 0) {
            console.log(`已输出 ${index}/${chunks.length} 个字符`);
          }
        } else {
          clearInterval(interval);
          console.log('模拟流式传输完成，总长度:', fullContent.length);
          onComplete(fullContent);
        }
      }, 30); // 每30ms输出一个字符
    }, 500); // 200ms后开始输出
  }
}

export default ZhipuAIService;
