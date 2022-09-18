import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Oauth1Helper from '../../../../helpers/Oauth1Helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST') return await post(req, res)
    else if(req.method === 'GET') return await get(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {

    const url = `http://localhost/rest/default/V1/guest-carts/${req.query.cart_id}/items`

    const body = {
        cartItem: {
            sku: req.body.sku,
            quote_id: req.query.cart_id,
            qty: req.body.qty
        }
    }

    const request = {
        url,
        method: 'POST',
        body
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    
    try {
        const result = await axios.post(request.url, body, { headers: authHeader })
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

    const url = `http://localhost/rest/default/V1/guest-carts/${req.query.cart_id}/items`


    const request = {
        url,
        method: 'GET'
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    
    try {
        const result = await axios.get(request.url, { headers: authHeader })
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