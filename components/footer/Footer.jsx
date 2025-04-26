import { Heart } from "lucide-react";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <p>Creado con la motivación de formar parte del equipo de <strong>WeSpeak</strong> <Heart className='icon' size={14} fill="#e25555" color="#e25555" /> - Powered by Sebastián Antueno -</p>
    </footer>
  );
}