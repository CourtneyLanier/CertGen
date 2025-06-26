"use strict";
/********************************************************************
 * certificate.ts — certs ▸ badges ▸ PNG (buttons hidden in PNG)
 ********************************************************************/
/*---------------------------------------------------------------*
 * 0) Web-app endpoint                                           *
 *---------------------------------------------------------------*/
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyPEaO2zczX26xUyBxbsT-v_0S1A1imUb75iMmrXNmlhhAwyjwEmvV2j5HJhwJioSMZQA/exec";
/*---------------------------------------------------------------*
 * 2) Toast helper                                               *
 *---------------------------------------------------------------*/
function toast(msg, ms = 1700) {
    let box = document.getElementById("toast");
    if (!box) {
        box = document.createElement("div");
        box.id = "toast";
        box.style.cssText =
            "position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);" +
                "background:#003366;color:#fff;padding:.5rem 1rem;border-radius:6px;" +
                "font-size:.85rem;z-index:10000;opacity:.9;pointer-events:none";
        document.body.appendChild(box);
    }
    box.textContent = msg;
    box.style.display = "block";
    setTimeout(() => (box.style.display = "none"), ms);
}
/*---------------------------------------------------------------*
 * 3) POST wrapper (mode:'no-cors')                              *
 *---------------------------------------------------------------*/
const postJSON = (data) => fetch(WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data)
});
/*---------------------------------------------------------------*
 * 4) Tabs & text helper                                         *
 *---------------------------------------------------------------*/
function setupTabs() {
    const [certTab, badgeTab] = [
        document.getElementById("tabCertificates"),
        document.getElementById("tabBadges")
    ];
    const [certSec, badgeSec] = [
        document.getElementById("certificatesTab"),
        document.getElementById("badgesTab")
    ];
    certTab.onclick = () => { certTab.classList.add("active"); badgeTab.classList.remove("active"); certSec.style.display = ""; badgeSec.style.display = "none"; };
    badgeTab.onclick = () => { badgeTab.classList.add("active"); certTab.classList.remove("active"); badgeSec.style.display = ""; certSec.style.display = "none"; };
}
const setText = (id, txt) => void (document.getElementById(id).textContent = txt);
/*---------------------------------------------------------------*
 * 5) Certificate generation (row→PNG with buttons hidden)       *
 *---------------------------------------------------------------*/
function generateCertificate() {
    /* --- form vals --- */
    const name = document.getElementById("studentName").value.trim();
    const course = document.getElementById("courseName").value.trim();
    const date = document.getElementById("courseDate").value;
    const sel = document.getElementById("classType").value;
    const custom = document.getElementById("customClassType").value.trim();
    const type = sel === "Other" ? custom : sel;
    if (!name || !course || !date)
        return alert("Fill in all certificate fields.");
    /* --- IDs & URLs --- */
    const [yy, mmRaw, dd] = date.split("-");
    const mm = ("0" + mmRaw).slice(-2);
    const certId = `3SAI-${yy}-${mm}-${Math.floor(10000 + Math.random() * 90000)}`;
    const certUrl = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;
    const strandCredUrl = `https://3strand.ai/certifications/${certId}.pdf`;
    const linkedInUrl = "https://www.linkedin.com/profile/add?" +
        [
            "startTask=CERTIFICATION_NAME",
            `name=${encodeURIComponent(`${course} ${type}`)}`,
            `organizationName=${encodeURIComponent("3 Strand Solutions")}`,
            `issueYear=${yy}`, `issueMonth=${mm}`,
            `expirationYear=${(+yy + 1)}`, `expirationMonth=${mm}`,
            `certificationId=${certId}`,
            `certificationUrl=${encodeURIComponent(strandCredUrl)}`
        ].join("&");
    /* --- preview --- */
    setText("certNameHeader", name);
    setText("certNameBody", name);
    setText("certCourse", course);
    setText("certClassType", type);
    setText("certDate", `${mmRaw}/${dd}/${yy}`);
    setText("certId", certId);
    /* --- POST row + PDF --- */
    toast("Uploading certificate row…");
    postJSON({
        name, course, classType: type, date: `${mmRaw}/${dd}/${yy}`,
        certId, certUrl, linkedInUrl, strandCredUrl,
        savePdf: true
    })
        .then(() => {
        toast("Row & PDF done");
        /* --- PNG capture (buttons hidden) --- */
        const el = document.getElementById("certificateOutput");
        const ow = el.style.width, oh = el.style.height;
        /* hide .no-print elements */
        const hidden = [];
        el.querySelectorAll(".no-print").forEach(elem => {
            hidden.push({ el: elem, display: elem.style.display });
            elem.style.display = "none";
        });
        el.style.width = el.style.height = "1200px";
        return html2canvas(el, { scale: 1, backgroundColor: null })
            .then(canvas => {
            /* restore styles */
            el.style.width = ow;
            el.style.height = oh;
            hidden.forEach(h => h.el.style.display = h.display);
            const base64 = canvas.toDataURL("image/png").split(",")[1];
            toast("Uploading PNG…");
            return postJSON({ certId, pngBase64: base64, _type: "png" });
        })
            .then(() => toast("PNG saved"));
    })
        .catch(err => { console.error(err); toast("Upload failed"); });
}
/*---------------------------------------------------------------*
 * 6) Badge generation (unchanged)                               *
 *---------------------------------------------------------------*/
let lastBadgeLinkedInUrl = "";
let lastBadgePdfUrl = "";
function generateBadge() {
    var _a;
    const name = document.getElementById("studentNameBadge").value.trim();
    const file = document.getElementById("badgeType").value;
    const date = document.getElementById("badgeDate").value;
    if (!name || !file || !date)
        return alert("Fill in all badge fields.");
    const opt = document.querySelector(`#badgeType option[value="${file}"]`);
    const title = (_a = opt.textContent) !== null && _a !== void 0 ? _a : "";
    const [yy, mmRaw, dd] = date.split("-");
    const mm = ("0" + mmRaw).slice(-2);
    const badgeId = `3SAIB-${yy}-${mm}-${Math.floor(10000 + Math.random() * 90000)}`;
    const badgeUrl = `https://3strand.ai/badges/${encodeURIComponent(file)}`;
    const orgId = "9542708";
    lastBadgeLinkedInUrl =
        "https://www.linkedin.com/profile/add?" +
            [
                "startTask=CERTIFICATION_NAME",
                `name=${encodeURIComponent(title)}`,
                `organizationId=${orgId}`,
                `issueYear=${yy}`, `issueMonth=${mm}`,
                `expirationYear=${(+yy + 1)}`, `expirationMonth=${mm}`,
                `certificationId=${badgeId}`,
                `certificationUrl=${encodeURIComponent(badgeUrl)}`
            ].join("&");
    /* preview */
    document.getElementById("badgePreview").style.display = "";
    document.getElementById("badgeImage").src = file;
    setText("badgeTitle", title);
    setText("badgeDateDisplay", `${mmRaw}/${dd}/${yy}`);
    /* POST badge */
    toast("Uploading badge…");
    postJSON({
        name, badgeTitle: title, badgeFile: file,
        badgeDate: `${mmRaw}/${dd}/${yy}`, badgeId,
        badgeUrl, badgeLinkedInUrl: lastBadgeLinkedInUrl,
        _type: "badge", savePdf: true
    })
        .then(() => toast("Badge saved"))
        .catch(err => { console.error(err); toast("Badge upload failed"); });
}
/*---------------------------------------------------------------*
 * 7) Copy-link buttons                                          *
 *---------------------------------------------------------------*/
function setupBadgeCopyButtons() {
    var _a, _b;
    (_a = document.getElementById("copyLinkedInBadgeBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        if (!lastBadgeLinkedInUrl)
            return alert("Generate a badge first.");
        navigator.clipboard.writeText(lastBadgeLinkedInUrl)
            .then(() => alert("LinkedIn badge link copied"));
    });
    (_b = document.getElementById("copyBadgePdfBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        if (!lastBadgePdfUrl)
            return alert("Generate a badge & PDF first.");
        navigator.clipboard.writeText(lastBadgePdfUrl)
            .then(() => alert("Badge PDF URL copied"));
    });
}
/*---------------------------------------------------------------*
 * 8) Bootstrapping                                              *
 *---------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    setupTabs();
    document.getElementById("certificateForm")
        .addEventListener("submit", e => { e.preventDefault(); generateCertificate(); });
    (_a = document.getElementById("printBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => window.print());
    document.getElementById("badgeForm")
        .addEventListener("submit", e => { e.preventDefault(); generateBadge(); });
    setupBadgeCopyButtons();
});
