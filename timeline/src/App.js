import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import Timeline from './components/TimelineContainer'
import AddPopup from './components/AddPopup'

import './App.css'

import data from './data'

function App() {
  const [isAddPopupActive, setIsAddPopupActive] = useState(false)
  const [startDay, setStartDay] = useState()

  useEffect(() => setStartDay(DateTime.now()), [])

  return (
    <div className="App">
      {startDay && <Timeline events={data} startDay={startDay} />}

      <button className="add-button" onClick={() => setIsAddPopupActive(!isAddPopupActive)}>
        +
      </button>

      <AddPopup
        open={isAddPopupActive}
        // onSubmit={handleNewEvent}
      />
    </div>
  )
}

export default App
