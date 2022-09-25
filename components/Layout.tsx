import AppHeader from './AppHeader'
import Footer from './Footer'

const Layout = (props: any) => {
  return (
    <>
        <AppHeader/>
        {props.children}
        <Footer/>
    </>
  )
}

export default Layout