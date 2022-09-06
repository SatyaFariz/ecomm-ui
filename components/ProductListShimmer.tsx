import Skeleton from "react-loading-skeleton"
import styles from './ProductListShimmer.module.css'
import 'react-loading-skeleton/dist/skeleton.css'

const ProductList = () => {
    const items = new Array(6).fill(0)
    return (
        <section className={styles.list}>
            {items.map((_: any, index: number) =>
                <div key={index}>
                    <div className={styles.imageContainer}>
                        <Skeleton className={styles.image} containerClassName={styles.image}/>
                    </div>
                    <Skeleton count={2}/>
                </div>
            )}
        </section>
    )
}

export default ProductList