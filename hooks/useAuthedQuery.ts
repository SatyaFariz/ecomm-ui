import useQuery from './useQuery'
import { QueryFunction } from 'react-query'
import useLocalStorage from './useLocalStorage'

const useAuthedQuery = (key: any, callback: QueryFunction): any => {
    const [token] = useLocalStorage('token')
    
    const { isLoading, error, data }: any = useQuery(
        key, 
        callback, 
        {
            enabled: token !== null,
            retry: (_, { response: { status }}: any) => {
                if(status === 401) return false
                return true
            }
        }
    )

    return { isLoading, error, data }
}

export default useAuthedQuery