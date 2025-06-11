const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxq-iy_gnYUnBo0JGVnXLVqEip8dR9F8L9yIu9_1eRMRyldWnPzHCOfRA5LgchLyLFkwQ";

function generateCertificate(): void {
  // 1. Read inputs
  const name = (document.getElementById("studentName") as HTMLInputElement).value;
  const course = (document.getElementById("courseName") as HTMLInputElement).value;
  const dateStr = (document.getElementById("courseDate") as HTMLInputElement).value;
  const classTypeSelect = document.getElementById("classType") as HTMLSelectElement;
  const customClassTypeInput = document.getElementById("customClassType") as HTMLInputElement;

  // 2. Compute values
  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${month}/${day}/${year}`;
  const expirationYear = (parseInt(year) + 1).toString();
  const random = Math.floor(Math.random() * 90000 + 10000);
  const certId = `3SAI-${year}-${month}-${random}`;

  const selectedType = classTypeSelect.value;
  const classType = selectedType === "Other" ? customClassTypeInput.value : selectedType;

  const certUrl = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;

  // 3. Update preview text
  (document.getElementById("certNameHeader") as HTMLElement).textContent = name;
  (document.getElementById("certNameBody") as HTMLElement).textContent = name;
  (document.getElementById("certCourse") as HTMLElement).textContent = course;
  (document.getElementById("certClassType") as HTMLElement).textContent = classType;
  (document.getElementById("certDate") as HTMLElement).textContent = formattedDate;
  (document.getElementById("certId") as HTMLElement).textContent = certId;
  document.title = certId; // for Print → Save as PDF filename

  // 4. Update inline buttons
  const certLinkBtn = document.getElementById("certLinkBtn") as HTMLAnchorElement;
  certLinkBtn.href = certUrl;
  certLinkBtn.style.display = "inline-block";

  const linkedInBase = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
  const certName = `${course} ${classType}`;
  const issuer = "3 Strand Solutions";

  const linkedInUrl =
    `${linkedInBase}` +
    `&name=${encodeURIComponent(certName)}` +
    `&organizationName=${encodeURIComponent(issuer)}` +
    `&issueYear=${encodeURIComponent(year)}` +
    `&issueMonth=${encodeURIComponent(month)}` +
    `&expirationYear=${encodeURIComponent(expirationYear)}` +
    `&expirationMonth=${encodeURIComponent(month)}` +
    `&certificationId=${encodeURIComponent(certId)}` +
    `&certificationUrl=${encodeURIComponent(certUrl)}`;

  const linkedInLinkBtn = document.getElementById("linkedInLinkBtn") as HTMLAnchorElement;
  linkedInLinkBtn.href = linkedInUrl;
  linkedInLinkBtn.style.display = "inline-block";

  // 5. Scroll to certificate preview
  document.getElementById("certificateOutput")?.scrollIntoView({ behavior: "smooth" });

  // 6. Prepare payload for Google Sheet + PDF
  const payload = {
    name,
    course,
    classType,
    date: formattedDate,
    certId,
    certUrl,
    linkedInUrl,
    savePdf: true
  };

  const query = new URLSearchParams({ payload: JSON.stringify(payload) });

  // 7. Send to Google Apps Script
  const statusMessage = document.getElementById("sheetStatus") as HTMLElement;
  fetch(`${SCRIPT_URL}/exec?${query.toString()}`)
    .then(res => res.text())
    .then(response => {
      if (response.toLowerCase().includes("success")) {
        statusMessage.textContent = "✅ Student info successfully saved to Google Sheet.";
        statusMessage.style.color = "green";
      } else {
        statusMessage.textContent = response;
        statusMessage.style.color = "orange";
      }
      statusMessage.style.display = "block";
    })
    .catch(err => {
      console.error("Sheet update failed", err);
      statusMessage.textContent = "❌ Failed to reach the Google Sheet.";
      statusMessage.style.color = "red";
      statusMessage.style.display = "block";
    });
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

  form?.addEventListener("submit", e => {
    e.preventDefault();
    generateCertificate();
  });

  printBtn?.addEventListener("click", printCertificate);

  classTypeSelect?.addEventListener("change", () => {
    customTypeWrapper.style.display =
      classTypeSelect.value === "Other" ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", setupEventListeners);
