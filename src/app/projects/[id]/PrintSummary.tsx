import { Project, MCDAEvaluationWithDetails, BusinessModelCanvas } from '@/types';

interface PrintSummaryProps {
  project: Project;
  mcdaScore: number | null;
  evaluations: MCDAEvaluationWithDetails[];
  bmc: BusinessModelCanvas | null;
}

const generatePrintSummaryHtml = ({ project, mcdaScore, evaluations, bmc }: PrintSummaryProps): string => {
  const getScoreColorClass = (score: number | null) => {
    if (score === null) return 'score-gray';
    if (score > 7.5) return 'score-green';
    if (score >= 6.0) return 'score-yellow';
    return 'score-red';
  };

  const getCategoryAverage = (category: string) => {
    const categoryEvaluations = evaluations.filter(e => e.category === category);
    if (categoryEvaluations.length === 0) return null;
    const total = categoryEvaluations.reduce((sum, item) => sum + item.value, 0);
    return (total / categoryEvaluations.length);
  };

  const getCategoryScoreColor = (score: number | null) => {
    if (score === null) return '#cccccc'; // Gray
    if (score > 7.5) return '#4CAF50'; // Green
    if (score >= 6.0) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  const groupedEvaluations = evaluations.reduce((acc, evalItem) => {
    if (!acc[evalItem.category]) {
      acc[evalItem.category] = [];
    }
    acc[evalItem.category].push(evalItem);
    return acc;
  }, {} as Record<string, MCDAEvaluationWithDetails[]>);

  const categoryScores = Object.keys(groupedEvaluations).map(categoryName => ({
    name: categoryName,
    score: getCategoryAverage(categoryName),
  }));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Project Summary Report</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap">
        <style>
            @page {
                size: A4 portrait;
                margin: 1.5cm;
            }

            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #333;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .page-container {
                width: 100%;
                max-width: 21cm; /* A4 width */
                margin: 0 auto;
                box-sizing: border-box;
            }

            .report-header {
                text-align: center;
                margin-bottom: 2cm;
                border-bottom: 2px solid #eee;
                padding-bottom: 1cm;
            }

            .report-header h1 {
                font-size: 2.2em;
                color: #2c3e50;
                margin-bottom: 0.5em;
                font-weight: 700;
            }

            .section {
                margin-bottom: 1.5cm;
                padding-bottom: 1cm;
                border-bottom: 1px solid #eee;
            }

            .section:last-of-type {
                border-bottom: none;
            }

            .section h2 {
                font-size: 1.8em;
                color: #34495e;
                margin-bottom: 1em;
                font-weight: 600;
            }

            .section h3 {
                font-size: 1.4em;
                color: #34495e;
                margin-bottom: 0.8em;
                font-weight: 600;
            }

            /* MCDA Summary */
            .mcda-summary .score-overview {
                display: flex;
                align-items: center;
                margin-bottom: 1.5em;
            }

            .mcda-summary .overall-score {
                font-size: 1.5em;
                font-weight: 700;
                color: #2c3e50;
                margin-right: 15px;
            }

            .mcda-summary .score-indicator {
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: inline-block;
                vertical-align: middle;
            }

            .mcda-summary .score-green {
                background-color: #4CAF50;
            }

            .mcda-summary .score-yellow {
                background-color: #FFC107;
            }

            .mcda-summary .score-red {
                background-color: #F44336;
            }

            .bar-chart-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* Responsive grid for cards */
                gap: 15px;
                padding-top: 20px;
                border-bottom: none; /* Remove border from container */
            }

            .score-card {
                background-color: #f9f9f9;
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05); /* Subtle shadow for card effect */
                height: 180px; /* Fixed height for consistency */
                justify-content: flex-end; /* Align content to bottom */
                position: relative;
                overflow: hidden; /* Hide overflow for bars */
            }

            .score-card .bar {
                width: 100%; /* Bar takes full width of card */
                position: absolute;
                bottom: 0;
                left: 0;
                border-radius: 0 0 8px 8px; /* Rounded bottom corners for the bar */
            }

            .score-card-label {
                font-size: 0.9em;
                font-weight: 600;
                color: #333;
                z-index: 1; /* Ensure label is above the bar */
                margin-bottom: 5px; /* Space between label and bar */
            }

            /* Business Model Canvas */
            .bmc-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5cm;
            }

            .bmc-item {
                background-color: #f9f9f9;
                border: 1px solid #eee;
                padding: 1.2em;
                border-radius: 5px;
            }

            .bmc-item h3 {
                font-size: 1.2em;
                color: #2c3e50;
                margin-top: 0;
                margin-bottom: 0.5em;
                font-weight: 700;
            }

            .bmc-item p {
                font-size: 0.9em;
                color: #555;
                margin-bottom: 0;
            }

            /* Footer */
            .report-footer {
                text-align: center;
                margin-top: 2cm;
                padding-top: 1cm;
                border-top: 1px solid #eee;
                font-size: 0.8em;
                color: #777;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            /* Page breaks for printing */
            @media print {
                html, body {
                    height: auto;
                }
                .page-container {
                    margin: 0;
                    width: auto;
                }
                .section {
                    page-break-inside: avoid;
                }
                .bmc-grid {
                    page-break-inside: avoid;
                }
                .report-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1cm 1.5cm;
                    background-color: #fff;
                    border-top: 1px solid #eee;
                }
            }
        </style>
    </head>
    <body>
        <div class="page-container">
            <header class="report-header">
                <h1>Project Summary: ${project.name}</h1>
            </header>

            <section class="section mcda-summary">
                <h2>MCDA Score Overview</h2>
                <div class="score-overview">
                    <span class="overall-score">Overall GEOCUBO Score: ${mcdaScore !== null ? mcdaScore.toFixed(1) : 'N/A'}</span>
                    <span class="score-indicator ${getScoreColorClass(mcdaScore)}"></span>
                </div>
                
                <h3>Category Scores</h3>
                <div class="bar-chart-container">
                    ${categoryScores.map((cat, index) => {
                        const catScore = getCategoryAverage(cat.name);
                        return `
                            <div class="score-card">
                                <div class="bar" style="height: ${catScore !== null ? (catScore / 10) * 100 : 0}%; background-color: ${getCategoryScoreColor(catScore)};"></div>
                                <span class="score-card-label">${cat.name} (${catScore !== null ? catScore.toFixed(1) : 'N/A'})</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>

            <section class="section bmc-section">
                <h2>Business Model Canvas</h2>
                ${bmc ? `
                    <div class="bmc-grid">
                        <div class="bmc-item">
                            <h3>Key Partners</h3>
                            <p>${bmc.key_partners || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Key Activities</h3>
                            <p>${bmc.key_activities || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Key Resources</h3>
                            <p>${bmc.key_resources || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Value Propositions</h3>
                            <p>${bmc.value_proposition || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Customer Relationships</h3>
                            <p>${bmc.customer_relationships || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Customer Segments</h3>
                            <p>${bmc.customer_segments || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Channels</h3>
                            <p>${bmc.channels || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Cost Structure</h3>
                            <p>${bmc.cost_structure || 'N/A'}</p>
                        </div>
                        <div class="bmc-item">
                            <h3>Revenue Streams</h3>
                            <p>${bmc.revenue_streams || 'N/A'}</p>
                        </div>
                    </div>
                ` : '<p>No Business Model Canvas data available for this project.</p>'}
            </section>

            <footer class="report-footer">
                <span>Generated by GEOCUBO</span>
                <span>Date: ${new Date().toLocaleDateString()}</span>
            </footer>
        </div>
    </body>
    </html>
  `;
};

export default generatePrintSummaryHtml;