import styles from './CartItem.module.css'
import Image from 'next/image'

const CartItem = (props: any) => {
    const { item } = props
    return (
        <div className={styles.container}>
            <div className={styles.productCols}>
                <div className={styles.imageContainer}>
                    <Image 
                        className={styles.image} 
                        src={`http://localhost/media/catalog/product${'/k/m/kmr112-4.jpeg'}`}
                        layout="fill"
                        priority={true}
                    />
                </div>

                <div>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.price}>Rp {item.price}</p>
                </div>
            </div>
        </div>
    )
}
  
export default CartItem