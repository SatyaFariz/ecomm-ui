import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft, AiOutlineClose } from 'react-icons/ai'
import { useState, useRef, RefObject, ChangeEvent, useEffect } from 'react'
import styles from './AppHeader.module.css'
import { useRouter } from 'next/router'
import { useDebounce } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'
import http from '../libs/http'
import useQuery from '../hooks/useQuery'
import IconButton from '@mui/material/IconButton'

const AppHeader: NextPage = () => {
    const router = useRouter()
    const [isSearching, setIsSearching] = useState(false)
    const [searchTerm, setSearchTerm] = useState(router.query.search_term || '')
    const inputRef: RefObject<HTMLInputElement> = useRef(null)
    const isMounted: boolean = useIsMounted()
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
    const cartId = isMounted && window.localStorage.getItem('cart_id')

    const { error, data }: any = useQuery([cartId], () =>
        http.get(`/api/guest-carts/${cartId}/totals`),
        {
            enabled: !!cartId,
            refetchOnWindowFocus: false
        }
    )

    console.log(data)

    const toggleSearch = (isSearching: boolean) => {
        setIsSearching(isSearching)
        if(isSearching) inputRef.current?.focus()
        else inputRef.current?.blur()
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const resetInput = () => {
        setSearchTerm('')
        setQuery()
    }

    const setQuery = () => {
        const query = { ...router.query }
        if((debouncedSearchTerm as string)?.trim().length === 0)
            delete query.search_term
        else query.search_term = debouncedSearchTerm
        
        router.replace(router.pathname, {
            query
        })
    }

    useEffect(() => {
        if(isMounted) {
            setQuery()
        }
    }, [debouncedSearchTerm])

    return (
        <header className={styles.header}>
            <div className={isSearching ? styles.hidden : styles.container}>
                <div className={styles.logoContainer}>
                    {router.pathname !== '/' &&
                        <button onClick={() => router.back()}>
                            <AiOutlineLeft className={styles.icon} onClick={() => toggleSearch(false)}/>
                        </button>
                    }
                    <img
                        src="https://werkidz.mygostore.com/_next/static/images/goStore-logo-64f7ac0ca37c2341f8ae739a75345580.svg"
                        alt="app logo"
                    />
                </div>

                <div className={styles.icons}>
                    <IconButton onClick={() => toggleSearch(true)}>
                        <AiOutlineSearch className={styles.icon}/>
                    </IconButton>
                    <IconButton>
                        <AiOutlineShopping className={styles.icon}/>
                    </IconButton>
                </div>
            </div>

            <div className={isSearching ? styles.searchbar : styles.hidden}>
                <AiOutlineLeft className={styles.icon} onClick={() => toggleSearch(false)}/>

                <div className={styles.searchbox}>
                    <input 
                        className={styles.textinput} 
                        placeholder="Search" 
                        type="text" 
                        spellCheck="false"
                        ref={inputRef}
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    {searchTerm.length > 0 &&
                    <button className={styles.closeButton} onClick={resetInput}>
                        <AiOutlineClose/>
                    </button>
                    }
                </div>
            </div>
        </header>
    )
}

export default AppHeader