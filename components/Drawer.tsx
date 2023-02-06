import styles from './Drawer.module.css'
import { Fragment } from 'react'
import { useQueryClient } from 'react-query'
import Drawer from '@mui/material/Drawer'
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '../components/Link'
import useLocalStorage from '../hooks/useLocalStorage'
import useCurrentUser from '../hooks/useCurrentUser'
import Category from '../types/category'
import getDataFromDehydratedState from '../helpers/getDataFromDehydratedState'
import Http from '../libs/http'
import useQuery from '../hooks/useQuery'

const CustomDrawer = (props: any) => {
    const { parentDehydratedState } = props
    const key = 'categories'
    const queryClient = useQueryClient()
    const [__, setToken] = useLocalStorage('token')
    const [_, setCardId] = useLocalStorage('cart_id')

    const { data: categoriesData }: any = useQuery(key, () =>
        Http.post('/api/graphql', props.graphql),
        {},
        getDataFromDehydratedState(key, parentDehydratedState)
    )
    const categories: Category[] = categoriesData.data.categoryList[0]?.children

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
          open={props.open}
          onClose={props.onClose}
          className={styles.drawer}
        >
            <div className={styles.header}>
                <img
                    src="https://s3.ap-southeast-1.amazonaws.com/assets.femaledaily.com/web-assets/icon/ic-fd.svg"
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
                {categories?.map((category) => {
                  if(category.children.length > 0) {
                    return (
                      <Fragment key={category.uid}>
                        <ListItem
                          disablePadding
                          component={Link} 
                          href={category.url_key}
                        >
                          <ListItemButton>
                          <ListItemText primary={category.name} />
                          </ListItemButton>
                        </ListItem>
                        <Collapse in={true} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {category.children.map(child => (
                              <ListItem
                                sx={{ pl: 4 }}
                                disablePadding 
                                key={child.uid}
                                component={Link} 
                                href={child.url_key}
                              >
                                <ListItemButton>
                                <ListItemText primary={child.name} />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </Fragment>
                    )
                  }
                  return (
                    <ListItem
                      disablePadding 
                      key={category.uid}
                      component={Link} 
                      href={category.url_key}
                    >
                      <ListItemButton>
                      <ListItemText primary={category.name} />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
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