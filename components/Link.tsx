import NextLink from 'next/link'
import { Link as MuiLink } from '@mui/material'
import { forwardRef } from 'react'

const Link = (props: any, ref: any)=>{
    const { href } = props;
    return (
        <NextLink href={href} passHref >
            <MuiLink ref={ref} color="inherit" underline="none" {...props}/>
        </NextLink>
    )
}

export default forwardRef(Link)