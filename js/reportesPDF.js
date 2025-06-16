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


/*
* Listado de pdvs
*/

class Listado_Clientes {


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
        this.doc.text('Listado Clientes', 20, 40);




        this.doc.setFontSize(8);
        this.doc.text(20, 50, ''.padEnd(115, '-'))
        this.doc.text(25, 60, 'Nombre del PDV')
        this.doc.text(150, 60, 'Código'.padStart(10))
        this.doc.text(200, 60, 'Tipo Negocio')

        this.doc.text(300, 60, 'Estado'.padStart(12));

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

            this.doc.text(lista[i].nom_cliente, 25, 70 + (this._lineasPag * 10))
            this.doc.text(lista[i].cod_cliente.padStart(10), 150, 70 + (this._lineasPag * 10))
            this.doc.text(lista[i].tipo_neg, 200, 70 + (this._lineasPag * 10))

            this.doc.text(lista[i].est_cliente.padStart(12), 300, 70 + (this._lineasPag * 10))

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

/**
 * Reporte de entregas x DSD
 */

class Entregas_DSD {


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


        this.doc.setFontSize(14)
        this.doc.text("GRUPO EXTRA", 20, 20)
        this.doc.setFontSize(12)
        this.doc.text('Resumen Entregas por Distribuidor', 20, 30);
        this.doc.setFontSize(10)

        let _periodo = 'Periodo: del ' + this.datos.fecIni + ' al ' + this.datos.fecFin;

        this.doc.text(_periodo, 20, 50)

        //this.doc.text('Total Entregas', 150, 50)
        //this.doc.text(this.datos.totEnt.padStart(12), 200, 50)



        this.doc.setFontSize(8);
        this.doc.text(20, 60, ''.padEnd(115, '-'))
        this.doc.text(25, 70, 'Nombre Distribuidor')
        this.doc.text(200, 70, 'Código')
        this.doc.text(250, 70, 'Cantidad'.padStart(12));

        this.doc.text(20, 80, ''.padEnd(115, '-'))


    }

    addFooter() {
        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)


    }


    generaReporte() {

        let listaMov = this.datos.listaMov;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < listaMov.length; i++) {

            if (this._impTit == 1) {

                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;
            this.doc.text(listaMov[i].nom_dis, 25, 80 + (this._lineasPag * 10))
            this.doc.text(listaMov[i].cod_dis.padStart(6), 200, 80 + (this._lineasPag * 10))
            let _cant = nf_entero.format(listaMov[i].can_ent);
            // console.log(_monto)
            this.doc.text(_cant.padStart(12), 250, 80 + (this._lineasPag * 10))


            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;

            }

        }

        this._lineasPag += 1;
        this.doc.text('Total', 225, 80 + (this._lineasPag * 10))
        this.doc.text(this.datos.totEnt.padStart(12), 250, 80 + (this._lineasPag * 10))


        if (this._impFooter == 1) {

            this.addFooter();
        }

        this.doc.output('dataurlnewwindow')
    }

}



/**
 * Reporte de entregas x PDV
 */

class Entregas_PDV {


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


        this.doc.setFontSize(14)
        this.doc.text("GRUPO EXTRA", 20, 20)
        this.doc.setFontSize(12)
        this.doc.text('Resumen Entregas por Punto de Ventas', 20, 30);
        this.doc.setFontSize(10)

        let _nomDis = 'Distribuidor: ' + this.datos.nom_dis;

        let _periodo = 'Periodo: del ' + this.datos.fecIni + ' al ' + this.datos.fecFin;

        this.doc.text(_nomDis, 20, 50)


        this.doc.text(_periodo, 20, 60)

        //this.doc.text('Total Entregas', 150, 50)
        //this.doc.text(this.datos.totEnt.padStart(12), 200, 50)



        this.doc.setFontSize(8);
        this.doc.text(20, 70, ''.padEnd(115, '-'))
        this.doc.text(25, 80, 'Nombre Punto Ventas')
        this.doc.text(200, 80, 'Código')
        this.doc.text(250, 80, 'Cantidad'.padStart(12));

        this.doc.text(20, 90, ''.padEnd(115, '-'))


    }

    addFooter() {
        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)


    }


    generaReporte() {

        let listaMov = this.datos.listaMov;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < listaMov.length; i++) {

            if (this._impTit == 1) {

                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;
            this.doc.text(listaMov[i].nom_pdv, 25, 90 + (this._lineasPag * 10))
            this.doc.text(listaMov[i].cod_pdv.padStart(6), 200, 90 + (this._lineasPag * 10))
            let _cant = nf_entero.format(listaMov[i].can_ent);
            // console.log(_monto)
            this.doc.text(_cant.padStart(12), 250, 90 + (this._lineasPag * 10))


            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;

            }

        }

        this._lineasPag += 1;
        this.doc.text('Total', 225, 90 + (this._lineasPag * 10))
        this.doc.text(this.datos.totEnt.padStart(12), 250, 90 + (this._lineasPag * 10))


        if (this._impFooter == 1) {

            this.addFooter();
        }

        this.doc.output('dataurlnewwindow')
    }

}

/**
 * Reporte de entregas x DSD
 */

class Liquidacion_DSD {


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


        this.doc.setFontSize(14)
        this.doc.text("GRUPO EXTRA", 20, 20)
        this.doc.setFontSize(12)
        this.doc.text('Resumen Liquidación por Distribuidor', 20, 30);
        this.doc.setFontSize(10)


        let _periodo = 'Periodo: del ' + this.datos.fecIni + ' al ' + this.datos.fecFin;

        this.doc.text(_periodo, 20, 50)

        this.doc.setFontSize(8);
        this.doc.text(20, 60, ''.padEnd(115, '-'))
        this.doc.text(25, 70, 'Nombre Distribuidor')
        this.doc.text(200, 70, 'Entrega'.padStart(12));
        this.doc.text(250, 70, 'Devolución'.padStart(12));
        this.doc.text(300, 70, 'Venta'.padStart(12));

        this.doc.text(20, 80, ''.padEnd(115, '-'))


    }

    addFooter() {
        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)


    }


    generaReporte() {

        let listaMov = this.datos.listaMov;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < listaMov.length; i++) {

            if (this._impTit == 1) {

                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;
            this.doc.text(listaMov[i].nom_dis, 25, 80 + (this._lineasPag * 10))
            //this.doc.text(listaMov[i].cod_dis.padStart(6), 200, 80 + (this._lineasPag * 10))
            let _ent = nf_entero.format(listaMov[i].can_ent);
            let _dev = nf_entero.format(listaMov[i].can_dev);
            let _vta = nf_entero.format(listaMov[i].can_vta);

            // console.log(_monto)
            this.doc.text(_ent.padStart(12), 200, 80 + (this._lineasPag * 10))
            this.doc.text(_dev.padStart(12), 250, 80 + (this._lineasPag * 10))
            this.doc.text(_vta.padStart(12), 300, 80 + (this._lineasPag * 10))

            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;

            }

        }

        this._lineasPag += 1;
        this.doc.text('Totales', 175, 80 + (this._lineasPag * 10))
        this.doc.text(this.datos.totEnt.padStart(12), 200, 80 + (this._lineasPag * 10))
        this.doc.text(this.datos.totDev.padStart(12), 250, 80 + (this._lineasPag * 10))
        this.doc.text(this.datos.totVta.padStart(12), 300, 80 + (this._lineasPag * 10))



        if (this._impFooter == 1) {

            this.addFooter();
        }

        this.doc.output('dataurlnewwindow')
    }

}

/**
 * Reporte de entregas x PDV
 */

class Liquidacion_PDV {


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


        this.doc.setFontSize(14)
        this.doc.text("GRUPO EXTRA", 20, 20)
        this.doc.setFontSize(12)
        this.doc.text('Resumen Liquidación por Punto Ventas', 20, 30);
        this.doc.setFontSize(10)
        let _nomDis = 'Distribuidor: ' + this.datos.nom_dis;
        let _periodo = 'Periodo: del ' + this.datos.fecIni + ' al ' + this.datos.fecFin;
        this.doc.text(_nomDis, 20, 50)
        this.doc.text(_periodo, 20, 60)

        this.doc.setFontSize(8);
        this.doc.text(20, 70, ''.padEnd(115, '-'))
        this.doc.text(25, 80, 'Nombre Punto Ventas')
        this.doc.text(200, 80, 'Entrega'.padStart(12));
        this.doc.text(250, 80, 'Devolución'.padStart(12));
        this.doc.text(300, 80, 'Venta'.padStart(12));

        this.doc.text(20, 90, ''.padEnd(115, '-'))


    }

    addFooter() {
        this.doc.text(20, 570, ''.padEnd(115, '-'))
        this.doc.text(375, 580, ' Pagina: ' + this._numPag)


    }


    generaReporte() {

        let listaMov = this.datos.listaMov;

        this.addTitulo();

        this._lineasPag = 0;
        this._impTit = 0;
        this._numPag = 1;
        this._impFooter = 1;

        for (let i = 0; i < listaMov.length; i++) {

            if (this._impTit == 1) {

                this.doc.addPage();
                this.addTitulo();
                this._numPag += 1;
                this._impTit = 0;
                this._impFooter = 1;
            }

            this._lineasPag += 1;
            this.doc.text(listaMov[i].nom_pdv, 25, 90 + (this._lineasPag * 10))
            //this.doc.text(listaMov[i].cod_dis.padStart(6), 200, 80 + (this._lineasPag * 10))
            let _ent = nf_entero.format(listaMov[i].can_ent);
            let _dev = nf_entero.format(listaMov[i].can_dev);
            let _vta = nf_entero.format(listaMov[i].can_vta);

            // console.log(_monto)
            this.doc.text(_ent.padStart(12), 200, 90 + (this._lineasPag * 10))
            this.doc.text(_dev.padStart(12), 250, 90 + (this._lineasPag * 10))
            this.doc.text(_vta.padStart(12), 300, 90 + (this._lineasPag * 10))

            if (this._lineasPag >= 45) {

                this.addFooter();
                this._lineasPag = 0;
                this._impTit = 1;
                this._impFooter = 0;

            }

        }

        this._lineasPag += 1;
        this.doc.text('Totales', 175, 90 + (this._lineasPag * 10))
        this.doc.text(this.datos.totEnt.padStart(12), 200, 90 + (this._lineasPag * 10))
        this.doc.text(this.datos.totDev.padStart(12), 250, 90 + (this._lineasPag * 10))
        this.doc.text(this.datos.totVta.padStart(12), 300, 90 + (this._lineasPag * 10))



        if (this._impFooter == 1) {

            this.addFooter();
        }

        this.doc.output('dataurlnewwindow')
    }

}




