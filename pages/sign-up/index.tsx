import Link from 'next/link'
import styles from '../../styles/SignUp.module.css'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import { useState } from 'react'
import useIsMounted from '../../hooks/useIsMounted'
import Validator from '../../helpers/Validator'
import axios from 'axios'
import { useMutation } from 'react-query'

const SignUp = (props: any) => {
    const isMounted = useIsMounted()
    const [customer, setCustomer] = useState({
        fullname: '',
        email: '',
    })
    const [password, setPassword] = useState('')
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
                field: 'fullname',
                method: Validator.isEmpty,
                validWhen: false,
                message: ''
            },
            {
                field: 'email',
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

        const validation = validator.validate({ ...customer, password })
        console.log(validation)
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
                <TextInput
                    placeholder="Full name"
                    type="text"
                    value={customer.fullname}
                    onChange={(e: any) => setCustomer({ ...customer, ['fullname']: e.target.value })}
                />
                <TextInput
                    placeholder="Email"
                    type="email"
                    value={customer.email}
                    onChange={(e: any) => setCustomer({ ...customer, ['email']: e.target.value })}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    type="password"
                    onChange={(e: any) => setPassword(e.target.value)}
                />

                <Button label="Sign Up" onClick={submit}/>
            </div>
        </div>
    )
  }
  
  export default SignUp