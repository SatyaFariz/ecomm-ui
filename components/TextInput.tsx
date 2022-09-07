import styles from './TextInput.module.css'

const TextInput = (props: any) => {
    return (
        <div className={styles.container}>
            <input className={styles.input} {...props}/>
        </div>
    )
}
  
export default TextInput