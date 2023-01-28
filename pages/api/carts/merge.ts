import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST') return await post(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const url = `${process.env.API_BASE_URL}/graphql`

    const headers = {
        authorization: req.headers.authorization as string,
        'Content-Type': 'application/json'
    }

    const body = {
        query: `
            mutation {
                mergeCarts(source_cart_id: "${req.body.source_cart_id}") { 
                    id
                }
            }
        `
    }
    
    try {
        await axios.post(
            url, 
            body, 
            { 
                headers 
            }
        )
        return res.status(200).json(true)
    } catch(error) {
        const { status } = error.response
        return res.status(status).json(null)
    }
}