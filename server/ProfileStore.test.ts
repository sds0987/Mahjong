import { mkdtemp,rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach,describe,expect,it } from 'vitest'
import { createGame, declareWin, discardTile, resolveBotClaims, startNextHand, canPlayerWin } from '../src/game/engine'
import { botView,chooseBotDiscard } from '../src/game/bots'
import { ProfileStore, validateCompletedPractice } from './ProfileStore'

const dirs:string[]=[]
async function store(){const dir=await mkdtemp(path.join(os.tmpdir(),'mahjong-profile-'));dirs.push(dir);const instance=new ProfileStore(path.join(dir,'profiles.json'));await instance.load();return{instance,file:path.join(dir,'profiles.json')}}
function completedGame(){let game=createGame({matchHands:4},12345);const snapshots=[game];let guard=0;while(game.phase!=='match-complete'&&guard++<2000){if(game.phase==='hand-complete')game=startNextHand(game);else if(game.phase==='awaiting-claim')game=resolveBotClaims(game);else if(game.phase==='awaiting-discard'){const index=game.currentPlayerIndex;if(canPlayerWin(game,index))game=declareWin(game,index,true);else game=discardTile(game,index,game.players[index].isHuman?game.players[index].hand[0].id:chooseBotDiscard(botView(game,index)).id)}snapshots.push(game)}if(game.phase!=='match-complete')throw new Error('Autoplay did not complete');return{game,snapshots}}
afterEach(async()=>{await Promise.all(dirs.splice(0).map(dir=>rm(dir,{recursive:true,force:true})))})
describe('ProfileStore transactions',()=>{
  it('survives restart and deduplicates concurrent processing',async()=>{const {instance,file}=await store(),{game,snapshots}=completedGame();const [first,second]=await Promise.all([instance.process(game,'p1','Ananya',snapshots),instance.process(game,'p1','Ananya',snapshots)]);expect(first.profile.practiceStats.matchesCompleted).toBe(1);expect(second.profile.practiceStats.matchesCompleted).toBe(1);const restored=new ProfileStore(file);await restored.load();expect(restored.getProfile('p1').practiceStats.matchesCompleted).toBe(1);expect(restored.getSummary(game.id)).toBeTruthy()})
  it('rejects modified or shortened matches without changing the profile',async()=>{const {instance}=await store(),{game,snapshots}=completedGame();game.players[0].hand.pop();expect(()=>validateCompletedPractice(game)).toThrow(/integrity/);await expect(instance.process(game,'p1','Ananya',snapshots)).rejects.toThrow();expect(instance.getProfile('p1').practiceStats.matchesPlayed).toBe(0)})
})
