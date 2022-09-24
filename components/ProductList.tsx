import ProductItem from "./ProductItem"
import styles from './ProductList.module.css'

const ProductList = (props: any) => {
    const { products }: any = props
    return (
        <section className={styles.list}>
            {products.map((product: any) =>
                <ProductItem product={product} key={product.uid}/>
            )}
        </section>
    )
}

export default ProductList