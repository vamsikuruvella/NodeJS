import Navbar from './NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './body'
import Login from './login'
import Connections from './Connections'
import Profile from './profile'
import Requests from './Requests'
import { Provider } from 'react-redux'
import appStore from '../appStore/appStore'
import Feed from './feed'
import Premium from './Premium'
import Chat from './Chat'

function App() {
  return (
    <div className="max-h-screen flex flex-col">
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path='/' element={<Body />} >
              <Route path='/' element={<Feed />} />
              <Route path='/login' element={<Login />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/connections' element={<Connections />} />
              <Route path='/requests' element={<Requests />} />
              <Route path='/premium' element={<Premium />} />
              <Route path='/chat/:targetUserId' element={<Chat />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </div>

  )
}

export default App
