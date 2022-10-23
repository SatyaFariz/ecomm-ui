import { DehydratedState } from 'react-query'

const getDataFromDehydratedState = (key: string | object, dehydratedState: DehydratedState): any => {
    return dehydratedState.queries
        .find(item => {
            if(typeof key === 'string') return item.queryKey === key
            
            return JSON.stringify(item.queryKey) === JSON.stringify(key)
        })?.state?.data || null
}

export default getDataFromDehydratedState