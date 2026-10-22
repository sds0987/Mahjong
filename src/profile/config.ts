export const BOT_RATINGS={easy:800,medium:1200,hard:1600} as const
export const DIFFICULTY_MULTIPLIERS={easy:.75,medium:1,hard:1.25} as const
export const PRACTICE_RATING_MIN=100,PRACTICE_RATING_MAX=3000
export const GUEST_PROFILE_KEY='mahjong-club:guest-profile:v1'
export function practiceRank(rating:number){if(rating<700)return'Beginner';if(rating<900)return'Learner';if(rating<1100)return'Club Player';if(rating<1300)return'Strategist';if(rating<1500)return'Expert';if(rating<1700)return'Master';if(rating<2000)return'Grandmaster';return'Mahjong Sage'}
export const xpRequiredForNextLevel=(level:number)=>100+(level-1)*50
