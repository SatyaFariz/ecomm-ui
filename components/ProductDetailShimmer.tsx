import Skeleton from "react-loading-skeleton"
import styles from './ProductDetailShimmer.module.css'
import 'react-loading-skeleton/dist/skeleton.css'

const Shimmer = (props: any) => {
  return (
    <div>
        <div className={styles.imageContainer}>
            <Skeleton className={styles.image}/>
        </div>
        <div className={styles.section}>
            <Skeleton count={2} className={styles.w80}/>
            <Skeleton count={1} className={styles.w30}/>
        </div>
        <div className={styles.section}>
            <Skeleton count={6}/>
        </div>
    </div>
  )
}

export default Shimmer