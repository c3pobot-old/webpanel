import React from 'react';

import CharImg from './charImg'
import ShipImg from './shipImg'
export default function UnitImage ({ unit, uInfo }){
  if(uInfo?.combatType === 2) return <ShipImg unit={unit} uInfo={uInfo} />
  return <CharImg unit={unit} uInfo={uInfo} />
}
