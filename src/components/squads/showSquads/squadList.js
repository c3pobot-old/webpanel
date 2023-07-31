import React, { Fragment } from 'react'

import Squad from './squad'

export default function ListSquads({opts= {}, squads = [], getSquadName, openNoteModal}){
  if(squads?.length === 0) return null
  return (
      <Fragment>
      {squads.map((squad, index)=>(
        <Squad key={index} opts={opts} squad={squad} getSquadName={getSquadName} openNoteModal={openNoteModal}/>
      ))}
      </Fragment>
  )
}
