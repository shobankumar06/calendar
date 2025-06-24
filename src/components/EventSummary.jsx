import React from 'react';

const EventSummary = ({ events }) => (
  <div className="event-summary">
    <h3>Event Summary</h3>
    {events.length === 0 ? (
      <p>No events this month.</p>
    ) : (
      <ul>
        {events.map((event, idx) => (
          <li key={idx}>
            <strong>{event.title}</strong><br />
            {event.date} {event.time && `at ${event.time}`} {event.duration && `(${event.duration})`}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default EventSummary;