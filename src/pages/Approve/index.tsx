import { IDeae } from "interfaces/Deae"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { useQuery } from "react-query"
import { api } from "services/api"

export function Approve() {
  const [cookies] = useCookies(['access_token'])
  const [deaes, setDeaes] = useState<IDeae[]>()
  const headers = { Authorization: `Bearer ${cookies.access_token}` }

  useQuery<IDeae[]>('listInvalidDeaes', async () => {
    const response = await api.get('deaes?fields=is_valid&search=false', { headers })
    setDeaes(response.data)
    return response.data;
  }, {
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })

  async function approveDeae(deaeId: string) {
    await api.patch(`validate-deae/${deaeId}`, {}, { headers })
      .then(res => {
        const filteredDeaes = deaes?.filter(deae => {
          if (deae.id !== res.data.id) {
            return deae
          }
        })

        setDeaes(filteredDeaes);
      }).catch(err => {
        console.warn(err)
      })
  }

  async function disapproveDeae(deaeId: string) {
    await api.delete(`deaes/${deaeId}`, { headers }).then(res => {
      const filteredDeaes = deaes?.filter(deae => {
        if (deae.id !== res.data.id) {
          return deae
        }
      })

      setDeaes(filteredDeaes);
    })
  }

  if (deaes?.length === 0) {
    return (
      <h2 className="title">Não há nenhum deae para aprovar</h2>
    )
  }

  return (
    <div className="container">
      {deaes?.map(deae => (
        <div key={deae.id} className="card my-4">
          <div className="card-content">
            <div className="columns">
              <div className="column">
                <h2>Desvio</h2>
                {deae.deviation}
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <h2>Correção</h2>
                {deae.adjustment}
              </div>
            </div>
          </div>
          <div className="columns is-mobile mx-2">
            <div className="column">
              <button className="button is-primary is-fullwidth" onClick={() => approveDeae(deae.id)}>Aprovar</button>
            </div>
            <div className="column">
              <button className="button is-danger is-fullwidth" onClick={() => disapproveDeae(deae.id)}>Reprovar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}