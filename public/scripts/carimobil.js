// Fungsi untuk mengecek apakah form valid (semua input mandatory diisi)
function cekFormValid() {
  const tanggal = document.querySelector(".form__tanggal").value;
  const waktu = document.querySelector(".form__waktu-jemput").value;

  // Jika tipe driver, tanggal, atau waktu kosong, return false
  return tanggal !== "" && waktu !== "";
}

// Fungsi untuk toggle disabled pada tombol cari
function toggleTombolCari() {
  const tombolCari = document.querySelector(".btn-cari");
  if (cekFormValid()) {
    tombolCari.disabled = false;
  } else {
    tombolCari.disabled = true;
  }
}

// Panggil toggleTombolCari setiap kali ada perubahan di form
document
  .querySelector(".form__tanggal")
  .addEventListener("input", toggleTombolCari);
document
  .querySelector(".form__waktu-jemput")
  .addEventListener("input", toggleTombolCari);

// Fungsi pencarian mobil
async function cariMobil() {
  const tanggal = document.querySelector(".form__tanggal").value;
  const waktu = document.querySelector(".form__waktu-jemput").value;
  const jumlahPenumpang = document.querySelector(
    ".form__jumlah-penumpang"
  ).value;

  if (!cekFormValid()) {
    alert("ISILAH FORM YANG TERSEDIA");
    return;
  }

  try {
    // Use Binar's listCars to fetch and randomize car data
    const mobil = await Binar.listCars();
    console.log("Data mobil berhasil diambil:", mobil);

    const filteredCars = mobil.filter((car) => {
      const carDate = new Date(car.availableAt);
      const searchDate = new Date(`${tanggal}T${waktu}`);

      // Cek tanggal
      const tanggalDicari = carDate <= searchDate;

      // Cek kapasitas penumpang jika diisi, jika tidak diisi maka abaikan
      const penumpangDicari =
        !jumlahPenumpang || car.capacity >= Number(jumlahPenumpang);

      // Cek apakah mobil available
      const Availablity = car.available === true;

      return tanggalDicari && penumpangDicari && Availablity;
    });

    console.log("Filtered Cars: ", filteredCars);

    // Menyimpan hasil pencarian ke localStorage
    localStorage.clear();
    localStorage.setItem("mobilData", JSON.stringify(filteredCars));

    // Mengarahkan ke halaman hasil pencarian
    window.location.href = "hasilpencarian.html";
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

// Jalankan toggleTombolCari ketika halaman dimuat
document.addEventListener("DOMContentLoaded", toggleTombolCari);
