// Wait for the DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
    // Load header
    fetch('../header.html')
      .then(response => response.text())
      .then(html => {
        document.querySelector('header').outerHTML = html;
      })
      .catch(error => console.error("Error loading header:", error));
  
    // Load footer
    fetch('../footer.html')
      .then(response => response.text())
      .then(html => {
        document.querySelector('footer').outerHTML = html;
      })
      .catch(error => console.error("Error loading footer:", error));
  
    // Fetch and display events from JSON
    fetch('../events.json') // Adjust the path if needed
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Initialize logic for the homepage and events page
        const eventsContainer = document.getElementById("events-container");
        const featuredEventsContainer = document.getElementById("events");
        const filterOptions = document.getElementById("filter-options");
  
        if (featuredEventsContainer) {
          // For homepage, display featured events
          displayFeaturedEvents(data);
        }
        if (eventsContainer) {
          // For events page, setup filters and display all events
          setupFilters(data);
          renderEvents(data);
        }
      })
      .catch(error => console.error("Error fetching events:", error));
  });
  
  // Format date from yyyy-mm-dd to dd/mm/yyyy
  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`; // Return formatted date
  }
  
  // Render events based on filter criteria
  function renderEvents(events, month = "all") {
    const eventsContainer = document.getElementById("events-container");
    eventsContainer.innerHTML = ""; // Clear previous content
  
    // Filter events by selected month
    const filteredEvents =
      month === "all"
        ? events
        : events.filter(
            event => new Date(event.date).getMonth() + 1 === parseInt(month)
          );
  
    // Generate HTML for each event
    filteredEvents.forEach(event => {
      const eventHTML = `
        <div class="event-card">
          <img src="${event.image}" alt="${event.name}">
          <div class="event-details">
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <p class="date-time">${formatDate(event.date)} at ${event.time}</p>
            <p class="price">${event.venue}, ${event.location}</p>
            <a href="${event.link}" target="_blank">More Details & Tickets</a>
          </div>
        </div>
      `;
      eventsContainer.innerHTML += eventHTML;
    });
  }
  
  // Set up filter options dynamically and add click event listeners
  function setupFilters(events) {
    const filterOptions = document.getElementById("filter-options");
    if (!filterOptions) return;
  
    const months = Array.from(new Set(events.map(event => new Date(event.date).getMonth() + 1)));
  
    // Generate filter options dynamically
    filterOptions.innerHTML = `
      <li><a href="#" data-month="all">All</a></li>
      ${months
        .map(
          month => `
          <li><a href="#" data-month="${month}">
            ${new Date(2025, month - 1).toLocaleString("en-GB", { month: "long" })}
          </a></li>
        `
        )
        .join("")}
    `;
  
    // Handle click events for filtering
    filterOptions.addEventListener("click", e => {
      e.preventDefault();
      if (e.target.tagName === "A") {
        const month = e.target.getAttribute("data-month");
        renderEvents(events, month);
      }
    });
  }
  
  // Display the first three upcoming events on the homepage
  function displayFeaturedEvents(events) {
    const today = new Date();
    const featuredEventsContainer = document.getElementById("events");
    if (!featuredEventsContainer) return;
  
    featuredEventsContainer.innerHTML = ""; // Clear existing content
  
    // Get the top three upcoming events
    const upcomingEvents = events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  
    // Generate HTML for each event
    upcomingEvents.forEach(event => {
      const eventHTML = `
        <div class="event-card">
          <img src="${event.image}" alt="${event.name}">
          <div class="event-details">
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <p class="date-time">${formatDate(event.date)} at ${event.time}</p>
            <a href="${event.link}" target="_blank">Learn More</a>
          </div>
        </div>
      `;
      featuredEventsContainer.innerHTML += eventHTML;
    });
  }
  