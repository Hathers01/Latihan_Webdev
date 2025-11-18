        // Menjalankan seluruh skrip JavaScript setelah halaman web selesai dimuat sepenuhnya.
        document.addEventListener('DOMContentLoaded', function() {
            
            // Mengambil elemen-elemen HTML dari halaman untuk dimanipulasi oleh skrip.
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            // Mendefinisikan tautan (URL) untuk gambar yang akan ditampilkan berdasarkan status kalkulator.
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
             Membuat fungsi untuk mengubah gambar status berdasarkan kondisi (sukses, eror, atau normal).
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    // Mengembalikan gambar ke status normal jika kondisi bukan 'success' atau 'error'.
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
             Membuat fungsi untuk membersihkan layar kalkulator dan mengembalikan gambar ke normal.
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
             Membuat fungsi untuk menghapus satu karakter terakhir pada layar kalkulator.
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
             Membuat fungsi untuk menambahkan angka atau operator ke layar kalkulator.
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
             Membuat fungsi utama untuk menghitung hasil akhir dari input pada layar.
             */
            function calculateResult() {
                // Memeriksa apakah layar kosong sebelum melakukan perhitungan.
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    // Menjalankan fungsi 'clearDisplay' setelah jeda waktu 1,5 detik.
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                    // Mengevaluasi (menghitung) ekspresi matematika yang ada di layar sebagai string.
                    let result = eval(display.value
                        .replace(/%/g, '/100') // Mengganti simbol persen (%) dengan '/100' agar dapat dihitung.
                    ); 
                    
                    // Memeriksa apakah hasil perhitungan adalah angka yang valid (bukan 'Infinity').
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); // Menampilkan gambar status 'sukses' jika perhitungan berhasil.
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error'); // Menampilkan gambar status 'eror' jika terjadi kesalahan perhitungan.
                    setTimeout(clearDisplay, 1500);
                }
            }


            // Melakukan perulangan (loop) untuk setiap tombol kalkulator yang ada.
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                    // Memeriksa nilai dari tombol yang ditekan untuk menentukan tindakan yang sesuai.
                    switch(value) {
                        case 'C':
                            // Memanggil fungsi untuk membersihkan layar.
                            clearDisplay();
                            break;
                        case 'DEL':
                            // Memanggil fungsi untuk menghapus karakter terakhir.
                            deleteLastChar();
                            break;
                        case '=':
                            // Memanggil fungsi untuk menghitung hasil.
                            calculateResult();
                            break;
                        default:
                            // Memeriksa apakah layar sedang menampilkan hasil sukses/eror sebelum memulai input baru.
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            // Menambahkan pendengar (listener) untuk mendeteksi input dari keyboard.
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });
