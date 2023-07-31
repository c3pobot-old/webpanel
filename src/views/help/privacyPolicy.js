import React from 'react';
import { Box, Container, Typography } from '@mui/material';

export default function PrivacyPolicy () {
  return (
    <Container>
      <Box><Typography variant="h6" pt={2} pb={2}>Information Collected and stored by the bot and website</Typography></Box>
      <Box>
      <Typography pb={1}>The Bot and website will store the users discord Id for identification purposes (who is running a command etc..)</Typography>
      <Typography pb={1}>The bot will read every message sent in a discord channel that it has access to. This is required for the custom reaction and translate features</Typography>
      <Typography>Some users/players will have the ability to link thier google play games account to the bot/website. The bot is not saving any personal Information with this link, it is simiply using the app access to get to your game account as you.</Typography>
      <Typography>Access for this can be revoked in your google settings</Typography>
      <Typography pb={1}><a href="https://myaccount.google.com/u/2/permissions" target="_blank" rel="noreferrer">https://myaccount.google.com/u/2/permissions</a></Typography>
      <Typography>The bot and website will store game data from Star Wars Galaxy of Heores as it is requested by players.</Typography>
      <Typography>There is "private" and "public" data from the game available.</Typography>
      <Typography>"private" data requires the bot/website to authenticate as the player to retrieve data</Typography>
      <Typography>"public" data can be pulled from the bot/website by anyone just as it can be done in the game</Typography>
      <Typography pb={1}>another player cannot pull your "private" data</Typography>
      <Typography>Any other questions Please feel free to reach out to @scuba in the bot-discord server</Typography>
      </Box>
    </Container>
  )
}
