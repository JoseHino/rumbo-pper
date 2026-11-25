// «Claves»: lo que de verdad cae en el examen, tema a tema, sacado de las 15 convocatorias oficiales (2017-2026).
// pos = números de pregunta en las convocatorias desde octubre de 2019 (antes iban una o dos posiciones desplazadas).
// k = datos que han salido como respuesta oficial; n = en cuántas convocatorias salió ese dato (si se ha contado).
// Solo hechos que aparecen en preguntas oficiales y siguen vigentes (las de normas derogadas no entran aquí).
module.exports = [
  { t: 1, pos: '1-2', law: 'TRLPEMM (RDL 2/2011)', s: ["Clases de navegación (ámbito y prestación)","Objetivos de la Marina Mercante","Infracciones: gravedad, prescripción y responsables","Buque abandonado"], k: [
    ['Navegación por su ámbito: interior, de cabotaje, exterior y extranacional. Por sus condiciones de prestación: regular y no regular.', 5],
    ['No son objetivos de la Marina Mercante: la señalización marítima y ayudas a la navegación (es de Puertos del Estado), la protección de la biodiversidad ni la promoción de la competencia.', 4],
    ['Infracciones: prescriben a los 5 años las muy graves, 3 las graves y 1 las leves. Por contaminación desde buques responden solidariamente naviero, propietario, asegurador y capitán.'],
    ['Buque abandonado: lo declara el Consejo de Administración de la Autoridad Portuaria.', 3],
  ] },
  { t: 2, pos: '3-4', law: 'Ley 14/2014 de Navegación Marítima', s: ["Quién cierra puertos y autoriza la entrada","Sistemas de tráfico obligatorios","Pabellón y buques extranjeros","Plataformas, dotación y defunciones a bordo"], k: [
    ['Cierre temporal de puertos y terminales: lo ordena la Autoridad Portuaria, previo informe de la Capitanía Marítima.', 3],
    ['Los sistemas de tráfico solo pueden ser obligatorios en aguas interiores marítimas y mar territorial.', 2],
    ['La entrada en puerto la autoriza la Administración Portuaria. Cartas náuticas y Avisos a los Navegantes: Ministerio de Defensa.', 3],
    ['En aguas interiores se lleva izado el pabellón. Submarinos extranjeros: en superficie y con el pabellón desplegado. Zona de seguridad de plataformas: hasta 500 m.'],
    ['Fallece alguien sin médico a bordo: el capitán certifica la defunción, pero no antes de 24 horas.'],
  ] },
  { t: 3, pos: '5', law: 'TRLPEMM · RD 253/2024', s: ["CIAIM: qué hace y cómo se compone","Funciones de la DGMM y sus Subdirecciones","Qué es Administración central y qué no"], k: [
    ['CIAIM: investiga las causas técnicas de los accidentes, sin buscar culpables. Presidente, Vicepresidente, un Secretario y vocales; sus investigadores son autoridad pública.', 5],
    ['La Capitanía Marítima no es Administración central: es periférica.'],
    ['RD 253/2024: la DGMM se encarga de la ordenación general de la navegación y la flota civil; las bonificaciones a residentes de Canarias y Baleares, la SG de Coordinación y Gestión Administrativa.'],
  ] },
  { t: 4, pos: '6', law: 'TRLPEMM art. 266 · RD 638/2007', s: ["Qué forma la Administración periférica","Funciones del Capitán Marítimo","Coordinación con la Autoridad Portuaria"], k: [
    ['La Administración marítima periférica son las Capitanías Marítimas y los Distritos Marítimos.', 4],
    ['Donde lo exija la actividad, el tráfico o la seguridad hay una Capitanía Marítima.', 2],
    ['En puertos autonómicos coordinan la Administración portuaria y la Capitanía. El informe vinculante sobre los canales de entrada lo da el Capitán Marítimo.'],
  ] },
  { t: 5, pos: '7', law: 'RD 186/2023 (Reglamento de Ordenación de la Navegación)', s: ["Rol de despacho y dotación","Enrolamientos y comunicaciones (RD 186/2023)"], k: [
    ['Desde 2025 la pregunta sale del RD 186/2023: rol de despacho y dotación, enrolamientos y entrada en aguas españolas. Solo hay 3 preguntas oficiales de esta norma: estudia el tema 5.'],
    ['Todas las preguntas de antes (Orden de 18 de enero de 2000) llevan aviso rojo: no te fíes de ellas.'],
  ] },
  { t: 6, pos: '8', law: 'RD 210/2004 · RD 1837/2000', s: ["Notificaciones de buques con destino a España","SIA y registrador de datos","Defectos de seguridad (RD 1837/2000)"], k: [
    ['La información del anexo I se notifica al menos 24 horas antes, o al salir del puerto anterior si la travesía es más corta.'],
    ['Pesqueros de 15 m o más que desembarcan en España: SIA clase A. El registrador de datos y los planes de acogida: Administración Marítima.'],
    ['RD 1837/2000: navegando, los defectos que afecten a la seguridad se comunican a la autoridad del primer puerto de arribada, antes de llegar.', 2],
  ] },
  { t: 7, pos: '9-10', law: 'RD 62/2008 (concentraciones y pruebas náuticas)', s: ["Quién autoriza, dirige o suspende la prueba","Plazos (10 y 15 días)","Embarcaciones de apoyo, aros y personas a bordo","Regatas de altura e internacionales"], k: [
    ['Retrasar, anular o suprimir la prueba si empeora la seguridad: el Capitán Marítimo.', 3],
    ['Coordinador de seguridad: dirige internamente el evento y comunica su comienzo y su final.', 3],
    ['Plazos: autorización notificada en 10 días; en regatas internacionales, aviso con al menos 15 días.', 2],
    ['Vela infantil: 1 embarcación de apoyo por cada 10 participantes. Aros: uno más por cada 20 personas.', 4],
    ['Regatas de altura: en mar territorial, zona contigua, ZEE y alta mar. Las de alquiler necesitan además seguro de accidentes.', 4],
  ] },
  { t: 8, pos: '11-12', law: 'RD 1435/2010 · RD 685/2010', s: ["Renovación del certificado (5 años)","Indicativo de matrícula, nombre y CIN","Permiso temporal de navegación"], k: [
    ['El certificado de registro español-permiso de navegación se renueva cada 5 años, ante cualquier distrito marítimo.', 4],
    ['Indicativo de matrícula: lista, provincia marítima, distrito marítimo y folio/año.', 3],
    ['El nombre es obligatorio por encima de 12 m de eslora y va en alfabeto latino.', 4],
    ['CIN: país del fabricante, constructor, número de serie, mes y año de fabricación y año del modelo (no el puerto de matrícula).', 2],
    ['Permiso temporal: lo pide la empresa importadora, constructora o vendedora y lo resuelve la DGMM.'],
  ] },
  { t: 9, pos: '13', law: 'RD 607/1999 (seguro obligatorio)', s: ["Qué cubre y qué NO cubre el seguro","Navegar sin seguro (infracción grave)"], k: [
    ['Sale en las 15 convocatorias. Cubre a terceros: muerte o lesiones, daños materiales, daños a buques por colisión o sin contacto y pérdidas económicas derivadas.', 15],
    ['NO cubre: los daños de la propia embarcación, la muerte o lesiones del patrón, las de quien paga el viaje ni las regatas (seguro especial).', 7],
    ['Navegar sin seguro es infracción grave. Si no lo llevas a bordo, tienes 5 días hábiles para justificarlo.', 3],
  ] },
  { t: 10, pos: '14-15', law: 'RD 875/2014 · RD 269/2022 art. 86.3', s: ["Alcohol: límites y 4 horas antes","Definiciones (moto náutica, eslora, recreo)","Escuelas y prácticas","Quién inspecciona (DGMM)"], k: [
    ['Alcohol: 0,05 % en sangre o 0,25 mg/l en aire espirado; se mide en sangre o en aliento; desde 4 horas antes de empezar el servicio.', 6],
    ['Las inspecciones del RD 875/2014 las hace la DGMM.', 2],
    ['Motos náuticas = artefactos flotantes. Patines: con motor de menos de 3,5 kW. Embarcación de recreo: de 2,5 a 24 m; buque de recreo: más de 24 m.'],
    ['Prácticas de PNB y PER: embarcación de al menos 6 m; de patrón de yate, 11,5 m. Navegación diurna: entre el orto y el ocaso.'],
  ] },
  { t: 11, pos: '16', law: 'RD 1434/1999 (inspecciones)', s: ["Tipos de reconocimiento (periódico, adicional, extraordinario)","Plazos: 15 días, 2 meses, 5 días hábiles","Certificado de navegabilidad"], k: [
    ['Los reconocimientos los pide el propietario a una ECI con al menos 15 días naturales antes de la caducidad.', 2],
    ['A requerimiento judicial = reconocimiento extraordinario. Cambio de lista 7.ª a 6.ª = adicional.', 5],
    ['Inspección desfavorable: la ECI da hasta 2 meses. Certificado no a bordo: 5 días hábiles para justificarlo. Máximo 12 pasajeros.'],
  ] },
  { t: 12, pos: '17-18', law: 'RD 339/2021 (equipo de seguridad)', s: ["Línea de fondeo (5 esloras)","Ámbito: regatas fuera, comerciales dentro","Material por zona: aros, extintores, reflector, chalecos, bombas"], k: [
    ['Línea de fondeo: al menos 5 veces la eslora.', 2],
    ['Fuera de su ámbito: las embarcaciones de regatas destinadas exclusivamente a competir. Dentro: las de recreo con fines comerciales, cualquiera que sea su pabellón.', 2],
    ['Casco no metálico: reflector de radar en cualquier zona. Más de 50 V: al menos un extintor apto para fuegos eléctricos.', 2],
    ['Cifras que han salido: chalecos de 275 N, bombas de 15 l/min de 6 a 12 m, aguas sucias entre 3 y 12 millas solo desmenuzadas y desinfectadas.'],
  ] },
  { t: 13, pos: '19', law: 'RD 98/2016 (marcado CE)', s: ["Categorías de diseño A y B","Qué entra y qué no (regatas, componentes)","Marcado CE y modificación del motor"], k: [
    ['Categorías de diseño: B, vientos hasta fuerza 8 y ola de hasta 4 m; A, más de fuerza 8 y más de 4 m.', 3],
    ['No se aplica a las embarcaciones exclusivamente de regatas. Antenas, radios u hornillos no son «componentes».'],
    ['Modificación importante del motor: más de un 15 % de potencia. Documentación técnica: 10 años.'],
  ] },
  { t: 14, pos: '20-21', law: 'Convenios SAR 1979 y Salvamento 1989 · SASEMAR', s: ["Fases de emergencia","Notificaciones de buques","SASEMAR: naturaleza y órganos","Recompensa y contratos de salvamento"], k: [
    ['Fases de emergencia: incertidumbre, alerta y peligro.', 4],
    ['Notificaciones de buques: plan de navegación, notificación de situación y notificación final.', 4],
    ['SASEMAR: entidad pública empresarial; órgano de gestión, el Director; de gobierno, el Consejo de Administración y el Presidente.', 8],
    ['Salvamento 1989: la recompensa no supera el valor de lo salvado; el capitán puede contratar el salvamento en nombre del propietario.'],
  ] },
  { t: 15, pos: '22-23', law: 'Ley 14/2014 (registro, nacionalidad e hipoteca)', s: ["Registro de Bienes Muebles","Hipoteca naval","Diarios, Bitácora y su conservación","Patente, pasavante y Certificado de Matrícula"], k: [
    ['Titularidades, gravámenes e hipoteca naval se inscriben en la Sección de Buques del Registro de Bienes Muebles (Ministerio de Justicia).', 9],
    ['Hipoteca naval: escritura pública, póliza notarial o documento privado; la acción prescribe a los 3 años.', 5],
    ['Diarios y cuadernos: se conservan 1 año. Cuaderno de Bitácora: con dos o más oficiales de puente. Actos del capitán con funciones públicas: en el Diario de Navegación.', 5],
    ['La Patente de Navegación acredita la nacionalidad; provisionalmente, pasavante. El Certificado de Matrícula acredita que está matriculado en España.', 6],
  ] },
  { t: 16, pos: '24', law: 'Código Civil', s: ["Testamentos: común, marítimo y su caducidad","Custodia del testamento por el capitán","Matrimonio y fallecimiento a bordo"], k: [
    ['Testamentos en 11 de 15 convocatorias. El común es ológrafo, abierto o cerrado; el marítimo es especial.', 11],
    ['Testamento marítimo de palabra ante dos testigos: solo con peligro de naufragio. Caduca a los 4 meses de desembarcar donde pueda testar normalmente.', 4],
    ['Los custodia el Capitán y se anotan en el Diario de Navegación.', 2],
    ['Nave presuntamente naufragada: declaración de fallecimiento al mes de las últimas noticias. Matrimonio en peligro de muerte a bordo: lo autoriza el Capitán.'],
  ] },
  { t: 17, pos: '25-26', law: 'RD 128/2022 (desechos de buques)', s: ["Ámbito del RD 128/2022","Definiciones (desechos de buques)","SafeSeaNet, tarifas y exenciones"], k: [
    ['Se aplica a buques de cualquier pabellón que hagan escala en puerto español, salvo los de Estado y los de servicios portuarios.', 2],
    ['«Desechos de buques» incluye los residuos de carga. Las aguas sucias son categoría MARPOL anexo IV. Notificación por SafeSeaNet.'],
    ['Las preguntas de 2017-2022 son del RD 1381/2002, derogado: llevan aviso rojo.'],
  ] },
  { t: 18, pos: '27-28', law: 'MARPOL: articulado y anexos IV y V', s: ["Qué son y qué no son aguas sucias","A qué buques se aplica el anexo IV","Zonas especiales y descargas del anexo V","Anexos facultativos"], k: [
    ['Anexo IV: buques nuevos de 400 GT o más, o de menos de 400 autorizados a llevar más de 15 personas. Certificado de aguas sucias: 5 años.'],
    ['Qué no son aguas sucias: desagües de máquinas o de espacios de carga. Sí lo son los de inodoros, servicios médicos y espacios con animales vivos.', 6],
    ['Anexo V: zonas especiales Mediterráneo, Báltico, mar Negro, mar Rojo, Golfos, mar del Norte, Antártico y Gran Caribe (el Cantábrico no). Comida sin triturar: en ruta y a más de 12 millas.', 7],
    ['Anexos facultativos: III, IV y V. MARPOL no tiene anexo VII.', 2],
  ] },
  { t: 19, pos: '29-30', law: 'RD 1185/2006 (radiocomunicaciones)', s: ["NAVTEX (518 y 490 kHz)","Zonas de navegación y su equipo","MMSI, operador restringido, canal 16"], k: [
    ['NAVTEX: 518 kHz y la frecuencia nacional de 490 kHz.', 3],
    ['Zonas de navegación: 1 ilimitada; 3 hasta 25 millas; 4 hasta 12 millas; 5 hasta 5 millas de un abrigo o playa accesible.'],
    ['Operador restringido: solo zona A1. MMSI: los asigna la DGMM. Canal 16: 156,800 MHz. Energía de reserva: 3 horas.'],
    ['Recreo: notifica la instalación si lleva Licencia de Estación de Barco.', 2],
  ] },
];
