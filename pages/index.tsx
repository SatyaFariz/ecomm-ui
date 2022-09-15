import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import ProductListShimmer from '../components/ProductListShimmer'
import Pagination from '../components/Pagination'
import useQueryParams from '../hooks/useQueryParams'
import useQuery from '../hooks/useQuery'
import qs from 'query-string'
import styles from '../styles/Home.module.css'
import { dehydrate, QueryClient } from 'react-query'
import Link from 'next/link'
import Http from '../libs/http'

export async function getServerSideProps(context: any) {
    const { query } = context
    const endpoint: string = `http://localhost:3000/api/products?${qs.stringify(query)}`
    const queryClient = new QueryClient()
  
    await queryClient.prefetchQuery(['product_list_home', endpoint], () => {
        return fetch(endpoint).then(res => res.json())
    })

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
}

const Home = () => {
    const query = useQueryParams()
    const endpoint: string = `/api/products?${qs.stringify(query)}`

    const { error, data }: any = useQuery(['product_list_home', endpoint], () =>
        Http.get(endpoint)
    )
    
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <div className={styles.container}>
                <div className="text-blue-500">
                    <Link href='/sign-up'>
                        Sign Up
                    </Link>
                </div>
                <div className="text-blue-500">
                    <Link href='/sign-in'>
                        Sign In
                    </Link>
                </div>
                {data ?
                <>
                    <ProductList products={data.items}/>
                    <Pagination 
                        pageSize={data.search_criteria?.page_size} 
                        currentPage={data.search_criteria?.current_page}
                        totalCount={data.total_count} 
                    />
                </>
                :
                <ProductListShimmer/>
                }
            </div>
        </Layout>
    )
}

export default Home
