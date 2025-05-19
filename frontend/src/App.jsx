import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { GamePlay } from './pages/GamePlay'
import { Toaster } from './components/ui/toaster'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/sketchNsnort/:id',
    element: <GamePlay />
  }
])
const App = () => {
  return (
    <>
      <RouterProvider router={appRouter}/>
      <Toaster />
    </>
  )
}

export default App
