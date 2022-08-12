
import React from 'react'
import { useParams } from 'react-router-dom'

export default function MathGen() {
    const params = useParams()
    console.log(params)
  return (
    <div>{JSON.stringify(params)}</div>
  )
}
