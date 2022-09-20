import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST') return await post(req, res)
}

async function getCartId(req: NextApiRequest, res: NextApiResponse) {

    const url = `http://localhost/rest/default/V1/carts/mine`

    const headers = {
        authorization: req.headers.authorization as string
    }
    
    try {
        const result = await axios.post(url, req.body, { headers })
        const { data } = result
        return data
    } catch(error) {
        const { status } = error.response
        return res.status(status).json(null)
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const cartId = await getCartId(req, res)
    res.status(200).send(cartId)
}