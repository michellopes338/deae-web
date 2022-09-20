import axios from "axios";


function decodeCookies() {
  const cookies = document.cookie.split('; ');
  const entries = cookies.map(cookie => {
    return cookie.split('=')
  })

  return Object.fromEntries(entries);
}

function redirect(pathname: string) {
  window.location.replace(pathname);
}

const cookies = decodeCookies()

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 1000,
})


api.interceptors.response.use(
  (res) => {
    return res;
  }, async (error) => {
    if (error.response.status === 401 && cookies.access_token) {
      const headers = {
        refresh: cookies.refresh_token
      }
      await api.post('auth/refresh', {}, { headers })
        .then(res => {
          if (res.status === 200) {
            document.cookie = `access_token=${res.data.access_token};`;
            document.cookie = `refresh_token=${res.data.refresh_token};`;
            // window.location.reload();
          }

          if (res.status === 403) {
            if (window.location.pathname !== '/login') {
              redirect('/login')
            }
          }
        }
      )
    }
    if (error.response.status === 401 && !cookies.access_token) {
      redirect('/login')
    }
    return error;
  }
);
