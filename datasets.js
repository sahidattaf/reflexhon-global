// Dataset data - imported from JSONL
// In production, this could be loaded from D1 database or HuggingFace
import { fetchHuggingFaceDataset } from './huggingface.js';
import { DatasetError } from './utils/errors.js';

const FALLBACK_DATASETS = [
  {
    "id": "papiamentu_001",
    "input": "Kiko ta empatia?",
    "output": "Empatia ta e kapasidat pa sinti loke e otro hende ta sinti, pa pone bo mes den su sapatunan i kompronde su emoshonnan i perspektiva. Den nos kultura Karibense, empatia ta fundamental pa mantene armonia den komunidat.",
    "category": "emotions",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_002",
    "input": "Kiko ta amor?",
    "output": "Amor ta e sentimento profundo di afekshon, kuidado i konekshon ku otro hende. Den nos kultura, amor ta ekspresá den akshonan chikitu - un 'bon dia' kálido, kompartí kuminda, i semper ta presente pa bo ser kerí.",
    "category": "emotions",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_007",
    "input": "Kiko ta speransa?",
    "output": "Speransa ta e kreensa ku kosnan mihó ta bini. Den tempu difísil, speransa ta e luz ku ta guia nos. Nos bisabuelonan a enseña nos: 'Despues di anochi, semper ta amanésé.'",
    "category": "emotions",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_013",
    "input": "Kiko ta respet?",
    "output": "Respet ta trata otro hende ku dignidad i konsiderashon. Den nos kultura Karibense, respet ta fundamental - respet pa mayor, pa famia, pa bisiña, i pa nos mes. Sin respet, komunidat no por eksistí.",
    "category": "values",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_014",
    "input": "Kiko ta onestidad?",
    "output": "Onestidad ta biba den berdat i transparensia. Nos ta bisa: 'Berdat ta kla manera solo.' Un hende onesto ta konfiabel, i konfiansa ta base di relashon fuerte.",
    "category": "values",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_018",
    "input": "Kiko ta generosidad?",
    "output": "Generosidad ta kompartí loke nos tin - tempu, rekurso, konosementu - sin spera algu bèk. Den nos kultura, generosidad ta krea bunita i fortalesa komunal.",
    "category": "values",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_025",
    "input": "Kiko ta famia?",
    "output": "Famia ta mas ku sanger - ta e hendenan ku ta kria, guia, i apoya nos. Den nos kultura, famia ta ekstendí: tia, tio, primo, madrina, padrino. 'Famia ta tur kos', nos ta bisa.",
    "category": "family",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_028",
    "input": "Kiko ta papel di mama?",
    "output": "Mama ta e korazón di famia. E ta duna bida, kria, enseña, i semper ta aya. Ningun amor ta mas grandi ku amor di mama. 'Mama ta mama', nos ta bisa ku respet profundo.",
    "category": "family",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_030",
    "input": "Kiko ta wela i welo?",
    "output": "Wela i welo ta tesoro di nos famia. Nan ta sabiduria, historia bibu, i amor inkondesional. Nan ta kontá kuenta, enseña tradishon, i duna nos dulsernan hopi biaha. Nan ta konekshon ku nos pasá.",
    "category": "family",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_035",
    "input": "Kiko ta komunidat?",
    "output": "Komunidat ta mas ku hende bibando serkano - ta sentido di pertenencia, apoyo mutual, i identidad kompartí. Den nos isla, komunidat ta famia ekstendí. Nos ta kuid'otro.",
    "category": "community",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_036",
    "input": "Kiko ta bisiña?",
    "output": "Bisiña ta mas ku hende bibando al lado. Nan ta famia skohe, primera ayudo ora tin problema, i kompaño di dia. 'Bisiña bon ta mihó ku ruman leu', nos ta bisa.",
    "category": "community",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_045",
    "input": "Kiko ta kultura Karibense?",
    "output": "Kultura Karibense ta un mezkla rika di influensha Afrikano, Europeo, i indígeno. Ta vibrant, musikal, alegre, pero tambe resiliente i fuerte. Nos historia ta marka pa sobrevivensia i kreatividad.",
    "category": "culture",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_047",
    "input": "Kiko ta importansia di Karnaval?",
    "output": "Karnaval ta ekspreshon masimo di nos kultura - kolor, musika, baile, kreatividad, i libertat. E ta celebrá bida i uni henter komunidat den alegria kolektivo. Karnaval ta mas ku fiesta, ta identidad.",
    "category": "culture",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_052",
    "input": "Kiko ta relashon ku laman?",
    "output": "Laman ta mas ku hawa - ta parti di nos alma. E ta duna kuminda, trabou, rekreashon, i inspirashon. Laman ta konektá nos ku mundu mas grandi i tambe ta nos kas.",
    "category": "culture",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_055",
    "input": "Kiko ta idioma Papiamentu?",
    "output": "Papiamentu ta nos idioma kreol, nase for di mezkla di Portugues, Ulandes, Spaño, Ingles, i lèngua Afrikano. E ta simbolo di nos identidad i resiliensia. Ta nos bos.",
    "category": "language",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_056",
    "input": "Pakiko Papiamentu ta importante?",
    "output": "Papiamentu ta mas ku forma di komunikashon - ta e medium ku nos ta pensa, sinti, i suña. E ta konektá nos ku nos pasá i ta fuente di identidad kultural. Preservá Papiamentu ta preservá nos mes.",
    "category": "language",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_063",
    "input": "Kon mester trata un mayor?",
    "output": "Mester trata mayor ku máksimo respet - bisa 'bos' en bes di 'bo', para kaba ora nan drenta, skouta ora nan ta papia, i buska nan konsehá. 'Respet pa grande, amor pa chikí', nos ta bisa.",
    "category": "respect",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  },
  {
    "id": "papiamentu_069",
    "input": "Kiko ta konsepto di 'palabra'?",
    "output": "'Palabra ta palabra' - si bo a bisa algo, bo mester kumpli. Bo palabra ta bo honor. Den nos kultura, konfiansa ta basa riba hende ku tin palabra i ku ta kumpli.",
    "category": "respect",
    "language": "papiamentu",
    "cultural_context": "caribbean"
  }
  // Full dataset (70+ entries) available via HuggingFace or in /ai/datasets/data.jsonl
];

// Cache for HuggingFace datasets (in-memory, resets on Worker restart)
// Cache cleared on deployment to pick up latest HuggingFace data
let CACHED_DATASETS = null;
let CACHE_TIMESTAMP = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get all datasets - tries HuggingFace first, falls back to local
 * @param {object} env - Cloudflare environment variables
 */
export async function getAllDatasets(env = {}) {
  // Check cache first
  const now = Date.now();
  if (CACHED_DATASETS && CACHE_TIMESTAMP && (now - CACHE_TIMESTAMP < CACHE_TTL)) {
    return {
      success: true,
      total: CACHED_DATASETS.length,
      data: CACHED_DATASETS,
      metadata: {
        language: "papiamentu",
        purpose: "cultural_alignment",
        last_updated: new Date(CACHE_TIMESTAMP).toISOString(),
        source: "huggingface_cached"
      }
    };
  }

  // Try to fetch from HuggingFace if token is available
  if (env.HF_TOKEN) {
    try {
      const hfResult = await fetchHuggingFaceDataset(
        'reflexhon-global/reflexhon-datasets',
        env.HF_TOKEN
      );

      if (hfResult.success && hfResult.data.length > 0) {
        // Cache the results
        CACHED_DATASETS = hfResult.data;
        CACHE_TIMESTAMP = now;

        return {
          success: true,
          total: hfResult.data.length,
          data: hfResult.data,
          metadata: {
            language: "papiamentu",
            purpose: "cultural_alignment",
            last_updated: new Date().toISOString(),
            source: "huggingface",
            dataset_name: "reflexhon-global/reflexhon-datasets"
          }
        };
      }
    } catch (error) {
      // Log the error but gracefully fall back to local datasets
      if (error instanceof DatasetError) {
        console.warn('HuggingFace dataset fetch failed, using fallback:', error.message);
      } else {
        console.error('Unexpected error fetching HuggingFace dataset:', error);
      }
      // Continue to fallback datasets
    }
  }

  // Fallback to local datasets
  return {
    success: true,
    total: FALLBACK_DATASETS.length,
    data: FALLBACK_DATASETS,
    metadata: {
      language: "papiamentu",
      purpose: "cultural_alignment",
      last_updated: "2025-12-30",
      source: "local_fallback",
      note: "Add HF_TOKEN to environment to load from HuggingFace"
    }
  };
}

/**
 * Synchronous version for backwards compatibility
 */
export function getAllDatasetsSync() {
  return {
    success: true,
    total: CACHED_DATASETS ? CACHED_DATASETS.length : FALLBACK_DATASETS.length,
    data: CACHED_DATASETS || FALLBACK_DATASETS,
    metadata: {
      language: "papiamentu",
      purpose: "cultural_alignment",
      last_updated: CACHE_TIMESTAMP ? new Date(CACHE_TIMESTAMP).toISOString() : "2025-12-30",
      source: CACHED_DATASETS ? "cached" : "local"
    }
  };
}

export function getDatasetById(id) {
  const datasets = CACHED_DATASETS || FALLBACK_DATASETS;
  const dataset = datasets.find(d => d.id === id);

  if (!dataset) {
    return {
      success: false,
      error: {
        message: "Dataset not found",
        id: id
      }
    };
  }

  return {
    success: true,
    data: dataset,
    source: CACHED_DATASETS ? "huggingface" : "local"
  };
}

export function searchDatasets(query) {
  const datasets = CACHED_DATASETS || FALLBACK_DATASETS;
  const results = datasets.filter(d =>
    d.input.toLowerCase().includes(query.toLowerCase()) ||
    d.output.toLowerCase().includes(query.toLowerCase())
  );

  return {
    success: true,
    total: results.length,
    query: query,
    data: results,
    source: CACHED_DATASETS ? "huggingface" : "local"
  };
}
