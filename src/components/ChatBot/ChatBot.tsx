import React, { useState, useRef, useCallback } from 'react';
import { Send, User, Bot, Clock, Tag, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import ZhipuAIService from '../../services/zhipuai';
import travelService, { type TravelProduct } from '../../services/tourism';

// 混合内容渲染组件（markdown + 产品卡片）
const MixedContentRenderer: React.FC<{
  content: string;
  allProducts: TravelProduct[];
}> = ({ content, allProducts }) => {
  // 分割内容，找出markdown文本和产品占位符
  const parts = content.split(/(<!-- PRODUCT_PLACEHOLDER:[A-Za-z0-9-_]+ -->)/g);

  return (
    <div className="flex flex-col gap-4">
      {parts.map((part, index) => {
        // 检查是否是产品占位符
        const productMatch = part.match(
          /<!-- PRODUCT_PLACEHOLDER:([A-Za-z0-9-_]+) -->/
        );
        if (productMatch) {
          const productId = productMatch[1];
          const product = allProducts.find(p => p.id === productId);

          if (product) {
            return <ProductCard key={`product-${index}`} product={product} />;
          }
          // 如果没找到产品，不显示错误提示，直接跳过
          return null;
        } else {
          // 渲染markdown内容
          return part.trim() ? (
            <div key={`markdown-${index}`} className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children} 🔗
                    </a>
                  ),
                }}
              >
                {part}
              </ReactMarkdown>
            </div>
          ) : null;
        }
      })}
    </div>
  );
};

// 产品卡片组件
const ProductCard: React.FC<{ product: TravelProduct }> = ({ product }) => (
  <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 bg-white">
    <CardContent className="p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full sm:w-36 h-28 object-cover rounded-xl shadow-sm"
            onError={e => {
              e.currentTarget.src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0IiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDE0NCAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDQiIGhlaWdodD0iMTEyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03MiA1NkwzNiA0MEgxMDhMNzIgNTZaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjU2IiBjeT0iNDAiIHI9IjQiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
            }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-lg text-blue-600 line-clamp-1">
              {product.name}
            </h4>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">
                ¥{product.price}
              </div>
              <div className="text-xs text-gray-500">起</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {product.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {product.duration}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              查看详情
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ChatItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  allProducts?: TravelProduct[];
  hasRecommendations?: boolean;
  isStreaming?: boolean;
}

// 欢迎屏幕组件 - 模仿图片设计
const WelcomeScreen: React.FC<{ onExampleClick: (text: string) => void }> = ({
  onExampleClick,
}) => {
  const quickActions = [
    { icon: '🗼', label: '东京旅游', value: '我想去东京旅游，预算50000日元' },
    { icon: '🏯', label: '晴空塔', value: '推荐东京晴空塔的门票' },
    { icon: '🚊', label: '交通券', value: '东京地铁交通券推荐' },
    { icon: '🌃', label: '夜景巡航', value: '东京夜景巡航体验' },
    { icon: '🎭', label: '文化体验', value: '东京传统文化表演体验' },
    { icon: '🚗', label: '接送服务', value: '东京机场接送服务' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-12 text-center gap-8">
      {/* 机器人头像 */}
      <div>
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* 欢迎文案 */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          👋 欢迎使用东京旅游推荐助手！
        </h1>
        <p className="text-gray-600 max-w-lg leading-relaxed">
          我是基于公司旅游产品数据集的专业推荐机器人，为您推荐最合适的东京旅游产品
        </p>
      </div>

      {/* 功能介绍 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          我可以为您推荐：
        </h3>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">🗼 东京晴空塔套票</div>
          <div className="flex items-center gap-2">🚊 地铁交通券</div>
          <div className="flex items-center gap-2">🌃 夜景巡航体验</div>
          <div className="flex items-center gap-2">🎭 传统文化表演</div>
          <div className="flex items-center gap-2">🚗 机场接送服务</div>
          <div className="flex items-center gap-2">🎨 博物馆门票</div>
        </div>
      </div>

      {/* 快速开始 */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
          ✨ 快速开始
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-12 px-4 text-sm border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              onClick={() => onExampleClick(action.value)}
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChatBot: React.FC = () => {
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const zhipuAI = useRef(new ZhipuAIService());

  // 解析用户消息中的预算
  const parseUserBudget = useCallback((message: string): number | undefined => {
    const budgetMatch = message.match(/(\d+)元|(\d+)块|预算.*?(\d+)/);
    if (budgetMatch) {
      return parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3]);
    }
    return undefined;
  }, []);

  // 使用AI判断是否是旅游相关查询
  const isTravelRelatedQuery = useCallback(
    async (
      userInput: string
    ): Promise<{
      isTravel: boolean;
      isServerError: boolean;
      errorMessage?: string;
    }> => {
      try {
        const response = await zhipuAI.current.chatCompletion([
          {
            role: 'user',
            content: `please judge whether the following sentence is about Japan tourism: ${userInput}, only answer "yes" or "no"`,
          },
        ]);
        return {
          isTravel: response.includes('yes'),
          isServerError: false,
        };
      } catch (error: unknown) {
        console.error('AI判断错误:', error);
        return {
          isTravel: true, // 默认认为是旅游相关
          isServerError: false,
        };
      }
    },
    []
  );
  // 处理发送消息
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // 添加用户消息
    const userChatItem: ChatItem = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setChatItems(prev => [...prev, userChatItem]);

    try {
      // 使用AI判断是否是旅游相关查询
      const travelQueryResult = await isTravelRelatedQuery(userMessage);

      // 如果是服务器错误，显示错误信息
      if (travelQueryResult.isServerError) {
        const errorResponse: ChatItem = {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content: `❌ ${travelQueryResult.errorMessage}`,
          timestamp: new Date(),
          hasRecommendations: false,
        };
        setChatItems(prev => [...prev, errorResponse]);
        return;
      }

      // 如果不是旅游查询，显示提示信息
      if (!travelQueryResult.isTravel) {
        const nonTravelResponse: ChatItem = {
          id: `${Date.now()}-non-travel`,
          role: 'assistant',
          content:
            '很抱歉，我只能推荐东京的旅游产品，请提供东京旅游相关的问题哦~',
          timestamp: new Date(),
          hasRecommendations: false,
        };
        setChatItems(prev => [...prev, nonTravelResponse]);
        return;
      }

      // 解析用户预算
      const budget = parseUserBudget(userMessage);

      // 获取所有旅游产品数据
      const allProducts = travelService.getAllProducts();

      // Build complete dataset information
      const datasetInfo = `
## Company Tourism Product Dataset

Our company provides the following ${allProducts.length} Tokyo tourism products:

${allProducts
  .map(
    (product, index) => `
${index + 1}. ${product.name}
   - Price: ¥${product.price}
   - Duration: ${product.duration}
   - Tags: ${product.tags.join(', ')}
   - Product ID: ${product.id}
   - Recommendation: ${product.recommendation}
   - Description: ${product.description}
`
  )
  .join('\n')}

User Budget: ${budget ? `¥${budget}` : 'Not specified'}
User Request: ${userMessage}
      `;

      // Build system prompt
      const systemPrompt = `You are a professional Tokyo tourism recommendation assistant. You can plan comprehensive Tokyo travel itineraries including various attractions, but please reference the dataset below when our company has relevant products:

${datasetInfo}

**IMPORTANT: Please output the final recommendation results directly, without showing any thinking process, analysis process, or reasoning steps.**

【UPDATED GUIDANCE PRINCIPLES】
1. You can recommend ANY Tokyo attractions, restaurants, activities, and experiences to create a comprehensive travel plan
2. When mentioning attractions/activities that match our company's products in the dataset, you MUST include the corresponding [PRODUCT:ProductID] tag
3. For attractions/activities NOT covered by our products, provide general recommendations WITHOUT product tags
4. Only use [PRODUCT:ProductID] tags for products that actually exist in our dataset
5. Filter recommendations based on user budget - if our products exceed budget, you can still mention the attraction but note the budget constraint
6. Use markdown format with clear structure

【PRODUCT INTEGRATION RULES】
7. Review each attraction/activity you recommend against our product dataset
8. If we have a matching product (same location/activity), include the [PRODUCT:ProductID] tag
9. If we don't have a matching product, provide general advice (how to get there, general pricing, tips, etc.)
10. Make the integration natural - don't force our products where they don't fit

【CRITICAL TECHNICAL REQUIREMENTS - STREAMING OUTPUT COMPATIBILITY】
11. When outputting product tags [PRODUCT:ProductID], they must be output as a complete unit and cannot be split
12. It is recommended to add line breaks before and after product tags to ensure independence
13. Product IDs must be complete, with strict format: [PRODUCT:LINKTIVITY-XXXXX]
14. If outputting multiple products, each product tag must be output completely without interruption

Please analyze the user request "${userMessage}" and design a comprehensive Tokyo travel plan. Include our company's products where relevant, but also provide complete travel guidance for other attractions.

IMPORTANT REMINDERS:
- Each [PRODUCT:ProductID] must be on its own line
- There must be blank lines before and after product IDs
- Product tags cannot be split and must be output completely
- Strictly use product IDs from the dataset

Example format (showing how to mix our products with general recommendations):

## 三日游行程安排：

### 第一天：东京市区观光
- 上午：抵达羽田机场后，建议选择我们的机场接送服务

[PRODUCT:LINKTIVITY-2IV2I]

- 下午：前往东京晴空塔，推荐超值套票

[PRODUCT:LINKTIVITY-3PWVV]

- 晚上：前往涩谷十字路口体验东京夜景，可在附近的餐厅用餐（建议预算：¥3000-5000）

### 第二天：传统文化体验
- 上午：参观浅草寺，体验传统日本文化（免费参观，地铁：¥200）
- 下午：在仲见世通购买传统手工艺品和小吃
- 晚上：欣赏忍者&歌舞伎表演

[PRODUCT:Ninja-Kabuki-Tokyo]

### 第三天：现代东京探索
- 上午：游览原宿和表参道，体验潮流文化（交通费：¥300）
- 下午：参观明治神宫，感受宁静氛围（免费参观）
- 夜晚：乘坐东京双塔水上巴士夜间巡航

[PRODUCT:LINKTIVITY-RHT5G]

总预算：约¥xxxx（包含我们的产品 + 其他活动估算费用）



Please start your recommendations:`;

      // 创建初始的AI回复项（用于流式更新）
      const aiChatItemId = `${Date.now()}-ai`;
      let hasAddedChatItem = false; // 标记是否已添加聊天项

      // 使用流式传输获取AI回复
      let fullResponse = '';

      await zhipuAI.current.chatCompletionStream(
        [
          {
            role: 'user',
            content: systemPrompt,
          },
        ],
        // onChunk: 每次接收到新内容时的回调
        (chunk: string) => {
          fullResponse += chunk;
          // 智能处理产品标记：只替换完整的产品标记，避免部分匹配
          let processedContent = fullResponse;

          // 检查是否有不完整的产品标记（避免在流式传输中途替换）
          const incompleteMatch = processedContent.match(
            /\[PRODUCT:[A-Za-z0-9-_]*$/
          );

          if (incompleteMatch) {
            // 如果检测到不完整的产品标记，先不替换，等待完整
            const lastCompleteIndex = processedContent.lastIndexOf(
              incompleteMatch[0]
            );
            const completeContent = processedContent.substring(
              0,
              lastCompleteIndex
            );
            const incompleteContent =
              processedContent.substring(lastCompleteIndex);

            // 只处理完整部分
            const processedCompleteContent = completeContent.replace(
              /\[PRODUCT:([A-Za-z0-9-_]+)\]/g,
              '<!-- PRODUCT_PLACEHOLDER:$1 -->'
            );

            processedContent = processedCompleteContent + incompleteContent;
          } else {
            // 如果没有不完整的标记，正常处理
            processedContent = processedContent.replace(
              /\[PRODUCT:([A-Za-z0-9-_]+)\]/g,
              '<!-- PRODUCT_PLACEHOLDER:$1 -->'
            );
          }

          // 调试信息
          if (fullResponse.length % 50 === 0) {
            console.log('流式传输进度:', fullResponse.length, '字符');
          }

          // 检查是否有实际内容（非空且不只是空白字符）
          const hasContent = processedContent.trim().length > 0;

          // 只有当有实际内容且尚未添加聊天项时，才添加聊天项并关闭loading
          if (hasContent && !hasAddedChatItem) {
            const initialAiChatItem: ChatItem = {
              id: aiChatItemId,
              role: 'assistant',
              content: processedContent,
              timestamp: new Date(),
              allProducts: allProducts,
              hasRecommendations: false,
              isStreaming: true,
            };

            setChatItems(prev => [...prev, initialAiChatItem]);
            setLoading(false);
            hasAddedChatItem = true;
          } else if (hasContent && hasAddedChatItem) {
            // 如果已经添加了聊天项，只更新内容
            setChatItems(prev =>
              prev.map(item =>
                item.id === aiChatItemId
                  ? {
                      ...item,
                      content: processedContent,
                      isStreaming: true,
                    }
                  : item
              )
            );
          }
        },
        // onComplete: 流式传输完成时的回调
        (finalContent: string) => {
          // 从AI回复中提取推荐的产品ID
          const extractProductIds = (aiResponse: string): string[] => {
            const idMatches = aiResponse.match(/\[PRODUCT:([A-Za-z0-9-_]+)\]/g);
            if (idMatches) {
              return idMatches.map(match =>
                match.replace(/\[PRODUCT:([A-Za-z0-9-_]+)\]/, '$1')
              );
            }
            return [];
          };

          const recommendedProductIds = extractProductIds(finalContent);

          // 处理最终内容
          const finalProcessedContent = finalContent.replace(
            /\[PRODUCT:([A-Za-z0-9-_]+)\]/g,
            '<!-- PRODUCT_PLACEHOLDER:$1 -->'
          );

          // 确保在完成时loading状态被关闭
          setLoading(false);

          // 如果还没有添加聊天项（内容为空的情况），添加一个空内容的项
          if (!hasAddedChatItem) {
            const finalAiChatItem: ChatItem = {
              id: aiChatItemId,
              role: 'assistant',
              content:
                finalProcessedContent || '抱歉，我没有生成任何回复内容。',
              timestamp: new Date(),
              allProducts: allProducts,
              hasRecommendations: recommendedProductIds.length > 0,
              isStreaming: false,
            };
            setChatItems(prev => [...prev, finalAiChatItem]);
          } else {
            // 更新为最终状态
            setChatItems(prev =>
              prev.map(item =>
                item.id === aiChatItemId
                  ? {
                      ...item,
                      content: finalProcessedContent,
                      hasRecommendations: recommendedProductIds.length > 0,
                      isStreaming: false,
                    }
                  : item
              )
            );
          }
        }
      );
    } catch (error) {
      console.error('处理请求失败:', error);

      // 如果流式传输过程中出错，需要移除流式状态的项目
      setChatItems(prev => prev.filter(item => !item.isStreaming));

      const errorChatItem: ChatItem = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: '抱歉，我现在无法处理您的请求，请稍后再试。',
        timestamp: new Date(),
      };
      setChatItems(prev => [...prev, errorChatItem]);
    } finally {
      setLoading(false);
    }
  }, [inputValue, loading, isTravelRelatedQuery, parseUserBudget]);

  // 处理示例点击
  const handleExampleClick = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="h-[90vh] flex flex-col shadow-2xl bg-white rounded-2xl overflow-hidden">
          {/* 头部 */}
          <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 shrink-0">
            <CardTitle className="flex items-center justify-center text-xl text-blue-600">
              <Bot className="w-6 h-6 mr-3" />
              东京旅游推荐助手
            </CardTitle>
          </CardHeader>

          {/* 聊天内容区 */}
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {chatItems.length === 0 ? (
                <WelcomeScreen onExampleClick={handleExampleClick} />
              ) : (
                <div className="p-6 flex flex-col gap-6">
                  {chatItems.map(item => (
                    <div
                      key={item.id}
                      className={cn(
                        'flex gap-4 message-animate',
                        item.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {item.role === 'assistant' && (
                        <Avatar className="w-10 h-10 bg-blue-500 flex-shrink-0 shadow-lg">
                          <AvatarFallback className="text-white bg-transparent">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          'max-w-[75%] min-w-[120px]',
                          item.role === 'user' ? 'order-1' : 'order-2'
                        )}
                      >
                        <div
                          className={cn(
                            'rounded-2xl shadow-lg border p-4',
                            item.role === 'user'
                              ? 'bg-blue-500 text-white border-blue-300 ml-auto'
                              : 'bg-white border-gray-200'
                          )}
                        >
                          {item.role === 'user' ? (
                            <p className="text-sm leading-relaxed">
                              {item.content}
                            </p>
                          ) : (
                            <MixedContentRenderer
                              content={item.content}
                              allProducts={item.allProducts || []}
                            />
                          )}
                        </div>

                        <div
                          className={cn(
                            'flex items-center gap-2 mt-2 text-xs text-gray-500',
                            item.role === 'user'
                              ? 'justify-end'
                              : 'justify-start'
                          )}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{item.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {item.role === 'user' && (
                        <Avatar className="w-10 h-10 bg-gray-500 flex-shrink-0 shadow-lg">
                          <AvatarFallback className="text-white bg-transparent">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-4 justify-start message-animate">
                      <Avatar className="w-10 h-10 bg-blue-500 flex-shrink-0 shadow-lg">
                        <AvatarFallback className="text-white bg-transparent">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                          <span className="text-sm">AI 正在思考中...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-100 bg-white p-4 shrink-0">
              <div className="flex gap-3 items-stretch">
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="告诉我您的旅游需求..."
                  className="flex-1 h-12 px-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="h-12 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg shadow-sm font-medium transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  发送
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
