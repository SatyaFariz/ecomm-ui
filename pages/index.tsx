import type { NextPage } from 'next'
import { useQuery } from 'react-query'
import Layout from '../components/Layout'
import ProductList from '../components/ProductList'

const Home = () => {
    const { isLoading, error, data }: any = useQuery('product_list_home', () =>
        fetch('/api/products?page=1&limit=10').then(res => res.json())
    )
    
    if (isLoading) return 'Loading...'
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <div className="p-5">
                <ProductList products={data.items}/>
            </div>
        </Layout>
    )
}

export default Home
