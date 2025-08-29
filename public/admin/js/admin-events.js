document.addEventListener("DOMContentLoaded", () => {
  const adminToken = localStorage.getItem("adminToken");
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  // Redirect if not logged in
  if (!adminToken || !adminUser.id || adminUser.userType !== "admin") {
    return (window.location.href = "/admin/login.html");
  }

  // Set admin name
  document.getElementById("adminName").textContent = adminUser.name;

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login.html";
  });

  // Helpers
  async function apiRequest(url, method = "GET", body = null) {
    try {
      console.log(`[API REQUEST] ${method} ${url}`, body); // DEBUG
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });
      return await res.json();
    } catch (err) {
      console.error("API Error:", err);
      return { success: false, message: "Network error" };
    }
  }

  const modal = document.getElementById("eventModal");
  const form = document.getElementById("eventForm");

  function openModal(title, event = null) {
    console.log("[MODAL] Opening:", title, event); // DEBUG
    document.getElementById("modalTitle").textContent = title;
    form.reset();
    document.getElementById("eventId").value = event?.id || "";
    if (event) {
      document.getElementById("eventTitle").value = event.title || "";
      document.getElementById("eventDate").value = event.date || "";
      document.getElementById("eventTime").value = event.time || "";
      document.getElementById("eventVenue").value = event.venue || "";
      document.getElementById("eventDescription").value =
        event.description || "";
    }
    modal.style.display = "block";
  }

  function closeModal() {
    console.log("[MODAL] Closing"); // DEBUG
    modal.style.display = "none";
  }

  document.querySelector(".close").onclick = closeModal;
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });  

  // Load & display events
  async function loadEvents() {
    console.log("[EVENTS] Loading events..."); // DEBUG
    const data = await apiRequest("/api/admin/events");
    const events = data.events || data.data || [];
    const tbody = document.getElementById("eventsTableBody");
    tbody.innerHTML = "";

    if (!data.success || !events.length) {
      tbody.innerHTML = `<tr><td colspan="5">${
        data.message || "No events found"
      }</td></tr>`;
      return;
    }

    events.forEach((ev) => {
      tbody.insertAdjacentHTML(
        "beforeend",
        `
                <tr>
                    <td>${ev.id}</td>
                    <td>${ev.title}</td>
                    <td>${formatDate(ev.date)}</td>
                    <td>${ev.venue}</td>
                    <td>
                        <button class="btn-edit" data-id="${
                          ev.id
                        }">Edit</button>
                        <button class="btn-delete" data-id="${
                          ev.id
                        }">Delete</button>
                    </td>
                </tr>
            `
      );
    });
  }

  // CRUD actions
  async function saveEvent(e) {
    e.preventDefault();
    console.log("[FORM] SaveEvent triggered"); // DEBUG

    const id = document.getElementById("eventId").value;
    const eventData = {
      title: document.getElementById("eventTitle").value,
      date: document.getElementById("eventDate").value,
      time: document.getElementById("eventTime").value,
      venue: document.getElementById("eventVenue").value,
      description: document.getElementById("eventDescription").value,
    };
    console.log("[FORM DATA]", eventData); // DEBUG

    const url = id ? `/api/admin/events/${id}` : "/api/admin/events";
    const method = id ? "PUT" : "POST";
    console.log(`[FORM] Submitting via ${method} ${url}`); // DEBUG

    const data = await apiRequest(url, method, eventData);
    console.log("[FORM RESPONSE]", data); // DEBUG

    if (data.success) {
      closeModal();
      loadEvents();
    } else {
      alert(data.message || "Failed to save event");
    }
  }

  async function editEvent(id) {
    console.log("[EDIT] Loading event:", id); // DEBUG
    const data = await apiRequest(`/api/admin/events/${id}`);
    if (data.success) {
      openModal("Edit Event", data.event || data.data);
    } else {
      alert(data.message || "Failed to load event");
    }
  }

  async function deleteEvent(id) {
    console.log("[DELETE] Request for:", id); // DEBUG
    if (!confirm("Are you sure you want to delete this event?")) return;
    const data = await apiRequest(`/api/admin/events/${id}`, "DELETE");
    if (data.success) {
      loadEvents();
    } else {
      alert(data.message || "Failed to delete event");
    }
  }

  // Event delegation for table buttons
  document.getElementById("eventsTableBody").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-edit")) editEvent(e.target.dataset.id);
    if (e.target.classList.contains("btn-delete"))
      deleteEvent(e.target.dataset.id);
  });

  // Form submit + Add button
  const saveBtn = form.querySelector("button[type='submit']");
  saveBtn.addEventListener("click", saveEvent);

  console.log("[INIT] Submit listener attached to #eventForm"); // DEBUG

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      console.log("[BUTTON] Save button clicked");
    });
  }
  
  document.getElementById("addEventBtn").onclick = () => openModal("Add Event");

  // Utils
  const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Init
  loadEvents();
});
