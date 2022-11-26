import styles from './Drawer.module.css'
import { useQueryClient } from 'react-query'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '../components/Link'
import useLocalStorage from '../hooks/useLocalStorage'
import useCurrentUser from '../hooks/useCurrentUser'

const CustomDrawer = (props: any) => {
    const queryClient = useQueryClient()
    const [__, setToken] = useLocalStorage('token')
    const [_, setCardId] = useLocalStorage('cart_id')

    const { user } = useCurrentUser()

    const logout = () => {
        setCardId(null)
        setToken(null)
        queryClient.invalidateQueries('me')
        queryClient.invalidateQueries('cart/totals')
        queryClient.invalidateQueries('cart/items')
    }
    return (
        <Drawer
        anchor='left'
        {...props}
        className={styles.drawer}
        >
            <div className={styles.header}>
                <img
                    src="https://werkidz.mygostore.com/_next/static/images/goStore-logo-64f7ac0ca37c2341f8ae739a75345580.svg"
                    alt="app logo"
                />
            </div>
            <List>
                {user ?
                <ListItem disablePadding onClick={logout}>
                    <ListItemButton>
                    <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
                :
                <ListItem disablePadding component={Link} href='/sign-in'>
                    <ListItemButton>
                    <ListItemText primary="Login" />
                    </ListItemButton>
                </ListItem>
                }
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemText primary="Drafts" />
                    </ListItemButton>
                </ListItem>
            </List>   
        </Drawer>
    )
}
  
export default CustomDrawer