import Button from '@/components/Button'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {v4} from 'uuid'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {useMemo} from 'react'

export default function RoundUp() {
  const queryClient = useQueryClient()
  const {push} = useRouter()

  const {
    data: accountsData,
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

  const {
    data: transactionsData,
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

  const {
    data: savingsGoalData,
    isLoading: savingsGoalLoading,
  } = useQuery(
    ['accounts', primaryAccount?.accountUid, 'savings-goals'],
    async () => {
      const resp = await fetch(`/api/account/${primaryAccount?.accountUid}/savings-goals`, {
        headers: {'Accept': 'application/json'},
      })
      return await resp?.json()
    }, {enabled: !!primaryAccount?.accountUid})

  const roundUp = useMemo(() => {
    const transactions = transactionsData?.feedItems
    return transactions
      ?.filter(item => item?.direction === 'OUT' && item?.spendingCategory !== 'SAVING')
      ?.map(item => {
        const amount = item?.amount?.minorUnits / 100
        return Math.round((Math.ceil(amount) - amount) * 100)
      })
      ?.reduce((a, b) => a + b, 0)
  }, [transactionsData?.feedItems])

  const savingsGoalMutation = useMutation(
    async id => {
      let savingsGoalUid = id
      if (!id) {
        const goalResp = await fetch(
          `api/account/${primaryAccount?.accountUid}/savings-goals`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'Weekly Round Up',
              currency: primaryAccount?.currency,
            }),
          })

        const data = await goalResp?.json()
        savingsGoalUid = data?.savingsGoalUid
      }

      const addMoneyResp = await fetch(
        `api/account/${primaryAccount?.accountUid}/savings-goals/${savingsGoalUid}/add-money/${v4()}`,
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: {
              currency: primaryAccount?.currency,
              minorUnits: roundUp,
            },
          }),
        })

      return await addMoneyResp?.json()
    },
    {onSuccess: () => {
      queryClient.invalidateQueries(['accounts'])
        .then(() => toast.success('Nice! You have successfully added to your savings goal!'))
    }}
  )

  const handler = () =>
    savingsGoalMutation.mutate(savingsGoalData?.savingsGoalList?.length > 0 ? savingsGoalData?.savingsGoalList[0]?.savingsGoalUid : null)

  return (
    <div className='text-center my-20'>
      <div className='flex-col my-4'>
        <div className='text-4xl font-bold text-white mb-2'>
          Weekly Round Up
        </div>
        <p className='text-xl text-white'>
          The amount shown below is the rounded up value for all of your spending over the last 7 days.
        </p>
        <p className='text-xl text-white'>
          Click the button below to add this to your weekly savings goal.
        </p>
      </div>
      <div className='text-4xl font-bold text-white  mb-4'>£{parseFloat((roundUp / 100).toFixed(2))}</div>
      <Button
        disabled={savingsGoalLoading}
        loading={savingsGoalMutation?.isLoading}
        onClick={handler}>
      Add To Your Savings Goal
      </Button>
      {
        savingsGoalData?.savingsGoalList?.length > 0
          ? (
            <div className='text-xl text-white my-10'>
              {`You have saved £${parseFloat(savingsGoalData?.savingsGoalList[0]?.totalSaved?.minorUnits / 100).toFixed(2)}`}
            </div>
          )
          : null
      }
    </div>
  )
}
