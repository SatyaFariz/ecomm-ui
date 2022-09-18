import useQuery from './useQuery'
import { QueryFunction } from 'react-query'
import useIsMounted from './useIsMounted'

const useAuthedQuery = (key: any, callback: QueryFunction): any => {
    const isMounted = useIsMounted()
    const token = isMounted ? window.localStorage.getItem('token') : null
    
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