import React from 'react'
import { Button } from 'antd'
import { StoreRemove } from '../utils/store'
import { useRouter } from 'next/router'

const key = 'MetaNetworkDEV'

/**
 * dev
 */
const DEV =  React.memo( function DEV () {
  const router = useRouter()

  return (
    <div>
      <Button onClick={ () => router.push('/') }>Home</Button>
      <Button onClick={ () => StoreRemove(key) }>关闭</Button>
      <Button onClick={ () => StoreRemove(key) }>关闭</Button>
    </div>
  )
})

export default DEV