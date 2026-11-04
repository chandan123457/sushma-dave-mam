/**
 * Editorial content written for the first version of the site. Everything here is
 * grounded in the Google Scholar profile and the JIET faculty page, and is fully
 * editable from the admin panel afterwards.
 */

export const profileContent = {
  name: "Sushma Dave",
  honorific: "Dr.",
  designation: "Professor of Chemistry",
  department: "Department of Applied Sciences",
  institution: "Jodhpur Institute of Engineering & Technology",
  location: "Jodhpur, Rajasthan, India",
  tagline:
    "Research in electrochemistry, biosensors and nanomaterials, with applications in infectious-disease diagnostics and the treatment of industrial dye effluents.",
  shortBio:
    "Dr. Sushma Dave is Professor of Chemistry in the Department of Applied Sciences at the Jodhpur Institute of Engineering & Technology, where she has taught since 1999. Her research spans electrochemistry, biosensors, nanomaterials and environmental remediation, and she has authored more than one hundred publications, including edited volumes with Springer Nature, Wiley-VCH and Elsevier.",
  bio: [
    "Dr. Sushma Dave completed her undergraduate, postgraduate and doctoral studies at Jai Narain Vyas University, Jodhpur, earning her Ph.D. in 1999. Her doctoral and early work was rooted in electroanalytical chemistry — voltammetric studies of nitroaromatics, furfural and pesticides such as endosulfan at different electrodes — a foundation that still shapes how she approaches every sensing problem.",
    "At JIET her teaching spans Engineering Chemistry, Environmental Chemistry, Solid Waste Management, Biology for Engineers, Food Safety and Nutrition.",
    "Her research has since widened into point-of-care biosensors for infectious diseases, metal–organic frameworks and bio-waste-derived carbon materials for electrochemical sensing, green-synthesised nanoparticles, and the photocatalytic and microbial degradation of textile dyes. More recent work brings computational tools — artificial neural networks, cheminformatics and immunoinformatics — to drug repurposing against SARS-CoV-2 and bacterial adhesion targets.",
    "She has co-edited volumes including Point-of-Care Biosensors for Infectious Diseases (Wiley-VCH, 2023), Trends and Contemporary Technologies for Photocatalytic Degradation of Dyes (Springer, 2022) and Bio-waste-derived Carbon Materials and their Applications, especially as Sensors (Elsevier, 2025), and collaborates widely with researchers across India.",
  ].join("\n\n"),
  email: "sushma.dave@jietjodhpur.ac.in",
  altEmail: "sushmadave26@gmail.com",
  phone: null,
  scholarUrl: "https://scholar.google.com/citations?user=ZYqkgAoAAAAJ&hl=en",
  institutionUrl: "https://www.jietjodhpur.ac.in/mentor/dr-sushma-dave",
  education: [
    { degree: "LL.B.", institution: "", year: "2018" },
    { degree: "Ph.D.", institution: "Jai Narain Vyas University, Jodhpur", year: "1999" },
    { degree: "Post-graduation", institution: "Jai Narain Vyas University, Jodhpur", year: "1993" },
    { degree: "Graduation", institution: "Jai Narain Vyas University, Jodhpur", year: "1991" },
  ],
  courses: [
    "Engineering Chemistry",
    "Environmental Chemistry",
    "Solid Waste Management",
    "Biology for Engineers",
    "Food Safety",
    "Nutrition",
  ],
};

export const researchContent = [
  {
    title: "Electrochemistry & Biosensors",
    summary:
      "Electrochemical sensing from first principles — voltammetry and impedance at modified electrodes — carried into point-of-care biosensors for clinical and environmental analytes.",
    description:
      "The work began with voltammetric studies of organic molecules and pesticides at different electrodes, and has grown into the design of sensing interfaces: nickel oxide nanoparticles with superior electrochemical sensing performance, metal–organic framework (MOF) biosensors, CRISPR/Cas-based electrochemical detection of RNA, and 3D-printed micro- and nanosensors.\n\nCyclic voltammetry and electrochemical impedance spectroscopy remain the core toolkit, used both to build sensors and to decipher electron-transfer processes at biointerfaces and biofilms.",
    keywords: ["electrochem", "biosensor", "voltammetr", "sensor", "electrode", "impedance", "metal-organic"],
    sortOrder: 1,
  },
  {
    title: "Infectious Disease Diagnostics & Drug Repurposing",
    summary:
      "Point-of-care diagnostics for emerging and re-emerging infections, alongside computational searches for repurposed drugs and vaccine targets.",
    description:
      "On the diagnostic side this includes lab-on-a-chip devices, silicon-nanowire sensors, quantum-dot-enabled assays and magnetic digital microfluidics for near-patient testing.\n\nOn the therapeutic side, artificial neural networks, graph-theoretical descriptors and molecular modelling are used to identify candidates such as vitamin B12 and GS-441524 against SARS-CoV-2 proteins, and D-mannose analogues as FimH inhibitors — together with machine-learning approaches to reverse vaccinology.",
    keywords: ["infectious", "sars", "covid", "mannose", "fimh", "vaccin", "point-of-care", "point of care", "tuberculosis", "disease"],
    sortOrder: 2,
  },
  {
    title: "Nanomaterials",
    summary:
      "Green and biological routes to metal, metal-oxide and carbon nanostructures — and the mechanisms that govern how they form and perform.",
    description:
      "Plant extracts, fungi and bacteria are used to synthesise silver, copper, platinum, palladium, zinc and magnetic iron-oxide nanoparticles, studying the rate-limiting steps of green synthesis and their electrochemical and spectral signatures.\n\nA growing strand turns agricultural and biological waste into porous carbons for sensing, energy harvesting, drug delivery and imaging.",
    keywords: ["nano", "carbon", "quantum dot", "mesoporous", "magnetic"],
    sortOrder: 3,
  },
  {
    title: "Photocatalytic Degradation of Dyes",
    summary:
      "Using light-activated catalysts to break down persistent textile dyes, and modelling the kinetics mathematically to optimise the process.",
    description:
      "Rajasthan's textile clusters discharge effluents rich in azo and reactive dyes. This line of work develops photocatalysts — green-synthesised metal nanoparticles, doped semiconductors and MWCNT/β-ZnMoO₄ composites — and pairs experiments with fractional and response-surface mathematical models of the degradation.\n\nIt was supported by a TEQIP-III / RTU project on mathematical modelling of nanoparticle-induced photocatalytic degradation of dyes in textile effluents.",
    keywords: ["dye", "photocatal", "pigment", "nitrobenzene", "degradation"],
    sortOrder: 4,
  },
  {
    title: "Environmental Remediation",
    summary:
      "Microbial, enzymatic and adsorptive strategies for cleaning water and soil — from bioreactors to biochar.",
    description:
      "Studies range from enzyme-mediated bacterial biotransformation of chromium-complex dyes and fixed-film bioreactors for dye wastewater, to moving bed biofilm reactors, biopharmaceutical effluent treatment, heavy-metal removal with biochar, and electrochemical monitoring of pollutants.\n\nEarlier work in soil biochemistry examined mycorrhizal fungi, phosphorus mobilisation and drought tolerance in dryland crops.",
    keywords: ["bioremediation", "pollut", "wastewater", "effluent", "water", "heavy metal", "biofilm", "mycorrhiz"],
    sortOrder: 5,
  },
];

export const projectContent = [
  {
    title: "Mathematical modelling of nanoparticle-induced photocatalytic degradation of dyes in textile effluents",
    funder: "TEQIP-III / Rajasthan Technical University (CRS)",
    amount: "₹2,00,000",
    role: "Principal Investigator",
    status: "completed" as const,
    period: null,
    description: "Non-syllabus collaborative research scheme project sanctioned under TEQIP-III.",
    sortOrder: 1,
  },
  {
    title: "Novel materials for environmental remediation, biosensor development and drug repurposing for infectious diseases",
    funder: null,
    amount: null,
    role: null,
    status: "ongoing" as const,
    period: null,
    description: "Current research focus spanning materials synthesis, electrochemical biosensing and computational drug repurposing.",
    sortOrder: 2,
  },
];

export const newsContent = [
  {
    title: "Bio-waste-derived Carbon Materials and their Applications, especially as Sensors — published by Elsevier",
    body: "A co-edited volume on turning biological waste into carbon materials for electrochemical sensing, energy and remediation.",
    date: "2025-01-01",
  },
  {
    title: "Point-of-Care Biosensors for Infectious Diseases — published by Wiley-VCH",
    body: "Co-edited with Dr. Jayashankar Das, covering optical and electrochemical techniques for near-patient diagnosis.",
    date: "2023-01-01",
  },
  {
    title: "Trends and Contemporary Technologies for Photocatalytic Degradation of Dyes — published by Springer",
    body: "An edited volume on photocatalysts, doped semiconductors and process optimisation for dye-laden effluents.",
    date: "2022-01-01",
  },
];

// Titles of edited volumes / monographs on the Scholar profile.
export const BOOK_TITLES = [
  "trends and contemporary technologies for photocatalytic degradation of dyes",
  "advanced nanomaterials for point-of-care diagnosis and therapy",
  "biosensors for emerging and re-emerging infectious diseases",
  "point-of-care biosensors for infectious diseases",
  "bio-waste-derived carbon materials and their applications, especially as sensors",
  "nanomaterials and point of care technologies",
  "reverse vaccinology: concept, methods and advancement",
  "photocatalytic degradation of dyes: current trends and future perspectives",
  "electrochemical applications of metal-organic frameworks",
];

// Garbled or partial records imported by Google Scholar. Kept, but hidden until reviewed.
export const HIDDEN_TITLE_PATTERNS = [
  /^and sushma dave/i,
  /fundamentals maheswata/i,
  /^informatics in medicine unlocked$/i,
  /^role of are uscular/i,
  /^trends and contemporary technologies for photocatalytic$/i,
  /^research article /i,
];
