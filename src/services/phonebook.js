import axios from 'axios'
const url = 'http://localhost:3001/api/persons'

const getAll = () => {
    return axios.get(url)
}

const create = (name, number) => {
        const newPersonObj = {name: name, number: number}
        return axios.post(url, newPersonObj)
}

const deleteName = (personId) => {
    return axios.delete(`${url}/${personId}`)
}

/* const update = (personId, newData) => {
    return axios.put(`${url}/${personId}`, newData)
} */

export default {
    getAll: getAll,
    create: create,
    deleteName: deleteName,
    //update: update
}