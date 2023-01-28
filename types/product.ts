type Typename = 'ConfigurableProduct' | 'SimpleProduct'
type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK'

interface Attribute {
  uid?: string
}

export interface MediaGallery {
  disabled?: boolean
  url?: string
  label?: string
}

interface Description {
  html: string
}

interface Variant {
  attributes?: Attribute[]
  product?: Product
}

interface ConfigurableOption {
  uid?: string
  label?: string
  values?: ConfigurableOptionValue[]
}

interface ConfigurableOptionValue {
  uid?: string
  label?: string
}

interface Product {
  __typename?: Typename
  uid?: string
  name?: string
  sku?: string
  meta_title?: string
  meta_keyword?: string
  meta_description?: string
  only_x_left_in_stock?: number
  categories?: any
  price_range?: any
  media_gallery?: MediaGallery[]
  stock_status?: StockStatus
  short_description: Description
  variants?: Variant[]
  configurable_options?: ConfigurableOption[]
}

export default Product