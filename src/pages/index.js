import {useState} from 'react'
import {Inter} from 'next/font/google'
import Button from '@/components/Button'
import {useRouter} from 'next/router'

const inter = Inter({subsets: ['latin']})

export default function Home() {
  const {push} = useRouter()

  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token}),
    })
      .then(() => push('/round-up'))
      .finally(() => setLoading(false))
  }

  return (
    <main
      className={`my-20 ${inter.className}`}>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center'>
        <input placeholder='Enter Token Here' value={token} onChange={e => setToken(e?.target?.value)} className='w-1/2 mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
        <Button loading={loading} className='w-1/4' disabled={!token} type='submit'>Submit</Button>
      </form>
    </main>
  )
}
