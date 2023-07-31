//react
import React, { useState, useEffect } from 'react';
import { TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Table, TableBody, TableHead, TableCell, TableContainer, TableRow } from '@mui/material';
//modules
//local
//import ApiRequest, { GetCookie, GetLocalStorage } from 'components/helpers';
import DB from 'components/db'
import ApiRequest from 'components/apiRequest'
import ButtonNav from 'components/buttonNav'
import GetCookie from 'components/cookies'
import GetRow from './getRow';
import ShowPopUp from 'components/showPopUp'
export default function AllyCodes (opts = {}) {
  //hooks
  const { discordId, setSpinner, setAlert } = opts;
  if(!discordId){
    localStorage.setItem('startUrl', window.location.href)
    ButtonNav('/discord/login')
  }
  const [ allyCodes, setAllyCodes ] = useState([])
  const [ newAllyCode, setAllyCode ] = useState('');
  const [ verifyMsg, setVerify ] = useState(false);
  const [ popupStatus, setPopupStatus ] = useState(false);
  const [ saveStatus, setSaveStatus ] = useState(false);

  useEffect(()=>{
    async function fetchData() {
      setSpinner(true)
      const data = await DB.get('allyCodes')
      if(data?.length > 0){
        setAllyCodes(data)
      }else{
        const pObj = await ApiRequest({method: 'getAllyCodes', dId: GetCookie('discordId'), data: {}})
        if(pObj?.length > 0){
          await DB.set('allyCodes', pObj)
          setAllyCodes(pObj)
        }
      }
      setSpinner(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if(!discordId) return null
  const primaryAllyCode = (allyCodes?.length > 0 ? allyCodes.find(x=>x.opt === 'primary'):allyCodes.filter(x=>x.opt !== 'alt')[0])
  const secondaryAllyCode = allyCodes?.find(x=>x.opt === 'alt')

  async function AddNewAllyCode (data){
    if(newAllyCode && newAllyCode !== '' && newAllyCode !== ""){
      setSaveStatus(true)
      setAlert({type: 'info', msg: 'Adding allyCode '+newAllyCode})
      let completeAlert
      const pObj = await ApiRequest({method: 'addAllyCode', dId: GetCookie('discordId'), data:{allyCode: newAllyCode}})
      if(pObj?.allyCodes){
        await DB.set('allyCodes', pObj.allyCodes)
        setAllyCodes(pObj.allyCodes)
      }
      if(pObj?.msg) completeAlert = pObj.msg
      if(pObj?.verify){
        completeAlert = null
        setVerify({msg: pObj.verify, title: 'Verification Needed'})
        setPopupStatus(true)
      }
      if(completeAlert) setAlert(completeAlert)
    }
    setAllyCode('')
    setSaveStatus(false)
  }
  async function EditAllyCode (opt = {data:{}}) {
    if(opt.method && opt.data?.allyCode){
      setSpinner(true)
      setAlert({type: 'info', msg: (opt.method === 'remove' ? 'Removing':'Unlinking Auth for ')+' allyCode '+(opt.data.allyCode ? opt.data.allyCode:'')})
      opt.dId = GetCookie('discordId')
      const obj = await ApiRequest(opt)
      if(obj?.allyCodes){
        await DB.set('allyCodes', obj.allyCodes)
        setAllyCodes(obj.allyCodes)
      }
      if(obj?.msg){
        setAlert(obj.msg)
      }else{
        setAlert({type: 'error', msg: 'Error '+(opt.method === 'remove' ? 'removing':'unlinking auth')+' for allyCode '+opt.data.allyCode})
      }
      setSpinner(false)
    }
  }

  if(!allyCodes || allyCodes?.length === 0) return null
  return (
    <TableContainer>
      <ShowPopUp open={popupStatus} msg={verifyMsg?.msg} title={verifyMsg?.title} onClose={setPopupStatus}/>
      <Table>
        <TableHead>
          <TableRow><TableCell colSpan={4} sx={{ width: "100%" }}><Typography variant="h6">Game allyCodes linked to Discord Account</Typography></TableCell></TableRow>
          <TableRow>
            <TableCell><Typography>Player Name</Typography></TableCell>
            <TableCell><Typography>allyCode</Typography></TableCell>
            <TableCell><Typography>Auth Type</Typography></TableCell>
            <TableCell><Typography>Pri/Alt</Typography></TableCell>
          </TableRow>
        </TableHead>

          {allyCodes?.length > 0 && allyCodes.map(({allyCode, name, type})=>(
            <GetRow key={allyCode} name={name} allyCode={allyCode} type={type} buttonNav={ButtonNav} handleEdit={EditAllyCode} pri={primaryAllyCode?.allyCode} alt={secondaryAllyCode?.allyCode}/>
          ))}
          <TableBody>
          <TableRow>
            <TableCell colSpan="3"><TextField onChange={(e)=>setAllyCode(e.currentTarget.value)} value={newAllyCode} label="New allyCode" variant="outlined" /></TableCell>
            <TableCell><LoadingButton loadingPosition="start" loading={saveStatus} variant="contained" startIcon={<SaveIcon />} onClick={AddNewAllyCode}><Typography>Add</Typography></LoadingButton></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

  )
}
