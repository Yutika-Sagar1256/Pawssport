let bookings = [];

const savedBookings = localStorage.getItem("pawssportBookings");
if (savedBookings) {
  bookings = JSON.parse(savedBookings);
}

function saveBookings() {
  localStorage.setItem("pawssportBookings", JSON.stringify(bookings));
}

function showPage(name) {
  const pages = ["pets", "grooming", "bookings"];

  pages.forEach(p => {
    document.getElementById("page-" + p).classList.add("hidden");
    document.getElementById("nav-" + p).classList.remove("active");
  });

  document.getElementById("page-" + name).classList.remove("hidden");
  document.getElementById("nav-" + name).classList.add("active");

  if (name === "grooming") {
    fillGroomingForm();
  }
  if (name === "bookings") {
    showBookings();
  }
}

function fillGroomingForm() {
  const select = document.getElementById("groom-pet");
  select.innerHTML = pets.map(p => `<option>${p.name}</option>`).join("");

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("groom-date").min = today;
}

function bookGrooming() {
  const pet = document.getElementById("groom-pet").value;
  const service = document.getElementById("groom-service").value;
  const date = document.getElementById("groom-date").value;
  const time = document.getElementById("groom-time").value;
  const error = document.getElementById("groom-error");

  if (!date) {
    error.textContent = "Please choose a date.";
    return;
  }

  error.textContent = "";
  bookings.push({ pet: pet, service: service, date: date, time: time });
  saveBookings();
  showPage("bookings");
}

function cancelBooking(index) {
  if (confirm("Cancel this appointment?")) {
    bookings.splice(index, 1);
    saveBookings();
    showBookings();
  }
}

function showBookings() {
  const box = document.getElementById("bookings-list");

  if (bookings.length === 0) {
    box.innerHTML = "<div class='form-box'><span class='empty'>No bookings yet. Try booking a grooming appointment!</span></div>";
    return;
  }

  box.innerHTML = bookings.map((b, i) => `
    <div class="booking-card">
      <div>
        <span class="confirmed">✓ Confirmed</span>
        <p><b>✂️ ${b.service}</b> for ${b.pet}</p>
        <p class="breed">${b.date} at ${b.time} · Pink Paws</p>
      </div>
      <button class="cancel-btn" onclick="cancelBooking(${i})">Cancel</button>
    </div>
  `).join("");
}