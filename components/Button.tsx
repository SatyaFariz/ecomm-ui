import styles from './Button.module.css'
import Button from '@mui/material/Button'

const CustomButton = (props: any) => {
    return (
        <Button 
            variant="contained"
            className={[styles.button, props.className]}
            {...props}
        />
    )
}
  
export default CustomButton