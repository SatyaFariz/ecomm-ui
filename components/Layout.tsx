import AppHeader from './AppHeader'
import Footer from './Footer'

const Layout = (props: any) => {
  return (
    <>
      <AppHeader/>
      <main>
        {props.children}
      </main>
      <Footer/>
    </>
  )
}

export default Layout