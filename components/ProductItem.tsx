import Link from 'next/link'
import styles from './ProductItem.module.css'
import Image from 'next/image'

const ProductItem = (props: any) => {
    const { product } = props
    const {
        minimum_price,
        // maximum_price
    } = product.price_range
    return (
        <Link href={`/products/${product.sku}`}>
            <div className={styles.container}>
                {minimum_price.discount.percent_off > 0 &&
                <div className={styles.discountPercentage}>
                    {Math.floor(minimum_price.discount.percent_off)}%
                </div>
                }
                <div className={styles.imageContainer}>
                    <Image 
                        className={styles.image} 
                        src={product?.image?.url}
                        layout="fill"
                        priority={true}
                    />
                </div>

                <p className={styles.name}>{product.name}</p>
                <p className={styles.price}>Rp {product.price_range.minimum_price.final_price.value}</p>
                {minimum_price.discount.percent_off > 0 &&
                <p className={styles.salePrice}>Rp {product.price_range.minimum_price.regular_price.value}</p>
                }
            </div>
        </Link>
    )
  }
  
  export default ProductItem