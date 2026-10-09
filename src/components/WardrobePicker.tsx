import React, { useState, useRef } from 'react';
import { Shirt, Plus, Check } from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';
import type { GarmentCategory, GarmentItem } from '../types';

export const WardrobePicker: React.FC = () => {
  const { allGarments, selectedGarment, setSelectedGarment, addCustomGarment } = useTryOn();
  const [selectedCat, setSelectedCat] = useState<GarmentCategory>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: { key: GarmentCategory; label: string }[] = [
    { key: 'all', label: 'Semua Koleksi' },
    { key: 'uniforms', label: 'Seragam (Uniform)' },
    { key: 'outerwear', label: 'Jaket & Blazer' },
    { key: 'dresses_abaya', label: 'Abaya & Gaun' },
    { key: 'hoodies', label: 'Hoodie' },
    { key: 'tops', label: 'Kaos & Kemeja' },
  ];

  const filteredGarments = allGarments.filter((g) => {
    if (selectedCat === 'all') return true;
    return g.category === selectedCat;
  });

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const newGarment: GarmentItem = {
        id: 'custom-garment-' + Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'tops',
        thumbnailUrl: imageUrl,
        hdGarmentUrl: imageUrl,
        brandOrStyle: 'Custom Upload',
        tag: 'User Asset',
        fabric: 'Detected Cotton Blend',
        colors: ['#222222', '#6366f1'],
      };
      addCustomGarment(newGarment);
    }
  };

  return (
    <div className="wardrobe-picker-panel glass-panel">
      <div className="panel-header-row">
        <div className="panel-header-title">
          <Shirt size={18} className="text-accent" />
          <h3>Koleksi Wardrobe (Ardobe)</h3>
        </div>
        <button
          className="btn-upload-garment"
          onClick={() => fileInputRef.current?.click()}
          title="Upload foto baju sendiri"
        >
          <Plus size={14} />
          <span>Tambah Baju</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          style={{ display: 'none' }}
          onChange={handleCustomUpload}
        />
      </div>

      {/* Category Pills */}
      <div className="categories-scroll-row">
        {categories.map((c) => (
          <button
            key={c.key}
            className={`cat-pill ${selectedCat === c.key ? 'cat-pill-active' : ''}`}
            onClick={() => setSelectedCat(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Garments Carousel / Grid */}
      <div className="garments-grid">
        {filteredGarments.map((garment) => {
          const isSelected = selectedGarment.id === garment.id;
          return (
            <div
              key={garment.id}
              className={`garment-card ${isSelected ? 'garment-card-selected' : ''}`}
              onClick={() => setSelectedGarment(garment)}
            >
              <div className="garment-thumb-wrap">
                <img src={garment.thumbnailUrl} alt={garment.name} className="garment-img" />
                <span className="garment-tag-badge">{garment.tag}</span>
                {isSelected && (
                  <div className="garment-active-check">
                    <Check size={16} />
                  </div>
                )}
              </div>
              <div className="garment-details">
                <h4 className="garment-name">{garment.name}</h4>
                <p className="garment-style">{garment.brandOrStyle}</p>
                <div className="garment-color-dots">
                  {garment.colors.map((color, i) => (
                    <span
                      key={i}
                      className="color-dot"
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                  <span className="fabric-label">{garment.fabric}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
