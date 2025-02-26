import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const attendanceTemplate = (data: any): TDocumentDefinitions => {
  console.log(data);
  const attendances = [
    [
      {
        text: 'Identificación',
        bold: true,
      },
      {
        text: 'Apellido',
        bold: true,
      },
      {
        text: 'Nombre',
        bold: true,
      },
      {
        text: 'Fecha',
        bold: true,
      },
      {
        text: 'Estado',
        bold: true,
      },
    ],
  ];

  data.forEach(attendance => {
    attendances.push([attendance.identification, attendance.lastname, attendance.name, format(attendance.registeredAt, 'yyyy-MM-dd HH:mm:ss'), 'Atrasado']);
  });

  return {
    pageSize: {
      width: 540,
      height: 960,
    },

    pageMargins: [0, 0, 0, 0],

    content: [
      {
        image: './resources/images/reports/logo-yavirac-2.png',
        width: 115,
        height: 100,
        absolutePosition: { y: 10 },
        alignment: 'center',
      },

      {
        text: 'VICERRECTORADO ACADÉMICO INTERCULTURAL Y COMUNITARIO',
        fontSize: 12,
        bold: true,
        absolutePosition: { y: 120 },
        alignment: 'center',
      },
      {
        text: 'REPORTE DE ATRASOS DE DOCENTES',
        fontSize: 12,
        bold: true,
        absolutePosition: { y: 145 },
        alignment: 'center',
      },

      {
        layout: 'noBorders', // optional
        table: {
          widths: ['10%', 'auto'],

          body: [
            [
              {
                width: '10%',
                text: 'Proceso:',
                bold: true,
              },
              {
                text: 'Evaluación integral de desempeño del personal académico:',
              },
            ],
            [{ text: 'Fecha:', bold: true }, { text: format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es }) }],
          ],
        },
        absolutePosition: { x: 50, y: 180 },
        fontSize: 10,
      },

      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [100, 'auto', 100, 100, 50],

          body: attendances,
        },
        absolutePosition: { x: 50, y: 250 },
      },
    ],
  };
};
