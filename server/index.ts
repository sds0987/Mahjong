import { createLanServer } from './createServer'

const server = await createLanServer()
const running = await server.start()
console.log('The Mahjong Club server is ready.')
if (process.env.NODE_ENV !== 'production') console.log(`Local: http://localhost:${running.port}`)
for (const url of running.urls) console.log(`${url.startsWith('https://') ? 'Public' : 'LAN'}: ${url}`)

let shuttingDown = false
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, async () => {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`${signal} received; saving state and closing connections.`)
  try { await server.stop(); process.exit(0) }
  catch (error) { console.error('Graceful shutdown failed.', error); process.exit(1) }
})
