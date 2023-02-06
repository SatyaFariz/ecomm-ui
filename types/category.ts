interface Category {
  uid: string
  name: string,
  url_key?: string,
  children: Category[]
}

export default Category