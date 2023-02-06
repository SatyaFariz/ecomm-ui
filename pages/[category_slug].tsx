import { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import qs from 'query-string'
import { dehydrate, QueryClient } from 'react-query'
import getDataFromDehydratedState from '../helpers/getDataFromDehydratedState'
import BreadCrumb from '../components/BreadCrumb'

const productQuery = `query search($search_term: String, $page: Int, $category_uid: String!) {
	products(
    filter: {
      category_uid: {
        eq: $category_uid
      }
    },
    search: $search_term,
    pageSize: 8,
    currentPage: $page
  ) {
    items {
        uid,
        sku,
        name,
        stock_status,
        price_range {
            minimum_price {
                discount {
                    percent_off
                },
                regular_price {
                    value
                },
                final_price {
                    value
                }
            }
        },
        image {
            url,
            label
        }
     
    },
    page_info {
        page_size,
        total_pages,
        current_page
    }
  }
}`

const categoriesQuery = `query categoryList($slug: String!) {
  categoryList(filters: {
    url_key: {
      eq: $slug
    }
  }) {
    uid,
    url_key,
    name
    breadcrumbs {
      category_url_key,
      category_uid,
      category_name
    }
  }
}`

const getKeyAndVariablesFromQuery = (category_uid: string, query: any): [string, object] => {
  const variables = {
      search_term: query.search_term || '',
      page: parseInt(query.page || '1'),
      limit: query.limit,
      category_uid
  }
  const key = qs.stringify(variables)
  return [key, variables]
}

export async function getServerSideProps(context: any) {
  const { query } = context
  const queryClient = new QueryClient()

  const categoriesPromise = fetch(`${process.env.BASE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query: categoriesQuery,
          variables: {
            slug: query.category_slug
          }
      })
  }).then(res => res.json())
  
  await queryClient.prefetchQuery(['category', query.category_slug], () => {
    return categoriesPromise
  })

  const categoriesResponse = await categoriesPromise

  const category = categoriesResponse.data.categoryList[0]

  if(category) {
    const [key, variables] = getKeyAndVariablesFromQuery(category.uid, query)
    await queryClient.prefetchQuery(key, () => {
      return fetch(`${process.env.BASE_URL}/api/graphql`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              query: productQuery,
              variables
          })
      }).then(res => res.json())
    })
  }

  return {
    props: {
        dehydratedState: dehydrate(queryClient),
    },
  }
}

const CategoryPage = (props: any) => {
  const { dehydratedState } = props
  const router = useRouter()
  const { category_slug } = router.query
  const categoriesData = getDataFromDehydratedState(['category', category_slug], dehydratedState)
  const category = categoriesData.data.categoryList[0]

  if(!category) return null
  return (
    <div>
      <BreadCrumb
        category={category}
        lastItemActive={true}
      />
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