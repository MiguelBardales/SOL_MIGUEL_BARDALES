using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Business_Layer_Front.Controllers
{
    public class MatriculaController : Controller
    {
        // GET: Matricula
        public ActionResult Matricula()
        {
            return View();
        }

        public JsonResult GetMatriculaReport()
        {
            List<MatriculaTableReport> sss = new List<MatriculaTableReport>();
            using (EntitySolo db = new EntitySolo())
            {

                var query = (from a in db.TBMATRICULA
                             join b in db.TBALUMNOS on a.DNI equals b.DNI
                             join c in db.TBSECCION on a.IDSECCION equals c.IDSECCION
                             join d in db.TBCURSOS on a.IDCURSO equals d.IDCURSO
                             select new MatriculaTableReport
                             {
                                 IDMATRICULA = a.IDMATRICULA,
                                 CODIGO = b.CODIGO,
                                 NOMBRES = b.NOMBRES,
                                 APELLIDOS = b.APELLIDOS,
                                 IDCURSO = d.IDCURSO,
                                 DESCRIPCIONCURSO = d.DESCRIPCION,
                                 CREDITOS = (decimal)d.CREDITOS,
                                 DESCRIPCIONSECCION = c.NOMBRE,
                                 TIPOMATRICULA = a.TIPOMATRICULA == "P" ? "PRESENCIAL" : "A DISTANCIA",
                                 FECHAMATRICULA = (DateTime)a.REGMATRICULATIME.Value,
                                 FECHAANULACION = (DateTime)a.ANULMATRICULATIME.Value,
                                 ESTADO = a.ESTADO == "1" ? "ACTIVO" : "ANULADO"
                             }).ToList();

                var list = db.TBMATRICULA;

                foreach (var item in query.ToList().OrderByDescending(d => d.IDMATRICULA))
                {

                    sss.Add(item);
                }
            }

            return Json(sss, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCursos()
        {
            List<TBCURSOS> sss = new List<TBCURSOS>();
            using (EntitySolo db = new EntitySolo())
            {
                var list = db.TBCURSOS;

                foreach (var item in list)
                {
                    sss.Add(item);
                }
            }

            return Json(sss, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAlumnos(string dni)
        {
            List<TBALUMNOS> sss = new List<TBALUMNOS>();
            using (EntitySolo db = new EntitySolo())
            {
                var list = db.TBALUMNOS;


                foreach (var item in list)
                {
                    if (item.DNI == dni)
                    {
                        sss.Add(item);
                    }
                }
            }

            return Json(sss, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSeccion()
        {
            List<TBSECCION> sss = new List<TBSECCION>();
            using (EntitySolo db = new EntitySolo())
            {
                var list = db.TBSECCION;


                foreach (var item in list)
                {
                    sss.Add(item);
                }

            }

            return Json(sss, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVacantesCurso(int idSeccion)
        {
            List<TBCURSOS> sss = new List<TBCURSOS>();
            using (EntitySolo db = new EntitySolo())
            {
                var list2 = db.TBVACANTES.Where(d => d.IDSECCION == idSeccion).ToList();

                foreach (var item in list2)
                {
                    var list3 = db.TBCURSOS.Where(d => d.IDCURSO == item.IDCURSO).ToList();
                    foreach (var item2 in list3)
                    {
                        sss.Add(item2);
                    }
                }
            }

            return Json(sss, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVacantesSeccionCurso(int idSeccion, int idCurso)
        {
            List<TBVACANTES> sss = new List<TBVACANTES>();
            using (EntitySolo db = new EntitySolo())
            {
                var list2 = db.TBVACANTES.Where(d => d.IDSECCION == idSeccion && d.IDCURSO == idCurso).ToList();

                foreach (var item in list2)
                {
                    //var list3 = db.TBCURSOS.Where(d => d.IDCURSO == item.IDCURSO).ToList();
                    //foreach (var item2 in list3)
                    //{
                    sss.Add(item);
                    //}
                }
            }

            return Json(sss, JsonRequestBehavior.AllowGet);
        }



        [AllowAnonymous]
        [HttpPost]
        [Route("PostGuardarMatricula")]
        public JsonResult PostGuardarMatricula(TBMATRICULA _matricula)
        {
            List<TBVACANTES> sss = new List<TBVACANTES>();
            List<TBMATRICULA> sssMa = new List<TBMATRICULA>();
            int rpta = 0;
            using (EntitySolo db = new EntitySolo())
            {

                var list2 = db.TBMATRICULA.Where(d => d.IDSECCION == _matricula.IDSECCION && d.IDCURSO == _matricula.IDCURSO && d.ESTADO == "1").ToList();

                foreach (var itemMa in list2)
                {
                    sssMa.Add(itemMa);
                }

                if (sssMa.Count > 0)
                {
                    rpta = -2; //Ya existe el curso
                    return Json(rpta, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var list3 = db.TBMATRICULA.Where(d => d.DNI == _matricula.DNI && d.ESTADO == "1").ToList();

                    decimal totCred = 0;
                    decimal totCredAdd = 0;

                    //Si existe curso matriculado se evalua que no exceda los 5 creditos
                    foreach (var itemCred in list3)
                    {
                        var list4 = db.TBCURSOS.Where(d => d.IDCURSO == itemCred.IDCURSO).ToList();

                        foreach (var itemCur in list4)
                        {
                            //este es el total de creditos matriculados
                            totCred = (decimal)itemCur.CREDITOS;
                        }
                    }

                    //Creditos a los que se va a matrciular adicional
                    var list5 = db.TBCURSOS.Where(d => d.IDCURSO == _matricula.IDCURSO).ToList();

                    foreach (var itemCredAdd in list5)
                    {
                        totCredAdd = (decimal)itemCredAdd.CREDITOS;
                    }

                    if ((totCred + totCredAdd) < 6)
                    {
                        var oTabla = new TBMATRICULA();
                        oTabla.DNI = _matricula.DNI;
                        oTabla.IDSECCION = _matricula.IDSECCION;
                        oTabla.IDCURSO = _matricula.IDCURSO;
                        oTabla.VACANTES = _matricula.VACANTES;
                        oTabla.TIPOMATRICULA = _matricula.TIPOMATRICULA == "False" ? "D" : "P";
                        oTabla.REGMATRICULATIME = DateTime.Now;
                        oTabla.ESTADO = "1";

                        db.TBMATRICULA.Add(oTabla);
                        db.SaveChanges();


                        var oTablaVac = db.TBVACANTES.Find(_matricula.IDCURSO);
                        oTablaVac.VACANTES = oTablaVac.VACANTES - 1;

                        db.Entry(oTablaVac).State = System.Data.Entity.EntityState.Modified;
                        db.SaveChanges();

                        rpta = 1; //correcto
                    }
                    else
                    {
                        rpta = -1; //excede los 5 creditos
                        return Json(rpta, JsonRequestBehavior.AllowGet);
                    }
                }

            }

            return Json(rpta, JsonRequestBehavior.AllowGet);
        }



        [AllowAnonymous]
        [HttpPost]
        [Route("PostAnularMatricula")]
        public JsonResult PostAnularMatricula(TBMATRICULA _matricula)
        {
            List<TBVACANTES> sss = new List<TBVACANTES>();
            List<TBMATRICULA> sssMa = new List<TBMATRICULA>();
            bool rpta = false;
            using (EntitySolo db = new EntitySolo())
            {

                var list2 = db.TBMATRICULA.Where(d => d.IDMATRICULA == _matricula.IDMATRICULA).ToList();

                foreach (var itemMa in list2)
                {
                    var list3 = db.TBVACANTES.Where(d => d.IDCURSO == itemMa.IDCURSO && d.IDSECCION == itemMa.IDSECCION).ToList();

                    foreach (var itemVac in list3)
                    {
                        var oTablaVacante = db.TBVACANTES.Find(itemVac.IDVACANTES);
                        oTablaVacante.VACANTES = oTablaVacante.VACANTES + 1;

                        db.Entry(oTablaVacante).State = System.Data.Entity.EntityState.Modified;
                        db.SaveChanges();
                    }


                    var oTablaMat = db.TBMATRICULA.Find(_matricula.IDMATRICULA);
                    oTablaMat.VACANTES = oTablaMat.VACANTES - 1;
                    oTablaMat.ANULMATRICULATIME = DateTime.Now;
                    oTablaMat.ESTADO = "0";

                    db.Entry(oTablaMat).State = System.Data.Entity.EntityState.Modified;
                    db.SaveChanges();

                }

                rpta = true;


            }

            return Json(rpta, JsonRequestBehavior.AllowGet);
        }
    }

    public class MatriculaTableReport
    {
        public decimal IDMATRICULA { get; set; }
        public string CODIGO { get; set; }
        public string NOMBRES { get; set; }
        public string APELLIDOS { get; set; }
        public decimal IDCURSO { get; set; }
        public string DESCRIPCIONCURSO { get; set; }
        public decimal CREDITOS { get; set; }
        public string DESCRIPCIONSECCION { get; set; }

        public string TIPOMATRICULA { get; set; }
        public DateTime FECHAMATRICULA { get; set; }
        public DateTime FECHAANULACION { get; set; }
        public string ESTADO { get; set; }

    }
}