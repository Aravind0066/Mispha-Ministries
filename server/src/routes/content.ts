import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const contentRouter = Router()

// GET /api/content/gallery
contentRouter.get('/gallery', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } })
    return res.json(items)
  } catch (error) {
    console.error('Failed to fetch gallery:', error)
    return res.status(500).json({ error: 'Could not load gallery content.' })
  }
})

// GET /api/content/board-members
contentRouter.get('/board-members', async (_req: Request, res: Response) => {
  try {
    const members = await prisma.boardMember.findMany({ orderBy: { sortOrder: 'asc' } })
    return res.json(members)
  } catch (error) {
    console.error('Failed to fetch board members:', error)
    return res.status(500).json({ error: 'Could not load board members.' })
  }
})

// GET /api/content/sermons
contentRouter.get('/sermons', async (_req: Request, res: Response) => {
  try {
    const sermons = await prisma.sermon.findMany({ orderBy: { date: 'desc' } })
    return res.json(sermons)
  } catch (error) {
    console.error('Failed to fetch sermons:', error)
    return res.status(500).json({ error: 'Could not load sermons.' })
  }
})

// GET /api/content/settings
contentRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.siteSettings.findMany()
    const settings: Record<string, unknown> = {}
    for (const row of rows) {
      try { settings[row.key] = JSON.parse(row.value) } catch { settings[row.key] = row.value }
    }
    return res.json(settings)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return res.status(500).json({ error: 'Could not load site settings.' })
  }
})
