import { GUEST_PROFILE_KEY } from './config'
import { applyCompletedMatch, createProfile } from './progression'
import type { CompletedMatchResult, PlayerProfile } from './types'

export function loadGuestProfile(storage:Pick<Storage,'getItem'>=localStorage):PlayerProfile{try{const saved=JSON.parse(storage.getItem(GUEST_PROFILE_KEY)??'null') as PlayerProfile|null;if(saved)return{...saved,localOnly:true}}catch{/* create a clean local profile */}return createProfile('guest-local','Guest Player',true)}
export function processGuestMatch(result:CompletedMatchResult,storage:Pick<Storage,'getItem'|'setItem'>=localStorage){const processed=applyCompletedMatch(loadGuestProfile(storage),{...result,verification:'local'});processed.profile.localOnly=true;storage.setItem(GUEST_PROFILE_KEY,JSON.stringify(processed.profile));return processed}
