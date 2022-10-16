import { useState, useEffect } from 'react'
import { useQuery, QueryFunction, UseBaseQueryOptions } from 'react-query'

const useCustomQuery = (key: any, callback: QueryFunction, options?: UseBaseQueryOptions, initialData?: any): any => {
    const [data, setData] = useState(initialData || null)

    const { isLoading, error, data: responseData }: any = useQuery(key, callback, options)

    useEffect(() => {
        if(responseData) {
            setData(responseData)
        }
    }, [responseData])
    return { isLoading, error, data }
}

export default useCustomQuery