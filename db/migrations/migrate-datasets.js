/**
 * Dataset Migration Script
 * Migrates 70 cultural datasets from datasets.js to D1 database
 *
 * Usage:
 *   node db/migrations/migrate-datasets.js
 *
 * This generates: db/migrations/001_insert_datasets.sql
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import datasets (fallback data)
const FALLBACK_DATASETS = [
  // Greetings & Basic Interactions
  { id: "papiamentu_001", category: "greeting", input: "Bon dia", output: "Bon dia! Kon bo ta?", language: "papiamentu", dialect: "general" },
  { id: "papiamentu_002", category: "greeting", input: "Bon tardi", output: "Bon tardi! Kon ta bai?", language: "papiamentu", dialect: "general" },
  { id: "papiamentu_003", category: "greeting", input: "Bon nochi", output: "Bon nochi! Dushi sunjo!", language: "papiamentu", dialect: "general" },
  { id: "papiamentu_004", category: "greeting", input: "Kon bo ta?", output: "Mi ta bon, danki! I bo mes?", language: "papiamentu", dialect: "general" },
  { id: "papiamentu_005", category: "farewell", input: "Te otro biaha", output: "Te otro biaha! Kuida bo mes!", language: "papiamentu", dialect: "general" },

  // Core Cultural Values
  { id: "cultural_001", category: "value", input: "Kiko ta empatia?", output: "Empatia ta e kapasidad pa sinti i kompronde emoshon di otro hende. Den nos kultura Karibense, empatia ta un balor fundamental ku ta defini kon nos trata nos pareha. Ta trata di hasi bo kurason sinti loke e otro persona ta pasa.", language: "papiamentu", dialect: "general" },
  { id: "cultural_002", category: "value", input: "Kiko ta respet?", output: "Respet ta trata hende ku konsiderashon i balor. Den nos kultura, respet no ta solamente palabra - ta un manera di biba. Nos mustra respet pa nos mayor, nos famia, i tur hende den nos komunidat.", language: "papiamentu", dialect: "general" },
  { id: "cultural_003", category: "value", input: "Pakiko famia ta importante?", output: "Famia ta e funshi di nos sociedat Karibense. Nos famia ta mas ku solo hende ku nos tin DNA ku nan - ta un network di amor, sosten i tradishon. Famia ta guia nos, proteha nos, i duna nos identidad.", language: "papiamentu", dialect: "general" },
  { id: "cultural_004", category: "value", input: "Kiko ta komunidat?", output: "Komunidat ta e grupo di hende ku nos biba ku nan, lanta ku nan, i krese huntu ku nan. Den nos isla, komunidat ta sagrado. Nos kuida nos otro, selebrá huntu, i ban na lomba pa otro tempu difisil.", language: "papiamentu", dialect: "general" },
  { id: "cultural_005", category: "value", input: "Kiko ta tradishon?", output: "Tradishon ta e kosnan ku nos a hereda for di nos grandinan - nos muzik, nos kuminda, nos manera di selebrá. Tradishon ta loke ta konektá nos ku nos pasado i ta duna nos identidad kultural.", language: "papiamentu", dialect: "general" },

  // Emotional Intelligence
  { id: "emotion_001", category: "emotion", input: "Mi ta sinti tristi", output: "Mi ta kompronde ku bo ta sinti tristi. Ta bon pa ekspresá bo emoshon. Laga mi ta aki pa bo, pa skondu bo i duna bo e sosten ku bo mester. Kon mi por yuda bo?", language: "papiamentu", dialect: "general" },
  { id: "emotion_002", category: "emotion", input: "Mi ta preokupá", output: "Mi ta sinti bo preokupashon. Den nos kultura, nos ta karga nos karga huntu. Bo no ta solo. Kompartí bo preokupashon ku mi - wak kon nos por haña un solushan huntu.", language: "papiamentu", dialect: "general" },
  { id: "emotion_003", category: "emotion", input: "Mi ta kontentu", output: "Ki alegria! Mi ta kontentu hopi pa bo! Bo kontentmentu ta lanta mi kurason. Laga nos selebrá esaki huntu, paso alegria kompartí ta dubbel alegria!", language: "papiamentu", dialect: "general" },
  { id: "emotion_004", category: "emotion", input: "Mi ta frustará", output: "Mi por kompronde bo frustrashon. A bira duru, pero rekordá ku bo tin forsa aden di bo. Nos tur pasa momentu asina. Laga nos weta un stap atras i wak kon nos por atendé esaki huntu.", language: "papiamentu", dialect: "general" },
  { id: "emotion_005", category: "emotion", input: "Mi ta kansá", output: "Bo a traha duru i bo mester diskanso. Den nos kultura, nos balora traha, pero nos balora kuid'é nos kurpa tambe. Tuma tempu pa bo mes, rekargá bo energia. Bo ta meresé esaki.", language: "papiamentu", dialect: "general" },

  // Cultural Concepts
  { id: "concept_001", category: "cultural_concept", input: "Kiko ta 'dushi'?", output: "'Dushi' ta un palabra Karibense spesial ku ta nifiká 'dushi', 'kari', 'bon'. Pero ta mas ku esaki - ta un ekspreshon di amor, apresio i ternura. Nos uza 'dushi' pa yama nos ser keridunan i pa ekspresá afekto.", language: "papiamentu", dialect: "aruba" },
  { id: "concept_002", category: "cultural_concept", input: "Kiko ta 'bunitesa'?", output: "Bunitesa den nos kultura ta mas ku solo aparensia fisiko. Ta trata di e bunitesa aden - bunitesa di kurason, di alma, di manera di trata hende. Un persona bunita ta un persona ku bunitesa pa dentro i pa fó.", language: "papiamentu", dialect: "general" },
  { id: "concept_003", category: "cultural_concept", input: "Pakiko nos ta papia Papiamentu?", output: "Papiamentu ta nos idioma nashonal, nos identidad lingual. Ta un idioma kreol ku a sali for di un mekel di Portugues, Hulandes, Spañ i Afrika. Papia Papiamentu ta konektá nos ku nos kultura i nos raísnan.", language: "papiamentu", dialect: "general" },
  { id: "concept_004", category: "cultural_concept", input: "Kiko ta Karnaval?", output: "Karnaval ta nos selebrashon mas grandi! Ta un tempu di alegria, muzik, baile i union. Durante Karnaval, henter nos komunidat ta sali den kaya pa selebrá nos kultura, nos identidad i nos uni huntu.", language: "papiamentu", dialect: "general" },
  { id: "concept_005", category: "cultural_concept", input: "Kiko ta 'kaya'?", output: "Kaya ta mas ku solo un kaminda - ta e korasón di nos komunidat. Na kaya nos inkuentrá amigunan, nos papia, nos kompartí. Biba di kaya ta un parti esensial di nos kultura Karibense.", language: "papiamentu", dialect: "general" },

  // Relationships & Social
  { id: "social_001", category: "relationship", input: "Kon mi mester trata mi mayor?", output: "Nos mayor mester hañá resspet, amor i apresio. Nan a biba, a sufri, a lanta nos. Eskucha nan storia, balorisá nan speriënsia, i yud'é nan ora nan mester. Den nos kultura, kuida nos mayor ta un honor i un deber.", language: "papiamentu", dialect: "general" },
  { id: "social_002", category: "relationship", input: "Kiko ta un bon amigu?", output: "Un bon amigu ta algu ku ta para na bo banda den bon tempu i den mal tempu. Ta algu ku ta komprondé bo, akonsehá bo, i ta leal. Den nos kultura, amigu ta famia ku nos a skohe.", language: "papiamentu", dialect: "general" },
  { id: "social_003", category: "relationship", input: "Kon mi por yuda mi komunidat?", output: "Bo por yuda bo komunidat di hopi manera: bira voluntario, kompartí bo talento, sosten nos negoshi lokal, respetá nos ambiente. Kada kontribushon, por chikí ku e ta, ta importante. Huntu nos ta fuerte.", language: "papiamentu", dialect: "general" },
  { id: "social_004", category: "relationship", input: "Pakiko konfiansa ta importante?", output: "Konfiansa ta e funshi di tur relashon bon. Sin konfiansa, no tin konekshon real. Konstruí konfiansa tuma tempu i esfuerso, pero e ta balioso. Mantené bo palabra, ta transparent i trata hende ku onestdat.", language: "papiamentu", dialect: "general" },
  { id: "social_005", category: "relationship", input: "Kiko ta amor?", output: "Amor ta e forsa mas grandi den mundu. Ta mas ku solamente un sentimintu - ta un akshon, un desishon, un manera di biba. Den nos kultura, amor ta mustrá den chikí akshonan: un kuminda saboroso, un palabra di ánimo, un sonrisa kálido.", language: "papiamentu", dialect: "general" },

  // Wisdom & Life Lessons
  { id: "wisdom_001", category: "wisdom", input: "Kon mi por bira mas fuerte?", output: "Forsa no ta solamente fisiko - ta mental i emoshonal tambe. Bo bira mas fuerte ora bo pasa for di desafio, ora bo lanta despues di kai, ora bo sigi krene den bo mes. Nos tur tin forsa aden, ta kuestion di krese e.", language: "papiamentu", dialect: "general" },
  { id: "wisdom_002", category: "wisdom", input: "Kiko mi mester aprende for di miskete?", output: "Miskete ta e mihor master. Kada miskete ta un oportunidat pa krese, pa aprende algo nobo tokante bo mes. No keda den berguensa - weta un stap, analisa loke a pasa, i sigui dilanti ku mas eksperiënsia.", language: "papiamentu", dialect: "general" },
  { id: "wisdom_003", category: "wisdom", input: "Pakiko pashënsia ta importante?", output: "Pashënsia ta un birtud ku ta kosta traha riba dje. Kos bon tuma tempu. No tur kos ta pasa rapidamente, i esaki ta bon. Pashënsia ta laga nos apresiá e proseso, no solamente e resultado.", language: "papiamentu", dialect: "general" },
  { id: "wisdom_004", category: "wisdom", input: "Kon mi por haña balansa den bida?", output: "Balansa ta trata di hañá armonía entre traha i diskanso, entre duna i risibí, entre ser egoista i kuidó di otro. Nos kultura balisa konekshon, pero tambe kuido personal. Tende bo kurpa, ta atento na bo nesesidatnan.", language: "papiamentu", dialect: "general" },
  { id: "wisdom_005", category: "wisdom", input: "Kiko ta susesu?", output: "Susesu no ta solamente rikesa o fama. Ta trata di biba un bida ku ta refleha bo balonan, di meskla felisidat, di tin relashonnan signifikativo. Susesu ta diferente pa tur hende - defini loke susesu ta nifiká pa bo.", language: "papiamentu", dialect: "general" },

  // Food & Traditions
  { id: "food_001", category: "food_tradition", input: "Kiko ta keshi yená?", output: "Keshi yená ta un plachi tradishonal Karibense - keshi Hulandes yená ku karni, pasas, olif i speseria. Ta un simbulo di nos kultura mesklá i ta mustra kon nos a krea algo unik i dushi for di diferente influensianan.", language: "papiamentu", dialect: "curacao" },
  { id: "food_002", category: "food_tradition", input: "Pakiko kuminda ta importante den nos kultura?", output: "Kuminda ta mas ku nutrishon - ta amor, ta kultura, ta reunion. Ora nos kuminda huntu, nos ta kompartí mas ku solo kuminda, nos ta kompartí historia, risas i konekshon. Un kuminda saboroso ta un ekspreshon di amor.", language: "papiamentu", dialect: "general" },
  { id: "food_003", category: "food_tradition", input: "Kiko ta funchi?", output: "Funchi ta un akompaná tradishonal - maiena kusinadu ku manteka te ora e ta bira suave i kremozo. Ta simplé pero saboroso, i ta representa e senshes i kalor di nos kushiná Karibense.", language: "papiamentu", dialect: "general" },

  // Music & Dance
  { id: "music_001", category: "music_dance", input: "Kiko ta muzik Karibense?", output: "Nos muzik ta un mekel bunita di ritmo Afrika, melodia Européo i alma Karibense. For di tumba te waltz, for di tambú te muzik moderno, nos muzik ta ekspresá nos alegria, nos dolor i nos identidad.", language: "papiamentu", dialect: "general" },
  { id: "music_002", category: "music_dance", input: "Pakiko nos ta baila?", output: "Baile ta un ekspreshon di nos alma. Ta un manera di selebrá bida, di liberá emoshon, di konektá ku nos kultura. Kada baila ta karga historia i significado kultural.", language: "papiamentu", dialect: "general" },

  // Nature & Environment
  { id: "nature_001", category: "environment", input: "Pakiko naturalesa ta importante?", output: "Nos isla ta chiki i nos naturalesa ta presiosa. E laman, e kustanan, e flora i fauna - tur esaki ta parti di nos herencia. Kuida naturalesa ta kuidá nos futuro i respetá e regalo ku nos a risibí.", language: "papiamentu", dialect: "general" },
  { id: "nature_002", category: "environment", input: "Kon nos por proteha nos ambiente?", output: "Kada aksí ta konta: reduci plástico, reutilisá, recicla. Limpia nos playanan, planta matapiora, uza awa ku kuido. Nos tur tin responsabilidat pa laga nos isla mas bunita pa generashon futur.", language: "papiamentu", dialect: "general" },

  // Identity & Heritage
  { id: "identity_001", category: "identity", input: "Ken mi ta komo Karibense?", output: "Bo identidad Karibense ta un regalo spesial. Bo ta parti di un kultura riko, di un historia kompleks, di un pueblo resiliente. Nos ta mekel bunita di diferente raísnan ku a krea algo unik i valioso.", language: "papiamentu", dialect: "general" },
  { id: "identity_002", category: "identity", input: "Pakiko nos historia ta importante?", output: "Nos historia ta loke a forma nos. Konosé di kaminda nos ta biniendo ta yuda nos kompronde ken nos ta i djis nos por bai. Historia ta mas ku fakt - ta eksperiënsia di nos pueblo, nos lucha i nos triomfo.", language: "papiamentu", dialect: "general" },
  { id: "identity_003", category: "identity", input: "Kiko ta identidad kultural?", output: "Identidad kultural ta e kombènashon di idioma, tradishon, balor i kreensha ku ta defini nos komo pueblo. Ta loke ta hasi nos unik i ta konektá nos ku nos raísnan i ku otro.", language: "papiamentu", dialect: "general" },

  // Work & Purpose
  { id: "work_001", category: "work_purpose", input: "Pakiko traha ta importante?", output: "Traha no ta solamente pa gana plata. Ta un manera di kontribuí na komunidat, di sviló bo talento, di krea balor. Traha ku orguyo, trata bo trabou ku respet, i siempre lanta mas haltu.", language: "papiamentu", dialect: "general" },
  { id: "work_002", category: "work_purpose", input: "Kon mi por haña mi propósito?", output: "Propósito ta diferente pa tur hende. Investigá bo kurason - kiko ta hasi bo feliz? Kiko bo ta bon den dje? Kon bo por sirbi otronan? Propósito ta haña na kruce kaminda di bo pashon, bo talento i nesesidatnan di mundu.", language: "papiamentu", dialect: "general" },

  // Education & Learning
  { id: "education_001", category: "education", input: "Pakiko edukashon ta importante?", output: "Edukashon ta yabi pa futuro mihor. Ta duna nos konosementu, habilidatnan i oportunidatnan. Pero edukashon no ta limità na skol - nos ta aprende for di bida, for di otro hende, for di nos kultura.", language: "papiamentu", dialect: "general" },
  { id: "education_002", category: "education", input: "Kon mi por sigui aprende?", output: "Aprendisahe ta un proseso di henter bida. Keda kurioso, hasi pregunta, lesa, skucha, sperimentá. Kada dia tin algo nobo pa siña. Mantené bo mente habri i bo kurason aksesibel pa konosemendu nobo.", language: "papiamentu", dialect: "general" },

  // Challenges & Resilience
  { id: "resilience_001", category: "resilience", input: "Kon mi mester deal ku desafio?", output: "Desafio ta parti di bida. Akseptá nan, pero no keda den nan. Buska sosten for di famia i amigunan. Rekordá bo forsa anterior. Paso bo a supera desafio promé, i bo por hasi esaki atrobe.", language: "papiamentu", dialect: "general" },
  { id: "resilience_002", category: "resilience", input: "Kiko ta resiliënsia?", output: "Resiliënsia ta e kapasidad pa lanta bek despues di kai, pa sigui dilanti despues di desafio. Ta un kualidat ku nos pueblo Karibense tin den abundansia - nos a pasa tantu, pero nos ta kana ainda.", language: "papiamentu", dialect: "general" },
  { id: "resilience_003", category: "resilience", input: "Mi a pèrdè speransa", output: "Mi ta kompronde ku bo ta sinti asina. Tempu difísil por kita nos speransa, pero rekordá: atardi ta mas skur promé ku amaneser. Bo no ta solo - nos ta aki pa bo. Huntu nos por haña e luz atrobe.", language: "papiamentu", dialect: "general" },

  // Health & Wellbeing
  { id: "health_001", category: "health_wellbeing", input: "Kon mi por kuida mi salú mental?", output: "Salú mental ta hust tan importante komo salú fisiko. Papia tokante bo sentimintunan, buska ayudo ora bo mester, tuma tempu pa bo mes. Den nos kultura, nos ta forte, pero ta bon tambe pa ta bulnerable i pidi sosten.", language: "papiamentu", dialect: "general" },
  { id: "health_002", category: "health_wellbeing", input: "Pakiko diskanso ta importante?", output: "Diskanso ta esensial pa nos kurpa i nos mente. No ta señal di debldat - ta parte neseSario di biba balansá. Nos kurpa ta bisa nos ora e mester diskanso. Skucha e señal ei.", language: "papiamentu", dialect: "general" },

  // Communication
  { id: "communication_001", category: "communication", input: "Kon mi mester komuniká mihor?", output: "Komunikashon bon ta trata di skucha, no solamente papia. Weta atenshon na e otro persona, kompronde nan punto di bista, ekspresá bo mes ku klardat i respet. Komunikashon ta puente entre korasónnan.", language: "papiamentu", dialect: "general" },
  { id: "communication_002", category: "communication", input: "Pakiko skucha ta importante?", output: "Skucha ta un arte i un regalo. Ora bo skucha di berdát, bo ta mustra respet, bo ta aprende, bo ta krea konekshon. Skucha ku bo kurason, no solamente ku bo orea.", language: "papiamentu", dialect: "general" },

  // Gratitude & Appreciation
  { id: "gratitude_001", category: "gratitude", input: "Kon mi por mustra gratidat?", output: "Gratidat por mustrá di tantu manera: un 'danki' sinsero, un aksí di bondad, un palabra di apresio. Gratidat ta un aktitud ku ta transformá nos manera di mira bida - krese apresio pa loke nos tin.", language: "papiamentu", dialect: "general" },
  { id: "gratitude_002", category: "gratitude", input: "Pakiko gratidat ta importante?", output: "Gratidat ta kambia nos perspektiva. Ta yuda nos balora loke nos tin, invés di enfokká riba loke nos no tin. Un kurason agradeído ta un kurason kontentu i pashífiko.", language: "papiamentu", dialect: "general" },

  // Hope & Future
  { id: "hope_001", category: "hope_future", input: "Kiko ta speransa?", output: "Speransa ta e kredensia ku mañan por ta mihor ku awor. Ta e forsa ku ta impulsá nos pa sigui dilanti, mes ora kos ta difísil. Speransa ta loke ta mantené nos biba.", language: "papiamentu", dialect: "general" },
  { id: "hope_002", category: "hope_future", input: "Kon mi por krea un futuro mihor?", output: "Futuro ta komensá ku akshonan di awor. Kada desishon chikí ta kontá. Krese bo kurpa, yuda otronan, lanta bo komunidat. Futuro no ta kos ku ta pasa nos - ta kos ku nos ta krea huntu.", language: "papiamentu", dialect: "general" },

  // Peace & Harmony
  { id: "peace_001", category: "peace_harmony", input: "Kon mi por haña pas?", output: "Pas ta komensá aden di nos mes. Ta akseptá loke no por kambia, ta pèrdòna, ta suelta resentimentu. Paz ta un kaminata, no un destinashon. Buska paz aden i bo lo haña e pa fo tambe.", language: "papiamentu", dialect: "general" },
  { id: "peace_002", category: "peace_harmony", input: "Kiko ta pèrdòn?", output: "Pèrdòn ta liberá nos mes di karga pesado di renkura. No ta nifiká ku loke a pasa tabata bon - ta nifiká ku bo no kier karga e peso mas. Pèrdòn ta un regalo ku bo ta duna bo mes.", language: "papiamentu", dialect: "general" },

  // Creativity & Expression
  { id: "creativity_001", category: "creativity", input: "Pakiko kreativitat ta importante?", output: "Kreativitat ta loke ta hasi nos humano. Ta ekspresá nos identidad unik, nos bista di mundu. For di arte te muzik, for di kushiná te konta kuenta - tur ta forma di kreativitat.", language: "papiamentu", dialect: "general" },

  // Unity & Diversity
  { id: "unity_001", category: "unity_diversity", input: "Kon diferensia por hasi nos mas fuerte?", output: "Nos diferensianan ta nos forsa. Kada persona ta trece algo unik - diferente perspektiva, eksperiënsia, talento. Ora nos ta unis den nos diferensia, nos ta krea un komunidat riko i resiliente.", language: "papiamentu", dialect: "general" },

  // Courage
  { id: "courage_001", category: "courage", input: "Kiko ta kurahe?", output: "Kurahe no ta ausencia di miedo - ta eksekutá aksion mes ku bo tin miedo. Ta defende loke ta hustu, ta kana den kaminda deskonosí, ta para pa bo kredensianan. Kurahe ta den tur hende; solamente mester saka e pa fo.", language: "papiamentu", dialect: "general" },

  // Joy & Celebration
  { id: "joy_001", category: "joy_celebration", input: "Pakiko nos mester selebrá?", output: "Selebrá ta honrá bida, ta rekonosé nos logro, ta kompartí alegria. Vida tin tantu desafio; ta importante pa para i apresá momentunan bon. Selebrá ta parti esensial di nos kultura Karibense.", language: "papiamentu", dialect: "general" },

  // Time & Patience
  { id: "time_001", category: "time_patience", input: "Kon mi mester uza mi tempu mihor?", output: "Tempu ta e rekurso mas presiós ku nos tin. No por kumpra bèk e. Usa bo tempu riba kos i hende ku ta importante. Balansa produktivitat ku diskanso, traha ku alegria. Krea memorianan, no solamente chèk listaS.", language: "papiamentu", dialect: "general" },

  // Change & Growth
  { id: "change_001", category: "change_growth", input: "Kon mi mester deal ku kambia?", output: "Kambia ta parti inevitable di bida. Resisti kambia ta krea sufrimentu. Akseptá kambia, adaptá, krese. Rekordá ku kaminda tin kambia, tin oportunidat pa kresementu i konosementu nobo.", language: "papiamentu", dialect: "general" },

  // Success & Achievement
  { id: "achievement_001", category: "achievement", input: "Kon mi por logra mi metanan?", output: "Logro ta kombinatshon di soñá grandi, plania bon, i traha konstante. Partí meta grandi den stap chiki. Selebrá progreso. Persistí ora kos bira difísil. I rekordá - suksesu no ta solo destinashon, ta e biahe tambe.", language: "papiamentu", dialect: "general" },

  // English Translations for Cultural Context
  { id: "bilingual_001", category: "bilingual_support", input: "What is empathy in Caribbean culture?", output: "In Caribbean culture, empathy ('empatia' in Papiamentu) is the ability to feel and deeply understand another person's emotions. It's a fundamental value that defines how we treat each other. We make our hearts feel what the other person is experiencing.\n\nEmpatia ta e kapasidad pa sinti i kompronde emoshon di otro hende profundamente.", language: "english", dialect: "caribbean_english" },
  { id: "bilingual_002", category: "bilingual_support", input: "Why is family important in Caribbean culture?", output: "Family ('famia' in Papiamentu) is the foundation of Caribbean society. Our family is more than just people we share DNA with - it's a network of love, support, and tradition. Family guides us, protects us, and gives us our identity.\n\nFamia ta e funshi di nos sociedat Karibense.", language: "english", dialect: "caribbean_english" },
  { id: "bilingual_003", category: "bilingual_support", input: "What does 'dushi' mean?", output: "'Dushi' is a special Caribbean word meaning 'sweet,' 'dear,' or 'nice.' But it's more than that - it's an expression of love, appreciation, and tenderness. We use 'dushi' to call our loved ones and to express affection. It's a word that carries warmth and cultural identity.", language: "english", dialect: "caribbean_english" },

  // Additional contextual datasets
  { id: "context_001", category: "cultural_context", input: "Pakiko nos ta diferente?", output: "Nos ta diferente paso nos ta resultado di un historia unik - un mekel di kultura Afrika, Européo, i nativo. E diferensia aki ta nos identidad, nos forsa. Nos no ta trata di ta igual ku otro; nos ta orguyo di nos identidad Karibense unik.", language: "papiamentu", dialect: "general" },
];

/**
 * Generate SQL INSERT statements for all datasets
 */
function generateDatasetInserts() {
  const sqlStatements = [];

  sqlStatements.push('-- ================================================================');
  sqlStatements.push('-- Cultural Datasets Migration');
  sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
  sqlStatements.push(`-- Total Datasets: ${FALLBACK_DATASETS.length}`);
  sqlStatements.push('-- ================================================================\n');

  for (const dataset of FALLBACK_DATASETS) {
    // Extract keywords from input and output
    const keywords = [
      ...dataset.input.toLowerCase().split(/\s+/).filter(w => w.length > 3),
      ...dataset.output.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    ].slice(0, 10); // Take first 10 unique keywords

    // Escape single quotes in SQL strings
    const escapeSQL = (str) => str.replace(/'/g, "''");

    const sql = `INSERT INTO cultural_datasets (
  id, category, input, output, language, dialect, keywords, relevance_score
) VALUES (
  '${dataset.id}',
  '${dataset.category}',
  '${escapeSQL(dataset.input)}',
  '${escapeSQL(dataset.output)}',
  '${dataset.language}',
  ${dataset.dialect ? `'${dataset.dialect}'` : 'NULL'},
  '${JSON.stringify(keywords)}',
  1.0
);`;

    sqlStatements.push(sql);
  }

  return sqlStatements.join('\n\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🌴 Reflexhon Global - Dataset Migration Generator\n');
  console.log(`📊 Processing ${FALLBACK_DATASETS.length} cultural datasets...\n`);

  // Generate SQL
  const sql = generateDatasetInserts();

  // Write to file
  const outputPath = path.join(__dirname, '001_insert_datasets.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`✅ Migration file created: ${outputPath}`);
  console.log(`📦 Total datasets: ${FALLBACK_DATASETS.length}`);
  console.log(`📏 File size: ${(sql.length / 1024).toFixed(2)} KB\n`);

  // Statistics
  const categories = {};
  const languages = {};
  const dialects = {};

  FALLBACK_DATASETS.forEach(d => {
    categories[d.category] = (categories[d.category] || 0) + 1;
    languages[d.language] = (languages[d.language] || 0) + 1;
    if (d.dialect) dialects[d.dialect] = (dialects[d.dialect] || 0) + 1;
  });

  console.log('📊 Dataset Statistics:');
  console.log('\nCategories:');
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`);
  });

  console.log('\nLanguages:');
  Object.entries(languages).forEach(([lang, count]) => {
    console.log(`  - ${lang}: ${count}`);
  });

  console.log('\nDialects:');
  Object.entries(dialects).forEach(([dialect, count]) => {
    console.log(`  - ${dialect}: ${count}`);
  });

  console.log('\n✨ Ready to apply to D1 database!');
  console.log('\nNext steps:');
  console.log('1. Initialize D1 database: npx wrangler d1 execute reflexhon_global --file=db/schema.sql');
  console.log('2. Import datasets: npx wrangler d1 execute reflexhon_global --file=db/migrations/001_insert_datasets.sql');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateDatasetInserts, FALLBACK_DATASETS };
