"use strict";
function generateCertificate() {
    // 1. Read form inputs
    const nameInput = document.getElementById("studentName");
    const courseInput = document.getElementById("courseName");
    const dateInput = document.getElementById("courseDate");
    const classTypeSelect = document.getElementById("classType");
    const customClassTypeInput = document.getElementById("customClassType");
    const name = nameInput.value;
    const course = courseInput.value;
    const dateStr = dateInput.value;
    // 2. Generate derived values
    const [year, month] = dateStr.split("-");
    const formattedDate = `${month}/${dateStr.split("-")[2]}/${year}`;
    const expirationYear = (parseInt(year, 10) + 1).toString();
    const random = Math.floor(Math.random() * 90000 + 10000);
    const certId = `3SAI-${year}-${month}-${random}`;
    const selectedType = classTypeSelect.value;
    const classType = selectedType === "Other" ? customClassTypeInput.value : selectedType;
    // 3. Build certificate URL and LinkedIn URL
    const certUrl = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;
    const linkedInBase = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
    const certName = `${course} ${classType}`;
    const issuer = "3 Strand Solutions";
    const linkedInUrl = `${linkedInBase}` +
        `&name=${encodeURIComponent(certName)}` +
        `&organizationName=${encodeURIComponent(issuer)}` +
        `&issueYear=${encodeURIComponent(year)}` +
        `&issueMonth=${encodeURIComponent(month)}` +
        `&expirationYear=${encodeURIComponent(expirationYear)}` +
        `&expirationMonth=${encodeURIComponent(month)}` +
        `&certificationId=${encodeURIComponent(certId)}` +
        `&certificationUrl=${encodeURIComponent(certUrl)}`;
    // 4. Update on‐page certificate preview, with null‐checks
    const headerEl = document.getElementById("certNameHeader");
    if (headerEl)
        headerEl.textContent = name;
    const bodyNameEl = document.getElementById("certNameBody");
    if (bodyNameEl)
        bodyNameEl.textContent = name;
    const courseEl = document.getElementById("certCourse");
    if (courseEl)
        courseEl.textContent = course;
    const typeEl = document.getElementById("certClassType");
    if (typeEl)
        typeEl.textContent = classType;
    const dateEl = document.getElementById("certDate");
    if (dateEl)
        dateEl.textContent = formattedDate;
    const idEl = document.getElementById("certId");
    if (idEl)
        idEl.textContent = certId;
    // Set the window title for PDF filename
    document.title = certId;
    // 6. Scroll to preview
    const previewEl = document.getElementById("certificateOutput");
    if (previewEl) {
        previewEl.scrollIntoView({ behavior: "smooth" });
    }
    // 5. Update bottom-buttons links if they exist
    const certLinkBtn = document.getElementById("certLinkBtn");
    if (certLinkBtn)
        certLinkBtn.href = certUrl;
    const linkedInLinkBtn = document.getElementById("linkedInLinkBtn");
    if (linkedInLinkBtn)
        linkedInLinkBtn.href = linkedInUrl;
    // 7. Fire off sheet update in background (no on-screen messaging)
    const payload = { name, course, classType, date: formattedDate, certId, certUrl, linkedInUrl };
    const query = new URLSearchParams({ payload: JSON.stringify(payload) });
    fetch(`https://script.google.com/macros/s/AKfycbw7N6911df3waLyvjewatplsUIBa_lFvdLm7PdUUE253XjKQPirmkCaLqt7Oe01yA1pjg/exec?${query}`)
        .then(res => res.text())
        .then(response => console.log("Sheet response:", response))
        .catch(err => console.error("Sheet update failed:", err));
}
function printCertificate() {
    window.print();
}
function setupEventListeners() {
    const form = document.getElementById("certificateForm");
    const printBtn = document.getElementById("printBtn");
    const classTypeSelect = document.getElementById("classType");
    const customTypeWrapper = document.getElementById("customTypeWrapper");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", e => {
        e.preventDefault();
        generateCertificate();
    });
    printBtn === null || printBtn === void 0 ? void 0 : printBtn.addEventListener("click", printCertificate);
    classTypeSelect === null || classTypeSelect === void 0 ? void 0 : classTypeSelect.addEventListener("change", () => {
        if (customTypeWrapper) {
            customTypeWrapper.style.display = classTypeSelect.value === "Other" ? "block" : "none";
        }
    });
}
document.addEventListener("DOMContentLoaded", setupEventListeners);
