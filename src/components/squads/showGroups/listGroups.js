import React, { Fragment } from 'react'

import Group from './group'
import stableSort from 'components/stableSort'

export default function ListSquads( opts = {} ){
  const { groups, orderBy, order  } = opts
  return (
    <Fragment>
    {stableSort(groups, order, orderBy)?.map((group, groupIndex)=>(
      <Group opts={opts} group={group} key={groupIndex}/>
    ))}
    </Fragment>
  )
}
