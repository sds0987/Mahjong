import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { LanRoom } from './RoomManager'

export async function loadRooms(dataDir: string): Promise<LanRoom[]> {
  try { return JSON.parse(await readFile(path.join(dataDir, 'rooms.json'), 'utf8')) as LanRoom[] }
  catch { return [] }
}

export async function saveRooms(dataDir: string, rooms: LanRoom[]) {
  await mkdir(dataDir, { recursive: true })
  const target = path.join(dataDir, 'rooms.json')
  const temporary = `${target}.tmp`
  await writeFile(temporary, JSON.stringify(rooms), 'utf8')
  await rename(temporary, target)
}
