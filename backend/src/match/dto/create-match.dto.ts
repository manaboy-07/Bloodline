export class CreateMatchDto  {
    homeTeam: string
    awayTeam: string
    matchDate: Date;
    awayScore?: number
    homeScore?: number
    status: string
}
