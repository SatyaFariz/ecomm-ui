import useLocalStorage from './useLocalStorage'
import useAuthedQuery from './useAuthedQuery'
import Http from '../libs/http'
import {} from 'react-query'

const useCurrentUser = (): { error: any, user: any } => {
    const [token] = useLocalStorage('token')
    const { error, data: user }: any = useAuthedQuery('me', () =>
        Http.get('/api/customers/me')
    )

    if(!token) return { error: null, user: null }
    else return { error, user }
}

export default useCurrentUser