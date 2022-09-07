import Link from 'next/link'
import styles from '../../styles/SignUp.module.css'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

const SignUp = (props: any) => {
    return (
        <div className={styles.container}>
            <div className="text-blue-500">
                <Link href='/'>Back</Link>
            </div>
            <div className={styles.inputContainer}>
                <TextInput
                    placeholder="Full name"
                />
                <TextInput
                    placeholder="Email"
                />
                <TextInput
                    placeholder="Password"
                />

                <Button label="Sign Up"/>
            </div>
        </div>
    )
  }
  
  export default SignUp