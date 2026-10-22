import {expect,it} from 'vitest'
import {loadGuestProfile} from './guestProfile'
it('keeps guest profiles explicitly local',()=>{const storage={getItem:()=>null};expect(loadGuestProfile(storage).localOnly).toBe(true)})
