import { ReactElement, useState } from 'react'
import Layout from '../components/Layout'

const CategoryPage = (props: any) => {
  return (
    <div>
      
    </div>
  )
}

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default CategoryPage