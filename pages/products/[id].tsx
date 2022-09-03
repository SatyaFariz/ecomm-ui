import type { NextPage } from 'next'
import { useQuery } from 'react-query'
import Layout from '../../components/Layout'

const Product = () => {
    const { isLoading, error, data }: any = useQuery('repoData', () =>
        fetch('/api/products?page=1&limit=10').then(res => res.json())
    )
    console.log(data)
    if (isLoading) return 'Loading...'
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <div className="p-5">
                PRODUCT PAGE
            </div>
        </Layout>
    )
}

export default Product
