import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query'
import type { ReactElement, ReactNode, MutableRefObject } from 'react'
import type { NextPage } from 'next'
import Layout from '../../components/Layout'
import styles from '../../styles/Cart.module.css'
import useIsMounted from '../../hooks/useIsMounted'
import useLocalStorage from '../../hooks/useLocalStorage'
import useQuery from '../../hooks/useQuery'
import http from '../../libs/http'
import CartItem from '../../components/CartItem'

const guestQuery = `query cart($cart_id: String!) {
    cart(
        cart_id: $cart_id
    ) {
        items {
            id,
            uid,
            quantity,
            prices {
                price {
                    value
                },
                row_total {
                    currency
                    value
                },
            },
            product {
                name,
                sku,
                stock_status,
                image {
                    url
                }
            }
        },
        prices {
            grand_total {
              value
            }
        }
    }
}`

const customerQuery = `query {
    customerCart {
        items {
            id,
            uid,
            quantity,
            prices {
                price {
                    value
                },
                row_total {
                    currency
                    value
                },
            },
            product {
                name,
                sku,
                stock_status,
                image {
                    url
                }
            }
        },
        prices {
            grand_total {
              value
            }
        }
    }
}`

function Cart(props: AppProps) {
    const isMounted: MutableRefObject<boolean> = useIsMounted()
    const [cartId] = useLocalStorage('cart_id')
    const [token] = useLocalStorage('token')

    const cartItems = []

    const { error, data }: any = useQuery('cart/items', () =>
        {
            if(token) {
                return http.post(
                    `/api/graphql`,
                    {
                        query: customerQuery
                    }
                )
            }

            return http.post(
                `/api/graphql`,
                {
                    query: guestQuery,
                    variables: { cart_id: cartId }
                }
            )
        },
        {
            enabled: !!token || !!cartId,
            refetchOnWindowFocus: false
        }
    )

    console.log(data)

    return (
        <>
            {data?
            <div className={styles.container}>
                {data.data[token ? 'customerCart' : 'cart'].items.map((item: any) =>
                    <CartItem item={item} key={`${item.id}_${item.quantity}`}/>
                )}
            </div>
            :
            <div>Loading...</div>
            }
        </>
    )
}

Cart.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}

export default Cart
