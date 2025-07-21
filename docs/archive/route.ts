import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const templateType = pathname.split('/').pop();

  try {
    let workbook: XLSX.WorkBook;
    let filename: string;

    switch (templateType) {
      case 'projects':
        workbook = createProjectsTemplate();
        filename = 'plantilla_proyectos.xlsx';
        break;
      case 'mcda':
        workbook = createMCDATemplate();
        filename = 'plantilla_mcda.xlsx';
        break;
      case 'gis':
        workbook = createGISTemplate();
        filename = 'plantilla_gis.xlsx';
        break;
      default:
        return NextResponse.json({ error: 'Template type not found' }, { status: 404 });
    }

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
  }
}

function createProjectsTemplate(): XLSX.WorkBook {
  const data = [
    ['ID', 'Nombre', 'Ubicación', 'Asset Class', 'Área Total (m²)', 'Unidades', 'Pisos', 'Presupuesto (USD)', 'Latitud', 'Longitud', 'Estado'],
    ['1', 'Torre Reforma Norte', 'Ciudad de Guatemala', 'Residencial', '12500', '120', '25', '25000000', '14.634915', '-90.506882', 'Planificación'],
    ['2', 'Centro Comercial Zona 10', 'Ciudad de Guatemala', 'Comercial', '8000', '45', '3', '18000000', '14.599512', '-90.489381', 'En Desarrollo'],
    ['', '', '', '', '', '', '', '', '', '', '']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Proyectos');

  return workbook;
}

function createMCDATemplate(): XLSX.WorkBook {
  const data = [
    ['Categoría', 'Parámetro', 'Descripción', 'Peso (%)', 'Valor Mínimo', 'Valor Máximo'],
    ['Context', 'Distance to Nearest Town(s)/Villages', 'Distance to population centers and their size', '25', '0', '10'],
    ['Context', 'Neighborhood Control', 'Public vs. Private Ownership, Zoning Restrictions', '25', '0', '10'],
    ['Context', 'Topography', 'Terrain and Natural Features', '25', '0', '10'],
    ['Context', 'Infrastructure Connections', 'Access to Roads, Utilities', '25', '0', '10'],
    ['Property', 'Land Capacity (Size)', 'Total Area of the Property', '50', '0', '10'],
    ['Property', 'Site Analysis', 'Existing Structures, Vegetation, Historical Significance', '50', '0', '10'],
    ['Market', 'Population Composition & Growth', 'Age, Income Level, Growth Trends', '25', '0', '10'],
    ['Market', 'Purchasing Power', 'Ability of Local Population to Afford Development', '25', '0', '10'],
    ['Market', 'Existing Market Offerings', 'Products & Prices of Similar Developments', '25', '0', '10'],
    ['Market', 'Absorption Rates', 'Speed at Which Similar Developments Sell', '25', '0', '10'],
    ['Profitability', 'Revaluation Potential', 'Projected Increase in Land Value After Development', '34', '0', '10'],
    ['Profitability', 'Capital Requirement', 'Investment Needed for Development', '33', '0', '10'],
    ['Profitability', 'Inventory Consumption Time', 'Estimated Time to Sell Developed Units', '33', '0', '10'],
    ['', '', '', '', '', '']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Parámetros MCDA');

  return workbook;
}

function createGISTemplate(): XLSX.WorkBook {
  const data = [
    ['ID', 'Nombre', 'Tipo', 'Latitud', 'Longitud', 'Descripción', 'Municipio', 'Departamento'],
    ['1', 'Centro Histórico', 'Zona Comercial', '14.634915', '-90.506882', 'Centro histórico de la ciudad', 'Guatemala', 'Guatemala'],
    ['2', 'Zona 10', 'Zona Residencial', '14.599512', '-90.489381', 'Zona residencial de alto nivel', 'Guatemala', 'Guatemala'],
    ['3', 'Aeropuerto La Aurora', 'Infraestructura', '14.583197', '-90.527611', 'Aeropuerto internacional', 'Guatemala', 'Guatemala'],
    ['', '', '', '', '', '', '', '']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos GIS');

  return workbook;
}

