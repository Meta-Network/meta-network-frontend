import React from 'react'
import { Button } from 'antd'
import { StoreSet, StoreRemove } from '../utils/store'


const key = 'MetaNetworkDEV'

const DEV =  React.memo( function DEV () {

  return (
    <div>
      <Button onClick={ () => StoreSet(key, String(Date.now())) }>开启</Button>
      <Button onClick={ () => StoreRemove(key) }>关闭</Button>
    </div>
  )
})

export default DEV