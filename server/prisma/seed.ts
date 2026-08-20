import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Site Settings ────────────────────────────────────────────────────────
  const settings = [
    { key: 'contact_phone', value: JSON.stringify('+91 98849 70978') },
    { key: 'contact_email', value: JSON.stringify('') },
    { key: 'contact_address', value: JSON.stringify('') },
    { key: 'stat_churches', value: JSON.stringify('14+') },
    { key: 'stat_pastors', value: JSON.stringify('200+') },
    { key: 'stat_missions', value: JSON.stringify('6') },
  ]
  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s })
  }

  // ─── Board Members ────────────────────────────────────────────────────────
  const existing = await prisma.boardMember.count()
  if (existing === 0) {
    await prisma.boardMember.createMany({
      data: [
        {
          name: 'Rev. D. John Benni',
          role: 'President',
          bio: 'Biography and personal testimony will be added here with the ministry\'s approval.',
          imageUrl: '',
          side: 'left',
          sortOrder: 1,
        },
        {
          name: 'Pas. Rosyelavarasi T.',
          role: 'Secretary & Treasurer',
          bio: 'Biography and personal testimony will be added here with the ministry\'s approval.',
          imageUrl: '',
          side: 'right',
          sortOrder: 2,
        },
      ],
    })
  }

  // ─── Gallery ─────────────────────────────────────────────────────────────
  const galleryCount = await prisma.galleryImage.count()
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        {
          url: '',
          title: 'Palm Sunday Outreach Ministry',
          occasion: 'Palm Sunday Outreach',
          location: 'Community Outreach',
          participants: 'Full congregation — men, women and children',
          detail: 'The congregation gathered in white, moving through the community with drums and palms — carrying the message of Christ to the streets.',
          sortOrder: 1,
        },
        {
          url: '',
          title: 'Young Pastors Meetup',
          occasion: 'Leadership Gathering',
          location: 'Local Church Hall',
          participants: 'Young pastors and emerging ministry leaders',
          detail: 'A gathering of young pastors and emerging leaders — encouraged by John 4:24, meeting to strengthen one another in ministry and in truth.',
          sortOrder: 2,
        },
      ],
    })
  }

  console.log('✅ Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
