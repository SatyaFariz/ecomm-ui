import Link from './Link'
import styles from './ProductItem.module.css'
import Image from 'next/image'
import formatCurrency from '../helpers/formatCurrency'

const ProductItem = (props: any) => {
    const { product } = props
    const name = product.name?.trim()
    const alt = product?.image?.label?.trim()
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
                        alt={alt?.length > 0 ? alt : name}
                    />
                    {product.stock_status === 'OUT_OF_STOCK' &&
                    <div className={styles.outOfStock}>OUT OF STOCK</div>
                    }
                </div>

                <p className={styles.name}>{name}</p>
                {minimum_price.discount.percent_off > 0 &&
                <p className={styles.salePrice}>{formatCurrency(product.price_range.minimum_price.regular_price.value)}</p>
                }
                <p className={styles.price}>{formatCurrency(product.price_range.minimum_price.final_price.value)}</p>
            </div>
        </Link>
    )
  }
  
  export default ProductItem