import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Layout from '../../components/Layout'
import styles from '../../styles/ProductDetail.module.css'
import Http from '../../libs/http'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useState } from 'react'
import Head from 'next/head'

const Product = () => {
    const router = useRouter()
    const [swiperIndex, setSwiperIndex] = useState()
    const { id } = router.query
    console.log(id)
    const { isLoading, error, data }: any = useQuery(`product_detail_${id}`, () =>
        Http.get(`/api/products/${id}`),
        {
            enabled: id !== undefined
        }
    )

    const handleSwipe = (obj: any) => {
        setSwiperIndex(obj.activeIndex)
    }
 
    if (error) return 'An error has occurred: ' + error.message
    return (
        <Layout>
            {data?
            <>  
                <Head>
                    <title>{data.name}</title>
                    <meta name="description" content={data.meta.description} />
                </Head>
                <div className={styles.imageContainer}>
                    <Swiper 
                        onSlideChange={handleSwipe}
                        virtual={false}
                        className={styles.image}
                    >
                        {data.media_gallery_entries.map((item: any, i: number) => {
                            return (
                            <SwiperSlide
                                key={i}
                            >
                                <Image 
                                    className={styles.image} 
                                    src={`http://localhost/media/catalog/product${item.file}`}
                                    layout="fill"
                                    priority={true}
                                />
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
                
                <div className={styles.section}>
                    <p className={styles.name}>{data.name}</p>
                </div>
            </>
            :
            <div>Loading...</div>
            }
        </Layout>
    )
}

export default Product
