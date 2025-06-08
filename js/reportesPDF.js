/** Archivo de clases para generar reportes PDF */



/*
* Listado de distribuidores
*/

class Listado_Distribuidores {


    _numPag = 0;
    _lineasPag = 1;


    constructor(datos) {
        this.doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'letter'
        });

        this.doc.setFont('courier', 'normal');

        this.datos = datos;

        this.generaReporte();


    }


    addTitulo() {

        //this.doc.setFont('times', 'bold')

        //let _nomCia = sessionStorage.getItem("NOM_CIA");
        this.doc.setFontSize(14)
        this.doc.text('GRUPO EXTRA', 20, 20)

        this.doc.setFontSize(12)
        this.doc.text('Control de Circulación', 20, 30);

        this.doc.setFontSize(10)
        this.doc.text('Listado Distibuidores', 20, 40);




        this.doc.setFontSize(8);
        this.doc.text(20, 50, ''.padEnd(115, '-'))
        this.doc.text(25, 60, 'Nombre del distribuidor')
        this.doc.text(150, 60, 'Código'.padStart(10))

        this.doc.text(200, 60, 'Estado'.padStart(12));
        
        this.doc.text(20, 70, ''.padEnd(115, '-'))
    }

    addFooter() {

        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)
    }


    generaReporte() {

        let lista = this.datos.lista;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < lista.length; i++) {

            if (this._impTit == 1) {
                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;

            this.doc.text(lista[i].nom_usu, 25, 70 + (this._lineasPag * 10))
            this.doc.text(lista[i].cod_usu.padStart(10), 150, 70 + (this._lineasPag * 10))
            //let _monto = nf_entero.format(listaMov[i].monMov);
            //this.doc.text(_monto.padStart(12), 150, 100 + (this._lineasPag * 10))
            this.doc.text(lista[i].est_usu.padStart(12), 200, 70 + (this._lineasPag * 10))

            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;
            }

        }

        if (this._impFooter == 1) {

            this.addFooter();
        }

        this.doc.output('dataurlnewwindow')

    }

}

