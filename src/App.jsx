import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Calendar from './components/Calendar';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventSummary from './components/EventSummary';


// Helper to get event end time
function getEventEnd(event) {
  const start = dayjs(`${event.date}T${event.time}`);
  if (event.duration.endsWith('h')) {
    return start.add(parseInt(event.duration), 'hour');
  } else if (event.duration.endsWith('m')) {
    return start.add(parseInt(event.duration), 'minute');
  }
  return start;
}


function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/Event.json')
      .then(res => res.json())
      .then(data => setEvents(data || []))
      .catch(err => console.error('Failed to load events:', err));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const addEvent = (event) => {
    // Check for overlap (same date and time)
    const overlap = events.some(
      e => e.date === event.date && e.time === event.time
    );
    if (overlap) {
      setError('Warning: An event already exists at this date and time!');
    }
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const deleteEvent = (eventToDelete) => {
    setEvents(events =>
      events.filter(
        event =>
          !(
            event.date === eventToDelete.date &&
            event.time === eventToDelete.time &&
            event.title === eventToDelete.title
          )
      )
    );
  };

  const openForm = (dateStr) => {
    setFormDate(dateStr);
    setShowForm(true);
    setError('');
  };

  // Only keep events that have not ended yet
  const now = dayjs();
  const activeEvents = events.filter(event => getEventEnd(event).isAfter(now));

  return (
    <div className="calendar-layout">
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, padding: 0 }}>Event Calendar</h1>
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
      <div style={{ width: 320, minWidth: 260, maxWidth: 320, position: 'relative', minHeight: 100 }}>
        {error && (
          <div className="toast-error">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="Close error">×</button>
          </div>
        )}
        <EventSummary events={events} onDelete={deleteEvent} />
      </div>
    </div>
  );
}

export default App;