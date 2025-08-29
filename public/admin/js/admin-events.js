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
    document.getElementById("logoutBtn").addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login.html";
    });

    // Helpers
    async function apiRequest(url, method = "GET", body = null) {
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                },
                body: body ? JSON.stringify(body) : null
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
        document.getElementById("modalTitle").textContent = title;
        form.reset();
        document.getElementById("eventId").value = event?.id || "";
        if (event) {
            form.eventTitle.value = event.title;
            form.eventDate.value = event.date;
            form.eventTime.value = event.time;
            form.eventVenue.value = event.venue;
            form.eventDescription.value = event.description;
        }
        modal.style.display = "block";
    }
    function closeModal() { modal.style.display = "none"; }

    document.querySelector(".close").onclick = closeModal;
    window.onclick = e => e.target === modal && closeModal();

    // Load & display events
    async function loadEvents() {
        const data = await apiRequest("/api/admin/events");
        const events = data.events || data.data || [];
        const tbody = document.getElementById("eventsTableBody");
        tbody.innerHTML = "";

        if (!data.success || !events.length) {
            tbody.innerHTML = `<tr><td colspan="5">${data.message || "No events found"}</td></tr>`;
            return;
        }

        events.forEach(ev => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${ev.id}</td>
                    <td>${ev.title}</td>
                    <td>${formatDate(ev.date)}</td>
                    <td>${ev.venue}</td>
                    <td>
                        <button class="btn-edit" data-id="${ev.id}">Edit</button>
                        <button class="btn-delete" data-id="${ev.id}">Delete</button>
                    </td>
                </tr>
            `);
        });
    }

    // CRUD actions
    async function saveEvent(e) {
        e.preventDefault();
        const id = form.eventId.value;
        const eventData = {
            title: form.eventTitle.value,
            date: form.eventDate.value,
            time: form.eventTime.value,
            venue: form.eventVenue.value,
            description: form.eventDescription.value
        };
        const url = id ? `/api/admin/events/${id}` : "/api/admin/events";
        const method = id ? "PUT" : "POST";

        const data = await apiRequest(url, method, eventData);
        if (data.success) { closeModal(); loadEvents(); }
        else alert(data.message || "Failed to save event");
    }

    async function editEvent(id) {
        const data = await apiRequest(`/api/admin/events/${id}`);
        if (data.success) openModal("Edit Event", data.event || data.data);
        else alert(data.message || "Failed to load event");
    }

    async function deleteEvent(id) {
        if (!confirm("Are you sure you want to delete this event?")) return;
        const data = await apiRequest(`/api/admin/events/${id}`, "DELETE");
        if (data.success) loadEvents();
        else alert(data.message || "Failed to delete event");
    }

    // Event delegation for table buttons
    document.getElementById("eventsTableBody").addEventListener("click", e => {
        if (e.target.classList.contains("btn-edit")) editEvent(e.target.dataset.id);
        if (e.target.classList.contains("btn-delete")) deleteEvent(e.target.dataset.id);
    });

    // Form submit + Add button
    form.addEventListener("submit", saveEvent);
    document.getElementById("addEventBtn").onclick = () => openModal("Add Event");

    // Utils
    const formatDate = d => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

    // Init
    loadEvents();
});
