import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

function MyApp({ Component, pageProps }: AppProps) {
  // Define what props.theme will look like
  const theme = {
    colorRight: "#3aa394",
    colorPlace: "#d3ad69",
    colorWrong: "#312a2c",
    colorWrongFG:"#504a4b",
    colorLetter:"#615458",
    colorBorder:"#4C4347",
    colorOffWhite:"#B7AEB4",
    colorText: "#FAFAFF",
    colorBaseBlack: "#222",
  };
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
