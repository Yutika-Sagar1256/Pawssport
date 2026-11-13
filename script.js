let pets = [
  {
    name: "Milo",
    emoji: "🐶",
    breed: "Golden Retriever, 4 years",
    diet: "Dry kibble twice a day, no table scraps",
    allergies: ["Chicken", "Pollen"],
    medicines: ["Apoquel 5mg, once daily"],
    vitamins: ["Fish oil", "Glucosamine"],
    vaccines: [
      { name: "Rabies", given: "Jan 2026", due: "Jan 2027" },
      { name: "DHPP", given: "Feb 2026", due: "Feb 2027" }
    ],
    documents: ["Blood test - Mar 2026.pdf"]
  },
  {
    name: "Luna",
    emoji: "🐱",
    breed: "Persian, 2 years",
    diet: "Creamy treats for snack once a day and Wet food twice a day",
    allergies: ["Fish"],
    medicines: [],
    vitamins: ["Multivitamin drops"],
    vaccines: [
      { name: "FVRCP", given: "Dec 2025", due: "Dec 2026" }
    ],
    documents: []
  }
];

const savedData = localStorage.getItem("pawssportPets");
if (savedData) {
  pets = JSON.parse(savedData);
}

function savePets() {
  localStorage.setItem("pawssportPets", JSON.stringify(pets));
}

function resetData() {
  if (confirm("Reset all pets back to the starting sample data?")) {
    localStorage.removeItem("pawssportPets");
    location.reload();
  }
}

let currentPet = 0;

function makeTags(list, extraClass) {
  if (list.length === 0) {
    return "<span class='empty'>None added</span>";
  }
  return list.map(item => `<span class="tag ${extraClass}">${item}</span>`).join("");
}

function makeVaccines(list) {
  if (list.length === 0) {
    return "<span class='empty'>None added</span>";
  }
  return list.map(v => `
    <div class="vaccine-row">
      <b>${v.name}</b>
      <span>Given ${v.given} · Due ${v.due}</span>
    </div>
  `).join("");
}

function makeDocuments(list) {
  if (list.length === 0) {
    return "<span class='empty'>No documents yet</span>";
  }
  return list.map(d => `<div>📎 ${d}</div>`).join("");
}

function addItem(field) {
  const text = prompt("What would you like to add?");
  if (!text) {
    return;
  }
  pets[currentPet][field].push(text);
  savePets();
  showPet(currentPet);
}

function addVaccine() {
  const name = prompt("Vaccine name?");
  if (!name) {
    return;
  }
  const given = prompt("Date given? (for example Mar 2026)");
  const due = prompt("Next due date? (for example Mar 2027)");
  pets[currentPet].vaccines.push({ name: name, given: given, due: due });
  savePets();
  showPet(currentPet);
}

function editDiet() {
  const text = prompt("Update the diet:", pets[currentPet].diet);
  if (!text) {
    return;
  }
  pets[currentPet].diet = text;
  savePets();
  showPet(currentPet);
}

function showPet(index) {
  currentPet = index;
  const pet = pets[index];
  document.getElementById("details").innerHTML = `
    <div class="details-box">
      <h2>${pet.emoji} ${pet.name}</h2>
      <p class="breed">${pet.breed}</p>

      <div class="section-head">
        <h3>🍖 Diet</h3>
        <button onclick="editDiet()">Edit</button>
      </div>
      <p>${pet.diet}</p>

      <div class="section-head">
        <h3>⚠️ Allergies</h3>
        <button onclick="addItem('allergies')">+ Add</button>
      </div>
      <div>${makeTags(pet.allergies, "tag-warn")}</div>

      <div class="section-head">
        <h3>💊 Medicines</h3>
        <button onclick="addItem('medicines')">+ Add</button>
      </div>
      <div>${makeTags(pet.medicines, "")}</div>

      <div class="section-head">
        <h3>🌿 Vitamins</h3>
        <button onclick="addItem('vitamins')">+ Add</button>
      </div>
      <div>${makeTags(pet.vitamins, "")}</div>

      <div class="section-head">
        <h3>💉 Vaccination history</h3>
        <button onclick="addVaccine()">+ Add</button>
      </div>
      <div>${makeVaccines(pet.vaccines)}</div>

      <div class="section-head">
        <h3>📄 Medical documents</h3>
        <button onclick="addItem('documents')">+ Add</button>
      </div>
      <div>${makeDocuments(pet.documents)}</div>

      <button class="reset-btn" onclick="resetData()">Reset sample data</button>
    </div>
  `;
}