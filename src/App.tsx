import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';

function App() {
  return (
    <Router>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
