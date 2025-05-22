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
    const random = Math.floor(Math.random() * 90000 + 10000);
    const selectedType = classTypeSelect.value;
    const classType = selectedType === "Other" ? customClassTypeInput.value : selectedType;
    document.getElementById("certNameHeader").textContent = name;
    document.getElementById("certNameBody").textContent = name;
    document.getElementById("certCourse").textContent = course;
    document.getElementById("certClassType").textContent = classType;
    document.getElementById("certDate").textContent = formattedDate;
    document.getElementById("certId").textContent = `3SAI-${year}-${month}-${random}`;
    (_a = document.getElementById("certificateOutput")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
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
        if (classTypeSelect.value === "Other") {
            customTypeWrapper.style.display = "block";
        }
        else {
            customTypeWrapper.style.display = "none";
        }
    });
}
document.addEventListener("DOMContentLoaded", setupEventListeners);
