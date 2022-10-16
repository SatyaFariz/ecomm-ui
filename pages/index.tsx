import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import ProductListShimmer from '../components/ProductListShimmer'
import Pagination from '../components/Pagination'
import useQuery from '../hooks/useQuery'
import useAuthedQuery from '../hooks/useAuthedQuery'
import qs from 'query-string'
import styles from '../styles/Home.module.css'
import { dehydrate, QueryClient, DehydratedState } from 'react-query'
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

const getKeyAndVariablesFromQuery = (query: any): [string, object] => {
    const variables = {
        search_term: query.search_term || '',
        page: query.page,
        limit: query.limit
    }
    const key = qs.stringify(variables)
    return [key, variables]
}

export async function getServerSideProps(context: any) {
    const { query } = context
    const [key, variables] = getKeyAndVariablesFromQuery(query)
    const queryClient = new QueryClient()
  
    await queryClient.prefetchQuery(['product_list_home', key], () => {
        return fetch('http://localhost:3000/api/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: graphql,
                variables
            })
        }).then(async (res: any) => {
            const json = await res.json()
            return json
        })
    })

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
}

const Home = (props: any) => {
    const dehydratedState: DehydratedState = props.dehydratedState
    const router = useRouter()
    const [key, variables] = getKeyAndVariablesFromQuery(router.query)

    const initialData = dehydratedState.queries.find(item => item.queryKey[1] === key)?.state?.data || null

    const { error, data }: any = useQuery(['product_list_home', key], () =>
        Http.post('/api/graphql', {
            query: graphql,
            variables
        }),
        {},
        initialData
    )

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
            {(data) ?
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
