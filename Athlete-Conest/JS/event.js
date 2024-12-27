document.addEventListener('DOMContentLoaded', async () => {
  const eventsContainer = document.getElementById('eventsContainer');

  try {
    const response = await fetch('/events');
    const events = await response.json();

    if (events.length === 0) {
      eventsContainer.innerHTML = '<p>No events found.</p>';
      return;
    }

    eventsContainer.innerHTML = '';

    events.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event');

      eventDiv.innerHTML = `
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${event.contactDetails}</p>
        
        ${event.images.map(img => `<img src="${img}" alt="Event Image" class="event-image">`).join('')}
        ${event.videos.map(video => `<video controls src="${video}" class="event-video"></video>`).join('')}
      `;

      eventsContainer.appendChild(eventDiv);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    eventsContainer.innerHTML = '<p>Failed to load events. Please try again later.</p>';
  }
});
