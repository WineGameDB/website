import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import InputLabel from '@mui/material/InputLabel'
import NativeSelect from '@mui/material/NativeSelect'
import Typography from '@mui/material/Typography'
import Alert, { AlertColor } from '@mui/material/Alert'

import { GameStatus, Storefront } from '../types'
import { DBContext } from './root'

function GameImage(props: { title: string }) {
  const { title } = props
  return (
    <Card variant='outlined'>
      <CardMedia component='img' image={`/gameImages/${title}.png`} />
    </Card>
  )
}

function SupportAlert(props: { status: GameStatus }) {
  const { status } = props

  let severity: AlertColor
  let text: string
  switch (status) {
    case GameStatus.NotWorking:
      severity = 'error'
      text = 'Not working'
      break
    case GameStatus.WorksOOTB:
      severity = 'success'
      text = 'Working (on most recent Wine-Staging)'
      break
    case GameStatus.WorksWithFixes:
      severity = 'success'
      text = 'Works with fixes (listed below)'
      break
    case GameStatus.MainContentAccessible:
      severity = 'warning'
      text = 'Main content accessible, side content may not work'
      break
    default:
      severity = 'warning'
      text = 'Unknown'
  }

  return (
    <Alert variant='filled' severity={severity} sx={{ mb: 3 }}>
      {text}
    </Alert>
  )
}

export default function Details() {
  const { title = '' } = useParams()
  const [storefronts, setStorefronts] = useState<Storefront[] | null>(null)
  const [selectedStorefront, setSelectedStorefront] =
    useState<Storefront | null>(null)
  const [status, setStatus] = useState<GameStatus | null>(null)
  const db = useContext(DBContext)
  const navigate = useNavigate()

  useEffect(() => {
    const res = db.exec('SELECT store FROM games WHERE title=$title', {
      $title: title,
    })

    if (!res.at(0)?.values.length) {
      navigate('/home')
    }

    const storefronts =
      res.at(0)?.values.map((val) => val[0] as Storefront) ?? null
    setStorefronts(storefronts)
    setSelectedStorefront(storefronts?.at(0) ?? null)
  }, [])

  useEffect(() => {
    const res = db.exec(
      'SELECT status FROM games WHERE title=$title AND store=$store',
      { $title: title, $store: selectedStorefront }
    )
    const status =
      (res.at(0)?.values.at(0)?.at(0) as GameStatus | undefined) ?? null
    setStatus(status)
  }, [selectedStorefront])

  return (
    <Grid container spacing={2}>
      <Grid xs={2}>
        <GameImage title={title} />
      </Grid>
      <Grid>
        <Typography variant='h3' sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box>{status !== null && <SupportAlert status={status} />}</Box>
        {storefronts && storefronts.length > 1 && (
          <FormControl>
            <InputLabel variant='standard' htmlFor='storefront-input-select'>
              Storefront
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: 'storefront',
                id: 'storefront-input-select',
              }}
              value={selectedStorefront}
              onChange={(e) => {
                setSelectedStorefront(e.target.value as Storefront)
              }}
            >
              {storefronts.map((store) => (
                <option value={store}>{store}</option>
              ))}
            </NativeSelect>
          </FormControl>
        )}
      </Grid>
    </Grid>
  )
}
