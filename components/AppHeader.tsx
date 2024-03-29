import type { NextPage } from 'next'
import { AiOutlineSearch, AiOutlineShopping, AiOutlineLeft, AiOutlineMenu } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { IoLogoWhatsapp } from 'react-icons/io5'
import { useState, useRef, RefObject, ChangeEvent, useEffect } from 'react'
import styles from './AppHeader.module.css'
import { useRouter } from 'next/router'
import { useDebounce } from 'use-debounce'
import useIsMounted from '../hooks/useIsMounted'
import useLocalStorage from '../hooks/useLocalStorage'
import http from '../libs/http'
import useQuery from '../hooks/useQuery'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Link from './Link'
import useOutsideClick from '../hooks/useOutsideClick'
import PubSub from 'pubsub-js'

const guestCartQuery = `query cart($cart_id: String!) {
    cart(
        cart_id: $cart_id
    ) {
        total_quantity
    }
}`

const customerCartQuery = `query {
    customerCart {
        total_quantity
    }
}`

const AppHeader: NextPage = () => {
    const router = useRouter()
    const [isSearching, setIsSearching] = useState(false)
    const [searchTerm, setSearchTerm] = useState(router.query.search_term || '')
    const inputRef: RefObject<HTMLInputElement> = useRef(null)
    const isMounted: boolean = useIsMounted()
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
    const [cartId, setCartId] = useLocalStorage('cart_id')
    const [token] = useLocalStorage('token')
    const headerRef: RefObject<HTMLElement> = useRef(null)

    useOutsideClick([headerRef], () => {
      if(isSearching) setIsSearching(false)
    })

    const getGuestCartTotals = async (cartId: string): Promise<any> => {
        try {
            return http.post(
                `/api/graphql`,
                {
                    query: guestCartQuery,
                    variables: { cart_id: cartId }
                }
            )
        } catch (error) {
            setCartId(null)
            throw error
        }
    }

    const { data: cartData }: any = useQuery('cart/totals', () =>
        {
            if(token) {
                return http.post(
                    `/api/graphql`,
                    {
                        query: customerCartQuery
                    }
                )
            }
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
    
    const toggleSearch = (isSearching: boolean): void => {
        setIsSearching(isSearching)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value)
    }

    const resetInput = (): void => {
        setSearchTerm('')
    }

    const setQuery = (): void => {
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
        if(isMounted) {
            setQuery()
        }
    }, [debouncedSearchTerm])

    useEffect(() => {
        if(isMounted) {
            if(isSearching) inputRef.current?.focus()
            else inputRef.current?.blur()
        }
    }, [isSearching])

    const showsBackButton = router.pathname !== '/'
    const isHomePage = router.pathname === '/'
    const isCategoryPage = router.pathname === '/[category_slug]'

    return (
        <header className={styles.header} ref={headerRef}>
            <div className={isSearching ? styles.hidden : styles.container}>
                <div className={styles.logoContainer}>
                    {showsBackButton &&
                        <IconButton onClick={() => router.back()}>
                            <AiOutlineLeft className={styles.icon}/>
                        </IconButton>
                    }
                    {isHomePage &&
                        <IconButton onClick={() => PubSub.publish('TOGGLE_DRAWER', null)}>
                            <AiOutlineMenu className={styles.icon}/>
                        </IconButton>
                    }
                    <Link href='/' className={styles.logoContainer}>
                        <img
                            src="https://s3.ap-southeast-1.amazonaws.com/assets.femaledaily.com/web-assets/icon/ic-fd.svg"
                            alt="app logo"
                        />
                    </Link>
                </div>

                <div className={styles.icons}>
                    {(isHomePage || isCategoryPage) &&
                    <IconButton onClick={() => toggleSearch(true)}>
                        <AiOutlineSearch className={styles.icon}/>
                    </IconButton>
                    }
                    <IconButton
                        component={Link}
                        href='/cart'
                    >
                        <Badge badgeContent={cartData?.data?.customerCart?.total_quantity || cartData?.data?.cart?.total_quantity} color="primary">
                        <AiOutlineShopping className={styles.icon}/>
                        </Badge>
                    </IconButton>
                    {/*isProductPage*/false &&
                    <IconButton onClick={() => PubSub.publish('test', { data: 'just a test' })}>
                        <IoLogoWhatsapp className={styles.icon}/>
                    </IconButton>
                    }
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
                        <IoMdClose className={styles.closeButton}/>
                    </IconButton>
                    }
                </div>
            </div>
        </header>
    )
}

export default AppHeader