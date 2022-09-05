import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping } from 'react-icons/ai'
import styles from './AppHeader.module.css'

const AppHeader: NextPage = () => {
  return (
    <header className={styles.header}>
        <div className={styles.container}>
            <img
                className={styles.logo}
                src="https://werkidz.mygostore.com/_next/static/images/goStore-logo-64f7ac0ca37c2341f8ae739a75345580.svg"
                alt="app logo"
            />

            <div className={styles.icons}>
                <AiOutlineSearch size={24}/>
                <AiOutlineShopping size={24}/>
            </div>
        </div>
    </header>
  )
}

export default AppHeader