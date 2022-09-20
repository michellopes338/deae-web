import { Footer } from "Components/Footer";
import { useNavigate } from "react-router-dom";

export function Admin() {
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="box is-clickable" onClick={() => navigate('aprovar-deae')}>Aprovar Deae</div>
      <div className="box is-clickable" onClick={() => navigate('configuracoes')}>Configurações</div>
      <Footer />
    </div>
  )
}