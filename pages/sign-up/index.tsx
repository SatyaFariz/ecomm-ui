import Link from 'next/link'
import styles from '../../styles/SignUp.module.css'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import { useState } from 'react'
import useIsMounted from '../../hooks/useIsMounted'
import Validator from '../../helpers/Validator'
import axios from 'axios'
import { useMutation } from 'react-query'
import TextField from '@mui/material/TextField'
import { isEmail } from 'validator'
import http from '../../libs/http'
import { Snackbar } from '@mui/material'
import { useRouter } from 'next/router'

const SignUp = (props: any) => {
    const router = useRouter()
    const isMounted = useIsMounted()
    const [validation, setValidation]: [any, Function] = useState({})
    const [loading, setLoading] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState(null)
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
    })
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const mutation = useMutation((data: any) => http.post('/api/customers', data))

    const isValid = () => {
        const validator = new Validator([
            {
                field: 'name',
                method: Validator.isEmpty,
                validWhen: false,
                message: 'Please enter your name.'
            },
            {
                field: 'name',
                method: (val: string) => val.length >= 2,
                validWhen: true,
                message: 'Your name must be at least 2 characters long.'
            },
            {
                field: 'email',
                method: Validator.isEmpty,
                validWhen: false,
                message: 'Please enter your email.'
            },
            {
                field: 'email',
                method: isEmail,
                validWhen: true,
                message: 'Please enter a valid email.'
            },
            {
                field: 'password',
                method: Validator.isEmpty,
                validWhen: false,
                message: 'Please enter a password containing at least 1 upper case letter, 1 lower case letter, a number and at least 8 characters long.'
            },
            {
                field: 'password',
                method: (value: string) => {
                    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/
                    return regexp.test(value)
                },
                validWhen: true,
                message: 'Password must contain at least 1 upper case letter, 1 lower case letter, a number and at least 8 characters long.'
            },
            {
                field: 'repassword',
                method: Validator.isEmpty,
                validWhen: false,
                message: 'Please re-enter your password above.'
            },
            {
                field: 'repassword',
                method: (value: string) => value === password,
                validWhen: true,
                message: "Doesn't match your password above."
            }
        ])

        const validation = validator.validate({ ...customer, password, repassword })
        setValidation(validation)
        return validation.isValid
    }

    const submit = () => {
        if(isValid()) {
            mutation.mutate({ customer, password }, {
                onSuccess: (data, variables, context) => {
                    console.log(data, variables, context)
                    router.replace('/sign-in')
                },
                onError: (error: any) => {
                    if(isMounted) {
                        setSnackbarMessage(error.response.data.message)
                        setSnackbarOpen(true)
                    }
                },
                onSettled: () => {
                    if(isMounted) {
                        setLoading(false)
                    }
                }
            })
            setLoading(true)
        }
    }

    return (
        <div className={styles.container}>
            <div className="text-blue-500">
                <Link href='/'>Back</Link>
            </div>
            <div className={styles.inputContainer}>
                <TextField
                    label="Name"
                    variant="standard"
                    value={customer.name}
                    onChange={(e: any) => setCustomer({ ...customer, ['name']: e.target.value })}
                    error={validation?.name?.isInvalid}
                    helperText={validation?.name?.message}
                    inputProps={{
                        maxLength: 30
                    }}
                />
                <TextField
                    label="Email"
                    type="email"
                    variant="standard"
                    value={customer.email}
                    onChange={(e: any) => setCustomer({ ...customer, ['email']: e.target.value })}
                    error={validation?.email?.isInvalid}
                    helperText={validation?.email?.message}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="standard"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value.trim())}
                    error={validation?.password?.isInvalid}
                    helperText={validation?.password?.message}
                    inputProps={{
                        maxLength: 30
                    }}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="standard"
                    value={repassword}
                    onChange={(e: any) => setRepassword(e.target.value.trim())}
                    error={validation?.repassword?.isInvalid}
                    helperText={validation?.repassword?.message}
                    inputProps={{
                        maxLength: 30
                    }}
                />

                <Button onClick={submit} loading={loading}>
                    Sign up
                </Button>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    )
  }
  
  export default SignUp