import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Oauth1Helper from '../../../helpers/Oauth1Helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') return await post(req, res)
}

async function post(req: NextApiRequest, res: NextApiResponse) {

    const url = `http://localhost/rest/default/V1/customers/me`

    const request = {
        url,
        method: 'GET',
        headers: req.headers
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    try {
        const result = await axios.get(request.url, { headers: { ...authHeader, ...req.headers } })

        const { data } = result

        data.fullname = data.firstname
        delete data.firstname
        delete data.lastname

        res.status(200).json(data)
    } catch (error) {
        if(error.response.status === 401)
        res.status(401).send(null)
    }
}