import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 模拟犬种数据
const breeds = [
  {
    id: 1,
    name: '拉布拉多',
    description: '拉布拉多犬是一种友善、聪明且精力充沛的大型犬。它们原产于加拿大纽芬兰岛，最初被培育用于协助渔民工作。',
    image: '/breeds/labrador.jpg',
    category: '大型犬',
    personality: ['友善', '聪明', '活跃'],
    stats: {
      friendliness: 5,
      energyLevel: 5,
      trainability: 5,
      groomingNeeds: 3,
      adaptability: 4
    }
  },
  {
    id: 2,
    name: '柯基',
    description: '威尔士柯基犬是一种小型犬，以其独特的外形和聪明的性格而闻名。它们最初被培育用于放牧牛羊。',
    image: '/breeds/corgi.jpg',
    category: '小型犬',
    personality: ['聪明', '活泼', '忠诚'],
    stats: {
      friendliness: 4,
      energyLevel: 4,
      trainability: 4,
      groomingNeeds: 3,
      adaptability: 4
    }
  },
  // 可以添加更多犬种数据
]

export async function GET(request: NextRequest) {
  try {
    // TODO: 实际项目中需要从数据库获取数据

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const personality = searchParams.get('personality')

    let filteredBreeds = [...breeds]

    // 按分类筛选
    if (category && category !== '全部') {
      filteredBreeds = filteredBreeds.filter(breed => breed.category === category)
    }

    // 按性格特征筛选
    if (personality) {
      filteredBreeds = filteredBreeds.filter(breed => 
        breed.personality.includes(personality)
      )
    }

    return NextResponse.json(filteredBreeds)
  } catch (error) {
    console.error('Get breeds error:', error)
    return NextResponse.json(
      { message: '获取犬种列表失败' },
      { status: 500 }
    )
  }
}