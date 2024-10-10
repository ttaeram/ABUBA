import Header from "./Header"
import Footer from "./Footer"
import SSEManager from "./SSEManager"

const Layout = (props: {children: React.ReactNode}) => {
  return (
    <>
      <SSEManager />
      <Header/>
      <main>{props.children}</main>
      <Footer/>
    </>
  )
}

export default Layout