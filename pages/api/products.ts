import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
const oauth1a = require('oauth-1.0a')
const crypto = require('crypto')

class Oauth1Helper {
    static getAuthHeaderForRequest(request: any) {
      const CONSUMERKEY = process.env.MAGENTO_CONSUMER_KEY
      const CONSUMERSECRET = process.env.MAGENTO_CONSUMER_SECRET
      const TOKENKEY = process.env.MAGENTO_TOKEN_KEY
      const TOKENSECRET = process.env.MAGENTO_TOKEN_SECRET
    
      const oauth = oauth1a({
          consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
          signature_method: 'HMAC-SHA1',
          hash_function(base_string: string, key: string) {
              return crypto
                  .createHmac('sha1', key)
                  .update(base_string)
                  .digest('base64')
          },
      })

      const authorization = oauth.authorize(request, {
          key: TOKENKEY,
          secret: TOKENSECRET,
      })

      return oauth.toHeader(authorization);
    }
}

// type Data = {
//   name: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const request = {
        url: 'https://magento.femaledaily.net/rest/default/V1/products?searchCriteria[currentPage]=1',
        method: 'GET',
    };
    
    const authHeader = Oauth1Helper.getAuthHeaderForRequest(request);
    
    const result = await axios.get(
        request.url,
        { headers: authHeader });

    res.status(200).send(result.data)
}