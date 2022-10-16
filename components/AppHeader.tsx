import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft, AiOutlineClose } from 'react-icons/ai'
import { useState, useRef, RefObject, ChangeEvent, useEffect, MutableRefObject } from 'react'
import styles from './AppHeader.module.css'
import { useRouter } from 'next/router'
import { useDebounce } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'
import useLocalStorage from '../hooks/useLocalStorage'
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
    const [cartId, setCartId] = useLocalStorage('cart_id')
    const [token] = useLocalStorage('token')

    const getGuestCartTotals = async (cartId: string) => {
        try {
            return await http.get(`/api/guest-carts/${cartId}/totals`)
        } catch (error) {
            setCartId(null)
            throw error
        }
    }

    const { data: cartData }: any = useQuery('cart/totals', () =>
        {
            if(token)
                return http.get(`/api/carts/totals`)
            else if(cartId)
                return getGuestCartTotals(cartId)
        },
        {
            enabled: !!token || !!cartId,
            refetchOnWindowFocus: false,
            retry: (_, error: any) => {
                if(error.response.status === 404) return false
                return true
            }
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
        
        router.replace({
            pathname: router.pathname,
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