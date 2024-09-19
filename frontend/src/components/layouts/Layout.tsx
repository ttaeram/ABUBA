import Header from "./Header"
import Footer from "./Footer"

const Layout = (props: {children: React.ReactNode}) => {
  return (
    <>
    <Header/>
    <main>{props.children}</main>
    <Footer/>
    </>
  )
}

export default Layout