import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft } from 'react-icons/ai'
import { useState, useRef, RefObject, ChangeEvent, useEffect } from 'react'
import styles from './AppHeader.module.css'
import { useRouter } from 'next/router'
import { useDebounce } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'

const AppHeader: NextPage = () => {
    const router = useRouter()
    const [isSearching, setIsSearching] = useState(false)
    const [searchTerm, setSearchTerm] = useState(router.query.search_term || '')
    const inputRef: RefObject<HTMLInputElement> = useRef(null)
    const isMounted: boolean = useIsMounted()
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

    const toggleSearch = (isSearching: boolean) => {
        setIsSearching(isSearching)
        if(isSearching) inputRef.current?.focus()
        else inputRef.current?.blur()
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {
        if(isMounted && debouncedSearchTerm.length > 0) {
            console.log(debouncedSearchTerm)
            // router.query.search_term = debouncedSearchTerm
            // router.replace(router)
        }
    }, [debouncedSearchTerm])

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
                        defaultValue={searchTerm}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </header>
    )
}

export default AppHeader