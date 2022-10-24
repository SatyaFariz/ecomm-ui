import styles from './Button.module.css'
import Button from '@mui/material/Button'
import ReactLoading from 'react-loading'

const CustomButton = (props: any) => {
    const { loading, ...rest } = props
    const iconSize = 24
    return (
        <Button 
            variant="contained"
            classes={{
                root: styles.button
            }}
            {...rest}
        >
            <div className={styles.content}>
                <div className={props.loading ? styles.hidden : undefined}>{props.children}</div>
                {props.loading &&
                <ReactLoading type="spokes" height={iconSize} width={iconSize} className={styles.loading}/>
                }
            </div>
        </Button>
    )
}
  
export default CustomButton