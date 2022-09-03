import AppHeader from './AppHeader'
import Footer from './Footer'

const AppTemplate = (props: any) => {
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

export default AppTemplate
