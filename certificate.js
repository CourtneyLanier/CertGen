"use strict";
function generateCertificate() {
    var _a;
    const nameInput = document.getElementById("studentName");
    const courseInput = document.getElementById("courseName");
    const dateInput = document.getElementById("courseDate");
    const classTypeSelect = document.getElementById("classType");
    const customClassTypeInput = document.getElementById("customClassType");
    const name = nameInput.value;
    const course = courseInput.value;
    const dateStr = dateInput.value;
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    const expirationYear = (parseInt(year) + 1).toString();
    const random = Math.floor(Math.random() * 90000 + 10000);
    const certId = `3SAI-${year}-${month}-${random}`;
    const studentNameSlug = name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
    const selectedType = classTypeSelect.value;
    const classType = selectedType === "Other" ? customClassTypeInput.value : selectedType;
    // Credential URL
    const certUrl = `https://courtneylanier.github.io/CertGen/certificates/${studentNameSlug}.pdf`;
    // Update certificate preview
    document.getElementById("certNameHeader").textContent = name;
    document.getElementById("certNameBody").textContent = name;
    document.getElementById("certCourse").textContent = course;
    document.getElementById("certClassType").textContent = classType;
    document.getElementById("certDate").textContent = formattedDate;
    document.getElementById("certId").textContent = certId;
    document.getElementById("certLink").href = certUrl;
    document.getElementById("certLink").textContent = certUrl;
    (_a = document.getElementById("certificateOutput")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    // LinkedIn Link
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
    const linkedInAnchor = document.getElementById("linkedInLink");
    linkedInAnchor.href = linkedInUrl;
    linkedInAnchor.textContent = "Click here to add your certificate to LinkedIn";
    linkedInAnchor.style.display = "block";
    // Display credential link as well
    const credentialContainer = document.getElementById("credentialLinkContainer");
    credentialContainer.style.display = "block";
    // Show status message
    const statusMessage = document.getElementById("sheetStatus");
    // Send data to Google Sheet
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
        }
        else {
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
    const classTypeSelect = document.getElementById("classType");
    const customTypeWrapper = document.getElementById("customTypeWrapper");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
        e.preventDefault();
        generateCertificate();
    });
    printBtn === null || printBtn === void 0 ? void 0 : printBtn.addEventListener("click", printCertificate);
    classTypeSelect === null || classTypeSelect === void 0 ? void 0 : classTypeSelect.addEventListener("change", () => {
        customTypeWrapper.style.display = (classTypeSelect.value === "Other") ? "block" : "none";
    });
}
document.addEventListener("DOMContentLoaded", setupEventListeners);
