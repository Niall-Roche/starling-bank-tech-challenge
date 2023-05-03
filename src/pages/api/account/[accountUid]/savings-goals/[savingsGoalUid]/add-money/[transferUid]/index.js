import cookie from 'cookie'

export default async function handler(req, res) {
  if (!['PUT'].includes(req.method)) {
    res.status(405).send({message: 'Only [PUT] requests allowed'})
    return
  }

  const cookies = cookie.parse(req.headers.cookie || '')

  // get the auth-token
  const token = cookies['auth-token']
  const url = `${process.env.PUBLIC_API_URL}/${process.env.PUBLIC_API_VERSION}${req.url.replace('/api', '')}`

  const resp = await fetch(
    url,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    }
  )


  const data = await resp?.json()

  res
    .status(resp?.status)
    .json(data)
}
