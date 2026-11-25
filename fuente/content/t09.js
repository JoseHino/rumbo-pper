module.exports = {
  id: 9,
  title: "Seguro obligatorio de responsabilidad civil",
  law: "Real Decreto 607/1999, de 16 de abril: Reglamento del seguro de responsabilidad civil de suscripción obligatoria para embarcaciones de recreo o deportivas",
  scope: "Reglamento completo (arts. 1-12)",
  intro: "Qué embarcaciones deben asegurarse, qué cubre y qué no cubre el seguro obligatorio, sus límites y cómo se acredita a bordo.",
  cards: [
    { t: "Qué cubre el seguro obligatorio", b: "La <b>responsabilidad civil extracontractual</b> de navieros o propietarios, de quienes patroneen con su autorización, de quienes les ayuden en el gobierno y de los <b>esquiadores</b> que arrastre la embarcación, por daños a terceros, a puertos o instalaciones, por colisión, abordaje y en general por el uso de la embarcación en aguas españolas.", ref: "Art. 1.1", tip: "La póliza puede incluir coberturas y límites mayores pactados libremente (art. 1.2)." },
    { t: "Qué embarcaciones deben asegurarse", b: "Todas las <b>propulsadas a motor</b>, incluidas las <b>motos náuticas</b>, y las <b>sin motor de más de 6 m</b> de eslora destinadas al recreo y deporte.", ref: "Art. 2", tip: "Un velero sin motor de 5 m no está obligado; uno de 7 m, sí." },
    { t: "Cuándo hay que estar asegurado", b: "Durante la navegación y también <b>atracada</b>, en los periodos en que esté expuesta a los riesgos del reglamento. Para <b>regatas y competiciones</b> (y sus entrenamientos) hace falta un <b>seguro especial</b> con al menos la cobertura obligatoria.", ref: "Art. 3" },
    { t: "Embarcaciones extranjeras", b: "Las de recreo extranjeras que naveguen por el mar territorial o aguas interiores españolas y entren o salgan de un puerto español deben asegurarse o acreditar un seguro con las mismas condiciones que las españolas.", ref: "Art. 4" },
    { t: "Navegar sin seguro", b: "Es una <b>infracción grave</b> según la Ley de Puertos y de la Marina Mercante.", ref: "Art. 5" },
    { t: "Riesgos cubiertos", b: "<b>Muerte o lesiones de terceros</b>; <b>daños materiales a terceros</b>; pérdidas económicas consecuencia directa de esos daños; <b>daños a buques por colisión o sin contacto</b>. Salvo pacto, el asegurador paga las costas de la defensa.", ref: "Art. 6" },
    { t: "Exclusiones (I): las personas", b: "No cubre los daños al tomador, naviero, propietario o asegurado; la muerte o lesiones de <b>pasajeros que pagan</b> el viaje; de quienes trabajan en el mantenimiento de la embarcación; ni del <b>patrón o piloto</b>.", ref: "Art. 7 a)-d)" },
    { t: "Exclusiones (II): los daños", b: "No cubre los <b>daños a la propia embarcación asegurada</b>; los causados en reparación, en tierra o remolcada por carretera; los de bienes en poder del asegurado u ocupantes; los de embarcaciones remolcadas para salvarlas; los de embarcaciones robadas; ni <b>multas y sanciones</b>.", ref: "Art. 7 e)-k)" },
    { t: "Exclusiones (III): sin título y regatas", b: "Tampoco cubre los daños a quienes suben voluntariamente a una embarcación gobernada por alguien <b>sin el título adecuado</b>, si el asegurador prueba que lo sabían; ni los daños en <b>regatas y competiciones</b>, que van con el seguro especial.", ref: "Art. 7 h) y l)" },
    { t: "Límites de la cobertura", b: "Daños a personas: <b>120.202,42 €</b> por víctima (20 millones de pesetas), con máximo de <b>240.404,84 €</b> por siniestro (40 millones). Daños materiales y pérdidas económicas: <b>96.161,94 €</b> por siniestro (16 millones).", ref: "Art. 8", tip: "El reglamento sigue expresando las cifras en pesetas; en el examen suelen aparecer en euros." },
    { t: "Quién contrata el seguro", b: "El <b>naviero o propietario</b> a cuyo nombre figure la embarcación en el registro. También puede contratarlo cualquier otro interesado o usuario, indicando en qué concepto.", ref: "Art. 9" },
    { t: "Aseguradoras", b: "Entidades autorizadas en el <b>ramo 12</b> (responsabilidad civil en vehículos marítimos) o domiciliadas en el Espacio Económico Europeo con autorización para operar en España.", ref: "Art. 10" },
    { t: "Acreditar el seguro", b: "Prueba la vigencia el <b>justificante del pago de la prima</b> en curso con aseguradora, embarcación, periodo con fecha y hora, e indicación de que es el seguro obligatorio. Va <b>a bordo</b>; si no está, hay <b>5 días hábiles</b> para justificarlo.", ref: "Arts. 11-12" }
  ],
  tf: [
    { s: "Un velero sin motor de 5 metros de eslora está obligado a tener el seguro obligatorio de responsabilidad civil.", a: false, e: "Las embarcaciones sin motor solo están obligadas si superan los 6 m (art. 2)." },
    { s: "Las motos náuticas están obligadas a tener seguro de responsabilidad civil.", a: true, e: "Art. 2." },
    { s: "El seguro cubre la responsabilidad del esquiador que arrastra la embarcación.", a: true, e: "Art. 1.1." },
    { s: "Navegar sin el seguro obligatorio es una infracción leve.", a: false, e: "Es grave (art. 5)." },
    { s: "El seguro obligatorio cubre los daños sufridos por la propia embarcación asegurada.", a: false, e: "Están excluidos (art. 7.e)." },
    { s: "El seguro obligatorio cubre los daños a buques por colisión o sin contacto.", a: true, e: "Art. 6.1.d." },
    { s: "La muerte o lesiones del patrón de la embarcación están cubiertas.", a: false, e: "Excluidas (art. 7.d)." },
    { s: "Para participar en regatas basta el seguro obligatorio ordinario.", a: false, e: "Hace falta un seguro especial (art. 3.2); los daños en regatas están excluidos del ordinario (art. 7.l)." },
    { s: "El límite por daños a personas es de 120.202,42 euros por víctima.", a: true, e: "Art. 8 (20 millones de pesetas)." },
    { s: "Si no se lleva a bordo el justificante del seguro, hay 5 días hábiles para acreditarlo.", a: true, e: "Art. 12.2." },
    { s: "Solo el propietario puede contratar el seguro de su embarcación.", a: false, e: "También cualquier otro interesado o usuario, expresando el concepto (art. 9.2)." }
  ],
  pairs: [
    { title: "¿Cubierto o excluido?", items: [["Lesiones de un bañista arrollado", "Cubierto"], ["Daños al propio barco asegurado", "Excluido"], ["Daños a otro buque sin contacto", "Cubierto"], ["Lesiones de un pasajero que paga el viaje", "Excluido"], ["Multas impuestas al patrón", "Excluido"]] },
    { title: "Cada límite con su cuantía", items: [["Por víctima (daños personales)", "120.202,42 €"], ["Por siniestro (daños personales)", "240.404,84 €"], ["Daños materiales por siniestro", "96.161,94 €"], ["Plazo para acreditar el seguro", "5 días hábiles"]] }
  ],
  cloze: [
    { s: "Las embarcaciones sin motor deben asegurarse si su eslora supera los ___ metros.", o: ["4", "5", "6", "8"], a: 2 },
    { s: "El límite por víctima equivale a ___ millones de pesetas.", o: ["16", "20", "40", "60"], a: 1 },
    { s: "Los daños materiales tienen un límite de ___ millones de pesetas por siniestro.", o: ["10", "16", "20", "40"], a: 1 },
    { s: "Las aseguradoras deben estar autorizadas en el ramo número ___.", o: ["6", "10", "12", "13"], a: 2 },
    { s: "Si el justificante no está a bordo, hay ___ días hábiles para presentarlo.", o: ["3", "5", "10", "15"], a: 1 }
  ],
  quiz: [
    { q: "Según el RD 607/1999, tienen la consideración de embarcaciones de recreo o deportivas a efectos del seguro obligatorio:", o: ["Solo las de más de 12 m.", "Las propulsadas a motor, incluidas las motos náuticas, y las sin motor de eslora superior a 6 m.", "Solo las de lista séptima.", "Todas las que tengan marcado CE."], a: 1, e: "Art. 2." },
    { q: "El seguro obligatorio cubre a:", o: ["Solo al propietario.", "Navieros o propietarios, personas autorizadas que patroneen, quienes les secunden en el gobierno y esquiadores arrastrados.", "Solo al patrón profesional.", "Únicamente a los pasajeros."], a: 1, e: "Art. 1.1." },
    { q: "Las embarcaciones extranjeras de recreo deben asegurar su responsabilidad civil cuando:", o: ["Nunca.", "Naveguen por el mar territorial o aguas interiores españolas y tengan entrada o salida en un puerto español.", "Superen los 24 m.", "Permanezcan más de 6 meses en España."], a: 1, e: "Art. 4.1." },
    { q: "¿Cuál de los siguientes riesgos cubre el seguro obligatorio?", o: ["Los daños causados cuando la embarcación es transportada por carretera.", "Las pérdidas económicas de terceros consecuencia directa de daños personales o materiales.", "Los daños de embarcaciones robadas.", "Los daños sufridos por bienes de los ocupantes."], a: 1, e: "Art. 6.1.c." },
    { q: "Salvo pacto en contrario, las costas judiciales y extrajudiciales de la defensa del asegurado son a cargo de:", o: ["El asegurado.", "El asegurador.", "Se reparten al 50 %.", "La Administración marítima."], a: 1, e: "Art. 6.2." },
    { q: "Están excluidos los daños sufridos por quienes ocupan voluntariamente una embarcación patroneada por alguien sin el título adecuado:", o: ["Siempre.", "Si el asegurador prueba que conocían esa circunstancia.", "Nunca.", "Solo si son menores."], a: 1, e: "Art. 7.h." },
    { q: "El límite máximo por siniestro para daños a personas es de:", o: ["96.161,94 euros.", "120.202,42 euros.", "240.404,84 euros.", "601.012,10 euros."], a: 2, e: "Art. 8: 40 millones de pesetas por siniestro." },
    { q: "¿Quién debe concertar el seguro obligatorio?", o: ["El club náutico donde amarra.", "El naviero o propietario que figure en el registro, aunque también puede hacerlo otro interesado.", "La Capitanía Marítima.", "El astillero que la construyó."], a: 1, e: "Art. 9." },
    { q: "¿Qué documento prueba la vigencia del seguro obligatorio?", o: ["La tarjeta de patrón.", "El justificante del pago de la prima del periodo en curso con los datos exigidos.", "El certificado de navegabilidad.", "Un certificado de la Capitanía."], a: 1, e: "Art. 12.1." }
  ],
  official: {
    "2026abr-1-13": "Art. 7.e: el seguro obligatorio no cubre los daños sufridos por la embarcación asegurada. Las otras tres opciones sí están cubiertas (art. 6).",
    "2025nov-1-13": "Art. 5: la navegación sin el seguro obligatorio es infracción grave.",
    "2025abr-1-13": "Art. 6.1.b: cubre los daños materiales a terceros. Las otras opciones son exclusiones del art. 7."
  }
};
