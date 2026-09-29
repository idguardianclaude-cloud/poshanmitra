import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PUNE_CENTER, directionsUrl } from '../data/hospitals.js'

// Free, key-less interactive map using Leaflet + OpenStreetMap tiles. Markers are
// numbered indigo pins (a divIcon, so no bundler icon-path issues). Popups show
// the hospital name with Directions + Call links.
export function HospitalMap({ hospitals }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)

  useEffect(() => {
    if (mapRef.current || !elRef.current) return
    const map = L.map(elRef.current, {
      center: PUNE_CENTER,
      zoom: 12,
      scrollWheelZoom: false,
      attributionControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)
    mapRef.current = map
    layerRef.current = L.layerGroup().addTo(map)
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()
    const withCoords = hospitals.filter((h) => h.lat && h.lng)
    withCoords.forEach((h, i) => {
      const icon = L.divIcon({
        className: '',
        html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#4F46E5;color:#fff;font:600 12px/1 system-ui;box-shadow:0 1px 3px rgba(16,24,40,.3)">${i + 1}</span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })
      const call = h.phone ? `tel:${h.phone.replace(/\s/g, '')}` : null
      const popup = `
        <div style="font:400 13px/1.4 system-ui;min-width:170px">
          <strong>${h.name}</strong><br/>
          <span style="color:#6B7280">${h.distanceKm} km · ${h.speciality}</span><br/>
          <a href="${directionsUrl(h)}" target="_blank" rel="noopener" style="color:#4F46E5">Directions</a>
          ${call ? ` · <a href="${call}" style="color:#4F46E5">Call</a>` : ''}
        </div>`
      L.marker([h.lat, h.lng], { icon }).bindPopup(popup).addTo(layer)
    })
    if (withCoords.length) {
      const bounds = L.latLngBounds(withCoords.map((h) => [h.lat, h.lng]))
      map.fitBounds(bounds.pad(0.2), { animate: false })
    } else {
      map.setView(PUNE_CENTER, 12)
    }
    // Leaflet needs a size recalc after layout settles.
    setTimeout(() => map.invalidateSize(), 60)
  }, [hospitals])

  return <div ref={elRef} className="h-full w-full" aria-label="Map of nearby hospitals" />
}
