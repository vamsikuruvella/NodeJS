import Navbar from './NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './body'
import Login from './login'
import Profile from './profile'
import { Provider } from 'react-redux'
import appStore from '../appStore/appStore'
import Feed from './feed'
function App() {
  console.log("App rendered");
  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path='/' element={<Body />} >
            <Route path='/' element={<Feed />} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
      </Provider>
    </>
    
  )
}

export default App
