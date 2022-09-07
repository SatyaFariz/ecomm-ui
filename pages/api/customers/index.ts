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
    const {
        customer: {
            email,
            fullname
        },
        password
    } = req.body

    const body = {
        customer: {
            email,
            firstname: fullname,
            lastname: '_', // we don't use last name
        },
        password
    }

    const url = `http://localhost/rest/default/V1/customers`

    const request = {
        url,
        method: 'POST',
        body
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    let payload: any = {}
    try {
        const result = await axios.post(request.url, body, { headers: authHeader })
        payload = result.data

        payload.fullname = payload.firstname
        delete payload.firstname
        delete payload.lastname
    } catch (error) {
        const { message, parameters } = error.response.data
        const characters = message.split('')
        for(let i = 0; i < characters.length; i++) {
            if(characters[i] === '%') {
                const nthParam = parseInt(characters[i + 1])
                characters[i] = parameters[nthParam - 1]
                characters[i + 1] = ''
            }
        }

        payload = {
            error: true,
            message: characters.join('')
        }
    }

    res.status(200).json(payload)
}