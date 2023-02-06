interface BreadCrumb {
  category_uid: string
  category_name: string
}

interface Category {
  uid: string
  name: string,
  url_key?: string,
  children: Category[],
  breadcrumbs?: BreadCrumb[]
}

export default Category