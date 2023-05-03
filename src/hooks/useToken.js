import React from 'react'
import {useMutation} from '@tanstack/react-query'
import {useRouter} from 'next/router'

const useToken = () => {
  const {push} = useRouter()
  return useMutation(token => fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token}),
  }),
  {onSuccess: () => push('/round-up')})
}

export default useToken
