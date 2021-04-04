import React, { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import './app.css'

const App = () => {
    const [personsList, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [notification, setNotification] = useState()
    const [errorMessage, setErrorMessage] = useState()

    useEffect(() => {
        refreshPersons()
    }, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const refreshPersons = () => {
        phonebookService
        .getAll()
        .then(response => setPersons(response.data))   
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()
        if (personsList.every(person => person.name !== newName)) {
            phonebookService
            .create(newName, newNumber)
            .then(response => setPersons(personsList.concat(response.data)))
            setNotification(`${newName} added`)
            setTimeout(() => {
                setNotification(null)
            }, 5000)
            setNewNumber('')
            setNewName('')
        }
        else if(window.confirm(`Name ${newName} already exists. Update number?`)) {
            const targetPerson = personsList.filter(person => person.name === newName)
            updatePerson(targetPerson[0].id)
            
        }
    }

    const handleFilter = (event) => {
        setNewFilter(event.target.value)
    }

    const handleDeleteButton = (person) => (event) => {
        event.preventDefault()
        if(window.confirm(`Confirm deletion of: ${person.name}`)) {
            phonebookService
            .deleteName(person.id)
            .then(() => refreshPersons())
            setNotification(`${person.name} removed`)
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        }
    }

    const updatePerson = (personId) => {
        const newData = {
            name: newName,
            number: newNumber
        }
        phonebookService
        .update(personId, newData)
        .then(() => {
            refreshPersons()
            setNotification(`${newName} updated`)
            setTimeout(() => {
                setNotification(null)
            }, 5000)
        })
        .catch(err => {
            refreshPersons()
            setErrorMessage(`ERROR: The information of ${newName} has been deleted from the server.`)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        })

    }

    const personsToShow = newFilter !== ''
        ? personsList.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
        : personsList



    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={notification}/>
            <ErrorMessage error={errorMessage} />
            <h2>Filter</h2>
            <Filter filter={newFilter} handleFilter={handleFilter}/>
            <h2>Add A Person</h2>
            <AddNumber handleSubmit={addPerson} name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
            <h2>Contacts</h2>
            <Numbers persons={personsToShow} handleDeleteButton={handleDeleteButton} />
        </div>
    )

}

const Numbers = ({persons, handleDeleteButton}) => {
    return (
        <div>
            {persons.map(person =>
            <p key={person.number}>
                {person.name} {person.number} &nbsp;
                <button type='button' onClick={handleDeleteButton(person)}>Delete</button>
            </p>)}
        </div>
    )
}

const Filter = ({filter, handleFilter}) => {
    return (
        <div>
            Filter by name: <input value={filter} onChange={handleFilter} />
        </div>
    )

}

const AddNumber = ({handleSubmit, name, handleNameChange, number, handleNumberChange}) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                    <div>
                        name: <input value={name} onChange={handleNameChange} /> &nbsp;
                        number: <input value={number} onChange={handleNumberChange} />
                    </div>
                    <div>
                        <button
                            type="submit">add
                        </button>
                    </div>
            </form>
        </div>
    )
}

const Notification = ({message}) => {
    if(!message) {
        return null
    }

    else {
        return (
            <div className='notification'>{message}</div>
        )
    }
}

const ErrorMessage = ({error}) => {
    if(!error) {
        return null
    }

    else {
        return (
            <div className='error'>{error}</div>
        )
    }
}

export default App