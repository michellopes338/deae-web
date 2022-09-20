import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { Footer } from "Components/Footer";
import Input from "Components/Input";
import { Select } from "Components/Select";
import Textarea from "Components/Textarea";
import { IDeae } from "interfaces/Deae";
import { ISelectables } from "interfaces/Selectables";
import { useRef } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"
import { api } from "services/api";
import { queryClient } from "services/queryClient";
import * as Yup from 'yup';

const queryOptions = {
  staleTime: 1000 * 60,
  refetchOnWindowFocus: false
}

export function EditaDeae() {
  const { id } = useParams();
  const navigate = useNavigate()
  const [cookies] = useCookies(['access_token'])
  const formRef = useRef<FormHandles>(null)
  const headers = {
    Authorization: `Bearer ${cookies.access_token}`
  }

  const { data: deae } = useQuery<IDeae>('getDeae', async () => {
    const response = await api.get(`deaes/relationed/${id}`, { headers });

    return response.data;
  }, queryOptions)

  const { data: classifications } = useQuery<ISelectables[]>('listClassification', async () => {
    const response = await api.get('selectables/classification', { headers });

    return response.data;
  }, queryOptions)

  const { data: locals } = useQuery<ISelectables[]>('listLocal', async () => {
    const response = await api.get('selectables/local', { headers });

    return response.data;
  }, queryOptions)

  const { data: status } = useQuery<ISelectables[]>('listStatus', async () => {
    const response = await api.get('selectables/status', { headers });

    return response.data;
  }, queryOptions)

  if (!deae) {
    return <h1 className="title">Houve um problema</h1>
  }

  async function handleForm(data: any) {
    try {
      formRef.current?.setErrors({})
      
      const schema = Yup.object().shape({
        id: Yup.string().required(),
        deviation: Yup.string().required(),
        adjustment: Yup.string().required(),
        classificationId: Yup.string().required(),
        localId: Yup.string().required(),
        statusId: Yup.string().required(),
      })

      await schema.validate(data, {
        abortEarly: false,
      })

      await api.patch(`deaes/${id}`, data, { headers })
        .then(res => {
          const previousMyDeaes = queryClient.getQueriesData<IDeae[]>('listMyDeaes')[0][1]

          if (previousMyDeaes) {
            const deaeUpdated = previousMyDeaes.map(deae => {
              if (deae.id === res.data.id) {
                return { ...res.data }
              }
              return deae;
            })

            queryClient.setQueryData('listMyDeaes', deaeUpdated)
          }
        })
        .catch(err => {
          console.warn(err)
        })
    } catch (err) {
      const validationErrors: any = {}

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          const path = String(error.path);
          validationErrors[path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      }
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="card-header-title">
            {deae.user.username}
          </div>
        </div>
        <Form ref={formRef} onSubmit={handleForm}>
          <div className="card-content">
            <div className="columns">
              <div className="column">
                <h2>Código do deae</h2>
                <Input name="id" defaultValue={deae.id} readOnly />
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h2>Desvio</h2>
                <Textarea name="deviation" maxLength={255} defaultValue={deae.deviation} />
              </div>
              <div className="column">
                <h2>Medida corretiva</h2>
                <Textarea name="adjustment"  maxLength={255} defaultValue={deae.adjustment} />
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h2>Classificação</h2>
                <Select defaultValue={deae.classification} name="classificationId" options={classifications} />
              </div>
              <div className="column">
                <h2>Local</h2>
                <Select defaultValue={deae.local} name="localId" options={locals} />
              </div>
              <div className="column">
                <h2>Status</h2>
                <Select defaultValue={deae.status} name="statusId" options={status} />
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column">
                <button type="submit" className="button is-primary is-fullwidth">Salvar</button>
              </div>
              <div className="column">
                <button className="button is-warning is-fullwidth" onClick={(e) => {
                  e.preventDefault()
                  navigate(-1)
                }}>Cancelar</button>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  )
}