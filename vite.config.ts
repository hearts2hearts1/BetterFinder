import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'

const parserUrl      = pathToFileURL(path.resolve(__dirname, 'public/parser.js')).href
const transformerUrl = pathToFileURL(path.resolve(__dirname, 'public/transformer.js')).href

// Reconstructs the SCHEDULE string parseSchedule() expects from raw dated entries.
// e.g. "[THURSDAY - 06:00 PM - 09:00 PM]"
function buildScheduleString(scheduleData: any[]) {
  const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
  const seen = new Set<string>()
  let out = ''
  for (const e of scheduleData) {
    if (!e?.TIME_TABLE_DATE || !e?.TIME_FROM || !e?.TIME_TO) continue
    const day = days[new Date(e.TIME_TABLE_DATE).getDay()]
    const key = `${day}|${e.TIME_FROM}|${e.TIME_TO}`
    if (!seen.has(key)) { seen.add(key); out += `[${day} - ${e.TIME_FROM} - ${e.TIME_TO}]` }
  }
  return out
}

// parser.js's parseCourseName doesn't return section — extract it here
function parseSection(courseName: string) {
  const text = courseName.replace(/<[^>]*>/g, ' ')
  const match = text.match(/Section\s*:\s*(\S+)/i)
  return match ? match[1].trim() : ''
}

function localDataPlugin() {
  const dataRawDir = path.resolve(__dirname, 'data-raw')

  return {
    name: 'local-data',
    configureServer(server: import('vite').ViteDevServer) {
      const publicDir = path.resolve(__dirname, 'public')
      server.watcher.add(path.join(publicDir, '*.js'))
      server.watcher.on('change', (file) => {
        if (file.startsWith(publicDir)) server.ws.send({ type: 'full-reload' })
      })

      server.middlewares.use('/api/course', async (req, res, next) => {
        const courseCode = req.url?.replace(/^\//, '').split('?')[0].toUpperCase()
        if (!courseCode) return next()

        let entries: string[] = []
        try { entries = fs.readdirSync(dataRawDir) } catch { return next() }

        const match = entries.find(
          (n) => n.toUpperCase() === courseCode || n.toUpperCase().startsWith(courseCode + '___')
        )
        if (!match) {
          res.statusCode = 404
          res.end(JSON.stringify({ success: false, error: 'Course not found' }))
          return
        }

        try {
          const rawSections: any[][] = JSON.parse(
            fs.readFileSync(path.join(dataRawDir, match, 'schedules.json'), 'utf-8')
          )

          // Cache-bust on every request so edits to public/ are reflected immediately
          const t = Date.now()
          const { parseCourseName }       = await import(`${parserUrl}?t=${t}`)
          const { transformScheduleData } = await import(`${transformerUrl}?t=${t}`)

          const data = rawSections.map((scheduleData) => {
            const firstName = scheduleData[0]?.COURSE_NAME ?? ''
            return transformScheduleData(courseCode, {
              SECTION_NAME: parseSection(firstName),
              ENLISTED:     0,
              CAPACITY:     20,
              SCHEDULE:     buildScheduleString(scheduleData),
            }, scheduleData)
          })

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, data }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ success: false, error: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localDataPlugin(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})