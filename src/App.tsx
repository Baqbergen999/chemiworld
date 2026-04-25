import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PeriodicTable from './pages/PeriodicTable';
import Sandbox from './pages/Sandbox';
import Lecture from './pages/Lecture';
import Practice from './pages/Practice';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="periodic-table" element={<PeriodicTable />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="lecture/:week" element={<Lecture />} />
          <Route path="practice" element={<Practice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
