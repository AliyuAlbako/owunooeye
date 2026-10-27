
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'

import Home from './pages/Home'
import Article from './pages/Article'
import Category from './pages/Category'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/admin/Login'
import AdminGuard from './components/layout/AdminGuard'
import Dashboard from './pages/admin/Dashboard'
import Articles from './pages/admin/Articles'
import ArticleForm from './pages/admin/ArticleForm'

function NotFound() {
  return (
    <section className="px-5 py-20 text-center">
      <h1 className="text-4xl font-black">404</h1>
      <p className="mt-3 text-slate-600">Page not found.</p>
      <a href="/" className="mt-5 inline-block font-bold text-blue-800">
        Return home
      </a>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
     
        <Route element={<AdminGuard />}>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
         <Route path="/admin/articles" element={<Articles />} />
          <Route path="/admin/articles/new" element={<ArticleForm />} />
          <Route path="/admin/articles/:id/edit" element={<ArticleForm />} />

        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/category/:name" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
