/**
 * AgriLife Research-to-Field Data Service
 * 
 * Replace with production Research API (e.g., OAKTrust, AgriLife Extension publications, open-access journals).
 */

import { Article, TexasCounty } from '../types/research';

export const INSTITUTION_CONFIG = {
  name: "Texas A&M AgriLife Research & Extension",
  subtitle: "Texas A&M research, made practical.",
  shortName: "Texas A&M AgriLife",
  colors: {
    maroon: "#500000",
    white: "#FFFFFF",
    cardBg: "#F5F5F5",
    bodyText: "#333333",
    successGreen: "#2E7D32",
    draftAmber: "#D97706",
  },
  dataSourceLabel: "Texas A&M AgriLife OAKTrust & Extension Publications",
  extensionDirectoryUrl: "https://counties.agrilife.org/",
  universities: [
    { id: "tamu", name: "Texas A&M AgriLife (Texas)", active: true },
    { id: "pvamu", name: "Prairie View A&M (Texas)", active: false, status: "Coming soon" },
    { id: "ttu", name: "Texas Tech Davis College", active: false, status: "Coming soon" },
    { id: "osu", name: "Oklahoma State Extension", active: false, status: "Coming soon" },
  ],
  counties: [
    {
      name: "Lubbock",
      region: "High Plains",
      lat: 33.5779,
      lon: -101.8552,
      extensionOfficeUrl: "https://lubbock.agrilife.org/",
      primaryCrops: ["Cotton", "Sorghum", "Wheat", "Corn"]
    },
    {
      name: "Brazos",
      region: "Central Texas / Brazos Valley",
      lat: 30.6280,
      lon: -96.3344,
      extensionOfficeUrl: "https://brazos.agrilife.org/",
      primaryCrops: ["Beef Cattle", "Pasture / Hay", "Corn", "Pecans"]
    },
    {
      name: "Hidalgo",
      region: "Rio Grande Valley",
      lat: 26.2034,
      lon: -98.2300,
      extensionOfficeUrl: "https://hidalgo.agrilife.org/",
      primaryCrops: ["Citrus", "Vegetables", "Cotton", "Sugarcane"]
    },
    {
      name: "Williamson",
      region: "Blackland Prairie",
      lat: 30.6480,
      lon: -97.6772,
      extensionOfficeUrl: "https://williamson.agrilife.org/",
      primaryCrops: ["Corn", "Sorghum", "Wheat", "Cover Crops"]
    },
    {
      name: "Castro",
      region: "High Plains",
      lat: 34.5451,
      lon: -102.2638,
      extensionOfficeUrl: "https://castro.agrilife.org/",
      primaryCrops: ["Corn", "Wheat", "Dairy", "Sorghum"]
    },
    {
      name: "Deaf Smith",
      region: "Panhandle",
      lat: 34.9084,
      lon: -102.3274,
      extensionOfficeUrl: "https://deafsmith.agrilife.org/",
      primaryCrops: ["Beef Cattle", "Feed Grains", "Wheat", "Corn"]
    },
    {
      name: "Potter",
      region: "Panhandle",
      lat: 35.2220,
      lon: -101.8313,
      extensionOfficeUrl: "https://potter.agrilife.org/",
      primaryCrops: ["Beef Cattle", "Rangeland", "Wheat"]
    },
    {
      name: "Nueces",
      region: "Coastal Bend",
      lat: 27.8006,
      lon: -97.3964,
      extensionOfficeUrl: "https://nueces.agrilife.org/",
      primaryCrops: ["Cotton", "Grain Sorghum", "Corn"]
    },
    {
      name: "Ellis",
      region: "Blackland Prairie",
      lat: 32.3865,
      lon: -96.8483,
      extensionOfficeUrl: "https://ellis.agrilife.org/",
      primaryCrops: ["Cotton", "Corn", "Beef Cattle", "Wheat"]
    },
    {
      name: "Uvalde",
      region: "Winter Garden",
      lat: 29.2097,
      lon: -99.7862,
      extensionOfficeUrl: "https://uvalde.agrilife.org/",
      primaryCrops: ["Vegetables", "Pecans", "Cotton", "Beef Cattle"]
    },
    {
      name: "Gillespie",
      region: "Hill Country",
      lat: 30.2752,
      lon: -98.8720,
      extensionOfficeUrl: "https://gillespie.agrilife.org/",
      primaryCrops: ["Peaches", "Wine Grapes", "Sheep / Goats", "Pecans"]
    },
    {
      name: "McLennan",
      region: "Central Texas",
      lat: 31.5493,
      lon: -97.1467,
      extensionOfficeUrl: "https://mclennan.agrilife.org/",
      primaryCrops: ["Corn", "Wheat", "Beef Cattle", "Pasture"]
    },
    {
      name: "San Patricio",
      region: "South Texas Gulf Coast",
      lat: 28.0161,
      lon: -97.5186,
      extensionOfficeUrl: "https://sanpatricio.agrilife.org/",
      primaryCrops: ["Grain Sorghum", "Cotton", "Corn"]
    },
    {
      name: "Hale",
      region: "South Plains",
      lat: 34.1856,
      lon: -101.7068,
      extensionOfficeUrl: "https://hale.agrilife.org/",
      primaryCrops: ["Cotton", "Corn", "Grain Sorghum", "Wheat"]
    }
  ] as TexasCounty[]
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "tamu-2024-cot-irr",
    type: "research",
    title: "Deficit Irrigation Strategies in Texas High Plains Cotton: Optimizing Yield per Acre-Inch",
    authors: "Dr. Jourdan Bell, Dr. Katie Lewis, Dr. Dana Porter (Texas A&M AgriLife Research, Amarillo & Lubbock)",
    date: "May 14, 2024",
    source_repository: "OAKTrust",
    source_url: "https://oaktrust.library.tamu.edu/handle/1969.1/cotton-deficit-irrigation-high-plains",
    access: "open",
    crops: ["Cotton"],
    topics: ["irrigation", "drought", "weather"],
    texas_regions: ["High Plains", "Panhandle", "South Plains"],
    full_text: `FIELD STUDY: EVALUATION OF TIMED DEFICIT IRRIGATION IN THE OGALLALA AQUIFER REGION.
Conducted at the Texas A&M AgriLife Research and Extension Center at Lubbock and Halfway, Texas across four growing seasons.
OBJECTIVE: Evaluate whether concentrating limited irrigation capacity during peak squaring through early bloom yields higher lint per acre-inch than uniform deficit spreading.
METHODS: Two deficit levels (40% and 75% crop evapotranspiration ET replacement) were evaluated under low-elevation spray application (LESA) and subsurface drip irrigation (SDI). Treatments timed major water delivery exclusively during the 35-day window from first flower to peak boll fill.
RESULTS: Concentrating irrigation in the flowering window increased lint water-use efficiency by 22% compared to steady deficit application throughout the vegetative stage. Cotton plants tolerated mild early-season vegetative water deficit with no significant boll loss, provided soil moisture was maintained above 60% plant-available water during bloom. Under high winds (>20 mph) and high ambient temperatures (>98°F), daytime LESA spray losses reached up to 31%; night-time or low-drift bubbler application reduced evaporative losses to below 8%.
CAUTIONS: If heat index exceeds 102°F during peak bloom for more than 4 consecutive days without irrigation, square shedding increases by 18%. Growers should monitor soil moisture sensors at 12-inch and 24-inch depths rather than relying on canopy appearance alone.`,
    has_technique: true,
    review_status: "reviewed",
    reviewer_name: "Dr. Jourdan Bell, AgriLife Extension Agronomist",
    image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg",
    takeaway: "Holding back water during early growth and pouring it on during bloom saved 20% on water bills while keeping cotton yields high.",
    spanish_takeaway: "Ahorrar agua al principio del crecimiento y aplicarla durante la floración ahorró 20% en agua manteniendo un alto rendimiento de algodón.",
    plain_summary: {
      what_they_studied: "How to get the most cotton lint out of every gallon of Ogallala aquifer water when pumping capacities are tight.",
      what_found: "You get 22% more cotton per inch of water if you hold back during early leaf growth and save your water for the 35-day flowering and boll-fill window.",
      what_it_means: "Don't rush to irrigate short cotton before first flower unless you are facing severe drought stress. Save your well water for bloom when bolls are setting.",
      things_to_watch: "High winds (over 20 mph) and hot afternoons cause spray water to vanish into the air before hitting soil. Water at night or use drop tubes."
    },
    spanish_plain_summary: {
      what_they_studied: "Cómo obtener el mayor rendimiento de algodón por cada pulgada de agua del acuífero Ogallala con capacidad de bombeo limitada.",
      what_found: "Se obtiene un 22% más de algodón por pulgada de agua si se reserva el agua durante el crecimiento vegetativo temprano y se aplica en el período de floración de 35 días.",
      what_it_means: "No se apresure a regar el algodón joven antes de la primera flor a menos que haya sequía extrema. Guarde el agua para la floración.",
      things_to_watch: "Vientos mayores a 20 mph y tardes muy calurosas provocan evaporación de hasta 31% en aspersores. Riegue de noche o use mangueras colgantes."
    },
    technical_summary: "Multi-year agronomic trial evaluating 40% vs 75% ET replacement in West Texas cotton under SDI and LESA. Timed water allocation between first square and peak bloom increased lint water-use efficiency (WUE) by 22% (p < 0.05). Evaporative canopy losses peaked at 31% under wind speeds >20 mph during daytime hours.",
    weather_guidance: {
      rule: "Switch to nighttime irrigation and avoid daytime spray when afternoon temperatures exceed 95°F and wind speeds top 18 mph.",
      trigger_description: "High evaporation alert: Wind > 18 mph or Temp > 95°F.",
      applicable_conditions: {
        temp_max_f: 95,
        wind_max_mph: 18,
        rain_min_inches: 0.5,
        rain_window_hours: 48
      }
    },
    suggested_questions: [
      "When is the best week to start heavy watering on my cotton?",
      "How much water is lost if I spray during windy Texas afternoons?",
      "What depth should my soil sensors be placed at?"
    ],
    technique_steps: [
      {
        step_number: 1,
        title: "Check Pre-Bloom Soil Moisture",
        description: "Verify that soil moisture at the 12-inch depth is above 40% available water capacity. Withhold heavy irrigation while plants develop taproots.",
        caution: "Do not stress seedlings if topsoil crusting prevents root elongation.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      },
      {
        step_number: 2,
        title: "Identify First Flower (Bloom Start)",
        description: "Scout fields twice weekly. Mark the date when at least 50% of plants show their first white flower in the mid-canopy.",
        caution: "Bloom window starts the 35-day critical irrigation clock.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      },
      {
        step_number: 3,
        title: "Ramp Irrigation to 75% ET Replacement",
        description: "Increase pivot or drip schedule to replace 75% of calculated crop water demand during the 35-day flowering to peak boll fill window.",
        caution: "If daytime winds exceed 20 mph, shift pivot run to 8:00 PM - 8:00 AM.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      },
      {
        step_number: 4,
        title: "Taper Water 30 Days Before Defoliation",
        description: "Cut back water once upper bolls have formed and hardened to encourage natural cutout and boll opening.",
        caution: "Late over-watering promotes regrowth and degrades fiber quality.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      }
    ],
    glossary_terms: [
      {
        term: "Deficit Irrigation",
        definition: "Giving a crop slightly less water than it could theoretically use, applied at the exact growth stage when it matters most.",
        source: "article"
      },
      {
        term: "ET (Evapotranspiration)",
        definition: "The total amount of water lost through plant leaf evaporation and soil drying on a hot day.",
        source: "general"
      },
      {
        term: "LESA",
        definition: "Low-Elevation Spray Application: sprinkler nozzles lowered near the crop canopy on drop hoses to reduce wind drift.",
        source: "article"
      },
      {
        term: "SDI",
        definition: "Subsurface Drip Irrigation: drip lines buried underground directly near plant root zones.",
        source: "general"
      }
    ]
  },
  {
    id: "tamu-2024-cattle-forage",
    type: "research",
    title: "Drought-Resilient Pasture Stocking: Rotational Grazing with Tifton 85 Bermudagrass in Central Texas",
    authors: "Dr. Monte Rouquette Jr., Dr. Larry Redmon (Texas A&M AgriLife Research, Overton & College Station)",
    date: "July 22, 2024",
    source_repository: "AgriLife Extension",
    source_url: "https://oaktrust.library.tamu.edu/handle/1969.1/pasture-stocking-tifton-85-drought",
    access: "open",
    crops: ["Beef Cattle", "Pasture / Hay"],
    topics: ["livestock", "drought", "soil health"],
    texas_regions: ["Central Texas / Brazos Valley", "Blackland Prairie", "Post Oak"],
    full_text: `FIELD BULLETIN: GRAZING INTENSITY AND RECOVERY DYNAMICS IN DRY YEARS.
Investigated over six dry cycles at Texas A&M AgriLife Research Center at Overton and College Station ranch plots.
OBJECTIVE: Compare cow-calf body condition scores and stubble height preservation under continuous stocking versus 4-paddock rotational grazing during summer drought conditions.
FORAGE BASE: Tifton 85 Hybrid Bermudagrass established on sandy loam and black clay loam soils.
FINDINGS: Rotational grazing with 21-day rest periods maintained root depths of 28 inches compared to only 11 inches under continuous heavy grazing. Average daily gain of calves remained at 1.85 lbs/day in rotational pastures versus 1.12 lbs/day in continuously grazed pastures under comparable rainfall.
MINIMUM STUBBLE HEIGHT: Grazing must cease when Tifton 85 canopy height falls to 4 inches. Allowing grazing below 3 inches during July-August reduced next-spring green-up by 40% and invited sandbur and ragweed encroachment.
FERTILITY: Splitting nitrogen applications (50 lbs N/acre in spring, 50 lbs after first grazing cycle) outperformed single spring dumps by reducing nitrate leaching and sustaining forage crude protein above 13%.`,
    has_technique: true,
    review_status: "reviewed",
    reviewer_name: "Dr. Larry Redmon, State Forage Specialist",
    image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg",
    takeaway: "Rotating cows between 4 pasture sections and pulling them off when grass hits 4 inches keeps cattle gaining weight and saves roots through dry summers.",
    spanish_takeaway: "Rotar el ganado entre 4 potreros y retirarlo cuando el pasto baje a 4 pulgadas mantiene el peso del ganado y protege las raíces en sequía.",
    plain_summary: {
      what_they_studied: "How to manage cattle grazing on Tifton 85 bermudagrass during hot, dry Texas summers without killing the pasture.",
      what_found: "Giving grass 3 weeks of rest between grazing kept plant roots more than twice as deep into moisture, and calves gained an extra three-quarters of a pound per day.",
      what_it_means: "Divide pastures with simple electric fencing into at least 4 paddocks. Never let cows graze closer than 4 inches to the ground.",
      things_to_watch: "If you let cows chew grass down below 3 inches in July or August, weeds will take over and next spring's grass will be thin."
    },
    spanish_plain_summary: {
      what_they_studied: "Cómo manejar el pastoreo de ganado en bermuda Tifton 85 durante veranos secos y calurosos de Texas sin degradar la pastura.",
      what_found: "Dar al pasto 3 semanas de descanso entre pastoreos mantuvo raíces el doble de profundas, y los terneros ganaron 0.73 libras adicionales por día.",
      what_it_means: "Divida los potreros con cerca eléctrica en al menos 4 secciones. Nunca permita que el ganado paste a menos de 4 pulgadas de altura.",
      things_to_watch: "Si el ganado come por debajo de 3 pulgadas en julio o agosto, las malezas invadirán y el pasto de primavera se retrasará un 40%."
    },
    technical_summary: "Multi-year rotational grazing evaluation comparing 4-paddock 21-day rest cycles against continuous stocking at 1.2 AU/acre. Rotational stocking increased root biomass (28 in depth vs 11 in, p < 0.01) and improved calf ADG from 1.12 to 1.85 lbs/day. Critical stubble termination threshold established at 4.0 inches (10.1 cm) to prevent root carb depletion.",
    weather_guidance: {
      rule: "During summer heat spells exceeding 100°F without rain for 14+ days, extend rest periods to 28 days or supplement with round bales before grass drops below 4 inches.",
      trigger_description: "Drought pasture alert: Heat > 100°F and rainfall < 0.25 in past 14 days.",
      applicable_conditions: {
        temp_max_f: 100,
        rain_min_inches: 0.25,
        rain_window_hours: 336
      }
    },
    suggested_questions: [
      "What is the absolute minimum grass height before moving cows?",
      "How many days should I rest each paddock in the summer?",
      "Does rotational grazing pay for the cost of temporary electric fencing?"
    ],
    technique_steps: [
      {
        step_number: 1,
        title: "Measure Pasture Height with a Ruler",
        description: "Walk the pasture and check grass height in 10 random spots. Only turn cattle in when Tifton 85 bermudagrass is 8 to 10 inches tall.",
        caution: "Do not guess from the pickup window—walk the paddock.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      },
      {
        step_number: 2,
        title: "Divide Pasture into 4 or More Paddocks",
        description: "Use single-strand high-tensile or polywire electric fence with a solar energizer to create cross-fenced paddocks.",
        caution: "Ensure every paddock has reliable shade and clean livestock water.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      },
      {
        step_number: 3,
        title: "Graze Down to Exactly 4 Inches",
        description: "Move the herd to the next paddock as soon as average grass height reaches 4 inches (roughly the height of a soda can standing upright).",
        caution: "Pull cows out immediately if grass drops toward 3 inches.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      },
      {
        step_number: 4,
        title: "Rest for 21 to 28 Days",
        description: "Allow the grazed paddock 3 to 4 full weeks to rebuild root energy stores before bringing cattle back.",
        caution: "If drought stalls grass growth, feed hay in a sacrifice lot rather than over-grazing.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      }
    ],
    glossary_terms: [
      {
        term: "Stubble Height",
        definition: "The height of standing grass left behind after cattle have grazed an area.",
        source: "article"
      },
      {
        term: "Paddock",
        definition: "A small, fenced section of a larger pasture used to control where animals graze.",
        source: "general"
      },
      {
        term: "AU (Animal Unit)",
        definition: "A standard livestock unit representing one 1,000-pound beef cow with or without an unweaned calf.",
        source: "general"
      },
      {
        term: "ADG (Average Daily Gain)",
        definition: "The number of pounds an animal puts on each day.",
        source: "article"
      }
    ]
  },
  {
    id: "tamu-2024-soil-covercrop",
    type: "research",
    title: "Multi-Species Winter Cover Crops for Soil Water Storage and Weed Suppression in Texas Blackland Prairies",
    authors: "Dr. Ronnie Schnell, Dr. Jake Mowrer, Dr. Tony Provin (Texas A&M AgriLife, College Station & Temple)",
    date: "September 05, 2024",
    source_repository: "OAKTrust",
    source_url: "https://oaktrust.library.tamu.edu/handle/1969.1/soil-health-cover-crops-blackland",
    access: "open",
    crops: ["Corn", "Sorghum", "Wheat", "Cover Crops"],
    topics: ["soil health", "drought", "planting"],
    texas_regions: ["Blackland Prairie", "Central Texas / Brazos Valley"],
    full_text: `RESEARCH REPORT: COVER CROP WATER CONSUMPTION VS INFILTRATION ADVANTAGE.
Conducted at the Stiles Farm Foundation (Thrall, Williamson County) and Texas A&M Research Farm (Burleson County).
SOIL TYPE: Houston Black clay (vertisol).
OBJECTIVE: Determine whether winter cover crops deplete too much soil moisture before spring cash crop planting or if increased rain infiltration compensates for spring corn and sorghum.
TREATMENTS: 1) Fallow check, 2) Pure Elbon cereal rye, 3) 3-species mix (cereal rye + crimson clover + Daikon radish).
RESULTS: The 3-species cover crop mix produced 4,200 lbs/acre dry biomass. While the cover crop extracted 1.8 inches of topsoil water in late February, the thick organic mulch increased spring rainfall infiltration by 48% compared to crusted fallow ground. Spring corn following terminated cover crops had 14% higher plant-available moisture at the 24-inch depth by June. Pigweed and waterhemp weed emergence decreased by 74%.
CRITICAL TERMINATION TIMING: Cover crops must be terminated with glyphosate or roller-crimper at least 3 to 4 weeks before cash crop planting. Terminating late (within 10 days of planting) caused soil drying in the top 3 inches and reduced corn stand emergence by 23%.`,
    has_technique: true,
    review_status: "reviewed",
    reviewer_name: "Dr. Ronnie Schnell, Extension Cropping Systems Agronomist",
    image_url: "/src/assets/images/soil_health_covercrop_1794072806988.jpg",
    takeaway: "Planting a mix of cereal rye, clover, and radish choked out 74% of summer weeds and helped heavy clay soak up nearly 50% more spring rain.",
    spanish_takeaway: "Sembrar una mezcla de centeno, trébol y rábano redujo 74% de malezas y permitió que la arcilla absorbiera 50% más lluvia de primavera.",
    plain_summary: {
      what_they_studied: "Whether growing winter cover crops in Texas black clay soils steals too much moisture from next year's corn and sorghum.",
      what_found: "A mix of cereal rye, crimson clover, and Daikon radish creates a thick mulch blanket that helps soil absorb 48% more rain and cuts pigweed by nearly three-quarters.",
      what_it_means: "Cover crops pay off in heavy clay by stopping rain runoff and keeping roots deep, but you MUST kill the cover crop 3 to 4 weeks before planting your money crop.",
      things_to_watch: "Do not wait until planting week to spray or roll your cover crop. If you terminate late, the cover crop will dry out the seedbed and ruin your corn stand."
    },
    spanish_plain_summary: {
      what_they_studied: "Si cultivar cultivos de cobertura de invierno en suelos de arcilla negra de Texas gasta demasiada humedad para el maíz del año siguiente.",
      what_found: "La mezcla de centeno, trébol y rábano generó un manto orgánico que incrementó la infiltración de lluvia en un 48% y redujo el bledo (pigweed) en un 74%.",
      what_it_means: "Los cultivos de cobertura benefician suelos pesados evitando escurrimiento, pero ES OBLIGATORIO terminarlos 3 a 4 semanas antes de sembrar el cultivo comercial.",
      things_to_watch: "No espere hasta la semana de siembra para secar la cobertura. Si termina tarde, la cobertura secará los primeros 7 cm de suelo y reducirá la germinación del maíz."
    },
    technical_summary: "Agronomic field trial on Houston Black vertisols evaluating 3-species winter cover crops (Secale cereale + Trifolium incarnatum + Raphanus sativus). Increased rainfall infiltration rate by 48% (p < 0.01) and suppressed Amaranthus spp. by 74%. Required termination interval is >=21 days pre-plant to avoid seedzone moisture deficit.",
    weather_guidance: {
      rule: "Terminate cover crops 30 days before planting if winter precipitation has been below 60% of normal, to lock in deep soil moisture reserves.",
      trigger_description: "Dry winter moisture preservation trigger.",
      applicable_conditions: {
        rain_min_inches: 1.0,
        rain_window_hours: 720
      }
    },
    suggested_questions: [
      "Will cover crops steal drinking water from my cash crop in a dry year?",
      "What is the exact deadline to terminate winter rye before corn planting?",
      "Which seed mix works best on heavy Texas black clay?"
    ],
    technique_steps: [
      {
        step_number: 1,
        title: "Seed 3-Species Blend in October/November",
        description: "Drill 30 lbs/acre cereal rye, 8 lbs/acre crimson clover, and 2 lbs/acre Daikon radish after cash crop harvest.",
        caution: "Ensure seed-to-soil contact; do not broadcast without light harrowing.",
        image_url: "/src/assets/images/soil_health_covercrop_1794072806988.jpg"
      },
      {
        step_number: 2,
        title: "Allow Radish Roots to Fracture Soil",
        description: "Let radish roots grow through the winter pan layer. First hard frost (below 25°F) will naturally winterkill radishes, leaving deep root channels.",
        caution: "Decomposing radishes will smell like sulfur for 7 to 10 days in early spring.",
        image_url: "/src/assets/images/soil_health_covercrop_1794072806988.jpg"
      },
      {
        step_number: 3,
        title: "Terminate 3 to 4 Weeks Before Cash Crop",
        description: "Apply glyphosate or use a roller-crimper at rye heading stage, exactly 21 to 28 days before scheduled corn or sorghum planting.",
        caution: "Never delay termination within 14 days of planting.",
        image_url: "/src/assets/images/soil_health_covercrop_1794072806988.jpg"
      },
      {
        step_number: 4,
        title: "Plant Directly Through the Mulch Mat",
        description: "Equip row units with sharp coulters and residue managers to slice through residue without hair-pinning seed into dry straw.",
        caution: "Check planter down-pressure to ensure proper 2-inch seed depth in heavy mulch.",
        image_url: "/src/assets/images/soil_health_covercrop_1794072806988.jpg"
      }
    ],
    glossary_terms: [
      {
        term: "Cover Crop Termination",
        definition: "Killing the winter cover crop (with an herbicide or roller) so it stops drinking water and becomes a protective mulch mat for your cash crop.",
        source: "article"
      },
      {
        term: "Infiltration",
        definition: "How quickly rain soaks into the soil rather than running off into roadside ditches.",
        source: "general"
      },
      {
        term: "Vertisol (Black Clay)",
        definition: "Heavy Texas shrink-swell clay soil that cracks wide open when dry and swells sticky when wet.",
        source: "article"
      },
      {
        term: "Hair-pinning",
        definition: "When a planter disk pushes straw down into the seed furrow instead of cutting through it, preventing the seed from touching moist soil.",
        source: "general"
      }
    ]
  },
  {
    id: "tamu-2024-pest-armyworm",
    type: "research",
    title: "Action Thresholds and Insecticide Selection for Fall Armyworm in Texas Pastures and Grain Sorghum",
    authors: "Dr. David Kerns, Dr. Dalton Ludwick (Texas A&M AgriLife Extension, Lubbock & College Station)",
    date: "August 18, 2024",
    source_repository: "AgriLife Extension",
    source_url: "https://oaktrust.library.tamu.edu/handle/1969.1/fall-armyworm-thresholds-texas",
    access: "open",
    crops: ["Grain Sorghum", "Pasture / Hay", "Corn"],
    topics: ["pests", "weather"],
    texas_regions: ["High Plains", "Central Texas / Brazos Valley", "Coastal Bend", "Blackland Prairie"],
    full_text: `EXTENSION PEST MANAGEMENT ALERT: FALL ARMYWORM (SPODOPTERA FRUGIPERDA).
Field trials conducted across 14 Texas counties during the late summer outbreak cycles.
SCOUTING METHODOLOGY: Inspect pastures and whorl-stage sorghum early in the morning or late evening when larvae are actively feeding. In hay pastures, use a 1-square-foot wire sweep or count larvae per square foot in 10 random locations.
ECONOMIC THRESHOLD: In established bermudagrass hay fields, treat when larval counts exceed 2 to 3 armyworms (1/2 inch or longer) per square foot. In grain sorghum, treat when 30% or more of whorl-stage plants show feeding and larvae are actively present.
INSECTICIDE EFFICACY & RESISTANCE: Pyrethroid-only sprays (e.g., lambda-cyhalothrin) failed to provide acceptable control in 68% of tested field sites due to widespread resistance. Diamide insecticides (chlorantraniliprole / Prevathon / Vantacor) and spinosyns provided 14 to 21 days of residual control with >94% caterpillar mortality.
WEATHER & MIGRATION: Late summer rain events accompanied by southerly winds trigger sudden egg-laying spikes. Inspect fields within 3 days following a tropical rain front.`,
    has_technique: true,
    review_status: "reviewed",
    reviewer_name: "Dr. David Kerns, Statewide IPM Coordinator",
    image_url: "/src/assets/images/grain_sorghum_crop_1794072807359.jpg",
    takeaway: "Older cheap bug sprays no longer kill Texas fall armyworms; check pastures after summer rain and spray only when you find 2 to 3 caterpillars per square foot.",
    spanish_takeaway: "Los insecticidas piretroides ya no eliminan al gusano cogollero por resistencia; fumigue con diamidas solo al encontrar 2 a 3 gusanos por pie cuadrado.",
    plain_summary: {
      what_they_studied: "How to catch fall armyworms before they eat your hay crop or grain sorghum, and which sprays still work in Texas.",
      what_found: "Cheap generic pyrethroid sprays failed nearly 70% of the time due to insect resistance. Modern diamide sprays (like Prevathon/Vantacor) lasted up to 3 weeks and killed over 94% of worms.",
      what_it_means: "Don't waste money spraying cheap chemicals blindly. Count worms on your knees in the morning. If you have 2 to 3 worms per square foot, use a product with proven residual control.",
      things_to_watch: "Southerly winds after summer storms bring massive flights of egg-laying moths. Scout fields 48 hours after rain."
    },
    spanish_plain_summary: {
      what_they_studied: "Cómo detectar el gusano cogollero antes de que devore el heno o sorgo granífero, y qué químicos aún son eficaces en Texas.",
      what_found: "Los insecticidas piretroides genéricos fallaron en un 68% de los sitios evaluados por resistencia. Las diamidas ofrecieron hasta 21 días de control residual con mortalidad superior al 94%.",
      what_it_means: "No gaste dinero aplicando piretroides sin verificar. Si cuenta entre 2 y 3 gusanos por pie cuadrado de al menos media pulgada, aplique productos con residuo prolongado.",
      things_to_watch: "Lluvias de finales de verano acompañadas de vientos del sur provocan oviposición masiva. Monitoree 48 horas después del frente lluvioso."
    },
    technical_summary: "Insecticide screening and threshold calibration for Spodoptera frugiperda across 14 Texas counties. Documented widespread pyrethroid resistance (control failures in 68% of field trials). Ryanodine receptor modulators (chlorantraniliprole) delivered >94% efficacy with 21-day residual. Economic injury level calibrated at 2.5 larvae (>=12mm) per square foot.",
    weather_guidance: {
      rule: "Do not spray when ambient winds exceed 10 mph to prevent drift away from dense pasture canopies, and avoid spraying if rain is forecast within 2 hours unless using rainfast diamides.",
      trigger_description: "Spray drift & rainfastness check: Wind < 10 mph and dry for 2 hours.",
      applicable_conditions: {
        wind_max_mph: 10,
        rain_min_inches: 0.1,
        rain_window_hours: 4
      }
    },
    suggested_questions: [
      "Why didn't my usual cheap bug spray kill the armyworms last month?",
      "How many worms per square foot justify buying a high-end chemical?",
      "Can I cut and bale hay immediately instead of spraying?"
    ],
    technique_steps: [
      {
        step_number: 1,
        title: "Scout Early in the Morning",
        description: "Armyworms hide under thatch during hot sunshine. Walk fields before 9:00 AM or after 7:00 PM.",
        caution: "Do not scout in direct afternoon heat; worms burrow deep into soil cracks.",
        image_url: "/src/assets/images/grain_sorghum_crop_1794072807359.jpg"
      },
      {
        step_number: 2,
        title: "Drop a 1-Square-Foot Wire Frame",
        description: "Count all larvae inside a 12x12 inch square frame across 10 different pasture zones.",
        caution: "Notice worm size: worms under 1/2 inch are easily killed; worms over 1 inch are ready to pupate.",
        image_url: "/src/assets/images/grain_sorghum_crop_1794072807359.jpg"
      },
      {
        step_number: 3,
        title: "Evaluate Threshold (2 to 3 per Sq Ft)",
        description: "If counts average 2 to 3 active worms per square foot and hay is more than 2 weeks from cutting, schedule a spray.",
        caution: "If hay is within 3 days of cutting, harvest the forage early instead of spraying.",
        image_url: "/src/assets/images/grain_sorghum_crop_1794072807359.jpg"
      },
      {
        step_number: 4,
        title: "Apply Insecticide with High Water Volume",
        description: "Use at least 15 to 20 gallons of water per acre by ground rig with medium droplet nozzles to penetrate dense forage canopy.",
        caution: "Low water volume (5 gal/acre) fails to reach caterpillars feeding near the ground.",
        image_url: "/src/assets/images/grain_sorghum_crop_1794072807359.jpg"
      }
    ],
    glossary_terms: [
      {
        term: "Action Threshold",
        definition: "The exact pest density where the crop damage costs more than the price of spraying.",
        source: "article"
      },
      {
        term: "Pyrethroid Resistance",
        definition: "When insects adapt genetics so that older common chemicals no longer kill them.",
        source: "general"
      },
      {
        term: "Diamide (Chlorantraniliprole)",
        definition: "A targeted class of caterpillar insecticides that paralyzes worm feeding while protecting beneficial insects and bees.",
        source: "article"
      },
      {
        term: "Whorl Stage",
        definition: "The young growth stage of corn or sorghum when leaves spiral together before the tassel or seed head emerges.",
        source: "general"
      }
    ]
  },
  {
    id: "tamu-2024-root-rot-flutriafol",
    type: "research",
    title: "Precision In-Furrow Application of Flutriafol for Cotton Root Rot Management in South and Central Texas",
    authors: "Dr. Thomas Isakeit, Dr. Gary Odvody (Texas A&M AgriLife Extension, College Station & Corpus Christi)",
    date: "April 02, 2024",
    source_repository: "OAKTrust",
    source_url: "https://oaktrust.library.tamu.edu/handle/1969.1/cotton-root-rot-flutriafol-tamu",
    access: "open",
    crops: ["Cotton"],
    topics: ["pests", "soil health", "planting"],
    texas_regions: ["Coastal Bend", "Central Texas / Brazos Valley", "Blackland Prairie", "South Texas Gulf Coast"],
    full_text: `FIELD STUDY: FUNGICIDAL DELIVERY DYNAMICS FOR PHYMATOTRICHOPSIS OMNIVORA.
Cotton root rot (Texas root rot) caused by Phymatotrichopsis omnivora remains one of the most destructive soil-borne fungal pathogens in calcareous Texas soils.
EXPERIMENTAL SETUP: Evaluated flutriafol (Topguard Terra) delivery methods over 5 site-years in San Patricio, Nueces, and Williamson counties.
RESULTS: Applying flutriafol at 8 fl oz/acre directly into the seed furrow with a T-band or in-furrow delivery tube at planting delivered an 88% reduction in wilted plants and preserved 410 lbs/acre lint yield in heavily infested zones.
PLACEMENT IS CRITICAL: Placing the chemical more than 1.5 inches above or to the side of the seed caused severe root escape and cut disease protection by more than half. Delivery in at least 5 gallons of water carrier per acre yielded significantly higher root coverage than low-volume delivery.
SITE-SPECIFIC MAPPING: Historical NDVI satellite imagery from previous cotton crops identified root rot patches with 94% spatial fidelity, allowing variable-rate prescription applications that reduced overall chemical expenditure by 43%.`,
    has_technique: true,
    review_status: "ai_draft",
    image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg",
    takeaway: "Putting Topguard Terra right in the seed furrow at planting stops Texas root rot dead in its tracks and can save over 400 pounds of lint per acre.",
    spanish_takeaway: "Colocar Topguard Terra directamente en el surco de siembra frena la pudrición texana y protege más de 400 libras de fibra por acre.",
    plain_summary: {
      what_they_studied: "How to apply flutriafol fungicide into the seed furrow to protect cotton plants from dying suddenly of Texas root rot in July.",
      what_found: "In-furrow treatment reduced dying plants by 88% and preserved 410 lbs of lint per acre in bad root-rot spots. Mapping diseased areas from prior seasons cut chemical costs by 43%.",
      what_it_means: "Equip your planter with direct in-furrow tubes. Only treat known root rot spots using historical yield or satellite maps instead of blanketing clean ground.",
      things_to_watch: "Chemical placement must be right in the seed trench. If nozzles spray chemical off to the side, fungal strands will still reach the taproot."
    },
    spanish_plain_summary: {
      what_they_studied: "Cómo aplicar el fungicida flutriafol en el surco de siembra para evitar que el algodón muera súbitamente por pudrición de raíz texana.",
      what_found: "La aplicación en el surco redujo la mortalidad de plantas en un 88% y protegió 410 libras de fibra por acre. Mapear áreas afectadas redujo el gasto en un 43%.",
      what_it_means: "Instale tubos de aplicación en el surco de la sembradora. Trate únicamente los manchones con historial de la enfermedad usando mapas satelitales.",
      things_to_watch: "La colocación del producto debe ser exacta junto a la semilla. Si el químico cae desviado, el hongo atacará la raíz principal."
    },
    technical_summary: "Evaluation of in-furrow flutriafol (triazole fungicide) for suppression of Phymatotrichopsis omnivora in alkaline vertisols. 8.0 fl oz/acre delivered in-furrow at planting reduced symptomatic wilt incidence by 88% (p < 0.001) with a lint yield increase of 410 lbs/acre in infested zones. Precision zone prescription reduced active ingredient application by 43%.",
    weather_guidance: {
      rule: "Plant only when 4-inch soil temperature reaches 65°F at 8:00 AM for 3 consecutive days to allow rapid cotton seedling emergence before pathogen colonization.",
      trigger_description: "Soil planting temperature check: Soil Temp >= 65°F.",
      applicable_conditions: {
        temp_min_f: 65
      }
    },
    suggested_questions: [
      "Can I apply Topguard Terra with a spray boom over the top of the row?",
      "How do I map where my root rot spots are without walking every acre?",
      "Does this chemical hurt my cotton germination if the soil gets cold and wet?"
    ],
    technique_steps: [
      {
        step_number: 1,
        title: "Map Root Rot Hotspots",
        description: "Use late-season aerial imagery or yield monitor data from previous cotton seasons to map distinct circular dead patches in your field.",
        caution: "Do not waste expensive chemical on clean acres that have no history of root rot.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      },
      {
        step_number: 2,
        title: "Install In-Furrow Delivery Tubes on Planter",
        description: "Mount liquid delivery tubes between the double-disk openers so fungicide drops into the open seed furrow directly with the seed.",
        caution: "Verify tubes are centered and not deflected by seed firmers.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      },
      {
        step_number: 3,
        title: "Calibrate at 6 to 8 fl oz/Acre in 5 Gal Water",
        description: "Calibrate pump rate to deliver labeled rate of flutriafol in at least 5 gallons of water carrier per acre for thorough furrow coverage.",
        caution: "Never apply without carrier liquid; dry formulations are ineffective for root rot.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      },
      {
        step_number: 4,
        title: "Close and Firm the Seed Trench",
        description: "Ensure press wheels seal the furrow firmly over the seed and chemical to prevent sun degradation and evaporation.",
        caution: "Avoid planting into muddy soil where trenches remain open.",
        image_url: "/src/assets/images/cotton_irrigation_field_1794072806153.jpg"
      }
    ],
    glossary_terms: [
      {
        term: "Texas Cotton Root Rot",
        definition: "A destructive fungal soil disease that attacks taproots in alkaline soils, causing healthy green plants to wilt and die in a matter of days during summer.",
        source: "article"
      },
      {
        term: "In-Furrow Application",
        definition: "Spraying liquid fertilizer or chemical directly into the open seed trench right as the seed drops, before closing wheels pack the dirt.",
        source: "general"
      },
      {
        term: "NDVI (Crop Health Satellite Index)",
        definition: "Satellite imagery that measures how green and healthy crops are, highlighting dead circles caused by root rot.",
        source: "general"
      }
    ]
  },
  {
    id: "tamu-2024-hillcountry-peaches",
    type: "news",
    title: "Chilling Hour Trends and Evaporative Cooling for Texas Hill Country Peach Orchards",
    authors: "Dr. Larry Stein, Monte Nesbitt (Texas A&M AgriLife Extension, Uvalde & College Station)",
    date: "February 12, 2024",
    source_repository: "AgriLife Today",
    source_url: "https://agrilifetoday.tamu.edu/2024/02/12/hill-country-peach-chill-hours/",
    access: "summary-only",
    crops: ["Peaches", "Pecans"],
    topics: ["weather", "drought", "planting"],
    texas_regions: ["Hill Country", "Winter Garden", "Central Texas / Brazos Valley"],
    full_text: `EXTENSION ADVISORY SUMMARY: COPING WITH WARM WINTER CHILL HOUR DEFICITS IN FREDERICKSBURG AND THE TEXAS HILL COUNTRY.
Peach and pecan buds require cumulative hours between 32°F and 45°F during dormancy to break evenly in spring. Over the past decade, winter chill hours in Gillespie County averaged 15% below historical 800-hour baselines.
RECOMMENDED VARIETIES: Producers establishing new acreage are strongly advised to select medium to low-chill cultivars requiring 450 to 650 hours (such as 'Harvester', 'Regal', and 'Texstar') rather than traditional 800+ hour varieties.
EVAPORATIVE COOLING: Overhead micro-sprinklers activated during sunny winter afternoons when ambient temperatures exceed 55°F reduced bud temperature by up to 10°F through evaporative cooling, artificially preserving dormant chilling accumulation.
SPRING FROST CAUTION: In seasons following low chill accumulation, bloom is protracted over 4 to 6 weeks, leaving green fruit vulnerable to late March radiational freezes. Keep wind machines and under-tree sprinklers ready.`,
    has_technique: false,
    review_status: "ai_draft",
    image_url: "/src/assets/images/hero_texas_agriculture_1794072805147.jpg",
    takeaway: "Warmer Texas winters mean Hill Country growers should plant peach varieties needing fewer chill hours (450–650 hours) and use overhead sprinklers on warm winter afternoons.",
    spanish_takeaway: "Inviernos más cálidos en Texas indican sembrar duraznos que requieran menos horas frío (450–650 horas) y usar aspersores en tardes cálidas de invierno.",
    plain_summary: {
      what_they_studied: "How peach growers around Fredericksburg can keep fruit trees blooming on time despite mild, warm Texas winters.",
      what_found: "Winter chill hours are running 15% lower than decades past. High-chill varieties bloom unevenly or drop fruit.",
      what_it_means: "When planting new trees, choose varieties bred for 450 to 650 chill hours. On existing orchards, running fine mist sprinklers on sunny 60-degree winter days cools bud wood.",
      things_to_watch: "Trees that don't get enough cold hours bloom slowly over a whole month, putting fruit at risk of late spring freezes."
    },
    spanish_plain_summary: {
      what_they_studied: "Cómo los productores de durazno en Fredericksburg pueden mantener floración uniforme ante inviernos más cálidos.",
      what_found: "Las horas frío invernales han bajado 15% respecto al promedio histórico de 800 horas, afectando variedades tradicionales.",
      what_it_means: "Al plantar nuevos árboles, elija cultivares adaptados a 450-650 horas frío. En árboles existentes, el micro-riego en días invernales cálidos preserva el reposo.",
      things_to_watch: "Los árboles con poco frío florecen de forma despareja durante un mes completo, exponiendo frutos tiernos a heladas tardías de marzo."
    },
    technical_summary: "Observational Extension advisory on chilling hour accumulation in Gillespie County. Winter hours between 0°C and 7.2°C have declined 15% below historical 800-hour baseline. Recommends transitioning to 450-650 chill unit varieties (e.g., 'Harvester', 'Regal') and implementing intermittent evaporative cooling when winter ambient temp >13°C.",
    weather_guidance: {
      rule: "Turn on overhead mist sprinklers when winter afternoon temperatures exceed 55°F between January 1 and February 15 to keep fruit buds dormant.",
      trigger_description: "Winter chill preservation: Winter Temp > 55°F in Jan/Feb.",
      applicable_conditions: {
        temp_min_f: 55
      }
    },
    suggested_questions: [
      "How many chill hours has my county received so far this winter?",
      "Which peach varieties bloom reliably in the Hill Country today?",
      "Can running sprinklers in winter save my orchard from blooming too early?"
    ],
    glossary_terms: [
      {
        term: "Chill Hours",
        definition: "The total number of winter hours when the air stays between 32°F and 45°F, which fruit trees need to wake up and produce fruit in spring.",
        source: "article"
      },
      {
        term: "Evaporative Cooling",
        definition: "Misting fine water droplets into the air on warm days so that evaporating water cools down the tree buds.",
        source: "general"
      }
    ]
  },
  {
    id: "tamu-2024-brush-management",
    type: "research",
    title: "Mesquite and Cedar Brush Management: Target Rates and Timing for Rangeland Water Yield and Forage",
    authors: "Dr. Megan Clayton, Dr. Morgan Treadwell (Texas A&M AgriLife Extension, Corpus Christi & San Angelo)",
    date: "October 11, 2024",
    source_repository: "AgriLife Extension",
    source_url: "https://oaktrust.library.tamu.edu/handle/1969.1/brush-management-mesquite-cedar-texas",
    access: "open",
    crops: ["Beef Cattle", "Pasture / Hay", "Sheep / Goats"],
    topics: ["drought", "livestock", "soil health"],
    texas_regions: ["Hill Country", "Panhandle", "Central Texas / Brazos Valley", "South Texas Gulf Coast"],
    full_text: `FIELD MANUAL & RESEARCH SUMMARY: INDIVIDUAL PLANT TREATMENT (IPT) FOR HONEY MESQUITE AND ASHE JUNIPER.
Investigated over 8 years across Western Cross Timbers, Edwards Plateau, and Rolling Plains rangeland sites.
OBJECTIVE: Compare cost-per-acre and native perennial grass recovery between mechanical grubbing, broadcast aerial herbicide, and Individual Plant Treatment (IPT) stem spraying.
RESULTS: On rangeland with brush densities below 350 trees/acre, IPT stem spraying using triclopyr ester (Remedy Ultra / triclopyr 4 EC) mixed in diesel fuel (15% chemical, 85% diesel or basal oil) achieved 92% root kill at an average cost of $28/acre, compared to $85/acre for mechanical dozing.
PERENNIAL GRASS RESPONSE: Removing dense brush canopy increased native warm-season grass basal cover (sideoats grama, little bluestem) by 65% within two growing seasons, returning stocking carrying capacity from 1 AU per 35 acres to 1 AU per 18 acres.
APPLICATION TIMING: Foliar mesquite spraying is strictly effective only when soil temperature at 12-inch depth reaches 75°F and leaves have transitioned from light green to dark green, mature waxy leaves (typically mid-May through July). Basal stem spray can be performed year-round except when ground is frozen or stems are wet.`,
    has_technique: true,
    review_status: "reviewed",
    reviewer_name: "Dr. Megan Clayton, Rangeland Extension Specialist",
    image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg",
    takeaway: "Spraying honey mesquite and cedar trunks with a 15% triclopyr-in-diesel mix kills 92% of trees for under $30 an acre and doubles pasture grazing capacity.",
    spanish_takeaway: "Fumigar los troncos de mezquite y cedro con 15% de triclopir en diésel elimina el 92% de los árboles por menos de $30/acre y duplica el forraje.",
    plain_summary: {
      what_they_studied: "The cheapest and most reliable way to kill honey mesquite and cedar on Texas ranches to bring back native grazing grasses.",
      what_found: "Spraying individual tree trunks with a 15% triclopyr and diesel mix killed 92% of trees at less than a third the cost of a bulldozer, and native grass doubled in two years.",
      what_it_means: "If you have under 350 brush trees per acre, don't hire a dozer. Use a backpack or ATV sprayer with a basal stem wand to treat individual trunks year-round.",
      things_to_watch: "Never do basal spraying when trunks are wet from rain, because diesel and herbicide will slide off the bark without penetrating the root crown."
    },
    spanish_plain_summary: {
      what_they_studied: "La manera más económica y efectiva de controlar mezquite y cedro en ranchos de Texas para restaurar pastos nativos.",
      what_found: "La aplicación basal individual (IPT) con 15% triclopir en diésel logró un 92% de mortandad por $28/acre frente a $85/acre con maquinaria pesada.",
      what_it_means: "Si tiene densidades menores a 350 árboles por acre, aplique rocío basal al tronco con mochila o cuatrimoto en lugar de usar tractor.",
      things_to_watch: "Nunca aplique si los troncos están húmedos por lluvia reciente; el aceite y el herbicida se resbalarán sin penetrar la corteza."
    },
    technical_summary: "Long-term rangeland study comparing Individual Plant Treatment (IPT), mechanical excavation, and broadcast aerial application for Prosopis glandulosa and Juniperus ashei. Basal stem application (15% triclopyr ester v/v in diesel) achieved 92% root mortality at $28/acre. Grass basal cover increased by 65%, improving carrying capacity from 35 to 18 acres/AU.",
    weather_guidance: {
      rule: "Do not apply basal stem herbicide when tree bark is wet from rain or morning dew, and delay foliar mesquite spraying if drought has caused leaves to curl or drop.",
      trigger_description: "Basal stem moisture restriction: Bark must be dry; no rain in previous 12 hours.",
      applicable_conditions: {
        rain_min_inches: 0.05,
        rain_window_hours: 12
      }
    },
    suggested_questions: [
      "Can I use off-road diesel for my mesquite stem spray mixture?",
      "How tall should the spray go up the trunk of each tree?",
      "What time of year is best for basal bark spraying?"
    ],
    technique_steps: [
      {
        step_number: 1,
        title: "Mix 15% Triclopyr Ester in Diesel",
        description: "Mix 1.25 pints of triclopyr ester (Remedy Ultra or generic 4 lb/gal triclopyr) per gallon of diesel fuel or commercial basal bark oil. Add blue marker dye.",
        caution: "Wear nitrile gloves and eye protection; diesel damages ordinary latex gloves.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      },
      {
        step_number: 2,
        title: "Ensure Trunks and Bark are Completely Dry",
        description: "Check the base of the tree. Bark must be bone dry to absorb the oil carrier into the cambium layer.",
        caution: "Do not treat within 12 hours after rainfall or heavy morning dew.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      },
      {
        step_number: 3,
        title: "Spray Trunk from 12 Inches Down to Ground",
        description: "Use a small cone nozzle (5500-X1 or X2). Wet the trunk thoroughly all the way around from 12 to 14 inches high down to the ground line, puddling slightly at the root crown.",
        caution: "Spray all multiple stems on a tree—skipping one stem lets the root system survive.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      },
      {
        step_number: 4,
        title: "Leave Standing for 1 Year Before Clearing",
        description: "Do not cut or push the dead tree for at least 12 months so the herbicide completely translocates and kills the subterranean bud zone.",
        caution: "Cutting too early causes aggressive regrowth from sleeping root buds.",
        image_url: "/src/assets/images/texas_cattle_pasture_1794072808863.jpg"
      }
    ],
    glossary_terms: [
      {
        term: "IPT (Individual Plant Treatment)",
        definition: "Treating specific pest trees one by one with a targeted wand, rather than blanketing the whole pasture with a plane or tractor.",
        source: "article"
      },
      {
        term: "Basal Bark Spray",
        definition: "Spraying chemical mixed in oil onto the lower 12 to 14 inches of tree bark so it soaks into the plant's living layer.",
        source: "general"
      },
      {
        term: "Bud Zone",
        definition: "The underground crown of mesquite trees with hidden buds that sprout into new trunks if only top branches are cut.",
        source: "article"
      }
    ]
  }
];

export interface ArticleFilters {
  crop?: string;
  topic?: string;
  region?: string;
  type?: string;
  county?: string;
}

/**
 * Fetch articles with simulated network delay.
 * Replace with production Research API (e.g., OAKTrust, AgriLife Extension publications, open-access journals).
 */
export async function getArticles(filters?: ArticleFilters): Promise<Article[]> {
  await new Promise((resolve) => setTimeout(resolve, 180));

  let results = [...INITIAL_ARTICLES];

  // Load any reviewer updates saved in localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('agrilife_reviewed_articles');
      if (stored) {
        const reviewedMap: Record<string, Partial<Article>> = JSON.parse(stored);
        results = results.map(art => {
          if (reviewedMap[art.id]) {
            return { ...art, ...reviewedMap[art.id] };
          }
          return art;
        });
      }
    } catch {
      // Local storage fallback
    }
  }

  if (!filters) return results;

  if (filters.type && filters.type !== 'all') {
    results = results.filter((a) => a.type === filters.type);
  }

  if (filters.crop && filters.crop !== 'all') {
    results = results.filter((a) =>
      a.crops.some((c) => c.toLowerCase().includes(filters.crop!.toLowerCase()))
    );
  }

  if (filters.topic && filters.topic !== 'all') {
    results = results.filter((a) =>
      a.topics.some((t) => t.toLowerCase() === filters.topic!.toLowerCase())
    );
  }

  if (filters.region && filters.region !== 'all') {
    results = results.filter((a) =>
      a.texas_regions.some((r) => r.toLowerCase().includes(filters.region!.toLowerCase()))
    );
  }

  // Personalization: If a county is passed, prioritize articles matching that county's region or crops
  if (filters.county) {
    const countyObj = INSTITUTION_CONFIG.counties.find(
      (c) => c.name.toLowerCase() === filters.county!.toLowerCase()
    );
    if (countyObj) {
      results.sort((a, b) => {
        const aMatchesRegion = a.texas_regions.some(
          (r) => r.toLowerCase() === countyObj.region.toLowerCase()
        );
        const bMatchesRegion = b.texas_regions.some(
          (r) => r.toLowerCase() === countyObj.region.toLowerCase()
        );
        const aMatchesCrop = a.crops.some((c) => countyObj.primaryCrops.includes(c));
        const bMatchesCrop = b.crops.some((c) => countyObj.primaryCrops.includes(c));

        const scoreA = (aMatchesRegion ? 2 : 0) + (aMatchesCrop ? 1 : 0);
        const scoreB = (bMatchesRegion ? 2 : 0) + (bMatchesCrop ? 1 : 0);
        return scoreB - scoreA;
      });
    }
  }

  return results;
}

/**
 * Fetch a single article by ID.
 * Replace with production Research API (e.g., OAKTrust, AgriLife Extension publications, open-access journals).
 */
export async function getArticle(id: string): Promise<Article | null> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const articles = await getArticles();
  return articles.find((a) => a.id === id) || null;
}

/**
 * Search articles by text query.
 * Replace with production Research API (e.g., OAKTrust, AgriLife Extension publications, open-access journals).
 */
export async function searchArticles(query: string, filters?: ArticleFilters): Promise<Article[]> {
  const all = await getArticles(filters);
  const q = query.trim().toLowerCase();
  if (!q) return all;

  return all.filter((a) => {
    return (
      a.title.toLowerCase().includes(q) ||
      a.takeaway.toLowerCase().includes(q) ||
      a.plain_summary.what_they_studied.toLowerCase().includes(q) ||
      a.plain_summary.what_found.toLowerCase().includes(q) ||
      a.crops.some((c) => c.toLowerCase().includes(q)) ||
      a.topics.some((t) => t.toLowerCase().includes(q)) ||
      a.texas_regions.some((r) => r.toLowerCase().includes(q))
    );
  });
}

/**
 * Save reviewer approval in localStorage so status updates across the app.
 */
export function saveReviewerApproval(articleId: string, reviewerName: string, updatedSummaries?: { plain?: any; spanish?: any }) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('agrilife_reviewed_articles');
    const map = stored ? JSON.parse(stored) : {};
    map[articleId] = {
      review_status: 'reviewed',
      reviewer_name: reviewerName,
      ...(updatedSummaries?.plain ? { plain_summary: updatedSummaries.plain } : {}),
      ...(updatedSummaries?.spanish ? { spanish_plain_summary: updatedSummaries.spanish } : {}),
    };
    localStorage.setItem('agrilife_reviewed_articles', JSON.stringify(map));
  } catch (e) {
    console.error("Failed to save reviewer approval:", e);
  }
}
