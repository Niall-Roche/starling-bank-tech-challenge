import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

const Layout = ({children, className}) => {
  return (
    <main className={`my-20 ${className} ${inter.className}`}>
      <div className='text-center'>
        <div className='text-4xl font-bold text-white mb-6'>
          Weekly Round Up
        </div>
        {children}
      </div>
    </main>
  )
}

export default Layout