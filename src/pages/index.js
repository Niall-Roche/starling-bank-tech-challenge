import {useState} from 'react'
import Button from '@/components/Button'
import Layout from '@/components/Layout'
import useToken from '@/hooks/useToken'

export default function Home() {
  const [token, setToken] = useState('')

  const tokenMutation = useToken()

  const handleSubmit = e => {
    e.preventDefault()
    tokenMutation.mutate(token)
  }

  return (
    <Layout>
      <p className='text-xl text-white mb-6'>
          Enter the generated access token from the customer details section on the sandbox customer dashboard
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center'>
        <input placeholder='Enter Token Here' value={token} onChange={e => setToken(e?.target?.value)} className='w-1/2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
        <Button loading={tokenMutation?.isLoading} disabled={!token} type='submit'>Submit</Button>
      </form>
    </Layout>
  )
}
