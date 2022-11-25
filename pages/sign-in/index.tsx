import Link from 'next/link'
import { useQueryClient } from 'react-query'
import styles from '../../styles/SignUp.module.css'
import Button from '../../components/Button'
import { useState } from 'react'
import useIsMounted from '../../hooks/useIsMounted'
import Validator from '../../helpers/Validator'
import http from '../../libs/http'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import TextField from '@mui/material/TextField'

const SignUp = (props: any) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const isMounted = useIsMounted()
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    })
    const mutation = useMutation((data: any) => {
        return http.post('/api/token', data)
    })

    const isValid = () => {
        const validator = new Validator([
            {
                field: 'username',
                method: Validator.isEmpty,
                validWhen: false,
                message: ''
            },
            {
                field: 'password',
                method: Validator.isEmpty,
                validWhen: false,
                message: ''
            }
        ])

        const validation = validator.validate(credentials)
        console.log(validation)
        return validation.isValid
    }

    const submit = () => {
        if(isValid()) {
            mutation.mutate(credentials, {
                onSuccess: async (data) => {
                    window.localStorage.setItem('token', data)
                    router.replace('/')

                    const cartIdKey = 'cart_id'
                    const cartId = window.localStorage.getItem(cartIdKey)
                    
                    if(cartId) {
                        window.localStorage.removeItem(cartIdKey)
                        await http.post('/api/carts/merge', { source_cart_id: cartId })
                        queryClient.invalidateQueries('cart/totals')
                        queryClient.invalidateQueries('cart/items')
                    }

                },
                onError: (error: any) => {
                    alert(error.response.data.message)
                }
            })
        }
    }

    return (
        <div className={styles.container}>
            <div className="text-blue-500">
                <Link href='/'>Back</Link>
            </div>
            <div className={styles.inputContainer}>
                <TextField
                    label="Email"
                    type="email"
                    variant="standard"
                    value={credentials.username}
                    onChange={(e: any) => setCredentials({ ...credentials, ['username']: e.target.value })}
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="standard"
                    value={credentials.password}
                    onChange={(e: any) => setCredentials({ ...credentials, ['password']: e.target.value })}
                />

                <Button label="Sign In" onClick={submit}>
                    Sign in
                </Button>
            </div>
        </div>
    )
  }
  
  export default SignUp