const petInput = document.querySelector("#pet");
const ownerInput = document.querySelector("#owner");
const telephoneInput = document.querySelector("#telephone");
const dateInput = document.querySelector("#date");
const hourInput = document.querySelector("#hour");
const symptomsInput = document.querySelector("#symptoms");

const formAppointment = document.querySelector("#new-appointment");
const contentAppointments = document.querySelector("#appointments");
let editing = false;

// Heading
const heading = document.querySelector("#manage");


evenListeners();
function evenListeners() {
  petInput.addEventListener("change", appointmentData);
  ownerInput.addEventListener("change", appointmentData);
  telephoneInput.addEventListener("change", appointmentData);
  dateInput.addEventListener("change", appointmentData);
  hourInput.addEventListener("change", appointmentData);
  symptomsInput.addEventListener("change", appointmentData);

  //Form new appointment
  formAppointment.addEventListener("submit", newAppointment);
}
//Appointment in object
const appointmentObj = {
  pet: "",
  owner: "",
  telephone: "",
  date: "",
  hour: "",
  symptoms: "",
};

//Data of appointment
function appointmentData(e) {
  appointmentObj[e.target.name] = e.target.value;
}
class Appointments {
  constructor() {
    this.appointments = [];
  }

  addAppointment(appointment) {
    this.appointments = [...this.appointments, appointment];
  }

  deleteAppointment(id) {
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== id
    );
  }

  editAppointment(appointmentUpdate) {
    this.appointments = this.appointments.map((appointment) =>
      appointment.id === appointmentUpdate.id ? appointmentUpdate : appointment
    );
  }
}
class UI {
  constructor({ appointments }) {
    this.textoHeading(appointments);
  }

  printAlert(message, type) {
    const divMessage = document.createElement("div");
    divMessage.classList.add("text-center", "alert", "d-block", "col-12");
    divMessage.textContent = message;

    if (type === "error") {
      divMessage.classList.add("alert-danger");
    } else {
      divMessage.classList.add("alert-success");
    }
    document
      .querySelector("#content")
      .insertBefore(divMessage, document.querySelector(".add-appointment"));
    setTimeout(() => {
      divMessage.remove();
    }, 5000);
  }

  printAppointments({ appointments }) {
    this.cleanHTML();
    this.textoHeading(appointments);
    appointments.forEach((appointment) => {
      const { pet, owner, telephone, date, hour, symptoms, id } = appointment;

      const divAppointment = document.createElement("div");
      divAppointment.classList.add("appointment", "p-3");
      divAppointment.dataset.id = id;

      const petParagraph = document.createElement("h2");
      petParagraph.classList.add("card-title", "font-weight");
      petParagraph.textContent = pet;

      const ownerParagraph = document.createElement("p");
      ownerParagraph.innerHTML = `<span class="font-weight-bolder">Owner: </span> ${owner}`;

      const telephoneParagraph = document.createElement("p");
      telephoneParagraph.innerHTML = `<span class="font-weight-bolder">Telephone: </span> ${telephone}`;

      const dateParagraph = document.createElement("p");
      dateParagraph.innerHTML = `<span class="font-weight-bolder">Date: </span> ${date}`;

      const hourParagraph = document.createElement("p");
      hourParagraph.innerHTML = `<span class="font-weight-bolder">Hour: </span> ${hour}`;

      const symptomsParagraph = document.createElement("p");
      symptomsParagraph.innerHTML = `<span class="font-weight-bolder">Symptoms: </span> ${symptoms}`;
      //Button delete
      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn", "btn-danger", "mr-2");
      btnDelete.innerHTML =
        'Delete <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      btnDelete.onclick = () => {
        deleteAppointment(id);
      };

      //Button edit
      const btnEdit = document.createElement("button");
      btnEdit.classList.add("btn", "btn-info");
      btnEdit.innerHTML =
        'Edit <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
      btnEdit.onclick = () => {
        loadEdition(appointment);
      };
      divAppointment.appendChild(petParagraph);
      divAppointment.appendChild(ownerParagraph);
      divAppointment.appendChild(telephoneParagraph);
      divAppointment.appendChild(dateParagraph);
      divAppointment.appendChild(hourParagraph);
      divAppointment.appendChild(symptomsParagraph);
      divAppointment.appendChild(btnDelete);
      divAppointment.appendChild(btnEdit);

      contentAppointments.appendChild(divAppointment);
    });
  }

  textoHeading(appointments) {
    if (appointments.length > 0) {
      heading.textContent = "Manage your Appointments";
    } else {
      heading.textContent = "No Appointments, start by creating one";
    }
  }
  cleanHTML() {
    while (contentAppointments.firstChild) {
      contentAppointments.removeChild(contentAppointments.firstChild);
    }
  }
}

const manageAppointments = new Appointments();
const ui = new UI(manageAppointments);
function newAppointment(e) {
  e.preventDefault();
  const { pet, owner, telephone, date, hour, symptoms } = appointmentObj;

  //Field validation
  if (
    pet === "" ||
    owner === "" ||
    telephone === "" ||
    date === "" ||
    hour === "" ||
    symptoms === ""
  ) {
    ui.printAlert("All fields are required", "error");

    return;
  }

  if (editing) {
    manageAppointments.editAppointment({ ...appointmentObj });
    ui.printAlert("Appointment edited successfully");
    formAppointment.querySelector('button[type="submit"]').textContent =
      "Create Appointment";
    editing = false;
  } else {
    //Get ID
    appointmentObj.id = Date.now();
    //New appointment
    manageAppointments.addAppointment({ ...appointmentObj });
  }

  // Restart the object
  restartObj();

  // Resetting the inputs
  formAppointment.reset();

  ui.printAppointments(manageAppointments);
}

function restartObj() {
  (appointmentObj.pet = ""),
    (appointmentObj.owner = ""),
    (appointmentObj.telephone = ""),
    (appointmentObj.date = ""),
    (appointmentObj.hour = ""),
    (appointmentObj.symptoms = "");
}

function deleteAppointment(id) {
  manageAppointments.deleteAppointment(id);

  ui.printAlert("Appointment deleted successfully");

  ui.printAppointments(manageAppointments);
}

function loadEdition(appointment) {
  const { pet, owner, telephone, date, hour, symptoms, id } = appointment;

  //Fill the inputs
  petInput.value = pet;
  ownerInput.value = owner;
  telephoneInput.value = telephone;
  dateInput.value = date;
  hourInput.value = hour;
  symptomsInput.value = symptoms;

  //fill the object
  appointmentObj.pet = pet;
  appointmentObj.owner = owner;
  appointmentObj.telephone = telephone;
  appointmentObj.date = date;
  appointmentObj.hour = hour;
  appointmentObj.symptoms = symptoms;
  appointmentObj.id = id;
  formAppointment.querySelector('button[type="submit"]').textContent =
    "Save Changes";

  editing = true;
}
