import { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req, res) {
  res.json({
    status: 'OK',
    platform: 'Vercel',
    timestamp: new Date().toISOString()
  })
}
