import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST') return await post(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {

    const url = `${process.env.API_BASE_URL}/rest/default/V1/integration/customer/token`

    try {
        const result = await axios.post(url, req.body)
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