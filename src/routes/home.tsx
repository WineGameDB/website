import { useState, useContext, useEffect } from 'react'

import Typography from '@mui/material/Typography'

import { DBContext } from './root'

export default function Home() {
  const [numOfGames, setNumOfGames] = useState<number | null>(null)
  const db = useContext(DBContext)

  useEffect(() => {
    const res = db.exec('SELECT COUNT(*) FROM games')
    const numOfGames = (res.at(0)?.values.at(0)?.at(0) ?? 0) as number
    setNumOfGames(numOfGames)
  }, [])

  return (
    <>
      <Typography variant='h2' align='center'>
        Welcome to WineGameDB!
      </Typography>
      {numOfGames && (
        <Typography variant='h4' align='center'>
          Currently hosting configuration information for {numOfGames} games
        </Typography>
      )}
    </>
  )
}
