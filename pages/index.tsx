import type { NextPage } from 'next'
import Layout from '../components/Layout'
import ProductList from '../components/ProductList'

const Home: NextPage = () => {
  return (
    <Layout>
        <ProductList/>
    </Layout>
  )
}

export default Home
