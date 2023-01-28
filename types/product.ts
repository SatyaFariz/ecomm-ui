interface Attribute {
  uid?: string
}

interface Variant {
  attributes?: Attribute[]
  products?: Product[]
}

interface Product {
  __typename?: string
  uid?: string
  name?: string
  sku?: string
  meta_title?: string
  meta_keyword?: string
  meta_description?: string
  only_x_left_in_stock?: number
  categories?: any
  price_range?: any
  media_gallery?: any
  stock_status?: string
  short_description?: any
  variants?: Variant[]
}

export default Product