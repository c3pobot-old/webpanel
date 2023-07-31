import React from 'react'
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
export default function DaySelector({opts = {}, tbDay, setTBDay, numDays = 1}){
  const handleChange = (event: SelectChangeEvent)=>{
    setTBDay(event.target.value)
  }
  return(
    <FormControl>
    <Select value={tbDay} onChange={handleChange}>
      {[...Array(+numDays).keys()].map((day, index)=>(
        <MenuItem value={+(day + 1)} key={index}>{'Round '+(day + 1)}</MenuItem>
      ))}
    </Select>
    </FormControl>
  )
}
