import axios from 'axios'

export const getExample = async () => axios.get(`exampleagg/`).then((res) => res.data)

export const getMap = async () => axios.get(`aggmap/`).then((res) => res.data)

export const getMainSuburb = async () => axios.get(`mainsuburb/`).then((res) => res.data)
