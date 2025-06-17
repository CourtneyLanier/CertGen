"use strict";
// certificate.ts
// 0) Your deployed Apps Script URL:
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzidgDk7ym_x9V5KMMFR-JGfJDK4x_PkqiK4CsKTeL1G4y5d8siyUXxQ92M_636SFmypw/exec";
// 1) Tab switching
function setupTabs() {
    const certTab = document.getElementById("tabCertificates");
    const badgeTab = document.getElementById("tabBadges");
    const certSec = document.getElementById("certificatesTab");
    const badgeSec = document.getElementById("badgesTab");
    certTab.addEventListener("click", () => {
        certTab.classList.add("active");
        badgeTab.classList.remove("active");
        certSec.style.display = "";
        badgeSec.style.display = "none";
    });
    badgeTab.addEventListener("click", () => {
        badgeTab.classList.add("active");
        certTab.classList.remove("active");
        badgeSec.style.display = "";
        certSec.style.display = "none";
    });
}
// 2) Helper to set textContent if element exists
function setText(id, txt) {
    const el = document.getElementById(id);
    if (el)
        el.textContent = txt;
}
// 3) Generate Certificate
function generateCertificate() {
    var _a;
    // 3.1) Read inputs
    const nameInput = document.getElementById("studentName");
    const courseInput = document.getElementById("courseName");
    const dateInput = document.getElementById("courseDate");
    const classTypeSelect = document.getElementById("classType");
    const customClassTypeInput = document.getElementById("customClassType");
    const name = nameInput.value.trim();
    const course = courseInput.value.trim();
    const dateStr = dateInput.value; // "YYYY-MM-DD"
    // 3.2) Derived values
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    const issuanceMonth = ("0" + month).slice(-2); // zero-pad
    const expirationYear = (parseInt(year, 10) + 1).toString();
    const expirationMonth = issuanceMonth;
    const random = Math.floor(Math.random() * 90000 + 10000);
    const certId = `3SAI-${year}-${issuanceMonth}-${random}`;
    // determine classType
    const sel = classTypeSelect.value;
    const classType = sel === "Other" ? customClassTypeInput.value.trim() : sel;
    // 3.3) URLs
    const certUrl = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;
    const linkedInBase = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
    const certName = `${course} ${classType}`;
    const orgId = "9542708"; // ← your LinkedIn Org ID
    const linkedInUrl = [
        linkedInBase,
        `name=${encodeURIComponent(certName)}`,
        `organizationId=${encodeURIComponent(orgId)}`,
        `issueYear=${encodeURIComponent(year)}`,
        `issueMonth=${encodeURIComponent(issuanceMonth)}`,
        `expirationYear=${encodeURIComponent(expirationYear)}`,
        `expirationMonth=${encodeURIComponent(expirationMonth)}`,
        `certificationId=${encodeURIComponent(certId)}`,
        `certificationUrl=${encodeURIComponent(certUrl)}`
    ].join("&");
    // 3.4) Update on-page preview
    setText("certNameHeader", name);
    setText("certNameBody", name);
    setText("certCourse", course);
    setText("certClassType", classType);
    setText("certDate", formattedDate);
    setText("certId", certId);
    document.title = certId;
    (_a = document.getElementById("certificateOutput")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    // 3.5) Update bottom-buttons
    const certLinkBtn = document.getElementById("certLinkBtn");
    const linkedInBtnCert = document.getElementById("linkedInLinkBtn");
    if (certLinkBtn)
        certLinkBtn.href = certUrl;
    if (linkedInBtnCert)
        linkedInBtnCert.href = linkedInUrl;
    // 3.6) Fire off Apps Script (log + PDF gen)
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
    fetch(`${WEBAPP_URL}?${query.toString()}`)
        .then(r => r.text())
        .then(txt => console.log("Certificate logged:", txt))
        .catch(err => console.error("Certificate update failed:", err));
}
// 4) Generate Badge
let lastBadgeLinkedInUrl = "";
let lastBadgePdfUrl = "";
function generateBadge() {
    // 4.1) Read inputs
    const nameInput = document.getElementById("studentNameBadge");
    const badgeSelect = document.getElementById("badgeType");
    const dateInput = document.getElementById("badgeDate");
    const name = nameInput.value.trim();
    const badgeFile = badgeSelect.value; // e.g. "badge1.png"
    const badgeName = badgeSelect.selectedOptions[0].textContent.trim();
    const dateStr = dateInput.value; // "YYYY-MM-DD"
    // 4.2) Derived values
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    // expiration one year out
    const exp = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    exp.setFullYear(exp.getFullYear() + 1);
    const expYear = exp.getFullYear().toString();
    const expMonth = ("0" + (exp.getMonth() + 1)).slice(-2);
    const random = Math.floor(Math.random() * 90000 + 10000);
    const badgeId = `3SAIB-${year}-${expMonth}-${random}`;
    // 4.3) URLs + deep-link
    const badgeUrl = `https://courtneylanier.github.io/CertGen/badges/${encodeURIComponent(badgeFile)}`;
    const linkedInBase = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
    const orgId = "9542708";
    lastBadgeLinkedInUrl = [
        linkedInBase,
        `name=${encodeURIComponent(badgeName)}`,
        `organizationId=${encodeURIComponent(orgId)}`,
        `issueYear=${encodeURIComponent(year)}`,
        `issueMonth=${encodeURIComponent(("0" + month).slice(-2))}`,
        `expirationYear=${encodeURIComponent(expYear)}`,
        `expirationMonth=${encodeURIComponent(expMonth)}`,
        `certificationId=${encodeURIComponent(badgeId)}`,
        `certificationUrl=${encodeURIComponent(badgeUrl)}`
    ].join("&");
    // 4.4) Preview badge
    document.getElementById("badgeImage").src = badgeFile;
    setText("badgeTitle", badgeName);
    setText("badgeDateDisplay", formattedDate);
    document.getElementById("badgePreview").style.display = "block";
    // 4.5) Send to Apps Script (log + PDF gen)
    const payload = {
        name,
        badgeName,
        badgeDate: formattedDate,
        badgeId,
        badgeUrl,
        badgeLinkedInUrl: lastBadgeLinkedInUrl,
        _type: "badge",
        savePdf: true
    };
    const query = new URLSearchParams({ payload: JSON.stringify(payload) });
    fetch(`${WEBAPP_URL}?${query.toString()}`)
        .then(r => r.text())
        .then(txt => {
        var _a;
        console.log("Badge logged:", txt);
        // extract PDF link if your Apps Script returns it:
        const parts = txt.split("Badge PDF:");
        lastBadgePdfUrl = ((_a = parts[1]) === null || _a === void 0 ? void 0 : _a.trim()) || "";
    })
        .catch(err => console.error("Badge update failed:", err));
}
// 5) Copy–buttons for badges
function setupBadgeCopyButtons() {
    document.getElementById("copyLinkedInBadgeBtn")
        .addEventListener("click", () => {
        if (!lastBadgeLinkedInUrl) {
            return alert("Generate a badge first.");
        }
        navigator.clipboard.writeText(lastBadgeLinkedInUrl);
        alert("LinkedIn badge link copied");
    });
    document.getElementById("copyBadgePdfBtn")
        .addEventListener("click", () => {
        if (!lastBadgePdfUrl) {
            return alert("Generate a badge & PDF first.");
        }
        navigator.clipboard.writeText(lastBadgePdfUrl);
        alert("Badge PDF URL copied");
    });
}
// 6) Print handler
function printCertificate() {
    window.print();
}
// 7) Setup all event listeners
function setupEventListeners() {
    setupTabs();
    document.getElementById("certificateForm")
        .addEventListener("submit", e => { e.preventDefault(); generateCertificate(); });
    document.getElementById("printBtn")
        .addEventListener("click", printCertificate);
    document.getElementById("badgeForm")
        .addEventListener("submit", e => { e.preventDefault(); generateBadge(); });
    setupBadgeCopyButtons();
}
document.addEventListener("DOMContentLoaded", setupEventListeners);
