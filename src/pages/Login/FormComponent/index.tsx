import { Form } from "@unform/web";
import { api } from 'services/api';
import Input from 'Components/Input';
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

interface IReset {
  reset(): void
}

interface ILoginData {
  data: {
    refresh_token: string;
  }
  headers: {
    authorization: string
  }
}

export function FormLogin() {
  const navigate = useNavigate()
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token'])

  async function HandleSubmit(formData: SubmitEvent, { reset }: IReset) {
    await api.post('auth/login', formData)
      .then(async res => {
        setCookie("access_token", res.headers.authorization);
        setCookie("refresh_token", res.data.refresh_token);
      }).catch(err => {
        console.warn(err)
      }).finally(() => {
        reset();
        navigate('/', { replace: true })
      });
  }

  return (
    <Form onSubmit={HandleSubmit}>
      <div className="grid-row columns">
        <div className="column">
          <Input name="username" defaultValue="joryscladson" placeholder="username..." type="text" />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <Input name="password" defaultValue="senhaForte" placeholder="senha..." type="password" />
        </div>
      </div>
      <div className="column">
        <button className="button is-primary is-fullwidth">Enviar</button>
      </div>
    </Form>
  )
}