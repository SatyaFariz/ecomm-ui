import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft } from 'react-icons/ai'
import { useState, useRef, RefObject, ChangeEvent } from 'react'
import styles from './AppHeader.module.css'
import { useRouter } from 'next/router'

const AppHeader: NextPage = () => {
    const [isSearching, setIsSearching] = useState(false)
    const inputRef: RefObject<HTMLInputElement> = useRef(null)
    const router = useRouter()

    const toggleSearch = (isSearching: boolean) => {
        setIsSearching(isSearching)
        if(isSearching) inputRef.current?.focus()
        else inputRef.current?.blur()
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        router.query.search_term = e.target.value
        router.replace(router)
    }

    return (
        <header className={styles.header}>
            <div className={styles.container} style={{ display: isSearching ? 'none' : undefined }}>
                <img
                    src="https://werkidz.mygostore.com/_next/static/images/goStore-logo-64f7ac0ca37c2341f8ae739a75345580.svg"
                    alt="app logo"
                />

                <div className={styles.icons}>
                    <AiOutlineSearch className={styles.icon} onClick={() => toggleSearch(true)}/>
                    <AiOutlineShopping className={styles.icon}/>
                </div>
            </div>

            <div className={styles.searchbar} style={{ display: isSearching ? undefined : 'none' }}>
                <AiOutlineLeft className={styles.icon} onClick={() => toggleSearch(false)}/>

                <div className={styles.searchbox}>
                    <input 
                        className={styles.textinput} 
                        placeholder="Search" 
                        type="text" 
                        spellCheck="false"
                        ref={inputRef}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </header>
    )
}

export default AppHeader