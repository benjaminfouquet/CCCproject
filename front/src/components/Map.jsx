import React, { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet.heat'
import { rdmAddresses } from './addressPoints'

export default function Map() {
  useEffect(() => {
    var map = L.map('map').setView([-37.840935, 144.946457], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const points = rdmAddresses
      ? rdmAddresses.map((p) => {
          return [p[0], p[1]]
        })
      : []

    L.heatLayer(points).addTo(map)
  }, [])

  return <div id="map" style={{ height: '100vh' }}></div>
}
