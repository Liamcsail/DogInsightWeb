import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 实际项目中需要从数据库获取数据

    // 模拟单个犬种的详细数据
    const breed = {
      id: params.id,
      name: '拉布拉多',
      description: '拉布拉多犬是一种友善、聪明且精力充沛的大型犬。它们原产于加拿大纽芬兰岛，最初被培育用于协助渔民工作。',
      image: '/breeds/labrador.jpg',
      history: '拉布拉多犬的历史可以追溯到19世纪初的纽芬兰岛。它们最初被称为圣约翰犬，用于帮助渔民拖网和捕鱼。',
      personality: ['友善', '聪明', '活跃'],
      category: '大型犬',
      careNeeds: '需要大量运动、定期梳理毛发、耳朵清洁',
      healthIssues: '髋关节发育不良、眼部问题、肘关节发育不良',
      funFacts: [
        '拉布拉多是最受欢迎的导盲犬品种之一',
        '它们有极强的游泳能力和耐寒性',
        '拉布拉多犬的寿命通常在10-12年'
      ],
      stats: {
        friendliness: 5,
        energyLevel: 5,
        trainability: 5,
        groomingNeeds: 3,
        adaptability: 4
      }
    }

    if (parseInt(params.id) > 10) {
      return NextResponse.json(
        { message: '未找到该犬种' },
        { status: 404 }
      )
    }

    return NextResponse.json(breed)
  } catch (error) {
    console.error('Get breed detail error:', error)
    return NextResponse.json(
      { message: '获取犬种详情失败' },
      { status: 500 }
    )
  }
}