import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Oauth1Helper from '../../../helpers/Oauth1Helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST') return await post(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {

    const url = `http://localhost/rest/default/V1/guest-carts`

    const request = {
        url,
        method: 'POST',
        body: req.body
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    
    
    try {
        const result = await axios.post(request.url, req.body, { headers: authHeader })
        const { data } = result
        res.status(200).json(data)
    } catch(error) {
        const { status } = error.response
        res.status(status).json(null)
    }
}