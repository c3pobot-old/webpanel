import React from 'react'
import { Box } from '@mui/material';

import './unitImage.css';

export default function ShipImg({unit = {}, uInfo = {}}){
  return(
    <Box className="col-sm-6 col-md-6 col-lg-4">
      <Box className="collection-ship collection-ship-dark-side">
        <Box className="collection-ship-main">
          <Box className="collection-ship-primary">
            <Box className="ship-portrait ship-portrait--size-">
              <Box className="ship-portrait__image-group">
                <Box className="ship-portrait__image-frame">
                  <img className="ship-portrait__img ship-portrait__img--size-" src={'data:image/png;base64,'+uInfo?.thumbnail} alt="" />
                </Box>
                <Box className="ship-portrait__level ship-portrait__level--size-">{unit.level || 85}</Box>
                <Box className="ship-portrait__frame"/>
              </Box>
              <Box className="ship-portrait__stars">
                <Box className={(unit.rarity < 1 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
                <Box className={(unit.rarity < 2 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
                <Box className={(unit.rarity < 3 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
                <Box className={(unit.rarity < 4 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
                <Box className={(unit.rarity < 5 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
                <Box className={(unit.rarity < 6 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
                <Box className={(unit.rarity < 7 ? 'ship-portrait__star--inactive':'ship-portrait__star')+' ship-portrait__star--size-normal'} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
