import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaClient as SqlitePrismaClient } from '../generated/sqlite-client'
import path from 'path'

type TableConfig = {
  label: string
  pgTable: string
  load: () => Promise<any[]>
  insert: (rows: any[]) => Promise<{ count: number }>
}

function resolveSqliteUrl(): string {
  const raw = process.env.SQLITE_URL || 'file:./prisma/dev.db'
  if (!raw.startsWith('file:')) return raw

  const filePath = raw.slice('file:'.length)
  if (path.isAbsolute(filePath)) return raw

  const absolutePath = path.resolve(process.cwd(), filePath)
  return `file:${absolutePath}`
}

const localUrl = resolveSqliteUrl()
const local = new SqlitePrismaClient({
  datasources: { db: { url: localUrl } },
})
const remote = new PrismaClient()

function quote(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}

async function resetPgSequence(pgTable: string): Promise<void> {
  const table = quote(pgTable)
  await remote.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 0), true)`
  )
}

async function run(): Promise<void> {
  console.log('Starting local SQLite -> Supabase migration...')
  console.log(`Source SQLite: ${localUrl}`)

  const tables: TableConfig[] = [
    {
      label: 'SiteSettings',
      pgTable: 'SiteSettings',
      load: () => local.siteSettings.findMany(),
      insert: (rows) => remote.siteSettings.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'GalleryImage',
      pgTable: 'GalleryImage',
      load: () => local.galleryImage.findMany(),
      insert: (rows) => remote.galleryImage.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'BoardMember',
      pgTable: 'BoardMember',
      load: () => local.boardMember.findMany(),
      insert: (rows) => remote.boardMember.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'Sermon',
      pgTable: 'Sermon',
      load: () => local.sermon.findMany(),
      insert: (rows) => remote.sermon.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'PrayerRequest',
      pgTable: 'PrayerRequest',
      load: () => local.prayerRequest.findMany(),
      insert: (rows) => remote.prayerRequest.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'CounsellingRequest',
      pgTable: 'CounsellingRequest',
      load: () => local.counsellingRequest.findMany(),
      insert: (rows) => remote.counsellingRequest.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'ContactMessage',
      pgTable: 'ContactMessage',
      load: () => local.contactMessage.findMany(),
      insert: (rows) => remote.contactMessage.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'DonationInterest',
      pgTable: 'DonationInterest',
      load: () => local.donationInterest.findMany(),
      insert: (rows) => remote.donationInterest.createMany({ data: rows, skipDuplicates: true }),
    },
    {
      label: 'LeadershipEnquiry',
      pgTable: 'LeadershipEnquiry',
      load: () => local.leadershipEnquiry.findMany(),
      insert: (rows) => remote.leadershipEnquiry.createMany({ data: rows, skipDuplicates: true }),
    },
  ]

  for (const table of tables) {
    const rows = await table.load()
    if (rows.length === 0) {
      console.log(`${table.label}: 0 rows in local DB (skipped)`)
      continue
    }

    const result = await table.insert(rows)
    await resetPgSequence(table.pgTable)
    console.log(`${table.label}: local=${rows.length}, inserted=${result.count}`)
  }

  console.log('Migration completed.')
}

run()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await Promise.all([local.$disconnect(), remote.$disconnect()])
  })