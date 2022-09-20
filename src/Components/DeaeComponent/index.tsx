import classNames from "classnames";
import { IDeae } from "interfaces/Deae";

export function DeaeComponent(deae: IDeae) {
  return (
    <div className={classNames({
      "card my-2": true,
      "has-background-grey-lighter": !deae.is_valid,
    })}>
      <div className="card-header">
        <div className="card-header-title">
          {deae.user.username}
        </div>
      </div>
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <h2>código deae</h2>
            <h3>{deae.id}</h3>
          </div>
        </div>
        <div className="columns is-mobile">
          <div className="column">
            <h2>Classificação</h2>
            <h3>{deae.classification.label}</h3>
          </div>
          <div className="column">
            <h2>Classificação</h2>
            <h3>{deae.status.label}</h3>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h2>Local</h2>
            <h3>{deae.local.label}</h3>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h2>Desvio</h2>
            <h3>{deae.deviation}</h3>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h2>Medida corretiva</h2>
            <h3>{deae.adjustment}</h3>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h2>Data de publicação</h2>
            <h3>{new Date(deae.created_at).toLocaleString()}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}