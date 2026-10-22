# The Mahjong Club

A responsive React + TypeScript implementation of Taiwanese 16-tile Mahjong. It includes the original offline practice game and a server-authoritative four-player Local Network mode powered by Node.js, Express, Socket.IO, Zod, and the same rules engine.

## Start a Local Network game on Windows

1. Connect the host computer and all player devices to the same trusted Wi-Fi or Ethernet network.
2. In PowerShell, open this folder:

   ```powershell
   cd "D:\Applications\Business Logics & Documents\Mahjong\MahjongApp"
   npm install
   npm run lan
   ```

3. Keep that PowerShell window open. The server prints a `Local` URL and one or more `LAN` URLs.
4. Open the `Local` URL on the host computer, choose **Play on Local Network**, and create a room.
5. Share the QR code, link, or six-character room code. Other players open the printed `LAN` URL on devices connected to the same network.

The phone link must contain the host computer's private address, for example `http://192.168.1.15:3000/join/ABC123`. Never use `127.0.0.1` or `localhost` on another device: those addresses point back to that device, not the host computer.

The default address is `http://localhost:3000`. To choose another port:

```powershell
$env:PORT=3100
npm run lan
```

The server binds to `0.0.0.0`, but only prints private IPv4 addresses from suitable physical adapters. Rooms are kept in memory and atomically snapshotted to `data/rooms.json` every ten seconds.

### Windows Firewall

On the first run, Windows may ask whether Node.js can communicate through the firewall. Select **Private networks** and allow access. Do not enable Public networks. If no prompt appears and phones cannot connect, open **Windows Security → Firewall & network protection → Allow an app through firewall** and allow Node.js on Private networks.

Windows must also classify the trusted home or club Wi-Fi connection as **Private**. Check **Settings → Network & internet → Wi-Fi → your connected network → Network profile type**. If it is set to **Public**, change it to **Private** before testing from a phone.

Alternatively, open PowerShell **as Administrator** and run:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
```

### Router and LAN troubleshooting

- Make sure all devices use the same Wi-Fi network and subnet.
- Disable guest Wi-Fi, AP/client isolation, or “devices cannot communicate” settings.
- Disconnect VPNs temporarily if they replace the local route.
- Keep the host awake and the PowerShell server window open.
- Test `http://HOST-IP:3000/api/health` from another device. A successful response includes `{"ok":true}`.
- If the host IP changes, restart the server and use the newly printed LAN URL.
- This mode is designed for a trusted home or club network. Do not port-forward it to the public internet.

## Development

Start Vite and the LAN server together:

```powershell
npm run dev
```

Vite runs on port `5173` and proxies Socket.IO to the LAN server on port `3000`. Practice mode remains fully local and works without the server. The terminal prints both the desktop URL and the private LAN address to use on phones.

## Verify

```powershell
npm test
npm run build
npm run typecheck:server
npm run lint
```

The tests cover the core rules engine, privacy-safe player projections, identity validation, command idempotency, and a real four-client Socket.IO room that creates, joins, readies, starts, and rejects a fifth player.

## Player progression

Completed four-hand practice matches are replay-validated by the Node server before they can update the persistent profile. The server verifies the initial seeded state, every legal player transition, deterministic official bot choices, normal match completion, and all 144 physical tile identities. Modified saves, incomplete action chains, replays, short matches, and duplicate match IDs receive no rated progression.

Profiles, immutable match results, rating changes, achievement state, and processed-match IDs are atomically persisted in `data/profiles.json`. Practice uses pairwise four-player Elo against configured bot reference ratings, while Competitive Rating remains untouched. Guest-profile utilities store an explicitly labelled local-only profile and are never eligible for public leaderboards.

Profile routes:

- `/profile` — progression overview
- `/profile/history` — paginated immutable match history
- `/profile/achievements` — achievement progress
- `/match/:matchId/results` — persisted post-match progression summary

## Main routes

- `/` — Landing page with practice, LAN, and learning entry points
- `/practice` — Offline practice configuration and game
- `/lan` — Host or join a Local Network table
- `/join/:roomCode` — Shared room link
- `/lan/room/:roomCode` — Four-seat readiness lobby
- `/lan/game/:roomCode` — Live server-authoritative match
- `/learn` — Beginner rules guide

## Multiplayer architecture

The Node process owns room membership, wall order, hands, turns, claims, scoring, timers, reconnection state, and bot takeover. Every inbound event is schema-validated and checked against the authenticated room token. Each socket receives a per-player projection: its own concealed hand plus only public counts and tiles for opponents. Claim responses remain private until the server resolves priority. The browser stores only the room, player ID, and reconnect token.

