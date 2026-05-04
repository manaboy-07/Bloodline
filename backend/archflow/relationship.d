User 1 ────────< Prediction >──────── 1 Match
         (many)             (one)

Meaning:
One User → many Predictions
One Prediction → one Match

query {
  user(id: 1) {
    name
    predictions {
      homeScore
      awayScore
      match {
        homeTeam
        awayTeam
      }
    }
  }
}

 “Give me a user → their predictions → AND the match for each prediction”


GraphQL resolvers
match returns users and predictions based on a common team name

Prediction and Scoring Logic

1. Users create predictions
        ↓
2. Match happens (scores entered)
        ↓
3. Match marked "finished"
        ↓
4. Cron runs every 2 mins
        ↓
5. Find finished + unscored matches
        ↓
6. Score predictions (0 or 1)
        ↓
7. Mark match as scored
        ↓
8. Sum all user prediction points
        ↓
9. Update leaderboard