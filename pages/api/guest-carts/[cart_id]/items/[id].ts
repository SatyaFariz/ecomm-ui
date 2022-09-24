import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'PUT') return await post(req, res)
    else if(req.method === 'DELETE') return await del(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const url = `http://localhost/rest/default/V1/guest-carts/${req.query.cart_id}/items/${req.query.id}`

    const body = {
        cartItem: {
            quote_id: 0,
            qty: req.body.qty
        }
    }

    try {
        const result = await axios.put(url, body)
        const { data } = result
        res.status(200).json(data)
    } catch(error) {
        const { status } = error.response
        const payload = {
            error: true,
            message: error.response.data.message
        }
        res.status(status).json(payload)
    }
}

async function del(req: NextApiRequest, res: NextApiResponse) {
    const url = `http://localhost/rest/default/V1/guest-carts/${req.query.cart_id}/items/${req.query.id}`
    
    try {
        const result = await axios.delete(url)
        const { data } = result
        res.status(200).json(data)
    } catch(error) {
        const { status } = error.response
        const payload = {
            error: true,
            message: error.response.data.message
        }
        res.status(status).json(payload)
    }
}