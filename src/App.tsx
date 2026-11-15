import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import HowItWorks from './pages/HowItWorks'
import MenopauseAssessment from './pages/MenopauseAssessment'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import SkipToContent from './components/SkipToContent'
import ConsentBanner from './components/ConsentBanner'
import LiquidBackground from './components/LiquidBackground'

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col font-sans text-brand-deep">
      <LiquidBackground />
      <SkipToContent />
      <Header />
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/menopause-assessment" element={<MenopauseAssessment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  )
}
