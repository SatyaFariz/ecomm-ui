import AppHeader from './AppHeader'

const AppTemplate = (props: any) => {
  return (
    <div>
      <AppHeader/>
      <div>
      {props.children}
      </div>
    </div>
  )
}

export default AppTemplate
