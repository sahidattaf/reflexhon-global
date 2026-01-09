-- Migration: 0002_seed_cultural_datasets
-- Description: Seed initial Papiamentu cultural datasets
-- Created: 2026-01-09T19:18:11.794Z
-- Count: 70 datasets
-- ============================================================================

-- Categories: emotions, values, family, community, culture, language, respect

-- Delete existing seed data (if re-running)
DELETE FROM cultural_datasets WHERE source = 'initial_seed';

-- Insert cultural datasets
INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_001',
  'Kiko ta empatia?',
  'Empatia ta e kapasidat pa sinti loke e otro hende ta sinti, pa pone bo mes den su sapatunan i kompronde su emoshonnan i perspektiva. Den nos kultura Karibense, empatia ta fundamental pa mantene armonia den komunidat.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_002',
  'Kiko ta amor?',
  'Amor ta e sentimento profundo di afekshon, kuidado i konekshon ku otro hende. Den nos kultura, amor ta ekspresá den akshonan chikitu - un ''bon dia'' kálido, kompartí kuminda, i semper ta presente pa bo ser kerí.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_003',
  'Kiko ta alegria?',
  'Alegria ta e sentimento di felisidat i satisfakshon profundo. E ta bay mas ayá di felisidat temporal. Den nos isla, alegria ta haña den kos simpel - laman, solo, famia huntu, i musika di tambú.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_004',
  'Kiko ta tristesa?',
  'Tristesa ta un emoshon natural ora nos ta sinti dolor emoshonal o pèrdida. Den nos kultura, nos ta kompartí nos tristesa ku famia i amigunan, pasobra nos sa ku huntu nos ta mas fuerte.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_005',
  'Kiko ta rabia?',
  'Rabia ta un emoshon fuerte ku ta sali ora nos sinti frustá o faltá di respet. Tin manera saludabel pa ekspresá rabia, sin falta otro hende di respet. Nos ta papia, ta skouta, i ta buska solushon.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_006',
  'Kiko ta miedu?',
  'Miedu ta e sentimento di peligro o inkertidumbre. Tur hende tin miedu di algu, i esey ta normal. Balor ta den kon nos ta enfrentá nos miedunan i kontinuá kresé.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_007',
  'Kiko ta speransa?',
  'Speransa ta e kreensa ku kosnan mihó ta bini. Den tempu difísil, speransa ta e luz ku ta guia nos. Nos bisabuelonan a enseña nos: ''Despues di anochi, semper ta amanésé.''',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_008',
  'Kiko ta verguensa?',
  'Verguensa ta e sentimento ku nos kaba di aktuá kontra nos balor. E ta yuda nos keda konektá ku nos moralidat. Tin diferensha entre verguensa saludabel i verguensa toksiko.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_009',
  'Kiko ta orgùyo?',
  'Orgùyo ta e sentimento di satisfakshon riba logro, identidad o afiliashon. Nos ta orguyoso di nos kultura Papiamentu, nos idioma, i nos herencia Karibense. Orgùyo saludabel ta inspira, pero soberbio ta separà.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_010',
  'Kiko ta gratitut?',
  'Gratitut ta e apresio profundo pa loke nos tin i pa e hendenan den nos bida. Den nos kultura, nos ta gradisí semper - ''Danki'' i ''Masha danki'' ta palabranan importantes.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_011',
  'Kiko ta soledad?',
  'Soledad ta e sentimento di ta solu òf deskonektá, ainda ku bo ta rondá di hende. Pero soledad no ta verguensa - ta parti di eksperiensha humano. Buska konekshon i kompartí bo sentimento ta importante.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_012',
  'Kiko ta pashensia?',
  'Pashensia ta e kapsidat pa keda kalmu i tolerante, ainda ku tin frustashon. Nos ta bisa: ''Keru-keru palu ta kap.'' E ta un balor apresiá den nos kultura.',
  'emotions',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_013',
  'Kiko ta respet?',
  'Respet ta trata otro hende ku dignidad i konsiderashon. Den nos kultura Karibense, respet ta fundamental - respet pa mayor, pa famia, pa bisiña, i pa nos mes. Sin respet, komunidat no por eksistí.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_014',
  'Kiko ta onestidad?',
  'Onestidad ta biba den berdat i transparensia. Nos ta bisa: ''Berdat ta kla manera solo.'' Un hende onesto ta konfiabel, i konfiansa ta base di relashon fuerte.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_015',
  'Kiko ta solidaridad?',
  'Solidaridad ta para huntu ku otro hende, spesialmente den momentu difísil. Den nos isla, solidaridad ta parti di nos ADN - ora un hende tin problema, komunidat ta reúni pa yuda.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_016',
  'Kiko ta hustisia?',
  'Hustisia ta tratamentu hustu i ekitabel pa tur hende, sin importá kolor, klas sosial, òf orígen. Tur hende mereser respet i oportunidat igual.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_017',
  'Kiko ta humildat?',
  'Humildat ta konosementu ku nos no sa tur kos i ku nos semper por siña for di otro. Un hende humilde ta fuerte, no débil. Nos ta bisa: ''Palu duru ta kap.''',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_018',
  'Kiko ta generosidad?',
  'Generosidad ta kompartí loke nos tin - tempu, rekurso, konosementu - sin spera algu bèk. Den nos kultura, generosidad ta krea bunita i fortalesa komunal.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_019',
  'Kiko ta responsabilidat?',
  'Responsabilidat ta hasi loke nos a promete i para tras di nos akshonan. Un hende responsabel ta inspira konfiansa i ta kontribuí na bon funshonamentu di komunidat.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_020',
  'Kiko ta balor di trabou?',
  'Trabou ta mas ku gana sueldo - ta kontribushon na komunidat i manera di ekspresá nos talento. ''Man bashi no ta hana pia'', nos ta bisa. Trabou ku dignidad ta onrá nos i nos kultura.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_021',
  'Kiko ta integridad?',
  'Integridad ta mantene bo prinsipionan i balor, ainda ku niun hende no ta wak. Ta hasi loke ta korekto, no loke ta fásil. Integridad ta e fundasion di karakter fuerte.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_022',
  'Kiko ta toleransia?',
  'Toleransia ta aseptá i respetá diferensha - di opinion, kultura, kreensa. Nos islanan ta konosí pa nos diversidat i armonia. ''Un man so no ta bati'', nos ta bisa.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_023',
  'Kiko ta perseveransia?',
  'Perseveransia ta sigui lucha, ainda ku tin obstakulo. Nos ta bisa: ''Poko poko, pushi ta bai leu.'' E ta e determinashon pa no laga bay, paso pa paso.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_024',
  'Kiko ta sabiduria?',
  'Sabiduria ta mas ku konosementu - ta kombiná esperiensia ku komprenshon profundo. Nos mayornan i wela/welonan ta fuente di sabiduria kultural i konsehá di bida.',
  'values',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_025',
  'Kiko ta famia?',
  'Famia ta mas ku sanger - ta e hendenan ku ta kria, guia, i apoya nos. Den nos kultura, famia ta ekstendí: tia, tio, primo, madrina, padrino. ''Famia ta tur kos'', nos ta bisa.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_026',
  'Kiko ta papel di mayor den famia?',
  'Mayor ta e pilarnan di nos famia i komunidat. Nan tin sabiduria, experiensia, i historia. Respet pa mayor ta fundamental - nos ta skouta nan konsehá i kuidá nan ku amor.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_027',
  'Kiko ta relashon entre ruman?',
  'Rumannan ta kompaño di bida. Por tin rivalidad, pero semper tin amor subyasente. Nos ta bisa: ''Ruman ta ruman.'' Nan ta e hendenan ku ta konosé bo for di chikitu.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_028',
  'Kiko ta papel di mama?',
  'Mama ta e korazón di famia. E ta duna bida, kria, enseña, i semper ta aya. Ningun amor ta mas grandi ku amor di mama. ''Mama ta mama'', nos ta bisa ku respet profundo.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_029',
  'Kiko ta papel di tata?',
  'Tata ta protekshon, guia, i ehèmpel. E ta enseña balor, disiplina, i responsabilidat. Un tata presente ta importante pa kresementu saludabel di yu.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_030',
  'Kiko ta wela i welo?',
  'Wela i welo ta tesoro di nos famia. Nan ta sabiduria, historia bibu, i amor inkondesional. Nan ta kontá kuenta, enseña tradishon, i duna nos dulsernan hopi biaha. Nan ta konekshon ku nos pasá.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_031',
  'Kiko ta madrina i padrino?',
  'Madrina i padrino ta responsabilidat spiritual i emoshonal. Nan ta guia, konsehá, i apoya. Nan ta ampliá sirkel di amor i protekshon rondó di yu.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_032',
  'Kiko ta importansia di kuminda den famia?',
  'Kuminda huntu ta mas ku solo kome - ta konekshon, komunikashon, i tradishon. Mesa ta e lugar kaminda famia ta reúni, kompartí storia, i fortalese bunita. ''Barriga yen, korazón kontentu.''',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_033',
  'Kiko ta kriansa di yu?',
  'Kria yu ta responsabilidat di henter komunidat, no solo mayornan. Nos ta bisa: ''Mester un pueblo ènter pa kria un yu.'' Ta enseña balor, respet, i amor, mientras duna libertad pa kreser.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_034',
  'Kiko ta tradishon familiar?',
  'Tradishonnan familiar ta e hilo ku ta konektá generashon. Por ta kuminda spesial den fiesta, kantiká den siman santa, òf reùni na landa. Tradishon ta duna nos identidat i sentido di pèrtènènsè.',
  'family',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_035',
  'Kiko ta komunidat?',
  'Komunidat ta mas ku hende bibando serkano - ta sentido di pertenencia, apoyo mutual, i identidad kompartí. Den nos isla, komunidat ta famia ekstendí. Nos ta kuid''otro.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_036',
  'Kiko ta bisiña?',
  'Bisiña ta mas ku hende bibando al lado. Nan ta famia skohe, primera ayudo ora tin problema, i kompaño di dia. ''Bisiña bon ta mihó ku ruman leu'', nos ta bisa.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_037',
  'Kiko ta trabou komunitario?',
  'Trabou komunitario ta kuando nos ta kolaborá pa mihora nos barí. Por ta limpia landa, pinta muraya, òf organisá aktividat pa mucha. Huntu nos ta mas fuerte.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_038',
  'Kiko ta selebrashon komunitario?',
  'Selebrashon komunitario ta momentunan ku nos ta reúni pa fiesta: karnaval, simadan, anja nobo. E ta raforsá nos bunita, identidad, i alegria kompartí.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_039',
  'Kiko ta riskunan di komunidat chikitu?',
  'Den komunidat chikitu, privasia ta limitá i tur hende konosé bo bisnis. Por tin presion sosial fuerte. Pero tambe tin protekshon, apoyo, i sentido profundo di pertenencia.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_040',
  'Kiko ta importansia di iglesia/institutunan spiritual?',
  'Iglesia i otro institutunan spiritual ta luga di enkuentro, guia moral, i apoyo komunitario. Mas ayá di fe, nan ta sentro sosial importante den nos kultura.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_041',
  'Kiko ta konflíkto den komunidat?',
  'Konflíkto ta natural ora hende ta biba huntu. Importante ta manera di resolbé - ku diálogo, respet, i buska komprenshon. ''Papia, no grita'', nos ta bisa.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_042',
  'Kiko ta identidad kultural kompartí?',
  'Nos identidad kultural ta forma riba idioma Papiamentu, herencia mistu (Afrikano, Europeo, Karibense), musika, kuminda, i historia. E ta loke ta uni nos komo pueblo.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_043',
  'Kiko ta papel di sport den komunidat?',
  'Sport ta uni hende, krea diskurso sosial, i enseña trabou di ekipo. Béisbol, futbol, i volleyball ta parti importante di bida sosial i identidad komunitario.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_044',
  'Kiko ta transmishon di konosementu komunitario?',
  'Konosementu ta pasa di generashon pa generashon - oral tradishon, kuenta di nanachi, remedi di yerbá, i sabiduria práktiká. E ta rikiesa kultural ku mester preservá.',
  'community',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_045',
  'Kiko ta kultura Karibense?',
  'Kultura Karibense ta un mezkla rika di influensha Afrikano, Europeo, i indígeno. Ta vibrant, musikal, alegre, pero tambe resiliente i fuerte. Nos historia ta marka pa sobrevivensia i kreatividad.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_046',
  'Kiko ta musika den nos kultura?',
  'Musika ta alma di nos pueblo. Tambu, tumba, waltz, danza - kada ritmo ta konta un historia. Musika ta presente den tur selebrashon i tambe ta konsuela den tristesa.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_047',
  'Kiko ta importansia di Karnaval?',
  'Karnaval ta ekspreshon masimo di nos kultura - kolor, musika, baile, kreatividad, i libertat. E ta celebrá bida i uni henter komunidat den alegria kolektivo. Karnaval ta mas ku fiesta, ta identidad.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_048',
  'Kiko ta kuminda tradisional?',
  'Kuminda tradisional ta keshi yená, stoba, ayaka, pan bati, funchi. Kada plachi ta konta historia di nos pasá - influensha Afrikano, Hulandes, Latino. Kuminda ta amor den forma di sabor.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_049',
  'Kiko ta arte i ekspreshon kreativo?',
  'Arte - pinta, eskultura, artesania - ta refleha nos paisahe, kultura, i alma. Arte ta manera di preservá historia, ekspresá emoshon, i selebrá nos identidad úniko.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_050',
  'Kiko ta kuenta i folklore?',
  'Kuenta di Nanzi (kompa), bruha, i duende ta parti di nos folklore. Nan ta transporte sabiduria moral i kultural den forma di entretenementu. E ta tradishon oral rika.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_051',
  'Kiko ta paisahe natural?',
  'Nos paisahe - laman kristal, solo kálido, kaktus divi-divi, kosta ròkoso - ta forma nos identidad. Naturalesa ta fuente di inspirashon, konsuela, i rekurso.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_052',
  'Kiko ta relashon ku laman?',
  'Laman ta mas ku hawa - ta parti di nos alma. E ta duna kuminda, trabou, rekreashon, i inspirashon. Laman ta konektá nos ku mundu mas grandi i tambe ta nos kas.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_053',
  'Kiko ta fiestanan tradisional?',
  'Fiestanan tradisional - Dera Gai, Simadan, San Juan - ta selebrá aspektunan di bida: koseha, naturalesa, santunan. Nan ta konservá tradishon i fortalese identidad kultural.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_054',
  'Kiko ta influensha kolonial den kultura?',
  'Historia kolonial a laga marka profundo - idioma, institutunan, relashon di poder. Pero nos a transforma e influenshanan aki den algu úniko: kultura Papiamentu, resiliente i orguyoso.',
  'culture',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_055',
  'Kiko ta idioma Papiamentu?',
  'Papiamentu ta nos idioma kreol, nase for di mezkla di Portugues, Ulandes, Spaño, Ingles, i lèngua Afrikano. E ta simbolo di nos identidad i resiliensia. Ta nos bos.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_056',
  'Pakiko Papiamentu ta importante?',
  'Papiamentu ta mas ku forma di komunikashon - ta e medium ku nos ta pensa, sinti, i suña. E ta konektá nos ku nos pasá i ta fuente di identidad kultural. Preservá Papiamentu ta preservá nos mes.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_057',
  'Kiko ta diferensha entre Papiamentu Korsou i Aruba?',
  'Tin variashonnan chikitu den pronunsiashon i algun palabra. Korsou i Bonaire ta usa mas ''k'', Aruba mas ''c''. Pero ta esensialmente e mes idioma, i nos ta kompronde otro perfektamente.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_058',
  'Kiko ta espreshonnan komun?',
  'Espreshonnan komun ta rika di kultura: ''Mi dushi'' (término di kariño), ''Ayo'' (despedida), ''Mashá'' (muchu), ''Dios ta grandi'' (Dios ta grandi), ''Ban lesa'' (bamos). Kada un ta karga emoshon.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_059',
  'Kiko ta refrannan i dikhonan Papiamentu?',
  'Refrannan ta kapsulá sabiduria: ''Awa bai pero piedra keda'' (akshon tin konsekuensia duradero), ''Kabai ku kore, ta kore su bida'' (hende apurá ta kaba lihe). Nan ta leson pa bida.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_060',
  'Kiko ta desaroyo di Papiamentu?',
  'Papiamentu a nase for di nesesidad di komunikashon entre grupo diferente. A evolushona durante siglünan, absorbiendo influensha múltiple, pero manteniendo su esencia úniko i identidad propio.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_061',
  'Kiko ta leteratura Papiamentu?',
  'Leteratura Papiamentu - poesia, novela, kuenta - ta kresiendo. Outornan manera Pierre Lauffer, Tip Marugg, Diana Lebacs ta krea obra ku ta reflehá nos eksperiensha i alma kultural.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_062',
  'Kiko ta desafiunan di Papiamentu?',
  'Desafiunan ta globalisashon, dominansia di Ulandes i Ingles, i falta di rekurso edukativo. Pero nos ta lucha pa preservá i promové Papiamentu, paso e ta esenshal pa nos identidad.',
  'language',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_063',
  'Kon mester trata un mayor?',
  'Mester trata mayor ku máksimo respet - bisa ''bos'' en bes di ''bo'', para kaba ora nan drenta, skouta ora nan ta papia, i buska nan konsehá. ''Respet pa grande, amor pa chikí'', nos ta bisa.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_064',
  'Kiko ta bon manera na mesa?',
  'Na mesa: warda pa tur hende keda sentá promé ku kuminsá kome, no papia ku boka yen, gradisí e persona ku a kusiná, i yuda rekohe plachi. Manera na mesa ta reflehá kriansa.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_065',
  'Kon mester hañá un hende?',
  'Salúda ku ''bon dia'', ''bon tardi'', òf ''bon nochi'', dependiendo di ora. Hende konosí por haña ku sunchi (beso na kachu). Saludo ta importante - ignorá hende ta falta di respet.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_066',
  'Kiko ta protokol den fiesta familiar?',
  'Den fiesta familiar: salúda tur hende (spesialmente mayor), trese kontribushon (kuminda òf bebida), no sali promé sin despedí, i yuda limpia si ta posibel. Partisipashon aktivo ta demostrá respet.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_067',
  'Kiko ta kostumber pa bishita?',
  'Ora bishitá: yama promé si posibel, no yega ku man bashi (trese algu chikitu), no keda muito largu si bo no a bin invitá, i gradisí ospitalidad. Bon bishita ta arte.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_068',
  'Kon mester reakshoná na fayesementu?',
  'Den momentu di doló: presentá bo kondolensha personalmentá si posibel, ofresé ayudo konkrèt, partisipá na velorio/entiero, i keda disponibel despues tambe. Doló ta kompartí, no soló.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_069',
  'Kiko ta konsepto di ''palabra''?',
  '''Palabra ta palabra'' - si bo a bisa algo, bo mester kumpli. Bo palabra ta bo honor. Den nos kultura, konfiansa ta basa riba hende ku tin palabra i ku ta kumpli.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

INSERT INTO cultural_datasets (
  id, input, output, category, language, cultural_context,
  tags, source, validation_status,
  cultural_alignment_score, empathy_score, respeto_score,
  is_active, created_at, updated_at
) VALUES (
  'papiamentu_070',
  'Kiko ta importansia di tempu den nos kultura?',
  'Aunke nos tin reputashon di ''island time'', respet ta duradero. Yega na tempu pa trabou i kompromisonan importante ta demostrá respet. Balansa ta haya entre relaksashon i responsabilidat.',
  'respect',
  'papiamentu',
  'caribbean',
  NULL,
  'initial_seed',
  'approved',
  100,
  100,
  100,
  1,
  datetime('now'),
  datetime('now')
);

-- Verify import
SELECT
  category,
  COUNT(*) as count
FROM cultural_datasets
WHERE source = 'initial_seed'
GROUP BY category;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
