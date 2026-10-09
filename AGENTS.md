# 🤖 Project Rules & Agent Protocol: Ardobe AI

> **Target**: `d:\porto\ardobe-vton`  
> **Project Scope**: Web & Mobile-ready Video Virtual Try-On Studio

---

## ⚡ Pre-Flight Protocol
1. Selalu baca `SYSTEM_STATE.md` dan `docs/architecture.md` sebelum melakukan perubahan kode.
2. Gunakan **Vanilla CSS** untuk styling (sesuai aturan ekosistem). Jangan gunakan TailwindCSS tanpa persetujuan eksplisit.
3. Desain harus berstandar **Executive & Luxury Modernism**: Palet warna dark mode berkelas, kontras ramah mata, glassmorphism halus, micro-interaction responsif, dan tipografi modern.

---

## 🔍 Verification Gates
- Setiap komponen video player wajib memiliki fallback state saat video belum dipilih atau gagal dimuat.
- Tidak boleh ada memory leak pada pemanggilan `URL.createObjectURL()` dan `MediaRecorder`. Pastikan `URL.revokeObjectURL()` dan event listener di-clean up dengan benar di `useEffect`.
- Semua data contract harus bertipe TypeScript ketat (`strict: true`).
