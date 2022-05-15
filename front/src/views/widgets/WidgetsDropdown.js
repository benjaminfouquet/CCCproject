/* eslint-disable react/prop-types */
import React from 'react'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'

const WidgetsDropdown = ({ selectedSuburbData }) => {
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={selectedSuburbData['total_tweet']}
          title="Nb tweets"
          style={{ paddingBottom: 30 }}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              {selectedSuburbData['no_offensive']}{' '}
              <small>
                (
                {Math.round(
                  (100 * selectedSuburbData['no_offensive']) / selectedSuburbData['total_tweet'],
                  0,
                )}
                %)
              </small>{' '}
            </>
          }
          title="Nb Offensive tweets"
          style={{ paddingBottom: 30 }}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={selectedSuburbData['sent_score'].toFixed(2)}
          title="Sentiment score"
          style={{ paddingBottom: 30 }}
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={selectedSuburbData['crime_rate'].toFixed(2)}
          title="Crime rate"
          style={{ paddingBottom: 30 }}
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
