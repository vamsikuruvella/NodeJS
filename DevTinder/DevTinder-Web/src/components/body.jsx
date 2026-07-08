import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'
import Footer from './footer'
const Body = () => {
    return<>
     <Navbar />
        <h1 className="text-3xl font-bold underline">
            Body
        </h1>   
        <Outlet />
        <Footer />
    </>
}

export default Body