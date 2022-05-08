/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Legend from './Legend'
import Optionsfield from './Optionsfield'
import './Mapbox.css'
import data from 'src/assets/updated_sub.json'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CButton } from '@coreui/react'
import { getExample } from '../../api'

//pop up
const Popup = ({ routeName, offend, sentiment, crimeRate }) => (
  <div className="popup">
    <h5 className="route-name">{routeName}</h5>
    <div className="route-metric-row">
      <p className="row-value">Offensive tweets {offend}</p>
    </div>
    <p className="route-city">Sentiment {sentiment}</p>
    <p className="route-city">Crime rate {crimeRate}</p>
  </div>
)

mapboxgl.accessToken =
  'pk.eyJ1IjoibHVuYWxpYW5nIiwiYSI6ImNsMmxtY3NvOTBvZTAzbG5xNzQwM2tsaXMifQ.5lgZAlrVz9lZybZTOv6JAQ'
const Mapbox = () => {
  const options = [
    {
      name: 'Offensive language',
      description: 'Number of offensive language',
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
      name: 'Sentiment',
      description: 'Sentiment score',
      property: 'sent_score',
      stops: [
        [0, '#f8d5cc'],
        [0.5, '#f4bfb6'],
        [1, '#f1a8a5'],
        [1.5, '#ee8f9a'],
        [2, '#ec739b'],
        [2.5, '#dd5ca8'],
        [3, '#c44cc0'],
        [5, '#9f43d7'],
        [100, '#6e40e6'],
      ],
    },
    {
      name: 'Crime',
      description: 'Crime rate',
      property: 'crime_rate',
      stops: [
        [0, '#f8d5cc'],
        [10, '#f4bfb6'],
        [50, '#f1a8a5'],
        [100, '#ee8f9a'],
        [500, '#ec739b'],
        [1000, '#dd5ca8'],
        [2500, '#c44cc0'],
        [5000, '#9f43d7'],
        [10000, '#6e40e6'],
        [20000, '#36013F']

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
    map.getSource('countries1').setData(dataset)
  }

  const ExampleButton = () => {
    return <CButton onClick={updateData}>refresh data</CButton>
  }
  const ConnectButton = () => {
    return <CButton onClick={getExample}>connect</CButton>
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
      map.addSource('countries1', {
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
      //add layer for crime rate
      // map.addLayer(
      //   {
      //     id: 'crime',
      //     type: 'circle',
      //     source: 'countries1',
      //     layout: {
      //       'visibility': 'visible'
      //     },
      //     filter: ['has', 'crime_rate'],
      //     paint: {

      //       'circle-color': [
      //         'step',
      //         ['get', 'crime_rate'],
      //         '#51bbd6',
      //         100,
      //         '#f1f075',
      //         750,
      //         '#f28cb1'
      //       ],
      //       'circle-radius': [
      //         'step',
      //         ['get', 'crime_rate'],
      //         2,
      //         100,
      //         3,
      //         750,
      //         4
      //       ]
      //     }
      //   }

      // );

      // map.addLayer(
      //   {
      //     id: 'crime',
      //     type: 'fill',
      //     source: 'countries1',
      //     layout: {
      //       'visibility': 'visible'
      //     },
      //     filter: ['has', 'crime_rate'],
      //     paint: {
      //       'fill-opacity': 0.7,
      //       'fill-outline-color': '#000000',
      //       'fill-color':
      //         [
      //           'step',
      //           ['get', 'crime_rate'],
      //           '#51bbd6',
      //           100,
      //           '#f1f075',
      //           750,
      //           '#f28cb1',
      //           1000,
      //           '#9f43d7'
      //         ],
      //     },
      //   },

      // )


      //layer for offensive lang and sentiment score
      map.addLayer(
        {
          id: 'countries',
          type: 'fill',
          source: 'countries1',
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
              offend={feature?.properties?.no_offend}
              sentiment={feature?.properties?.sent_score}
              crimeRate={feature?.properties?.crime_rate}
            />,
            popupNode,
          )
          popUpRef.current.setLngLat(e.lngLat).setDOMContent(popupNode).addTo(map)
        }
      })

      setMap(map)
    })

    // Clean up on unmount
    //   return () => map.remove()
    // }, [active.property, active.stops])
    return () => map.remove();
  }, []);


  useEffect(() => {
    paint();
    // map.setPaintProperty('crime', 'circle-color', {
    //   property: 'crime_rate',
    //   stops: options[1].stops
    // });
  }, [active]);

  const paint = () => {
    if (map) {
      map.setPaintProperty('countries', 'fill-color', {
        property: active.property,
        stops: active.stops
      });
    }
  };

  //switcher
  const changeState = (i) => {
    setActive(options[i])
    map.setPaintProperty('countries', 'fill-color', {
      property: active.property,
      stops: active.stops,
    })

  }

  return (
    <div>
      <ConnectButton />
      <ExampleButton />
      <div ref={mapContainerRef} className="h600" />
      <Legend active={active} stops={active.stops} />
      <Optionsfield options={options} property={active.property} changeState={changeState} />
    </div>
  )
}

export default Mapbox
