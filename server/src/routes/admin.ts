import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authGuard } from '../middleware/authGuard'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()
export const adminRouter = Router()

// All admin routes are protected
adminRouter.use(authGuard)

// Configure local multer storage
const uploadDir = path.join(__dirname, '../../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// POST /api/admin/upload
adminRouter.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const url = `/uploads/${req.file.filename}`
  return res.json({ url })
})

// ─── Summary Dashboard ────────────────────────────────────────────────────────
adminRouter.get('/summary', async (_req, res: Response) => {
  const [prayer, counselling, contact, donation, leadership, gallery, members, sermons] = await Promise.all([
    prisma.prayerRequest.count(),
    prisma.counsellingRequest.count(),
    prisma.contactMessage.count(),
    prisma.donationInterest.count(),
    prisma.leadershipEnquiry.count(),
    prisma.galleryImage.count(),
    prisma.boardMember.count(),
    prisma.sermon.count(),
  ])
  const unread = await prisma.prayerRequest.count({ where: { prayed: false } })
  return res.json({ prayer, counselling, contact, donation, leadership, gallery, members, sermons, unreadPrayer: unread })
})

// ─── Prayer Requests ──────────────────────────────────────────────────────────
adminRouter.get('/forms/prayer', async (_req, res: Response) => {
  const items = await prisma.prayerRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(items)
})
adminRouter.put('/forms/prayer/:id', async (req: Request, res: Response) => {
  const { prayed } = req.body as { prayed: boolean }
  const item = await prisma.prayerRequest.update({ where: { id: Number(req.params.id) }, data: { prayed } })
  return res.json(item)
})
adminRouter.delete('/forms/prayer/:id', async (req: Request, res: Response) => {
  await prisma.prayerRequest.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Counselling Requests ─────────────────────────────────────────────────────
adminRouter.get('/forms/counselling', async (_req, res: Response) => {
  const items = await prisma.counsellingRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(items)
})
adminRouter.put('/forms/counselling/:id', async (req: Request, res: Response) => {
  const { contacted } = req.body as { contacted: boolean }
  const item = await prisma.counsellingRequest.update({ where: { id: Number(req.params.id) }, data: { contacted } })
  return res.json(item)
})
adminRouter.delete('/forms/counselling/:id', async (req: Request, res: Response) => {
  await prisma.counsellingRequest.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Contact Messages ─────────────────────────────────────────────────────────
adminRouter.get('/forms/contact', async (_req, res: Response) => {
  const items = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(items)
})
adminRouter.put('/forms/contact/:id', async (req: Request, res: Response) => {
  const { read } = req.body as { read: boolean }
  const item = await prisma.contactMessage.update({ where: { id: Number(req.params.id) }, data: { read } })
  return res.json(item)
})
adminRouter.delete('/forms/contact/:id', async (req: Request, res: Response) => {
  await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Donation Interest ────────────────────────────────────────────────────────
adminRouter.get('/forms/donation', async (_req, res: Response) => {
  const items = await prisma.donationInterest.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(items)
})
adminRouter.put('/forms/donation/:id', async (req: Request, res: Response) => {
  const { status } = req.body as { status: string }
  const item = await prisma.donationInterest.update({ where: { id: Number(req.params.id) }, data: { status } })
  return res.json(item)
})
adminRouter.delete('/forms/donation/:id', async (req: Request, res: Response) => {
  await prisma.donationInterest.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Leadership Enquiries ─────────────────────────────────────────────────────
adminRouter.get('/forms/leadership', async (_req, res: Response) => {
  const items = await prisma.leadershipEnquiry.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(items)
})
adminRouter.put('/forms/leadership/:id', async (req: Request, res: Response) => {
  const { status } = req.body as { status: string }
  const item = await prisma.leadershipEnquiry.update({ where: { id: Number(req.params.id) }, data: { status } })
  return res.json(item)
})
adminRouter.delete('/forms/leadership/:id', async (req: Request, res: Response) => {
  await prisma.leadershipEnquiry.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Gallery ──────────────────────────────────────────────────────────────────
adminRouter.get('/gallery', async (_req, res: Response) => {
  const items = await prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } })
  return res.json(items)
})
adminRouter.post('/gallery', async (req: Request, res: Response) => {
  const { url, title, occasion, location, participants, detail, sortOrder } = req.body
  const item = await prisma.galleryImage.create({
    data: { url, title, occasion: occasion || '', location: location || '', participants: participants || '', detail: detail || '', sortOrder: sortOrder ?? 0 },
  })
  return res.status(201).json(item)
})
adminRouter.put('/gallery/:id', async (req: Request, res: Response) => {
  const item = await prisma.galleryImage.update({ where: { id: Number(req.params.id) }, data: req.body })
  return res.json(item)
})
adminRouter.delete('/gallery/:id', async (req: Request, res: Response) => {
  await prisma.galleryImage.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Board Members ────────────────────────────────────────────────────────────
adminRouter.get('/board-members', async (_req, res: Response) => {
  const items = await prisma.boardMember.findMany({ orderBy: { sortOrder: 'asc' } })
  return res.json(items)
})
adminRouter.post('/board-members', async (req: Request, res: Response) => {
  const { name, role, bio, imageUrl, side, sortOrder } = req.body
  const item = await prisma.boardMember.create({
    data: { name, role, bio: bio || '', imageUrl: imageUrl || '', side: side || 'left', sortOrder: sortOrder ?? 0 },
  })
  return res.status(201).json(item)
})
adminRouter.put('/board-members/:id', async (req: Request, res: Response) => {
  const item = await prisma.boardMember.update({ where: { id: Number(req.params.id) }, data: req.body })
  return res.json(item)
})
adminRouter.delete('/board-members/:id', async (req: Request, res: Response) => {
  await prisma.boardMember.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Sermons ──────────────────────────────────────────────────────────────────
adminRouter.get('/sermons', async (_req, res: Response) => {
  const items = await prisma.sermon.findMany({ orderBy: { date: 'desc' } })
  return res.json(items)
})
adminRouter.post('/sermons', async (req: Request, res: Response) => {
  const { title, speaker, date, embedUrl, notesUrl, category } = req.body
  const item = await prisma.sermon.create({
    data: { title, speaker, date: new Date(date), embedUrl, notesUrl: notesUrl || '', category },
  })
  return res.status(201).json(item)
})
adminRouter.put('/sermons/:id', async (req: Request, res: Response) => {
  const body = { ...req.body }
  if (body.date) body.date = new Date(body.date)
  const item = await prisma.sermon.update({ where: { id: Number(req.params.id) }, data: body })
  return res.json(item)
})
adminRouter.delete('/sermons/:id', async (req: Request, res: Response) => {
  await prisma.sermon.delete({ where: { id: Number(req.params.id) } })
  return res.json({ success: true })
})

// ─── Site Settings ────────────────────────────────────────────────────────────
adminRouter.get('/settings', async (_req, res: Response) => {
  const rows = await prisma.siteSettings.findMany()
  const out: Record<string, unknown> = {}
  for (const r of rows) { try { out[r.key] = JSON.parse(r.value) } catch { out[r.key] = r.value } }
  return res.json(out)
})
adminRouter.put('/settings', async (req: Request, res: Response) => {
  const data = req.body as Record<string, unknown>
  for (const [key, value] of Object.entries(data)) {
    await prisma.siteSettings.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    })
  }
  return res.json({ success: true })
})
