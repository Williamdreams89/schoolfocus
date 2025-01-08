import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

const StudntEnroll = () => {
  return (
    <div>
      <Autocomplete options={[]} renderInput={(params) => <TextField {...params} label="freeSolo" />} />
    </div>
  )
}

export default StudntEnroll