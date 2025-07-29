 const form = document.getElementById("kayit-form");
const tabloBody = document.querySelector("#kayit-tablosu tbody");
let kayıtlar = JSON.parse(localStorage.getItem("kayıtlar") || "[]");
let duzenlemeIndex = -1;

function tabloyuGuncelle() {
  tabloBody.innerHTML = "";
  kayıtlar.forEach((kayıt, index) => {
    const satir = document.createElement("tr");

    satir.innerHTML = `
      <td>${index + 1}</td>
      <td>${kayıt.plaka}</td>
      <td>${kayıt.firma}</td>
      <td>${kayıt.cep}</td>
      <td>${kayıt.fiyat}</td>
      <td>${kayıt.beyan}</td>
      <td>${kayıt.odeme}</td>
      <td>
        <button onclick="duzenle(${index})">Düzenle</button>
        <button onclick="sil(${index})">Sil</button>
      </td>
    `;
    tabloBody.appendChild(satir);
  });

  localStorage.setItem("kayıtlar", JSON.stringify(kayıtlar));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const yeniKayıt = {
    plaka: form.plaka.value.trim(),
    firma: form.firma.value.trim(),
    cep: form.cep.value.trim(),
    fiyat: form.fiyat.value.trim(),
    beyan: form.beyan.value.trim(),
    odeme: form.odeme.value
  };

  // Aynı plakalı kayıt kontrolü
  if (duzenlemeIndex === -1 && kayıtlar.some(k => k.plaka === yeniKayıt.plaka)) {
    alert("Bu plakaya ait kayıt zaten var!");
    return;
  }

  if (duzenlemeIndex === -1) {
    kayıtlar.push(yeniKayıt);
  } else {
    kayıtlar[duzenlemeIndex] = yeniKayıt;
    duzenlemeIndex = -1;
    form.querySelector("button[type='submit']").textContent = "Kaydet";
  }

  form.reset();
  tabloyuGuncelle();
});

function sil(index) {
  if (confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
    kayıtlar.splice(index, 1);
    tabloyuGuncelle();
  }
}

function duzenle(index) {
  const kayıt = kayıtlar[index];
  form.plaka.value = kayıt.plaka;
  form.firma.value = kayıt.firma;
  form.cep.value = kayıt.cep;
  form.fiyat.value = kayıt.fiyat;
  form.beyan.value = kayıt.beyan;
  form.odeme.value = kayıt.odeme;
  duzenlemeIndex = index;
  form.querySelector("button[type='submit']").textContent = "Güncelle";
}

function pdfIndir() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Beyan Takip Raporu", 105, 15, null, null, "center");

  let y = 30;
  kayıtlar.forEach((kayıt, i) => {
    doc.setFontSize(12);
    doc.text(`${i + 1}. Plaka: ${kayıt.plaka}`, 10, y);
    doc.text(`Firma: ${kayıt.firma}`, 60, y);
    doc.text(`Cep: ${kayıt.cep}`, 130, y);

    y += 6;
    doc.text(`Fiyat: ${kayıt.fiyat}`, 10, y);
    doc.text(`Beyan: ${kayıt.beyan}`, 60, y);
    doc.text(`Ödeme: ${kayıt.odeme}`, 130, y);

    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("beyan-raporu.pdf");
}

// İlk çalıştırma
tabloyuGuncelle();
