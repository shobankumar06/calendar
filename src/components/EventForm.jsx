import React, { useState } from 'react';

const EventForm = ({ date, onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !time || !duration) return;
    onAdd({
      date,
      title,
      time,
      duration,
      description,
    });
    setTitle('');
    setTime('');
    setDuration('');
    setDescription('');
    onClose();
  };

  return (
    <div className="event-form-modal">
      <div className="event-form-content">
        <h3>Add Event for {date}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="time"
            placeholder="Time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g. 1h, 30m)"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
