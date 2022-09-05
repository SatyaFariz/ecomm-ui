import Link from 'next/link'
import styles from './ProductItem.module.css'

const ProductItem = (props: any) => {
    const { product } = props
    return (
        <Link href={`/products/${product.sku}`}>
            <div className={styles.container}>
                {product.sale &&
                <div className={styles.discountPercentage}>
                    {product.sale.discount_percentage}%
                </div>
                }
                <img src={`http://localhost/media/catalog/product${product.media_gallery_entries[0]?.file}`}/>
                <p className={styles.name}>{product.name}</p>
                <p className={styles.price}>Rp {product.sale?.price || product.price}</p>
                {product.sale &&
                <p className={styles.salePrice}>Rp {product.price}</p>
                }
            </div>
        </Link>
    )
  }
  
  export default ProductItem