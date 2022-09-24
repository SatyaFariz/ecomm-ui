import styles from './CartItem.module.css'
import Image from 'next/image'
import { AiOutlineDelete, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import IconButton from '@mui/material/IconButton'
import { useMutation, useQueryClient } from 'react-query'
import http from '../libs/http'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'
import useLocalStorage from '../hooks/useLocalStorage'

const CartItem = (props: any) => {
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const { item } = props
    const [qty, setQty] = useState(item.quantity)
    const isMounted = useIsMounted()
    const [cartId] = useLocalStorage('cart_id')
    const [token] = useLocalStorage('token')
    
    const qtyMutation = useMutation((qty: number) => {
        if(token) return http.put(`/api/carts/items/${item.id}`, { qty })

        return http.put(`/api/guest-carts/${cartId}/items/${item.id}`, { qty })
    })

    const deleteItem = () => {
        setLoading(true)
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                queryClient.invalidateQueries('cart/totals')
                queryClient.invalidateQueries('cart/items')
            },
            onError: (error: any) => {
                alert(error.response.data.message)
            },
            onSettled: () => {
                if(isMounted.current) setLoading(false)
            }
        })
    }

    const debouncedQty = useDebouncedCallback(
        // function
        (value: number) => {
            if(value === 0) {
                deleteItem()
            } else {
                if(isMounted.current) setLoading(true)
                qtyMutation.mutate(value, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('cart/totals')
                        queryClient.invalidateQueries('cart/items')
                    },
                    onError: (error: any) => {
                        alert(error.response.data.message)
                    },
                    onSettled: () => {
                        if(isMounted.current) setLoading(false)
                    }
                })
            }
        },
        // delay in ms
        500
    )

    const deleteMutation = useMutation(() => {
        if(token) return http.delete(`/api/carts/items/${item.id}`)

        return http.delete(`/api/guest-carts/${cartId}/items/${item.id}`)
    })

    const onMinusButtonClick = () => {
        setQty((prev: number) => {
            const qty = Math.max(prev - 1, 0)
            debouncedQty(qty)
            return qty
        })
    }

    const onPlusButtonClick = () => {
        setQty((prev: number) => {
            const qty = Math.min(prev + 1, 99)
            debouncedQty(qty)
            return qty
        })
    }

    useEffect(() => {

    })

    return (
        <>
        <div className={styles.container}>
            <div className={styles.productCols}>
                <div className={styles.imageContainer}>
                    <Image 
                        className={styles.image} 
                        src={item.product.image.url}
                        layout="fill"
                        priority={true}
                    />
                </div>

                <div>
                    <p className={styles.name}>{item.product.name}</p>
                    <p className={styles.price}>Rp {item.prices.price.value}</p>
                    {item.product.stock_status === 'OUT_OF_STOCK' &&
                    <p className={styles.outOfStock}>OUT OF STOCK</p>
                    }
                </div>
            </div>

            <div className={styles.actionButtons}>
                <div className={styles.qtyButtons}>
                    <IconButton 
                        onClick={onMinusButtonClick}
                        disabled={loading}
                    >
                        <AiOutlineMinusCircle className={styles.icon}/>
                    </IconButton>

                    <div className={styles.qty}>{qty}</div>

                    <IconButton 
                        onClick={onPlusButtonClick}
                        disabled={loading}
                    >
                        <AiOutlinePlusCircle className={styles.icon}/>
                    </IconButton>
                </div>

                <IconButton 
                    onClick={deleteItem}
                    disabled={loading}
                >
                    <AiOutlineDelete className={styles.icon}/>
                </IconButton>
            </div>
        </div>
        <hr className={styles.divider}/>
        </>
    )
}
  
export default CartItem