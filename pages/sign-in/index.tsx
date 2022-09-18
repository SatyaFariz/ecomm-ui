import Link from 'next/link'
import styles from '../../styles/SignUp.module.css'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import { useState } from 'react'
import useIsMounted from '../../hooks/useIsMounted'
import Validator from '../../helpers/Validator'
import http from '../../libs/http'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'

const SignUp = (props: any) => {
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
                onSuccess: (data, variables, context) => {
                    if(data.error) {
                        alert(data.message)
                    } else {
                        window.localStorage.setItem('token', data.token)
                        router.replace('/')
                    }
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
                    placeholder="Email"
                    type="email"
                    value={credentials.username}
                    onChange={(e: any) => setCredentials({ ...credentials, ['username']: e.target.value })}
                />
                <TextInput
                    placeholder="Password"
                    value={credentials.password}
                    type="password"
                    onChange={(e: any) => setCredentials({ ...credentials, ['password']: e.target.value })}
                />

                <Button label="Sign In" onClick={submit}/>
            </div>
        </div>
    )
  }
  
  export default SignUp