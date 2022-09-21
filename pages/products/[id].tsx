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

const Product = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [swiperIndex, setSwiperIndex] = useState()
    const { id } = router.query
    const [token] = useLocalStorage('token')

    const { isLoading, error, data }: any = useQuery(`product_detail_${id}`, () =>
        Http.get(`/api/products/${id}`),
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
        setSwiperIndex(obj.activeIndex)
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
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <>
            {data?
            <>  
                <Head>
                    <title>{data.name}</title>
                    <meta name="description" content={data.meta.description} />
                </Head>
                <div className={styles.imageContainer}>
                    <Swiper 
                        onSlideChange={handleSwipe}
                        virtual={false}
                        className={styles.image}
                    >
                        {data.media_gallery_entries.map((item: any, i: number) => {
                            return (
                            <SwiperSlide
                                key={i}
                            >
                                <Image 
                                    className={styles.image} 
                                    src={`http://localhost/media/catalog/product${item.file}`}
                                    layout="fill"
                                    priority={true}
                                />
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
                
                <div className={styles.section}>
                    <p className={styles.name}>{data.name}</p>
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
