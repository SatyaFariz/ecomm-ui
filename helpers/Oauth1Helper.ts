import oauth1a from 'oauth-1.0a'
import { createHmac } from 'crypto'

class Oauth1Helper {
    static getAuthHeaderForRequest(request: any) {
      const CONSUMERKEY = process.env.MAGENTO_CONSUMER_KEY || ''
      const CONSUMERSECRET = process.env.MAGENTO_CONSUMER_SECRET || ''
      const TOKENKEY = process.env.MAGENTO_TOKEN_KEY || ''
      const TOKENSECRET = process.env.MAGENTO_TOKEN_SECRET || ''
    
      const oauth = new oauth1a({
          consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
          signature_method: 'HMAC-SHA256',
          hash_function(base_string: string, key: string) {
              return createHmac('sha256', key)
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

export default Oauth1Helper