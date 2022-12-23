import { useMemo } from 'react'
import { useRouteError } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import createTheme from '@mui/material/styles/createTheme'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message: string }
  // eslint-disable-next-line no-console
  console.error(error)

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Alert variant='filled' severity='error'>
        <AlertTitle>Error</AlertTitle>
        {error.statusText ?? error.message}
      </Alert>
    </ThemeProvider>
  )
}
