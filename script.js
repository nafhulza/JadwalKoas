// Data jadwal koas (simulasi database)
let jadwalKoas = JSON.parse(localStorage.getItem('jadwalKoas')) || [];
let currentEditId = null;

// DOM Elements
const jadwalForm = document.getElementById('jadwalForm');
const jadwalTableBody = document.getElementById('jadwalTableBody');
const emptyState = document.getElementById('emptyState');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const filterStase = document.getElementById('filterStase');
const filterStatus = document.getElementById('filterStatus');
const resetFilter = document.getElementById('resetFilter');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const closeModal = document.querySelector('.close');
const themeToggle = document.getElementById('themeToggle');

// Stats elements
const totalMahasiswa = document.getElementById('totalMahasiswa');
const totalRumahSakit = document.getElementById('totalRumahSakit');
const sedangKoas = document.getElementById('sedangKoas');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    console.log('Menginisialisasi aplikasi...');
    
    // Load theme preference
    loadThemePreference();
    
    // Load sample data jika kosong
    if (jadwalKoas.length === 0) {
        console.log('Memuat data sample...');
        loadSampleData();
    }
    
    updateStats();
    renderJadwalTable();
    
    // Event listeners
    jadwalForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    searchInput.addEventListener('input', handleSearch);
    filterStase.addEventListener('change', handleFilter);
    filterStatus.addEventListener('change', handleFilter);
    resetFilter.addEventListener('click', resetFilters);
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    closeModal.addEventListener('click', closeDeleteModal);
    themeToggle.addEventListener('click', toggleTheme);
    
    window.addEventListener('click', function(event) {
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    });
    
    console.log('Aplikasi berhasil diinisialisasi');
    console.log('Total data:', jadwalKoas.length);
}

// Theme Management - PERBAIKAN BESAR
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    console.log('Memuat tema:', savedTheme);
    document.body.className = savedTheme;
    updateThemeToggle(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light-mode' ? 'dark-mode' : 'light-mode';
    
    console.log('Mengganti tema dari', currentTheme, 'ke', newTheme);
    
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('.theme-text');
    
    if (theme === 'dark-mode') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Mode Terang';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Mode Gelap';
    }
    console.log('Tombol tema diperbarui:', text.textContent);
}

// ... (fungsi lainnya tetap sama seperti sebelumnya)

// Load sample data
function loadSampleData() {
    jadwalKoas = [
        {
            id: generateId(),
            nama: "Fauzia Amanda",
            nim: "22111012384",
            stase: "Penyakit Dalam",
            rumahSakit: "RSUD Dr. Soetomo",
            tanggalMulai: "2025-09-01",
            tanggalSelesai: "2026-10-31",
            pembimbing: "Dr. Surya Adi, Sp.PD",
            status: "Aktif"
        },
        {
            id: generateId(),
            nama: "Tugba Amelda",
            nim: "22111012346",
            stase: "Obstetri dan Ginekologi",
            rumahSakit: "RSIA Kendangsari",
            tanggalMulai: "2025-09-15",
            tanggalSelesai: "2026-11-15",
            pembimbing: "Dr. Maya Sari, Sp.OG",
            status: "Aktif"
        },
        {
            id: generateId(),
            nama: "Yolanda Brian",
            nim: "21121012765",
            stase: "Pediatri",
            rumahSakit: "RSUD Dr. Soetomo",
            tanggalMulai: "2025-10-01",
            tanggalSelesai: "2026-11-30",
            pembimbing: "Dr. Indah Permatasari, Sp.A",
            status: "Aktif"
        },
        {
            id: generateId(),
            nama: "Ricky Rullian",
            nim: "21121012453",
            stase: "Ilmu Bedah",
            rumahSakit: "RS Universitas Airlangga",
            tanggalMulai: "2025-08-15",
            tanggalSelesai: "2026-10-15",
            pembimbing: "Dr. Agus Setiawan, Sp.B",
            status: "Selesai"
        },
        {
            id: generateId(),
            nama: "Rani Handita",
            nim: "22111012876",
            stase: "Neurologi",
            rumahSakit: "RSUD Dr. Soetomo",
            tanggalMulai: "2025-10-10",
            tanggalSelesai: "2026-12-10",
            pembimbing: "Dr. Linda Wati, Sp.N",
            status: "Aktif"
        }
    ];
    localStorage.setItem('jadwalKoas', JSON.stringify(jadwalKoas));
}

// Generate unique ID
function generateId() {
    return 'jadwal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Update dashboard statistics
function updateStats() {
    // Update dari data aktual
    totalMahasiswa.textContent = jadwalKoas.length;
    
    const rumahSakitUnik = [...new Set(jadwalKoas.map(j => j.rumahSakit))];
    totalRumahSakit.textContent = rumahSakitUnik.length;
    
    const aktifCount = jadwalKoas.filter(j => j.status === 'Aktif').length;
    sedangKoas.textContent = aktifCount;
    
    console.log('Stats updated:', {
        total: jadwalKoas.length,
        rumahSakit: rumahSakitUnik.length,
        aktif: aktifCount
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const jadwalId = document.getElementById('jadwalId').value;
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const stase = document.getElementById('stase').value;
    const rumahSakit = document.getElementById('rumahSakit').value;
    const tanggalMulai = document.getElementById('tanggalMulai').value;
    const tanggalSelesai = document.getElementById('tanggalSelesai').value;
    const pembimbing = document.getElementById('pembimbing').value;
    const status = document.getElementById('status').value;
    
    // Validate dates
    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
        alert('Tanggal selesai harus setelah tanggal mulai');
        return;
    }
    
    const jadwalData = {
        id: jadwalId || generateId(),
        nama,
        nim,
        stase,
        rumahSakit,
        tanggalMulai,
        tanggalSelesai,
        pembimbing,
        status
    };
    
    if (jadwalId) {
        // Update existing jadwal
        const index = jadwalKoas.findIndex(j => j.id === jadwalId);
        if (index !== -1) {
            jadwalKoas[index] = jadwalData;
        }
    } else {
        // Add new jadwal
        jadwalKoas.push(jadwalData);
    }
    
    // Save to localStorage
    localStorage.setItem('jadwalKoas', JSON.stringify(jadwalKoas));
    
    // Reset form and update table
    resetForm();
    updateStats();
    renderJadwalTable();
    
    // Show success message
    showNotification(`Jadwal koas berhasil ${jadwalId ? 'diperbarui' : 'ditambahkan'}`, 'success');
}

// Reset form
function resetForm() {
    jadwalForm.reset();
    document.getElementById('jadwalId').value = '';
    document.getElementById('status').value = 'Aktif';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Jadwal';
    cancelBtn.style.display = 'none';
    currentEditId = null;
}

// Cancel edit
function cancelEdit() {
    resetForm();
}

// Render jadwal table
function renderJadwalTable(filteredData = null) {
    const dataToRender = filteredData || jadwalKoas;
    
    if (dataToRender.length === 0) {
        jadwalTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    jadwalTableBody.innerHTML = dataToRender.map(jadwal => `
        <tr>
            <td><strong>${jadwal.nim}</strong></td>
            <td>${jadwal.nama}</td>
            <td>${jadwal.stase}</td>
            <td>${jadwal.rumahSakit}</td>
            <td>${formatDateDDMMYYYY(jadwal.tanggalMulai)}</td>
            <td>${formatDateDDMMYYYY(jadwal.tanggalSelesai)}</td>
            <td>
                <span class="status-badge status-${jadwal.status.toLowerCase()}">
                    ${jadwal.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-warning" onclick="editJadwal('${jadwal.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn btn-danger" onclick="showDeleteModal('${jadwal.id}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Format date to DD/MM/YYYY
function formatDateDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Edit jadwal
function editJadwal(id) {
    const jadwal = jadwalKoas.find(j => j.id === id);
    if (!jadwal) return;
    
    document.getElementById('jadwalId').value = jadwal.id;
    document.getElementById('nama').value = jadwal.nama;
    document.getElementById('nim').value = jadwal.nim;
    document.getElementById('stase').value = jadwal.stase;
    document.getElementById('rumahSakit').value = jadwal.rumahSakit;
    document.getElementById('tanggalMulai').value = jadwal.tanggalMulai;
    document.getElementById('tanggalSelesai').value = jadwal.tanggalSelesai;
    document.getElementById('pembimbing').value = jadwal.pembimbing;
    document.getElementById('status').value = jadwal.status;
    
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Jadwal';
    cancelBtn.style.display = 'inline-flex';
    currentEditId = id;
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Show delete confirmation modal
function showDeleteModal(id) {
    currentEditId = id;
    deleteModal.style.display = 'block';
}

// Close delete modal
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    currentEditId = null;
}

// Confirm delete
function confirmDelete() {
    if (!currentEditId) return;
    
    jadwalKoas = jadwalKoas.filter(j => j.id !== currentEditId);
    localStorage.setItem('jadwalKoas', JSON.stringify(jadwalKoas));
    updateStats();
    renderJadwalTable();
    closeDeleteModal();
    
    // Show success message
    showNotification('Jadwal koas berhasil dihapus', 'success');
}

// Handle search and filter
function handleSearch() {
    applyFilters();
}

function handleFilter() {
    applyFilters();
}

function resetFilters() {
    searchInput.value = '';
    filterStase.value = '';
    filterStatus.value = '';
    renderJadwalTable();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const staseFilter = filterStase.value;
    const statusFilter = filterStatus.value;
    
    const filteredData = jadwalKoas.filter(jadwal => {
        const matchesSearch = !searchTerm || 
            jadwal.nama.toLowerCase().includes(searchTerm) ||
            jadwal.nim.toLowerCase().includes(searchTerm) ||
            jadwal.stase.toLowerCase().includes(searchTerm);
        
        const matchesStase = !staseFilter || jadwal.stase === staseFilter;
        const matchesStatus = !statusFilter || jadwal.status === statusFilter;
        
        return matchesSearch && matchesStase && matchesStatus;
    });
    
    renderJadwalTable(filteredData);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: var(--border-radius);
                color: white;
                z-index: 1001;
                box-shadow: var(--box-shadow);
                animation: slideInRight 0.3s, fadeOut 0.3s 2.7s forwards;
            }
            .notification-success {
                background: linear-gradient(135deg, var(--success), #20c997);
            }
            .notification-info {
                background: linear-gradient(135deg, var(--info), #138496);
            }
            .notification-warning {
                background: linear-gradient(135deg, var(--warning), #e0a800);
            }
            .notification-danger {
                background: linear-gradient(135deg, var(--danger), #c82333);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Export functions untuk global access
window.editJadwal = editJadwal;
window.showDeleteModal = showDeleteModal;