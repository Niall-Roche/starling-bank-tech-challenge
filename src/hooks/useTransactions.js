import {useQuery} from '@tanstack/react-query'

const useTransactions = primaryAccount => {
  const {
    data: transactionsData,
    ...rest
  } = useQuery(
    ['accounts', primaryAccount?.accountUid, primaryAccount?.defaultCategory, 'transactions'],
    async () => {
      const resp = await fetch(`/api/feed/account/${primaryAccount?.accountUid}/category/${primaryAccount?.defaultCategory}`, {
        headers: {'Accept': 'application/json'},
      })
      return await resp?.json()
    },
    {enabled: !!primaryAccount?.accountUid && !!primaryAccount?.defaultCategory}
  )

  return {
    transactionsData,
    ...rest,
  }
}

export default useTransactions