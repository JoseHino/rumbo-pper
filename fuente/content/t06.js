module.exports = {
  id: 6,
  title: "Tráfico marítimo y lugares de refugio",
  law: "Real Decreto 210/2004, de 6 de febrero (seguimiento e información sobre el tráfico marítimo) · RD 1837/2000 (Reglamento de inspección y certificación de buques civiles), art. 14",
  scope: "RD 210/2004 caps. I, II y IV · RD 1837/2000 art. 14 (y art. 4, que también ha caído)",
  intro: "Notificación y seguimiento de buques, AIS y cajas negras, qué hacer ante accidentes y mal tiempo, lugares de refugio y obligaciones de capitanes y patrones con los certificados.",
  cards: [
    { t: "Para qué sirve el RD 210/2004", b: "Crea un sistema de <b>seguimiento e información del tráfico marítimo</b> para aumentar la seguridad, responder mejor a accidentes (incluida la búsqueda y rescate) y detectar antes la contaminación. Obliga a capitanes, operadores, agentes y expedidores de mercancías peligrosas.", ref: "Art. 1" },
    { t: "A qué buques se aplica", b: "A los de <b>arqueo bruto igual o superior a 300</b>. Los <b>pesqueros, los históricos y las embarcaciones de recreo de menos de 45 m</b> solo están sujetos a los arts. 17 a 25 (incidentes, accidentes y refugio). No se aplica a buques de defensa o de servicio público no comercial.", ref: "Art. 2" },
    { t: "Definiciones clave", b: "<b>Autoridades competentes</b>: DGMM y, bajo su dirección, Capitanías y SASEMAR. <b>Estación costera</b>: los centros de coordinación de salvamento de SASEMAR. <b>Lugar de refugio</b>: puerto, atracadero, fondeadero u otra zona para acoger buques necesitados de asistencia. <b>SafeSeaNet</b>: sistema comunitario de intercambio de información marítima.", ref: "Art. 3" },
    { t: "Notificación previa de llegada", b: "El buque con destino a un puerto español notifica a la entidad gestora del puerto <b>al menos 24 horas antes</b>, o al salir del puerto anterior si la travesía dura menos de 24 h, o en cuanto lo sepa si cambia el puerto de escala.", ref: "Art. 4" },
    { t: "AIS, LRIT y cajas negras", b: "Todo buque que haga escala en España lleva <b>AIS (SIA)</b> y lo mantiene funcionando siempre. Los <b>pesqueros de más de 15 m</b> de eslora total llevan AIS clase A. Ciertos buques llevan <b>LRIT</b> y un <b>registrador de datos de la travesía (RDT)</b> o caja negra.", ref: "Arts. 6, 6 bis, 6 ter y 10", tip: "El pesquero puede desconectar el AIS en circunstancias excepcionales si el capitán lo considera necesario para la seguridad." },
    { t: "Servicios y sistemas de tráfico", b: "La Administración marítima hace el seguimiento de los buques en los dispositivos de organización del tráfico y en los <b>servicios de tráfico marítimo (STM)</b>, y exige que cumplan sus reglas.", ref: "Arts. 7-9" },
    { t: "Buques de riesgo", b: "Se consideran riesgo potencial los buques que han tenido incidentes, han incumplido notificaciones o reglas de tráfico, han hecho <b>vertidos o infracciones MARPOL</b>, tienen denegado el acceso a puertos de la UE, <b>no tienen seguro</b> o presentan anomalías señaladas por prácticos o puertos.", ref: "Art. 16" },
    { t: "Notificación de incidentes y accidentes", b: "Los capitanes comunican <b>inmediatamente</b>: abordajes, varadas, daños, inundaciones o corrimientos de carga; fallos de gobierno, propulsión o navegación; situaciones que puedan contaminar; y <b>manchas, contenedores o bultos a la deriva</b>.", ref: "Art. 17", tip: "El aviso incluye identidad, posición, puertos de origen y destino, personas a bordo y detalles del suceso." },
    { t: "Mal tiempo excepcional", b: "Las Capitanías pueden informar al capitán, <b>recomendar o prohibir la entrada o salida</b> del puerto y limitar o prohibir la carga de combustible en terminales. Sus medidas se basan en el pronóstico del <b>Instituto Nacional de Meteorología (hoy AEMET)</b>.", ref: "Art. 18", tip: "El capitán decide con su juicio profesional; si se aparta de la medida, informa a la Capitanía de sus razones." },
    { t: "Medidas ante un accidente", b: "La Administración puede: <b>restringir los movimientos</b> del buque o imponerle un rumbo; emplazar al capitán a poner fin al riesgo; <b>embarcar un equipo de evaluación</b>; ordenarle ir a un lugar de refugio; imponer <b>practicaje o remolque</b> a costa del operador.", ref: "Art. 19" },
    { t: "Quién decide sobre los buques necesitados de asistencia", b: "El <b>Director General de la Marina Mercante</b>, asistido por un <b>comité técnico</b> (capitán marítimo, jefe de distrito, coordinadores de inspección y seguridad). Sus deliberaciones son <b>confidenciales</b>.", ref: "Art. 20" },
    { t: "Planes de acogida", b: "Los elabora la Administración marítima, con participación del DGMM, previa consulta a los sectores e informe <b>no determinante</b> de Puertos del Estado, siguiendo las Resoluciones OMI A.949(23) y A.950(23).", ref: "Art. 21" },
    { t: "Garantía financiera en lugar de refugio", b: "Si se exige, se presenta en un banco con domicilio en España a favor de la DGMM. Límites: buques tanque de hasta 2.000 GT, <b>7 millones €</b> (+10.000 € por GT de exceso); resto de buques de hasta 2.000 GT, <b>2,5 millones €</b> (+600 € por GT de exceso).", ref: "Arts. 22-23" },
    { t: "Procedimiento de acceso a refugio", b: "Lo pide el capitán o el representante del operador; la <b>Capitanía instruye</b> (puede inspeccionar) y <b>decide el DGMM</b>. Por urgencia la resolución puede ser <b>verbal</b>, notificándose por escrito en un máximo de <b>96 horas</b>. Pone fin a la vía administrativa: cabe recurso de reposición.", ref: "Art. 24" },
    { t: "Clasificación Nacional de Buques", b: "<b>Cinco grupos</b>: I pasaje; II carga; III servicios de puerto; IV pesqueros; <b>V buques y embarcaciones de recreo</b>.", ref: "Art. 4 RD 1837/2000" },
    { t: "Obligaciones del capitán o patrón con los certificados", b: "Comunicar la caducidad de certificados y pedir su renovación; someterse a las inspecciones; llevar a bordo todos los certificados en lugar accesible y visible; mantener el buque conforme a las normas; <b>no hacer cambios</b> que afecten a la seguridad sin autorización de la DGMM.", ref: "Art. 14.1 RD 1837/2000" },
    { t: "Comunicación de averías y accidentes", b: "Se notifican de inmediato al <b>Capitán Marítimo</b> si el buque está en puerto español, o a la DGMM y a las autoridades del puerto si es extranjero. Si el buque está <b>navegando</b>, a las autoridades del <b>primer puerto de arribada, antes de llegar</b>.", ref: "Art. 14.2 RD 1837/2000" }
  ],
  tf: [
    { s: "El RD 210/2004 se aplica, en general, a los buques de arqueo bruto igual o superior a 300.", a: true, e: "Art. 2.1." },
    { s: "Las embarcaciones de recreo de menos de 45 metros están sujetas a todo el RD 210/2004.", a: false, e: "Solo a los arts. 17 a 25 (art. 2.3)." },
    { s: "La notificación previa de llegada a puerto se hace al menos 24 horas antes.", a: true, e: "Art. 4.1." },
    { s: "Los buques equipados con AIS pueden apagarlo libremente al entrar en aguas interiores.", a: false, e: "Deben mantenerlo en funcionamiento en todo momento, salvo normas internacionales de protección de la información (art. 6.2)." },
    { s: "Los pesqueros de más de 15 metros de eslora total deben llevar AIS de clase A.", a: true, e: "Art. 6 bis." },
    { s: "Las medidas de las Capitanías por mal tiempo excepcional se basan en el pronóstico de la Autoridad Portuaria.", a: false, e: "Se basan en el pronóstico del Instituto Nacional de Meteorología (AEMET) (art. 18.3)." },
    { s: "Ante un accidente, la Administración marítima puede imponer el remolque del buque a costa del operador.", a: true, e: "Art. 19.2.d." },
    { s: "Las deliberaciones del comité técnico que asesora al DGMM sobre buques necesitados de asistencia son públicas.", a: false, e: "Son confidenciales (art. 20.1)." },
    { s: "La resolución de acceso a un lugar de refugio puede adoptarse verbalmente por urgencia.", a: true, e: "Art. 24.4, notificándola por escrito en un máximo de 96 horas." },
    { s: "La Clasificación Nacional de Buques tiene cinco grupos.", a: true, e: "Art. 4 RD 1837/2000." },
    { s: "Los buques y embarcaciones de recreo forman el grupo IV de la Clasificación Nacional de Buques.", a: false, e: "Son el grupo V; el IV son los pesqueros." },
    { s: "Si el buque está navegando, una avería de consideración se comunica a las autoridades del primer puerto de arribada antes de llegar.", a: true, e: "Art. 14.2 RD 1837/2000." }
  ],
  pairs: [
    { title: "Grupos de la Clasificación Nacional de Buques", items: [["Grupo I", "Buques de pasaje"], ["Grupo II", "Buques de carga"], ["Grupo III", "Servicios de puerto"], ["Grupo IV", "Pesqueros"], ["Grupo V", "Recreo"]] },
    { title: "Cada concepto con su significado", items: [["SafeSeaNet", "Intercambio de información marítima de la UE"], ["Estación costera", "Centros de coordinación de SASEMAR"], ["RDT", "Caja negra del buque"], ["SIA / AIS", "Identificación automática de buques"]] }
  ],
  cloze: [
    { s: "El RD 210/2004 se aplica a buques de arqueo bruto igual o superior a ___.", o: ["100", "300", "500", "1.000"], a: 1 },
    { s: "Pesqueros, históricos y recreo de menos de ___ m solo cumplen los arts. 17 a 25.", o: ["24", "30", "45", "60"], a: 2 },
    { s: "La resolución verbal de acceso a refugio se notifica por escrito en un máximo de ___ horas.", o: ["24", "48", "72", "96"], a: 3 },
    { s: "Garantía para buques no tanque de hasta 2.000 GT: hasta ___ millones de euros.", o: ["1", "2,5", "7", "10"], a: 1 },
    { s: "Los pesqueros de más de ___ m de eslora total llevan AIS clase A.", o: ["12", "15", "24", "45"], a: 1 }
  ],
  quiz: [
    { q: "Según el RD 210/2004, son autoridades competentes:", o: ["Solo Puertos del Estado.", "La DGMM y, bajo su dirección, las Capitanías Marítimas y SASEMAR.", "El Ministerio de Defensa y la Armada.", "Las Comunidades Autónomas."], a: 1, e: "Art. 3.l." },
    { q: "Si la travesía hasta un puerto español dura menos de 24 horas, la notificación previa se hace:", o: ["Al llegar al puerto.", "En el momento en que el buque abandone el puerto anterior.", "48 horas antes.", "No es necesaria."], a: 1, e: "Art. 4.1." },
    { q: "¿Cuál de los siguientes buques se considera un riesgo potencial según el art. 16 del RD 210/2004?", o: ["Un velero de regatas.", "Un buque que no tenga en vigor las pólizas de seguro o la garantía financiera exigidas.", "Un buque recién pintado.", "Un buque con doble casco."], a: 1, e: "Art. 16.1.d." },
    { q: "¿Qué deben comunicar inmediatamente los capitanes según el art. 17 del RD 210/2004?", o: ["El menú de la tripulación.", "Cualquier mancha de contaminantes o contenedores o bultos a la deriva observados en el mar.", "Los cambios de guardia.", "El consumo de combustible diario."], a: 1, e: "Art. 17.1.d." },
    { q: "En condiciones meteorológicas excepcionalmente desfavorables, las Capitanías Marítimas pueden:", o: ["Multar a todos los buques en puerto.", "Recomendar o prohibir la entrada o salida del puerto y limitar o prohibir la carga de combustible en terminales.", "Ordenar el hundimiento preventivo de buques.", "Cerrar las playas."], a: 1, e: "Art. 18.1." },
    { q: "Si el capitán decide no seguir la medida adoptada por la Capitanía por mal tiempo:", o: ["Comete siempre infracción muy grave.", "Debe informar a la Capitanía de las razones de su decisión, y esta puede mantener o reconsiderar la medida.", "No tiene que informar a nadie.", "Debe pedir permiso al armador."], a: 1, e: "Art. 18.2." },
    { q: "¿Quién forma parte del comité técnico que asesora al DGMM sobre buques necesitados de asistencia?", o: ["El alcalde del municipio.", "El capitán marítimo, el jefe del distrito y los coordinadores de inspección y seguridad marítima, entre otros.", "Solo representantes de las navieras.", "El presidente de la Autoridad Portuaria exclusivamente."], a: 1, e: "Art. 20.1." },
    { q: "Los planes de acogida de buques necesitados de asistencia se elaboran previo informe de Puertos del Estado, que es:", o: ["Vinculante.", "No determinante.", "Innecesario.", "Determinante y vinculante."], a: 1, e: "Art. 21.2." },
    { q: "¿Quién instruye el procedimiento de acceso a un lugar de refugio?", o: ["La Autoridad Portuaria.", "La Capitanía Marítima.", "SASEMAR.", "El juez de guardia."], a: 1, e: "Art. 24.3. La decisión corresponde al DGMM (art. 24.1)." },
    { q: "Contra la resolución sobre el acceso a un lugar de refugio cabe:", o: ["Recurso de alzada ante el Ministro.", "Recurso de reposición, porque pone fin a la vía administrativa.", "Ningún recurso.", "Recurso ante el Capitán Marítimo."], a: 1, e: "Art. 24.5." },
    { q: "Según el art. 14 del RD 1837/2000, los certificados del buque deben llevarse a bordo:", o: ["En la caja fuerte del armador en tierra.", "Custodiados por el capitán o patrón, en un lugar de fácil acceso y con visibilidad adecuada.", "Solo en formato digital en la nube.", "En la Capitanía del puerto base."], a: 1, e: "Art. 14.1.d." },
    { q: "Un cambio en la disposición estructural o en las máquinas que pueda afectar a la seguridad requiere:", o: ["Solo anotarlo en el Diario de Navegación.", "Autorización previa de la Dirección General de la Marina Mercante.", "Autorización del astillero.", "Comunicación posterior a la aseguradora."], a: 1, e: "Art. 14.1.f." }
  ],
  official: {
    "2026abr-1-08": "Art. 18.3 RD 210/2004: las medidas de las Capitanías por mal tiempo excepcional se basan en el pronóstico del Instituto Nacional de Meteorología (hoy AEMET).",
    "2025nov-1-08": "Art. 14.2 RD 1837/2000: con el buque navegando, la comunicación se hace a las autoridades del primer puerto de arribada y siempre antes de llegar a él.",
    "2025abr-1-08": "Art. 4 RD 1837/2000: cinco grupos (pasaje, carga, servicios de puerto, pesqueros y recreo)."
  }
};
