
import { Calculator } from 'lucide-react'; // Importamos el ícono de Lucide
import './Header.css';


export const Header = () => {
  return (
    <header className="header">
      <h1>
        <Calculator className="header-icon" size={24} color="#4caf50" /> 
        Challenge Técnico: Contador Persistente
      </h1>
    </header>
  );
};
