/********************************************************************
 * certificate.ts  —  certificates + badges (merged version)
 *  • Keeps your new certificate URL / extra column (`strandCredUrl`)
 *  • Restores the full badge-generation workflow
 *  • Uses your newer Apps Script deployment URL — change if needed
 ********************************************************************/

/* ----------------------------------------------------------------- *
 * 0) Apps Script Web-app endpoint (make sure this is the live one!) *
 * ----------------------------------------------------------------- */
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzb9AkhpIU5CUeqmPiqeVMYuHiXj3EQPBoU4pnP4rTLOoZa7GhQPOpxthmFsWYPIFWRnw/exec";

/* ----------------------------------------------------------------- *
 * 1) UI helpers                                                     *
 * ----------------------------------------------------------------- */
// Tab switching (Certificates | Badges)
function setupTabs(): void {
  const certTab  = document.getElementById("tabCertificates")!;
  const badgeTab = document.getElementById("tabBadges")!;
  const certSec  = document.getElementById("certificatesTab")!;
  const badgeSec = document.getElementById("badgesTab")!;

  certTab.addEventListener("click", () => {
    certTab.classList.add("active");
    badgeTab.classList.remove("active");
    certSec.style.display  = "";
    badgeSec.style.display = "none";
  });
  badgeTab.addEventListener("click", () => {
    badgeTab.classList.add("active");
    certTab.classList.remove("active");
    badgeSec.style.display = "";
    certSec.style.display  = "none";
  });
}

// Safe text setter
function setText(id: string, txt: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

/* ----------------------------------------------------------------- *
 * 2) Certificate generation                                         *
 * ----------------------------------------------------------------- */
function generateCertificate(): void {
  // 2.1  Grab form values
  const name      = (document.getElementById("studentName") as HTMLInputElement).value.trim();
  const course    = (document.getElementById("courseName")  as HTMLInputElement).value.trim();
  const dateStr   = (document.getElementById("courseDate")  as HTMLInputElement).value; // YYYY-MM-DD
  const sel       = (document.getElementById("classType")   as HTMLSelectElement).value;
  const custom    = (document.getElementById("customClassType") as HTMLInputElement).value.trim();
  const classType = sel === "Other" ? custom : sel;

  // 2.2  Derived values & IDs
  const [year, month, day] = dateStr.split("-");
  const formattedDate  = `${month}/${day}/${year}`;
  const paddedMonth    = ("0" + month).slice(-2);
  const expirationYear = (parseInt(year, 10) + 1).toString();
  const randomId       = Math.floor(Math.random() * 90000 + 10000);
  const certId         = `3SAI-${year}-${paddedMonth}-${randomId}`;

  // 2.3  URLs
  const certUrl       = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;
  const strandCredUrl = `https://3strand.ai/certifications/${certId}.pdf`;
  const linkedInUrl   = [
    "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME",
    `name=${encodeURIComponent(`${course} ${classType}`)}`,
    `organizationName=${encodeURIComponent("3 Strand Solutions")}`,
    `issueYear=${encodeURIComponent(year)}`,
    `issueMonth=${encodeURIComponent(paddedMonth)}`,
    `expirationYear=${encodeURIComponent(expirationYear)}`,
    `expirationMonth=${encodeURIComponent(paddedMonth)}`,
    `certificationId=${encodeURIComponent(certId)}`,
    `certificationUrl=${encodeURIComponent(strandCredUrl)}`
  ].join("&");

  // 2.4  Preview on page
  setText("certNameHeader", name);
  setText("certNameBody",   name);
  setText("certCourse",     course);
  setText("certClassType",  classType);
  setText("certDate",       formattedDate);
  setText("certId",         certId);
  document.title = certId;  // so the browser’s Save-as-PDF suggests the ID
  document.getElementById("certificateOutput")?.scrollIntoView({ behavior: "smooth" });

  // 2.5  Update quick-link buttons (if present)
  (document.getElementById("certLinkBtn")     as HTMLAnchorElement | null)?.setAttribute("href", certUrl);
  (document.getElementById("linkedInLinkBtn") as HTMLAnchorElement | null)?.setAttribute("href", linkedInUrl);

  // 2.6  Ship it to Apps Script (sheet row + Drive PDF)
  const payload = {
    name,
    course,
    classType,
    date: formattedDate,
    certId,
    certUrl,
    linkedInUrl,
    strandCredUrl, // ←  NEW column in the “Certificates” sheet
    savePdf: true
  };
  const query = new URLSearchParams({ payload: JSON.stringify(payload) });

  fetch(`${WEBAPP_URL}?${query.toString()}`)
    .then(r => r.text())
    .then(txt => console.log("Certificate logged:", txt))
    .catch(err => console.error("Certificate update failed:", err));
}

/* ----------------------------------------------------------------- *
 * 3) Badge generation                                               *
 * ----------------------------------------------------------------- */
let lastBadgeLinkedInUrl = "";
let lastBadgePdfUrl      = "";

function generateBadge(): void {
  // 3.1  Read inputs
  const nameInput   = document.getElementById("studentNameBadge") as HTMLInputElement;
  const badgeSelect = document.getElementById("badgeType")        as HTMLSelectElement;
  const dateInput   = document.getElementById("badgeDate")        as HTMLInputElement;

  const name      = nameInput.value.trim();
  const badgeFile = badgeSelect.value;                                      // e.g. "badge1.png"
  const badgeName = badgeSelect.selectedOptions[0].textContent!.trim();
  const dateStr   = dateInput.value;                                        // YYYY-MM-DD

  // 3.2  Derived
  const [year, month, day] = dateStr.split("-");
  const formattedDate = `${month}/${day}/${year}`;
  const issueMonth    = ("0" + month).slice(-2);
  const expYear       = (parseInt(year, 10) + 1).toString();
  const expMonth      = issueMonth;
  const badgeId       = `3SAIB-${year}-${issueMonth}-${Math.floor(Math.random()*90000+10000)}`;

  // 3.3  URLs & LinkedIn deep-link
  const badgeUrl      = `https://3strand.ai/badges/${encodeURIComponent(badgeFile)}`;
  const orgId         = "9542708"; // LinkedIn Org ID
  lastBadgeLinkedInUrl = [
    "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME",
    `name=${encodeURIComponent(badgeName)}`,
    `organizationId=${encodeURIComponent(orgId)}`,
    `issueYear=${encodeURIComponent(year)}`,
    `issueMonth=${encodeURIComponent(issueMonth)}`,
    `expirationYear=${encodeURIComponent(expYear)}`,
    `expirationMonth=${encodeURIComponent(expMonth)}`,
    `certificationId=${encodeURIComponent(badgeId)}`,
    `certificationUrl=${encodeURIComponent(badgeUrl)}`
  ].join("&");

  // 3.4  Preview badge
  (document.getElementById("badgeImage") as HTMLImageElement).src = badgeFile;
  setText("badgeTitle",       badgeName);
  setText("badgeDateDisplay", formattedDate);
  document.getElementById("badgePreview")!.style.display = "block";

  // 3.5  Send to Apps Script
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
      console.log("Badge logged:", txt);
      // If your Apps Script responds “…Badge PDF: <url>”
      const parts = txt.split("Badge PDF:");
      lastBadgePdfUrl = parts[1]?.trim() || "";
    })
    .catch(err => console.error("Badge update failed:", err));
}

/* ----------------------------------------------------------------- *
 * 4) Extra helper buttons (copy deep-links)                         *
 * ----------------------------------------------------------------- */
function setupBadgeCopyButtons(): void {
  document.getElementById("copyLinkedInBadgeBtn")!
    .addEventListener("click", () => {
      if (!lastBadgeLinkedInUrl) return alert("Generate a badge first.");
      navigator.clipboard.writeText(lastBadgeLinkedInUrl)
        .then(() => alert("LinkedIn badge link copied"));
    });

  document.getElementById("copyBadgePdfBtn")!
    .addEventListener("click", () => {
      if (!lastBadgePdfUrl) return alert("Generate a badge & PDF first.");
      navigator.clipboard.writeText(lastBadgePdfUrl)
        .then(() => alert("Badge PDF URL copied"));
    });
}

/* ----------------------------------------------------------------- *
 * 5) Printing                                                       *
 * ----------------------------------------------------------------- */
function printCertificate(): void {
  window.print();
}

/* ----------------------------------------------------------------- *
 * 6) Bootstrapping                                                  *
 * ----------------------------------------------------------------- */
function setupEventListeners(): void {
  setupTabs();

  document.getElementById("certificateForm")!
    .addEventListener("submit", e => { e.preventDefault(); generateCertificate(); });
  document.getElementById("printBtn")!
    .addEventListener("click", printCertificate);

  document.getElementById("badgeForm")!
    .addEventListener("submit", e => { e.preventDefault(); generateBadge(); });

  setupBadgeCopyButtons();
}

document.addEventListener("DOMContentLoaded", setupEventListeners);

