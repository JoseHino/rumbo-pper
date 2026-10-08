module.exports = {
  id: 11,
  title: "Inspecciones de embarcaciones de recreo",
  law: "Real Decreto 1434/1999, de 10 de septiembre: reconocimientos e inspecciones de las embarcaciones de recreo y entidades colaboradoras de inspección (ECI)",
  scope: "RD 1434/1999 completo (modificado por el RD 1435/2010)",
  intro: "Los cinco tipos de reconocimiento, cada cuánto toca, el certificado de navegabilidad y las entidades colaboradoras de inspección.",
  cards: [
    { t: "Ámbito", b: "Embarcaciones de recreo <b>matriculadas en España</b>, de <b>2,5 a 24 m</b> de eslora de casco, para fines recreativos y deportivos, que <b>no transporten más de 12 pasajeros</b>.", ref: "Art. 2" },
    { t: "Reconocimiento inicial", b: "Lo hace la <b>Administración marítima</b>: examen de planos y documentación técnica e inspección de estructura, máquinas y equipo. Superado, se expide el <b>certificado de navegabilidad</b>.", ref: "Art. 3.A", tip: "Las embarcaciones con marcado CE no lo necesitan: el certificado se les expide automáticamente." },
    { t: "Reconocimientos periódicos", b: "Cada <b>5 años como máximo</b>: lista 7.ª de <b>6 m o más</b> (y menos de 24 m) y toda la lista 6.ª sea cual sea su eslora. Incluyen <b>inspección del casco en seco</b> y del equipo, revisión minuciosa de salvamento y seguridad y comprobación de la documentación.", ref: "Art. 3.B" },
    { t: "Exentas de periódicos", b: "Las embarcaciones de <b>lista 7.ª de menos de 6 m</b> no tienen reconocimientos periódicos: su certificado de navegabilidad lleva la frase <b>«SIN CADUCIDAD»</b>.", ref: "Art. 3.B" },
    { t: "Reconocimientos intermedios", b: "En seco, <b>entre el 2.º y el 3.er año</b> del periodo: lista 6.ª de 6 m o más; lista 7.ª de <b>15 m o más</b>; y lista 7.ª de 6 m o más con <b>casco de madera</b>.", ref: "Art. 3.C" },
    { t: "Reconocimientos adicionales", b: "Obligatorios cuando la embarcación: hace <b>reparaciones o modificaciones</b> en casco, maquinaria o equipo; va a <b>pasar de lista 7.ª a lista 6.ª</b>; o tras una <b>varada, abordaje</b> o avería seria que afecte a la seguridad.", ref: "Art. 3.D" },
    { t: "Reconocimientos extraordinarios", b: "A requerimiento de un <b>órgano judicial</b>, o por resolución motivada de la <b>DGMM</b> cuando haya indicios fundados de peligro para la seguridad marítima o para prevenir la contaminación.", ref: "Art. 3.E" },
    { t: "Certificado de navegabilidad", b: "Acredita los reconocimientos hechos y la fecha de los próximos; si no se pasan a tiempo, <b>caduca</b>. Va <b>siempre a bordo</b>; si no está, hay <b>5 días hábiles</b> para acreditarlo. El propietario responde de tenerlo al día.", ref: "Art. 4", tip: "Navegar con él caducado o sin él es infracción grave." },
    { t: "Quién hace los reconocimientos", b: "El inicial, la Administración marítima. Los <b>periódicos, intermedios, adicionales y extraordinarios</b> se hacen a través de las <b>entidades colaboradoras de inspección (ECI)</b>; en el extranjero, también organizaciones autorizadas.", ref: "Art. 5" },
    { t: "Requisitos de una ECI", b: "Independencia total de fabricantes, astilleros, talleres, vendedores y <b>aseguradoras</b>; personal cualificado y formación; equipos calibrados; seguro de al menos <b>1.202.024 €</b>; cobertura nacional para inspeccionar en <b>menos de 15 días</b>; sistema de calidad EN 45004.", ref: "Art. 6" },
    { t: "Autorización de las ECI", b: "La concede el <b>Secretario de Estado</b> (antes de Infraestructuras y Transportes), se publica en el BOE y vale para toda España. Plazo de <b>3 meses</b>; sin resolución, se entiende desestimada. Sus centros no pueden cubrir más de <b>200 km</b> (salvo Canarias).", ref: "Art. 7" },
    { t: "Obligaciones de las ECI", b: "Auditoría al menos <b>una vez al año</b> por la DGMM; registros y <b>memoria anual antes del 31 de marzo</b>; confidencialidad; comunicar sus tarifas; aval de <b>50 millones de pesetas</b>.", ref: "Art. 8" },
    { t: "Cómo se pide un reconocimiento", b: "El propietario lo pide a una ECI con <b>al menos 15 días naturales</b> antes de que caduque el certificado y elige el lugar (astillero, varadero, puerto, club). Puede estar presente en la inspección.", ref: "Art. 9" },
    { t: "Resultado del reconocimiento", b: "<b>Favorable</b>: la ECI renueva el certificado (si es adicional, informa a la Capitanía, que lo expide). <b>Desfavorable</b>: hasta <b>2 meses</b> para subsanar; si no, la Capitanía declara caducado el certificado. Si hay defectos graves, la Capitanía puede <b>inmovilizar</b> la embarcación.", ref: "Art. 10" },
    { t: "Infracciones graves", b: "Navegar <b>sin certificado de navegabilidad o con él caducado</b>; hacer obras de transformación o <b>cambiar el motor sin autorización</b>; incumplir las condiciones de la ECI o hacer mal los reconocimientos; no enviar la memoria anual.", ref: "Art. 12" },
    { t: "Infracciones muy graves", b: "Navegar sin certificado <b>y además sin condiciones de navegabilidad</b>, poniendo en peligro la seguridad; que la ECI <b>falsee datos</b>; o que el propietario falsee informes o datos del certificado.", ref: "Art. 13", tip: "Responden los propietarios por lo suyo y las ECI por lo suyo (art. 14). La suspensión o revocación de la ECI es sanción accesoria." }
  ],
  tf: [
    { s: "El RD 1434/1999 se aplica a embarcaciones de recreo matriculadas que no transporten más de 12 pasajeros.", a: true, e: "Art. 2.1." },
    { s: "Una embarcación con marcado CE debe pasar el reconocimiento inicial.", a: false, e: "No lo precisa; el certificado de navegabilidad se le expide automáticamente (art. 3.A)." },
    { s: "Los reconocimientos periódicos se hacen cada cinco años como máximo.", a: true, e: "Art. 3.B." },
    { s: "Una embarcación de lista séptima de 5 metros está sujeta a reconocimientos periódicos.", a: false, e: "Las de lista 7.ª de menos de 6 m están exentas; su certificado dice «SIN CADUCIDAD» (art. 3.B)." },
    { s: "Una embarcación de lista sexta de 5 metros está sujeta a reconocimientos periódicos.", a: true, e: "Las de lista 6.ª, cualquiera que sea su eslora (art. 3.B)." },
    { s: "Una embarcación de lista séptima de 10 metros con casco de fibra debe pasar reconocimiento intermedio.", a: false, e: "En lista 7.ª el intermedio es para 15 m o más, o 6 m o más si el casco es de madera (art. 3.C)." },
    { s: "El cambio de lista séptima a lista sexta exige un reconocimiento adicional.", a: true, e: "Art. 3.D.b." },
    { s: "El reconocimiento extraordinario puede ordenarlo un órgano judicial.", a: true, e: "Art. 3.E.a." },
    { s: "La inspección del casco en seco forma parte del reconocimiento periódico.", a: true, e: "Art. 3.B.1." },
    { s: "Una entidad colaboradora de inspección puede estar participada por una aseguradora.", a: false, e: "Está expresamente prohibido (art. 6.1.a)." },
    { s: "El reconocimiento se solicita a la ECI con al menos 15 días naturales de antelación a la caducidad del certificado.", a: true, e: "Art. 9.1." },
    { s: "Tras un reconocimiento desfavorable hay seis meses para subsanar los defectos.", a: false, e: "Un máximo de dos meses (art. 10.2.º)." },
    { s: "Navegar con el certificado de navegabilidad caducado es una infracción grave.", a: true, e: "Arts. 4.5 y 12.a." }
  ],
  pairs: [
    { title: "Cada situación con su reconocimiento", items: [["Embarcación nueva sin marcado CE", "Inicial"], ["Revisión quinquenal con casco en seco", "Periódico"], ["Revisión entre el 2.º y el 3.er año", "Intermedio"], ["Paso de lista 7.ª a 6.ª o tras una varada", "Adicional"], ["Lo pide un juez o la DGMM", "Extraordinario"]] },
    { title: "Cada cifra con su regla", items: [["Periodicidad máxima de los periódicos", "5 años"], ["Plazo para subsanar un resultado desfavorable", "2 meses"], ["Antelación para pedir el reconocimiento", "15 días naturales"], ["Seguro mínimo de una ECI", "1.202.024 €"], ["Radio máximo de un centro de la ECI", "200 km"]] }
  ],
  cloze: [
    { s: "En lista 7.ª, las embarcaciones de menos de ___ m están exentas de reconocimientos periódicos.", o: ["4", "6", "8", "12"], a: 1 },
    { s: "En lista 7.ª, el intermedio es obligatorio a partir de ___ m de eslora (si el casco no es de madera).", o: ["6", "10", "12", "15"], a: 3 },
    { s: "El reconocimiento intermedio se hace entre el segundo y el ___ año.", o: ["tercer", "cuarto", "quinto", "sexto"], a: 0 },
    { s: "Si el certificado de navegabilidad no está a bordo, hay ___ días hábiles para acreditarlo.", o: ["3", "5", "10", "15"], a: 1 },
    { s: "Las ECI presentan su memoria anual antes del 31 de ___.", o: ["enero", "marzo", "junio", "diciembre"], a: 1 },
    { s: "La autorización de una ECI se resuelve en un plazo máximo de ___ meses.", o: ["1", "2", "3", "6"], a: 2 }
  ],
  quiz: [
    { q: "Según el RD 1434/1999, ¿quién realiza el reconocimiento inicial?", o: ["Una entidad colaboradora de inspección.", "La Administración marítima.", "El astillero.", "La Federación de Vela."], a: 1, e: "Art. 3.A." },
    { q: "Las embarcaciones de lista sexta están sujetas a reconocimientos periódicos:", o: ["Solo si miden más de 6 m.", "Cualquiera que sea su eslora, cada cinco años como máximo.", "Cada diez años.", "Nunca."], a: 1, e: "Art. 3.B." },
    { q: "¿Qué embarcaciones deben pasar reconocimiento intermedio?", o: ["Todas las de lista 7.ª.", "Las de lista 6.ª de 6 m o más, las de lista 7.ª de 15 m o más y las de lista 7.ª de 6 m o más con casco de madera.", "Solo las de más de 20 m.", "Solo las motos náuticas."], a: 1, e: "Art. 3.C." },
    { q: "¿Cuál de los siguientes supuestos obliga a un reconocimiento adicional?", o: ["Cambiar de propietario.", "Haber sufrido una varada o abordaje que pueda afectar a la seguridad.", "Cambiar el nombre de la embarcación.", "Renovar el seguro."], a: 1, e: "Art. 3.D.c." },
    { q: "¿Qué consecuencia tiene no realizar o no superar los reconocimientos en plazo?", o: ["Una multa automática sin más.", "La caducidad del certificado de navegabilidad.", "La baja en el registro.", "Ninguna mientras haya seguro."], a: 1, e: "Art. 4.1." },
    { q: "La autorización de las entidades colaboradoras de inspección corresponde a:", o: ["El Capitán Marítimo.", "El Secretario de Estado (Infraestructuras y Transportes en el texto original).", "Las Comunidades Autónomas.", "ENAC."], a: 1, e: "Art. 7.1." },
    { q: "Las entidades colaboradoras de inspección deben poder efectuar los reconocimientos solicitados en un plazo inferior a:", o: ["48 horas.", "7 días.", "15 días naturales desde la solicitud.", "Un mes."], a: 2, e: "Art. 6.1.g." },
    { q: "¿Con qué frecuencia mínima son auditadas las ECI por la DGMM?", o: ["Cada cinco años.", "Al menos una vez al año.", "Cada tres años.", "Solo cuando hay una denuncia."], a: 1, e: "Art. 8.a." },
    { q: "¿Quién elige el lugar donde se realiza el reconocimiento?", o: ["La ECI.", "La Capitanía.", "El propietario de la embarcación.", "El club náutico."], a: 2, e: "Art. 9.2." },
    { q: "Si la embarcación presenta defectos de tal gravedad que comprometen la seguridad de la navegación:", o: ["La ECI la hunde.", "Se comunica de inmediato a la Capitanía Marítima, que puede acordar su inmovilización.", "Se le da un año de plazo.", "La aseguradora decide."], a: 1, e: "Art. 10.3.º." },
    { q: "Realizar obras de transformación o un cambio de motor sin la autorización correspondiente es:", o: ["Una infracción leve.", "Una infracción grave.", "Una infracción muy grave.", "No es infracción."], a: 1, e: "Art. 12.b." }
  ],
  official: {
    "2026abr-1-16": "Art. 3.D.b RD 1434/1999: el cambio de la lista séptima a la sexta exige un reconocimiento adicional.",
    "2025nov-1-16": "Art. 3.B.1: la inspección del casco en seco y del equipo con pruebas forma parte del reconocimiento periódico.",
    "2025abr-1-16": "Art. 4 RD 1434/1999: el certificado de navegabilidad acredita los reconocimientos de la embarcación."
  }
};
