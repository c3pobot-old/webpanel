import React, { Fragment, useEffect, useState} from 'react'
import { Button, Box } from '@mui/material'
import './defense.css'

import useLocalStorage from 'components/useLocalStorage'
import RefreshUnits from 'components/squads/refreshUnits'
import DefenseModal from './defenseModal'
import ShowZone from './showZone'

const defaultZones = {
    T1: {id: 'T1', combatType: 1, squads: []},
    T2: {id: 'T2', combatType: 1, squads: []},
    S1: {id: 'S1', combatType: 2, squads: []},
    S2: {id: 'S2', combatType: 2, squads: []},
    M1: {id: 'M1', combatType: 1, squads: []},
    M2: {id: 'M2', combatType: 1, squads: []},
    B1: {id: 'B1', combatType: 1, squads: []},
    B2: {id: 'B2', combatType: 1, squads: []},
    B3: {id: 'B3', combatType: 1, squads: []},
    B4: {id: 'B4', combatType: 1, squads: []}
}
const zoneMaps = [
    {id: 'T1', sx: {top: '200px', left: '880px'}},
    {id: 'T2', sx: {top: '150px', left: '660px'}},
    {id: 'S1', sx: {top: '100px', left: '470px'}},
    {id: 'S2', sx: {top: '140px', left: '250px'}},
    {id: 'M1', sx: {top: '320px', left: '450px'}},
    {id: 'M2', sx: {top: '310px', left: '200px'}},
    {id: 'B1', sx: {top: '500px', left: '950px'}},
    {id: 'B2', sx: {top: '530px', left: '700px'}},
    {id: 'B3', sx: {top: '600px', left: '440px'}},
    {id: 'B4', sx: {top: '590px', left: '200px'}}
]
export default function DefenseMap({opts={}}){
    const [ unitList, setUnitList ] = useState([])
    const [ charUnits, setCharUnits] = useState(null)
    const [ shipUnits, setShipUnits ] = useState(null)
    const [ zoneDetails, setZoneDetails ] = useState(null)
    const [ zoneOpen, setZoneOpen ] = useState(false)
    const [ zones, setZones ] = useLocalStorage('tw-defense', {})

    useEffect(()=>{
        if(unitList?.length === 0) RefreshUnits({...opts, setUnitList: setUnitList})
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    useEffect(()=>{
        if(unitList?.length > 0){
            setCharUnits(unitList.filter(x=>x.combatType === 1))
            setShipUnits(unitList.filter(x=>x.combatType === 2))
        }
    }, [unitList])
    function editZone(zoneId){
        if(zoneId){
            setZoneDetails(zones[zoneId] || defaultZones[zoneId])
            setZoneOpen(true)
        }
        
    }
    function updateZone(zoneInfo){
        if(!zoneInfo?.id) return
        let tempZoneDetails = JSON.parse(JSON.stringify(zones))
        tempZoneDetails[zoneInfo?.id] = zoneInfo
        setZones(tempZoneDetails)
    }
    function clearZone(zoneId){
        if(!zones[zoneId]) return
        let tempZoneDetails = JSON.parse(JSON.stringify(zones))
        delete tempZoneDetails[zoneId]
        setZones(tempZoneDetails)
    }
    function refreshUnits(force = false){
        RefreshUnits(opts, force)
    }
    return (
        <Fragment>
        {zoneOpen && <DefenseModal opts={opts} setOpen={setZoneOpen} open={zoneOpen} zoneDetails={zoneDetails} updateZone={updateZone} clearZone={clearZone} refreshUnits={refreshUnits} unitList={zoneDetails?.combatType === 2 ? shipUnits:charUnits}/>}
        <Box className="map-background">
            {zoneMaps.map((map, index)=>(
                <Box className="zone" key={index} sx={map.sx} onClick={()=>editZone(map.id)}>{zones[map.id] && zones[map.id]?.squads.length > 0 ? <ShowZone zone={zones[map.id]}/>:<Button variant="contained">Add Squads</Button>}</Box>
            ))}
        </Box>
        </Fragment>
    )
}