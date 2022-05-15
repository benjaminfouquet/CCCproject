import React, { Component } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
    CChartBar,
    CChartDoughnut,
    CChartLine,
    CChartPie,
    CChartPolarArea,
    CChartRadar,
} from '@coreui/react-chartjs'


const BCharts = () => {

    return (<div><CCard className="mb-4 mt-4">
        <CCardHeader>Bar Chart</CCardHeader>
        <CCardBody>
            <CChartBar
                //city of melbourne suburb
                data={{
                    labels: ['Carlton', 'Docklands', 'East Melbourne', 'Kensington', 'North Melbourne', 'Parkville', 'Southbank', 'South Yarra', 'West Melbourne', 'Melbourne'],
                    datasets: [
                        {
                            label: 'crime rate',
                            backgroundColor: '#f87979',
                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                        },
                        {
                            label: 'no.of offensive tweets',
                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                            backgroundColor: '#962e1a'

                        },
                        {
                            label: 'sentiment score',
                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                            backgroundColor: '#962e1a'

                        }

                    ],
                }}
                labels="months"
            />
        </CCardBody>
    </CCard></div>)

}

export default BCharts