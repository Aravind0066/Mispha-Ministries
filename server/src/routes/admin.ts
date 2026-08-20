import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authGuard } from '../middleware/authGuard'
import { createClient } from '@supabase/supabase-js'
import multer from 'multer'
import crypto from 'crypto'
import path from 'path'

const prisma = new PrismaClient()
export const adminRouter = Router()

// ─── Supabase Storage client ─────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)
const STORAGE_BUCKET = 'uploads'

// All admin routes are protected
adminRouter.use(authGuard)

// ─── Multer (memory storage — files go to Supabase, not disk) ────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    cb(null, ext && mime)
  },
})

// POST /api/admin/upload — Upload image to Supabase Storage
adminRouter.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const ext = path.extname(req.file.originalname).toLowerCase()
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
  const filePath = `images/${uniqueName}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    })

  if (error) {
    console.error('Supabase Storage upload error:', error)
    return res.status(500).json({ error: 'Failed to upload image.' })
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)

  return res.json({ url: urlData.publicUrl })
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
