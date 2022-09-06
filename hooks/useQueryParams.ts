import { useRef, useEffect, MutableRefObject } from 'react'
import { useRouter } from 'next/router'
import qs from 'query-string'

interface QueryParams {
    search_query?: string
    page?: number
    limit?: number
}

const useIsMounted = (): QueryParams => {
    const { asPath } = useRouter()
    const query = qs.parse(asPath.split('?')[1] || '')
    return query
}

export default useIsMounted