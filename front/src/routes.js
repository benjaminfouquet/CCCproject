import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Mapbox = React.lazy(() => import('./views/Map/Mapbox'))
const FoodMap = React.lazy(() => import('./views/FoodMap/FoodMap'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Map', name: 'Mapbox', element: Mapbox },
  { path: '/FoodMap', name: 'FoodMap', element: FoodMap },
]

export default routes
