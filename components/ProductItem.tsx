

const ProductItem = (props: any) => {
    const { product } = props
    return (
        <div>
            <p>{product.id}</p>
        </div>
    )
  }
  
  export default ProductItem