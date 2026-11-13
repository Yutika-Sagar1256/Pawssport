let bookings = [];

const sitters = [
  { name: "Priya S.", rate: 300 },
  { name: "Rahul K.", rate: 250 },
  { name: "Anita M.", rate: 350 }
];

const savedBookings = localStorage.getItem("pawssportBookings");
if (savedBookings) {
  bookings = JSON.parse(savedBookings);
}

function saveBookings() {
  localStorage.setItem("pawssportBookings", JSON.stringify(bookings));
}

function showPage(name) {
  const pages = ["pets", "grooming", "sitter", "bookings"];

  pages.forEach(p => {
    document.getElementById("page-" + p).classList.add("hidden");
    document.getElementById("nav-" + p).classList.remove("active");
  });

  document.getElementById("page-" + name).classList.remove("hidden");
  document.getElementById("nav-" + name).classList.add("active");

  if (name === "grooming") {
    fillGroomingForm();
  }
  if (name === "sitter") {
    fillSitterForm();
  }
  if (name === "bookings") {
    showBookings();
  }
}

function todayText() {
  return new Date().toISOString().split("T")[0];
}

function fillGroomingForm() {
  const select = document.getElementById("groom-pet");
  select.innerHTML = pets.map(p => `<option>${p.name}</option>`).join("");
  document.getElementById("groom-date").min = todayText();
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
  bookings.push({ type: "grooming", pet: pet, service: service, date: date, time: time });
  saveBookings();
  showPage("bookings");
}

function fillSitterForm() {
  document.getElementById("sitter-pet").innerHTML =
    pets.map(p => `<option>${p.name}</option>`).join("");

  document.getElementById("sitter-name").innerHTML =
    sitters.map((s, i) => `<option value="${i}">${s.name} - ₹${s.rate}/hr</option>`).join("");

  document.getElementById("sitter-date").min = todayText();
  updateCost();
}

function updateCost() {
  const sitter = sitters[document.getElementById("sitter-name").value];
  const hours = Number(document.getElementById("sitter-hours").value);
  const box = document.getElementById("sitter-cost");

  if (!sitter || !hours || hours < 1) {
    box.textContent = "";
    return;
  }
  box.textContent = "Estimated cost: ₹" + (sitter.rate * hours);
}

function bookSitter() {
  const pet = document.getElementById("sitter-pet").value;
  const sitter = sitters[document.getElementById("sitter-name").value];
  const date = document.getElementById("sitter-date").value;
  const time = document.getElementById("sitter-time").value;
  const hours = Number(document.getElementById("sitter-hours").value);
  const error = document.getElementById("sitter-error");

  if (!date) {
    error.textContent = "Please choose a date.";
    return;
  }
  if (!hours || hours < 3) {
    error.textContent = "Pet sitting has a 3-hour minimum.";
    return;
  }
  if (hours > 12) {
    error.textContent = "For stays longer than 12 hours, please contact Pink Paws.";
    return;
  }

  error.textContent = "";
  bookings.push({
    type: "sitter",
    pet: pet,
    sitter: sitter.name,
    date: date,
    time: time,
    hours: hours,
    cost: sitter.rate * hours
  });
  saveBookings();
  showPage("bookings");
}

function cancelBooking(index) {
  if (confirm("Cancel this booking?")) {
    bookings.splice(index, 1);
    saveBookings();
    showBookings();
  }
}

function showBookings() {
  const box = document.getElementById("bookings-list");

  if (bookings.length === 0) {
    box.innerHTML = "<div class='form-box'><span class='empty'>No bookings yet. Try booking a grooming appointment or a pet sitter!</span></div>";
    return;
  }

  box.innerHTML = bookings.map((b, i) => {
    let title = "";
    let details = "";

    if (b.type === "sitter") {
      title = `🏠 Pet sitting with ${b.sitter} for ${b.pet}`;
      details = `${b.date} at ${b.time} · ${b.hours} hours · ₹${b.cost}`;
    } else {
      title = `✂️ ${b.service} for ${b.pet}`;
      details = `${b.date} at ${b.time} · Pink Paws`;
    }

    return `
      <div class="booking-card">
        <div>
          <span class="confirmed">✓ Confirmed</span>
          <p><b>${title}</b></p>
          <p class="breed">${details}</p>
        </div>
        <button class="cancel-btn" onclick="cancelBooking(${i})">Cancel</button>
      </div>
    `;
  }).join("");
}