import "dotenv/config"
import { prisma } from "../src/lib/prisma"

// Sample public data
// For real deployment, we could fetch from data.go.kr here
const sampleData = [
  {
    name: '국민대학교 7호관',
    province: '서울특별시',
    district: '성북구',
    address: '정릉로 77',
    lat: 37.6111,
    lng: 126.9975,
    provider: 'KT',
  },
  {
    name: '국민대학교 도서관',
    province: '서울특별시',
    district: '성북구',
    address: '정릉로 77',
    lat: 37.6095,
    lng: 126.9961,
    provider: 'SKT',
  },
  {
    name: '서울시청 광장',
    province: '서울특별시',
    district: '중구',
    address: '세종대로 110',
    lat: 37.5665,
    lng: 126.9780,
    provider: 'LGU+',
  },
  {
    name: '부산역 광장',
    province: '부산광역시',
    district: '동구',
    address: '중앙대로 206',
    lat: 35.1152,
    lng: 129.0422,
    provider: 'KT',
  },
  {
    name: '센텀시티 지하철역',
    province: '부산광역시',
    district: '해운대구',
    address: '센텀남대로 35',
    lat: 35.1689,
    lng: 129.1315,
    provider: 'SKT',
  },
  {
    name: '인천국제공항 1터미널',
    province: '인천광역시',
    district: '중구',
    address: '공항로 272',
    lat: 37.4602,
    lng: 126.4407,
    provider: 'KT',
  },
  {
    name: '수원 화성행궁',
    province: '경기도',
    district: '수원시',
    address: '정조로 825',
    lat: 37.2846,
    lng: 127.0152,
    provider: 'LGU+',
  },
  {
    name: '전주 한옥마을',
    province: '전북특별자치도',
    district: '전주시',
    address: '기린대로 99',
    lat: 35.8147,
    lng: 127.1526,
    provider: 'KT',
  },
]

async function main() {
  console.log("Fetching and processing public wifi data...")

  for (const item of sampleData) {
    const existing = await prisma.wifiLocation.findFirst({
      where: { name: item.name, address: item.address }
    })

    if (!existing) {
      await prisma.wifiLocation.create({
        data: item
      })
      console.log(`Imported: ${item.name}`)
    } else {
      console.log(`Skipped existing: ${item.name}`)
    }
  }

  console.log("Data processing complete")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
