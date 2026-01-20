import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import Layout from '../layouts/layout'
import fetchCategories from '../utils/categoryProvider'
import { AuthProvider } from '../context/authContext'
import { ToastContainer } from 'react-toastify'

function Ecommerce({ Component, pageProps, categories }) {
  return (
    <AuthProvider>
      <Layout categories={categories}>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}

Ecommerce.getInitialProps = async () => {
  const categories = await fetchCategories()
  return {
    categories
  }
}

export default Ecommerce