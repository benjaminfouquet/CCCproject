import axios from 'axios'

export const getExample = async () => axios.get(`exampleagg/`).then((res) => res.data)
