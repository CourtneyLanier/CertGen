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
  const expirationYear = (parseInt(year) + 1).toString();
  const random = Math.floor(Math.random() * 90000 + 10000);
  const certId = `3SAI-${year}-${month}-${random}`;

  const selectedType = classTypeSelect.value;
  const classType = selectedType === "Other" ? customClassTypeInput.value : selectedType;

  // Credential URL (use certId for uniqueness)
  const certUrl = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;

  // Update certificate preview
  (document.getElementById("certNameHeader") as HTMLElement).textContent = name;
  (document.getElementById("certNameBody") as HTMLElement).textContent = name;
  (document.getElementById("certCourse") as HTMLElement).textContent = course;
  (document.getElementById("certClassType") as HTMLElement).textContent = classType;
  (document.getElementById("certDate") as HTMLElement).textContent = formattedDate;
  (document.getElementById("certId") as HTMLElement).textContent = certId;
  document.title = certId; // Sets suggested PDF filename

  // Credential URL link display
  const certLink = document.getElementById("certLink") as HTMLAnchorElement;
  certLink.href = certUrl;
  certLink.textContent = certUrl;

  const credentialContainer = document.getElementById("credentialLinkContainer") as HTMLElement;
  credentialContainer.style.display = "block";

  // LinkedIn Link generation
  const linkedInBase = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
  const certName = `${course} ${classType}`;
  const issuer = "3Strand.ai";

  const linkedInUrl = `${linkedInBase}` +
    `&name=${encodeURIComponent(certName)}` +
    `&organizationName=${encodeURIComponent(issuer)}` +
    `&issueYear=${encodeURIComponent(year)}` +
    `&issueMonth=${encodeURIComponent(month)}` +
    `&expirationYear=${encodeURIComponent(expirationYear)}` +
    `&expirationMonth=${encodeURIComponent(month)}` +
    `&certificationId=${encodeURIComponent(certId)}` +
    `&certificationUrl=${encodeURIComponent(certUrl)}`;

  const linkedInAnchor = document.getElementById("linkedInLink") as HTMLAnchorElement;
  linkedInAnchor.href = linkedInUrl;
  linkedInAnchor.textContent = "Click here to add your certificate to LinkedIn";
  linkedInAnchor.style.display = "block";

  document.getElementById("certificateOutput")?.scrollIntoView({ behavior: "smooth" });

  // Show update status message
  const statusMessage = document.getElementById("sheetStatus") as HTMLElement;

  const payload = {
    name,
    course,
    classType,
    date: formattedDate,
    certId,
    certUrl,
    linkedInUrl
  };

  fetch("https://script.google.com/macros/s/AKfycbz9j00oXuqyk9K2xwZWmX6vWqzCTbTlTjnfsFmSf7bWT2PuhxMZ1stlfwxDepzoh0hv/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (res.ok) {
        statusMessage.textContent = "✅ Student info successfully saved to Google Sheet.";
        statusMessage.style.color = "green";
        statusMessage.style.display = "block";
      } else {
        throw new Error("Google Sheet update failed.");
      }
    })
    .catch(err => {
      console.error("Sheet update failed", err);
      statusMessage.textContent = "⚠️ Could not save to Google Sheet.";
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

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    generateCertificate();
  });

  printBtn?.addEventListener("click", printCertificate);

  classTypeSelect?.addEventListener("change", () => {
    customTypeWrapper.style.display = (classTypeSelect.value === "Other") ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", setupEventListeners);
