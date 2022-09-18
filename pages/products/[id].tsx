import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Layout from '../../components/Layout'
import styles from '../../styles/ProductDetail.module.css'
import Http from '../../libs/http'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const Product = () => {
    const router = useRouter()
    const { id } = router.query
    const { isLoading, error, data }: any = useQuery(`product_detail_${id}`, () =>
        Http.get(`/api/products/${id}`)
    )

    const handleSwipe = () => {

    }
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            {isLoading ?
            <p>Loading...</p>
            :
            <>  
                <div className={styles.imageContainer}>
                    {/* <img src={`http://localhost/media/catalog/product${data.media_gallery_entries[0]?.file}`}/> */}
                    <Swiper 
                        onSlideChange={handleSwipe}
                        virtual={false}
                        style={{ zIndex: 0 }}
                        className={styles.image}
                    >
                        {data.media_gallery_entries.map((item: any, i: number) => {
                            return (
                            <SwiperSlide
                                key={i}
                            >
                                <div style={{
                                position: 'relative',
                                width: '100vw',
                                paddingBottom: '100%'
                                }}>
                                <img
                                    src={`http://localhost/media/catalog/product${item.file}`}
                                    alt={`product.name ${i}`}
                                    style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: '100%',
                                    left: 0,
                                    bottom: 0,
                                    objectFit: 'cover'
                                    }}
                                />
                                </div>
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
                
                <div className={styles.section}>
                    <p className={styles.name}>{data.name}</p>
                </div>
            </>
            }
        </Layout>
    )
}

export default Product
