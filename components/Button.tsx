import styles from './Button.module.css'
import Button from '@mui/material/Button'
import ReactLoading from 'react-loading'

const CustomButton = (props: any) => {
    const iconSize = 24
    return (
        <Button 
            variant="contained"
            className={[styles.button, props.className]}
            {...props}
        >
            {props.loading ? 
            <ReactLoading type="spokes" height={iconSize} width={iconSize}/>
            : props.children}
        </Button>
    )
}
  
export default CustomButton