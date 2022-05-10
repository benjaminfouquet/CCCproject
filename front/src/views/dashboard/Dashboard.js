import React from 'react'

import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CProgress, CRow } from '@coreui/react'
import { CChartLine, CChartDoughnut, CChartBar } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WordCloud from '../../components/WordCloud'

const Dashboard = () => {
  const progressExample = [
    { title: 'Number of Tweets', value: '29.703 Tweets', percent: 100, color: 'blue' },
    { title: 'Number of Offensive Tweets', value: '24.093 Tweets', percent: 100, color: 'red' },
  ]

  const randData = (size, max) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max))
  }

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
  const nbTweets = randData(24, 10000)
  const nbOffTweets = randData(24, 5000)
  const today = new Date()

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Tweets and Offensive Tweets
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
                  label: 'My First dataset',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: nbTweets,
                  fill: true,
                },
                {
                  label: 'My Third dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: nbOffTweets,
                },
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
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 2 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>{item.value}</strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Most popular offensive words</CCardHeader>
            <WordCloud />
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Most offensive words</CCardHeader>
            <WordCloud />
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Doughnut Chart</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['Positive', 'Neutral', 'Negative'],
                  datasets: [
                    {
                      backgroundColor: ['#41B883', '#00D8FF', '#DD1B16'],
                      data: [1800, 202, 1450],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Bar Chart</CCardHeader>
            <CCardBody>
              <CChartBar
                data={{
                  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                  datasets: [
                    {
                      label: 'GitHub Commits',
                      backgroundColor: '#f87979',
                      data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                    },
                  ],
                }}
                labels="months"
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <WidgetsBrand withCharts />
    </>
  )
}

export default Dashboard
