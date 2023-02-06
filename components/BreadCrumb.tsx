import styles from './BreadCrumb.module.css'
import { Fragment } from 'react'
import Category from '../types/category'
import Link from './Link'

const BreadCrumb = (props: any) => {
    const category: Category = props.category
    const { lastItemActive } = props
    return (
        <div className={styles.container}>
            <Link href='/'>
              <div className={styles.text}>Home</div>
            </Link>
            <div className={styles.text}>/</div>
            
            {category.breadcrumbs?.map((item: any) =>
                <Fragment key={item.category_uid}>
                    <Link href={`/${item.category_url_key}`}>
                      <div className={styles.text}>{item.category_name?.trim()}</div>
                    </Link>
                    <div className={styles.text}>/</div>
                </Fragment>
            )}
            {lastItemActive ?
            <div className={styles.textActive}>{category.name.trim()}</div>
            :
            <Link href={`/${category.url_key}`}>
              <div className={styles.text}>{category.name.trim()}</div>
            </Link>
            }
        </div>
    )
}
  
export default BreadCrumb