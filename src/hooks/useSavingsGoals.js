import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {v4} from 'uuid'
import toast from 'react-hot-toast'

const useSavingsGoals = primaryAccount => {
  const queryClient = useQueryClient()

  const {
    data: savingsGoalData,
    ...rest
  } = useQuery(
    ['accounts', primaryAccount?.accountUid, 'savings-goals'],
    async () => {
      const resp = await fetch(`/api/account/${primaryAccount?.accountUid}/savings-goals`, {
        headers: {'Accept': 'application/json'},
      })
      return await resp?.json()
    }, {enabled: !!primaryAccount?.accountUid})

  const savingsGoalMutation = useMutation(
    async ({id, minorUnits}) => {
      let savingsGoalUid = id
      /*
       Need to check if we already have a savings goal created.
       If not we create one.
       */
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

      /*
       Add the round up value to the savings goal
       */
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
              minorUnits,
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

  return {
    savingsGoalData,
    savingsGoalMutation,
    ...rest,
  }
}

export default useSavingsGoals
