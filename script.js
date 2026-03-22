const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");

let imageData = null;

// Handle file upload
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

// Handle paste (Ctrl + V)
document.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;

  for (let item of items) {
    if (item.type.startsWith("image")) {
      const file = item.getAsFile();
      loadImage(file);
    }
  }
});

function loadImage(file) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      canvas.style.display = "block";

      imageData = canvas.toDataURL("image/jpeg", 1.0);
      downloadBtn.disabled = false;
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

// Convert to PDF
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;

  const img = new Image();
  img.src = imageData;

  img.onload = function () {
    // Convert pixels to mm (1 px ≈ 0.264583 mm)
    const pxToMm = 0.264583;

    const pdfWidth = img.width * pxToMm;
    const pdfHeight = img.height * pxToMm;

    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight]
    });

    pdf.addImage(imageData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("map.pdf");
  };
});