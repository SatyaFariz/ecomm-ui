import AppHeader from './AppHeader'
import Footer from './Footer'

const AppTemplate = (props: any) => {
  return (
    <div>
      <AppHeader/>
      <div>
      {props.children}
      </div>
      <Footer/>
    </div>
  )
}

export default AppTemplate
