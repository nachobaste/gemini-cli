'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container-urbop hero-content text-center">
          <h1 className="hero-title">Análisis Inteligente para el Desarrollo Urbano</h1>
          <p className="hero-subtitle mx-auto">
            GEOCUBO es la plataforma líder en análisis multicriterio para proyectos de desarrollo urbano en América Latina, transformando datos complejos en decisiones estratégicas.
          </p>
          <div className="hero-cta justify-center">
            <Link href="/map" className="btn btn-primary">
              Explorar Mapa Interactivo
            </Link>
            <Link href="/projects" className="btn btn-outline">
              Ver Proyectos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="feature-section">
        <div className="container-urbop">
          <div className="text-center">
            <h2 className="section-title">Características Principales</h2>
            <p className="section-subtitle mx-auto">Herramientas poderosas para un análisis integral y una toma de decisiones informada.</p>
          </div>
          <div className="feature-grid mt-12">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3 className="feature-title">Explorador de Mapas GIS</h3>
              <p>Visualice proyectos con filtros avanzados, análisis geoespacial y capas de datos personalizables para entender el contexto territorial.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Motor de Análisis MCDA</h3>
              <p>Utilice nuestro sistema de Análisis de Decisión Multicriterio con 13 parámetros configurables para evaluar la viabilidad de proyectos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Business Model Canvas</h3>
              <p>Integre la planificación estratégica con nuestro módulo de Business Model Canvas, diseñado específicamente para el sector inmobiliario.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
