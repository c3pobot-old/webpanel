import React, { Fragment } from 'react'
import { Box } from '@mui/material'

import './defense.css'
export default function ShowZone({zone = {}}){
    console.log(zone)
    return (
        <Box className="unit-container">
        {zone.squads?.map((squad, index)=>(
            <Box key={index} className={"unit-image-"+zone.squads.length+'-'+index}><Box className="unit-image" ><img className="unit-img" src={'/thumbnail/'+squad.thumbnailName+'.png'} /></Box></Box>
        ))}
        </Box>
    )
}