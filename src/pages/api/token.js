import {serialize} from 'cookie'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Only POST requests allowed'})
    return
  }

  const cookie = serialize('auth-token', req?.body?.token, {
    httpOnly: true,
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({message: 'Successfully set cookie!'})
}
