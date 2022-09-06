import { useRef, useEffect, MutableRefObject } from 'react'
import { useRouter } from 'next/router'
import qs from 'query-string'

interface QueryParams {
    search_query?: string
    page?: number
    limit?: number
}

const useQueryParams = (): QueryParams => {
    const defaultPage = '1'
    const defaultLimit = '10'
    const { asPath } = useRouter()
    const query = qs.parse(asPath.split('?')[1] || '')
    if(query.page) {
        const page: number = parseInt((query.page as string) || defaultPage)
        if(isNaN(page)) delete query.page
    }

    if(query.limit) {
        const limit: number = parseInt((query.page as string) || defaultLimit)
        if(isNaN(limit)) delete query.limit
    }

    return query
}

export default useQueryParams