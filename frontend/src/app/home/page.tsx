'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import PropertyMatchGrid from './components/PropertyMatchGrid';
import DataDimensions from './components/DataDimensions';
import TestimonialsSection from './components/TestimonialsSection';
import AppDownloadSection from './components/AppDownloadSection';
import FindMatchModal from './components/FindMatchModal';
import FixedBottomBar from './components/FixedBottomBar';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <Header onFindMatch={openModal} />

      <main>
        <HeroSection onFindMatch={openModal} />
        <PropertyMatchGrid />
        <DataDimensions />
        <TestimonialsSection />
        <AppDownloadSection onFindMatch={openModal} />
      </main>

      <Footer />

      <FixedBottomBar onFindMatch={openModal} />
      <FindMatchModal open={modalOpen} onClose={closeModal} />
    </div>
  );
}