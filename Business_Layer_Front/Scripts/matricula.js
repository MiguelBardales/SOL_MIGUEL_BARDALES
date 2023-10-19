$(document).ready(function () {


    getMatricula2();

    $('#btnBuscarAlumno').click(function () {
        buscaAlumnos($('#txtDni').val());
    });

    $('#btnGuardar').click(function () {
        if (parseInt($("#txtCreditos").val()) > 0 && parseInt($("#txtVacantes").val()) > 0) {
            guardarMatricula();
        } else {
            alert('EL CAMPO CRÉDITO O EL CAMPO VACANTE NO PUEDE ESTAR VACIO O IGUAL A CERO')
        }

    });


    $('#cboSeccion').on('change', function () {
        a = $("#cboSeccion option:selected").val();
        obtieneVacanteCurso(a);
    })

    let cursosX;

    $('#cboCurso').on('change', function () {
        a = $("#cboCurso option:selected").val();
        obtieneCreditoCurso(a);

        obtieneVacanteSeccionCurso($("#cboSeccion option:selected").val(), $("#cboCurso option:selected").val())
    })

});


function getMatricula2() {

    $.ajax({
        url: 'Matricula/GetMatriculaReport',
        type: 'GET',
        //data: { idSeccion: idSeccion },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $('#tblMatricula2 > tbody').empty();
            $.each(data, function (index, value) {

                var xx = value.FECHAMATRICULA.substr(6, value.FECHAMATRICULA.length - 8);
                var dateX = new Date(parseInt(xx));

                var fecComp = dateX.toLocaleDateString() + ' ' + dateX.toLocaleTimeString();

                ///------------------------------------
                var xx2 = value.FECHAANULACION.substr(6, value.FECHAANULACION.length - 8);
                var dateX2 = new Date(parseInt(xx2));
                var fecComp2 = '';
         
                if (dateX2.toLocaleDateString().length > 7) {
                    fecComp2 = dateX2.toLocaleDateString() + ' ' + dateX2.toLocaleTimeString();
                    
                } else {
                    fecComp2 = '';
                }
                

                $("#contenido2")
                    .append("<tr>" + (value.ESTADO == 'ANULADO' ? "<td><input type='button' class='btn btn-light' id='btnAnular' disabled='disabled' name='ANULADO' value='ANULADO';'></td>" : "<td><input type='button' class='btn btn-warning' id='btnAnular' name='Enviar' value='ANULAR' onclick='anularMatricula(" + value.IDMATRICULA + ");'></td>") + "<td style='display: none;'>" + value.IDMATRICULA + "</td><td>" + value.CODIGO + "</td><td>" + value.NOMBRES + "</td><td>" + value.APELLIDOS + "</td><td>" + value.IDCURSO + "</td><td>" + value.DESCRIPCIONCURSO + "</td><td>" + value.CREDITOS + "</td><td>" + value.DESCRIPCIONSECCION + "</td><td>" + value.TIPOMATRICULA + "</td><td>" + fecComp + "</td><td>" + fecComp2 + "</td></tr>");
            });


        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function cargaCursos() {
    $.ajax({
        url: 'Matricula/GetCursos',
        type: 'GET',
        /*  data: null,*/
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            debugger;
            $('<h1/>').text(data[0].DESCRIPCION).appendTo('body');
            $('<div class="content"/>')
                .html(data.html).appendTo('body');
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function cargaSeccion() {
    $.ajax({
        url: 'Matricula/GetSeccion',
        type: 'GET',
        /*  data: null,*/
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var len = data.length;

            $("#cboSeccion").empty();
            $("#cboSeccion").append("<option value='" + '0' + "'>" + '--Seleccione--' + "</option>");

            for (var i = 0; i < len; i++) {
                var id = data[i]['IDSECCION'];
                var name = data[i]['NOMBRE'];

                $("#cboSeccion").append("<option value='" + id + "'>" + name + "</option>");

            }

            $('<h1/>').text(data[0].DESCRIPCION).appendTo('body');
            $('<div class="content"/>')
                .html(data.html).appendTo('body');
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}


function buscaAlumnos(dni) {

    $.ajax({
        url: 'Matricula/GetAlumnos',
        type: 'GET',
        data: { dni: dni },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            $('#txtCodigo').val(data[0].CODIGO);
            $('#txtNombres').val(data[0].NOMBRES);
            $('#txtApellidos').val(data[0].APELLIDOS);
            if (data[0].ESTADO == '1') {
                $('#txtEstado').val('ACTIVO');
            } else {
                $('#txtEstado').val('INACTIVO');
            }

            if (data.length > 0) {
                $("#cboSeccion ").attr("readonly", false);
            } else {
                $("#cboSeccion ").attr("readonly", true);
            }


            cargaSeccion();


        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function obtieneVacanteCurso(idSeccion) {
    $.ajax({
        url: 'Matricula/GetVacantesCurso',
        type: 'GET',
        data: { idSeccion: idSeccion },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data.length > 0) {
                $("#cboCurso ").attr("readonly", false);
            } else {
                $("#cboCurso ").attr("readonly", true);
            }

            var len = data.length;
            cursosX = data;
            $("#cboCurso").empty();
            $("#cboCurso").append("<option value='" + '0' + "'>" + '--Seleccione--' + "</option>");

            for (var i = 0; i < len; i++) {
                var id = data[i]['IDCURSO'];
                var name = data[i]['DESCRIPCION'];

                $("#cboCurso").append("<option value='" + id + "'>" + name + "</option>");

            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function obtieneVacanteSeccionCurso(idSeccion, idCurso) {
    $.ajax({
        url: 'Matricula/GetVacantesSeccionCurso',
        type: 'GET',
        data: { idSeccion: idSeccion, idCurso: idCurso },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {

            if (data.length > 0) {
                $("#txtVacantes").val(data[0]['VACANTES']);
                $("#chkPresencial ").attr("disabled", false);
            } else {
                $("#txtVacantes").val('');
                $("#chkPresencial ").attr("disabled", true);
            }

        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function anularMatricula(idMatricula) {

    var _matricula = {
        IDMATRICULA: idMatricula
    };

    $.ajax({
        url: 'Matricula/PostAnularMatricula',
        type: 'POST',
        data: JSON.stringify(_matricula),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == true) {
                alert('Matrícula Anulada!!');
                getMatricula();
                limpiar();
            } else {
                alert('NO SE PUEDE ANULAR!!');
                getMatricula();
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function guardarMatricula() {
    let check = $('#chkPresencial').is(":checked");

    var _matricula = {
        DNI: $('#txtDni').val().trim(),
        IDSECCION: $('#cboSeccion').val().trim(),
        IDCURSO: $('#cboCurso').val().trim(),
        TIPOMATRICULA: check,
        VACANTES: 1
    };

    $.ajax({
        url: 'Matricula/PostGuardarMatricula',
        type: 'POST',
        data: JSON.stringify(_matricula),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == 1) {
                alert('Alumno Matriculado!!');
                getMatricula();
                limpiar();
            }
            else if (data == -2) {
                alert('NO SE PUEDE MATRICULAR EN EL MISMO CURSO 2 VECES!!');
                getMatricula();
            }
            else {
                alert('NO SE PUEDE EXCEDER LOS 5 CRÉDITOS!!');
                getMatricula();
            }
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}

function obtieneCreditoCurso(idCurso) {

    cursosX.forEach(function (valor, indice, array) {
        if (valor.IDCURSO == idCurso) {
            $("#txtCreditos").val(valor.CREDITOS);
        } else {
            $("#txtCreditos").val('');
        }
    });

}


function getCursos(idSeccion) {
    $.ajax({
        url: 'Matricula/GetVacantesCurso',
        type: 'GET',
        data: { idSeccion: idSeccion },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var len = data.length;

            $("#cboCurso").empty();
            $("#cboCurso").append("<option value='" + '0' + "'>" + '--Seleccione--' + "</option>");

            for (var i = 0; i < len; i++) {
                var id = data[i]['IDCURSO'];
                var name = data[i]['DESCRIPCION'];

                $("#cboCurso").append("<option value='" + id + "'>" + name + "</option>");
            }

            $('<h1/>').text(data[0].CODIGO).appendTo('body');
            $('<div class="content"/>')
                .html(data.html).appendTo('body');
        },
        error: function (xhr, status) {
            alert('Disculpe, existió un problema');
        },
        complete: function (xhr, status) {
            /*alert('Petición realizada');*/
        }
    });
}


function limpiar() {
    $("#cboSeccion").empty();
    $("#cboSeccion ").attr("readonly", true);
    $("#cboCurso").empty();
    $("#cboCurso").attr("readonly", true);

    $("#txtCreditos").val('');
    $("#txtDni").val('');
    $("#txtCodigo").val('');
    $("#txtNombres").val('');
    $("#txtApellidos").val('');
    $("#txtEstado").val('');
    $("#txtCreditos").val('');
    $("#txtVacantes").val('');
    $("#chkPresencial").prop('checked', false);
    $("#chkPresencial ").attr("disabled", true);
}

function genReporte() {

    var maintable = document.getElementById('tblMatricula2');

    /*pdfout.onclick = function () {*/
    var doc = new jsPDF('p', 'pt', 'letter');
    var margin = 20;
    var scale = (doc.internal.pageSize.width - margin * 2) / document.body.clientWidth;
    var scale_mobile = (doc.internal.pageSize.width - margin * 2) / document.body.getBoundingClientRect();


    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        doc.html(maintable, {
            x: margin,
            y: margin,
            html2canvas: {
                scale: scale_mobile,
            },
            callback: function (doc) {
                doc.output('dataurlnewwindow', { filename: 'pdf.pdf' });
            }
        });
    } else {

        doc.html(maintable, {
            x: margin,
            y: margin,
            html2canvas: {
                scale: scale,
            },
            callback: function (doc) {
                doc.output('dataurlnewwindow', { filename: 'pdf.pdf' });
            }
        });
    }

}