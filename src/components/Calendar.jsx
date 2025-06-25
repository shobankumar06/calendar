import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import EventList from './EventList'
import EventForm from './EventForm'
import '../styles/calendar.css'; 

const Calendar = ({ events, selectedDate, setSelectedDate, openForm }) => {
  const [showForm, setShowForm] = useState(false)
  const [formDate, setFormDate] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState('');

  const currentYear = selectedDate.year()
  const currentMonth = selectedDate.month()
  const today = dayjs()

  // Generate year options (e.g., 10 years before and after current)
  const years = Array.from({length: 21}, (_, i) => currentYear - 10 + i)
  const months = Array.from({length: 12}, (_, i) => i)

  const startDay = dayjs(`${currentYear}-${currentMonth + 1}-01`).day()
  const daysInMonth = selectedDate.daysInMonth()

  const prevMonth = () => setSelectedDate(selectedDate.subtract(1, 'month'))
  const nextMonth = () => setSelectedDate(selectedDate.add(1, 'month'))

  const getEventsForDate = (dateStr) =>
    events.filter(event => event.date === dateStr)

  const handleAddEvent = (event) => {
    setEvents([...events, event])
  }

  const handlePickerChange = (e) => {
    const { name, value } = e.target
    let newDate = selectedDate
    if (name === 'year') newDate = newDate.year(Number(value))
    if (name === 'month') newDate = newDate.month(Number(value))
    if (name === 'day') newDate = newDate.date(Number(value))
    setSelectedDate(newDate)
  }

  return (
    <div className="calendar">
      <div
        className="calendar-header"
        style={{ position: 'relative' }}
      >
        <button className="nav-btn" onClick={prevMonth}>&lt;</button>
        <button
          className="month-title"
          onClick={() => setShowPicker((prev) => !prev)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 600,
            color: '#2563eb',
            cursor: 'pointer',
            padding: 0,
            position: 'relative'
          }}
          aria-label="Pick month and year"
        >
          {selectedDate.format('MMMM YYYY')}
          {showTooltip && (
            <div className="calendar-tooltip">
              Click to pick a custom date
            </div>
          )}
        </button>
        <button className="nav-btn" onClick={nextMonth}>&gt;</button>
        {showPicker && (
          <div className="calendar-picker-panel">
            <select name="year" value={selectedDate.year()} onChange={handlePickerChange}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select name="month" value={selectedDate.month()} onChange={handlePickerChange}>
              {months.map(m => <option key={m} value={m}>{dayjs().month(m).format('MMMM')}</option>)}
            </select>
            <select name="day" value={selectedDate.date()} onChange={handlePickerChange}>
              {Array.from({length: daysInMonth}, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button
              style={{
                marginLeft: '1rem',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.2rem 0.7rem',
                cursor: 'pointer'
              }}
              onClick={() => setShowPicker(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
      <div className="calendar-weekdays">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
          <div key={day} className="day-name-unique">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {Array(startDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const date = selectedDate.date(i + 1)
          const dateStr = date.format('YYYY-MM-DD')
          const dayEvents = getEventsForDate(dateStr)
          return (
            <div
              key={i}
              className={`day-unique ${date.isSame(today, 'day') ? 'today-unique' : ''}`}
            >
              <button
                className="add-event-btn"
                onClick={e => { e.stopPropagation(); openForm(dateStr); }}
                title="Add event"
                tabIndex={-1}
              >+</button>
              <div className="date-number-unique">{i + 1}</div>
              <EventList events={dayEvents} />
            </div>
          )
        })}
      </div>
      {showForm && (
        <EventForm
          date={formDate}
          onAdd={handleAddEvent}
          onClose={() => setShowForm(false)}
        />
      )}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '1.2rem 2.5rem 1.2rem 1.2rem',
            zIndex: 9999,
            fontSize: '1.2rem',
            fontWeight: 500,
            boxShadow: '0 4px 24px rgba(80,120,200,0.18)',
            minWidth: '300px',
            textAlign: 'center'
          }}
        >
          <button
            onClick={() => setError('')}
            style={{
              position: 'absolute',
              top: '10px',
              right: '18px',
              background: 'transparent',
              border: 'none',
              color: '#b91c1c',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
            aria-label="Close error"
          >×</button>
          {error}
        </div>
      )}
    </div>
  )
}

export default Calendar
