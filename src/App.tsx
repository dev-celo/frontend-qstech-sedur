import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dashboard } from '@/pages/Dashboard';
import { Sobre } from '@/pages/Sobre';
import { Contato } from '@/pages/Contato';
import { Localizacao } from '@/pages/Localizacao';
import Manutencao from './pages/Manutencao';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route path="/manutencao" element={<Manutencao />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
