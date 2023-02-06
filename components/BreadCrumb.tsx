import styles from './BreadCrumb.module.css'
import { Fragment } from 'react'
import Category from '../types/category'

const BreadCrumb = (props: any) => {
    const category: Category = props.category
    return (
        <div className={styles.container}>
            {category.breadcrumbs?.map((item: any) =>
                <Fragment key={item.category_uid}>
                    <div>{item.category_name?.trim()}</div>
                    <div>/</div>
                </Fragment>
            )}
            <div>{category.name.trim()}</div>
        </div>
    )
}
  
export default BreadCrumb