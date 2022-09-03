import styles from './ProductItem.module.css'

const ProductItem = (props: any) => {
    const { product } = props
    return (
        <div>
            <img src={`http://192.168.1.101/media/catalog/product${product.media_gallery_entries[0]?.file}`}/>
            <p className={styles.name}>{product.name}</p>
            <p className={styles.price}>Rp {product.sale?.price || product.price}</p>
            {product.sale &&
            <p className={styles.salePrice}>Rp {product.price}</p>
            }
        </div>
    )
  }
  
  export default ProductItem