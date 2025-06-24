import React from 'react';

const EventList = ({ events }) => (
  <div className="event-list">
    {events.map((event, idx) => (
      <div className="event-item" key={idx} title={event.description}>
        <strong>{event.title}</strong>
        <div>
          {event.time} ({event.duration})
        </div>
      </div>
    ))}
  </div>
);

export default EventList;