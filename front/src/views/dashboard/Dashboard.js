import React, { useState, useEffect } from 'react'

import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect, CCardFooter } from '@coreui/react'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import { getMainSuburb } from '../../api'
import { words } from '../../assets/words'

// import WidgetsBrand from '../widgets/WidgetsBrand'
import WordCloud from '../../components/WordCloud'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const [suburbData, setSuburbData] = useState([])
  const [suburbSentScores, setSuburbSentScores] = useState([])
  const [selectedSuburb, setSelectedSuburb] = useState(0)
  useEffect(() => {
    const newsuburbSentScore = suburbData.map((suburb) => suburb['sent_score'])
    setSuburbSentScores(newsuburbSentScore)
  }, [suburbData])

  const selectOptions = [
    'CARLTON',
    'CARLTON NORTH',
    'DOCKLANDS',
    'EAST MELBOURNE',
    'FLEMINGTON',
    'KENSINGTON',
    'MELBOURNE',
    'NORTH MELBOURNE',
    'PARKVILLE',
    'PORT MELBOURNE',
    'SOUTH MELBOURNE',
    'SOUTH YARRA',
    'SOUTHBANK',
    'WEST MELBOURNE',
  ]
  const labels = [
    '0:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '1400',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]

  const today = new Date()

  const fetchSuburbData = async () => {
    const newSuburbData = await getMainSuburb()
    setSuburbData(newSuburbData)
  }

  const perc2color = (
    perc,
    transparency = true,
    min = Math.min(...suburbSentScores),
    max = Math.max(...suburbSentScores),
  ) => {
    var base = max - min

    if (base === 0) {
      perc = 100
    } else {
      perc = ((perc - min) / base) * 100
    }
    var r,
      g,
      b = 0
    if (perc < 50) {
      r = 255
      g = Math.round(5.1 * perc)
    } else {
      g = 255
      r = Math.round(510 - 5.1 * perc)
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1
    const transp = transparency ? '99' : ''
    return '#' + ('000000' + h.toString(16)).slice(-6) + transp
  }

  useEffect(() => {
    fetchSuburbData()
  }, [])

  return (
    <>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Select a suburb</strong>
          </CCardHeader>
          <CCardBody>
            <CFormSelect
              aria-label="Default select example"
              onChange={(e) => {
                setSelectedSuburb(parseInt(e.target.value))
              }}
            >
              {selectOptions.map((option, index) => (
                <option key={option} value={index}>
                  {option}
                </option>
              ))}
            </CFormSelect>
          </CCardBody>
        </CCard>
      </CCol>
      <div>
        <CCard className="mb-4 mt-4">
          <CCardHeader>Crime rates, Tweets and Sentiment by suburb</CCardHeader>
          <CCardBody>
            <CChartBar
              //city of melbourne suburb
              data={{
                labels:
                  suburbData.length > 0 ? suburbData.map((suburb) => suburb['region_full']) : [],
                datasets: [
                  {
                    label: 'crime rate',
                    yAxisID: 'A',
                    data:
                      suburbData.length > 0 ? suburbData.map((suburb) => suburb['crime_rate']) : [],
                    backgroundColor:
                      suburbData.length > 0
                        ? suburbData.map((suburb) => perc2color(suburb['sent_score'], false))
                        : '#F87979',
                  },
                  {
                    label: 'no.of offensive tweets',
                    yAxisID: 'B',
                    data:
                      suburbData.length > 0
                        ? suburbData.map((suburb) => suburb['no_offensive'])
                        : [],
                    backgroundColor:
                      suburbData.length > 0
                        ? suburbData.map((suburb) => perc2color(suburb['sent_score']))
                        : '#962E1A',
                  },
                ],
              }}
              options={{
                scales: {
                  A: {
                    type: 'linear',
                    position: 'left',
                  },
                  B: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </CCardBody>
          <CCardFooter>
            <CRow xs={{ cols: 2 }} md={{ cols: 5 }} className="text-center">
              <CCol className="mb-sm-2 mb-0">Color scaled on the sentiment score</CCol>
              <CCol className="mb-sm-2 mb-0">
                <img
                  src="https://cloud.githubusercontent.com/assets/928116/16114032/70c167ea-33bf-11e6-9265-0e98f1ba805b.png"
                  alt="output"
                ></img>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </div>
      {suburbData.length > 0 ? (
        <WidgetsDropdown selectedSuburbData={suburbData[selectedSuburb]} />
      ) : (
        <></>
      )}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Offensive Tweets by Hour
              </h4>
              <div className="small text-medium-emphasis">{today.toLocaleDateString('en-AU')}</div>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: labels,
              datasets: [
                {
                  label: 'Nb tweets',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data:
                    suburbData.length > 0 ? suburbData[selectedSuburb]['offensive_by_hour'] : [],
                  fill: true,
                },
                // {
                //   label: 'Proportion of offensive tweets',
                //   backgroundColor: 'transparent',
                //   borderColor: getStyle('--cui-danger'),
                //   pointHoverBackgroundColor: getStyle('--cui-danger'),
                //   borderWidth: 1,
                //   borderDash: [8, 5],
                //   data:
                //     suburbData.length > 0
                //       ? suburbData[selectedSuburb]['offensive_by_hour'] /
                //         suburbData[selectedSuburb]['total_by_hour']
                //       : [],
                // },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 3),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>

      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Most popular words</CCardHeader>
            <WordCloud
              words={suburbData[selectedSuburb] ? suburbData[selectedSuburb]['word_freq'] : words}
            />
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Most popular offensive words</CCardHeader>
            <WordCloud
              words={
                suburbData[selectedSuburb] ? suburbData[selectedSuburb]['word_freq_neg'] : words
              }
            />
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
