'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix for default markers in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  projects: any[];
  filters: any;
  onProjectSelect: (project: any) => void;
  compareMode?: boolean;
  onAddToComparison?: (project: any) => void;
  selectedForComparison?: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  projects, 
  filters, 
  onProjectSelect,
  compareMode = false,
  onAddToComparison,
  selectedForComparison = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const markerClusterGroupRef = useRef<any>(null);
  const heatmapLayerRef = useRef<L.Layer | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Custom asset class icons
  const createCustomIcon = (project: any) => {
    const isSelected = selectedForComparison.find(p => p.id === project.id);
    const iconSize = isSelected ? 50 : 40;
    const fontSize = isSelected ? 14 : 12;
    
    const assetClassIcons: { [key: string]: string } = {
      'Residencial': '🏠',
      'Comercial': '🏢',
      'Oficinas': '🏬',
      'Mixto': '🏘️',
      'Industrial': '🏭'
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container" style="position: relative;">
          <div class="marker-pin" style="
            width: ${iconSize}px;
            height: ${iconSize}px;
            background: linear-gradient(135deg, ${project.color} 0%, ${project.color}dd 100%);
            border: ${isSelected ? '4px' : '3px'} solid ${isSelected ? '#fbbf24' : 'white'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${fontSize}px;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            box-shadow: 0 ${isSelected ? '6px 12px' : '4px 8px'} rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            z-index: ${isSelected ? '1000' : '100'};
          ">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="font-size: ${fontSize - 2}px;">${assetClassIcons[project.assetClass] || '📍'}</div>
              <div style="font-size: ${fontSize - 4}px; margin-top: -2px;">${project.score}</div>
            </div>
          </div>
          <div class="marker-label" style="
            position: absolute;
            top: ${iconSize + 5}px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 1001;
          ">
            <div style="font-weight: bold; margin-bottom: 2px;">${project.name}</div>
            <div style="font-size: 10px; color: #ccc;">${project.assetClass} • Score: ${project.score}</div>
          </div>
          ${isSelected ? `
            <div style="
              position: absolute;
              top: -5px;
              right: -5px;
              width: 20px;
              height: 20px;
              background: #fbbf24;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              z-index: 1002;
            ">✓</div>
          ` : ''}
        </div>
      `,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2]
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Guatemala City
    const map = L.map(mapRef.current, {
      center: [14.6349, -90.5069],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true // Better performance for many markers
    });

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Add scale control
    L.control.scale({
      position: 'bottomleft'
    }).addTo(map);

    // Add different tile layers based on view mode
    const tileLayers: { [key: string]: L.TileLayer } = {
      map: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
      }),
      hybrid: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
      })
    };

    // Add default tile layer
    tileLayers.map.addTo(map);

    // Store tile layers for switching
    (map as any).tileLayers = tileLayers;

    // Initialize marker cluster group
    markerClusterGroupRef.current = (L as any).markerClusterGroup({
      chunkedLoading: true,
      chunkProgress: (processed: number, total: number) => {
        // Optional: show loading progress
      },
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        const markers = cluster.getAllChildMarkers();
        
        // Calculate average score for cluster
        const avgScore = markers.reduce((sum: number, marker: any) => {
          return sum + (marker.options.project?.score || 0);
        }, 0) / markers.length;

        // Determine cluster color based on average score
        let clusterColor = '#6b7280';
        if (avgScore >= 8.5) clusterColor = '#22c55e';
        else if (avgScore >= 7.5) clusterColor = '#84cc16';
        else if (avgScore >= 6.5) clusterColor = '#eab308';
        else if (avgScore >= 5.5) clusterColor = '#f97316';
        else clusterColor = '#ef4444';

        return L.divIcon({
          html: `
            <div style="
              background: ${clusterColor};
              border: 3px solid white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            ">
              ${count}
            </div>
          `,
          className: 'marker-cluster-custom',
          iconSize: [40, 40]
        });
      },
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50
    });

    map.addLayer(markerClusterGroupRef.current);

    mapInstanceRef.current = map;
    setMapLoaded(true);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerClusterGroupRef.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // Update tile layer based on view mode
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    const map = mapInstanceRef.current;
    const tileLayers = (map as any).tileLayers;

    // Remove current tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer
    if (tileLayers[filters.viewMode]) {
      tileLayers[filters.viewMode].addTo(map);
    }

    // Add labels for satellite and hybrid modes
    if (filters.viewMode === 'hybrid') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19,
        pane: 'overlayPane'
      }).addTo(map);
    }
  }, [filters.viewMode, mapLoaded]);

  // Update markers and layers
  useEffect(() => {
    if (!mapInstanceRef.current || !markerClusterGroupRef.current || !mapLoaded) return;

    // Clear existing markers
    markerClusterGroupRef.current.clearLayers();
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current && mapInstanceRef.current.hasLayer(marker)) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Remove existing heatmap
    if (heatmapLayerRef.current && mapInstanceRef.current.hasLayer(heatmapLayerRef.current)) {
      mapInstanceRef.current.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }

    // Add project markers
    if (filters.layers.projects) {
      projects.forEach(project => {
        const customIcon = createCustomIcon(project);
        const marker = L.marker(project.coordinates, { 
          icon: customIcon
        });

        // Add hover effects
        marker.on('mouseover', (e) => {
          const markerElement = e.target.getElement();
          if (markerElement) {
            const container = markerElement.querySelector('.marker-container');
            const pin = container?.querySelector('.marker-pin') as HTMLElement;
            const label = container?.querySelector('.marker-label') as HTMLElement;
            
            if (pin) {
              pin.style.transform = 'scale(1.1)';
              pin.style.zIndex = '1000';
            }
            if (label) {
              label.style.opacity = '1';
            }
          }
        });

        marker.on('mouseout', (e) => {
          const markerElement = e.target.getElement();
          if (markerElement) {
            const container = markerElement.querySelector('.marker-container');
            const pin = container?.querySelector('.marker-pin') as HTMLElement;
            const label = container?.querySelector('.marker-label') as HTMLElement;
            
            if (pin) {
              pin.style.transform = 'scale(1)';
              pin.style.zIndex = 'auto';
            }
            if (label) {
              label.style.opacity = '0';
            }
          }
        });

        // Add click handler
        marker.on('click', () => {
          onProjectSelect(project);
          
          // Animate to project location
          mapInstanceRef.current!.flyTo(project.coordinates, 15, {
            duration: 1.5
          });
        });

        // Enhanced popup content
        const popupContent = `
          <div style="min-width: 250px; font-family: Inter, sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: #1f2937; flex: 1;">${project.name}</h3>
              <div style="
                background: ${project.color};
                color: white;
                padding: 4px 10px;
                border-radius: 16px;
                font-size: 14px;
                font-weight: bold;
                margin-left: 8px;
              ">${project.score}</div>
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 8px; color: #6b7280;">
              <svg style="width: 14px; height: 14px; margin-right: 6px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span style="font-size: 14px;">${project.address}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 13px;">
              <div>
                <div style="color: #9ca3af; margin-bottom: 2px;">Presupuesto</div>
                <div style="font-weight: 600; color: #374151;">$${(project.budget / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div style="color: #9ca3af; margin-bottom: 2px;">Área</div>
                <div style="font-weight: 600; color: #374151;">${project.area.toLocaleString()} m²</div>
              </div>
              <div>
                <div style="color: #9ca3af; margin-bottom: 2px;">Unidades</div>
                <div style="font-weight: 600; color: #374151;">${project.units}</div>
              </div>
              <div>
                <div style="color: #9ca3af; margin-bottom: 2px;">Pisos</div>
                <div style="font-weight: 600; color: #374151;">${project.floors}</div>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center;">
                <div style="
                  width: 12px;
                  height: 12px;
                  background: ${project.color};
                  border-radius: 50%;
                  margin-right: 6px;
                "></div>
                <span style="font-size: 14px; color: #4b5563; font-weight: 500;">${project.assetClass}</span>
              </div>
              <span style="font-size: 12px; color: #10b981; font-weight: 600; background: #d1fae5; padding: 2px 8px; border-radius: 12px;">${project.status}</span>
            </div>
            
            <div style="display: flex; gap: 8px;">
              <a href="/projects/${project.id}" style="
                flex: 1;
                display: inline-block;
                background: linear-gradient(135deg, #c5ff00 0%, #a3d600 100%);
                color: black;
                padding: 8px 16px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 13px;
                font-weight: 600;
                text-align: center;
                transition: transform 0.2s ease;
              " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                Ver Detalles
              </a>
              ${compareMode ? `
                <button onclick="window.addToComparison && window.addToComparison(${project.id})" style="
                  background: #3b82f6;
                  color: white;
                  padding: 8px 12px;
                  border: none;
                  border-radius: 8px;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background 0.2s ease;
                " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
                  Comparar
                </button>
              ` : ''}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        // Add to cluster group if clustering is enabled
        if (filters.layers.clusters) {
          markerClusterGroupRef.current.addLayer(marker);
        } else {
          marker.addTo(mapInstanceRef.current!);
          markersRef.current.push(marker);
        }
      });
    }

    // Add heatmap layer
    if (filters.layers.heatmap && projects.length > 0) {
      // Create heatmap data points
      const heatmapData = projects.map(project => [
        project.coordinates[0],
        project.coordinates[1],
        project.score / 10 // Normalize score to 0-1 for heatmap intensity
      ]);

      // Simple heatmap implementation using circles
      const heatmapGroup = L.layerGroup();
      
      projects.forEach(project => {
        const intensity = project.score / 10;
        const radius = 500 + (intensity * 1000); // Radius based on score
        
        const circle = L.circle(project.coordinates, {
          radius: radius,
          fillColor: project.color,
          fillOpacity: 0.1 + (intensity * 0.2),
          color: project.color,
          weight: 1,
          opacity: 0.3
        });
        
        heatmapGroup.addLayer(circle);
      });

      heatmapGroup.addTo(mapInstanceRef.current!);
      heatmapLayerRef.current = heatmapGroup;
      markersRef.current.push(heatmapGroup);
    }

    // Add municipality boundaries
    if (filters.layers.municipalities) {
      const guatemalaCityBounds: [number, number][] = [
        [14.7, -90.6],
        [14.7, -90.4],
        [14.5, -90.4],
        [14.5, -90.6],
        [14.7, -90.6]
      ];

      const municipalityLayer = L.polygon(guatemalaCityBounds, {
        color: '#6b7280',
        weight: 2,
        opacity: 0.6,
        fillColor: '#6b7280',
        fillOpacity: 0.05,
        dashArray: '5, 5'
      }).addTo(mapInstanceRef.current!);

      municipalityLayer.bindTooltip('Ciudad de Guatemala', {
        permanent: false,
        direction: 'center',
        className: 'municipality-tooltip'
      });

      markersRef.current.push(municipalityLayer);
    }

    // Add road network
    if (filters.layers.roads) {
      const majorRoads: [number, number][][] = [
        [[14.6349, -90.5069], [14.6100, -90.4800], [14.5800, -90.4500]],
        [[14.6349, -90.5069], [14.6200, -90.4900], [14.6000, -90.4700]],
        [[14.6349, -90.5069], [14.6100, -90.5200], [14.5900, -90.5400]]
      ];

      majorRoads.forEach((road, index) => {
        const roadLayer = L.polyline(road, {
          color: '#9ca3af',
          weight: 3,
          opacity: 0.7,
          dashArray: index === 0 ? undefined : '10, 5'
        }).addTo(mapInstanceRef.current!);

        roadLayer.bindTooltip(`Carretera Principal ${index + 1}`, {
          permanent: false,
          direction: 'center'
        });

        markersRef.current.push(roadLayer);
      });
    }

    // Add population density overlay
    if (filters.layers.population) {
      const densityAreas = [
        { center: [14.6349, -90.5069] as [number, number], radius: 2000, density: 'high' as const },
        { center: [14.6100, -90.4900] as [number, number], radius: 1500, density: 'medium' as const },
        { center: [14.6500, -90.5200] as [number, number], radius: 1000, density: 'low' as const }
      ];

      densityAreas.forEach(area => {
        const colors = {
          high: { color: '#ef4444', opacity: 0.4 },
          medium: { color: '#f59e0b', opacity: 0.3 },
          low: { color: '#22c55e', opacity: 0.2 }
        };

        const circle = L.circle(area.center, {
          radius: area.radius,
          ...colors[area.density],
          fillColor: colors[area.density].color,
          fillOpacity: colors[area.density].opacity,
          weight: 2
        }).addTo(mapInstanceRef.current!);

        circle.bindTooltip(`Densidad Poblacional ${area.density === 'high' ? 'Alta' : area.density === 'medium' ? 'Media' : 'Baja'}`, {
          permanent: false,
          direction: 'center'
        });

        markersRef.current.push(circle);
      });
    }

    // Set up global function for popup comparison button
    if (compareMode && onAddToComparison) {
      (window as any).addToComparison = (projectId: number) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          onAddToComparison(project);
        }
      };
    }

  }, [projects, filters, onProjectSelect, compareMode, onAddToComparison, selectedForComparison, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      {/* Enhanced map controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="glass-effect rounded-lg p-3">
          <div className="text-sm text-gray-700 font-medium mb-1">
            {projects.length} Proyectos Visibles
          </div>
          <div className="text-xs text-gray-500">
            Score promedio: {projects.length > 0 ? (projects.reduce((sum, p) => sum + p.score, 0) / projects.length).toFixed(1) : '0.0'}
          </div>
        </div>
        
        {compareMode && (
          <div className="glass-effect rounded-lg p-3">
            <div className="text-sm text-blue-700 font-medium">
              Modo Comparación Activo
            </div>
            <div className="text-xs text-blue-600">
              {selectedForComparison.length}/3 seleccionados
            </div>
          </div>
        )}
      </div>

      {/* Legend for clusters */}
      {filters.layers.clusters && (
        <div className="absolute top-4 right-16 z-[1000]">
          <div className="glass-effect rounded-lg p-3">
            <div className="text-xs text-gray-700 font-medium mb-2">Clusters por Score</div>
            <div className="space-y-1">
              {[
                { range: '8.5+', color: '#22c55e', label: 'Excelente' },
                { range: '7.5+', color: '#84cc16', label: 'Muy Bueno' },
                { range: '6.5+', color: '#eab308', label: 'Bueno' },
                { range: '5.5+', color: '#f97316', label: 'Regular' },
                { range: '<5.5', color: '#ef4444', label: 'Bajo' }
              ].map(({ range, color, label }) => (
                <div key={range} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 border border-white"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-gray-600">{range} - {label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 z-[1000]">
        <div className="text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-1 rounded">
          © OpenStreetMap © CARTO © Esri
        </div>
      </div>

      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #e5e7eb;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
        }
        
        .municipality-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          border: none !important;
          color: white !important;
          font-size: 12px !important;
          padding: 6px 10px !important;
          border-radius: 6px !important;
          font-weight: 500 !important;
        }
        
        .marker-cluster-custom {
          background: transparent !important;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: 1px solid #d1d5db !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }
        
        .leaflet-control-scale-line {
          background: rgba(255, 255, 255, 0.8) !important;
          border: 2px solid #374151 !important;
          color: #374151 !important;
          font-weight: 500 !important;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;

