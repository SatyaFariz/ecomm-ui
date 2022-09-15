import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Layout from '../../components/Layout'
import styles from '../../styles/ProductDetail.module.css'
import Http from '../../libs/http'

const Product = () => {
    const router = useRouter()
    const { id } = router.query
    const { isLoading, error, data }: any = useQuery(`product_detail_${id}`, () =>
        Http.get(`/api/products/${id}`)
    )
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            {isLoading ?
            <p>Loading...</p>
            :
            <>
                <img src={`http://localhost/media/catalog/product${data.media_gallery_entries[0]?.file}`}/>
                <div className={styles.section}>
                    <p className={styles.name}>{data.name}</p>
                </div>
            </>
            }
        </Layout>
    )
}

export default Product
