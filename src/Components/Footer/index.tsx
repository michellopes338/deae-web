import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileCircleCheck, faStore } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from 'react-query';
import { api } from 'services/api';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

interface UserRole {
  role: string
}


export function Footer() {
  const oneMinute = 1000 * 60;
  const [cookies] = useCookies(['access_token'])

  const { data: role, error } = useQuery<UserRole>('showPermission', async () => {
    const response = await api.get('users/permission', {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`
      }
    });
    
    return response.data;
  }, {
    staleTime: oneMinute * 5,
    refetchOnWindowFocus: false,
  })

  return (
    <nav className="navbar is-fixed-bottom">
      <div className="level is-mobile">
        <div className="level-item has-text-centered">
          <Link to='/meus-deaes'>
            <div>
              <p className="heading">Meus deaes</p>
              <FontAwesomeIcon icon={faFile} />
            </div>
          </Link>
        </div>
        <div className="level-item has-text-centered">
          <Link to='/'>
            <div>
              <p className="heading">Todos deaes</p>
              <FontAwesomeIcon icon={faFile} />
            </div>
          </Link>
        </div>
        <div className="level-item has-text-centered">
          <Link to='/loja'>
            <div>
              <p className="heading">Loja</p>
              <FontAwesomeIcon icon={faStore} />
            </div>
          </Link>
        </div>
        {/* only admin */}
        {role?.role === 'ADMIN' && (
          <div className="level-item has-text-centered">
            <Link to='/aprovar-deae'>
              <div>
                <p className="heading">Aprovar deae</p>
                <FontAwesomeIcon icon={faFileCircleCheck} />
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}