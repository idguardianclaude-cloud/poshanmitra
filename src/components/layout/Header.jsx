import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Globe, Bell, ChevronDown, Check, Trash2 } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { LANGS, useT } from '../../lib/i18n.js'

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

export function Header({ onToggleSidebar }) {
  const { profile, lang, setLang, logout, deleteAllData } = useProfile()
  const t = useT()
  const navigate = useNavigate()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const langRef = useRef(null)
  const menuRef = useRef(null)
  useOutsideClose(langRef, () => setLangOpen(false))
  useOutsideClose(menuRef, () => setMenuOpen(false))

  const name = profile?.name || 'Priya Sharma'

  const handleDelete = () => {
    if (window.confirm(t('header.deleteConfirm'))) {
      deleteAllData()
      navigate('/login')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-white border-b border-line flex items-center gap-3 px-4 lg:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
        className="p-2 rounded-xl text-ink-muted hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            placeholder={t('header.search')}
            className="w-full rounded-xl border border-line bg-canvas pl-9 pr-16 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-ink-faint border border-line rounded px-1.5 py-0.5 bg-white">
            Ctrl + K
          </kbd>
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      {/* Language */}
      <div className="relative" ref={langRef}>
        <button
          type="button"
          onClick={() => setLangOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm text-ink hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Globe size={16} />
          <span className="hidden sm:inline">
            {LANGS.find((l) => l.code === lang)?.label}
          </span>
          <ChevronDown size={14} />
        </button>
        {langOpen && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-line bg-white shadow-card py-1 z-40">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code)
                  setLangOpen(false)
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-ink hover:bg-canvas"
                lang={l.code}
              >
                {l.label}
                {lang === l.code && <Check size={15} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <button
        type="button"
        aria-label="Notifications, 3 unread"
        className="relative p-2 rounded-xl text-ink-muted hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Bell size={19} />
        <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center px-1">
          3
        </span>
      </button>

      {/* Avatar menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            {name.charAt(0)}
          </span>
          <span className="hidden sm:block text-left leading-tight">
            <span className="block text-sm font-medium text-ink">{name}</span>
            <span className="block text-[11px] text-ink-faint">{t('common.pregnantWoman')}</span>
          </span>
          <ChevronDown size={14} className="text-ink-faint" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-line bg-white shadow-card py-1 z-40 text-sm">
            {['profile', 'settings', 'notifications', 'language', 'help'].map((item) => (
              <button
                key={item}
                className="w-full text-left px-3 py-2 text-ink hover:bg-canvas"
                onClick={() => setMenuOpen(false)}
              >
                {t(`header.${item}`)}
              </button>
            ))}
            <div className="my-1 border-t border-line" />
            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 text-ink hover:bg-canvas flex items-center gap-2"
            >
              <Trash2 size={15} className="text-ink-muted" />
              {t('header.deleteData')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-ink hover:bg-canvas"
            >
              {t('header.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
