import Link from 'next/link'
import styles from '../../styles/SignUp.module.css'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

const SignUp = (props: any) => {
    return (
        <div className={styles.container}>
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