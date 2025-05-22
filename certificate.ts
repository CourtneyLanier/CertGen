function generateCertificate(): void {
  const nameInput = document.getElementById("studentName") as HTMLInputElement;
  const courseInput = document.getElementById("courseName") as HTMLInputElement;
  const dateInput = document.getElementById("courseDate") as HTMLInputElement;
  const classTypeSelect = document.getElementById("classType") as HTMLSelectElement;
  const customClassTypeInput = document.getElementById("customClassType") as HTMLInputElement;

  const name = nameInput.value;
  const course = courseInput.value;
  const dateStr = dateInput.value;

  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${month}/${day}/${year}`;
  const random = Math.floor(Math.random() * 90000 + 10000);

  const selectedType = classTypeSelect.value;
  const classType =
    selectedType === "Other" ? customClassTypeInput.value : selectedType;

  (document.getElementById("certNameHeader") as HTMLElement).textContent = name;
  (document.getElementById("certNameBody") as HTMLElement).textContent = name;
  (document.getElementById("certCourse") as HTMLElement).textContent = course;
  (document.getElementById("certClassType") as HTMLElement).textContent = classType;
  (document.getElementById("certDate") as HTMLElement).textContent = formattedDate;
  (document.getElementById("certId") as HTMLElement).textContent = `3SAI-${year}-${month}-${random}`;

  document.getElementById("certificateOutput")?.scrollIntoView({ behavior: "smooth" });
}

function printCertificate() {
  console.log("Print button clicked!");
  window.print();
}

function setupEventListeners() {
  const form = document.getElementById("certificateForm");
  const printBtn = document.getElementById("printBtn");
  const classTypeSelect = document.getElementById("classType") as HTMLSelectElement;
  const customTypeWrapper = document.getElementById("customTypeWrapper") as HTMLElement;

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    generateCertificate();
  });

  printBtn?.addEventListener("click", printCertificate);

  classTypeSelect?.addEventListener("change", () => {
    if (classTypeSelect.value === "Other") {
      customTypeWrapper.style.display = "block";
    } else {
      customTypeWrapper.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", setupEventListeners);
