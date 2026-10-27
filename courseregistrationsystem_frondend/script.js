
const API_URL = "http://localhost:8080/api";

// Display text safely inside HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[char];
    });
}

// Read error messages returned by the backend
async function getErrorMessage(response) {
    const text = await response.text();

    if (!text) {
        return "Request failed. Please try again.";
    }

    try {
        const data = JSON.parse(text);
        return data.message || data.error || data.detail || text;
    } catch {
        return text;
    }
}

// 1. Load courses into the courses table
async function loadCourses() {
    const table = document.getElementById("courseTable");
    const message = document.getElementById("courseMessage");

    if (!table) return;

    message.textContent = "";
    table.innerHTML = '<tr><td colspan="6">Loading courses...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/courses`);

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        const courses = await response.json();

        if (courses.length === 0) {
            table.innerHTML =
                '<tr><td colspan="6">No courses available.</td></tr>';
            return;
        }

        table.innerHTML = courses.map(course => `
            <tr>
                <td>${escapeHTML(course.id)}</td>
                <td>${escapeHTML(course.courseName)}</td>
                <td>${escapeHTML(course.description)}</td>
                <td>${escapeHTML(course.duration)}</td>
                <td>₹${escapeHTML(course.fee)}</td>
                <td>
                    <a class="btn"
                       href="register.html?courseId=${encodeURIComponent(course.id)}">
                       Register
                    </a>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        table.innerHTML =
            '<tr><td colspan="6">Unable to load courses.</td></tr>';

        message.textContent =
            error.message || "Please check whether the backend is running.";
        message.className = "message error";
    }
}

// 2. Load courses into the registration dropdown
async function loadCourseOptions() {
    const dropdown = document.getElementById("courseId");

    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Loading courses...</option>';

    try {
        const response = await fetch(`${API_URL}/courses`);

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        const courses = await response.json();

        if (courses.length === 0) {
            dropdown.innerHTML =
                '<option value="">No courses available</option>';
            return;
        }

        dropdown.innerHTML =
            '<option value="">Select a course</option>' +
            courses.map(course => `
                <option value="${escapeHTML(course.id)}">
                    ${escapeHTML(course.courseName)}
                </option>
            `).join("");

        // Select the course if Register was clicked from the courses page
        const selectedCourseId =
            new URLSearchParams(window.location.search).get("courseId");

        if (selectedCourseId) {
            const optionExists = Array.from(dropdown.options).some(
                option => option.value === selectedCourseId
            );

            if (optionExists) {
                dropdown.value = selectedCourseId;
            }
        }

    } catch (error) {
        dropdown.innerHTML =
            '<option value="">Unable to load courses</option>';

        showMessage(
            "registrationMessage",
            error.message || "Unable to load courses.",
            "error"
        );
    }
}

// 3. Show success or error messages
function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = text;
    element.className = `message ${type}`;
}

// 4. Register a student
async function registerStudent(event) {
    event.preventDefault();

    const form = document.getElementById("registrationForm");
    const button = document.getElementById("registerButton");
    const studentName = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const courseId = document.getElementById("courseId").value;

    if (!studentName || !email || !courseId) {
        showMessage(
            "registrationMessage",
            "Please fill in all fields and select a course.",
            "error"
        );
        return;
    }

    const formData = new URLSearchParams();
    formData.append("studentName", studentName);
    formData.append("email", email);
    formData.append("courseId", courseId);

    button.disabled = true;
    button.textContent = "Registering...";

    try {
        const response = await fetch(`${API_URL}/registrations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        showMessage(
            "registrationMessage",
            "Student registered successfully!",
            "success"
        );

        form.reset();
        window.history.replaceState({}, "", "register.html");

    } catch (error) {
        showMessage(
            "registrationMessage",
            error.message || "Registration failed. Please try again.",
            "error"
        );
    } finally {
        button.disabled = false;
        button.textContent = "Register Student";
    }
}

// 5. Load registered students into the table
async function loadRegistrations() {
    const table = document.getElementById("registrationTable");
    const message = document.getElementById("registrationListMessage");

    if (!table) return;

    message.textContent = "";
    table.innerHTML = '<tr><td colspan="5">Loading registrations...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/registrations`);

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        const registrations = await response.json();

        if (registrations.length === 0) {
            table.innerHTML =
                '<tr><td colspan="5">No students registered yet.</td></tr>';
            return;
        }

        table.innerHTML = registrations.map(registration => `
            <tr>
                <td>${escapeHTML(registration.id)}</td>
                <td>${escapeHTML(registration.studentName)}</td>
                <td>${escapeHTML(registration.email)}</td>
                <td>${escapeHTML(registration.course?.courseName || "N/A")}</td>
                <td>${escapeHTML(registration.registrationDate || "N/A")}</td>
            </tr>
        `).join("");

    } catch (error) {
        table.innerHTML =
            '<tr><td colspan="5">Unable to load registrations.</td></tr>';

        message.textContent =
            error.message || "Please check whether the backend is running.";
        message.className = "message error";
    }
}

// Run the correct function when each page opens
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("courseTable")) {
        loadCourses();
    }

    if (document.getElementById("courseId")) {
        loadCourseOptions();
    }

    if (document.getElementById("registrationForm")) {
        document.getElementById("registrationForm").addEventListener(
            "submit",
            registerStudent
        );
    }

    if (document.getElementById("registrationTable")) {
        loadRegistrations();
    }
});
