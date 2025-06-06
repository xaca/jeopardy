import { HashRouter, Route, Routes } from 'react-router'
import { Home, Host, Player } from '@/pages'

function App() {
  return(
    <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/host" element={<Host />} />
      <Route path="/player/:partidaId/:teamId" element={<Player />} />
    </Routes>
  </HashRouter>
  )
}

export default App
