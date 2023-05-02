import Button from '@/components/Button'
import {useQuery} from '@tanstack/react-query'

const getRoundUp = transactions => {
  return transactions
    ?.filter(item => item?.direction === 'OUT')
    ?.map(item => {
      const amount = item?.amount?.minorUnits / 100
      const diff = Math.ceil(amount) - amount
      return diff * 100
    })
    ?.reduce((a, b) => a + b, 0)
}

export default function RoundUp() {
  const {data: accountsData} = useQuery(
    ['accounts'],
    async () => {
      const resp = await fetch('/api/accounts', {headers: {'Accept': 'application/json'}})
      return await resp?.json()
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
  } = useQuery(
    ['accounts', primaryAccount?.accountUid, 'savings-goals'],
    async () => {
      const resp = await fetch(`/api/account/${primaryAccount?.accountUid}/savings-goals`, {
        headers: {'Accept': 'application/json'},
      })
      return await resp?.json()
    }
  )

  //   const {savingsGoalList} = await useFetchAccountSavingsGoals(primaryAccount?.accountUid)
  const roundUp = getRoundUp(transactionsData?.feedItems)

  const handler = () => {
    const savingsGoalList = savingsGoalData?.savingsGoalList
    if (!!savingsGoalList[0]) {
      console.log('savings-goal', savingsGoalList[0])
    } else {
      // TODO

      // createSavingsGoal(accountUid, roundUp, currency)
      //   ?.then(console.log)
    }
  }

  return (
    <div className='text-center my-20'>
      <div className='text-4xl font-bold text-white  mb-4'>£{parseFloat((roundUp / 100).toFixed(2))}</div>
      <Button
        // loading={loading}
        onClick={handler}>
      Add To Your Savings Goal
      </Button>
      {/* <SubmitRoundUp
        accountUid={primaryAccount?.accountUid}
        currency={primaryAccount?.currency}
        roundUp={roundUp}
        savingsGoalList={savingsGoalList}
      /> */}
    </div>
  )
}