import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Oauth1Helper from '../../../helpers/Oauth1Helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') return await get(req, res)
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const url = `http://localhost/rest/default/V1/products/${req.query.id}`

    const request = {
        url,
        method: 'GET',
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    const result = await axios.get(request.url, { headers: authHeader })
    res.status(200).json(result.data)
}