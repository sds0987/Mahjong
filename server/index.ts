import { createLanServer } from './createServer'

const server = await createLanServer()
const running = await server.start()
console.log(`The Mahjong Club LAN server is ready.`)
console.log(`Local: http://localhost:${running.port}`)
for (const url of running.urls) console.log(`LAN:   ${url}`)
console.log('Keep this terminal open while everyone plays.')

for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, async () => { await server.stop(); process.exit(0) })
