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
    const modal = document.getElementById("donationStatusModal");
    const closeModal = () => (modal.style.display = "none");
    const openModal = () => (modal.style.display = "block");

    document.querySelector(".close").addEventListener("click", closeModal);
    window.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    // Unified API request
    async function apiRequest(url, method = "GET", body = null) {
        try {
            const options = {
                method,
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    "Content-Type": "application/json"
                }
            };
            if (body) options.body = JSON.stringify(body);

            const res = await fetch(url, options);
            return await res.json();
        } catch (err) {
            console.error("API error:", err);
            return { success: false, message: "Network error" };
        }
    }

    // Load donations
    async function loadDonations() {
        const searchTerm = document.getElementById("searchDonations").value.trim();
        const statusFilter = document.getElementById("filterStatus").value;

        let url = "/api/admin/donations";
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (statusFilter) params.append("status", statusFilter);
        if (params.toString()) url += "?" + params.toString();

        const data = await apiRequest(url);
        if (data.success) {
            displayDonations(data.donations || []);
        } else {
            showError("Failed to load donations");
        }
    }

    function displayDonations(donations) {
        const tbody = document.getElementById("donationsTableBody");
        tbody.innerHTML = "";

        if (!donations.length) {
            tbody.innerHTML = `<tr><td colspan="6">No donations found</td></tr>`;
            return;
        }

        donations.forEach(d => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${d.id}</td>
                <td>${d.donor_name}</td>
                <td>৳${d.amount}</td>
                <td>${formatDate(d.donation_date)}</td>
                <td><span class="status-badge ${d.status}">${d.status}</span></td>
                <td><button class="btn-status" data-id="${d.id}" data-status="${d.status}">Update Status</button></td>
            `;
            tbody.appendChild(row);
        });

        // Delegate button clicks
        tbody.querySelectorAll(".btn-status").forEach(btn => {
            btn.addEventListener("click", () => {
                document.getElementById("donationId").value = btn.dataset.id;
                document.getElementById("donationStatus").value = btn.dataset.status;
                openModal();
            });
        });
    }

    async function updateDonationStatus(donationId, status) {
        const data = await apiRequest(`/api/admin/donations/${donationId}/status`, "PUT", { status });
        if (data.success) {
            closeModal();
            loadDonations();
        } else {
            alert("Failed to update: " + data.message);
        }
    }

    function showError(msg) {
        document.getElementById("donationsTableBody").innerHTML = `
            <tr><td colspan="6" class="error">${msg}</td></tr>
        `;
    }

    // Form submit
    document.getElementById("donationStatusForm").addEventListener("submit", e => {
        e.preventDefault();
        const id = document.getElementById("donationId").value;
        const status = document.getElementById("donationStatus").value;
        updateDonationStatus(id, status);
    });

    // Listeners
    document.getElementById("refreshDonations").addEventListener("click", loadDonations);
    document.getElementById("searchDonations").addEventListener("input", loadDonations);
    document.getElementById("filterStatus").addEventListener("change", loadDonations);

    // Format date
    function formatDate(date) {
        return new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    // Init
    loadDonations();
});
