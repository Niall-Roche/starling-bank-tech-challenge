import Button from '@/components/Button'
import {useMemo} from 'react'
import Layout from '@/components/Layout'
import usePrimaryAccount from '@/hooks/usePrimaryAccount'
import useTransactions from '@/hooks/useTransactions'
import useSavingsGoals from '@/hooks/useSavingsGoals'

export default function RoundUp() {
  /*
    Fetch the customer's primary account.
    For this challenge I assume the customer has one primary account.
   */
  const {
    primaryAccount,
    isLoading: accountsLoading,
  } = usePrimaryAccount()

  /*
    Fetch the customer's transactions over the last 7 days for the primary account.
   */
  const {
    transactionsData,
    isLoading: transactionsLoading,
  } = useTransactions(primaryAccount)

  /*
    Fetch the customer's savings goal.
    The first savings goal in the list is used if it exists.
   */
  const {
    savingsGoalData,
    isLoading: savingsGoalLoading,
    savingsGoalMutation,
  } = useSavingsGoals(primaryAccount)

  const roundUp = useMemo(() => {
    const transactions = transactionsData?.feedItems
    return transactions
      // We only want paid out transactions that aren't savings
      ?.filter(item => item?.direction === 'OUT' && item?.spendingCategory !== 'SAVING')
      // Get the difference to the next pound e.g. 1.25 would be .75
      ?.map(item => {
        const amount = item?.amount?.minorUnits / 100
        return Math.round((Math.ceil(amount) - amount) * 100)
      })
      // Get the accumulated round up value
      ?.reduce((a, b) => a + b, 0)
  }, [transactionsData?.feedItems])

  const handler = () =>
    savingsGoalMutation.mutate({
      minorUnits: roundUp,
      id: savingsGoalData?.savingsGoalList?.length > 0 ? savingsGoalData?.savingsGoalList[0]?.savingsGoalUid : null,
    })

  const Loading = () => (
    <div className='animate-pulse'>
      <div className='h-10 w-3/4 bg-slate-700 rounded mx-auto mb-4' />
      <div className='h-10 w-3/4 bg-slate-700 rounded mx-auto mb-4' />
      <div className='h-10 w-1/4 bg-slate-700 rounded mx-auto mb-4' />
      <div className='h-10 w-1/2 bg-slate-700 rounded mx-auto mb-4' />
    </div>
  )

  return (
    <Layout>
      {
        accountsLoading || transactionsLoading || savingsGoalLoading
          ? <Loading />
          : (
            <div>
              <p className='text-xl text-white'>
                The amount shown below is the rounded up value for all of your spending over the last 7 days.
              </p>
              <p className='text-xl text-white'>
                Click the button below to add this to your weekly savings goal.
              </p>
              <div className='text-4xl font-bold text-white my-4'>£{parseFloat((roundUp / 100).toFixed(2))}</div>
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
    </Layout>
  )
}
