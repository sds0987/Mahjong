import os from 'node:os'

const isPrivate = (address: string) => /^10\./.test(address) || /^192\.168\./.test(address) || /^172\.(1[6-9]|2\d|3[01])\./.test(address)

export function privateLanAddresses(port: number) {
  const candidates: Array<{ address: string; score: number }> = []
  for (const [name, entries] of Object.entries(os.networkInterfaces())) {
    if (/docker|wsl|virtual|vmware|vbox|tailscale|loopback/i.test(name)) continue
    for (const entry of entries ?? []) {
      if (entry.family !== 'IPv4' || entry.internal || !isPrivate(entry.address)) continue
      const score = entry.address.startsWith('192.168.') ? 3 : entry.address.startsWith('10.') ? 2 : 1
      candidates.push({ address: entry.address, score })
    }
  }
  return [...new Set(candidates.sort((a, b) => b.score - a.score).map(({ address }) => `http://${address}:${port}`))]
}
