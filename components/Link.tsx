import NextLink from 'next/link'
import { Link as MuiLink } from '@mui/material'
import { forwardRef } from 'react'

const Link = forwardRef((props: any, ref: any)=>{
    const { href } = props;
    return (
        <NextLink href={href} passHref >
            <MuiLink ref={ref} {...props}/>
        </NextLink>
    )
})

export default Link