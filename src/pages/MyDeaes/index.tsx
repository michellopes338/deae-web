import classNames from 'classnames';
import { DeaeComponent } from 'Components/DeaeComponent';
import { Footer } from 'Components/Footer';
import { IDeae } from 'interfaces/Deae';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';

export function MyDeaes() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);
  const { data: deaes } = useQuery<IDeae[]>('listMyDeaes', async () => {
    const response = await api.get('deaes/user', {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`
      }
    });

    return response.data;
  }, {
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })

  function mostra(clickable: boolean, id: string) {
    if (clickable) {
      return false;
    }

    navigate(`edita/${id}`)
  }

  return (
    <div className="container">
      <button className="button is-primary is-fullwidth" onClick={() => navigate('/adicionar-deae')}>Adicionar Deae</button>
      {deaes?.map(deae => (
        <div key={deae.id} onClick={() => (mostra(deae.is_valid, deae.id))} className={classNames({
          "is-clickable": !deae.is_valid
        })}>
          <DeaeComponent {...deae} />
        </div>
      ))}
      <Footer />
    </div>
  )
}