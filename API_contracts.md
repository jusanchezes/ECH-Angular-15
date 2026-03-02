# API Contracts — EHR Redesign (REST / DTO / TypeScript Interfaces)

> Documento de referencia para la integración entre el frontend Angular 15 y el backend Java Spring Boot.
> Cada sección define: endpoint REST, Java DTO, TypeScript Interface y mapeo `data-field` del HTML.

---

## Tabla de Contenidos

1. [Convenciones Generales](#1-convenciones-generales)
2. [Módulo: Pacientes (Patients)](#2-módulo-pacientes)
3. [Módulo: Contexto Clínico (Clinical Context)](#3-módulo-contexto-clínico)
4. [Módulo: Timeline](#4-módulo-timeline)
5. [Módulo: Laboratorio / Analitos (Laboratory)](#5-módulo-laboratorio--analitos)
6. [Módulo: Measurements (Signos Vitales)](#6-módulo-measurements)
7. [Módulo: Órdenes Diagnósticas (Diagnostic Tests)](#7-módulo-órdenes-diagnósticas)
8. [Módulo: Medicación — MAR](#8-módulo-medicación--mar)
9. [Módulo: Prescripción de Medicación](#9-módulo-prescripción-de-medicación)
10. [Módulo: Cuidados (Care Plans)](#10-módulo-cuidados)
11. [Módulo: Documentos](#11-módulo-documentos)
12. [Módulo: Protocolos](#12-módulo-protocolos)
13. [Módulo: Risk Factors](#13-módulo-risk-factors)
14. [Módulo: Patient Summary](#14-módulo-patient-summary)
15. [Módulo: Nurse Notes](#15-módulo-nurse-notes)
16. [Módulo: Previous Visits](#16-módulo-previous-visits)
17. [Módulo: Header / Banner / Layout](#17-módulo-header--banner--layout)
18. [Módulo: Órdenes de Imagen (Imaging Orders)](#18-módulo-órdenes-de-imagen)
19. [Módulo: Órdenes de Laboratorio (Laboratory Orders)](#19-módulo-órdenes-de-laboratorio)
20. [Catálogos](#20-catálogos)

---

## 1. Convenciones Generales

### Base URL
```
https://{host}/api/v1
```

### Formato de Fechas
| Tipo Java         | Formato             | Ejemplo                  |
|-------------------|----------------------|--------------------------|
| `LocalDateTime`   | ISO-8601             | `2026-02-20T08:15:00`    |
| `LocalDate`       | ISO-8601             | `2026-02-20`             |
| `String` (display)| `dd/MM/yyyy HH:mm`  | `20/02/2026 08:15`       |

### Tipos Comunes
| TypeScript   | Java              | Descripción                        |
|--------------|-------------------|------------------------------------|
| `string`     | `String`          | Texto libre                        |
| `number`     | `Long`            | Identificadores, contadores        |
| `number`     | `Integer`         | Cantidades pequeñas, edades        |
| `number`     | `Double`          | Valores clínicos con decimales     |
| `boolean`    | `Boolean`         | Flags binarios                     |
| `string`     | `LocalDateTime`   | Fecha-hora ISO-8601                |
| `string`     | `LocalDate`       | Fecha ISO-8601                     |

### Respuesta Estándar (producción)
```typescript
interface ApiResponse<T> {
  success: boolean;       // Boolean
  data: T;                // Payload
  timestamp: string;      // LocalDateTime (ISO-8601)
  error?: string;         // String — solo en caso de error
}
```
> **Nota:** En el prototipo actual, `mock-clinical-data.js` y `ClinicalDataService` devuelven los DTOs directamente (sin envelope `ApiResponse`). El wrapper `ApiResponse<T>` es la estructura de producción — el frontend Angular deberá extraer `.data` de la respuesta HTTP.

---

## 2. Módulo: Pacientes

### Endpoint
| Método | Ruta                      | Descripción              |
|--------|---------------------------|--------------------------|
| GET    | `/api/v1/patients`        | Lista de pacientes       |
| GET    | `/api/v1/patients/{id}`   | Detalle de un paciente   |

### Java DTO: `PatientListDTO`

```java
public class PatientListDTO {
    private Long id;                    // ID interno
    private String name;                // Nombre completo (UPPERCASE)
    private String dob;                 // String "dd/MM/yyyy"
    private Integer age;                // Edad calculada
    private String gender;              // "Male" | "Female"
    private String genderIcon;          // Clase PrimeIcon: "pi-user"
    private String room;                // Habitación / cama
    private Long episode;               // Número de episodio
    private String department;          // Departamento
    private String attendingPhysician;  // Médico responsable
    private String admissionDate;       // String "dd/MM/yyyy"
    private Integer daysAdmitted;       // Días de ingreso
    private String admissionType;       // "emergency" | "inpatient"
    private String medicalProblem;      // Problema médico principal
    private String payer;               // Aseguradora
    private List<String> alerts;        // Alertas activas (texto)
    private String statusMeds;          // "ok" | "new" | "alert"
    private String statusOrders;        // "ok" | "new" | "pending"
    private String statusVitals;        // "ok" | "new" | "alert"
    private String client;              // Cliente / entidad
    private String hospital;            // Hospital
    private String ward;                // Unidad / planta
    private String currentDate;         // String "dd/MM/yyyy"
    private String serviceUnit;         // Unidad de servicio
    private List<AllergyTagDTO> allergies;   // Alergias con severidad
    private List<RiskTagDTO> risks;          // Riesgos con severidad
    private Boolean dnr;                // Orden de no reanimar
}
```

### TypeScript Interface

```typescript
interface PatientListDTO {
  id: number;                     // Long
  name: string;                   // String
  dob: string;                    // String "dd/MM/yyyy"
  age: number;                    // Integer
  gender: string;                 // String "Male" | "Female"
  genderIcon: string;             // String — PrimeIcon class
  room: string;                   // String
  episode: number;                // Long
  department: string;             // String
  attendingPhysician: string;     // String
  admissionDate: string;          // String "dd/MM/yyyy"
  daysAdmitted: number;           // Integer
  admissionType: string;          // String "emergency" | "inpatient"
  medicalProblem: string;         // String
  payer: string;                  // String
  alerts: string[];               // List<String>
  statusMeds: string;             // String
  statusOrders: string;           // String
  statusVitals: string;           // String
  client: string;                 // String
  hospital: string;               // String
  ward: string;                   // String
  currentDate: string;            // String "dd/MM/yyyy"
  serviceUnit: string;            // String
  allergies: AllergyTagDTO[];     // List<AllergyTagDTO>
  risks: RiskTagDTO[];            // List<RiskTagDTO>
  dnr: boolean;                   // Boolean
}

interface AllergyTagDTO {
  label: string;                  // String
  severity: string;               // String "danger" | "warning" | "info"
}

interface RiskTagDTO {
  label: string;                  // String
  severity: string;               // String "warning" | "info"
}
```

### Mapeo data-field (Banner — layout.js)

| data-field           | Propiedad JS (mock)      | Campo DTO Java             | Tipo Java      |
|----------------------|--------------------------|----------------------------|----------------|
| `patientGenderIcon`  | `genderIcon`             | `PatientListDTO.genderIcon`| `String`       |
| `patientName`        | `name`                   | `PatientListDTO.name`      | `String`       |
| `patientDemographics`| *(computed)*             | *(computed from dob/age/gender)* | `String`  |
| `patientRecId`       | `id`                     | `PatientListDTO.id`        | `Long`         |
| `patientEpisode`     | `episode`                | `PatientListDTO.episode`   | `Long`         |
| `patientRoom`        | `room` + `daysAdmitted`  | `PatientListDTO.room`      | `String`       |
| `patientClient`      | `client`                 | `PatientListDTO.client`    | `String`       |
| `allergyList`        | `allergies[]` + `risks[]`| `PatientListDTO.allergies` | `List<AllergyTagDTO>` |

---

## 3. Módulo: Contexto Clínico

### Endpoint
| Método | Ruta                                        | Descripción                        |
|--------|---------------------------------------------|------------------------------------|
| GET    | `/api/v1/clinical/context/{patientId}`      | Contexto clínico completo          |

### Java DTO: `PatientClinicalContextDTO`

```java
public class PatientClinicalContextDTO {
    private List<TimelineEntryGroupDTO> timeline;
    private LaboratoryContextDTO laboratory;
    private MeasurementsContextDTO measurements;
    private RiskFactorsContextDTO riskFactors;
    private List<ClinicalOrderDTO> diagnosticTests;
    private MedicationContextDTO medication;
    private List<CarePlanTaskDTO> carePlans;
    private List<ClinicalDocumentDTO> documents;
    private List<ProtocolDTO> protocols;
    private PatientSummaryDTO summary;
    private NurseNotesContextDTO nurseNotes;
    private List<PreviousVisitDTO> previousVisits;
    private LabOrdersContextDTO labOrdersContext;
}
```

### TypeScript Interface

```typescript
interface PatientClinicalContextDTO {
  timeline: TimelineEntryGroupDTO[];
  laboratory: LaboratoryContextDTO;
  measurements: MeasurementsContextDTO;
  riskFactors: RiskFactorsContextDTO;
  diagnosticTests: ClinicalOrderDTO[];
  medication: MedicationContextDTO;
  carePlans: CarePlanTaskDTO[];
  documents: ClinicalDocumentDTO[];
  protocols: ProtocolDTO[];
  summary: PatientSummaryDTO;
  nurseNotes: NurseNotesContextDTO;
  previousVisits: PreviousVisitDTO[];
  labOrdersContext: LabOrdersContextDTO;
}
```

---

## 4. Módulo: Timeline

### Endpoint
| Método | Ruta                                          | Descripción             |
|--------|-----------------------------------------------|-------------------------|
| GET    | `/api/v1/clinical/timeline/{patientId}`       | Timeline cronológico    |

### Java DTO

```java
public class TimelineEntryGroupDTO {
    private String date;                     // String "Day dd Month yyyy"
    private List<TimelineEntryDTO> entries;
}

public class TimelineEntryDTO {
    private String time;            // String "HH:mm"
    private String type;            // String "Exam" | "Surgery" | "Images" | "Care" | "Medication" | "Note" | "Vitals"
    private String dept;            // String — departamento
    private String description;     // String — descripción del evento
    private String author;          // String — autor
    private String role;            // String "Physician" | "Nursing"
    private String card;            // String — tarjeta/unidad
    private List<String> actions;   // List<String> — acciones disponibles
}
```

### TypeScript Interface

```typescript
interface TimelineEntryGroupDTO {
  date: string;                    // String
  entries: TimelineEntryDTO[];
}

interface TimelineEntryDTO {
  time: string;                    // String "HH:mm"
  type: string;                    // String
  dept: string;                    // String
  description: string;             // String
  author: string;                  // String
  role: string;                    // String
  card: string;                    // String
  actions: string[];               // List<String>
}
```

---

## 5. Módulo: Laboratorio / Analitos

### Endpoints
| Método | Ruta                                              | Descripción                  |
|--------|---------------------------------------------------|------------------------------|
| GET    | `/api/v1/clinical/laboratory/{patientId}`         | Resultados de laboratorio    |
| GET    | `/api/v1/catalogs/laboratory/disciplines`         | Disciplinas (panel izquierdo)|

### Java DTO: `LaboratoryContextDTO`

```java
public class LaboratoryContextDTO {
    private List<DisciplineDTO> disciplines;
    private List<String> sampleDates;        // String[] "dd/MM HH:mm"
    private List<AnalyteDTO> analytes;
}

public class DisciplineDTO {
    private String id;           // String — clave única
    private String label;        // String — nombre visible
    private String i18n;         // String — clave de internacionalización
}

public class AnalyteDTO {
    private String name;             // String — nombre del analito
    private String discipline;       // String — FK a DisciplineDTO.id
    private String unit;             // String — unidad de medida
    private String refRange;         // String — rango de referencia legible
    private Double refLow;           // Double — límite inferior (nullable)
    private Double refHigh;          // Double — límite superior (nullable)
    private List<Object> values;     // List<Object> — Double o String (para microbiología)
    private String validatedBy;      // String — profesional validador
    private String comments;         // String — comentarios clínicos
    private Boolean isText;          // Boolean — true para valores textuales
    private List<Boolean> isCritical;     // List<Boolean> — marcador de valor crítico por posición
    private List<String> textFlags;       // List<String> — flags por posición: "abnormal" | "pending" | null
}
```

### TypeScript Interface

```typescript
interface LaboratoryContextDTO {
  disciplines: DisciplineDTO[];
  sampleDates: string[];           // String[] "dd/MM HH:mm"
  analytes: AnalyteDTO[];
}

interface DisciplineDTO {
  id: string;                      // String
  label: string;                   // String
  i18n: string;                    // String
}

interface AnalyteDTO {
  name: string;                    // String
  discipline: string;              // String — FK to DisciplineDTO.id
  unit: string;                    // String
  refRange: string;                // String
  refLow: number | null;           // Double (nullable)
  refHigh: number | null;          // Double (nullable)
  values: (number | string)[];     // List<Object> — Double or String
  validatedBy: string;             // String
  comments: string;                // String
  isText?: boolean;                // Boolean (optional)
  isCritical?: boolean[];          // List<Boolean> (optional)
  textFlags?: (string | null)[];   // List<String> (optional)
}
```

---

## 6. Módulo: Measurements (Signos Vitales)

### Endpoint
| Método | Ruta                                              | Descripción                  |
|--------|---------------------------------------------------|------------------------------|
| GET    | `/api/v1/clinical/measurements/{patientId}`       | Flowsheet de signos vitales  |

### Java DTO: `MeasurementsContextDTO`

```java
public class MeasurementsContextDTO {
    private List<MeasurementGroupDTO> groups;
    private Map<String, List<VitalSignParameterDTO>> parameters;
    private BloodPressureThresholdsDTO thresholdsBP;
    private BloodPressureThresholdsDTO criticalBP;
    private List<String> nurses;
}

public class MeasurementGroupDTO {
    private String id;           // String — clave única del grupo
    private String label;        // String — nombre visible
    private String i18n;         // String — clave de internacionalización
}

public class VitalSignParameterDTO {
    private String name;         // String — nombre del parámetro
    private String field;        // String — campo de data binding
    private String unit;         // String — unidad de medida
    private Double low;          // Double — umbral bajo (nullable)
    private Double high;         // Double — umbral alto (nullable)
    private Boolean isBP;        // Boolean — es presión arterial (formato sistólica/diastólica)
    private Boolean isText;      // Boolean — valor textual (ej: "Pupil Response")
}

public class BloodPressureThresholdsDTO {
    private Integer sysLow;      // Integer
    private Integer sysHigh;     // Integer
    private Integer diaLow;      // Integer
    private Integer diaHigh;     // Integer
}
```

### TypeScript Interface

```typescript
interface MeasurementsContextDTO {
  groups: MeasurementGroupDTO[];
  parameters: Record<string, VitalSignParameterDTO[]>;
  thresholdsBP: BloodPressureThresholdsDTO;
  criticalBP: BloodPressureThresholdsDTO;
  nurses: string[];
}

interface MeasurementGroupDTO {
  id: string;                    // String
  label: string;                 // String
  i18n: string;                  // String
}

interface VitalSignParameterDTO {
  name: string;                  // String
  field: string;                 // String
  unit: string;                  // String
  low: number | null;            // Double (nullable)
  high: number | null;           // Double (nullable)
  isBP?: boolean;                // Boolean (optional)
  isText?: boolean;              // Boolean (optional)
}

interface BloodPressureThresholdsDTO {
  sysLow: number;                // Integer
  sysHigh: number;               // Integer
  diaLow: number;                // Integer
  diaHigh: number;               // Integer
}
```

### Mapeo data-field

| data-field          | Propiedad JS (mock)          | Campo DTO Java                           | Tipo Java   |
|---------------------|------------------------------|------------------------------------------|-------------|
| `measurementDate`   | *(UI state)*                 | *(toolbar date label — computed)*        | `String`    |

---

## 7. Módulo: Órdenes Diagnósticas

### Endpoint
| Método | Ruta                                                  | Descripción              |
|--------|-------------------------------------------------------|--------------------------|
| GET    | `/api/v1/clinical/diagnostic-tests/{patientId}`       | Órdenes diagnósticas     |

### Java DTO: `ClinicalOrderDTO`

```java
public class ClinicalOrderDTO {
    private Long id;                 // Long
    private String requestDate;      // String "dd/MM/yy"
    private String request;          // String — descripción de la solicitud
    private String comment;          // String
    private String author;           // String
    private String resultDate;       // String "dd/MM/yyyy HH:mm" (nullable)
    private Boolean hasResult;       // Boolean
    private Boolean accessWeb;       // Boolean — acceso web al resultado
    private String type;             // String "laboratory" | "radiology"
}
```

### TypeScript Interface

```typescript
interface ClinicalOrderDTO {
  id: number;                    // Long
  requestDate: string;           // String "dd/MM/yy"
  request: string;               // String
  comment: string;               // String
  author: string;                // String
  resultDate: string | null;     // String (nullable)
  hasResult: boolean;            // Boolean
  accessWeb: boolean;            // Boolean
  type: string;                  // String "laboratory" | "radiology"
}
```

---

## 8. Módulo: Medicación — MAR

### Endpoint
| Método | Ruta                                              | Descripción                     |
|--------|---------------------------------------------------|---------------------------------|
| GET    | `/api/v1/clinical/medication/{patientId}`         | Registro de administración (MAR)|

### Java DTO: `MedicationContextDTO` / `MedicationAdminRecordDTO`

```java
public class MedicationContextDTO {
    private List<MedicationAdminRecordDTO> mar;
}

public class MedicationAdminRecordDTO {
    private String drug;             // String — nombre completo del fármaco
    private String dose;             // String — dosis
    private String freq;             // String "QD" | "BID" | "TID" | "PRN"
    private String route;            // String "Oral" | "IV" | "SC"
    private String startDate;        // String "dd-MM-yy"
    private String endDate;          // String "dd-MM-yy"
    private String days;             // String — duración legible
    private String condition;        // String — condición de administración (nullable)
    private String category;         // String "current" | "prn" | "scheduled"
    private Boolean highAlert;       // Boolean — medicamento de alto riesgo
    private String prnReason;        // String — motivo PRN (nullable)
    private Map<String, MARSlotDTO> slots;  // Map hora → estado
}

public class MARSlotDTO {
    private String status;           // String "given" | "due" | "hold" | "empty"
    private String value;            // String — valor administrado (nullable)
    private String time;             // String "HH:mm" (nullable)
    private String reason;           // String — motivo de hold (nullable)
}
```

### TypeScript Interface

```typescript
interface MedicationContextDTO {
  mar: MedicationAdminRecordDTO[];
}

interface MedicationAdminRecordDTO {
  drug: string;                  // String
  dose: string;                  // String
  freq: string;                  // String
  route: string;                 // String
  startDate: string;             // String "dd-MM-yy"
  endDate: string;               // String "dd-MM-yy"
  days: string;                  // String
  condition: string | null;      // String (nullable)
  category: string;              // String "current" | "prn" | "scheduled"
  highAlert: boolean;            // Boolean
  prnReason: string | null;      // String (nullable)
  slots: Record<string, MARSlotDTO>;
}

interface MARSlotDTO {
  status: string;                // String "given" | "due" | "hold" | "empty"
  value?: string;                // String (optional)
  time?: string;                 // String "HH:mm" (optional)
  reason?: string;               // String (optional)
}
```

### Mapeo data-field

| data-field   | Propiedad JS (mock)     | Campo DTO Java                        | Tipo Java   |
|--------------|-------------------------|---------------------------------------|-------------|
| `marDate`    | *(UI state)*            | *(toolbar date label — computed)*     | `String`    |

---

## 9. Módulo: Prescripción de Medicación

### Endpoint
| Método | Ruta                                              | Descripción                |
|--------|---------------------------------------------------|----------------------------|
| POST   | `/api/v1/clinical/medication/prescribe`            | Crear nueva prescripción   |

### Java DTO: `MedicationPrescriptionFormDTO`

```java
public class MedicationPrescriptionFormDTO {
    private String dose;                 // String — dosis prescrita
    private String route;                // String "Oral" | "IV" | "SC" | "IM" | "SL" | "Topical" | "Inhaled" | "Rectal"
    private String frequency;            // String "QD" | "BID" | "TID" | "QID" | "Q4H" | "Q6H" | "Q8H" | "Q12H" | "PRN" | "STAT" | "Weekly"
    private String prnReason;            // String — motivo PRN (nullable)
    private String startDate;            // String "dd/MM/yyyy"
    private String endDate;              // String "dd/MM/yyyy"
    private Integer duration;            // Integer — duración en días
    private String dispenseQty;          // String — cantidad a dispensar
    private String specialInstructions;  // String — notas para farmacia/enfermería
}
```

### TypeScript Interface

```typescript
interface MedicationPrescriptionFormDTO {
  dose: string;                  // String
  route: string;                 // String
  frequency: string;             // String
  prnReason: string | null;      // String (nullable)
  startDate: string;             // String "dd/MM/yyyy"
  endDate: string;               // String "dd/MM/yyyy"
  duration: number;              // Integer
  dispenseQty: string;           // String
  specialInstructions: string;   // String
}
```

### Mapeo data-field (medication-prescription.html)

| data-field            | Propiedad JS (mock)    | Campo DTO Java                                  | Tipo Java   |
|-----------------------|------------------------|--------------------------------------------------|-------------|
| `patientWeight`       | *(patient context)*    | `PatientAnthropometryDTO.weight`                 | `String`    |
| `patientHeight`       | *(patient context)*    | `PatientAnthropometryDTO.height`                 | `String`    |
| `patientBMI`          | *(computed)*           | `PatientAnthropometryDTO.bmi`                    | `Double`    |
| `patientBSA`          | *(computed)*           | `PatientAnthropometryDTO.bsa`                    | `String`    |
| `dose`                | `dose`                 | `MedicationPrescriptionFormDTO.dose`             | `String`    |
| `route`               | `route`                | `MedicationPrescriptionFormDTO.route`            | `String`    |
| `frequency`           | `frequency`            | `MedicationPrescriptionFormDTO.frequency`        | `String`    |
| `prnReason`           | `prnReason`            | `MedicationPrescriptionFormDTO.prnReason`        | `String`    |
| `startDate`           | `startDate`            | `MedicationPrescriptionFormDTO.startDate`        | `String`    |
| `endDate`             | `endDate`              | `MedicationPrescriptionFormDTO.endDate`          | `String`    |
| `duration`            | `duration`             | `MedicationPrescriptionFormDTO.duration`         | `Integer`   |
| `dispenseQty`         | `dispenseQty`          | `MedicationPrescriptionFormDTO.dispenseQty`      | `String`    |
| `specialInstructions` | `specialInstructions`  | `MedicationPrescriptionFormDTO.specialInstructions` | `String` |

---

## 10. Módulo: Cuidados (Care Plans)

### Endpoint
| Método | Ruta                                            | Descripción                     |
|--------|-------------------------------------------------|---------------------------------|
| GET    | `/api/v1/clinical/care-plans/{patientId}`       | Plan de cuidados (CAR)          |

### Java DTO: `CarePlanTaskDTO`

```java
public class CarePlanTaskDTO {
    private String task;             // String — nombre de la tarea
    private String detail;           // String — descripción + frecuencia
    private String icon;             // String — clase PrimeIcon
    private String category;         // String "current" | "scheduled" | "prn"
    private Map<String, CareSlotDTO> slots;  // Map hora → estado
}

public class CareSlotDTO {
    private String time;             // String — hora de ejecución (nullable)
    private String status;           // String "completed" | "pending" | "overdue" | "empty"
}
```

### TypeScript Interface

```typescript
interface CarePlanTaskDTO {
  task: string;                  // String
  detail: string;                // String
  icon: string;                  // String — PrimeIcon class
  category: string;              // String "current" | "scheduled" | "prn"
  slots: Record<string, CareSlotDTO>;
}

interface CareSlotDTO {
  time: string | null;           // String (nullable)
  status: string;                // String "completed" | "pending" | "overdue" | "empty"
}
```

### Mapeo data-field

| data-field   | Propiedad JS (mock)     | Campo DTO Java                        | Tipo Java   |
|--------------|-------------------------|---------------------------------------|-------------|
| `carDate`    | *(UI state)*            | *(toolbar date label — computed)*     | `String`    |

---

## 11. Módulo: Documentos

### Endpoint
| Método | Ruta                                            | Descripción               |
|--------|-------------------------------------------------|---------------------------|
| GET    | `/api/v1/clinical/documents/{patientId}`        | Documentos clínicos       |

### Java DTO: `ClinicalDocumentDTO`

```java
public class ClinicalDocumentDTO {
    private Long id;                 // Long
    private String name;             // String — nombre del documento
    private String author;           // String — autor
    private String department;       // String — departamento
    private String type;             // String "TTO Report" | "Medical Report" | "Discharge Report" | "Consent Form" | "Lab Report" | "Clinical History" | "Nursing Report"
    private String date;             // String "dd/MM/yyyy HH:mm"
    private String status;           // String "signed" | "draft"
    private Boolean accessWeb;       // Boolean — acceso web
    private String category;         // String "reports" | "informed-consent" | "various" | "digital-history"
}
```

### TypeScript Interface

```typescript
interface ClinicalDocumentDTO {
  id: number;                    // Long
  name: string;                  // String
  author: string;                // String
  department: string;            // String
  type: string;                  // String
  date: string;                  // String "dd/MM/yyyy HH:mm"
  status: string;                // String "signed" | "draft"
  accessWeb: boolean;            // Boolean
  category: string;              // String
}
```

---

## 12. Módulo: Protocolos

### Endpoint
| Método | Ruta                                            | Descripción             |
|--------|-------------------------------------------------|-------------------------|
| GET    | `/api/v1/clinical/protocols/{patientId}`        | Protocolos clínicos     |

### Java DTO: `ProtocolDTO`

```java
public class ProtocolDTO {
    private Long id;                  // Long
    private String creationDate;      // String "dd/MM/yyyy"
    private String protocolName;      // String — nombre del protocolo
    private String author;            // String
    private String department;        // String
    private String status;            // String "Open" | "Closed"
    private String endDate;           // String "dd/MM/yyyy" (empty string if null)
}
```

### TypeScript Interface

```typescript
interface ProtocolDTO {
  id: number;                    // Long
  creationDate: string;          // String "dd/MM/yyyy"
  protocolName: string;          // String
  author: string;                // String
  department: string;            // String
  status: string;                // String "Open" | "Closed"
  endDate: string;               // String (empty if not closed)
}
```

---

## 13. Módulo: Risk Factors

### Endpoint
| Método | Ruta                                              | Descripción            |
|--------|---------------------------------------------------|------------------------|
| GET    | `/api/v1/clinical/risk-factors/{patientId}`       | Factores de riesgo     |

### Java DTO: `RiskFactorsContextDTO`

```java
public class RiskFactorsContextDTO {
    private List<RiskFactorDTO> allergies;
    private List<RiskFactorDTO> conditions;
    private List<RiskFactorDTO> procedures;

    @JsonProperty("family-history")
    private List<RiskFactorDTO> familyHistory;

    @JsonProperty("social-history")
    private List<RiskFactorDTO> socialHistory;

    @JsonProperty("infection-control")
    private List<RiskFactorDTO> infectionControl;

    private List<RiskFactorDTO> immunizations;
    private List<RiskFactorDTO> devices;

    @JsonProperty("risk-assessments")
    private List<RiskFactorDTO> riskAssessments;
}
```

### Java DTO: `RiskFactorDTO`

```java
public class RiskFactorDTO {
    private Long id;                  // Long
    private String type;              // String — tipo de factor
    private String group;             // String — grupo clínico
    private String riskFactor;        // String — descripción del factor
    private String catalogued;        // String "Yes" | "No"
    private String comment;           // String
    private String author;            // String
    private String date;              // String "dd/MM/yyyy"
    private String severity;          // String "Severe" | "Moderate" | "Low"
    private Boolean alert;            // Boolean — genera alerta
    private String status;            // String "active" | "inactive"
}
```

### TypeScript Interface

```typescript
interface RiskFactorsContextDTO {
  allergies: RiskFactorDTO[];
  conditions: RiskFactorDTO[];
  procedures: RiskFactorDTO[];
  'family-history': RiskFactorDTO[];
  'social-history': RiskFactorDTO[];
  'infection-control': RiskFactorDTO[];
  immunizations: RiskFactorDTO[];
  devices: RiskFactorDTO[];
  'risk-assessments': RiskFactorDTO[];
}

interface RiskFactorDTO {
  id: number;                    // Long
  type: string;                  // String
  group: string;                 // String
  riskFactor: string;            // String
  catalogued: string;            // String "Yes" | "No"
  comment: string;               // String
  author: string;                // String
  date: string;                  // String "dd/MM/yyyy"
  severity: string;              // String "Severe" | "Moderate" | "Low"
  alert: boolean;                // Boolean
  status: string;                // String "active" | "inactive"
}
```

---

## 14. Módulo: Patient Summary

### Endpoints
| Método | Ruta                                                       | Descripción              |
|--------|-------------------------------------------------------------|--------------------------|
| GET    | `/api/v1/clinical/summary/{patientId}/alerts`              | Alertas y riesgos        |
| GET    | `/api/v1/clinical/summary/{patientId}/medications`         | Medicación activa        |
| GET    | `/api/v1/clinical/summary/{patientId}/notes`               | Notas clínicas recientes |
| GET    | `/api/v1/clinical/summary/{patientId}/problems`            | Problemas activos        |
| GET    | `/api/v1/clinical/summary/{patientId}/vitals-snapshot`     | Snapshot de vitales      |
| GET    | `/api/v1/clinical/summary/{patientId}/pending-results`     | Resultados pendientes    |

### Java DTO: `PatientSummaryDTO`

```java
public class PatientSummaryDTO {
    private List<AlertRiskDTO> alertsRisks;
    private List<ActiveMedicationDTO> activeMedications;
    private List<ClinicalNoteDTO> recentNotes;
    private List<ProblemDTO> activeProblems;
    private String problemsLastUpdate;           // String
    private VitalsSnapshotDTO vitalsSnapshot;
    private List<LabResultDTO> pendingResults;
}
```

### Sub-DTOs

```java
public class AlertRiskDTO {
    private Long id;                  // Long
    private String name;              // String
    private String date;              // String "dd/MM/yy"
    private String doctor;            // String
    private String status;            // String "acknowledged" | "pending"
}

public class ActiveMedicationDTO {
    private Long id;                  // Long
    private String name;              // String — nombre + dosis + vía
    private Boolean highRisk;         // Boolean
    private String lastAdmin;         // String — hora última administración
    private String nextAdmin;         // String — hora siguiente administración
}

public class ClinicalNoteDTO {
    private Long id;                  // Long
    private String title;             // String
    private String specialty;         // String
    private String excerpt;           // String — extracto del texto
}

public class ProblemDTO {
    private Long id;                  // Long
    private String name;              // String — nombre del problema
    private String status;            // String "Active" | "Resolved"
}

public class VitalsSnapshotDTO {
    private VitalValueDTO bp;         // Presión arterial
    private VitalValueDTO hr;         // Frecuencia cardíaca
    private VitalValueDTO temp;       // Temperatura
    private VitalValueDTO spo2;       // Saturación O2
    private VitalValueDTO balance;    // Balance hídrico
    private VitalValueDTO urine;      // Diuresis
}

public class VitalValueDTO {
    private String value;             // String — valor formateado
    private String trend;             // String "up" | "down" | null
    private String detail;            // String — detalle adicional (nullable)
}

public class LabResultDTO {
    private Long id;                  // Long
    private String name;              // String — nombre + valor
    private String type;              // String "abnormal" | "pending"
}
```

### TypeScript Interfaces

```typescript
interface PatientSummaryDTO {
  alertsRisks: AlertRiskDTO[];
  activeMedications: ActiveMedicationDTO[];
  recentNotes: ClinicalNoteDTO[];
  activeProblems: ProblemDTO[];
  problemsLastUpdate: string;
  vitalsSnapshot: VitalsSnapshotDTO;
  pendingResults: LabResultDTO[];
}

interface AlertRiskDTO {
  id: number;                    // Long
  name: string;                  // String
  date: string;                  // String "dd/MM/yy"
  doctor: string;                // String
  status: string;                // String "acknowledged" | "pending"
}

interface ActiveMedicationDTO {
  id: number;                    // Long
  name: string;                  // String
  highRisk: boolean;             // Boolean
  lastAdmin: string;             // String
  nextAdmin: string;             // String
}

interface ClinicalNoteDTO {
  id: number;                    // Long
  title: string;                 // String
  specialty: string;             // String
  excerpt: string;               // String
}

interface ProblemDTO {
  id: number;                    // Long
  name: string;                  // String
  status: string;                // String "Active" | "Resolved"
}

interface VitalsSnapshotDTO {
  bp: VitalValueDTO;
  hr: VitalValueDTO;
  temp: VitalValueDTO;
  spo2: VitalValueDTO;
  balance: VitalValueDTO;
  urine: VitalValueDTO;
}

interface VitalValueDTO {
  value: string;                 // String
  trend: string | null;          // String (nullable)
  detail?: string;               // String (optional)
}

interface LabResultDTO {
  id: number;                    // Long
  name: string;                  // String
  type: string;                  // String "abnormal" | "pending"
}
```

### Mapeo data-field (patient-summary.html)

| data-field          | Propiedad JS (mock)              | Campo DTO Java                        | Tipo Java   |
|---------------------|----------------------------------|---------------------------------------|-------------|
| `alertRisk_{n}`     | `summary.alertsRisks[n]`         | `AlertRiskDTO`                        | —           |
| `riskName`          | `alertsRisks[].name`             | `AlertRiskDTO.name`                   | `String`    |
| `riskDate`          | `alertsRisks[].date`             | `AlertRiskDTO.date`                   | `String`    |
| `riskDoctor`        | `alertsRisks[].doctor`           | `AlertRiskDTO.doctor`                 | `String`    |
| `medication_{n}`    | `summary.activeMedications[n]`   | `ActiveMedicationDTO`                 | —           |
| `medName`           | `activeMedications[].name`       | `ActiveMedicationDTO.name`            | `String`    |
| `medLastAdmin`      | `activeMedications[].lastAdmin`  | `ActiveMedicationDTO.lastAdmin`       | `String`    |
| `medNextAdmin`      | `activeMedications[].nextAdmin`  | `ActiveMedicationDTO.nextAdmin`       | `String`    |
| `note_{n}`          | `summary.recentNotes[n]`         | `ClinicalNoteDTO`                     | —           |
| `noteSpecialty`     | `recentNotes[].specialty`        | `ClinicalNoteDTO.specialty`           | `String`    |
| `noteExcerpt`       | `recentNotes[].excerpt`          | `ClinicalNoteDTO.excerpt`             | `String`    |
| `problem_{n}`       | `summary.activeProblems[n]`      | `ProblemDTO`                          | —           |
| `problemName`       | `activeProblems[].name`          | `ProblemDTO.name`                     | `String`    |
| `problemStatus`     | `activeProblems[].status`        | `ProblemDTO.status`                   | `String`    |
| `problemsLastUpdate`| `summary.problemsLastUpdate`     | `PatientSummaryDTO.problemsLastUpdate`| `String`    |
| `vitalBP`           | `vitalsSnapshot.bp`              | `VitalsSnapshotDTO.bp`               | `VitalValueDTO` |
| `vitalHR`           | `vitalsSnapshot.hr`              | `VitalsSnapshotDTO.hr`               | `VitalValueDTO` |
| `vitalTemp`         | `vitalsSnapshot.temp`            | `VitalsSnapshotDTO.temp`             | `VitalValueDTO` |
| `vitalSpO2`         | `vitalsSnapshot.spo2`            | `VitalsSnapshotDTO.spo2`             | `VitalValueDTO` |
| `vitalBalance`      | `vitalsSnapshot.balance`         | `VitalsSnapshotDTO.balance`          | `VitalValueDTO` |
| `vitalUrine`        | `vitalsSnapshot.urine`           | `VitalsSnapshotDTO.urine`            | `VitalValueDTO` |
| `result_{n}`        | `summary.pendingResults[n]`      | `LabResultDTO`                        | —           |
| `resultName`        | `pendingResults[].name`          | `LabResultDTO.name`                   | `String`    |

---

## 15. Módulo: Nurse Notes

### Endpoint
| Método | Ruta                                              | Descripción                   |
|--------|---------------------------------------------------|-------------------------------|
| GET    | `/api/v1/clinical/nurse-notes/{patientId}`        | Notas de enfermería (turno)   |

### Java DTO: `NurseNotesContextDTO`

```java
public class NurseNotesContextDTO {
    private List<HandoffItemDTO> handoffItems;
    private List<ChecklistItemDTO> shiftChecklist;
    private List<MedicationDueDTO> medicationsDue;
    private QuickAssessmentDTO quickAssessments;
}

public class HandoffItemDTO {
    private String id;               // String — identificador
    private String label;            // String — etiqueta visible
    private String status;           // String "done" | "pending"
}

public class ChecklistItemDTO {
    private String id;               // String
    private String label;            // String
    private String status;           // String "done" | "pending"
}

public class MedicationDueDTO {
    private Long id;                 // Long
    private String time;             // String "h:mm AM/PM"
    private String name;             // String — nombre del medicamento
    private Boolean highRisk;        // Boolean
}

public class QuickAssessmentDTO {
    private Integer gcs;             // Integer — Glasgow Coma Scale
    private Integer rass;            // Integer — Richmond Agitation-Sedation Scale
    private Integer painScore;       // Integer — Escala de dolor
}
```

### TypeScript Interface

```typescript
interface NurseNotesContextDTO {
  handoffItems: HandoffItemDTO[];
  shiftChecklist: ChecklistItemDTO[];
  medicationsDue: MedicationDueDTO[];
  quickAssessments: QuickAssessmentDTO;
}

interface HandoffItemDTO {
  id: string;                    // String
  label: string;                 // String
  status: string;                // String "done" | "pending"
}

interface ChecklistItemDTO {
  id: string;                    // String
  label: string;                 // String
  status: string;                // String "done" | "pending"
}

interface MedicationDueDTO {
  id: number;                    // Long
  time: string;                  // String
  name: string;                  // String
  highRisk: boolean;             // Boolean
}

interface QuickAssessmentDTO {
  gcs: number;                   // Integer
  rass: number;                  // Integer
  painScore: number;             // Integer
}
```

### Mapeo data-field (nurse-notes.html)

| data-field          | Propiedad JS (mock)                   | Campo DTO Java                        | Tipo Java   |
|---------------------|---------------------------------------|---------------------------------------|-------------|
| `handoff_sbar`      | `nurseNotes.handoffItems[0]`          | `HandoffItemDTO`                      | —           |
| `handoff_events`    | `nurseNotes.handoffItems[1]`          | `HandoffItemDTO`                      | —           |
| `check_ivLines`     | `nurseNotes.shiftChecklist[0]`        | `ChecklistItemDTO`                    | —           |
| `check_catheters`   | `nurseNotes.shiftChecklist[1]`        | `ChecklistItemDTO`                    | —           |
| `check_woundCare`   | `nurseNotes.shiftChecklist[2]`        | `ChecklistItemDTO`                    | —           |
| `check_turnReposition` | `nurseNotes.shiftChecklist[3]`     | `ChecklistItemDTO`                    | —           |
| `medDue_{n}`        | `nurseNotes.medicationsDue[n]`        | `MedicationDueDTO`                    | —           |
| `medDueTime`        | `medicationsDue[].time`               | `MedicationDueDTO.time`               | `String`    |
| `medDueName`        | `medicationsDue[].name`               | `MedicationDueDTO.name`               | `String`    |
| `gcsValue`          | `quickAssessments.gcs`                | `QuickAssessmentDTO.gcs`              | `Integer`   |
| `rassValue`         | `quickAssessments.rass`               | `QuickAssessmentDTO.rass`             | `Integer`   |
| `painValue`         | `quickAssessments.painScore`          | `QuickAssessmentDTO.painScore`        | `Integer`   |

---

## 16. Módulo: Previous Visits

### Endpoint
| Método | Ruta                                                | Descripción            |
|--------|------------------------------------------------------|------------------------|
| GET    | `/api/v1/clinical/previous-visits/{patientId}`      | Episodios anteriores   |

### Java DTO: `PreviousVisitDTO`

```java
public class PreviousVisitDTO {
    private String episodeDate;                  // String "dd/MM/yy"
    private String episodeType;                  // String — tipo de episodio
    private List<VisitAlertDTO> alerts;           // List (nullable for collapsed rows)
    private List<VisitDiagnosisDTO> diagnoses;    // List (nullable)
    private List<VisitMedicationDTO> medications;  // List (nullable)
    private VisitVitalsDTO vitalsSnapshot;         // VisitVitalsDTO (nullable)
    private List<VisitPendingTestDTO> pendingTests; // List (nullable)
}

public class VisitAlertDTO {
    private String name;             // String
    private String doctor;           // String
}

public class VisitDiagnosisDTO {
    private String code;             // String — código CIE
    private String name;             // String
    private String status;           // String "Active" | "Resolved"
}

public class VisitMedicationDTO {
    private String name;             // String
    private Boolean highRisk;        // Boolean
    private String lastDose;         // String "HH:mm"
}

public class VisitVitalsDTO {
    private String bp;               // String
    private String hr;               // String
    private String spo2;             // String
    private String temp;             // String
    private String urine;            // String
    private String balance;          // String
}

public class VisitPendingTestDTO {
    private String name;             // String
    private String status;           // String "Pending" | "Abnormal"
}
```

### TypeScript Interface

```typescript
interface PreviousVisitDTO {
  episodeDate: string;                    // String "dd/MM/yy"
  episodeType: string;                    // String
  alerts?: VisitAlertDTO[];               // Optional
  diagnoses?: VisitDiagnosisDTO[];        // Optional
  medications?: VisitMedicationDTO[];     // Optional
  vitalsSnapshot?: VisitVitalsDTO;        // Optional
  pendingTests?: VisitPendingTestDTO[];   // Optional
}

interface VisitAlertDTO {
  name: string;
  doctor: string;
}

interface VisitDiagnosisDTO {
  code: string;
  name: string;
  status: string;
}

interface VisitMedicationDTO {
  name: string;
  highRisk: boolean;
  lastDose: string;
}

interface VisitVitalsDTO {
  bp: string;
  hr: string;
  spo2: string;
  temp: string;
  urine: string;
  balance: string;
}

interface VisitPendingTestDTO {
  name: string;
  status: string;
}
```

---

## 17. Módulo: Header / Banner / Layout

### Endpoints
| Método | Ruta                              | Descripción              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/v1/user/session`            | Datos de sesión del usuario |
| GET    | `/api/v1/notifications/count`     | Contadores de notificaciones |

### Java DTO

```java
public class UserSessionDTO {
    private String userName;              // String — nombre completo
    private String userService;           // String — servicio
    private String userDepartment;        // String — departamento
    private String wardName;              // String — nombre de planta
}

public class NotificationCountDTO {
    private Integer alertCount;           // Integer
    private Integer messageCount;         // Integer
}
```

### TypeScript Interface

```typescript
interface UserSessionDTO {
  userName: string;
  userService: string;
  userDepartment: string;
  wardName: string;
}

interface NotificationCountDTO {
  alertCount: number;
  messageCount: number;
}
```

### Mapeo data-field (layout.js — Header + Banner)

| data-field           | Propiedad JS (mock)        | Campo DTO Java                    | Tipo Java   |
|----------------------|----------------------------|-----------------------------------|-------------|
| `userName`           | `patients[].attendingPhysician` | `UserSessionDTO.userName`    | `String`    |
| `userService`        | *(static)*                 | `UserSessionDTO.userService`      | `String`    |
| `userDepartment`     | `patients[].department`    | `UserSessionDTO.userDepartment`   | `String`    |
| `wardName`           | `patients[].ward`          | `UserSessionDTO.wardName`         | `String`    |
| `alertCount`         | *(static: 3)*              | `NotificationCountDTO.alertCount` | `Integer`   |
| `messageCount`       | *(static: 1)*              | `NotificationCountDTO.messageCount`| `Integer`  |

---

## 18. Módulo: Órdenes de Imagen (Imaging Orders)

### Endpoint
| Método | Ruta                                         | Descripción                  |
|--------|----------------------------------------------|------------------------------|
| POST   | `/api/v1/clinical/imaging/order`             | Crear orden de imagen        |
| GET    | `/api/v1/catalogs/radiology`                 | Catálogo de radiología       |

### Java DTO: `ImagingOrderFormDTO`

```java
public class ImagingOrderFormDTO {
    private String priority;              // String "Routine" | "Urgent" | "STAT" | "Pre-Op"
    private String timing;                // String "Now" | "AM" | "PM" | "Scheduled"
    private String clinicalIndication;    // String
    private String contrastProtocol;      // String "None" | "IV Contrast" | "Oral Contrast" | "IV + Oral" | "Gadolinium"
    private String creatinine;            // String — valor de creatinina (readonly)
    private String pregnancyCheck;        // String "N/A" | "Negative" | "Positive" | "Unknown"
    private Boolean portable;             // Boolean — equipo portátil
}
```

### TypeScript Interface

```typescript
interface ImagingOrderFormDTO {
  priority: string;              // String
  timing: string;                // String
  clinicalIndication: string;    // String
  contrastProtocol: string;      // String
  creatinine: string;            // String
  pregnancyCheck: string;        // String
  portable: boolean;             // Boolean
}
```

### Mapeo data-field (imaging-orders.html)

| data-field           | Propiedad JS (mock)      | Campo DTO Java                        | Tipo Java   |
|----------------------|--------------------------|---------------------------------------|-------------|
| `priority`           | `priority`               | `ImagingOrderFormDTO.priority`        | `String`    |
| `timing`             | `timing`                 | `ImagingOrderFormDTO.timing`          | `String`    |
| `clinicalIndication` | `clinicalIndication`     | `ImagingOrderFormDTO.clinicalIndication`| `String`  |
| `contrastProtocol`   | `contrastProtocol`       | `ImagingOrderFormDTO.contrastProtocol`| `String`    |
| `creatinine`         | `creatinine`             | `ImagingOrderFormDTO.creatinine`      | `String`    |
| `pregnancyCheck`     | `pregnancyCheck`         | `ImagingOrderFormDTO.pregnancyCheck`  | `String`    |
| `portable`           | `portable`               | `ImagingOrderFormDTO.portable`        | `Boolean`   |

---

## 19. Módulo: Órdenes de Laboratorio (Laboratory Orders)

### Endpoint
| Método | Ruta                                           | Descripción                    |
|--------|-------------------------------------------------|--------------------------------|
| POST   | `/api/v1/clinical/laboratory/order`             | Crear orden de laboratorio     |
| GET    | `/api/v1/catalogs/laboratory`                   | Catálogo de pruebas de lab     |

### Java DTO: `LaboratoryOrderFormDTO`

```java
public class LaboratoryOrderFormDTO {
    private String priority;              // String "Routine" | "Urgent" | "STAT" | "Timed"
    private String requestedDate;         // LocalDateTime — fecha/hora solicitada
    private String frequency;             // String "Once" | "Daily" | "BID" | "Weekly" | "Monthly" | "Timed"
    private String specimenType;          // String "Venous Blood" | "Arterial Blood" | "Capillary" | "Urine (Random)" | "Urine (24h)" | "CSF" | "Stool" | "Swab"
    private String collectionMethod;      // String "Standard Venipuncture" | "Central Line" | "PICC Line" | "Arterial Puncture" | "Capillary Stick" | "Clean Catch" | "Catheter"
    private String volumeRequired;        // String — volumen calculado (readonly)
    private String fastingRequired;       // String "Not Required" | "Required" | "Preferred"
    private Integer fastingDuration;      // Integer — horas de ayuno (nullable)
    private String clinicalIndication;    // String
}
```

### TypeScript Interface

```typescript
interface LaboratoryOrderFormDTO {
  priority: string;              // String
  requestedDate: string;         // LocalDateTime (ISO-8601)
  frequency: string;             // String
  specimenType: string;          // String
  collectionMethod: string;      // String
  volumeRequired: string;        // String (readonly)
  fastingRequired: string;       // String
  fastingDuration: number | null;// Integer (nullable)
  clinicalIndication: string;    // String
}
```

### Mapeo data-field (laboratory-orders.html)

| data-field           | Propiedad JS (mock)      | Campo DTO Java                             | Tipo Java      |
|----------------------|--------------------------|--------------------------------------------|----------------|
| `priority`           | `priority`               | `LaboratoryOrderFormDTO.priority`          | `String`       |
| `requestedDate`      | `requestedDate`          | `LaboratoryOrderFormDTO.requestedDate`     | `LocalDateTime`|
| `frequency`          | `frequency`              | `LaboratoryOrderFormDTO.frequency`         | `String`       |
| `specimenType`       | `specimenType`           | `LaboratoryOrderFormDTO.specimenType`      | `String`       |
| `collectionMethod`   | `collectionMethod`       | `LaboratoryOrderFormDTO.collectionMethod`  | `String`       |
| `volumeRequired`     | `volumeRequired`         | `LaboratoryOrderFormDTO.volumeRequired`    | `String`       |
| `fastingRequired`    | `fastingRequired`        | `LaboratoryOrderFormDTO.fastingRequired`   | `String`       |
| `fastingDuration`    | `fastingDuration`        | `LaboratoryOrderFormDTO.fastingDuration`   | `Integer`      |
| `clinicalIndication` | `clinicalIndication`     | `LaboratoryOrderFormDTO.clinicalIndication`| `String`       |

---

## 20. Catálogos

### Endpoints
| Método | Ruta                                      | Descripción                     |
|--------|-------------------------------------------|---------------------------------|
| GET    | `/api/v1/catalogs/laboratory`             | Catálogo de pruebas de lab      |
| GET    | `/api/v1/catalogs/laboratory/disciplines` | Disciplinas de laboratorio      |
| GET    | `/api/v1/catalogs/radiology`              | Catálogo de radiología          |

### Java DTO: `LabCatalogItemDTO`

```java
public class LabCatalogItemDTO {
    private Long id;                  // Long
    private String code;              // String — código de prueba
    private String name;              // String — nombre de la prueba
    private String discipline;        // String — disciplina
    private String specimenType;      // String — tipo de muestra
    private String tubeType;          // String — tipo de tubo
    private String volumeML;          // String — volumen requerido
    private String turnaroundTime;    // String — tiempo de respuesta
    private Boolean fastingRequired;  // Boolean
}
```

### Java DTO: `RadiologyCatalogItemDTO`

```java
public class RadiologyCatalogItemDTO {
    private Long id;                  // Long
    private String code;              // String
    private String name;              // String
    private String modality;          // String — modalidad (CT, MRI, X-Ray, US, etc.)
    private String bodyRegion;        // String — región anatómica
    private Boolean contrastDefault;  // Boolean — contraste por defecto
    private String prepInstructions;  // String — instrucciones de preparación
}
```

### TypeScript Interfaces

```typescript
interface LabCatalogItemDTO {
  id: number;
  code: string;
  name: string;
  discipline: string;
  specimenType: string;
  tubeType: string;
  volumeML: string;
  turnaroundTime: string;
  fastingRequired: boolean;
}

interface RadiologyCatalogItemDTO {
  id: number;
  code: string;
  name: string;
  modality: string;
  bodyRegion: string;
  contrastDefault: boolean;
  prepInstructions: string;
}
```

---

## Resumen de Endpoints

| Módulo              | Método | Endpoint                                                  | DTO Response                      |
|---------------------|--------|-----------------------------------------------------------|-----------------------------------|
| Patients            | GET    | `/api/v1/patients`                                        | `PatientListDTO[]`                |
| Patients            | GET    | `/api/v1/patients/{id}`                                   | `PatientListDTO`                  |
| Clinical Context    | GET    | `/api/v1/clinical/context/{patientId}`                    | `PatientClinicalContextDTO`       |
| Timeline            | GET    | `/api/v1/clinical/timeline/{patientId}`                   | `TimelineEntryGroupDTO[]`         |
| Laboratory          | GET    | `/api/v1/clinical/laboratory/{patientId}`                 | `LaboratoryContextDTO`            |
| Measurements        | GET    | `/api/v1/clinical/measurements/{patientId}`               | `MeasurementsContextDTO`          |
| Diagnostic Tests    | GET    | `/api/v1/clinical/diagnostic-tests/{patientId}`           | `ClinicalOrderDTO[]`              |
| Medication (MAR)    | GET    | `/api/v1/clinical/medication/{patientId}`                 | `MedicationContextDTO`            |
| Prescription        | POST   | `/api/v1/clinical/medication/prescribe`                   | `MedicationPrescriptionFormDTO`   |
| Care Plans          | GET    | `/api/v1/clinical/care-plans/{patientId}`                 | `CarePlanTaskDTO[]`               |
| Documents           | GET    | `/api/v1/clinical/documents/{patientId}`                  | `ClinicalDocumentDTO[]`           |
| Protocols           | GET    | `/api/v1/clinical/protocols/{patientId}`                  | `ProtocolDTO[]`                   |
| Risk Factors        | GET    | `/api/v1/clinical/risk-factors/{patientId}`               | `RiskFactorsContextDTO`           |
| Summary — Alerts    | GET    | `/api/v1/clinical/summary/{patientId}/alerts`             | `AlertRiskDTO[]`                  |
| Summary — Meds      | GET    | `/api/v1/clinical/summary/{patientId}/medications`        | `ActiveMedicationDTO[]`           |
| Summary — Notes     | GET    | `/api/v1/clinical/summary/{patientId}/notes`              | `ClinicalNoteDTO[]`               |
| Summary — Problems  | GET    | `/api/v1/clinical/summary/{patientId}/problems`           | `ProblemDTO[]`                    |
| Summary — Vitals    | GET    | `/api/v1/clinical/summary/{patientId}/vitals-snapshot`    | `VitalsSnapshotDTO`               |
| Summary — Results   | GET    | `/api/v1/clinical/summary/{patientId}/pending-results`    | `LabResultDTO[]`                  |
| Nurse Notes         | GET    | `/api/v1/clinical/nurse-notes/{patientId}`                | `NurseNotesContextDTO`            |
| Previous Visits     | GET    | `/api/v1/clinical/previous-visits/{patientId}`            | `PreviousVisitDTO[]`              |
| User Session        | GET    | `/api/v1/user/session`                                    | `UserSessionDTO`                  |
| Notifications       | GET    | `/api/v1/notifications/count`                             | `NotificationCountDTO`            |
| Imaging Order       | POST   | `/api/v1/clinical/imaging/order`                          | `ImagingOrderFormDTO`             |
| Lab Order           | POST   | `/api/v1/clinical/laboratory/order`                       | `LaboratoryOrderFormDTO`          |
| Catalog — Lab       | GET    | `/api/v1/catalogs/laboratory`                             | `LabCatalogItemDTO[]`             |
| Catalog — Disciplines| GET   | `/api/v1/catalogs/laboratory/disciplines`                 | `DisciplineDTO[]`                 |
| Catalog — Radiology | GET    | `/api/v1/catalogs/radiology`                              | `RadiologyCatalogItemDTO[]`       |
