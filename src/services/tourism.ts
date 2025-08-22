import tourismData from '../data/tourism-data.json';

export interface TravelProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  bookingUrl: string;
  tags: string[];
  duration: string;
  recommendation: string;
  thumbnailUrl: string;
}

export interface TravelRecommendation {
  products: TravelProduct[];
  totalProducts: number;
  message: string;
}

class TravelRecommendationService {
  private products: TravelProduct[] = [];

  constructor() {
    // 扁平化所有旅游产品
    this.products = tourismData.destinations.flatMap(dest =>
      dest.attractions.map(attraction => ({
        id: attraction.id,
        name: attraction.name,
        description: attraction.description,
        price: attraction.price,
        bookingUrl: attraction.bookingUrl,
        tags: attraction.tags,
        duration: attraction.duration,
        recommendation: attraction.recommendation,
        thumbnailUrl: attraction.thumbnailUrl,
      }))
    );
  }

  // 获取所有产品
  getAllProducts(): TravelProduct[] {
    return this.products;
  }

  // 根据关键词搜索产品
  searchProducts(keywords: string[]): TravelProduct[] {
    if (!keywords.length) return this.products;

    return this.products.filter(product => {
      const searchText =
        `${product.name} ${product.description} ${product.tags.join(' ')} ${product.recommendation}`.toLowerCase();
      return keywords.some(keyword =>
        searchText.includes(keyword.toLowerCase())
      );
    });
  }

  // 根据预算筛选产品
  filterByBudget(products: TravelProduct[], budget: number): TravelProduct[] {
    return products.filter(product => product.price <= budget);
  }

  // 根据标签筛选产品
  filterByTags(products: TravelProduct[], tags: string[]): TravelProduct[] {
    return products.filter(product =>
      tags.some(tag =>
        product.tags.some(productTag =>
          productTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }

  // 智能推荐产品
  getRecommendations(userQuery: string, budget?: number): TravelRecommendation {
    let filteredProducts = this.products;

    // 提取关键词进行搜索
    const keywords = this.extractKeywords(userQuery);
    if (keywords.length > 0) {
      filteredProducts = this.searchProducts(keywords);
    }

    // 预算筛选
    if (budget && budget > 0) {
      filteredProducts = this.filterByBudget(filteredProducts, budget);
    }

    // 按价格排序（性价比优先）
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);

    // 最多返回6个产品
    const recommendedProducts = filteredProducts.slice(0, 6);

    let message = '';
    if (recommendedProducts.length === 0) {
      message =
        '很抱歉，没有找到符合您需求的旅游产品。您可以尝试调整预算或换个关键词搜索。';
    } else if (budget && recommendedProducts.length < filteredProducts.length) {
      message = `根据您的预算和需求，为您推荐了 ${recommendedProducts.length} 个旅游产品：`;
    } else {
      message = `为您推荐了 ${recommendedProducts.length} 个旅游产品：`;
    }

    return {
      products: recommendedProducts,
      totalProducts: filteredProducts.length,
      message,
    };
  }

  // 提取查询关键词
  private extractKeywords(query: string): string[] {
    const keywords: string[] = [];

    // 常见旅游关键词映射
    const keywordMap: { [key: string]: string[] } = {
      晴空塔: ['SKYTREE', 'TOWER_BUILDING'],
      地铁: ['RAILWAY_TICKET', 'PASS'],
      交通: ['RAILWAY_TICKET', 'TRANSPORTATION'],
      机场: ['AIRPORT_TRANSPORTATION'],
      夜景: ['NIGHT_VIEW', 'CRUISES'],
      巡航: ['CRUISES'],
      文化: ['CULTURE', 'SHOW'],
      博物馆: ['MUSEUM_GALLERY'],
      表演: ['SHOW'],
      套票: ['BUNDLE'],
      一日券: ['PASS'],
    };

    // 检查关键词
    Object.entries(keywordMap).forEach(([keyword, tags]) => {
      if (query.includes(keyword)) {
        keywords.push(...tags);
      }
    });

    // 如果没有匹配到特定关键词，使用原始查询
    if (keywords.length === 0) {
      keywords.push(query);
    }

    return [...new Set(keywords)]; // 去重
  }
}

export default new TravelRecommendationService();
