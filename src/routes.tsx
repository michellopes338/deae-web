import { AddDeae } from "pages/AddDeae";
import { Admin } from "pages/Admin";
import { AdminConfigs } from "pages/AdminConfigs";
import { Approve } from "pages/Approve";
import { EditaDeae } from "pages/EditaDeae";
import { MyDeaes } from "pages/MyDeaes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./Components/Header/Header";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

export function AppRoute() {
  return (
    <div className="container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/meus-deaes" element={<MyDeaes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/aprovar-deae" element={<Approve />} />
          <Route path="/admin/configuracoes" element={<AdminConfigs />} />
          <Route path="/adicionar-deae" element={<AddDeae />} />
          <Route path="/meus-deaes/edita/:id" element={<EditaDeae />} />
        </Routes>
      </Router>
    </div>
  )
}