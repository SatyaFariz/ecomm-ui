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

const SignUp = (props: any) => {
    const isMounted = useIsMounted()
    const [validation, setValidation]: [any, Function] = useState({})
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
    })
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const mutation = useMutation((data: any) => {
        return axios({
            method: 'post',
            url: '/api/customers',
            data
        })
    })

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
                method: (val: string) => val.length > 2,
                validWhen: false,
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
                message: ''
            }
        ])

        const validation = validator.validate({ ...customer, password })
        setValidation(validation)
        return validation.isValid
    }

    const submit = () => {
        if(isValid()) {
            mutation.mutate({ customer, password }, {
                onSuccess: (data, variables, context) => {
                    console.log(data, variables, context)
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
                    label="Name"
                    variant="standard"
                    value={customer.name}
                    onChange={(e: any) => setCustomer({ ...customer, ['name']: e.target.value })}
                    error={validation?.name?.isInvalid}
                    helperText={validation?.name?.message}
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
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="standard"
                    value={repassword}
                    onChange={(e: any) => setRepassword(e.target.value.trim())}
                    error={validation?.repassword?.isInvalid}
                    helperText={validation?.repassword?.message}
                />

                <Button label="Sign Up" onClick={submit}/>
            </div>
        </div>
    )
  }
  
  export default SignUp