import styles from './SliderDots.module.css'

const SliderDots = (props: any) => {
    const { count, position } = props
    return (
        <div className={styles.container}>
            {new Array(count).fill(null).map((_, i) =>
                <div className={position === i + 1 ? styles.active : styles.dot}/>
            )}
        </div>
    )
}
  
export default SliderDots