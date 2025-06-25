/********************************************************************
 * certificate.ts — certs ▸ badges ▸ 1200×1200 PNG (single folder)
 * Posts with mode:"no-cors" and waits for PDF-row POST before PNG POST.
 ********************************************************************/

/*---------------------------------------------------------------*
 * 0) Web-app endpoint                                           *
 *---------------------------------------------------------------*/
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbyPEaO2zczX26xUyBxbsT-v_0S1A1imUb75iMmrXNmlhhAwyjwEmvV2j5HJhwJioSMZQA/exec";

/*---------------------------------------------------------------*
 * 1) html2canvas typing                                         *
 *---------------------------------------------------------------*/
declare const html2canvas: (
  el: HTMLElement,
  opts?: { scale?: number; backgroundColor?: null }
) => Promise<HTMLCanvasElement>;

/*---------------------------------------------------------------*
 * 2) Toast helper                                               *
 *---------------------------------------------------------------*/
function toast(msg: string, ms = 1700) {
  let box = document.getElementById("toast") as HTMLElement | null;
  if (!box) {
    box = document.createElement("div");
    box.id = "toast";
    box.style.cssText =
      "position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);" +
      "background:#003366;color:#fff;padding:.45rem 1rem;border-radius:6px;" +
      "font-size:.85rem;z-index:10000;opacity:.9;pointer-events:none";
    document.body.appendChild(box);
  }
  box.textContent = msg;
  box.style.display = "block";
  setTimeout(() => (box!.style.display = "none"), ms);
}

/*---------------------------------------------------------------*
 * 3) POST wrapper (no-cors, opaque)                             *
 *---------------------------------------------------------------*/
const postJSON = (data: unknown) =>
  fetch(WEBAPP_URL, {
    method: "POST",
    mode:   "no-cors",
    body:   JSON.stringify(data)
  });

/*---------------------------------------------------------------*
 * 4) Tabs / text helpers                                        *
 *---------------------------------------------------------------*/
function setupTabs() {
  const [certTab, badgeTab] = [
    document.getElementById("tabCertificates")!,
    document.getElementById("tabBadges")!
  ];
  const [certSec, badgeSec] = [
    document.getElementById("certificatesTab")!,
    document.getElementById("badgesTab")!
  ];
  certTab.onclick = () => {
    certTab.classList.add("active");
    badgeTab.classList.remove("active");
    certSec.style.display = "";
    badgeSec.style.display = "none";
  };
  badgeTab.onclick = () => {
    badgeTab.classList.add("active");
    certTab.classList.remove("active");
    badgeSec.style.display = "";
    certSec.style.display = "none";
  };
}
const setText = (id: string, txt: string) =>
  void (document.getElementById(id)!.textContent = txt);

/*---------------------------------------------------------------*
 * 5) Certificate generation (row ➜ THEN PNG)                    *
 *---------------------------------------------------------------*/
function generateCertificate(): void {
  /* 5.1 gather form data */
  const name   = (document.getElementById("studentName") as HTMLInputElement).value.trim();
  const course = (document.getElementById("courseName")  as HTMLInputElement).value.trim();
  const date   = (document.getElementById("courseDate")  as HTMLInputElement).value;
  const sel    = (document.getElementById("classType")   as HTMLSelectElement).value;
  const custom = (document.getElementById("customClassType") as HTMLInputElement).value.trim();
  const type   = sel === "Other" ? custom : sel;
  if (!name || !course || !date) return alert("Fill in all certificate fields.");

  /* 5.2 IDs & URLs */
  const [yy, mmRaw, dd] = date.split("-");
  const mm  = ("0" + mmRaw).slice(-2);
  const certId = `3SAI-${yy}-${mm}-${Math.floor(10000 + Math.random()*90000)}`;
  const certUrl       = `https://courtneylanier.github.io/CertGen/certificates/${certId}.pdf`;
  const strandCredUrl = `https://3strand.ai/certifications/${certId}.pdf`;
  const linkedInUrl =
    "https://www.linkedin.com/profile/add?" +
    [
      "startTask=CERTIFICATION_NAME",
      `name=${encodeURIComponent(`${course} ${type}`)}`,
      `organizationName=${encodeURIComponent("3 Strand Solutions")}`,
      `issueYear=${yy}`, `issueMonth=${mm}`,
      `expirationYear=${(+yy + 1)}`, `expirationMonth=${mm}`,
      `certificationId=${certId}`,
      `certificationUrl=${encodeURIComponent(strandCredUrl)}`
    ].join("&");

  /* 5.3 preview */
  setText("certNameHeader", name);
  setText("certNameBody",   name);
  setText("certCourse",     course);
  setText("certClassType",  type);
  setText("certDate",       `${mmRaw}/${dd}/${yy}`);
  setText("certId",         certId);

  /* 5.4 POST row + PDF FIRST */
  toast("Uploading certificate row…");
  postJSON({
    name, course, classType: type,
    date: `${mmRaw}/${dd}/${yy}`,
    certId, certUrl, linkedInUrl, strandCredUrl,
    savePdf: true
  })
    .then(() => {
      toast("Row & PDF done");
      /* 5.5 THEN capture PNG and POST */
      const el = document.getElementById("certificateOutput") as HTMLElement;
      const ow = el.style.width, oh = el.style.height;
      el.style.width = el.style.height = "1200px";

      return html2canvas(el, { scale: 1, backgroundColor: null })
        .then(canvas => {
          el.style.width = ow; el.style.height = oh;
          const base64 = canvas.toDataURL("image/png").split(",")[1];
          toast("Uploading PNG…");
          return postJSON({ certId, pngBase64: base64, _type: "png" });
        })
        .then(() => toast("PNG saved"));
    })
    .catch(err => { console.error(err); toast("Upload failed"); });
}

/*---------------------------------------------------------------*
 * 6) Badge generation                                           *
 *---------------------------------------------------------------*/
let lastBadgeLinkedInUrl = "";
let lastBadgePdfUrl      = "";

function generateBadge(): void {
  const name = (document.getElementById("studentNameBadge") as HTMLInputElement).value.trim();
  const file = (document.getElementById("badgeType")        as HTMLSelectElement).value;
  const date = (document.getElementById("badgeDate")        as HTMLInputElement).value;
  if (!name || !file || !date) return alert("Fill in all badge fields.");

  const sel   = document.querySelector(`#badgeType option[value="${file}"]`) as HTMLOptionElement;
  const title = sel.textContent ?? "";
  const [yy, mmRaw, dd] = date.split("-");
  const mm = ("0" + mmRaw).slice(-2);
  const badgeId = `3SAIB-${yy}-${mm}-${Math.floor(10000 + Math.random()*90000)}`;
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
  (document.getElementById("badgePreview") as HTMLElement).style.display = "";
  (document.getElementById("badgeImage")   as HTMLImageElement).src = file;
  setText("badgeTitle",       title);
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
 * 7) Copy-link helpers                                          *
 *---------------------------------------------------------------*/
function setupBadgeCopyButtons() {
  document.getElementById("copyLinkedInBadgeBtn")
    ?.addEventListener("click", () => {
      if (!lastBadgeLinkedInUrl) return alert("Generate a badge first.");
      navigator.clipboard.writeText(lastBadgeLinkedInUrl)
        .then(() => alert("LinkedIn badge link copied"));
    });

  document.getElementById("copyBadgePdfBtn")
    ?.addEventListener("click", () => {
      if (!lastBadgePdfUrl) return alert("Generate a badge & PDF first.");
      navigator.clipboard.writeText(lastBadgePdfUrl)
        .then(() => alert("Badge PDF URL copied"));
    });
}

/*---------------------------------------------------------------*
 * 8) Bootstrapping                                              *
 *---------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  (document.getElementById("certificateForm") as HTMLFormElement)
    .addEventListener("submit", e => { e.preventDefault(); generateCertificate(); });
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());
  (document.getElementById("badgeForm") as HTMLFormElement)
    .addEventListener("submit", e => { e.preventDefault(); generateBadge(); });
  setupBadgeCopyButtons();
});
