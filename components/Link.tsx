import NextLink from 'next/link'
import { Link as MuiLink } from '@mui/material'
import { forwardRef } from 'react'
import styles from './Link.module.css'

const Link = forwardRef((props: any, ref: any)=>{
    const { href } = props;
    return (
        <NextLink href={href} passHref >
            <MuiLink ref={ref} className={styles.link} color="inherit" underline="none" {...props}/>
        </NextLink>
    )
})

export default Link