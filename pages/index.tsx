import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import ProductListShimmer from '../components/ProductListShimmer'
import Pagination from '../components/Pagination'
import useQuery from '../hooks/useQuery'
import useAuthedQuery from '../hooks/useAuthedQuery'
import getDataFromDehydratedState from '../helpers/getDataFromDehydratedState'
import qs from 'query-string'
import styles from '../styles/Home.module.css'
import { dehydrate, QueryClient } from 'react-query'
import Link from 'next/link'
import Head from 'next/head'
import Http from '../libs/http'
import { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'

import banners from '../mock-data/banners.json'

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

const cmsGraphql = `{
    cmsPage(
      identifier: "home"
    ) {
        meta_title,
        meta_keywords,
        meta_description,
        title
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
        return fetch(`${process.env.BASE_URL}/api/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: graphql,
                variables
            })
        }).then(res => res.json())
    })

    await queryClient.prefetchQuery('page/home', () => {
        return fetch(`${process.env.BASE_URL}/api/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: cmsGraphql,
                variables: {}
            })
        }).then(res => res.json())
    })

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}

const Home = (props: any) => {
    const { dehydratedState } = props
    const [swiperIndex, setSwiperIndex] = useState(1)
    const router = useRouter()
    const [key, variables] = getKeyAndVariablesFromQuery(router.query)

    const productsQueryKey = ['product_list_home', key]
    const { error, data }: any = useQuery(productsQueryKey, () =>
        Http.post('/api/graphql', {
            query: graphql,
            variables
        }),
        {},
        getDataFromDehydratedState(productsQueryKey, dehydratedState)
    )

    const cmsPageQueryKey = 'page/home'
    const { data: cmsData }: any = useQuery(cmsPageQueryKey, () =>
        Http.post('/api/graphql', {
            query: cmsGraphql,
            variables: {}
        }),
        {},
        getDataFromDehydratedState(cmsPageQueryKey, dehydratedState)
    )

    const handleSwipe = (obj: any) => {
        setSwiperIndex(obj.activeIndex + 1)
    }

    const { error: userResponseError, data: userResponseData }: any = useAuthedQuery('me', () =>
        Http.get('/api/customers/me')
    )
    
    if (error) return 'An error has occurred: ' + error.message
    return (
        <>
            <div className={styles.bannersContainer}>
                <Swiper 
                    onSlideChange={handleSwipe}
                    virtual={false}
                    className={styles.image}
                >
                    {banners.map((item: any, i: number) => {
                        return (
                        <SwiperSlide
                            key={i}
                        >
                            <Link href={item.url}>
                                <img
                                    className={styles.image} 
                                    src={item.image}
                                    // layout="fill"
                                    // priority={true}
                                />
                            </Link>
                        </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
            <div className={styles.container}>
                {cmsData &&
                    <Head>
                        <title>{cmsData.data?.cmsPage?.title}</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                        <meta name="description" content={cmsData.data?.cmsPage?.meta_description}/>
                        <meta name="keywords" content={cmsData.data?.cmsPage?.meta_keywords}/>
                    </Head>
                }
                {/*<div className="text-blue-500">
                    <Link href='/sign-up'>
                        Sign Up
                    </Link>
                </div>
                <div className="text-blue-500">
                    <Link href='/sign-in'>
                        Sign In
                    </Link>
            </div>*/}
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
        </>
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
