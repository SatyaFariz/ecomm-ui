import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Layout from '../../components/Layout'

const Product = () => {
    const router = useRouter()
    const { id } = router.query
    const { isLoading, error, data }: any = useQuery(`product_detail_${id}`, () =>
        fetch(`/api/products/${id}`).then(res => res.json())
    )
    
    if (isLoading) return 'Loading...'
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            <img src={`http://192.168.1.101/media/catalog/product${data.media_gallery_entries[0]?.file}`}/>
            <div className="p-5">
                PRODUCT PAGE
            </div>
        </Layout>
    )
}

export default Product
