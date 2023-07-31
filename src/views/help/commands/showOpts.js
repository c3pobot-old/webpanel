import React, { Fragment } from 'react';

import ShowOpt from './showOpt'
import ShowSubCmds from './showSubCmds'
import ShowSubGroups from './showSubGroups'

export default function ShowOpts ({ main, opts }) {
  if(opts?.length > 0) return (
    opts.map(({name, description, type, options}, i)=>(
      <Fragment key={i}>
        { type !== 1 && type !== 2 && <ShowOpt name={name} description={description} type={type}/> }
        { type === 1 && <ShowSubCmds main={main} name={name} description={description} options={options} /> }
        { type === 2 && <ShowSubGroups main={main} name={name} description={description} options={options} /> }
      </Fragment>
    ))
  )
}
