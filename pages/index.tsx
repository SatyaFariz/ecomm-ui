import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import ProductListShimmer from '../components/ProductListShimmer'
import Pagination from '../components/Pagination'
import useQuery from '../hooks/useQuery'
import useAuthedQuery from '../hooks/useAuthedQuery'
import qs from 'query-string'
import styles from '../styles/Home.module.css'
import { dehydrate, QueryClient } from 'react-query'
import Link from 'next/link'
import Http from '../libs/http'
import { ReactElement } from 'react'
import { useRouter } from 'next/router'

const graphql = `query search($search_term: String) {
	products(
    search: $search_term
  ) {
    items {
        uid,
        sku,
        name,
        stock_status,
        price_range {
            minimum_price {
                discount {
                    percent_off
                },
                regular_price {
                    value
                },
                final_price {
                    value
                }
            }
        },
        image {
            url
        }
     
    },
    page_info {
        page_size,
        total_pages,
        current_page
    }
  }
}`

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
    const router = useRouter()
    const variables = {
        search_term: router.query.search_term || '',
        page: router.query.page,
        limit: router.query.limit
    }
    const { error, data }: any = useQuery(['product_list_home', variables], () =>
        Http.post('/api/graphql', {
            query: graphql,
            variables
        })
    )

    // console.log(data)

    const { error: userResponseError, data: userResponseData }: any = useAuthedQuery('me', () =>
        Http.get('/api/customers/me')
    )
    
    if (error) return 'An error has occurred: ' + error.message
    return (
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
                <ProductList products={data.data?.products?.items}/>
                {/* <Pagination 
                    pageSize={data.search_criteria?.page_size} 
                    currentPage={data.search_criteria?.current_page}
                    totalCount={data.total_count} 
                /> */}
            </>
            :
            <ProductListShimmer/>
            }
        </div>
    )
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}

export default Home
