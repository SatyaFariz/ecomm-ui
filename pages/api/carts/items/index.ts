import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST') return await post(req, res)
    else if(req.method === 'GET') return await get(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const url = `http://localhost/rest/default/V1/carts/mine/items`

    const body = {
        cartItem: {
            sku: req.body.sku,
            quote_id: 0,
            qty: req.body.qty
        }
    }

    const headers = {
        authorization: req.headers.authorization as string
    }
    
    try {
        const result = await axios.post(url, body, { headers })
        const { data } = result
        res.status(200).json(data)
    } catch(error) {
        console.log(error)
        const { status } = error.response
        const payload = {
            error: true,
            message: error.response.data.message
        }
        res.status(status).json(payload)
    }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const url = `http://localhost/rest/default/V1/carts/mine/items`

    const headers = {
        authorization: req.headers.authorization as string
    }
    
    try {
        const result = await axios.get(url, { headers })
        const { data } = result
        res.status(200).json(data)
    } catch(error) {
        const { status } = error.response
        const payload = {
            message: error.response.data.message
        }
        res.status(status).json(payload)
    }
}