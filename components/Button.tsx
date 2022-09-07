import styles from './Button.module.css'

const Button = (props: any) => {
    return (
        <button className={styles.button} {...props}>
            {props.label}
        </button>
    )
}
  
export default Button