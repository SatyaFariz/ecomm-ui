import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import qs from 'query-string'
import Oauth1Helper from '../../../helpers/Oauth1Helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'GET') return await get(req, res)
}

async function get(req: NextApiRequest, res: NextApiResponse) {
    const { search_term, page, limit, sort } = req.query

    const query: any = {
        'searchCriteria[currentPage]': page || '1',
        'searchCriteria[pageSize]': limit || '1'
    }

    if(search_term) {
        query['searchCriteria[filterGroups][0][filters][0][field]'] = 'name'
        query['searchCriteria[filterGroups][0][filters][0][value]'] = `%25${search_term}%25`
        query['searchCriteria[filterGroups][0][filters][0][conditionType]'] = 'like'
    }

    if(sort) {
        if(sort === 'price_asc') {
            query['searchCriteria[sortOrders][0][field]'] = 'price'
            query['searchCriteria[sortOrders][0][direction]'] = 'asc'
        } else if(sort === 'price_desc') {
            query['searchCriteria[sortOrders][0][field]'] = 'price'
            query['searchCriteria[sortOrders][0][direction]'] = 'desc'
        }
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
            sale,
            ...i
        }
    })

    res.status(200).json(data)
}