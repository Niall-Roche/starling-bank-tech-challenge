import {useQuery} from '@tanstack/react-query'
import {useRouter} from 'next/router'

const usePrimaryAccount = () => {
  const {push} = useRouter()

  const {
    data: accountsData,
    ...rest
  } = useQuery(
    ['accounts'],
    async () => {
      const resp = await fetch( '/api/accounts', {headers: {'Accept': 'application/json'}})
      const data = await resp?.json()

      if (resp?.status !== 200) return await Promise.reject(data)
      return data
    },
    {
      retry: 1,
      onError: e => e?.error === 'invalid_token' ? push('/') : toast.error(e?.error_description),
    }
  )
  const primaryAccount = accountsData?.accounts?.find(acc => acc?.accountType === 'PRIMARY')

  return {
    primaryAccount,
    ...rest,
  }
}

export default usePrimaryAccount