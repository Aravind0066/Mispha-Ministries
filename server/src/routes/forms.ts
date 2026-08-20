import { Router, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const formsRouter = Router()

// ─── Prayer Request ──────────────────────────────────────────────────────────
formsRouter.post('/prayer', async (req: Request, res: Response) => {
  try {
    const { name, contact, category, request, consent } = req.body
    if (!request) return res.status(400).json({ error: 'Prayer request text is required.' })
    const record = await prisma.prayerRequest.create({
      data: { name: name || '', contact: contact || '', category: category || '', request, consent: !!consent },
    })
    return res.status(201).json({ success: true, id: record.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save prayer request.' })
  }
})

// ─── Counselling Request ──────────────────────────────────────────────────────
formsRouter.post('/counselling', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, type, language, description } = req.body
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required.' })
    const record = await prisma.counsellingRequest.create({
      data: { name, phone, email: email || '', type: type || '', language: language || '', description: description || '' },
    })
    return res.status(201).json({ success: true, id: record.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save counselling request.' })
  }
})

// ─── Contact Message ──────────────────────────────────────────────────────────
formsRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, reason, message } = req.body
    if (!name || !message) return res.status(400).json({ error: 'Name and message are required.' })
    const record = await prisma.contactMessage.create({
      data: { name, phone: phone || '', email: email || '', reason: reason || '', message },
    })
    return res.status(201).json({ success: true, id: record.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save contact message.' })
  }
})

// ─── Donation Interest ────────────────────────────────────────────────────────
formsRouter.post('/donation', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, area, tier } = req.body
    if (!name || !area || !tier) return res.status(400).json({ error: 'Name, area, and tier are required.' })
    const record = await prisma.donationInterest.create({
      data: { name, phone: phone || '', email: email || '', area, tier },
    })
    return res.status(201).json({ success: true, id: record.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save donation interest.' })
  }
})

// ─── Leadership Enquiry ───────────────────────────────────────────────────────
formsRouter.post('/leadership', async (req: Request, res: Response) => {
  try {
    const { name, phone, church, track, notes } = req.body
    if (!name || !phone || !track) return res.status(400).json({ error: 'Name, phone, and track are required.' })
    const record = await prisma.leadershipEnquiry.create({
      data: { name, phone, church: church || '', track, notes: notes || '' },
    })
    return res.status(201).json({ success: true, id: record.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Could not save leadership enquiry.' })
  }
})
