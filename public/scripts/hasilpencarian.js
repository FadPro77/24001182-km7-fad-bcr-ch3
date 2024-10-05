document.addEventListener("DOMContentLoaded", function () {
  // Ambil data mobil dari localStorage
  const mobilData = JSON.parse(localStorage.getItem("mobilData"));

  const hasilPencarianContent = document.querySelector(
    "#hasilpencarian-content"
  );

  // Cek apakah data mobil tersedia
  if (mobilData && mobilData.length > 0) {
    mobilData.forEach((mobil) => {
      // Buat elemen HTML untuk setiap mobil
      const mobilCard = `
      <div class="col-md-3">
        <div class="card" style="width: 18rem;">
          <img class="image-content" src="${mobil.image}" class="card-img-top" alt="${mobil.model}">
          <div class="card-body">
            <h5 class="card-title" id="title-car">
            ${mobil.manufacture} ${mobil.model}/${mobil.type}
            </h5>
            <p class="card-text" id="rent-car">
            Rp ${mobil.rentPerDay} / Hari
            </p>
            <p class="card-text" id="description-car">
            ${mobil.description}
            </p>
            <p class="card-text" id="capacity-car">
            Kapasitas: ${mobil.capacity} penumpang
            </p>
            <p class="card-text" id="transmission-car">
            Transmisi: ${mobil.transmission}
            </p>
            <p class="card-text" id="year-car">
            Tahun ${mobil.year}
            </p>
            <button type="button" class="button__pilih-mobil btn-primary">
            Pilih Mobil
            </button>
          </div>
        </div>
      </div>
      `;

      hasilPencarianContent.innerHTML += mobilCard;
    });
  } else {
    hasilPencarianContent.innerHTML = `
      <p class="no-results">Tidak ada mobil yang ditemukan.</p>
  `;
  }
});
