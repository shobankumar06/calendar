import React from 'react';
import dayjs from 'dayjs';

const groupEvents = (events) => {
  // Sort events by date and time
  const sorted = [...events].sort((a, b) => {
    const aDate = dayjs(`${a.date}T${a.time}`);
    const bDate = dayjs(`${b.date}T${b.time}`);
    return aDate - bDate;
  });

  // Group by month, then date
  const grouped = {};
  sorted.forEach(event => {
    const date = dayjs(event.date);
    const month = date.format('MMMM YYYY');
    const day = date.format('dddd, MMM D');
    if (!grouped[month]) grouped[month] = {};
    if (!grouped[month][day]) grouped[month][day] = [];
    grouped[month][day].push(event);
  });
  return grouped;
};

const EventSummary = ({ events, onDelete }) => {
  const grouped = groupEvents(events);

  return (
    <div className="event-summary" style={{
      background: '#fff',
      borderRadius: '14px',
      boxShadow: '0 4px 16px rgba(80,120,200,0.10)',
      border: '1.5px solid #b6d0ff',
      padding: '1.5rem 1.5rem 1.5rem 1.5rem',
      minWidth: 260,
      maxWidth: 320,
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      fontSize: '1rem',
      color: '#222',
      marginTop: '1rem',
      maxHeight: 420,
      overflowY: 'auto'
    }}>
      <h3 style={{
        color: '#1e40af',
        fontWeight: 700,
        fontSize: '1.3rem',
        marginBottom: '1.2rem',
        letterSpacing: '0.5px'
      }}>Event Summary</h3>
      {Object.entries(grouped).map(([month, days]) => (
        <div key={month} style={{ marginBottom: '1.2rem' }}>
          <div style={{
            color: '#2563eb',
            fontWeight: 600,
            fontSize: '1.1rem',
            marginBottom: '0.5rem',
            borderBottom: '1px solid #e3edff',
            paddingBottom: '0.2rem'
          }}>{month}</div>
          {Object.entries(days).map(([day, dayEvents]) => (
            <div key={day} style={{
              marginLeft: '1rem',
              marginBottom: '0.3rem',
              background: '#f0f6ff',
              borderRadius: '7px',
              padding: '0.4rem 0.7rem'
            }}>
              <div style={{
                fontWeight: 500,
                color: '#475569',
                fontSize: '0.98rem',
                marginBottom: '0.2rem'
              }}>{day}</div>
              <ul style={{
                margin: 0,
                paddingLeft: '1.2rem',
                listStyle: 'disc'
              }}>
                {dayEvents.map((event, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: '0.5rem',
                      fontSize: '0.98rem',
                      borderBottom: '1px solid #e3edff',
                      paddingBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, color: '#2563eb' }}>{event.title}</span>
                      <span style={{ color: '#64748b', marginLeft: 8 }}>
                        at <span style={{ color: '#1e293b', fontWeight: 500 }}>{dayjs(`${event.date}T${event.time}`).format('h:mm A')}</span>
                        <span style={{ marginLeft: 6, color: '#475569' }}>({event.duration})</span>
                      </span>
                      {event.description && (
                        <div style={{
                          fontSize: '0.90em',
                          color: '#555',
                          marginTop: '0.1rem',
                          wordBreak: 'break-word'
                        }}>{event.description}</div>
                      )}
                    </span>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(event)}
                        style={{
                          background: 'transparent',
                          color: '#e11d48',
                          border: 'none',
                          borderRadius: '50%',
                          padding: '0.3rem',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          marginLeft: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = '#fee2e2';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        title="Delete event"
                        aria-label="Delete event"
                      >
                        🗑
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
      {events.length === 0 && (
        <div style={{
          color: '#64748b',
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          No events to display.
        </div>
      )}
    </div>
  );
};

export default EventSummary;