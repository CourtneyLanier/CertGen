"use strict";
function generateCertificate() {
    var _a;
    const nameInput = document.getElementById("studentName");
    const courseInput = document.getElementById("courseName");
    const dateInput = document.getElementById("courseDate");
    const name = nameInput.value;
    const course = courseInput.value;
    const dateStr = dateInput.value;
    const [year, month, day] = dateStr.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    const random = Math.floor(Math.random() * 90000 + 10000);
    document.getElementById("certNameHeader").textContent = name;
    document.getElementById("certNameBody").textContent = name;
    document.getElementById("certCourse").textContent = course;
    document.getElementById("certDate").textContent = formattedDate;
    document.getElementById("certId").textContent = `3SAI-${year}-${month}-${random}`;
    (_a = document.getElementById("certificateOutput")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
}
function printCertificate() {
    window.print();
}
function setupEventListeners() {
    const form = document.getElementById("certificateForm");
    const printBtn = document.getElementById("printBtn");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
        e.preventDefault();
        generateCertificate();
    });
    printBtn === null || printBtn === void 0 ? void 0 : printBtn.addEventListener("click", printCertificate);
}
document.addEventListener("DOMContentLoaded", setupEventListeners);
