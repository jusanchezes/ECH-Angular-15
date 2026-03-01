/**
 * =============================================================================
 * @file clinical-data.service.js — Clinical Data Service Layer (EHR Redesign)
 * =============================================================================
 *
 * CAPA DE SERVICIO — Simula un Angular Service (@Injectable)
 * ----------------------------------------------------------
 * Esta capa es la ÚNICA puerta de acceso a los datos clínicos del prototipo.
 * Todas las pantallas deben consumir datos exclusivamente a través de
 * ClinicalDataService en lugar de acceder directamente a variables globales.
 *
 * NOTA PARA DESARROLLADORES:
 * =============================================================================
 *   Para pasar a producción Angular 15, sustituir cada método de este servicio
 *   por una llamada HttpClient.get() a la API REST de Java correspondiente.
 *
 *   Ejemplo de migración:
 *
 *     // PROTOTIPO (actual):
 *     const data = ClinicalDataService.getPatientContext(46);
 *
 *     // PRODUCCIÓN (Angular 15):
 *     @Injectable({ providedIn: 'root' })
 *     export class ClinicalDataService {
 *       constructor(private http: HttpClient) {}
 *       getPatientContext(id: number): Observable<PatientClinicalContext> {
 *         return this.http.get<PatientClinicalContext>(
 *           `/api/clinical/context/${id}`
 *         );
 *       }
 *     }
 * =============================================================================
 */

var ClinicalDataService = (function () {

    var DEFAULT_PATIENT_ID = 46;

    function _getContextForPatient(patientId) {
        return MockClinicalData.patientClinicalContext[patientId] || null;
    }

    function _getPatientById(patientId) {
        return MockClinicalData.patients.find(function (p) { return p.id === patientId; }) || null;
    }

    return {

        getPatientList: function () {
            return MockClinicalData.patients;
        },

        getPatient: function (patientId) {
            return _getPatientById(patientId || DEFAULT_PATIENT_ID);
        },

        getPatientContext: function (patientId) {
            var patient = _getPatientById(patientId || DEFAULT_PATIENT_ID);
            var context = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            if (!patient || !context) return null;
            return { patient: patient, context: context };
        },

        getTimeline: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.timeline : [];
        },

        getLaboratory: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.laboratory : null;
        },

        getLaboratoryAnalytes: function (patientId) {
            var lab = this.getLaboratory(patientId);
            return lab ? lab.analytes : [];
        },

        getLaboratoryDisciplines: function (patientId) {
            var lab = this.getLaboratory(patientId);
            return lab ? lab.disciplines : [];
        },

        getLaboratorySampleDates: function (patientId) {
            var lab = this.getLaboratory(patientId);
            return lab ? lab.sampleDates : [];
        },

        getMeasurements: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.measurements : null;
        },

        getMeasurementParameters: function (patientId) {
            var ms = this.getMeasurements(patientId);
            return ms ? ms.parameters : {};
        },

        getMeasurementGroups: function (patientId) {
            var ms = this.getMeasurements(patientId);
            return ms ? ms.groups : [];
        },

        getMeasurementThresholds: function (patientId) {
            var ms = this.getMeasurements(patientId);
            return ms ? { thresholdsBP: ms.thresholdsBP, criticalBP: ms.criticalBP } : null;
        },

        getMeasurementNurses: function (patientId) {
            var ms = this.getMeasurements(patientId);
            return ms ? ms.nurses : [];
        },

        getRiskFactors: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.riskFactors : {};
        },

        getDiagnosticTests: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.diagnosticTests : [];
        },

        getMedication: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.medication : null;
        },

        getMedicationMAR: function (patientId) {
            var med = this.getMedication(patientId);
            return med ? med.mar : [];
        },

        getCarePlans: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.carePlans : [];
        },

        getDocuments: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.documents : [];
        },

        getProtocols: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.protocols : [];
        },

        getSummary: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.summary : null;
        },

        getNurseNotes: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.nurseNotes : null;
        },

        getPreviousVisits: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.previousVisits : [];
        },

        getLabOrdersContext: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.labOrdersContext : null;
        },

        getImagingOrdersContext: function (patientId) {
            var ctx = _getContextForPatient(patientId || DEFAULT_PATIENT_ID);
            return ctx ? ctx.imagingOrdersContext : null;
        },

        getLabCatalog: function () {
            return MockClinicalData.catalogs.labCatalog;
        },

        getRadiologyCatalog: function () {
            return MockClinicalData.catalogs.radiologyCatalog;
        },

        getEDPatientList: function () {
            return MockClinicalData.edPatients;
        }
    };

})();
