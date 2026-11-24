import { Suspense, useEffect, useRef, useState } from 'react'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Brand from '../components/Brand.jsx'
import Footer from '../components/Footer.jsx'
import { PageLoading } from '../components/PageLoadState.jsx'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import './AppLayout.css'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Report a problem', to: '/signaler' },
  { label: 'News & events', to: '/actualites' },
]

const pageTitles = {
  services: 'Municipal services',
  signaler: 'Report a problem',
  'tableau-de-bord': 'My dashboard',
  signalements: 'Report tracking',
  actualites: 'News & events',
  'administration-demo': 'Demo administration',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerFloating, setHeaderFloating] = useState(false)
  const siteRef = useRef(null)
  const toggleRef = useRef(null)
  const mainRef = useRef(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    const segment = pathname.split('/')[1]
    const pageTitle = segment && (pageTitles[segment] || 'Page not found')
    document.title = pageTitle
      ? `${pageTitle} · SmartRif Al Hoceima`
      : 'SmartRif Al Hoceima · Citizen portal'

    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      window.scrollTo(0, 0)
      mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname])

  useEffect(() => {
    let wasFloating = false

    function updateHeader() {
      const isFloating = window.scrollY > 32
      if (wasFloating === isFloating) return
      wasFloating = isFloating
      setHeaderFloating(isFloating)
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useScrollReveal(siteRef, pathname)

  function closeMenu(event) {
    if (menuOpen && event.key === 'Escape') {
      setMenuOpen(false)
      toggleRef.current?.focus({ preventScroll: true })
    }
  }

  return (
    <div className="site" ref={siteRef}>
      <a className="skip-link" href="#contenu">Skip to content</a>
      <header className={`site-header${headerFloating ? ' is-floating' : ''}`} onKeyDown={closeMenu}>
        <div className="header-inner">
          <Brand />
          <button
            className="menu-toggle"
            type="button"
            ref={toggleRef}
            aria-controls="navigation-principale"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <nav
            id="navigation-principale"
            className={`site-nav ${menuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
          >
            {navigation.map(({ label, to }) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}>
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/tableau-de-bord"
              className={pathname.startsWith('/signalements/') ? 'dashboard-link active' : 'dashboard-link'}
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              My dashboard
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="contenu" ref={mainRef} tabIndex={-1}>
        <Suspense key={pathname} fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
