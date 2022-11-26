import styles from './Drawer.module.css'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '../components/Link'
import useAuthedQuery from '../hooks/useAuthedQuery'
import Http from '../libs/http'

const CustomDrawer = (props: any) => {
    const { error: userResponseError, data: userResponseData }: any = useAuthedQuery('me', () =>
        Http.get('/api/customers/me')
    )

    console.log('USER DATA', userResponseData)
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
                {userResponseData ?
                <ListItem disablePadding>
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