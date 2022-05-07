/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Legend from './Legend'
import Optionsfield from './Optionsfield'
import './Mapbox.css'
import data from '../assets/new_boundary.json'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CButton } from '@coreui/react'

//pop up
const Popup = ({ routeName, routeNumber, city, type }) => (
  <div className="popup">
    <h4 className="route-name">{routeName}</h4>
    <div className="route-metric-row">
      <h5 className="row-title">undecide #</h5>
      <div className="row-value">{routeNumber}</div>
    </div>
    <div className="route-metric-row">
      <h5 className="row-title">Offensive tweets</h5>
      <div className="row-value">{type}</div>
    </div>
    <p className="route-city">Sentiment {city}</p>
  </div>
)

mapboxgl.accessToken =
  'pk.eyJ1IjoibHVuYWxpYW5nIiwiYSI6ImNsMmxtY3NvOTBvZTAzbG5xNzQwM2tsaXMifQ.5lgZAlrVz9lZybZTOv6JAQ'
const Mapbox = () => {
  const options = [
    {
      name: 'Population',
      description: 'Estimated total population',
      property: 'no_offend',
      stops: [
        [0, '#f8d5cc'],
        [1, '#f4bfb6'],
        [5, '#f1a8a5'],
        [10, '#ee8f9a'],
        [50, '#ec739b'],
        [100, '#dd5ca8'],
        [250, '#c44cc0'],
        [500, '#9f43d7'],
        [1000, '#6e40e6'],
      ],
    },
    {
      name: 'GDP',
      description: 'Estimate total GDP in millions of dollars',
      property: 'sent_score',
      stops: [
        [0, '#f8d5cc'],
        [1, '#f4bfb6'],
        [5, '#f1a8a5'],
        [10, '#ee8f9a'],
        [50, '#ec739b'],
        [100, '#dd5ca8'],
        [250, '#c44cc0'],
        [500, '#9f43d7'],
        [1000, '#6e40e6'],
      ],
    },
  ]
  const mapContainerRef = useRef(null)
  const [active, setActive] = useState(options[0])
  const [map, setMap] = useState(null)
  const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
  const [dataset, setDataset] = useState(data)

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max)
  }

  const updateData = () => {
    const rdmInt = getRandomInt(4)
    const newDataset = dataset
    if (newDataset['features'][rdmInt]['properties']['no_offend'] === 1000)
      newDataset['features'][rdmInt]['properties']['no_offend'] = 50
    else {
      newDataset['features'][rdmInt]['properties']['no_offend'] = 1000
    }
    setDataset(newDataset)
    map.getSource('countries').setData(dataset)
  }

  const ExampleButton = () => {
    return <CButton onClick={updateData}></CButton>
  }

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [144.946457, -37.840935],
      zoom: 10,
    })

    map.on('load', () => {
      map.addSource('countries', {
        type: 'geojson',
        data,
      })

      map.setLayoutProperty('country-label', 'text-field', [
        'format',
        ['get', 'name'],
        { 'font-scale': 1.2 },
        '\n',
        {},
        ['get', 'name'],
        {
          'font-scale': 0.8,
          'text-font': ['literal', ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']],
        },
      ])

      map.addLayer(
        {
          id: 'countries',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-opacity': 0.7,
            'fill-outline-color': '#000000',
          },
        },
        'country-label',
      )

      map.setPaintProperty('countries', 'fill-color', {
        property: active.property,
        stops: active.stops,
      })

      //pop up
      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['countries'],
        })
        if (features.length > 0) {
          const feature = features[0]
          // create popup node
          const popupNode = document.createElement('div')
          ReactDOM.render(
            <Popup
              routeName={feature?.properties?.name}
              routeNumber={feature?.properties?.loc_pid}
              city={feature?.properties?.no_offend}
              type={feature?.properties?.sent_score}
            />,
            popupNode,
          )
          popUpRef.current.setLngLat(e.lngLat).setDOMContent(popupNode).addTo(map)
        }
      })

      setMap(map)
    })

    // Clean up on unmount
    return () => map.remove()
  }, [active.property, active.stops])

  const changeState = (i) => {
    setActive(options[i])
    map.setPaintProperty('countries', 'fill-color', {
      property: active.property,
      stops: active.stops,
    })
  }
  //add pop up function

  return (
    <div>
      <ExampleButton />
      <div ref={mapContainerRef} className="h600" />
      <Legend active={active} stops={active.stops} />
      <Optionsfield options={options} property={active.property} changeState={changeState} />
    </div>
  )
}

export default Mapbox
