import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import Layout from '../../components/Layout'
import styles from '../../styles/ProductDetail.module.css'
import Http from '../../libs/http'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useState, ReactElement } from 'react'
import { useMutation } from 'react-query'
import useLocalStorage from '../../hooks/useLocalStorage'
import useQuery from '../../hooks/useQuery'
import Head from 'next/head'

const productQuery = `query productDetails($id: String!) {
	products(
        filter: {
            sku: {
                eq: $id
            }
        }
    ) {
        items {
            sku,
            name,
            stock_status,
            media_gallery {
                url
            },
            categories {
                level,
                uid,
                name,
                path,
                breadcrumbs {
                    category_level,
                    category_uid,
                    category_name
                }
            }
        }
    }
}`

const Product = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [swiperIndex, setSwiperIndex] = useState(1)
    const { id } = router.query
    const [token] = useLocalStorage('token')

    const { isLoading, error, data }: any = useQuery(`product_detail_${id}`, () =>
        Http.post(`/api/graphql`, {
            query: productQuery,
            variables: { id }
        }),
        {
            enabled: id !== undefined
        }
    )
    const mutation = useMutation((data: any) => {
        const cartItem = {
            qty: data.qty,
            sku: data.sku
        }
        if(token) return Http.post(`/api/carts/items`, cartItem)
        return Http.post(`/api/guest-carts/${data.cartId}/items`, cartItem)
    })

    const handleSwipe = (obj: any) => {
        setSwiperIndex(obj.activeIndex + 1)
    }

    const addToCart = async () => {
        let cartId = window.localStorage.getItem('cart_id')
        if(!cartId) {
            cartId = await Http.post('/api/guest-carts')
            window.localStorage.setItem('cart_id', cartId as string)
        }

        const body = {
            cartId,
            sku: data.sku,
            qty: 1
        }
        mutation.mutate(body, {
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries('cart/totals')
            },
            onError: (error: any) => {
                alert(error.response.data.message)
            }
        })

    }

    const products = data?.data?.products?.items
    const product = products && products[0]
    const category = product?.categories && product.categories[product.categories.length - 1]
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <>
            {product?
            <>  
                <Head>
                    <title>{product.name}</title>
                    <meta name="description" content={product.meta?.description} />
                </Head>
                <div className={styles.imageContainer}>
                    <Swiper 
                        onSlideChange={handleSwipe}
                        virtual={false}
                        className={styles.image}
                    >
                        {product.media_gallery.map((item: any, i: number) => {
                            return (
                            <SwiperSlide
                                key={i}
                            >
                                <Image 
                                    className={styles.image} 
                                    src={item.url}
                                    layout="fill"
                                    priority={true}
                                />
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                    
                    {product.media_gallery.length > 1 &&
                    <div className={styles.swipeIndicator}>
                        {swiperIndex}/{product.media_gallery.length}
                    </div>
                    }
                </div>
                
                <div className={styles.section}>
                    {category &&
                    <div className={styles.breadcrumbs}>
                        {category.breadcrumbs.map((item: any) =>
                            <>
                                <div key={item.category_uid}>{item.category_name}</div>
                                <div key={`${item.category_uid}_`}>/</div>
                            </>
                        )}
                        <div>{category.name}</div>
                    </div>
                    }
                    <p className={styles.name}>{product.name}</p>
                </div>

                <button onClick={addToCart}>Add To Cart</button>
            </>
            :
            <div>Loading...</div>
            }
        </>
    )
}

Product.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}

export default Product
