import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
  Divider,
  Spin,
  message as antdMessage
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  TagOutlined,
  LinkOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css/github-markdown-light.css';
import ZhipuAIService from '../../services/zhipuai';
import travelService, { type TravelProduct } from '../../services/tourism';
import styles from './chatbot.module.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 混合内容渲染组件（markdown + 产品卡片）
const MixedContentRenderer: React.FC<{
  content: string;
  allProducts: TravelProduct[];
}> = ({ content, allProducts }) => {
  // 分割内容，找出markdown文本和产品占位符
  const parts = content.split(/(<!-- PRODUCT_PLACEHOLDER:[A-Za-z0-9-_]+ -->)/g);

  return (
    <>
      {parts.map((part, index) => {
        // 检查是否是产品占位符
        const productMatch = part.match(
          /<!-- PRODUCT_PLACEHOLDER:([A-Za-z0-9-_]+) -->/
        );

        if (productMatch) {
          // 找到对应的产品并渲染产品卡片
          const productId = productMatch[1];
          const product = allProducts.find(p => p.id === productId);

          // console.log(`尝试匹配产品 ID: ${productId}`);
          // console.log(`找到的产品:`, product);

          if (product) {
            return <ProductCard key={`product-${index}`} product={product} />;
          }
          // 如果没找到产品，显示一个错误提示
          return (
            <div
              key={`error-${index}`}
              style={{
                padding: '8px',
                margin: '8px 0',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '4px',
                color: '#ff4d4f'
              }}
            >
              未找到产品: {productId}
            </div>
          );
        } else {
          // 渲染markdown内容
          return part.trim() ? (
            <div
              key={`markdown-${index}`}
              className={`markdown-body ${styles.markdownContent}`}
            >
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
                  )
                }}
              >
                {part}
              </ReactMarkdown>
            </div>
          ) : null;
        }
      })}
    </>
  );
};

// 旅游产品卡片组件
const ProductCard: React.FC<{ product: TravelProduct }> = ({ product }) => (
  <div className={styles.attractionCardCustom}>
    <img
      src={product.thumbnailUrl}
      alt={product.name}
      className={styles.attractionImage}
      onError={e => {
        (e.target as HTMLImageElement).src =
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDE2MCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA2MEw2NCA0NEg5Nkw4MCA2MFoiIGZpbGw9IiNEOUQ5RDkiLz4KPGNpcmNsZSBjeD0iNzAiIGN5PSI0NSIgcj0iNSIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
      }}
    />
    <div className={styles.attractionContent}>
      <div className={styles.attractionTitle}>{product.name}</div>
      <div className={styles.attractionDescription}>{product.description}</div>

      <div className={styles.attractionMeta}>
        <div className={styles.attractionMetaItem}>
          <ClockCircleOutlined className="icon" />
          {product.duration}
        </div>
        <div className={styles.attractionMetaItem}>
          <TagOutlined className="icon" />
          {product.tags.join('、')}
        </div>
      </div>

      <div className={styles.attractionRecommendation}>
        💡 {product.recommendation}
      </div>

      <div className={styles.attractionActions}>
        <div className={styles.attractionPrice}>
          <span className="currency">¥</span>
          {product.price}
        </div>
        {product.bookingUrl && (
          <Button
            type="primary"
            size="small"
            icon={<LinkOutlined />}
            onClick={() => window.open(product.bookingUrl, '_blank')}
          >
            立即预订
          </Button>
        )}
      </div>
    </div>
  </div>
);

interface ChatItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: TravelProduct[];
  hasRecommendations?: boolean;
  isStreaming?: boolean;
}

const ChatBot: React.FC = () => {
  const [chatItems, setChatItems] = useState<ChatItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const zhipuAI = useRef(new ZhipuAIService());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 解析用户消息中的预算
  const parseUserBudget = (message: string): number | undefined => {
    const budgetMatch = message.match(/(\d+)元|(\d+)块|预算.*?(\d+)/);
    if (budgetMatch) {
      return parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3]);
    }
    return undefined;
  };

  // 使用AI判断是否是旅游相关查询
  const isTravelRelatedQuery = async (
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
          content: `please judge whether the following sentence is about Japan tourism: ${userInput}, only answer "yes" or "no"`
        }
      ]);
      return {
        isTravel: response.includes('yes'),
        isServerError: false
      };
    } catch (error: unknown) {
      console.error('AI判断错误:', error);

      // 检查是否是API错误响应
      const errorObj = error as { error?: { code?: string; message?: string } };
      if (errorObj?.error?.code || errorObj?.error?.message) {
        const errorCode = errorObj.error.code;
        const errorMessage = errorObj.error.message;

        // 根据错误码返回具体的错误信息
        if (errorCode === '1302') {
          return {
            isTravel: false,
            isServerError: true,
            errorMessage: '服务器繁忙，请稍后重试'
          };
        } else if (errorCode === '1301' || errorCode === '1003') {
          return {
            isTravel: false,
            isServerError: true,
            errorMessage: 'API密钥无效，请联系管理员'
          };
        } else {
          return {
            isTravel: false,
            isServerError: true,
            errorMessage: `服务异常：${errorMessage || '请稍后重试'}`
          };
        }
      }

      // 网络错误或其他未知错误
      const networkErrorObj = error as { message?: string; code?: string };
      if (
        networkErrorObj?.message?.includes('fetch') ||
        networkErrorObj?.code === 'NETWORK_ERROR'
      ) {
        return {
          isTravel: false,
          isServerError: true,
          errorMessage: '网络连接失败，请稍后重试'
        };
      }

      // 其他未知错误，默认认为是旅游查询
      return {
        isTravel: true,
        isServerError: false
      };
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // 添加用户消息
    const userChatItem: ChatItem = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
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
          hasRecommendations: false
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
          hasRecommendations: false
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
      const initialAiChatItem: ChatItem = {
        id: aiChatItemId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        products: allProducts,
        hasRecommendations: false,
        isStreaming: true
      };

      setChatItems(prev => [...prev, initialAiChatItem]);

      // 开始流式传输后立即设置loading为false（因为已经有流式状态了）
      setLoading(false);

      // 使用流式传输获取AI回复
      let fullResponse = '';

      await zhipuAI.current.chatCompletionStream(
        [
          {
            role: 'user',
            content: systemPrompt
          }
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

          // 实时更新聊天项
          setChatItems(prev =>
            prev.map(item =>
              item.id === aiChatItemId
                ? {
                    ...item,
                    content: processedContent,
                    isStreaming: true
                  }
                : item
            )
          );
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

          // console.log('AI原始回复:', finalContent);
          // console.log('提取的产品ID:', recommendedProductIds);
          // console.log('处理后的内容:', finalProcessedContent);

          // 更新为最终状态
          setChatItems(prev =>
            prev.map(item =>
              item.id === aiChatItemId
                ? {
                    ...item,
                    content: finalProcessedContent,
                    hasRecommendations: recommendedProductIds.length > 0,
                    isStreaming: false
                  }
                : item
            )
          );
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
        timestamp: new Date()
      };

      setChatItems(prev => [...prev, errorChatItem]);
      antdMessage.error('服务暂时不可用，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 快速示例按钮
  const QuickExamples: React.FC = () => (
    <div className={styles.quickExamples}>
      <Text
        strong
        style={{ display: 'block', marginBottom: 16, textAlign: 'center' }}
      >
        ✨ 快速开始
      </Text>
      <Space wrap style={{ justifyContent: 'center', width: '100%' }}>
        <Button
          type="primary"
          ghost
          onClick={() => {
            setInputValue('我想去东京旅游，预算30000日元');
            setTimeout(handleSendMessage, 100);
          }}
        >
          🗼 东京旅游
        </Button>
        <Button
          onClick={() => {
            setInputValue('推荐东京晴空塔的门票');
            setTimeout(handleSendMessage, 100);
          }}
        >
          🗼 晴空塔
        </Button>
        <Button
          onClick={() => {
            setInputValue('想要东京地铁交通券');
            setTimeout(handleSendMessage, 100);
          }}
        >
          🚊 交通券
        </Button>
        <Button
          onClick={() => {
            setInputValue('东京夜景巡航推荐');
            setTimeout(handleSendMessage, 100);
          }}
        >
          🌃 夜景巡航
        </Button>
        <Button
          onClick={() => {
            setInputValue('东京传统文化表演体验');
            setTimeout(handleSendMessage, 100);
          }}
        >
          🎭 文化体验
        </Button>
        <Button
          onClick={() => {
            setInputValue('东京机场接送服务');
            setTimeout(handleSendMessage, 100);
          }}
        >
          🚗 接送服务
        </Button>
      </Space>
    </div>
  );

  // 欢迎界面
  const WelcomeScreen: React.FC = () => (
    <div className={styles.welcomeScreen}>
      <div className={styles.welcomeContent}>
        <Avatar
          size={64}
          icon={<RobotOutlined />}
          style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
        />
        <Title level={3} style={{ color: '#1890ff', marginBottom: 8 }}>
          👋 欢迎使用东京旅游推荐助手！
        </Title>
        <Paragraph
          style={{ marginBottom: 24, color: '#666', fontSize: '16px' }}
        >
          我是基于公司旅游产品数据集的专业推荐机器人，为您推荐最合适的东京旅游产品
        </Paragraph>

        <Card
          size="small"
          style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}
        >
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            我可以为您推荐：
          </Text>
          <Row gutter={[16, 8]}>
            <Col span={12}>🗼 东京晴空塔套票</Col>
            <Col span={12}>🚊 地铁交通券</Col>
            <Col span={12}>🌃 夜景巡航体验</Col>
            <Col span={12}>🎭 传统文化表演</Col>
            <Col span={12}>🚗 机场接送服务</Col>
            <Col span={12}>🎨 博物馆门票</Col>
          </Row>
        </Card>

        <QuickExamples />
      </div>
    </div>
  );

  return (
    <div className={styles.chatbotContainer}>
      <Card
        title={
          <div style={{ textAlign: 'center' }}>
            <RobotOutlined
              style={{ fontSize: '24px', color: '#1890ff', marginRight: 8 }}
            />
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              东京旅游推荐助手
            </span>
          </div>
        }
        className={styles.chatbotCard}
        bodyStyle={{
          padding: 0,
          height: 'calc(80vh - 60px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 聊天区域 */}
        <div ref={chatContainerRef} className={styles.chatContainer}>
          {chatItems.length === 0 ? (
            <WelcomeScreen />
          ) : (
            chatItems.map(item => (
              <div
                key={item.id}
                className={`${styles.messageItem} ${item.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
              >
                <div className={styles.messageContent}>
                  {item.role === 'assistant' && (
                    <Avatar
                      icon={<RobotOutlined />}
                      style={{ backgroundColor: '#1890ff', marginRight: 12 }}
                      size="small"
                    />
                  )}

                  <div className={styles.messageBody}>
                    <Card
                      size="small"
                      className={
                        item.role === 'user'
                          ? styles.userBubble
                          : styles.assistantBubble
                      }
                      bodyStyle={{ padding: '12px 16px' }}
                    >
                      {item.role === 'user' ? (
                        <div
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {item.content}
                        </div>
                      ) : (
                        <>
                          <MixedContentRenderer
                            content={item.content}
                            allProducts={item.products || []}
                          />
                          {/* 流式传输指示器 */}
                          {item.isStreaming && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                marginTop: '8px',
                                color: '#1890ff'
                              }}
                            >
                              <div
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  backgroundColor: '#1890ff',
                                  borderRadius: '50%',
                                  marginRight: '4px',
                                  animation: 'pulse 1.5s infinite'
                                }}
                              />
                              正在输出中...
                            </div>
                          )}
                        </>
                      )}
                    </Card>

                    <Text
                      type="secondary"
                      style={{
                        fontSize: '12px',
                        marginTop: 4,
                        display: 'block'
                      }}
                    >
                      {item.timestamp.toLocaleTimeString()}
                    </Text>
                  </div>

                  {item.role === 'user' && (
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: '#52c41a', marginLeft: 12 }}
                      size="small"
                    />
                  )}
                </div>
              </div>
            ))
          )}

          {loading && !chatItems.some(item => item.isStreaming) && (
            <div className={`${styles.messageItem} ${styles.assistantMessage}`}>
              <div className={styles.messageContent}>
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: '#1890ff', marginRight: 12 }}
                  size="small"
                />
                <Card
                  size="small"
                  className={styles.assistantBubble}
                  bodyStyle={{ padding: '12px 16px' }}
                >
                  <Space>
                    <Spin size="small" />
                    <Text>正在分析您的需求...</Text>
                  </Space>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className={styles.inputArea}>
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
            <TextArea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="告诉我您的旅游需求..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              loading={loading}
              disabled={!inputValue.trim()}
              size="large"
            >
              发送
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatBot;
