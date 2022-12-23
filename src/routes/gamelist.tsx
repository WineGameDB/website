import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import Typography from '@mui/material/Typography'

import { DBContext } from './root'

function GameCard(props: { title: string }) {
  const { title } = props
  const navigate = useNavigate()

  return (
    <CardActionArea onClick={() => navigate(`/details/${title}`)}>
      <Card>
        <CardMedia component='img' image={`/gameImages/${title}.png`} />
        <CardContent>
          <Typography variant='h6'>{title}</Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  )
}

export default function GamesList() {
  const [games, setGames] = useState<string[]>([])
  const db = useContext(DBContext)

  useEffect(() => {
    const games = db.exec('SELECT DISTINCT title FROM games ORDER BY title')
    setGames(games.at(0)?.values.map((val) => val[0] as string) ?? [])
  }, [])

  return (
    <>
      <Typography variant='h3' sx={{ mb: 1 }}>
        Game List
      </Typography>
      <Grid container spacing={1} alignItems='stretch'>
        {games.map((gameTitle) => (
          <Grid xs={2} key={gameTitle}>
            <GameCard title={gameTitle} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
