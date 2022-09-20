import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { Footer } from "Components/Footer";
import Input from "Components/Input";
import { Select } from "Components/Select";
import { ISelectables } from "interfaces/Selectables";
import { useRef } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { api } from "services/api";
import { queryClient } from "services/queryClient";
import * as Yup from 'yup';
import { passErrors, validateDelete, validatePost } from "./utils";

export function AdminConfigs() {
  const insertionLocalFormRef = useRef<FormHandles>(null);
  const deleteLocalFormRef = useRef<FormHandles>(null);
  const insertionClassificationFormRef = useRef<FormHandles>(null);
  const deleteClassificationFormRef = useRef<FormHandles>(null);
  const [cookies] = useCookies(['access_token'])
  const headers = { Authorization: `Bearer ${cookies.access_token}` }

  const { data: local } = useQuery('listLocal', async () => {
    const response = await api.get('selectables/local', { headers })
    
    return response.data
  }, {
    staleTime: 1000 * 60,
  })

  const { data: classification } = useQuery('listClassification', async () => {
    const response = await api.get('selectables/classification', { headers })
    
    return response.data
  }, {
    staleTime: 1000 * 60,
  })

  async function postSelectable(path: string, data: {}, cachedQuery: string) {
    await api.post(`selectables/${path}`, data, { headers }).then(res => {
      const previousSelectable = queryClient.getQueryData<ISelectables[]>(cachedQuery)
  
      if(previousSelectable) {
        previousSelectable.push(res.data)
      }
  
      queryClient.setQueryData(cachedQuery, previousSelectable)
    })
  }
  
  async function removeSelectable(path: string, id: string, cachedQuery: string) {
    console.log(`selectables/${path}/${id}`)
    await api.delete(`selectables/${path}/${id}`, { headers }).then(res => {
      const previousSelectable = queryClient.getQueryData<ISelectables[]>(cachedQuery)
      
      if (previousSelectable) {
        const selectableFiltered = previousSelectable.filter(deae => {
          if (deae.id !== res.data.id) {
            return deae;
          }
          return null;
        })
        
        queryClient.setQueryData(cachedQuery, selectableFiltered)
      }
    })
  }
  
  async function handleSubmitInsertLocal(data: { label: string }, { reset }: { reset(): void }) {
    try {
      await validatePost(data, insertionLocalFormRef)
      await postSelectable('local', data, 'listLocal')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        passErrors(err, insertionLocalFormRef)
      }
    }

    reset()
  }

  async function handleSubmitDeleteLocal(data: {localId: string}, { reset }: { reset(): void }) {
    try {
      await validateDelete(data, deleteLocalFormRef)
      await removeSelectable('local', data.localId, 'listLocal')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        passErrors(err, deleteLocalFormRef)
      }
    }
  }

  async function handleSubmitInsertClassification(data: { label: string }, { reset }: { reset(): void }) {
    try {
      await validatePost(data, insertionClassificationFormRef)
      await postSelectable('classification', data, 'listClassification')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        passErrors(err, insertionClassificationFormRef)
      }
    }

    reset()
  }

  async function handleSubmitDeleteClassification(data: {localId: string}, { reset }: { reset(): void }) {
    try {
      await validateDelete(data, deleteClassificationFormRef)
      await removeSelectable('classification', data.localId, 'listClassification')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        passErrors(err, deleteClassificationFormRef)
      }
    }
  }

  return (
    <div className="container">
      <div className="box">
        <h2>Selecionaveis</h2>
        <h3 className="heading">Local</h3>
        <Form ref={insertionLocalFormRef} onSubmit={handleSubmitInsertLocal}>
          <Input placeholder="insira um novo local" name="label" />
          <button className="button is-primary my-2 is-fullwidth">Adicionar</button>
        </Form>
        <hr />
        <Form ref={deleteLocalFormRef} onSubmit={handleSubmitDeleteLocal}>
          <Select placeholder="selecione..." name="localId" options={local} />
          <button className="button is-danger is-fullwidth my-2">Apagar</button>
        </Form>
      </div>
      {/* ------------------------------- */}
      <div className="box">
        <h2>Selecionaveis</h2>
        <h3 className="heading">classificação</h3>
        <Form ref={insertionClassificationFormRef} onSubmit={handleSubmitInsertClassification}>
          <Input placeholder="insira uma nova classificação" name="label" />
          <button className="button is-primary my-2 is-fullwidth">Adicionar</button>
        </Form>
        <hr />
        <Form ref={deleteClassificationFormRef} onSubmit={handleSubmitDeleteClassification}>
          <Select placeholder="selecione..." name="localId" options={classification} />
          <button className="button is-danger is-fullwidth my-2">Apagar</button>
        </Form>
      </div>
      <Footer />
    </div>
  )
}