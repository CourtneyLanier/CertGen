function generateCertificate(): void {
  const nameInput = document.getElementById("studentName") as HTMLInputElement;
  const courseInput = document.getElementById("courseName") as HTMLInputElement;
  const dateInput = document.getElementById("courseDate") as HTMLInputElement;

  const name = nameInput.value;
  const course = courseInput.value;
  const dateStr = dateInput.value;

  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${month}/${day}/${year}`;
  const random = Math.floor(Math.random() * 90000 + 10000);

  (document.getElementById("certNameHeader") as HTMLElement).textContent = name;
  (document.getElementById("certNameBody") as HTMLElement).textContent = name;
  (document.getElementById("certCourse") as HTMLElement).textContent = course;
  (document.getElementById("certDate") as HTMLElement).textContent = formattedDate;
  (document.getElementById("certId") as HTMLElement).textContent = `3SAI-${year}-${month}-${random}`;

  document.getElementById("certificateOutput")?.scrollIntoView({ behavior: "smooth" });
}

function printCertificate(): void {
  window.print();
}

function setupEventListeners(): void {
  const form = document.getElementById("certificateForm");
  const printBtn = document.getElementById("printBtn");

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    generateCertificate();
  });

  printBtn?.addEventListener("click", printCertificate);
}

document.addEventListener("DOMContentLoaded", setupEventListeners);

