import { useQuery } from 'react-query'
import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import useQueryParams from '../hooks/useQueryParams'
import qs from 'query-string'

const Home = () => {
    const query = useQueryParams()
    const endpoint: string = `/api/products?${qs.stringify(query)}`

    const { isLoading, error, data }: any = useQuery(['product_list_home', endpoint], () =>
        fetch(endpoint).then(res => res.json())
    )
    
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <div className="p-5">
                {isLoading ?
                <p>Loading...</p>
                :
                <ProductList products={data.items}/>
                }
            </div>
        </Layout>
    )
}

export default Home
