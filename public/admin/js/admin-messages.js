document.addEventListener("DOMContentLoaded", () => {
    const adminToken = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

    if (!adminToken || !adminUser.id || adminUser.userType !== "admin") {
        window.location.href = "/admin/login.html";
        return;
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

    // Modal helpers
    const modal = document.getElementById("messageModal");
    const closeModal = () => (modal.style.display = "none");
    const openModal = () => (modal.style.display = "block");

    document.querySelector(".close").addEventListener("click", closeModal);
    window.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    // Generic API request
    async function apiRequest(url, method = "GET", body = null) {
        try {
            const opts = {
                method,
                headers: { Authorization: `Bearer ${adminToken}` }
            };
            if (body) {
                opts.headers["Content-Type"] = "application/json";
                opts.body = JSON.stringify(body);
            }
            const res = await fetch(url, opts);
            return await res.json();
        } catch (err) {
            console.error("API error:", err);
            return { success: false, message: "Network error" };
        }
    }

    // Load messages
    async function loadMessages() {
        const search = document.getElementById("searchMessages").value.trim();
        let url = "/api/admin/messages";
        if (search) url += `?search=${encodeURIComponent(search)}`;

        const data = await apiRequest(url);
        if (data.success) displayMessages(data.messages || []);
        else showError("Failed to load messages");
    }

    function displayMessages(messages) {
        const tbody = document.getElementById("messagesTableBody");
        tbody.innerHTML = "";

        if (!messages.length) {
            tbody.innerHTML = `<tr><td colspan="5">No messages found</td></tr>`;
            return;
        }

        messages.forEach(m => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${m.id}</td>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${formatDate(m.created_at)}</td>
                <td>
                    <button class="btn-view" data-id="${m.id}">View</button>
                    <button class="btn-delete" data-id="${m.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Delegate actions
        tbody.querySelectorAll(".btn-view").forEach(btn =>
            btn.addEventListener("click", () => viewMessage(btn.dataset.id))
        );
        tbody.querySelectorAll(".btn-delete").forEach(btn =>
            btn.addEventListener("click", () => deleteMessage(btn.dataset.id))
        );
    }

    async function viewMessage(id) {
        const data = await apiRequest(`/api/admin/messages/${id}`);
        if (data.success) {
            const m = data.message;
            document.getElementById("messageDetails").innerHTML = `
                <div class="message-info">
                    <p><strong>Name:</strong> ${m.name}</p>
                    <p><strong>Email:</strong> ${m.email}</p>
                    <p><strong>Phone:</strong> ${m.phone || "Not provided"}</p>
                    <p><strong>Date:</strong> ${formatDateTime(m.created_at)}</p>
                </div>
                <div class="message-content">
                    <h3>Message:</h3>
                    <p>${m.message}</p>
                </div>
            `;
            openModal();
        } else {
            alert("Failed to load message: " + data.message);
        }
    }

    async function deleteMessage(id) {
        if (!confirm("Are you sure you want to delete this message?")) return;

        const data = await apiRequest(`/api/admin/messages/${id}`, "DELETE");
        if (data.success) loadMessages();
        else alert("Failed to delete: " + data.message);
    }

    function showError(msg) {
        document.getElementById("messagesTableBody").innerHTML = `
            <tr><td colspan="5" class="error">${msg}</td></tr>
        `;
    }

    // Format helpers
    const formatDate = d =>
        new Date(d).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    const formatDateTime = d =>
        new Date(d).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    // Listeners
    document.getElementById("refreshMessages").addEventListener("click", loadMessages);
    document.getElementById("searchMessages").addEventListener("input", loadMessages);

    // Init
    loadMessages();
});
