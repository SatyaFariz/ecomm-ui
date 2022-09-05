import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft } from 'react-icons/ai'
import styles from './AppHeader.module.css'

const AppHeader: NextPage = () => {
  return (
    <header className={styles.header}>
        <div className={styles.container} style={{ display: 'none' }}>
            <img
                src="https://werkidz.mygostore.com/_next/static/images/goStore-logo-64f7ac0ca37c2341f8ae739a75345580.svg"
                alt="app logo"
            />

            <div className={styles.icons}>
                <AiOutlineSearch className={styles.icon}/>
                <AiOutlineShopping className={styles.icon}/>
            </div>
        </div>

        <div className={styles.searchbar} style={{ display: undefined }}>
            <AiOutlineLeft className={styles.icon}/>

            <div className={styles.searchbox}>
                <input className={styles.textinput} placeholder="Search" type="text" spellCheck="false"/>
            </div>
        </div>
    </header>
  )
}

export default AppHeader