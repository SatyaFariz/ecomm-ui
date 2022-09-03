import type { NextPage } from 'next'
import { useQuery } from 'react-query'
import Layout from '../components/Layout'
import ProductList from '../components/ProductList'

const Home = () => {
    const { isLoading, error, data }: any = useQuery('repoData', () =>
        fetch('/api/products?page=1&limit=10').then(res => res.json())
    )
    console.log(data)
    if (isLoading) return 'Loading...'
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <ProductList products={data.items}/>
        </Layout>
    )
}

export default Home
