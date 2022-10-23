import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import Layout from '../../components/Layout'
import styles from '../../styles/ProductDetail.module.css'
import Http from '../../libs/http'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useState, ReactElement, Fragment } from 'react'
import { useMutation, dehydrate, QueryClient } from 'react-query'
import useLocalStorage from '../../hooks/useLocalStorage'
import useIsMounted from '../../hooks/useIsMounted'
import useQuery from '../../hooks/useQuery'
import Head from 'next/head'
import Button from '../../components/Button'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import IconButton from '@mui/material/IconButton'
import ProductDetailShimmer from '../../components/ProductDetailShimmer'

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
            only_x_left_in_stock,
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
            },
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
            short_description {
                html
            }
        }
    }
}`

export async function getServerSideProps(context: any) {
    const { id } = context.query
    const key = `product_detail_${id}`
    const queryClient = new QueryClient()
  
    await queryClient.prefetchQuery(key, () => {
        return fetch(`${process.env.BASE_URL}/api/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: productQuery,
                variables: { id }
            })
        }).then(res => res.json())
    })

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}

const Product = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [swiperIndex, setSwiperIndex] = useState(1)
    const [loading, setLoading] = useState(false)
    const isMounted = useIsMounted()
    const [qty, setQty] = useState(1)
    const { id } = router.query
    const [token] = useLocalStorage('token')
    const [cartId, setCartId] = useLocalStorage('cart_id')

    const queryKey = `product_detail_${id}`

    const { error, data }: any = useQuery(queryKey, () =>
        Http.post(`/api/graphql`, {
            query: productQuery,
            variables: { id }
        }),
        {
            enabled: id !== undefined
        }
    )

    const products = data?.data?.products?.items
    const product = products && products[0]
    const category = product?.categories && product.categories[product.categories.length - 1]
    const minimum_price = product?.price_range?.minimum_price

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
        setLoading(true)
        if(!cartId) {
            const newCartId = await Http.post('/api/guest-carts')
            setCartId(newCartId)
        }

        const body = {
            cartId,
            sku: product.sku,
            qty
        }
        mutation.mutate(body, {
            onSuccess: () => {
                queryClient.invalidateQueries('cart/totals')
            },
            onError: (error: any) => {
                alert(error.response.data.message)
            },
            onSettled: () => {
                if(isMounted) setLoading(false)
            }
        })

    }
 
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
                            <Fragment key={item.category_uid}>
                                <div>{item.category_name}</div>
                                <div>/</div>
                            </Fragment>
                        )}
                        <div>{category.name}</div>
                    </div>
                    }
                    <p className={styles.name}>{product.name}</p>
                    {minimum_price.discount.percent_off > 0 &&
                    <p className={styles.discountPrice}>Rp {product.price_range.minimum_price.regular_price.value}</p>
                    }
                    <div className={styles.price}>
                        <p className={styles.finalPrice}>Rp {product.price_range.minimum_price.final_price.value}</p>
                        {minimum_price.discount.percent_off > 0 &&
                        <div className={styles.percentOff}>{Math.floor(minimum_price.discount.percent_off)}% Off</div>
                        }

                        {product.stock_status === 'OUT_OF_STOCK' &&
                        <div className={styles.outOfStock}>Out of stock</div>
                        }
                    </div>

                    {product.only_x_left_in_stock &&
                    <p className={styles.stockThreshold}>Only {product.only_x_left_in_stock} left in stock</p>
                    }
                    
                    <hr className={styles.divider}/>

                    <div className={styles.description}>
                        {product.short_description?.html}
                    </div>
                </div>

                <hr className={styles.sectionDivider}/>

                <div className={styles.addToCartSection}>
                    <div className={styles.qtyContainer}>
                        <div className={styles.sectionTitle}>Quantity</div>

                        <div className={styles.qtyButtons}>
                            <IconButton 
                                onClick={() => setQty(prev => prev - 1)}
                                disabled={loading}
                            >
                                <AiOutlineMinusCircle className={styles.icon}/>
                            </IconButton>

                            <div className={styles.qty}>{qty}</div>

                            <IconButton 
                                onClick={() => setQty(prev => prev + 1)}
                                disabled={loading}
                            >
                                <AiOutlinePlusCircle className={styles.icon}/>
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className={styles.stickyButton}>
                    <Button 
                        variant="contained"
                        fullWidth={true}
                        loading={loading}
                        onClick={addToCart}
                    >
                        Add to Cart
                    </Button>
                </div>

                <hr className={styles.sectionDivider}/>
            </>
            :
            <ProductDetailShimmer/>
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
