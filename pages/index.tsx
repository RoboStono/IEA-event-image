import React from 'react'
import Head from 'next/head'
import { saveAs } from 'file-saver'
import getShareImage from '@jlengstorf/get-share-image'
import { ThemeProvider, CSSReset, Heading, Button, Input, FormControl, FormLabel, FormErrorMessage, FormHelperText, Box, Text } from "@chakra-ui/core";
import { customTheme } from '../utils/theme';

const Home = () => {

  const [title, setTitle] = React.useState('')
  const [tagline, setTagline] = React.useState('')
  const [loading, setIsLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [generatedImage, setGeneratedImage] = React.useState('')
  const canvasRef = React.useRef<null | HTMLCanvasElement>()
  const imgRef = React.useRef<null | HTMLImageElement>()

  function drawImage() {
    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext('2d')
    const img = imgRef.current
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    }
    // Add extra delay to wait for canvas to finish drawing
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 1000)
  }

  async function handleFormSubmit(e) {
    if (!isFormValid()) {
      setError('You must fill out both fields.')
      return
    } else {
      setError(null)
    }
    setSuccess(false)
    setIsLoading(true)
    e.preventDefault()
    try {
      // get image
      const imageURL = getShareImage({
        title,
        tagline,
        cloudName: 'deaib8dmw',
        imagePublicID: 'iea/iea-template',
        titleFont: 'Arial',
        taglineFont: 'iea/Graphik-Semibold.otf',
        titleExtraConfig: '_bold',
        taglineExtraConfig: '',
        imageWidth: 1920,
        imageHeight: 1080,
        titleBottomOffset: 905,
        taglineTopOffset: 225,
        textAreaWidth: 1500,
        textLeftOffset: 80,
        textColor: '000000',
        titleColor: '949494',
        titleFontSize: 105,
        taglineFontSize: 100,
      });

      setGeneratedImage(imageURL)

      drawImage()
    } catch (error) {
      console.error(error, 'something went wrong')
    }
  }

  function isFormValid() {
    // If there is not title or tagline
    // the form is invalid
    return (!title || !tagline) ? false : true;
  }


  function saveDownload() {
    canvasRef.current.toBlob((data) => {
      saveAs(data, 'social-image.png')
    })
  }

  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Box className='main-app'>
        <Head>
          <title>Home</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box marginTop={20}>
          <Box textAlign="center" my={5}>
            <Heading as="h1" marginBottom={3}>IEA Event Image Generator</Heading>
            <Text>Generate a simple IEA promotional image for your event</Text>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" marginX="auto">
            <FormControl maxWidth={700}>
              <Box display="flex" flexDirection="row" marginTop={2}>
                <FormControl isRequired marginRight={3}>
                  <FormLabel htmlFor="title">Date:</FormLabel>
                  <Input type="text" placeholder="Enter date here" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <FormHelperText id="title-helper-text">The date of the event.</FormHelperText>
                </FormControl>
                <FormControl isRequired marginLeft={3}>
                  <FormLabel htmlFor="tagline">Tite:</FormLabel>
                  <Input type="text" placeholder="Enter title here" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                  <FormHelperText id="tagline-helper-text">The title of the event</FormHelperText>
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="center" marginTop={5}>
                <Button marginTop={2} isLoading={loading} onClick={handleFormSubmit}>Generate image</Button>
              </Box>
              <Text marginTop={2} color="tomato" textAlign="center">{error}</Text>
            </FormControl>
            <Box marginLeft={2} marginTop={10} position="relative">
              {
                success &&
                <Button position="absolute" zIndex={2} top={0} right={0} onClick={saveDownload} marginLeft={2} maxWidth={100}>Download</Button>
              }
              <img style={{ display: 'none' }} ref={imgRef} src={generatedImage} alt="generated social image." crossOrigin="anonymous" />
              <canvas ref={canvasRef} width="1920" height="1080" />
            </Box>
          </Box>
        </Box>

        <style jsx>{`
      .main-app {
        background-color: black;
        height: 100vh;
      }
      .hero {
        width: 100%;
        color: #000;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #000;
      }
    `}</style>
      </Box>
    </ThemeProvider >
  )
}

export default Home
