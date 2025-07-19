import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Funciones auxiliares para generar las tablas de resultados ---

const getQuimicaSanguineaHtml = (muestra) => {
    if (!muestra.quimicaSanguinea) return '';
    const data = muestra.quimicaSanguinea;
    return `
    <div class="results-section">
        <h2 class="section-title">QUIMICA SANGUINEA</h2>
        <table class="results-table">
            <thead>
                <tr>
                    <th class="col-estudio">Estudio</th>
                    <th class="col-resultado">Resultado</th>
                    <th class="col-normales">Valores Normales</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Glucosa</td><td>${data.glucosa} mg/dl</td><td>70-110 mg/dl</td></tr>
                <tr><td>Glucosa Post</td><td>${data.glucosaPost} mg/dl</td><td></td></tr>
                <tr><td>Ácido Úrico</td><td>${data.acidoUrico} mg/dl</td><td>2.1-7.4 mg/dl</td></tr>
                <tr><td>Urea</td><td>${data.urea} mg/dl</td><td>25-43 mg/dl</td></tr>
                <tr><td>Creatinina</td><td>${data.creatinina} mg/dl</td><td>0.5-1.5 mg/dl</td></tr>
                <tr><td>Colesterol</td><td>${data.colesterol} mg/dl</td><td>nivel satisfactorio: hasta 200 mg/dl<br>nivel sospechoso: 201-240 mg/dl<br>nivel alto riesgo: mayor de 240 mg/dl</td></tr>
                <tr><td>LDH</td><td>${data.LDR}</td><td>Adultos 270-414 VIL</td></tr>
                <tr><td>g-GT</td><td>${data.gGT}</td><td>M &lt; 38.0 H &lt; 55.0 VIL</td></tr>
            </tbody>
        </table>
    </div>`;
};

const getBiometriaHematicaHtml = (muestra) => {
    if (!muestra.biometriaHematica) return '';
    const fr = muestra.biometriaHematica.formulaRoja;
    const fb = muestra.biometriaHematica.formulaBlanca;
    return `
    <div class="results-section">
        <h2 class="section-title">BIOMETRÍA HEMÁTICA</h2>
        <table class="results-table">
            <thead>
                <tr><th class="col-estudio">Formula Roja</th><th class="col-resultado">Resultado</th><th class="col-normales">Valores Normales</th></tr>
            </thead>
            <tbody>
                <tr><td>Hemoglobina</td><td>${fr.hemoglobina}</td><td>13-17 g/dl</td></tr>
                <tr><td>Hematocrito</td><td>${fr.hematocrito}</td><td>35-50%</td></tr>
                <tr><td>Eritrocitos</td><td>${fr.eritrocitos}</td><td>4.5-5.5Mill/mm3</td></tr>
                <tr><td>Con. Media Hb</td><td>${fr.conMediaHb}</td><td>28-32</td></tr>
                <tr><td>Vol. Globular Media</td><td>${fr.volGlobularMedia}</td><td>80-94u3</td></tr>
                <tr><td>HB. Corpuscular Media</td><td>${fr.HBCorpuscularMedia}</td><td>27-31uug</td></tr>
                <tr><td>Plaquetas</td><td>${fr.plaqutas}</td><td>150000-350000/mm3</td></tr>
            </tbody>
        </table>
        <table class="results-table" style="margin-top: 10px;">
            <thead>
                <tr><th class="col-estudio">Formula Blanca</th><th class="col-resultado">Resultado</th><th class="col-normales">Valores Normales</th></tr>
            </thead>
            <tbody>
                <tr><td>Cuenta Leucocitaria</td><td>${fb.cuentaLeucocitaria}</td><td>5000-10000/mm</td></tr>
                <tr><td>Linfocitos</td><td>${fb.linfocitos}</td><td>21-30%</td></tr>
                <tr><td>Monocitos</td><td>${fb.monocitos}</td><td>4-8%</td></tr>
                <tr><td>Segmentados</td><td>${fb.segmentados}</td><td>58-66%</td></tr>
                <tr><td>En Banda</td><td>${fb.enBanda}</td><td>3-5%</td></tr>
                <tr><td>Neutrofilos T.</td><td>${fb.neutrofilosT}</td><td>60-70%</td></tr>
                <tr><td>Eosinófilos</td><td>${fb.eosinofilos}</td><td>1-4%</td></tr>
                <tr><td>Basófilos</td><td>${fb.basofilos}</td><td>0-1%</td></tr>
            </tbody>
        </table>
    </div>`;
};

// --- Plantilla HTML Principal Actualizada ---
const getHtmlTemplate = (muestra) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        /* --- TAMAÑO DE FUENTE REDUCIDO --- */
        body { font-family: Arial, sans-serif; font-size: 8px; color: #333; }
        .container { width: 100%; max-width: 800px; padding: 20px; background: white; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        .header-table td { vertical-align: middle; }
        .logo { width: 55px; }
        .title-block { text-align: center; font-weight: bold; }
        .main-title { font-size: 11px; }
        .section-line { border: 0; border-top: 1.5px solid #333; margin: 6px 0; }
        .patient-info p { margin: 1px 0; font-size: 9px; }
        .section-title { text-align: center; color: white; background-color: #A92323; padding: 4px; font-size: 11px; margin: 12px 0 6px 0; font-weight: bold; border-radius: 4px;}
        .results-table { width: 100%; border-collapse: collapse; font-size: 8px; }
        .results-table th, .results-table td { padding: 3px; text-align: left; }
        .results-table thead th { font-weight: bold; border-bottom: 2px solid #333; }
        .results-table tbody tr { border-bottom: 1px dotted #ccc; }
        .col-estudio { width: 40%; } .col-resultado { width: 25%; } .col-normales { width: 35%; }
        .observations { margin-top: 12px; font-size: 9px; }
        .footer { margin-top: 30px; text-align: center; }
        .signature-line { border-bottom: 1px solid #333; width: 220px; margin: 0 auto; }
        .signature-title { margin-top: 4px; font-weight: bold; font-size: 9px; }
        .contact-info { margin-top: 12px; font-size: 7px; color: #555; }
    </style>
</head>
<body>
    <div class="container" id="pdf-content">
        <table class="header-table">
            <tr>
                <td style="width: 15%; text-align: left;"><img src="/logo-ujed.png" alt="Logo UJED" class="logo"></td>
                <td style="width: 70%;" class="title-block">
                    <div class="main-title">INSTITUTO DE INVESTIGACIÓN CIENTÍFICA</div>
                    <div class="main-title">"Dr. Roberto Rivera Damm"</div>
                    <div>LABORATORIO</div>
                </td>
                <td style="width: 15%; text-align: right;"><img src="/logo-iic.png" alt="Logo IIC" class="logo"></td>
            </tr>
        </table>
        <hr class="section-line">
        <section class="patient-info">
            <p><strong>Doctor:</strong> A quien corresponda</p>
            <p><strong>Nombre:</strong> ${muestra.nombrePaciente}</p>
            <p><strong>Fecha de toma:</strong> ${new Date(muestra.fechaTomaMuestra).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </section>
        
        ${muestra.tipoMuestra === 'quimicaSanguinea' ? getQuimicaSanguineaHtml(muestra) : ''}
        ${muestra.tipoMuestra === 'biometriaHematica' ? getBiometriaHematicaHtml(muestra) : ''}

        <div class="observations">
            <p><strong>Observaciones:</strong> ${muestra.observaciones || 'Ninguna'}</p>
        </div>
        
        <footer class="footer">
            <div class="signature-line"></div>
            <div class="signature-title">M.G.A. Elizabeth I. Antuna Salcido céd: 11918982</div>
            <div>Jefe de Laboratorio</div>
            <div class="contact-info">
                <p>Av. Universidad esq. Con Volantín Col. Centro C.P. 34000</p>
                <p>Tels. (618) 827 12 16, (618) 827 12 58. Durango, Dgo., Méx.</p>
                <p>e-mail: lic@ujed.mx</p>
            </div>
        </footer>
    </div>
</body>
</html>
`;

// Función principal para generar y descargar el PDF
export const generatePdf = (muestra) => {
    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-2000px';
    reportElement.innerHTML = getHtmlTemplate(muestra);
    document.body.appendChild(reportElement);

    const content = reportElement.querySelector('#pdf-content');

    html2canvas(content, { scale: 3, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`resultados-${muestra.nombrePaciente.replace(/ /g, '_')}.pdf`);

        document.body.removeChild(reportElement);
    });
};