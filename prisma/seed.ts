const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')
  
  // Seed allowed user
  const email = 'kts123@kookmin.ac.kr'
  const user = await prisma.allowedUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
    },
  })
  console.log(`Ensured allowed user: ${user.email}`)

  // For testing purposes, we can insert some mock data if empty
  const wifiCount = await prisma.wifiLocation.count()
  if (wifiCount === 0) {
    console.log('Inserting mock wifi data...')
    await prisma.wifiLocation.createMany({
      data: [
        {
          name: '국민대학교 본부관',
          province: '서울특별시',
          district: '성북구',
          address: '정릉로 77',
          lat: 37.6109,
          lng: 126.9972,
          provider: 'KT',
        },
        {
          name: '강남역 지하상가',
          province: '서울특별시',
          district: '강남구',
          address: '강남대로 396',
          lat: 37.4979,
          lng: 127.0276,
          provider: 'SKT',
        },
        {
          name: '광안리 해수욕장',
          province: '부산광역시',
          district: '수영구',
          address: '광안해변로 219',
          lat: 35.1532,
          lng: 129.1189,
          provider: 'LGU+',
        }
      ]
    })
    console.log('Inserted mock wifi data')
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
