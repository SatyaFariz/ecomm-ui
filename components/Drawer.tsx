import styles from './Drawer.module.css'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const CustomDrawer = (props: any) => {
    return (
        <Drawer
        anchor='left'
        {...props}
        className={styles.drawer}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemText primary="Inbox" />
                    </ListItemButton>
                </ListItem>
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