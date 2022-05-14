/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Legend from './Legend'
import Optionsfield from './Optionsfield'
import './Mapbox.css'
import data from 'src/assets/updated_sub.json'
import 'mapbox-gl/dist/mapbox-gl.css'
import { CButton, CCallout } from '@coreui/react'
import { getExample } from '../../api'
import { getMap } from '../../api'
import { getMainSuburb } from '../../api'
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

  const [example, setExample] = useState([])
  const loadExample = async () => {
    const example = await getMap()
    setExample(example)
    updateSub(example)
  }
  useEffect(() => {
    console.log(example)
  }, [example])

  const ExampleButton = () => {
    return <CButton onClick={loadExample}>Refresh data</CButton>
  }


  const options = [
    {
      name: 'Offensive language',
      description: 'Number of swear words used',
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

  const updateSub = (updateLs) => {
    // const type = typeof updateLs
    const newDataset = dataset
    for (let i = 0; i < updateLs.length; i++) {
      newDataset['features'][i]['properties']['crime_rate'] = updateLs[i]['crime_rate']
      newDataset['features'][i]['properties']['sent_score'] = updateLs[i]['sent_score']
      newDataset['features'][i]['properties']['no_offend'] = updateLs[i]['no_offensive']
      setDataset(newDataset)
      map.getSource('countries1').setData(dataset)
      console.log(i)
    }

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
    return () => map.remove();
  }, []);


  useEffect(() => {
    paint();
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
      <h1>What influence the crime rate in Melbourne?</h1>
      <CCallout color="dark">
        What influences the crime rate in Melbourne? We create this map that shows the sentiment, the number of swear words used, and the crime rate in different suburbs in Melbourne extracted from Twitter, wanting to explore the potential connections among them. Click the 'Refresh data' button to see the latest data. Switch options below the map to see different information. Click a specific suburb on the map to see its detailed data.
      </CCallout>
      <ExampleButton />
      <div ref={mapContainerRef} className="h600 mt12" />
      <Legend active={active} stops={active.stops} />
      <Optionsfield options={options} property={active.property} changeState={changeState} />
    </div>
  )
}

export default Mapbox
