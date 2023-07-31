//React
import React, { Fragment, useState } from 'react';
import { Button, Modal, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const starActive = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAD6UlEQVQ4ja2VW4iVVRzFf3vv737OnMs4R+eYNePYJFoTqElYQqGZI770WtKDTz5Y0KsQIWQ3MDAksBdJ6EKID93QbiYO4cgUxjQMUeoxTcc5zpz79Tvn+3YPHkGHyQu1YL/9Wf/F2muvrbh7yHuYRd3lXHzzhtTyfCEw6o2gAQT/B7EJDH3x6dqPk6lE6viJqV+B8l0Kui3SO15MHdD5Z/Tk5NY88HRn2W1xJ8UO8PjnB5e+3ZUwjNSSmFMpNdWp0cJpoPRf1A7s253+oXV+hQ6ya7QOn9WzV9b7wFbAvVfFBtAFLHZssenw/u6XlQiEsAR4Jq4dqnRKDn51rDgONICwc/TNJAKwgGTnxHoWWL1bhnvWPvJobO2mdfLJhyPZqHQUMhFD9KagXgY8Dhxqj1/4q3r65MmZsdHRmT+AAlAEZoGqAFIH9w/tSvRGn0ovidy/bFkkkUqFJtQBQXj1CuGlv5HpBYhFEWiC8AZAOoDC912dyTRqZ8/OToetRubQB+ffPHLs4ogBiHAy07uhL7Fa6i6MXIRWaKPiCulYyN4+pAWUZ8H0wHwIiAJVgkoVUZwWS4NK5IFEYaCWv7zwQE6qG1Y4wIo925x3dmxWm0IBuDYyaqPiNiruoWIOrlNGOzH8vAWVEkGpBpUq1OoIv03mqqgM7axtB34E8gpoA/njv7UnBvrcVUMrvfuwJGEroJGr0ZwpYrRrlKc1Ya6Ezk/RvFaEVgulBNKyKVQsf/NrlZ35UngUyAH6RioCIP/1aHN81YC5vr/XWCBMiZsw6e53EUqQnaxhKEF3v4dUFhoFgaBa1eELbxRfPfN76zAwM1/c2kDuyEjj3PA6e8vgg5YTjUvQMP1nC2VKmnWNQhDpUQit0QG8tLf44ZcjjfeBqZsjZ8zJcBW4mC3ra0oQ1yEUs21a9RA3oRBKUrjSxvYEhikwTDg14Y91lIY3E81XhebStEqCplEOaVQ0liMxJMRiEqWgONVG6Ot3v3W9u7zzFm7BfMRuIqK8MAC/HGIqMCQYSmBbgnhSEtRCKrMhUim6u1S6k6zbEqt4VMbjnmkFNTBCjW0KdIA+esq/fOZcULIdRSwiaOXbtOuCRNTomY94rsfW6kFrSdJTSoch14ra//bnxpmPvmt8MjLh/wJEdm2PbxteYw2vXqwXtnIt+hfbi7hDIQHEd29Pvn7us77CWzuS38Sj8jlgkOulJDtepoEnnt/ovvv9nsSFE/sWjVumWDmXaG67mRsfc7uzpTDzynuze5u+HgOygM/1KAVABZiayLTHuzxxKWKL6RPj/k/1pr7lVxHzLPI66uodwn+D6lhgALW5s/8A1TmBO71/buIAAAAASUVORK5CYII='
const starInactive = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADnElEQVQ4ja2VTWgkRRiGn6rq6p70TGfyu9nZMRACY5AgbiSLhwhCYFnNbdmL4MU9i1dhwbMoeBXx5kUvHvfgYQ+yiIRlESejHhIYdshsfs2P+Znt6U5Vl4eZhCQb9wf9oA5VfPX2+73f+1UrXjzkS+SiXjCvODY2NpEkiWeMaQP2/wDWwOs3b978Lp/PDzcajSpw8LxLL1Le0OTk5O2+vr6JSqXyIfBq92PPjOcxzgFvzc3Nfa619qIoyiVJolZXVx8A+/+F8ZWZmZlPgiDIZVmGMYbp6en3gTeAnpdl7AERcEUpdX12dvZj0QmEEEgpVRiGlUajUQPaQNZd7jSIAHygv7t6e3p6Lo+NjV0bHh6+ViqVZoIgKEgp8X2fIAgwxqCUYmlpqba3t/eg2Ww+XF1dXQL+BvaAbaAlgOEbN27cCcPwnSiKRovFYl8QBNrajqPiOKbVapHL5fA8D4BCoYBSim4Vbn9//8nW1taGtfZRrVb7bHFx8WcPEIeHh5dHRkbe1FpjjME5h1IKKSX5fB6ANE3xPI8oivA8D2MM1lqMMcI5ly8UCuMHBweX2u22OpYiB7w2NTX1RaVSuQ4gpUQphVIKrTWe5+GcO2F8dHSEMeYEPMsyWq3W4d27d28DPwG7CjDA7vr6+h/FYnFqYGCgLITAOUeaprTbbY4dkaYpcRyTJAlZlp0QMMak9+7d+yhN0x+BHcAdu8ICu81mszY4OPh2FEWDQgi01oRhiBCCVquFlJIwDE/rizEmu3///qfb29s/AFsX2c0AO41Go14ul98rFos5rfVJA6WUWGuRUnJ8DjA/P//t8vLyV8DaacudH5AWsNxut/86liNJkjOAp/dCCDY3Nx92mWangS6aPB1FUT+AtRZr7Unpvu8jhCBJks4QCMHo6OhEdxbOxEXAPb7vh865M8yklBwPSpZlHB0dIYQgl8uV6DjrmcDK9/1iEAS+cw4hBEopALeysrKys7Ozr5TC932stTjn8H1/6CJg79zeHxoaeiUIApVlGUmSpI8fP/6tXq9/v7Gx8SuQv3r16gflcvnd/v7+S9Zaent7R7jgQXoKuFQqleI43qvX6w8WFha+TtP0T2CdTmO9arX6e7Va/WZ8fPxWpVK5pbXOpJRk2ZnePfW66XK5PBDH8aP5+fkvrbUPgU0gpWMlCxwCa7u7uzWtdVNrvbG2tvaLtfbMX0Wc1xgI6WgfdwH/LVRXAg94cj73HwuriCSZjIMJAAAAAElFTkSuQmCC'
export default function EditModal ({open, setOpen, saveEdit, unit, uInfo}){

  const [ rarityValue, setRarityValue ] = useState(unit?.rarity || 1)
  const [ gearValue, setGearValue ] = useState(unit?.gear?.name === 'gear' ? unit.gear.value:1);
  const [ relicValue, setRelicValue ] = useState(unit?.gear?.name === 'relic' ? (unit.gear.value - 2):0);
  const [ gp, setGp ] = useState(unit?.gp || 0)

  function handleClose(){
    setOpen(false)
  }
  function handleGearSlider (event, newValue){
    setGearValue(newValue);
    //if(relicValue === 0) editGear(newValue)
  };
  function handleRelicSlider (event, newValue){
    setRelicValue(newValue);
    //editRelic(newValue, gearValue)
  };
  function handleEdit (){
    setOpen(false)
    const tempObj = {
      rarity: rarityValue,
      gp: gp || 0
    }
    tempObj.gp = +tempObj.gp
    if(relicValue > 0){
      setGearValue(1)
      tempObj.gear = {
        nameKey: 'R'+relicValue,
        name: 'relic',
        value: +relicValue + 2
      }
    }else{
      tempObj.gear = {
        nameKey: 'G'+gearValue,
        name: 'gear',
        value: +gearValue
      }
    }
    saveEdit(tempObj)
  }
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <TableContainer sx={style}>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan="2"><Typography>{unit?.nameKey}</Typography></TableCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan="2">
              <img className="rarity-select" src={rarityValue < 1 ? starInactive:starActive} onClick={()=>setRarityValue(1)} alt=""/>
              <img className="rarity-select" src={rarityValue < 2 ? starInactive:starActive} onClick={()=>setRarityValue(2)} alt=""/>
              <img className="rarity-select" src={rarityValue < 3 ? starInactive:starActive} onClick={()=>setRarityValue(3)} alt=""/>
              <img className="rarity-select" src={rarityValue < 4 ? starInactive:starActive} onClick={()=>setRarityValue(4)} alt=""/>
              <img className="rarity-select" src={rarityValue < 5 ? starInactive:starActive} onClick={()=>setRarityValue(5)} alt=""/>
              <img className="rarity-select" src={rarityValue < 6 ? starInactive:starActive} onClick={()=>setRarityValue(6)} alt=""/>
              <img className="rarity-select" src={rarityValue < 7 ? starInactive:starActive} onClick={()=>setRarityValue(7)} alt=""/>
            </TableCell>
          </TableRow>
          <TableRow><TableCell colSpan="2"><TextField type="number" onChange={(e)=>setGp(e.currentTarget.value)} value={gp} label="GP" variant="outlined" /></TableCell></TableRow>
          {uInfo?.combatType === 1 &&
            <Fragment>
            <TableRow>
              <TableCell><Slider  aria-label="Relic" onChange={handleGearSlider} value={typeof gearValue === 'number' ? gearValue : 0} valueLabelDisplay="auto" marks step={1} min={1} max={13} /></TableCell>
              <TableCell><Typography>{'G'+gearValue}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Slider  aria-label="Relic" onChange={handleRelicSlider} value={typeof relicValue === 'number' ? relicValue : 0} valueLabelDisplay="auto" marks step={1} min={0} max={9} /></TableCell>
              <TableCell><Typography>{'R'+relicValue}</Typography></TableCell>
            </TableRow>
            </Fragment>
          }
          <TableRow>
            <TableCell textalign="center"><Button variant="contained" onClick={handleEdit}>Update</Button></TableCell>
            <TableCell textalign="center"><Button variant="contained" onClick={()=>setOpen(false)}>Cancel</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Modal>
  )

}
