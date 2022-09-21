import styles from './CartItem.module.css'
import Image from 'next/image'
import { AiOutlineDelete, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import IconButton from '@mui/material/IconButton'
import { useMutation, useQueryClient } from 'react-query'
import http from '../libs/http'
import { useState } from 'react'

const CartItem = (props: any) => {
    const queryClient = useQueryClient()
    const { item } = props
    const [qty, setQty] = useState(item.qty)
    const qtyMutation = useMutation((qty: number) => {
        return http.put(`/api/carts/items/${item.item_id}`, { qty })
    })

    const deleteMutation = useMutation(() => {
        return http.delete(`/api/carts/items/${item.item_id}`)
    })

    const updateQty = (qty: number) => {
        qtyMutation.mutate(qty, {
            onSuccess: () => {
                queryClient.invalidateQueries('cart/totals')
                queryClient.invalidateQueries('cart/items')
            },
            onError: (error: any) => {
                alert(error.response.data.message)
            }
        })
    }

    const deleteItem = () => {
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                queryClient.invalidateQueries('cart/totals')
                queryClient.invalidateQueries('cart/items')
            },
            onError: (error: any) => {
                alert(error.response.data.message)
            }
        })
    }

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
                    <IconButton onClick={() => setQty((prev: number) => prev - 1)}>
                        <AiOutlineMinusCircle className={styles.icon}/>
                    </IconButton>

                    <div className={styles.qty}>{qty}</div>

                    <IconButton onClick={() => setQty((prev: number) => prev + 1)}>
                        <AiOutlinePlusCircle className={styles.icon}/>
                    </IconButton>
                </div>

                <IconButton onClick={deleteItem}>
                    <AiOutlineDelete className={styles.icon}/>
                </IconButton>
            </div>
        </div>
        <hr className={styles.divider}/>
        </>
    )
}
  
export default CartItem