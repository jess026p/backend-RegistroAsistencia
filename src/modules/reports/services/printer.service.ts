import {Injectable} from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import {TDocumentDefinitions} from "pdfmake/interfaces";

const fonts = {
    Roboto: {
        normal: 'resources/fonts/roboto/Roboto-Regular.ttf',
        bold: 'resources/fonts/roboto/Roboto-Medium.ttf',
        italics: 'resources/fonts/roboto/Roboto-Italic.ttf',
        bolditalics: 'resources/fonts/roboto/Roboto-MediumItalic.ttf',
    },
};

@Injectable()
export class PrinterService {
    private printer = new PdfPrinter(fonts);

    createPdf(docDefinition: TDocumentDefinitions) {
        return this.printer.createPdfKitDocument(docDefinition);
    }
}
