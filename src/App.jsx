import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventSummary from './components/EventSummary';


function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState('');
  const [error, setError] = useState(''); // <-- Add this

  useEffect(() => {
    fetch('/Event.json')
      .then(res => res.json())
      .then(data => setEvents(data || []))
      .catch(err => console.error('Failed to load events:', err));
  }, []);

  const addEvent = (event) => {
    // Check for overlap (same date and time)
    const overlap = events.some(
      e => e.date === event.date && e.time === event.time
    );
    if (overlap) {
      setError('An event already exists at this date and time!');
      return;
    }
    setEvents((prevEvents) => [...prevEvents, event]);
    setError(''); // Clear error on successful add
  };

  const openForm = (dateStr) => {
    setFormDate(dateStr);
    setShowForm(true);
    setError(''); // Clear error when opening form
  };

  const eventsForSelectedDate = selectedDate
    ? events.filter(event => event.date === selectedDate.format('YYYY-MM-DD'))
    : [];

  return (
    <div className="calendar-layout">
      <div style={{ flex: 1 }}>
        <h1>Event Calendar</h1>
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setError('')}
              style={{
                position: 'absolute',
                top: '6px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: '#b91c1c',
                fontSize: '1.2rem',
                cursor: 'pointer',
                lineHeight: 1
              }}
              aria-label="Close error"
            >×</button>
            {error}
          </div>
        )}
        <Calendar
          events={events}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          openForm={openForm}
        />
        {showForm && (
          <EventForm
            date={formDate}
            onAdd={addEvent}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
      <EventSummary events={events} />
    </div>
  );
}

export default App;