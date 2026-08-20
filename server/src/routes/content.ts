import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const contentRouter = Router()

// GET /api/content/gallery
contentRouter.get('/gallery', async (_req: Request, res: Response) => {
  const items = await prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } })
  return res.json(items)
})

// GET /api/content/board-members
contentRouter.get('/board-members', async (_req: Request, res: Response) => {
  const members = await prisma.boardMember.findMany({ orderBy: { sortOrder: 'asc' } })
  return res.json(members)
})

// GET /api/content/sermons
contentRouter.get('/sermons', async (_req: Request, res: Response) => {
  const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } })
  return res.json(sermons)
})

// GET /api/content/settings
contentRouter.get('/settings', async (_req: Request, res: Response) => {
  const rows = await prisma.siteSettings.findMany()
  const settings: Record<string, unknown> = {}
  for (const row of rows) {
    try { settings[row.key] = JSON.parse(row.value) } catch { settings[row.key] = row.value }
  }
  return res.json(settings)
})
