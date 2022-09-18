import { useState, useEffect } from 'react'
import { useQuery, QueryFunction, UseBaseQueryOptions } from 'react-query'

const useCustomQuery = (key: any, callback: QueryFunction, options?: UseBaseQueryOptions): any => {
    const [data, setData] = useState(null)

    const { isLoading, error, data: responseData }: any = useQuery(key, callback, options)

    useEffect(() => {
        if(responseData) {
            setData(responseData)
        }
    }, [responseData])
    return { isLoading, error, data }
}

export default useCustomQuery