import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import Layout from '../../components/Layout'


function Cart(props: AppProps) {
  return (
    <div>Cart</div>
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
