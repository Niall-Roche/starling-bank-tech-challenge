import cookie from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send({message: 'Only GET requests allowed'})
    return
  }

  const {changesSince} = req?.query
  const date = changesSince || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  date.setHours(0, 0, 0, 0)
  const cookies = cookie.parse(req.headers.cookie || '')

  // Get the visitor name set in the cookie
  const token = cookies['auth-token']
  const resp = await fetch(
    `${process.env.PUBLIC_API_URL}/${process.env.PUBLIC_API_VERSION}${req.url.replace('/api', '')}?changesSince=${date.toISOString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    }
  )

  const data = await resp?.json()

  res
    .status(resp?.status)
    .json(data)
}
