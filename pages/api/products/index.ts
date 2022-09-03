import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import qs from 'query-string'
import Oauth1Helper from '../../../helpers/Oauth1Helper'

// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') return await get(req, res)
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const query = {
        'searchCriteria[currentPage]': req.query.page || '1',
        'searchCriteria[pageSize]': req.query.limit || '10'
    }

    const url = `http://localhost/rest/default/V1/products?${qs.stringify(query, { encode: false })}`

    const request = {
        url,
        method: 'GET',
    }

    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request)
    
    const result = await axios.get(request.url, { headers: authHeader })

    const { data } = result
    data.items = data.items.map((i: any) => {
        const customAttributes = i.custom_attributes.reduce((obj: any, val: any) => {
            obj[val.attribute_code] = val.value
            return obj
        }, {})

        const parsedSpecialPrice = parseFloat(customAttributes.special_price)

        const sale = parsedSpecialPrice > 0 ? {
            price: parsedSpecialPrice,
            from: customAttributes.special_from_date,
            to: customAttributes.special_to_date,
            discount_percentage: Math.floor(100 * (i.price - parsedSpecialPrice) / i.price)
        } : null

        return {
            slug: customAttributes.url_key || null,
            sale,
            ...i
        }
    })

    res.status(200).json(data)
}