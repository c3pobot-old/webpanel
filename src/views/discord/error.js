import React from 'react';
import { Box, Container, Typography} from '@mui/material';
export default function DiscordError (){
    localStorage.removeItem('startUrl')
    localStorage.removeItem('discordStateParam')
    return (
      <Container>
        <Box textAlign="center" pt={5} pb={5}>
          <Typography>There was an error with the discord login.</Typography>
        </Box>
      </Container>
    )
}
