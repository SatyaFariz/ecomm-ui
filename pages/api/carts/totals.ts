import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') return await get(req, res)
}

async function get(req: NextApiRequest, res: NextApiResponse) {

    const url = `${process.env.API_BASE_URL}/rest/default/V1/carts/mine/totals`

    const headers = {
        authorization: req.headers.authorization as string
    }
    
    
    try {
        const result = await axios.get(url, { headers })
        const { data } = result
        res.status(200).json(data)
    } catch(error) {
        const { status } = error.response
        res.status(status).json(null)
    }
}