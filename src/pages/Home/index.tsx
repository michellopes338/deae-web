import { api } from "services/api";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { DeaeComponent } from "../../Components/DeaeComponent";
import { IDeae } from "interfaces/Deae";
import { Footer } from "Components/Footer";

export function Home() {
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);
  const navigate = useNavigate();
  const oneMinute = 1000 * 60

  const { data: deaes, error } = useQuery<IDeae[]>('listMyDeae', async () => {
    const response = await api.get('deaes?fields=is_valid&search=true&order=desc', {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`
      }
    });

    return response.data;
  }, {
    staleTime: oneMinute,
    refetchOnWindowFocus: false,
  })

  if (error) {
    return <h1>Erro</h1>
  }

  return (
    <div className="container">
      {deaes?.map(deae => (
        <DeaeComponent key={deae.id} {...deae} />
      ))}
      <Footer />
    </div>
  )
}