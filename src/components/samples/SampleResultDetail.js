import React from 'react';
import { Button, Descriptions, Table, Typography } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { generatePdf } from '../../utils/pdfGenerator';

const { Title } = Typography;

const SampleResultDetail = ({ sample }) => {
  if (!sample || !sample.tipoMuestra) return <p>No hay detalles para mostrar.</p>;

  const handleGeneratePdf = () => {
    generatePdf(sample);
  };
  
  let columns, dataSource, title;

  if (sample.tipoMuestra === 'quimicaSanguinea' && sample.quimicaSanguinea) {
    title = 'Química Sanguínea';
    columns = [
      { title: 'Estudio', dataIndex: 'estudio', key: 'estudio', width: '30%' },
      { title: 'Resultado', dataIndex: 'resultado', key: 'resultado', width: '20%' },
      { title: 'Valores Normales', dataIndex: 'normales', key: 'normales', width: '50%' },
    ];
    const data = sample.quimicaSanguinea;
    dataSource = [
        { key: '1', estudio: 'Glucosa', resultado: `${data.glucosa} mg/dl`, normales: '70-110 mg/dl' },
        { key: '2', estudio: 'Glucosa Post', resultado: `${data.glucosaPost} mg/dl`, normales: '' },
        { key: '3', estudio: 'Ácido Úrico', resultado: `${data.acidoUrico} mg/dl`, normales: '2.1-7.4 mg/dl' },
        { key: '4', estudio: 'Urea', resultado: `${data.urea} mg/dl`, normales: '25-43 mg/dl' },
        { key: '5', estudio: 'Creatinina', resultado: `${data.creatinina} mg/dl`, normales: '0.5-1.5 mg/dl' },
        { key: '6', estudio: 'Colesterol', resultado: `${data.colesterol} mg/dl`, normales: 'hasta 200 mg/dl (satisfactorio)' },
        { key: '7', estudio: 'LDH', resultado: data.LDR, normales: 'Adultos 270-414 VIL' },
        { key: '8', estudio: 'g-GT', resultado: data.gGT, normales: 'M < 38.0 H < 55.0 VIL' },
    ];
  } else if (sample.tipoMuestra === 'biometriaHematica' && sample.biometriaHematica) {
    title = 'Biometría Hemática';
    columns = [
        { title: 'Estudio', dataIndex: 'estudio', key: 'estudio', width: '40%' },
        { title: 'Resultado', dataIndex: 'resultado', key: 'resultado', width: '20%' },
        { title: 'Valores Normales', dataIndex: 'normales', key: 'normales', width: '40%' },
    ];
    const fr = sample.biometriaHematica.formulaRoja;
    const fb = sample.biometriaHematica.formulaBlanca;
    dataSource = [
        { key: 'r1', estudio: 'Hemoglobina', resultado: fr.hemoglobina, normales: '13-17 g/dl' },
        { key: 'r2', estudio: 'Hematocrito', resultado: fr.hematocrito, normales: '35-50%' },
        { key: 'r3', estudio: 'Eritrocitos', resultado: fr.eritrocitos, normales: '4.5-5.5Mill/mm3' },
        { key: 'r4', estudio: 'Con. Media Hb', resultado: fr.conMediaHb, normales: '28-32' },
        { key: 'r5', estudio: 'Vol. Globular Media', resultado: fr.volGlobularMedia, normales: '80-94u3' },
        { key: 'r6', estudio: 'HB. Corpuscular Media', resultado: fr.HBCorpuscularMedia, normales: '27-31uug' },
        { key: 'r7', estudio: 'Plaquetas', resultado: fr.plaqutas, normales: '150000-350000/mm3' },
        { key: 'b1', estudio: 'Cuenta Leucocitaria', resultado: fb.cuentaLeucocitaria, normales: '5000-10000/mm' },
        { key: 'b2', estudio: 'Linfocitos', resultado: fb.linfocitos, normales: '21-30%' },
        { key: 'b3', estudio: 'Monocitos', resultado: fb.monocitos, normales: '4-8%' },
        { key: 'b4', estudio: 'Segmentados', resultado: fb.segmentados, normales: '58-66%' },
        { key: 'b5', estudio: 'En Banda', resultado: fb.enBanda, normales: '3-5%' },
        { key: 'b6', estudio: 'Neutrofilos T.', resultado: fb.neutrofilosT, normales: '60-70%' },
        { key: 'b7', estudio: 'Eosinófilos', resultado: fb.eosinofilos, normales: '1-4%' },
        { key: 'b8', estudio: 'Basófilos', resultado: fb.basofilos, normales: '0-1%' },
    ];
  } else {
    return <p>Esta muestra aún no tiene resultados registrados.</p>
  }
  
  return (
    <div>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Paciente">{sample.nombrePaciente}</Descriptions.Item>
        <Descriptions.Item label="Tipo de Muestra">{title}</Descriptions.Item>
      </Descriptions>
      <Title level={5} style={{ marginTop: 24 }}>Resultados</Title>
      <Table columns={columns} dataSource={dataSource} pagination={false} size="small" />
      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Button type="primary" icon={<FilePdfOutlined />} onClick={handleGeneratePdf}>
          Generar PDF
        </Button>
      </div>
    </div>
  );
};

export default SampleResultDetail;