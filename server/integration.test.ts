import { afterEach, describe, expect, it } from 'vitest'
import { io as createClient, type Socket } from 'socket.io-client'
import { createLanServer } from './createServer'
import type { PlayerGameView } from '../src/network/protocol'

const waitFor=<T>(socket:Socket,event:string)=>new Promise<T>((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error(`Timed out waiting for ${event}`)),3000);socket.once(event,(value:T)=>{clearTimeout(timeout);resolve(value)})})
describe('four-player Socket.IO match',()=>{let stop:(()=>Promise<void>)|undefined;const clients:Socket[]=[];afterEach(async()=>{clients.forEach(client=>client.disconnect());await stop?.()})
  it('creates, joins, starts and sends four sanitized player views',async()=>{const server=await createLanServer({host:'127.0.0.1',port:0,persist:false,tickMs:20,publicBaseUrl:'https://mahjong.example.com/'});stop=server.stop;const running=await server.start();const url=`http://127.0.0.1:${running.port}`;expect(running.urls).toEqual(['https://mahjong.example.com']);const health=await fetch(`${url}/api/health`);expect(health.ok).toBe(true);expect(health.headers.get('x-content-type-options')).toBe('nosniff');expect(await (await fetch(`${url}/api/ready`)).json()).toEqual({ready:true});for(let i=0;i<4;i++)clients.push(createClient(url,{transports:['websocket']}));await Promise.all(clients.map(client=>waitFor(client,'connect')))
    const createdPromise=waitFor<any>(clients[0],'room:created');clients[0].emit('room:create',{displayName:'Player 1',roomName:'LAN Test',turnDuration:10,matchHands:1,rulesPreset:'Taiwanese Practice v1',fillBots:false,botReplacement:true});const created=await createdPromise;expect(created.joinUrl).toBe(`https://mahjong.example.com/join/${created.room.roomId}`);const identities=[created.identity];
    for(let i=1;i<4;i++){const joinedPromise=waitFor<any>(clients[i],'room:joined');clients[i].emit('room:join',{roomCode:created.room.roomId,displayName:`Player ${i+1}`});identities.push((await joinedPromise).identity)}
    for(let i=0;i<4;i++){clients[i].emit('room:ready',{...identities[i],ready:true});await new Promise(resolve=>setTimeout(resolve,15))}
    const snapshots=clients.map(client=>waitFor<PlayerGameView>(client,'game:snapshot'));clients[0].emit('room:start',identities[0]);const views=await Promise.all(snapshots);expect(views).toHaveLength(4);views.forEach((view,index)=>{expect(view.players[index].hand!.length).toBeGreaterThanOrEqual(16);expect(view.players[index].hand!.length).toBeLessThanOrEqual(17);expect(view.players.filter((_,seat)=>seat!==index).every(player=>player.hand===undefined)).toBe(true)})
    const fifth=createClient(url,{transports:['websocket']});clients.push(fifth);await waitFor(fifth,'connect');const errorPromise=waitFor<any>(fifth,'server:error');fifth.emit('room:join',{roomCode:created.room.roomId,displayName:'Fifth'});expect((await errorPromise).code).toBe('ROOM_FULL')
  })
})
