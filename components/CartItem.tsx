import styles from './CartItem.module.css'
import Image from 'next/image'
import { AiOutlineDelete, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import IconButton from '@mui/material/IconButton'
import { useMutation, useQueryClient } from 'react-query'
import http from '../libs/http'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'

const CartItem = (props: any) => {
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const { item } = props
    const [qty, setQty] = useState(item.qty)
    const isMounted = useIsMounted()
    
    const qtyMutation = useMutation((qty: number) => {
        return http.put(`/api/carts/items/${item.item_id}`, { qty })
    })

    const debouncedQty = useDebouncedCallback(
        // function
        (value: number) => {
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
        },
        // delay in ms
        500
    )

    const deleteMutation = useMutation(() => {
        return http.delete(`/api/carts/items/${item.item_id}`)
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

    const onMinusButtonClick = () => {
        setQty((prev: number) => {
            const qty = prev - 1
            debouncedQty(qty)
            return qty
        })
    }

    const onPlusButtonClick = () => {
        setQty((prev: number) => {
            const qty = prev + 1
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
                        src={`http://localhost/media/catalog/product${'/k/m/kmr112-4.jpeg'}`}
                        layout="fill"
                        priority={true}
                    />
                </div>

                <div>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.price}>Rp {item.price}</p>
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