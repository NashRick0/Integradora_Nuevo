import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePurchaseTicket = (order) => {
  if (!order) return;

  const fecha = order.fecha
    ? new Date(order.fecha).toLocaleDateString('es-MX')
    : 'Fecha no disponible';

  const ticketHtml = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 15px 20px;
            color: #222;
            width: 300px;
          }
          .header {
            text-align: center;
            margin-bottom: 8px;
          }
          .header img {
            height: 60px;
            margin: 0 auto 6px auto;
            display: block;
          }
          .title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          .info-table td {
            padding: 4px 2px;
            vertical-align: top;
          }
          .info-label {
            font-weight: bold;
            width: 35%;
            color: #444;
          }
          .info-value {
            width: 65%;
            text-align: right;
          }
          .studies-list {
            list-style: none;
            padding: 0;
            margin: 0 0 10px 0;
            font-size: 9.5px;
          }
          .studies-list li {
            border-bottom: 1px dashed #ccc;
            padding: 4px 0;
            display: flex;
            justify-content: space-between;
          }
          .footer {
            font-size: 7.5px;
            text-align: center;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 8px;
            margin-top: 10px;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo-iic.png" alt="Logo ICC" />
          <div class="title">TICKET DE COMPRA</div>
        </div>

        <table class="info-table">
          <tr>
            <td class="info-label">ID:</td>
            <td class="info-value">${order.id?.slice(-6).toUpperCase() || ''}</td>
          </tr>
          <tr>
            <td class="info-label">Paciente:</td>
            <td class="info-value">${order.nombrePaciente || 'Desconocido'}</td>
          </tr>
          <tr>
            <td class="info-label">Fecha:</td>
            <td class="info-value">${fecha}</td>
          </tr>
          <tr>
            <td class="info-label">Total:</td>
            <td class="info-value">$${(order.total || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td class="info-label">Pagado:</td>
            <td class="info-value">$${(order.pagado || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td class="info-label">Falta Pagar:</td>
            <td class="info-value">$${(order.faltaPorPagar || 0).toFixed(2)}</td>
          </tr>
        </table>

        <div style="font-weight:bold; font-size:12px; margin-bottom:6px; border-top:1px solid #ddd; padding-top:6px;">
          Estudios
        </div>
        <ul class="studies-list">
          ${
            order.estudios && order.estudios.length > 0
              ? order.estudios
                  .map(
                    (est) =>
                      `<li><span>${est.nombre}</span><span>$${(est.precio || 0).toFixed(2)}</span></li>`
                  )
                  .join('')
              : '<li>No hay estudios</li>'
          }
        </ul>

        <div class="footer">
          Av. Universidad esq. Con Volantín Col. Centro C.P. 34000</p>
                <p>Tels. (618) 827 12 16, (618) 827 12 58. Durango, Dgo., Méx.</p>
                <p>e-mail: lic@ujed.mx
        </div>
      </body>
    </html>
  `;

  const container = document.createElement('div');
  container.innerHTML = ticketHtml;
  container.style.position = 'absolute';
  container.style.left = '-2000px';
  container.style.top = '0px';
  container.style.width = '320px'; // para que html2canvas calcule bien el ancho
  document.body.appendChild(container);

  html2canvas(container, { scale: 2, useCORS: true }).then(canvas => {
  const pxToMm = 25.4 / 96;
  const pdfWidth = 80; // ancho fijo en mm para ticket

  // Calcula el alto manteniendo proporción
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`ticket-${order.nombrePaciente.replace(/ /g, '_')}.pdf`);

  document.body.removeChild(container);
});

};
