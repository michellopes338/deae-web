import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import classNames from "classnames";
import { Select } from "Components/Select";
import Textarea from "Components/Textarea";
import { ISelectables } from "interfaces/Selectables";
import { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { api } from "services/api";
import * as Yup from 'yup';

export function AddDeae() {
  const formRef = useRef<FormHandles>(null)
  const [hidden, setHidden] = useState(true)
  const [cookies] = useCookies(['access_token'])
  const queryOptions = {
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  }
  const headers = {
    Authorization: `Bearer ${cookies.access_token}`
  }

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

  async function handleSubmit(data: {}) {
    try {
      formRef.current?.setErrors({})
      
      const schema = Yup.object().shape({
        deviation: Yup.string().required(),
        adjustment: Yup.string().required(),
        classificationId: Yup.string().required(),
        localId: Yup.string().required(),
        statusId: Yup.string().required(),
      })

      await schema.validate(data, {
        abortEarly: false,
      })

      api.post('deaes', data, { headers }).then(res => {
        setHidden(false)
      })
    } catch (err) {
      const validationErrors: any = {};

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
      <div className={classNames({
        "notification is-primary": true,
        "is-hidden": hidden
      })}>
        <button className="delete" onClick={() => setHidden(true)}></button>
        Deae lançado<br />
        Você ja pode lançar o proximo
      </div>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <div className="columns">
          <div className="column">
            <h2>Desvio</h2>
            <Textarea name="deviation" />
          </div>
          <div className="column">
            <h2>Correção</h2>
            <Textarea name="adjustment" />
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h2>Classificação</h2>
            <Select placeholder="selecione..." name="classificationId" options={classifications} />
          </div>
          <div className="column">
            <h2>Local</h2>
            <Select placeholder="selecione..." name="localId" options={locals} />
          </div>
          <div className="column">
            <h2>Status</h2>
            <Select placeholder="selecione..." name="statusId" options={status} />
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column">
            <button className="button is-primary is-fullwidth">Enviar</button>
          </div>
          <div className="column">
            <button className="button is-warning is-fullwidth">Cancelar</button>
          </div>
        </div>
      </Form>
    </div>
  )
}