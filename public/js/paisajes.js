// 🌋 Lógica de «Volcanes, ríos y regiones de Costa Rica» (sin pantalla, para poder probarla con node).
//
// El mapa es el mismo de juegos/provincias.html. Encima se ponen volcanes, parques, el Chirripó, golfos y
// penínsulas (por latitud y longitud), ríos y cordilleras (dibujos aproximados), y se pregunta por provincias,
// regiones y «el más…». Para revisar los datos y las rondas:
//   node --input-type=module -e 'import { revisarDatos } from "./js/paisajes.js"; console.log(revisarDatos())'

// 🗺️ Mapa (generado a partir de juegos/provincias.html): contornos de las provincias en un viewBox de 1000 × 953.
// © colaboradores de OpenStreetMap (ODbL), vía geoBoundaries, simplificado.
export const MAPA_PROVINCIAS = {
  guanacaste: { n: "Guanacaste", x: 185, y: 250, d: "M234,353 L232,351 L230,347 L228,348 L228,352 L233,356 L236,356 L238,358 L240,355 L239,352 L234,353Z M208,50 L180,36 L161,36 L132,24 L121,12 L107,9 L83,50 L90,55 L90,62 L84,65 L79,64 L77,66 L73,59 L69,61 L71,62 L71,64 L68,63 L67,65 L65,66 L66,68 L74,71 L78,74 L78,77 L84,80 L83,84 L80,84 L79,87 L75,86 L81,89 L80,92 L78,92 L77,93 L78,95 L75,96 L75,93 L73,91 L72,93 L72,91 L62,92 L59,91 L57,93 L56,91 L55,93 L52,93 L57,98 L53,100 L47,96 L46,94 L49,92 L47,89 L45,90 L28,88 L34,91 L33,95 L29,96 L23,100 L20,100 L9,106 L18,103 L33,109 L36,116 L39,115 L51,118 L53,116 L56,119 L55,121 L51,122 L52,125 L54,127 L59,128 L63,131 L68,126 L74,129 L76,129 L80,130 L82,132 L84,131 L87,133 L86,131 L87,131 L93,142 L92,150 L94,168 L93,172 L88,173 L89,174 L85,178 L89,178 L88,180 L84,181 L84,187 L81,187 L84,189 L84,188 L87,187 L88,181 L93,178 L100,180 L102,184 L98,187 L97,189 L96,189 L95,193 L92,194 L91,193 L88,193 L87,194 L88,196 L86,199 L81,198 L81,199 L84,201 L82,204 L79,205 L77,203 L75,206 L73,206 L66,211 L58,207 L58,209 L57,209 L57,211 L55,213 L55,215 L49,215 L53,218 L51,221 L54,222 L53,225 L55,225 L56,227 L58,227 L59,232 L60,233 L60,235 L57,238 L52,236 L54,238 L53,241 L55,243 L52,247 L48,249 L44,246 L44,250 L42,249 L42,251 L39,255 L38,258 L33,259 L30,262 L31,264 L35,265 L40,273 L40,278 L36,281 L38,283 L39,282 L38,282 L39,280 L42,283 L39,286 L39,283 L37,283 L37,290 L38,295 L41,297 L42,308 L47,314 L50,320 L49,323 L52,325 L55,339 L61,345 L62,348 L66,352 L69,359 L72,359 L74,362 L81,368 L87,377 L85,373 L86,374 L89,374 L86,375 L87,376 L88,374 L90,375 L88,375 L88,376 L89,376 L89,377 L86,378 L88,380 L87,382 L89,382 L92,388 L92,392 L91,394 L89,393 L90,395 L93,395 L95,396 L95,394 L98,393 L101,395 L101,398 L108,400 L111,398 L112,400 L119,403 L122,402 L127,404 L133,402 L136,405 L136,407 L139,407 L139,405 L142,404 L144,407 L143,408 L148,411 L150,411 L150,408 L155,407 L160,408 L160,410 L167,411 L166,410 L169,410 L175,411 L187,419 L181,414 L183,413 L183,415 L187,417 L188,419 L187,420 L190,420 L196,423 L195,421 L199,423 L201,423 L201,425 L197,424 L203,427 L207,432 L208,432 L206,431 L206,428 L208,427 L210,428 L204,437 L210,440 L216,445 L214,442 L217,443 L223,437 L227,430 L226,422 L232,409 L225,408 L219,396 L203,391 L203,388 L206,384 L204,381 L205,378 L209,378 L211,375 L217,376 L228,375 L232,371 L236,362 L236,361 L234,362 L233,361 L233,362 L236,361 L234,360 L234,357 L229,360 L228,358 L226,359 L228,358 L228,359 L230,360 L232,357 L230,355 L227,356 L230,355 L226,352 L228,352 L228,350 L226,351 L229,350 L228,349 L224,345 L228,347 L227,342 L218,340 L215,335 L214,336 L213,335 L211,336 L215,334 L214,328 L212,327 L211,324 L213,323 L212,315 L213,308 L212,305 L214,300 L212,295 L199,288 L201,281 L195,277 L193,273 L186,272 L181,274 L179,271 L180,274 L184,271 L193,271 L195,273 L196,276 L201,279 L203,282 L201,287 L206,288 L212,292 L214,292 L212,293 L217,299 L215,304 L221,313 L228,316 L232,316 L235,318 L237,317 L237,318 L242,320 L245,319 L246,316 L249,315 L255,316 L254,314 L256,317 L257,314 L257,317 L258,317 L258,315 L258,317 L260,315 L260,318 L262,316 L261,319 L268,318 L297,331 L301,331 L304,324 L303,319 L309,313 L315,311 L314,301 L319,287 L321,277 L325,270 L331,268 L337,270 L342,274 L348,261 L349,260 L346,254 L350,245 L348,221 L343,223 L342,220 L336,216 L335,212 L331,213 L328,210 L328,206 L319,201 L315,202 L311,199 L306,199 L303,195 L297,194 L290,188 L283,180 L278,160 L258,154 L255,155 L247,155 L242,148 L225,146 L214,141 L200,142 L197,139 L195,135 L190,128 L186,127 L182,121 L179,122 L174,122 L171,116 L167,111 L165,98 L158,85 L160,82 L170,78 L174,75 L179,62 L186,62 L189,60 L192,60 L197,65 L202,69 L205,69 L208,50Z" },
  alajuela: { n: "Alajuela", x: 420, y: 225, d: "M527,136 L517,135 L514,137 L512,135 L513,133 L508,132 L506,129 L504,128 L504,126 L508,125 L510,120 L507,110 L503,109 L502,107 L498,105 L490,104 L488,99 L483,96 L481,98 L479,97 L475,89 L471,88 L473,81 L469,75 L463,80 L457,81 L451,86 L442,84 L432,73 L409,64 L406,58 L397,62 L376,49 L309,90 L208,50 L205,69 L202,69 L197,65 L192,60 L189,60 L186,62 L179,62 L174,75 L170,78 L160,82 L158,85 L165,98 L167,111 L171,116 L174,122 L179,122 L182,121 L186,127 L190,128 L195,135 L197,139 L200,142 L214,141 L225,146 L242,148 L247,155 L255,155 L258,154 L278,160 L283,180 L290,188 L297,194 L303,195 L306,199 L311,199 L315,202 L319,201 L328,206 L328,210 L331,213 L335,212 L336,216 L342,220 L343,223 L348,221 L350,245 L346,254 L349,260 L348,261 L342,274 L347,281 L357,288 L371,282 L374,283 L381,291 L383,296 L376,311 L379,313 L379,330 L385,342 L389,344 L391,353 L407,354 L411,359 L412,364 L411,369 L404,372 L396,381 L387,381 L384,384 L381,392 L377,393 L375,396 L375,401 L377,405 L398,407 L400,413 L408,417 L411,415 L409,414 L412,411 L414,411 L414,407 L417,407 L415,403 L418,404 L418,402 L419,403 L420,400 L424,398 L425,399 L428,393 L429,394 L433,393 L437,391 L438,389 L446,390 L450,388 L452,390 L453,387 L458,387 L458,385 L464,388 L466,387 L471,391 L477,392 L487,387 L497,386 L499,388 L504,385 L506,382 L509,382 L511,377 L514,378 L517,374 L519,375 L517,374 L515,376 L515,374 L516,373 L515,369 L522,365 L522,357 L526,338 L525,309 L525,195 L527,136Z" },
  heredia: { n: "Heredia", x: 565, y: 215, d: "M527,136 L525,195 L525,309 L526,338 L522,357 L522,365 L515,369 L516,373 L515,374 L515,376 L517,374 L520,376 L522,375 L524,377 L527,376 L530,378 L534,376 L539,378 L545,378 L548,375 L556,376 L557,373 L558,373 L562,369 L565,369 L566,362 L569,360 L569,356 L564,349 L564,343 L568,343 L572,339 L577,338 L579,329 L578,323 L581,317 L597,308 L604,301 L611,296 L617,285 L615,281 L616,273 L615,272 L616,268 L614,265 L615,263 L607,248 L609,241 L613,238 L614,235 L617,236 L621,231 L619,227 L622,222 L621,221 L621,219 L619,217 L619,210 L617,205 L621,196 L620,193 L617,190 L619,184 L619,177 L623,177 L634,174 L634,169 L639,162 L640,161 L646,163 L656,163 L654,160 L647,155 L647,152 L650,151 L647,145 L641,141 L633,141 L630,146 L619,148 L612,156 L604,155 L592,159 L591,155 L582,153 L581,148 L572,143 L566,134 L563,135 L562,140 L556,138 L554,140 L554,143 L552,144 L547,143 L543,139 L536,142 L534,140 L534,136 L527,136Z" },
  sanjose: { n: "San José", x: 590, y: 500, d: "M519,375 L517,374 L514,378 L511,377 L509,382 L506,382 L504,385 L499,388 L497,386 L487,387 L477,392 L471,391 L466,387 L464,388 L460,385 L458,385 L458,387 L453,387 L450,390 L450,388 L446,390 L438,389 L437,391 L433,393 L429,394 L428,393 L425,399 L424,398 L420,400 L419,403 L418,402 L418,404 L415,403 L417,407 L414,407 L414,411 L412,411 L410,413 L410,416 L407,417 L403,420 L403,424 L408,423 L410,430 L414,430 L416,433 L411,438 L404,437 L402,439 L401,447 L404,453 L403,461 L404,465 L411,472 L412,483 L416,488 L424,490 L443,488 L444,493 L447,495 L458,481 L456,475 L458,472 L465,473 L479,472 L484,468 L490,472 L498,475 L507,475 L513,478 L523,475 L529,476 L532,477 L534,481 L534,484 L532,484 L531,489 L535,493 L537,496 L537,497 L544,493 L550,496 L551,506 L551,508 L546,510 L550,509 L559,520 L570,527 L571,530 L577,533 L580,540 L585,545 L591,544 L595,538 L600,539 L604,552 L611,558 L618,560 L615,567 L616,582 L623,588 L633,593 L641,594 L647,587 L657,593 L669,616 L681,621 L686,628 L700,633 L704,636 L710,636 L717,631 L719,626 L720,620 L723,615 L724,616 L725,615 L726,613 L723,609 L725,606 L722,605 L722,602 L721,601 L720,603 L716,600 L713,601 L712,597 L710,599 L710,598 L713,591 L715,583 L720,581 L724,574 L726,567 L732,559 L738,551 L732,547 L722,527 L720,518 L715,513 L707,510 L702,505 L682,496 L677,489 L671,489 L664,498 L658,497 L657,496 L653,498 L651,496 L645,495 L641,489 L642,486 L640,482 L636,482 L616,477 L617,470 L614,463 L606,464 L604,463 L601,458 L595,460 L594,456 L589,455 L587,451 L586,443 L578,441 L578,434 L576,434 L574,430 L564,436 L560,435 L552,436 L547,434 L550,425 L563,418 L565,413 L568,412 L567,410 L573,405 L572,403 L562,400 L560,397 L565,398 L568,396 L567,394 L570,391 L571,387 L570,384 L581,383 L583,381 L585,381 L587,379 L592,380 L597,379 L605,375 L607,376 L612,374 L614,371 L608,353 L604,348 L595,343 L589,329 L588,322 L592,312 L580,318 L577,338 L572,339 L568,343 L564,343 L564,349 L569,356 L569,360 L566,362 L565,369 L562,369 L558,373 L557,373 L556,376 L548,375 L545,378 L539,378 L534,376 L530,378 L527,376 L524,377 L522,375 L520,376 L519,375Z" },
  cartago: { n: "Cartago", x: 690, y: 450, d: "M715,513 L713,496 L709,488 L737,463 L739,450 L742,445 L765,414 L763,408 L764,400 L762,395 L760,382 L764,381 L766,375 L771,371 L685,370 L635,348 L588,323 L595,343 L604,348 L608,353 L614,371 L612,374 L607,376 L605,375 L597,379 L592,380 L587,379 L585,381 L583,381 L581,383 L570,384 L571,387 L570,391 L567,394 L568,396 L565,398 L560,397 L562,400 L572,403 L573,405 L567,410 L568,412 L565,413 L563,418 L550,425 L548,430 L547,434 L549,435 L556,435 L564,436 L574,430 L576,434 L578,434 L578,441 L586,443 L587,451 L589,455 L594,456 L595,460 L601,458 L604,463 L606,464 L614,463 L617,470 L616,477 L636,482 L640,482 L642,486 L641,489 L645,495 L651,496 L653,498 L657,496 L658,497 L664,498 L671,489 L677,489 L682,496 L702,505 L707,510 L715,513Z" },
  limon: { n: "Limón", x: 790, y: 330, d: "M592,312 L588,323 L635,348 L685,370 L771,371 L766,375 L764,381 L760,382 L762,395 L764,400 L763,408 L765,414 L742,445 L739,450 L737,463 L709,488 L713,496 L715,513 L720,518 L722,527 L732,547 L744,553 L746,556 L747,560 L754,555 L760,556 L762,549 L767,545 L773,548 L781,555 L790,558 L794,564 L799,565 L809,563 L820,576 L842,585 L842,595 L846,602 L846,608 L860,611 L865,614 L868,631 L871,636 L875,639 L880,637 L880,521 L907,513 L905,509 L903,510 L903,507 L900,508 L898,506 L898,502 L900,500 L899,497 L897,498 L895,494 L897,490 L897,486 L902,486 L901,483 L903,478 L905,477 L907,481 L912,480 L913,484 L917,485 L921,483 L926,488 L930,487 L933,489 L934,487 L935,487 L937,490 L935,493 L938,494 L939,496 L941,496 L942,499 L945,499 L946,500 L946,503 L948,503 L949,500 L951,503 L947,505 L951,507 L952,511 L957,512 L956,515 L961,510 L962,514 L966,515 L969,512 L972,514 L975,512 L976,507 L977,503 L976,498 L977,496 L983,496 L988,502 L991,500 L990,497 L987,495 L986,491 L979,488 L972,480 L971,474 L963,472 L957,474 L952,471 L948,473 L940,471 L934,466 L930,468 L927,467 L920,458 L915,449 L916,441 L914,440 L910,444 L906,443 L900,438 L881,413 L877,410 L880,412 L857,381 L853,375 L853,370 L855,370 L853,368 L854,366 L847,363 L843,364 L843,362 L842,363 L838,363 L839,367 L838,365 L836,366 L831,364 L822,354 L808,333 L744,256 L727,228 L710,194 L695,150 L692,130 L680,106 L675,99 L669,94 L666,95 L666,92 L660,91 L660,92 L662,93 L666,99 L665,100 L666,102 L664,103 L668,106 L666,116 L670,126 L668,132 L660,136 L655,134 L653,136 L641,139 L640,141 L643,141 L647,145 L650,151 L647,152 L647,155 L654,160 L656,163 L646,163 L640,161 L639,162 L634,169 L634,174 L623,177 L619,177 L619,184 L617,190 L620,193 L621,196 L617,205 L619,210 L619,217 L621,219 L621,221 L622,222 L619,227 L621,231 L617,236 L614,235 L613,238 L609,241 L607,248 L609,253 L613,259 L615,263 L614,265 L616,268 L615,272 L616,273 L615,281 L617,285 L611,296 L604,301 L592,312Z" },
  puntarenas: { n: "Puntarenas", x: 740, y: 700, d: "M811,775 L810,776 L810,774 L812,770 L810,774 L811,779 L815,786 L821,790 L819,787 L816,786 L816,784 L815,783 L813,780 L815,781 L815,779 L816,778 L815,776 L817,774 L814,775 L812,773 L811,775Z M261,319 L261,320 L264,320 L262,321 L264,322 L263,325 L260,325 L261,327 L266,328 L270,325 L276,328 L282,336 L293,340 L295,346 L299,344 L297,347 L293,346 L292,347 L297,349 L299,348 L304,355 L308,354 L306,356 L312,359 L317,363 L319,364 L320,362 L319,364 L322,366 L323,364 L322,364 L323,363 L323,366 L325,364 L323,365 L327,368 L327,366 L329,369 L331,368 L329,369 L331,370 L331,368 L333,368 L331,369 L335,371 L335,368 L337,368 L335,369 L336,371 L340,370 L338,368 L340,369 L339,368 L341,368 L341,366 L341,369 L339,368 L340,370 L341,370 L340,371 L343,371 L344,369 L342,372 L345,372 L345,370 L346,372 L346,369 L349,368 L346,368 L346,371 L352,371 L337,372 L327,374 L345,372 L355,375 L359,377 L358,381 L360,384 L366,389 L366,387 L369,388 L369,387 L369,388 L367,388 L367,390 L366,390 L366,392 L362,392 L363,394 L361,398 L368,403 L371,406 L370,408 L376,413 L383,422 L391,436 L389,443 L384,446 L381,452 L379,452 L379,454 L377,456 L379,463 L376,469 L379,469 L380,470 L381,469 L382,470 L383,472 L380,475 L391,481 L393,484 L391,486 L394,489 L416,505 L417,508 L436,504 L475,516 L486,517 L498,521 L501,521 L500,519 L489,517 L490,516 L493,518 L499,517 L496,518 L500,519 L501,522 L505,523 L506,523 L502,518 L502,516 L500,515 L501,515 L505,521 L506,520 L505,521 L507,523 L511,524 L507,523 L510,521 L509,522 L520,526 L519,527 L519,528 L513,525 L509,525 L510,525 L518,529 L524,534 L524,531 L524,534 L522,535 L524,536 L525,541 L522,542 L522,544 L525,543 L528,544 L530,547 L530,549 L531,548 L533,549 L533,547 L535,546 L537,552 L537,550 L539,550 L545,551 L579,564 L594,572 L617,590 L618,593 L617,595 L619,595 L620,596 L627,598 L629,600 L632,600 L633,602 L636,603 L642,611 L643,611 L642,611 L642,615 L645,615 L651,617 L653,621 L661,627 L663,631 L662,632 L666,633 L665,635 L673,640 L676,645 L676,646 L673,644 L671,641 L670,641 L679,655 L679,665 L681,669 L681,683 L685,682 L691,688 L692,687 L691,689 L688,687 L689,689 L695,691 L691,692 L697,693 L693,694 L686,692 L685,694 L686,697 L690,699 L694,704 L695,704 L695,701 L696,704 L696,705 L690,705 L689,706 L692,710 L686,710 L681,712 L677,715 L673,720 L675,720 L677,724 L678,724 L680,723 L684,717 L684,719 L683,724 L682,726 L680,727 L677,726 L675,728 L676,737 L674,738 L674,745 L672,749 L668,751 L666,749 L662,749 L657,751 L654,755 L655,762 L650,765 L651,768 L649,770 L649,777 L652,782 L654,781 L660,783 L661,784 L660,784 L662,787 L674,798 L674,800 L687,810 L691,818 L696,821 L698,824 L719,821 L735,825 L747,831 L745,829 L746,829 L752,832 L748,831 L763,836 L775,843 L777,843 L781,840 L780,831 L783,827 L779,822 L783,816 L777,806 L779,794 L777,795 L778,794 L779,797 L777,799 L778,796 L777,797 L777,796 L773,794 L767,786 L766,787 L760,784 L753,784 L752,781 L750,782 L746,779 L735,767 L736,764 L736,760 L732,757 L733,757 L729,754 L728,752 L726,753 L726,750 L725,751 L726,749 L725,747 L724,748 L724,750 L722,750 L721,746 L722,742 L726,742 L727,740 L730,741 L733,741 L737,744 L741,742 L744,737 L747,738 L747,737 L748,739 L752,736 L751,734 L753,734 L754,737 L755,736 L759,738 L761,737 L763,739 L766,740 L764,740 L765,742 L767,741 L764,743 L767,743 L765,747 L766,753 L773,756 L776,761 L781,759 L788,760 L793,769 L794,765 L796,765 L800,769 L802,768 L802,769 L804,769 L809,771 L811,767 L808,765 L811,764 L820,773 L822,777 L826,776 L828,779 L827,778 L824,780 L821,780 L821,782 L817,783 L817,786 L822,788 L822,790 L827,791 L830,790 L835,791 L838,794 L835,791 L831,791 L830,793 L829,790 L827,792 L831,795 L831,798 L831,797 L830,798 L832,798 L831,799 L832,800 L829,801 L828,799 L829,803 L828,804 L826,803 L827,806 L822,800 L823,796 L821,798 L818,792 L821,800 L830,811 L835,821 L832,825 L829,832 L822,837 L819,841 L819,846 L829,856 L850,867 L864,877 L870,883 L881,900 L884,910 L890,921 L890,928 L888,931 L886,930 L886,935 L888,940 L890,941 L893,938 L891,935 L894,930 L892,922 L894,921 L888,910 L887,904 L889,902 L887,901 L887,895 L885,896 L883,892 L880,891 L882,882 L879,879 L878,873 L875,874 L874,871 L871,871 L869,868 L864,873 L862,868 L860,868 L861,866 L854,864 L855,862 L853,860 L848,861 L846,855 L848,852 L859,848 L864,843 L866,844 L870,840 L875,832 L880,829 L881,825 L886,827 L899,824 L908,812 L910,805 L908,793 L913,787 L909,780 L911,776 L908,773 L911,773 L910,766 L900,754 L901,751 L900,748 L896,748 L893,744 L893,740 L890,740 L889,737 L885,736 L884,733 L887,730 L885,729 L887,726 L894,726 L893,721 L900,717 L901,714 L895,712 L895,710 L901,703 L913,701 L916,697 L920,696 L927,695 L933,691 L935,687 L945,683 L943,675 L936,670 L937,667 L936,664 L925,658 L919,659 L918,655 L914,654 L914,651 L909,650 L903,646 L902,643 L899,644 L897,642 L894,634 L892,634 L882,638 L880,637 L875,639 L871,636 L868,631 L865,614 L860,611 L846,608 L846,602 L842,595 L842,585 L820,576 L809,563 L799,565 L794,564 L790,558 L781,555 L773,548 L767,545 L762,549 L760,556 L754,555 L747,560 L746,556 L744,553 L738,551 L732,557 L720,581 L715,583 L713,591 L710,598 L710,599 L712,597 L713,601 L716,600 L720,603 L721,601 L722,602 L722,605 L725,606 L723,609 L726,613 L725,615 L724,616 L723,615 L720,620 L719,626 L717,631 L710,636 L704,636 L700,633 L686,628 L681,621 L669,616 L657,593 L647,587 L641,594 L633,593 L623,588 L616,582 L615,567 L618,560 L611,558 L604,552 L600,539 L595,538 L591,544 L585,545 L580,540 L577,533 L571,530 L570,527 L559,520 L550,509 L546,510 L551,508 L551,506 L550,496 L544,493 L537,497 L537,496 L535,493 L531,489 L532,484 L534,484 L534,481 L532,477 L529,476 L523,475 L513,478 L507,475 L498,475 L490,472 L484,468 L479,472 L465,473 L458,472 L456,475 L458,481 L447,495 L444,493 L443,488 L424,490 L416,488 L412,483 L411,472 L404,465 L403,461 L404,453 L401,447 L402,439 L404,437 L411,438 L416,433 L414,430 L410,430 L408,423 L403,424 L403,420 L407,417 L400,413 L398,407 L377,405 L375,401 L375,396 L377,393 L381,392 L387,381 L396,381 L404,372 L411,369 L412,364 L411,359 L407,354 L391,353 L389,344 L385,342 L379,330 L379,313 L376,311 L383,296 L381,291 L374,283 L371,282 L357,288 L347,281 L342,274 L337,270 L331,268 L325,270 L321,277 L319,287 L314,301 L315,311 L309,313 L303,319 L304,324 L301,331 L297,331 L268,318 L261,319Z M217,443 L218,446 L221,448 L217,445 L224,457 L225,462 L241,479 L242,489 L245,492 L248,492 L250,494 L249,495 L251,496 L252,493 L256,492 L257,488 L261,479 L261,476 L264,468 L267,464 L271,463 L272,460 L281,457 L285,453 L283,451 L279,451 L277,447 L278,448 L280,443 L286,440 L285,440 L287,440 L285,439 L289,436 L289,440 L286,441 L289,443 L291,445 L296,446 L298,445 L296,438 L300,437 L302,438 L304,436 L303,433 L307,430 L305,429 L306,427 L312,426 L312,422 L311,424 L308,421 L312,420 L312,423 L314,421 L318,422 L319,419 L322,417 L314,415 L308,418 L306,418 L306,417 L303,414 L302,416 L300,416 L302,412 L305,412 L306,410 L310,410 L310,408 L306,407 L306,404 L301,402 L303,396 L308,395 L306,388 L303,389 L302,388 L302,387 L295,384 L293,385 L292,383 L289,385 L288,384 L280,384 L276,378 L272,377 L268,374 L266,374 L266,375 L266,374 L264,375 L264,376 L262,376 L263,375 L262,375 L260,376 L259,375 L262,374 L260,373 L261,373 L257,375 L250,372 L249,374 L248,373 L250,372 L249,369 L245,369 L237,362 L234,364 L232,371 L228,375 L217,376 L211,375 L209,378 L205,378 L204,381 L206,384 L203,388 L203,391 L219,396 L225,408 L232,409 L226,422 L227,430 L223,437 L217,443Z M256,338 L254,338 L249,340 L248,336 L245,337 L244,338 L244,336 L240,338 L242,336 L238,336 L237,333 L238,335 L240,335 L239,334 L240,333 L239,334 L240,335 L245,336 L242,334 L244,334 L246,337 L253,335 L236,329 L227,331 L226,333 L228,336 L230,342 L238,345 L242,345 L252,343 L255,341 L256,338Z" },
};
// La Isla del Coco va en un recuadro (está a más de 500 km de la costa)
export const MAPA_COCO = { x: 35, y: 818, ancho: 120, alto: 120, d: "M60,874 L63,874 L62,877 L64,880 L67,880 L71,884 L71,887 L73,885 L73,887 L76,889 L76,892 L79,892 L82,895 L84,888 L88,884 L89,880 L93,882 L101,879 L105,874 L108,875 L109,873 L111,875 L115,869 L116,870 L117,867 L122,867 L123,868 L127,865 L130,857 L125,843 L124,841 L126,840 L123,841 L120,839 L116,843 L114,843 L111,841 L112,836 L109,835 L109,833 L106,833 L107,838 L105,838 L104,841 L102,841 L99,839 L97,841 L94,841 L94,843 L99,844 L99,847 L98,847 L97,849 L91,850 L87,849 L84,848 L82,851 L76,850 L73,852 L71,856 L66,859 L66,864 L65,865 L63,866 L65,867 L63,867 L64,870 L60,871 L60,874Z" };

// ---------- Proyección ----------
// x = 288,963 · longitud + 24 844,95 · y = −293,702 · latitud + 3 303,49
// (calculada con las siete cabeceras del mapa: el error es de menos de un punto).
export const xy = (lat, lon) => ({ x: Math.round(288.963 * lon + 24844.948), y: Math.round(-293.702 * lat + 3303.491) });

// ---------- Lo que hay en el mapa ----------
// Los puntos son aproximados. El Rincón de la Vieja, el Miravalles, Tortuguero y Cahuita se corrieron unos 3 a 4 km
// para que caigan del lado correcto de la frontera simplificada del mapa (es la que se toca en «¿en qué provincia?»).
// tipo: volcan | parque | cerro | golfo | peninsula · prov, region, cordillera: ids · mar: pacifico | caribe
export const LUGARES = {
  // 🌋 Volcanes
  arenal: { tipo: "volcan", art: "el", n: "volcán Arenal", lat: 10.463, lon: -84.703, prov: "alajuela", region: "rHuetarNorte", cordillera: "cTilaran",
    dato: "Tiene forma de cono casi perfecto. Hizo una gran erupción en 1968 y queda cerca de La Fortuna de San Carlos." },
  poas: { tipo: "volcan", art: "el", n: "volcán Poás", lat: 10.200, lon: -84.233, prov: "alajuela", region: "rCentral", cordillera: "cCentral",
    dato: "Tiene un cráter enorme con una laguna caliente adentro, y muy cerca está la laguna Botos." },
  barva: { tipo: "volcan", art: "el", n: "volcán Barva", lat: 10.135, lon: -84.100, prov: "heredia", region: "rCentral", cordillera: "cCentral",
    dato: "Está dentro del Parque Nacional Braulio Carrillo y en su cima hay lagunas rodeadas de bosque nuboso." },
  irazu: { tipo: "volcan", art: "el", n: "volcán Irazú", lat: 9.979, lon: -83.852, prov: "cartago", region: "rCentral", cordillera: "cCentral",
    dato: "Es el volcán más alto de Costa Rica: mide más de 3 400 metros. Entre 1963 y 1965 echó ceniza sobre San José y Cartago." },
  turrialba: { tipo: "volcan", art: "el", n: "volcán Turrialba", lat: 10.025, lon: -83.767, prov: "cartago", region: "rCentral", cordillera: "cCentral",
    dato: "Está al lado del Irazú. En los últimos años ha echado ceniza que a veces llega hasta el Valle Central." },
  rincon: { tipo: "volcan", art: "el", n: "volcán Rincón de la Vieja", lat: 10.805, lon: -85.385, prov: "guanacaste", region: "rChorotega", cordillera: "cGuanacaste",
    dato: "Tiene fumarolas y pailas de barro que hierven, dentro de un parque nacional." },
  miravalles: { tipo: "volcan", art: "el", n: "volcán Miravalles", lat: 10.720, lon: -85.177, prov: "guanacaste", region: "rChorotega", cordillera: "cGuanacaste",
    dato: "Cerca de él se aprovecha el calor de la tierra para producir electricidad: es energía geotérmica." },
  orosi: { tipo: "volcan", art: "el", n: "volcán Orosí", lat: 10.980, lon: -85.473, prov: "guanacaste", region: "rChorotega", cordillera: "cGuanacaste",
    dato: "Está en el norte de Guanacaste, cerca de la frontera con Nicaragua, en el Área de Conservación Guanacaste." },
  // 🌳 Parques nacionales
  tortuguero: { tipo: "parque", art: "el", n: "Parque Nacional Tortuguero", lat: 10.52, lon: -83.52, prov: "limon", region: "rHuetarCaribe", mar: "caribe",
    dato: "Las tortugas verdes llegan a sus playas a poner huevos, y se recorre en bote por sus canales." },
  cahuita: { tipo: "parque", art: "el", n: "Parque Nacional Cahuita", lat: 9.733, lon: -82.890, prov: "limon", region: "rHuetarCaribe", mar: "caribe",
    dato: "Protege un arrecife de coral en el mar Caribe, con muchísimos peces de colores." },
  corcovado: { tipo: "parque", art: "el", n: "Parque Nacional Corcovado", lat: 8.54, lon: -83.58, prov: "puntarenas", region: "rBrunca", mar: "pacifico",
    dato: "Está en la península de Osa y es uno de los lugares con más variedad de seres vivos del mundo." },
  manuelAntonio: { tipo: "parque", art: "el", n: "Parque Nacional Manuel Antonio", lat: 9.39, lon: -84.14, prov: "puntarenas", region: "rPacificoCentral", mar: "pacifico",
    dato: "Es pequeño pero muy visitado: tiene playas blancas, monos y perezosos, cerca de Quepos." },
  santaRosa: { tipo: "parque", art: "el", n: "Parque Nacional Santa Rosa", lat: 10.84, lon: -85.62, prov: "guanacaste", region: "rChorotega", mar: "pacifico",
    dato: "Protege bosque seco, y ahí fue la batalla de Santa Rosa, el 20 de marzo de 1856." },
  paloVerde: { tipo: "parque", art: "el", n: "Parque Nacional Palo Verde", lat: 10.35, lon: -85.34, prov: "guanacaste", region: "rChorotega",
    dato: "Es un humedal junto al río Tempisque, adonde llegan muchísimas aves." },
  braulio: { tipo: "parque", art: "el", n: "Parque Nacional Braulio Carrillo", lat: 10.16, lon: -83.95,
    dato: "Es un bosque lluvioso muy grande, cerca del Valle Central; la carretera a Limón pasa por en medio." },
  coco: { tipo: "parque", art: "la", n: "Isla del Coco", e: "🏝️", x: 95, y: 856, prov: "puntarenas", mar: "pacifico",
    dato: "Está en el océano Pacífico, a más de 500 kilómetros de la costa. Es Patrimonio de la Humanidad y famosa por sus tiburones martillo." },
  // ⛰️ El punto más alto
  chirripo: { tipo: "cerro", art: "el", n: "cerro Chirripó", lat: 9.484, lon: -83.489, cordillera: "cTalamanca",
    dato: "Es el punto más alto de Costa Rica: mide unos 3 820 metros. Está en la cordillera de Talamanca." },
  // 🌊 Golfos y penínsulas
  golfoNicoya: { tipo: "golfo", art: "el", n: "golfo de Nicoya", lat: 9.954, lon: -84.94, mar: "pacifico",
    dato: "Es el golfo más grande de Costa Rica. Ahí está el puerto de Puntarenas y tiene muchas islas, como Chira y San Lucas." },
  golfoDulce: { tipo: "golfo", art: "el", n: "golfo Dulce", lat: 8.58, lon: -83.27, mar: "pacifico", region: "rBrunca",
    dato: "Está en el sur, entre la península de Osa y Golfito. A sus aguas tranquilas llegan delfines y ballenas." },
  golfoPapagayo: { tipo: "golfo", art: "el", n: "golfo de Papagayo", lat: 10.62, lon: -85.75, mar: "pacifico", region: "rChorotega",
    dato: "Está en el norte de Guanacaste y tiene playas muy visitadas." },
  penNicoya: { tipo: "peninsula", art: "la", n: "península de Nicoya", lat: 10.00, lon: -85.40, mar: "pacifico",
    dato: "Es la península más grande de Costa Rica: es parte de Guanacaste y de Puntarenas, frente al golfo de Nicoya." },
  penOsa: { tipo: "peninsula", art: "la", n: "península de Osa", lat: 8.65, lon: -83.58, mar: "pacifico", region: "rBrunca",
    dato: "Está en el sur, en el Pacífico. Ahí está el Parque Nacional Corcovado." },
};
const EMOJI = { volcan: "🌋", parque: "🌳", cerro: "⛰️", golfo: "🌊", peninsula: "🏞️" };
export const emojiDe = id => LUGARES[id]?.e || EMOJI[LUGARES[id]?.tipo] || "📍";

// 🏞️ Ríos (dibujo aproximado). llega: pacifico | caribe | sanjuan
export const RIOS = {
  rioTempisque: { art: "el", n: "río Tempisque", llega: "pacifico", puntos: [[10.90, -85.45], [10.70, -85.53], [10.45, -85.56], [10.33, -85.36], [10.20, -85.24]],
    dato: "Es el río más importante de Guanacaste. Pasa junto al Parque Nacional Palo Verde y llega al golfo de Nicoya, en el Pacífico." },
  rioTarcoles: { art: "el", n: "río Tárcoles", llega: "pacifico", puntos: [[9.95, -84.25], [9.90, -84.40], [9.85, -84.52], [9.78, -84.63]],
    dato: "Lleva el agua de los ríos del Valle Central hasta el Pacífico. Es famoso por los cocodrilos que se ven desde el puente." },
  rioTerraba: { art: "el", n: "río Grande de Térraba", llega: "pacifico", puntos: [[9.40, -83.72], [9.25, -83.50], [9.10, -83.35], [9.00, -83.42], [8.92, -83.58]],
    dato: "Está en el sur. Donde llega al Pacífico hay grandes manglares: el humedal Térraba-Sierpe." },
  rioReventazon: { art: "el", n: "río Reventazón", llega: "caribe", puntos: [[9.80, -83.86], [9.85, -83.72], [9.95, -83.62], [10.12, -83.50], [10.30, -83.36]],
    dato: "Nace en Cartago y llega al mar Caribe. Tiene una gran planta hidroeléctrica que da electricidad." },
  rioPacuare: { art: "el", n: "río Pacuare", llega: "caribe", puntos: [[9.68, -83.62], [9.85, -83.50], [10.05, -83.40], [10.22, -83.27]],
    dato: "Baja de las montañas hacia el mar Caribe y es famoso por el rafting: bajar los rápidos en balsa." },
  rioSarapiqui: { art: "el", n: "río Sarapiquí", llega: "sanjuan", puntos: [[10.20, -84.15], [10.35, -84.05], [10.45, -84.02], [10.60, -84.00], [10.72, -83.98]],
    dato: "Corre hacia el norte, por la región Huetar Norte, y llega al río San Juan." },
  rioSanCarlos: { art: "el", n: "río San Carlos", llega: "sanjuan", puntos: [[10.30, -84.40], [10.45, -84.37], [10.62, -84.30], [10.80, -84.20]],
    dato: "Atraviesa las llanuras del norte y llega al río San Juan." },
  rioSanJuan: { art: "el", n: "río San Juan", llega: "caribe", puntos: [[11.10, -84.70], [11.00, -84.45], [10.90, -84.20], [10.78, -83.95], [10.93, -83.68]],
    dato: "Por su orilla pasa parte de la frontera con Nicaragua, y llega al mar Caribe." },
};
export const LLEGA = { pacifico: "al océano Pacífico", caribe: "al mar Caribe", sanjuan: "al río San Juan" };

// ⛰️ Cordilleras (dibujo aproximado de su eje)
export const CORDILLERAS = {
  cGuanacaste: { art: "la", n: "cordillera de Guanacaste", puntos: [[11.02, -85.55], [10.85, -85.33], [10.70, -85.10], [10.58, -84.98]],
    donde: "está en el norte, entre Guanacaste y Alajuela", dato: "Tiene volcanes como el Orosí, el Rincón de la Vieja y el Miravalles." },
  cTilaran: { art: "la", n: "cordillera de Tilarán", puntos: [[10.55, -84.92], [10.40, -84.82], [10.25, -84.68], [10.12, -84.50]],
    donde: "está entre el lago Arenal y Monteverde", dato: "Ahí están el volcán Arenal y Monteverde." },
  cCentral: { art: "la", n: "cordillera Volcánica Central", puntos: [[10.25, -84.35], [10.15, -84.10], [10.02, -83.88], [10.05, -83.72]],
    donde: "rodea el Valle Central por el norte", dato: "Tiene los volcanes Poás, Barva, Irazú y Turrialba." },
  cTalamanca: { art: "la", n: "cordillera de Talamanca", puntos: [[9.82, -83.80], [9.55, -83.55], [9.30, -83.20], [9.05, -82.90]],
    donde: "está en el sur y sigue hasta Panamá", dato: "Es la más alta del país: ahí está el cerro Chirripó." },
};

// 🗺️ Regiones (las seis regiones de planificación)
export const REGIONES = {
  rCentral: { art: "la", n: "región Central", donde: "está en el centro del país, en el Valle Central",
    pista: "Es donde vive más gente, tiene un clima templado y ahí está la capital. Se cultiva café, y en Cartago, papa y verduras." },
  rChorotega: { art: "la", n: "región Chorotega", donde: "es la provincia de Guanacaste, en el noroeste",
    pista: "Tiene un verano largo y seco, con bosque seco. Hay ganado, arroz, caña de azúcar y playas muy visitadas." },
  rPacificoCentral: { art: "la", n: "región Pacífico Central", donde: "está en la costa del Pacífico, alrededor de Puntarenas y Quepos",
    pista: "Está en la costa, alrededor del puerto de Puntarenas. Hay pesca, el puerto de Caldera y playas como Jacó." },
  rBrunca: { art: "la", n: "región Brunca", donde: "está en el sur, cerca de la frontera con Panamá",
    pista: "Está en el sur del país. Ahí está la península de Osa, y se cultiva piña, café y palma." },
  rHuetarCaribe: { art: "la", n: "región Huetar Caribe", donde: "es la provincia de Limón, en el Caribe",
    pista: "Llueve mucho, se cultiva banano y ahí están los muelles de Moín, por donde sale mucha fruta en barco." },
  rHuetarNorte: { art: "la", n: "región Huetar Norte", donde: "está en el norte, en las llanuras cerca de Nicaragua",
    pista: "Está en el norte, con grandes llanuras. Se cultiva piña y naranja, hay ganado de leche y muchos turistas visitan La Fortuna." },
};

// Provincias: para «el más…» y para la costa de cada una
export const PROVINCIAS = {
  guanacaste: { art: "la", n: "provincia de Guanacaste", corto: "Guanacaste", mar: "pacifico", dato: "Es tierra de sabaneros, con playas y bosque seco." },
  alajuela: { art: "la", n: "provincia de Alajuela", corto: "Alajuela", dato: "Llega desde el Valle Central hasta la frontera con Nicaragua." },
  heredia: { art: "la", n: "provincia de Heredia", corto: "Heredia", dato: "Le dicen «la ciudad de las flores». Es la provincia más pequeña." },
  sanjose: { art: "la", n: "provincia de San José", corto: "San José", dato: "Ahí está la capital de Costa Rica." },
  cartago: { art: "la", n: "provincia de Cartago", corto: "Cartago", dato: "Fue la primera capital y ahí están los volcanes Irazú y Turrialba." },
  limon: { art: "la", n: "provincia de Limón", corto: "Limón", mar: "caribe", dato: "Tiene toda la costa del mar Caribe." },
  puntarenas: { art: "la", n: "provincia de Puntarenas", corto: "Puntarenas", mar: "pacifico",
    dato: "Es la más grande: va desde el golfo de Nicoya hasta la frontera con Panamá, y la Isla del Coco también es de Puntarenas." },
};
// Provincias que comparten frontera (para el «¡Casi!»)
export const VECINAS = {
  guanacaste: ["alajuela", "puntarenas"], alajuela: ["guanacaste", "heredia", "sanjose", "puntarenas"], heredia: ["alajuela", "sanjose", "limon"],
  sanjose: ["alajuela", "heredia", "cartago", "limon", "puntarenas"], cartago: ["sanjose", "limon"], limon: ["heredia", "sanjose", "cartago", "puntarenas"],
  puntarenas: ["guanacaste", "alajuela", "sanjose", "limon"],
};
export const MARES = { pacifico: { art: "el", n: "océano Pacífico" }, caribe: { art: "el", n: "mar Caribe" } };

// ---------- Ayudas de palabras ----------
export const cosa = id => LUGARES[id] || RIOS[id] || CORDILLERAS[id] || REGIONES[id] || PROVINCIAS[id] || MARES[id];
export const conArt = id => `${cosa(id).art} ${cosa(id).n}`;
export const de = id => (cosa(id).art === "el" ? `del ${cosa(id).n}` : `de ${conArt(id)}`);
export const ese = id => (cosa(id).art === "el" ? "Ese es" : "Esa es");
export const tocalo = id => (cosa(id).art === "el" ? "Tocalo" : "Tocala");
export const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
export const nombreCorto = id => cap(cosa(id).corto || cosa(id).n);

// ---------- Posiciones y rumbos ----------
const centro = puntos => { const ps = puntos.map(([la, lo]) => xy(la, lo)); return { x: ps.reduce((a, p) => a + p.x, 0) / ps.length, y: ps.reduce((a, p) => a + p.y, 0) / ps.length }; };
/** Dónde está algo en el mapa (en unidades del viewBox). */
export function pos(id) {
  const l = LUGARES[id];
  if (l) return l.x !== undefined ? { x: l.x, y: l.y } : xy(l.lat, l.lon);
  if (RIOS[id] || CORDILLERAS[id]) return centro((RIOS[id] || CORDILLERAS[id]).puntos);
  if (MAPA_PROVINCIAS[id]) return { x: MAPA_PROVINCIAS[id].x, y: MAPA_PROVINCIAS[id].y };
  return null;
}
export const distancia = (a, b) => { const p = pos(a), q = pos(b); return Math.hypot(p.x - q.x, p.y - q.y); };
/** Camino SVG de una línea de puntos [lat, lon]. */
export const camino = puntos => puntos.map(([la, lo], i) => { const p = xy(la, lo); return `${i ? "L" : "M"}${p.x},${p.y}`; }).join(" ");
const RUMBOS = ["este", "noreste", "norte", "noroeste", "oeste", "suroeste", "sur", "sureste"];
/** Hacia dónde queda «hacia» visto desde «desde» (el norte está arriba en el mapa). */
export function rumbo(desde, hacia) {
  const p = pos(desde), q = pos(hacia);
  const ang = Math.atan2(-(q.y - p.y), q.x - p.x);
  return RUMBOS[((Math.round(ang / (Math.PI / 4)) % 8) + 8) % 8];
}

// ---------- Generadores ----------
const barajar = (arr, rnd) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const azar = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

const VOLC_FAMOSOS = ["arenal", "poas", "irazu", "rincon"];
const PARQ_FAMOSOS = ["tortuguero", "corcovado", "manuelAntonio", "santaRosa", "cahuita", "coco"];
const VOLCANES = Object.keys(LUGARES).filter(id => LUGARES[id].tipo === "volcan");
const PARQUES = Object.keys(LUGARES).filter(id => LUGARES[id].tipo === "parque");
const COSTAS = Object.keys(LUGARES).filter(id => ["golfo", "peninsula"].includes(LUGARES[id].tipo));
const CON_PROV = [...VOLCANES, ...PARQUES].filter(id => LUGARES[id].prov && id !== "coco");
// La Isla del Coco va en un recuadro con su nombre: solo sale en los escalones fáciles
const QUE_ES = [...VOLCANES, ...PARQUES.filter(id => id !== "coco"), "chirripo"];
const MEZCLA = [...QUE_ES, ...COSTAS];
const CON_REGION = Object.keys(LUGARES).filter(id => LUGARES[id].region);
const CON_MAR = [...Object.keys(LUGARES).filter(id => LUGARES[id].mar && id !== "coco"), "guanacaste", "puntarenas", "limon"];

/** Escoge «n» cosas del montón con la meta adentro, separadas por lo menos «minDist» en el mapa. */
function separados(pool, n, minDist, rnd, meta = azar(pool, rnd)) {
  for (let intento = 0; intento < 60; intento++) {
    const elegidos = [meta];
    for (const id of barajar(pool.filter(x => x !== meta), rnd)) {
      if (elegidos.length >= n) break;
      if (elegidos.every(e => distancia(e, id) >= minDist)) elegidos.push(id);
    }
    if (elegidos.length >= Math.min(n, 3)) return { meta, blancos: barajar(elegidos, rnd) };
    meta = azar(pool, rnd);
  }
  return null;
}

function tocarLugar({ pool, n, minDist }, rnd) {
  const { meta, blancos } = separados(pool, n, minDist, rnd);
  return {
    tipo: "tocar", capa: "lugares", meta, blancos, minDist,
    instr: `¿Dónde está <b>${conArt(meta)}</b>? ${tocalo(meta)} en el mapa.`,
    voz: `¿Dónde está ${conArt(meta)}? ${tocalo(meta)} en el mapa.`,
    explica: `${cap(conArt(meta))}: ${cosa(meta).dato}`,
  };
}

function tocarRio(rnd) {
  const { meta, blancos } = separados(Object.keys(RIOS), 4, 90, rnd);
  return {
    tipo: "tocar", capa: "rios", meta, blancos, minDist: 90,
    instr: `¿Cuál es <b>${conArt(meta)}</b>? ${tocalo(meta)} en el mapa.`,
    voz: `¿Cuál es ${conArt(meta)}? ${tocalo(meta)} en el mapa.`,
    explica: `${cap(conArt(meta))}: ${cosa(meta).dato}`,
  };
}

function tocarCordillera(rnd) {
  const meta = azar(Object.keys(CORDILLERAS), rnd);
  return {
    tipo: "tocar", capa: "cordilleras", meta, blancos: Object.keys(CORDILLERAS), minDist: 0,
    instr: `¿Cuál es <b>${conArt(meta)}</b>? ${tocalo(meta)} en el mapa.`,
    voz: `¿Cuál es ${conArt(meta)}? ${tocalo(meta)} en el mapa.`,
    explica: `${cap(conArt(meta))} ${cosa(meta).donde}. ${cosa(meta).dato}`,
  };
}

function enProvincia(rnd) {
  const lugar = azar(CON_PROV, rnd), meta = LUGARES[lugar].prov;
  return {
    tipo: "provincia", lugar, meta, mostrarNombre: true, ocultarProvincias: true,
    instr: `¿En qué provincia está <b>${conArt(lugar)}</b>? Tocá la provincia.`,
    voz: `¿En qué provincia está ${conArt(lugar)}? Tocá la provincia en el mapa.`,
    explica: `${cap(conArt(lugar))} está en ${PROVINCIAS[meta].corto}. ${cosa(lugar).dato}`,
  };
}

/** Pregunta de opciones. «opciones»: ids; «por»: qué decir si escogió una que no es (una pista, no la respuesta). */
const opcionesDe = (ids, por, texto = nombreCorto) => ids.map(id => ({ id, txt: texto(id), por: por(id) }));

function queMar(rnd) {
  const lugar = azar(CON_MAR, rnd), mar = cosa(lugar).mar, esProv = !!PROVINCIAS[lugar];
  const pregunta = esProv ? `¿${cap(conArt(lugar))} tiene costa en el océano Pacífico o en el mar Caribe?`
    : `¿${cap(conArt(lugar))} queda del lado del océano Pacífico o del mar Caribe?`;
  return {
    tipo: "opciones", ocultarMares: true, [esProv ? "provMarcada" : "lugar"]: lugar, mostrarNombre: true,
    instr: pregunta, voz: pregunta,
    opciones: opcionesDe(["pacifico", "caribe"], () => "Fijate en el mapa: el océano Pacífico está al oeste y al sur, y el mar Caribe, al este.",
      id => cap(MARES[id].n)),
    correcta: mar,
    explica: `${cap(conArt(lugar))} ${esProv ? `tiene costa en ${conArt(mar)}` : `queda del lado ${de(mar)}`}. ${cosa(lugar).dato}`,
  };
}

function queEs(rnd) {
  const lugar = azar(QUE_ES, rnd);
  const otros = barajar(QUE_ES.filter(id => id !== lugar && distancia(id, lugar) >= 90), rnd).slice(0, 2);
  return {
    tipo: "opciones", lugar, mostrarNombre: false, minDist: 90,
    instr: "¿Qué es lo que está marcado en el mapa?", voz: "¿Qué es lo que está marcado en el mapa?",
    opciones: barajar(opcionesDe([lugar, ...otros], id => `${cap(conArt(id))} está más al ${rumbo(lugar, id)}.`, id => `${emojiDe(id)} ${nombreCorto(id)}`), rnd),
    correcta: lugar,
    explica: `${ese(lugar)} ${conArt(lugar)}. ${cosa(lugar).dato}`,
  };
}

function rioLlega(rnd) {
  const rio = azar(Object.keys(RIOS), rnd), llega = RIOS[rio].llega;
  const pista = { pacifico: "Fijate hacia dónde corre: va hacia el lado del océano Pacífico.", caribe: "Fijate hacia dónde corre: va hacia el este.",
    sanjuan: "Fijate hacia dónde corre: va hacia el norte, hacia la frontera con Nicaragua." }[llega];
  return {
    tipo: "opciones", capa: "rios", rio,
    instr: `¿Adónde llega <b>${conArt(rio)}</b>?`, voz: `¿Adónde llega ${conArt(rio)}?`,
    opciones: barajar(opcionesDe(["pacifico", "caribe", "sanjuan"], () => pista, id => cap(LLEGA[id])), rnd),
    correcta: llega,
    explica: `${cap(conArt(rio))} llega ${LLEGA[llega]}. ${RIOS[rio].dato}`,
  };
}

function cordilleraDe(rnd) {
  const lugar = azar(Object.keys(LUGARES).filter(id => LUGARES[id].cordillera), rnd), meta = LUGARES[lugar].cordillera;
  return {
    tipo: "opciones", capa: "cordilleras", lugar, mostrarNombre: true,
    instr: `¿En qué cordillera está <b>${conArt(lugar)}</b>?`, voz: `¿En qué cordillera está ${conArt(lugar)}?`,
    opciones: barajar(opcionesDe(Object.keys(CORDILLERAS), id => `${cap(conArt(id))} ${CORDILLERAS[id].donde}.`), rnd),
    correcta: meta,
    explica: `${cap(conArt(lugar))} está en ${conArt(meta)}, que ${CORDILLERAS[meta].donde}. ${CORDILLERAS[meta].dato}`,
  };
}

function regionDe(rnd) {
  const lugar = azar(CON_REGION, rnd), meta = LUGARES[lugar].region;
  const otras = barajar(Object.keys(REGIONES).filter(r => r !== meta), rnd).slice(0, 3);
  return {
    tipo: "opciones", lugar, mostrarNombre: true,
    instr: `¿En qué región está <b>${conArt(lugar)}</b>?`, voz: `¿En qué región está ${conArt(lugar)}?`,
    opciones: barajar(opcionesDe([meta, ...otras], id => `${cap(conArt(id))} ${REGIONES[id].donde}.`), rnd),
    correcta: meta,
    explica: `${cap(conArt(lugar))} está en ${conArt(meta)}, que ${REGIONES[meta].donde}.`,
  };
}

function regionPista(rnd) {
  const meta = azar(Object.keys(REGIONES), rnd);
  const otras = barajar(Object.keys(REGIONES).filter(r => r !== meta), rnd).slice(0, 3);
  return {
    tipo: "opciones",
    instr: `¿Qué región es? <small>«${REGIONES[meta].pista}»</small>`, voz: `¿Qué región es? ${REGIONES[meta].pista}`,
    opciones: barajar(opcionesDe([meta, ...otras], id => `${cap(conArt(id))} ${REGIONES[id].donde}.`), rnd),
    correcta: meta,
    explica: `Es ${conArt(meta)}: ${REGIONES[meta].donde}. ${REGIONES[meta].pista}`,
  };
}

// 🏆 «El más…» y datos famosos. pool: de dónde salen las opciones (se quitan las que también podrían ser ciertas)
export const MAS = [
  { p: "¿Cuál es el volcán más alto de Costa Rica?", ok: "irazu", pool: ["poas", "arenal", "turrialba", "rincon", "barva"],
    ex: "El volcán Irazú, en Cartago, mide más de 3 400 metros: es el volcán más alto del país." },
  { p: "¿Cuál es el punto más alto de Costa Rica?", ok: "chirripo", pool: ["irazu", "poas", "arenal", "turrialba"],
    ex: "El cerro Chirripó, en la cordillera de Talamanca, mide unos 3 820 metros: es el punto más alto del país." },
  { p: "¿Cuál es la provincia más grande?", ok: "puntarenas", pool: ["guanacaste", "alajuela", "limon", "sanjose"],
    ex: "Puntarenas es la más grande: va desde el golfo de Nicoya hasta la frontera con Panamá, y la Isla del Coco también es de Puntarenas." },
  { p: "¿Cuál es la provincia más pequeña?", ok: "heredia", pool: ["cartago", "sanjose", "alajuela", "limon"],
    ex: "Heredia es la provincia más pequeña. Le dicen «la ciudad de las flores»." },
  { p: "¿Cuál es el golfo más grande de Costa Rica?", ok: "golfoNicoya", pool: ["golfoDulce", "golfoPapagayo"],
    ex: "El golfo de Nicoya es el más grande. Ahí está el puerto de Puntarenas." },
  { p: "¿Cuál es la península más grande de Costa Rica?", ok: "penNicoya", pool: ["penOsa"],
    ex: "La península de Nicoya es la más grande: es parte de Guanacaste y de Puntarenas." },
  { p: "¿Qué volcán hizo una gran erupción en 1968, cerca de La Fortuna?", ok: "arenal", pool: ["poas", "irazu", "rincon", "miravalles"],
    ex: "El volcán Arenal hizo una gran erupción en 1968. Hoy muchos turistas lo visitan en La Fortuna de San Carlos." },
  { p: "¿Qué volcán echó ceniza sobre San José y Cartago entre 1963 y 1965?", ok: "irazu", pool: ["arenal", "poas", "rincon", "miravalles"],
    ex: "Fue el volcán Irazú. La gente tenía que barrer la ceniza de los techos y las calles." },
  { p: "¿Qué río marca parte de la frontera con Nicaragua?", ok: "rioSanJuan", pool: ["rioTempisque", "rioReventazon", "rioTarcoles", "rioTerraba"],
    ex: "Por la orilla del río San Juan pasa parte de la frontera con Nicaragua." },
  { p: "¿Qué parque está en una isla, lejos de la costa, en el océano Pacífico?", ok: "coco", pool: ["corcovado", "manuelAntonio", "tortuguero", "santaRosa"],
    ex: "La Isla del Coco está a más de 500 kilómetros de la costa. Es Patrimonio de la Humanidad." },
  { p: "¿A qué parque del Caribe llegan las tortugas verdes a poner huevos?", ok: "tortuguero", pool: ["manuelAntonio", "corcovado", "paloVerde", "braulio"],
    ex: "A Tortuguero: su nombre viene justamente de las tortugas." },
  { p: "¿Qué parque protege un arrecife de coral en el mar Caribe?", ok: "cahuita", pool: ["tortuguero", "braulio", "paloVerde", "santaRosa"],
    ex: "El Parque Nacional Cahuita, en Limón, protege un arrecife de coral." },
  { p: "¿En qué parque fue la batalla del 20 de marzo de 1856?", ok: "santaRosa", pool: ["paloVerde", "manuelAntonio", "tortuguero", "braulio"],
    ex: "En Santa Rosa, en Guanacaste, el ejército de Costa Rica venció a los filibusteros de William Walker." },
  { p: "¿Cerca de qué volcán se produce electricidad con el calor de la tierra?", ok: "miravalles", pool: ["poas", "irazu", "barva", "orosi"],
    ex: "Cerca del volcán Miravalles se produce energía geotérmica: se aprovecha el calor que hay bajo la tierra." },
  { p: "¿Qué parque de la península de Osa es uno de los lugares con más seres vivos distintos del mundo?", ok: "corcovado", pool: ["santaRosa", "paloVerde", "braulio", "tortuguero"],
    ex: "Corcovado, en la península de Osa: ahí viven jaguares, dantas, lapas rojas y miles de especies más." },
  { p: "¿En qué cordillera está el punto más alto del país?", ok: "cTalamanca", pool: ["cGuanacaste", "cTilaran", "cCentral"],
    ex: "En la cordillera de Talamanca, donde está el cerro Chirripó." },
  { p: "¿Qué río es famoso por los cocodrilos que se ven desde el puente?", ok: "rioTarcoles", pool: ["rioSanJuan", "rioPacuare", "rioSarapiqui", "rioSanCarlos"],
    ex: "El río Tárcoles: desde el puente de la carretera se ven cocodrilos enormes tomando el sol." },
  { p: "¿Qué río es famoso por el rafting, bajando los rápidos en balsa?", ok: "rioPacuare", pool: ["rioTempisque", "rioTarcoles", "rioSanJuan", "rioSanCarlos"],
    ex: "El río Pacuare, que baja de las montañas hacia el mar Caribe." },
];

function elMas(rnd) {
  const m = azar(MAS, rnd);
  const ids = barajar([m.ok, ...barajar(m.pool, rnd).slice(0, 3)], rnd);
  return {
    tipo: "opciones", mas: true,
    instr: m.p, voz: m.p,
    opciones: opcionesDe(ids, id => `${cap(conArt(id))}: ${cosa(id).dato}`, id => `${LUGARES[id] ? emojiDe(id) + " " : ""}${nombreCorto(id)}`),
    correcta: m.ok, explica: m.ex,
  };
}

// 🪜 De a poquito: de los volcanes y parques famosos hasta todo el mapa, regiones y «el más…»
export const ESCALONES = [
  { nombre: "Volcanes famosos", gen: rnd => tocarLugar({ pool: VOLC_FAMOSOS, n: 3, minDist: 150 }, rnd) },     //  1. tres volcanes lejos entre sí
  { nombre: "Parques famosos", gen: rnd => tocarLugar({ pool: PARQ_FAMOSOS, n: 3, minDist: 150 }, rnd) },      //  2. tres parques lejos entre sí
  { nombre: "¿En qué provincia está?", gen: enProvincia },                                                    //  3. tocar la provincia
  { nombre: "¿Pacífico o Caribe?", gen: queMar },                                                             //  4. de qué lado queda
  { nombre: "Todos los volcanes", gen: rnd => tocarLugar({ pool: VOLCANES, n: 5, minDist: 90 }, rnd) },       //  5. cinco volcanes
  { nombre: "¿Qué es esto?", gen: queEs },                                                                    //  6. se marca un lugar sin nombre
  { nombre: "Golfos y penínsulas", gen: rnd => tocarLugar({ pool: COSTAS, n: 4, minDist: 70 }, rnd) },        //  7. golfos y penínsulas
  { nombre: "Ríos", gen: rnd => (rnd() < 0.5 ? tocarRio(rnd) : rioLlega(rnd)) },                              //  8. tocar el río o adónde llega
  { nombre: "Cordilleras", gen: rnd => (rnd() < 0.5 ? cordilleraDe(rnd) : tocarCordillera(rnd)) },             //  9. cordilleras
  { nombre: "¿En qué región está?", gen: regionDe },                                                          // 10. regiones de un lugar
  { nombre: "¿Qué región es?", gen: regionPista },                                                            // 11. regiones por cómo son
  { nombre: "El más…", gen: elMas },                                                                          // 12. el volcán más alto, el golfo más grande…
  { nombre: "Todo el mapa", gen: rnd => tocarLugar({ pool: MEZCLA, n: 6, minDist: 90 }, rnd) },              // 13. seis lugares de todo tipo
];
export const MANUAL = { volcanes: [0, 4, 5, 8], parques: [1, 2, 5], agua: [3, 6, 7], regiones: [9, 10], mas: [11, 12] };
export const inicioPorEdad = edad => (edad === null || edad <= 8 ? 0 : edad === 9 ? 1 : edad === 10 ? 2 : edad === 11 ? 4 : 5);

/** Una ronda de un escalón. */
export function ronda(i, rnd = Math.random) { return { escalon: i, ...ESCALONES[i].gen(rnd) }; }

// ---------- Pistas al equivocarse (dependen de qué se tocó) ----------
/** Tocó «tocado» buscando la meta: qué se le dice. casi = estaba cerquita. */
export function pistaToque(r, tocado) {
  const casi = r.capa === "lugares" && distancia(tocado, r.meta) < 130;
  return { casi, txt: `${ese(tocado)} ${conArt(tocado)}. ${cap(conArt(r.meta))} está más al ${rumbo(tocado, r.meta)}.` };
}
/** Tocó una provincia que no es. */
export function pistaProvincia(r, prov) {
  const casi = VECINAS[r.meta].includes(prov);
  return { casi, txt: `Esa es ${PROVINCIAS[prov].corto}. ${cap(conArt(r.lugar))} está más al ${rumbo(prov, r.lugar)}.` };
}

// ---------- Revisiones (para las pruebas con node) ----------
const MALAS = [/\bde el\b/i, /\ba el\b/i, /undefined/, /NaN/, /\s\s/, /\.\./];
/** Revisa una ronda: una sola respuesta, opciones distintas, blancos separados y textos sin errores. */
export function revisarRonda(r) {
  const mal = [];
  const textos = [r.instr, r.voz, r.explica, ...(r.opciones || []).flatMap(o => [o.txt, o.por])];
  for (const t of textos) {
    if (typeof t !== "string" || !t.trim()) { mal.push("texto vacío"); continue; }
    for (const m of MALAS) if (m.test(t)) mal.push(`texto raro (${m}): ${t}`);
  }
  if (r.tipo === "tocar") {
    if (!r.blancos.includes(r.meta)) mal.push("la meta no está entre los blancos");
    if (new Set(r.blancos).size !== r.blancos.length) mal.push("blancos repetidos");
    if (r.blancos.length < 3) mal.push("muy pocos blancos");
    r.blancos.forEach((a, i) => r.blancos.slice(i + 1).forEach(b => { if (distancia(a, b) < r.minDist) mal.push(`${a} y ${b} muy juntos`); }));
  } else if (r.tipo === "provincia") {
    if (!MAPA_PROVINCIAS[r.meta]) mal.push("provincia desconocida");
    if (LUGARES[r.lugar].prov !== r.meta) mal.push("la provincia no calza");
  } else {
    const ids = r.opciones.map(o => o.id);
    if (new Set(ids).size !== ids.length) mal.push("opciones repetidas");
    if (!ids.includes(r.correcta)) mal.push("falta la correcta");
    if (ids.length < 2) mal.push("muy pocas opciones");
    if (r.minDist && r.lugar) ids.filter(id => id !== r.lugar).forEach(id => { if (distancia(id, r.lugar) < r.minDist) mal.push(`${id} muy cerca de ${r.lugar}`); });
  }
  return mal;
}

// Punto adentro de un contorno (para revisar que cada lugar caiga en su provincia o en el mar)
function poligonos(d) {
  return d.split("Z").map(s => (s.match(/-?\d+/g) || []).map(Number)).filter(n => n.length >= 6)
    .map(n => Array.from({ length: n.length / 2 }, (_, i) => [n[2 * i], n[2 * i + 1]]));
}
function adentro(x, y, poly) {
  let dentro = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[j];
    if ((y1 > y) !== (y2 > y) && x < x1 + ((y - y1) * (x2 - x1)) / (y2 - y1)) dentro = !dentro;
  }
  return dentro;
}
/** Provincia del mapa que tiene ese punto (o null si es mar). */
export function provinciaEn(x, y) {
  for (const [id, p] of Object.entries(MAPA_PROVINCIAS)) if (poligonos(p.d).some(poly => adentro(x, y, poly))) return id;
  return null;
}

/** Revisa los datos contra el mapa: cada lugar en su provincia, golfos en el mar, ríos casi todos en tierra… */
export function revisarDatos() {
  const mal = [];
  for (const [id, l] of Object.entries(LUGARES)) {
    if (id === "coco") continue;
    const { x, y } = pos(id), p = provinciaEn(x, y);
    if (l.tipo === "golfo" && p) mal.push(`${id} cae en tierra (${p})`);
    if (l.tipo !== "golfo" && !p) mal.push(`${id} cae en el mar`);
    if (l.prov && p !== l.prov) mal.push(`${id}: el mapa dice ${p}, los datos ${l.prov}`);
    for (const k of ["region", "cordillera", "mar"]) if (l[k] && !cosa(l[k])) mal.push(`${id}: ${k} desconocido ${l[k]}`);
    if (!l.dato) mal.push(`${id} sin dato`);
  }
  for (const [id, r] of Object.entries(RIOS)) {
    if (id === "rioSanJuan") continue; // va por la frontera, afuera del contorno
    const ps = r.puntos.map(([la, lo]) => xy(la, lo)), enTierra = ps.filter(p => provinciaEn(p.x, p.y)).length;
    if (enTierra < ps.length - 1) mal.push(`${id}: muchos puntos en el mar`);
  }
  for (const m of MAS) {
    if (!cosa(m.ok)) mal.push(`MAS sin ${m.ok}`);
    m.pool.forEach(id => { if (!cosa(id)) mal.push(`MAS: no existe ${id}`); if (id === m.ok) mal.push(`MAS: la correcta está en el pool (${m.p})`); });
  }
  return mal;
}
