import styles from './Pagination.module.css'
import { useRouter } from 'next/router'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import Link from 'next/link'
import qs from 'query-string'
import useQueryParams from '../hooks/useQueryParams'

const Pagination = (props: any) => {
    const router = useRouter()
    const query = useQueryParams()
    const currentPage = parseInt(query.page?.toString() || '1')
    const { pageSize, totalCount } = props
    const totalPage = Math.ceil(totalCount / pageSize)

    const prevLink = (): string => {
        const params = { ...query }
        if(currentPage === 2) delete params.page
        else params.page = currentPage - 1

        if(Object.keys(params).length === 0) return router.pathname
        return `${router.pathname}?${qs.stringify(params)}`
    }

    const nextLink = (): string => {
        const params = { ...query }
        params.page = currentPage + 1

        return `${router.pathname}?${qs.stringify(params)}`
    }

    const numberLink = (n: number): string => {
        const params = { ...query }
        if(n === 1) delete params.page
        else params.page = n

        if(Object.keys(params).length === 0) return router.pathname
        return `${router.pathname}?${qs.stringify(params)}`
    }

    const prevButtonDisabled = currentPage.toString() === '1'
    const nextButtonDisabled = currentPage === totalPage

    if(totalPage === 1 || totalCount === 0) return null
    return (
        <div className={styles.container}>
            {prevButtonDisabled ?
            <div className={styles.disabled}>
                <AiOutlineLeft/>
                <span>Prev</span>
            </div>
            :
            <Link href={prevLink()}>
                <a>
                    <div className={styles.button}>
                        <AiOutlineLeft/>
                        <span>Prev</span>
                    </div>
                </a>
            </Link>
            }
            {new Array(totalPage).fill(0).map((_, i) => {
                const n = i + 1
                if(n === currentPage) {
                    return (
                        <div className={styles.active}>
                            {n}
                        </div>
                    )
                }
                return (
                    <Link key={i} passHref={true} href={numberLink(n)}>
                        <a>
                            <div className={styles.button}>
                            {n}
                            </div>
                        </a>
                    </Link>
                )
            })}
            {nextButtonDisabled ?
            <div className={styles.disabled}>
                <span>Next</span>
                <AiOutlineRight/>
            </div>
            :
            <Link href={nextLink()} passHref={true}>
                <div className={styles.button}>
                    <span>Next</span>
                    <AiOutlineRight/>
                </div>
            </Link>
            }
        </div>
    )
}

export default Pagination