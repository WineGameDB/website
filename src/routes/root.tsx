import { createContext, useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import sqlJs from 'sql.js'

import AppBar from '@mui/material/AppBar'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import createTheme from '@mui/material/styles/createTheme'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Home from '@mui/icons-material/Home'
import SportsEsports from '@mui/icons-material/SportsEsports'
import WineBar from '@mui/icons-material/WineBar'

// @ts-expect-error A default value is neither possible nor necessary here
export const DBContext = createContext<sqlJs.Database>(undefined)

export default function App() {
  const [db, setDb] = useState<sqlJs.Database | null>(null)

  useEffect(() => {
    async function loadDb() {
      const SQL = await sqlJs({
        locateFile(url) {
          return '/' + url
        },
      })
      const dbData = await fetch('/WineGame.db')
      const uInt8Array = new Uint8Array(await dbData.arrayBuffer())
      const db = new SQL.Database(uInt8Array)
      setDb(db)
    }
    void loadDb()
  }, [])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  )

  const location = useLocation()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Backdrop open={!db}>
        <CircularProgress />
      </Backdrop>
      <AppBar position='static'>
        <Toolbar>
          <WineBar />
          <Typography variant='h6' sx={{ mr: 2 }}>
            WineGameDB
          </Typography>

          <NavLink to='home' style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'contained' : 'text'}
                startIcon={<Home />}
                sx={{ mr: 2 }}
              >
                Home
              </Button>
            )}
          </NavLink>

          <NavLink to='gamelist' style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                variant={isActive ? 'contained' : 'text'}
                startIcon={<SportsEsports />}
              >
                Game List
              </Button>
            )}
          </NavLink>
        </Toolbar>
      </AppBar>
      {location.pathname === '/' && <Navigate to='home' />}
      {db && (
        <DBContext.Provider value={db}>
          <Box sx={{ m: 2 }}>
            <Outlet />
          </Box>
        </DBContext.Provider>
      )}
    </ThemeProvider>
  )
}
