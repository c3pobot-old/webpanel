import React from 'react';
import { Box } from '@mui/material';

import './unitImage.css';
const enumAlignment = {
  alignment_neutral: 1,
  alignment_light: 2,
  alignment_dark: 3
}
export default function CharImg ({ unit = {}, uInfo }){
  let alignment = uInfo?.categoryId.find(x=>x.startsWith('alignment_')), unitAlignment, gearClassL, level = unit?.level || 85
  if(alignment) unitAlignment = enumAlignment[alignment]
  let levelClass = 'character-portrait__level character-portrait__level--size-normal'
  let gearClassR = 'character-portrait__gframe character-portrait__gframe--tier-'+unit?.gear?.value
  if(unit?.gear.name === 'relic'){
    if(unit.gear.value){
      level = unit.gear.value - 2
      levelClass = 'character-portrait__relic character-portrait__relic--size-normal character-portrait__relic--alignment-'+(unitAlignment || 1)
    }
  }
  if(unit?.gear?.name === 'relic' || (unit?.gear?.nameKey === 'G13' )){
    gearClassR = 'character-portrait__rframe character-portrait__rframe--size-normal character-portrait__rframe--alignment-'+unitAlignment
    gearClassL = 'character-portrait__rframe  character-portrait__rframe--right character-portrait__rframe--size-normal character-portrait__rframe--alignment-'+unitAlignment
  }
  return (
    <Box height="120px">
    <Box className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
      <Box className="collection-char">
        <Box className="character-portrait">
          <Box className="character-portrait__primary character-portrait__primary--size-normal">
            <Box className="character-portrait__image-frame character-portrait__image-frame--size-normal">
              <img className="character-portrait__img character-portrait__img--size-normal" src={'/thumbnail/'+uInfo?.thumbnailName+'.png'} alt="" />
            </Box>
            <Box className={levelClass}>{level}</Box>
            <Box className={gearClassR}/>
            {gearClassL && <Box className={gearClassL}/>}
          </Box>
          <Box className="character-portrait__footer character-portrait__footer--size-normal">
            <Box className="character-portrait__stars">
              <Box className={(unit.rarity < 1 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
              <Box className={(unit.rarity < 2 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
              <Box className={(unit.rarity < 3 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
              <Box className={(unit.rarity < 4 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
              <Box className={(unit.rarity < 5 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
              <Box className={(unit.rarity < 6 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
              <Box className={(unit.rarity < 7 ? 'character-portrait__star--inactive':'character-portrait__star')+' character-portrait__star--size-normal'} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
    </Box>
  )
}
