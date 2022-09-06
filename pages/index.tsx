import Layout from '../components/Layout'
import ProductList from '../components/ProductList'
import useQueryParams from '../hooks/useQueryParams'
import useQuery from '../hooks/useQuery'
import qs from 'query-string'

const Home = () => {
    const query = useQueryParams()
    const endpoint: string = `/api/products?${qs.stringify(query)}`

    const { error, data }: any = useQuery(['product_list_home', endpoint], () =>
        fetch(endpoint).then(res => res.json())
    )
    
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <div className="p-5">
                {data ?
                <ProductList products={data.items}/>
                :
                <p>Loading...</p>
                }
            </div>
        </Layout>
    )
}

export default Home
