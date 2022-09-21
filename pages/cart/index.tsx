import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query'
import type { ReactElement, ReactNode, MutableRefObject } from 'react'
import type { NextPage } from 'next'
import Layout from '../../components/Layout'
import styles from '../../styles/Cart.module.css'
import useIsMounted from '../../hooks/useIsMounted'
import useQuery from '../../hooks/useQuery'
import http from '../../libs/http'
import CartItem from '../../components/CartItem'

function Cart(props: AppProps) {
    const isMounted: MutableRefObject<boolean> = useIsMounted()
    const cartId = isMounted.current && window.localStorage.getItem('cart_id')
    const token = isMounted.current && window.localStorage.getItem('token')

    const { error, data: cartItems }: any = useQuery('cart/items', () =>
        {
            if(token) {
                return http.get(`/api/carts/items`)
            }

            return http.get(`/api/guest-carts/${cartId}/items`)
        },
        {
            enabled: !!token || !!cartId,
            refetchOnWindowFocus: false
        }
    )

    console.log(cartItems)
    return (
        <>
            {cartItems?
            <div>
                {cartItems.map((item: any, i: number) =>
                    <CartItem item={item} key={i}/>
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
