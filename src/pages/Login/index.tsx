import { FormLogin } from './FormComponent';
import './login.css';

export function Login() {
  return (
    <div className="wrapper">
      <div className="grid mx-2">
        <div className="grid-row is-background-primary">
        </div>
        <FormLogin />
      </div>
    </div>
  )
}