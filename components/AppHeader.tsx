import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft, AiOutlineClose } from 'react-icons/ai'
import { useState, useRef, RefObject, ChangeEvent, useEffect, MutableRefObject } from 'react'
import styles from './AppHeader.module.css'
import { useRouter } from 'next/router'
import { useDebounce } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'
import http from '../libs/http'
import useQuery from '../hooks/useQuery'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Link from '../components/Link'

const AppHeader: NextPage = () => {
    const router = useRouter()
    const [isSearching, setIsSearching] = useState(false)
    const [searchTerm, setSearchTerm] = useState(router.query.search_term || '')
    const inputRef: RefObject<HTMLInputElement> = useRef(null)
    const isMounted: MutableRefObject<boolean> = useIsMounted()
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
    
    const { error, data: cartData }: any = useQuery('cart/totals', () =>
        { 
            const cartId = window.localStorage.getItem('cart_id')
            return http.get(`/api/guest-carts/${cartId}/totals`)
        },
        {
            enabled: isMounted.current,
            refetchOnWindowFocus: false
        }
    )

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
        if(isMounted.current) {
            setQuery()
        }
    }, [debouncedSearchTerm])

    const showsBackButton = router.pathname !== '/'

    return (
        <header className={styles.header}>
            <div className={isSearching ? styles.hidden : (showsBackButton ? styles.container2 : styles.container)}>
                <div className={styles.logoContainer}>
                    {showsBackButton &&
                        <IconButton onClick={() => router.back()}>
                            <AiOutlineLeft className={styles.icon}/>
                        </IconButton>
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
                    <IconButton
                        component={Link}
                        href='/cart'
                    >
                        <Badge badgeContent={cartData?.items_qty} color="primary">
                        <AiOutlineShopping className={styles.icon}/>
                        </Badge>
                    </IconButton>
                </div>
            </div>

            <div className={isSearching ? styles.searchbar : styles.hidden}>
                <IconButton onClick={() => toggleSearch(false)}>
                    <AiOutlineLeft className={styles.icon}/>
                </IconButton>
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
                    <IconButton onClick={resetInput}>
                        <AiOutlineClose className={styles.closeButton}/>
                    </IconButton>
                    }
                </div>
            </div>
        </header>
    )
}

export default AppHeader