import { useMemo, useState } from 'react'
import { ShoppingBag, ShoppingCart, Plus, Minus, Trash2, ExternalLink, Check, Share2, Info } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { useT } from '../lib/i18n.js'
import { storage } from '../lib/storage.js'
import { shareOnWhatsApp } from '../lib/whatsapp.js'
import { shopCategories, products, priceINR, amazonSearch, flipkartSearch } from '../data/shop.js'

export function Shop() {
  const t = useT()
  const [cat, setCat] = useState('')
  const [cart, setCartState] = useState(() => storage.getCart())
  const [cartOpen, setCartOpen] = useState(false)
  const [ordered, setOrdered] = useState(null)

  function persist(next) {
    setCartState(next)
    storage.setCart(next)
  }
  function add(id) {
    persist({ ...cart, [id]: (cart[id] || 0) + 1 })
  }
  function setQty(id, qty) {
    const next = { ...cart }
    if (qty <= 0) delete next[id]
    else next[id] = qty
    persist(next)
  }

  const filtered = useMemo(() => (cat ? products.filter((p) => p.cat === cat) : products), [cat])
  const cartItems = useMemo(
    () => products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [cart]
  )
  const count = cartItems.reduce((a, i) => a + i.qty, 0)
  const total = cartItems.reduce((a, i) => a + i.price * i.qty, 0)

  function shareCart() {
    if (!cartItems.length) return
    const lines = cartItems.map((i) => `• ${i.name} ×${i.qty} — ${priceINR(i.price * i.qty)}`)
    shareOnWhatsApp(`My PoshanMitra shopping list:\n${lines.join('\n')}\n\nIndicative total: ${priceINR(total)}`)
  }
  function placeDemoOrder() {
    setOrdered('PM-' + Math.random().toString(36).slice(2, 8).toUpperCase())
  }

  return (
    <>
      <PageHeader
        title={t('nav.shop')}
        subtitle="Pregnancy & baby essentials — curated for you."
        action={
          <Button variant="secondary" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={16} /> Cart{count > 0 ? ` · ${count}` : ''}
          </Button>
        }
      />

      <div className="mb-5 flex items-start gap-2 rounded-2xl border border-line bg-white shadow-card px-4 py-3 text-sm text-ink-muted">
        <Info size={16} className="shrink-0 text-indigo-500 mt-0.5" />
        <span>Prices are indicative. “Buy” opens a trusted store (Amazon/Flipkart) — we don't hold stock or take payment here. No medicines or supplements are sold; ask your doctor about those.</span>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        <Chip active={cat === ''} onClick={() => setCat('')}>All</Chip>
        {shopCategories.map((c) => (
          <Chip key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</Chip>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border border-line shadow-card p-4 flex flex-col">
            <div className="flex items-start gap-3">
              <span className="w-12 h-12 rounded-2xl bg-canvas flex items-center justify-center text-2xl shrink-0">{p.emoji}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-ink leading-snug">{p.name}</h3>
                <p className="text-sm font-bold text-indigo-600 mt-0.5">{priceINR(p.price)} <span className="text-[11px] font-normal text-ink-faint">onwards</span></p>
              </div>
            </div>
            <p className="mt-2 text-xs text-ink-muted flex-1">{p.why}</p>
            <div className="mt-3 flex items-center gap-2">
              {cart[p.id] ? (
                <div className="inline-flex items-center rounded-xl border border-line">
                  <button onClick={() => setQty(p.id, cart[p.id] - 1)} className="px-2.5 py-1.5 text-ink-muted hover:bg-canvas rounded-l-xl"><Minus size={14} /></button>
                  <span className="px-2 text-sm font-semibold tabular-nums">{cart[p.id]}</span>
                  <button onClick={() => add(p.id)} className="px-2.5 py-1.5 text-ink-muted hover:bg-canvas rounded-r-xl"><Plus size={14} /></button>
                </div>
              ) : (
                <Button size="sm" onClick={() => add(p.id)}><Plus size={14} /> Add</Button>
              )}
              <a href={amazonSearch(p.q)} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
                Buy <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Cart modal */}
      {cartOpen && (
        <Modal open onClose={() => { setCartOpen(false); setOrdered(null) }} title={ordered ? 'Order placed (Demo)' : 'Your cart'}>
          {ordered ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <p className="text-sm font-medium text-ink">Thank you! Reference {ordered}</p>
                <p className="text-sm text-ink-muted mt-0.5">This is a demo order — no payment was taken.</p>
              </div>
              <p className="text-sm text-ink-muted">To actually buy these, use the <span className="font-medium text-ink">Buy</span> links to order from a trusted store, or share your list with family.</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={shareCart}><Share2 size={15} /> Share list</Button>
                <Button onClick={() => { setCartOpen(false); setOrdered(null) }}>Done</Button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingBag size={36} className="mx-auto text-ink-faint" />
              <p className="mt-3 text-sm text-ink-muted">Your cart is empty. Add essentials to plan your shopping.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {cartItems.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 rounded-xl bg-canvas border border-line px-3 py-2">
                    <span className="text-xl">{i.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{i.name}</p>
                      <p className="text-xs text-ink-faint">{priceINR(i.price)} × {i.qty} = {priceINR(i.price * i.qty)}</p>
                    </div>
                    <div className="inline-flex items-center rounded-lg border border-line shrink-0">
                      <button onClick={() => setQty(i.id, i.qty - 1)} className="px-2 py-1 text-ink-muted hover:bg-white"><Minus size={13} /></button>
                      <span className="px-1.5 text-sm font-semibold tabular-nums">{i.qty}</span>
                      <button onClick={() => add(i.id)} className="px-2 py-1 text-ink-muted hover:bg-white"><Plus size={13} /></button>
                    </div>
                    <a href={amazonSearch(i.q)} target="_blank" rel="noopener noreferrer" aria-label="Buy" className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 shrink-0"><ExternalLink size={15} /></a>
                    <button onClick={() => setQty(i.id, 0)} aria-label="Remove" className="p-1.5 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50 shrink-0"><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Indicative total</span>
                <span className="text-lg font-bold text-ink">{priceINR(total)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={placeDemoOrder}><Check size={16} /> Place order (Demo)</Button>
                <Button variant="secondary" onClick={shareCart}><Share2 size={15} /> Share list</Button>
              </div>
              <p className="text-[11px] text-ink-faint">Demo checkout — no payment is taken. Use the Buy links to purchase from a store.</p>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-line text-ink-muted hover:bg-canvas'}`}
    >
      {children}
    </button>
  )
}
