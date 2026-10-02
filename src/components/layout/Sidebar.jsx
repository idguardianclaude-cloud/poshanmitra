import { NavLink } from 'react-router-dom'
import {
  Home,
  MessageSquare,
  CalendarCheck,
  Salad,
  PlaySquare,
  Landmark,
  Megaphone,
  Building2,
  BarChart3,
  Heart,
  Timer,
} from 'lucide-react'
import { LogoMark } from '../Logo.jsx'
import { Illustration } from '../Illustration.jsx'
import { useT } from '../../lib/i18n.js'

const NAV = [
  { key: 'dashboard', icon: Home, to: '/' },
  { key: 'chat', icon: MessageSquare, to: '/chat' },
  { key: 'checkup', icon: CalendarCheck, to: '/checkup', pill: 'new' },
  { key: 'diet', icon: Salad, to: '/diet' },
  { key: 'videos', icon: PlaySquare, to: '/videos' },
  { key: 'schemes', icon: Landmark, to: '/schemes' },
  { key: 'campaigns', icon: Megaphone, to: '/campaigns' },
  { key: 'hospitals', icon: Building2, to: '/hospitals' },
  { key: 'reports', icon: BarChart3, to: '/reports' },
  { key: 'tools', icon: Timer, to: '/tools' },
]

export function Sidebar({ open, onNavigate }) {
  const t = useT()
  return (
    <aside
      className={`fixed z-40 inset-y-0 left-0 w-[260px] bg-white border-r border-line flex flex-col transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Brand */}
      <div className="px-5 py-5 flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-600 text-white shrink-0">
          <LogoMark size={20} />
        </span>
        <div className="leading-tight">
          <p className="font-bold text-ink">{t('common.appName')}</p>
          <p className="text-[11px] text-ink-faint mt-0.5">{t('common.tagline')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV.map(({ key, icon: Icon, to, pill }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-ink-muted hover:bg-canvas'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
                <span className="flex-1">{t(`nav.${key}`)}</span>
                {pill && (
                  <span className="rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5">
                    {t(`nav.${pill}`)}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer help card */}
      <div className="p-3">
        <div className="rounded-2xl bg-indigo-50 p-4 flex flex-col items-center text-center">
          <Illustration name="pregnant-seated" size={72} />
          <p className="mt-2 text-[13px] font-medium text-ink flex items-center gap-1">
            {t('nav.helpCard')}
            <Heart size={13} className="text-indigo-600" fill="#4F46E5" />
          </p>
        </div>
      </div>
    </aside>
  )
}
