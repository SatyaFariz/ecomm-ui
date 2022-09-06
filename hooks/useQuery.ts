import { useState, useEffect } from 'react'
import { useQuery, QueryFunction } from 'react-query'

const useCustomQuery = (key: any, callback: QueryFunction): any => {
    const [data, setData] = useState(null)

    const { isLoading, error, data: responseData }: any = useQuery(key, callback)

    useEffect(() => {
        if(responseData) {
            setData(responseData)
        }
    }, [responseData])
    return { isLoading, error, data }
}

export default useCustomQuery