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

    // Helper for API requests
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
            console.error("API error:", err);
            return { success: false, message: "Network error" };
        }
    }

    // Modal helpers
    const modal = document.getElementById("teamMemberModal");
    const form = document.getElementById("teamMemberForm");

    function openModal(title, member = null) {
        document.getElementById("modalTitle").textContent = title;
        form.reset();
        document.getElementById("teamMemberId").value = member?.id || "";
        if (member) {
            form.teamMemberName.value = member.name;
            form.teamMemberEmail.value = member.email;
            form.teamMemberPhone.value = member.phone || "";
            form.teamMemberPosition.value = member.position;
            form.teamMemberFacebook.value = member.facebook_url || "";
            form.teamMemberLinkedin.value = member.linkedin_url || "";
        }
        modal.style.display = "block";
    }
    function closeModal() { modal.style.display = "none"; }

    document.querySelector(".close").onclick = closeModal;
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });      

    // Load team members
    async function loadTeamMembers() {
        const data = await apiRequest("/api/admin/team");
        const members = data.teamMembers || data.data || [];
        const tbody = document.getElementById("teamTableBody");
        tbody.innerHTML = "";

        if (!data.success || !members.length) {
            tbody.innerHTML = `<tr><td colspan="4">${data.message || "No team members found"}</td></tr>`;
            return;
        }

        members.forEach(m => {
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.name}</td>
                    <td>${m.position}</td>
                    <td>
                        <button class="btn-edit" data-id="${m.id}">Edit</button>
                        <button class="btn-delete" data-id="${m.id}">Delete</button>
                    </td>
                </tr>
            `);
        });
    }

    // CRUD
    async function saveTeamMember(e) {
        e.preventDefault();
        const id = form.teamMemberId.value;
        const memberData = {
            name: form.teamMemberName.value,
            email: form.teamMemberEmail.value,
            phone: form.teamMemberPhone.value,
            position: form.teamMemberPosition.value,
            facebookUrl: form.teamMemberFacebook.value,
            linkedinUrl: form.teamMemberLinkedin.value
        };

        const url = id ? `/api/admin/team/${id}` : "/api/admin/team";
        const method = id ? "PUT" : "POST";

        const data = await apiRequest(url, method, memberData);
        if (data.success) { closeModal(); loadTeamMembers(); }
        else alert(data.message || "Failed to save team member");
    }

    async function editTeamMember(id) {
        const data = await apiRequest(`/api/admin/team/${id}`);
        if (data.success) openModal("Edit Team Member", data.teamMember || data.data);
        else alert(data.message || "Failed to load member");
    }

    async function deleteTeamMember(id) {
        if (!confirm("Delete this team member?")) return;
        const data = await apiRequest(`/api/admin/team/${id}`, "DELETE");
        if (data.success) loadTeamMembers();
        else alert(data.message || "Failed to delete member");
    }

    // Delegated events for edit/delete
    document.getElementById("teamTableBody").addEventListener("click", e => {
        if (e.target.classList.contains("btn-edit")) editTeamMember(e.target.dataset.id);
        if (e.target.classList.contains("btn-delete")) deleteTeamMember(e.target.dataset.id);
    });

    // Form + Add button
    form.addEventListener("submit", saveTeamMember);
    document.getElementById("addTeamMemberBtn").onclick = () => openModal("Add Team Member");

    // Init
    loadTeamMembers();
});
