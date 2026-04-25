// Generate 118 elements and assign their periodic grid locations
export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  group: string;
  period: number;
  category: string;
  electrons: number[];
  description: string;
  uses: string;
  gridRow: number;
  gridCol: number;
  specialty: string;
  danger: string;
}

const rawData = [
  "1|H|Hydrogen|nonmetal|1|1|1",
  "2|He|Helium|noble-gas|2|1|18",
  "3|Li|Lithium|alkali-metal|2,1|2|1",
  "4|Be|Beryllium|alkaline-earth|2,2|2|2",
  "5|B|Boron|metalloid|2,3|2|13",
  "6|C|Carbon|nonmetal|2,4|2|14",
  "7|N|Nitrogen|nonmetal|2,5|2|15",
  "8|O|Oxygen|nonmetal|2,6|2|16",
  "9|F|Fluorine|halogen|2,7|2|17",
  "10|Ne|Neon|noble-gas|2,8|2|18",
  "11|Na|Sodium|alkali-metal|2,8,1|3|1",
  "12|Mg|Magnesium|alkaline-earth|2,8,2|3|2",
  "13|Al|Aluminum|post-transition|2,8,3|3|13",
  "14|Si|Silicon|metalloid|2,8,4|3|14",
  "15|P|Phosphorus|nonmetal|2,8,5|3|15",
  "16|S|Sulfur|nonmetal|2,8,6|3|16",
  "17|Cl|Chlorine|halogen|2,8,7|3|17",
  "18|Ar|Argon|noble-gas|2,8,8|3|18",
  "19|K|Potassium|alkali-metal|2,8,8,1|4|1",
  "20|Ca|Calcium|alkaline-earth|2,8,8,2|4|2",
  "21|Sc|Scandium|transition-metal|2,8,9,2|4|3",
  "22|Ti|Titanium|transition-metal|2,8,10,2|4|4",
  "23|V|Vanadium|transition-metal|2,8,11,2|4|5",
  "24|Cr|Chromium|transition-metal|2,8,13,1|4|6",
  "25|Mn|Manganese|transition-metal|2,8,13,2|4|7",
  "26|Fe|Iron|transition-metal|2,8,14,2|4|8",
  "27|Co|Cobalt|transition-metal|2,8,15,2|4|9",
  "28|Ni|Nickel|transition-metal|2,8,16,2|4|10",
  "29|Cu|Copper|transition-metal|2,8,18,1|4|11",
  "30|Zn|Zinc|transition-metal|2,8,18,2|4|12",
  "31|Ga|Gallium|post-transition|2,8,18,3|4|13",
  "32|Ge|Germanium|metalloid|2,8,18,4|4|14",
  "33|As|Arsenic|metalloid|2,8,18,5|4|15",
  "34|Se|Selenium|nonmetal|2,8,18,6|4|16",
  "35|Br|Bromine|halogen|2,8,18,7|4|17",
  "36|Kr|Krypton|noble-gas|2,8,18,8|4|18",
  "37|Rb|Rubidium|alkali-metal|2,8,18,8,1|5|1",
  "38|Sr|Strontium|alkaline-earth|2,8,18,8,2|5|2",
  "39|Y|Yttrium|transition-metal|2,8,18,9,2|5|3",
  "40|Zr|Zirconium|transition-metal|2,8,18,10,2|5|4",
  "41|Nb|Niobium|transition-metal|2,8,18,12,1|5|5",
  "42|Mo|Molybdenum|transition-metal|2,8,18,13,1|5|6",
  "43|Tc|Technetium|transition-metal|2,8,18,13,2|5|7",
  "44|Ru|Ruthenium|transition-metal|2,8,18,15,1|5|8",
  "45|Rh|Rhodium|transition-metal|2,8,18,16,1|5|9",
  "46|Pd|Palladium|transition-metal|2,8,18,18|5|10",
  "47|Ag|Silver|transition-metal|2,8,18,18,1|5|11",
  "48|Cd|Cadmium|transition-metal|2,8,18,18,2|5|12",
  "49|In|Indium|post-transition|2,8,18,18,3|5|13",
  "50|Sn|Tin|post-transition|2,8,18,18,4|5|14",
  "51|Sb|Antimony|metalloid|2,8,18,18,5|5|15",
  "52|Te|Tellurium|metalloid|2,8,18,18,6|5|16",
  "53|I|Iodine|halogen|2,8,18,18,7|5|17",
  "54|Xe|Xenon|noble-gas|2,8,18,18,8|5|18",
  "55|Cs|Cesium|alkali-metal|2,8,18,18,8,1|6|1",
  "56|Ba|Barium|alkaline-earth|2,8,18,18,8,2|6|2",
  "57|La|Lanthanum|lanthanide|2,8,18,18,9,2|9|4",
  "58|Ce|Cerium|lanthanide|2,8,18,19,9,2|9|5",
  "59|Pr|Praseodymium|lanthanide|2,8,18,21,8,2|9|6",
  "60|Nd|Neodymium|lanthanide|2,8,18,22,8,2|9|7",
  "61|Pm|Promethium|lanthanide|2,8,18,23,8,2|9|8",
  "62|Sm|Samarium|lanthanide|2,8,18,24,8,2|9|9",
  "63|Eu|Europium|lanthanide|2,8,18,25,8,2|9|10",
  "64|Gd|Gadolinium|lanthanide|2,8,18,25,9,2|9|11",
  "65|Tb|Terbium|lanthanide|2,8,18,27,8,2|9|12",
  "66|Dy|Dysprosium|lanthanide|2,8,18,28,8,2|9|13",
  "67|Ho|Holmium|lanthanide|2,8,18,29,8,2|9|14",
  "68|Er|Erbium|lanthanide|2,8,18,30,8,2|9|15",
  "69|Tm|Thulium|lanthanide|2,8,18,31,8,2|9|16",
  "70|Yb|Ytterbium|lanthanide|2,8,18,32,8,2|9|17",
  "71|Lu|Lutetium|lanthanide|2,8,18,32,9,2|9|18",
  "72|Hf|Hafnium|transition-metal|2,8,18,32,10,2|6|4",
  "73|Ta|Tantalum|transition-metal|2,8,18,32,11,2|6|5",
  "74|W|Tungsten|transition-metal|2,8,18,32,12,2|6|6",
  "75|Re|Rhenium|transition-metal|2,8,18,32,13,2|6|7",
  "76|Os|Osmium|transition-metal|2,8,18,32,14,2|6|8",
  "77|Ir|Iridium|transition-metal|2,8,18,32,15,2|6|9",
  "78|Pt|Platinum|transition-metal|2,8,18,32,17,1|6|10",
  "79|Au|Gold|transition-metal|2,8,18,32,18,1|6|11",
  "80|Hg|Mercury|transition-metal|2,8,18,32,18,2|6|12",
  "81|Tl|Thallium|post-transition|2,8,18,32,18,3|6|13",
  "82|Pb|Lead|post-transition|2,8,18,32,18,4|6|14",
  "83|Bi|Bismuth|post-transition|2,8,18,32,18,5|6|15",
  "84|Po|Polonium|metalloid|2,8,18,32,18,6|6|16",
  "85|At|Astatine|halogen|2,8,18,32,18,7|6|17",
  "86|Rn|Radon|noble-gas|2,8,18,32,18,8|6|18",
  "87|Fr|Francium|alkali-metal|2,8,18,32,18,8,1|7|1",
  "88|Ra|Radium|alkaline-earth|2,8,18,32,18,8,2|7|2",
  "89|Ac|Actinium|actinide|2,8,18,32,18,9,2|10|4",
  "90|Th|Thorium|actinide|2,8,18,32,18,10,2|10|5",
  "91|Pa|Protactinium|actinide|2,8,18,32,20,9,2|10|6",
  "92|U|Uranium|actinide|2,8,18,32,21,9,2|10|7",
  "93|Np|Neptunium|actinide|2,8,18,32,22,9,2|10|8",
  "94|Pu|Plutonium|actinide|2,8,18,32,24,8,2|10|9",
  "95|Am|Americium|actinide|2,8,18,32,25,8,2|10|10",
  "96|Cm|Curium|actinide|2,8,18,32,25,9,2|10|11",
  "97|Bk|Berkelium|actinide|2,8,18,32,27,8,2|10|12",
  "98|Cf|Californium|actinide|2,8,18,32,28,8,2|10|13",
  "99|Es|Einsteinium|actinide|2,8,18,32,29,8,2|10|14",
  "100|Fm|Fermium|actinide|2,8,18,32,30,8,2|10|15",
  "101|Md|Mendelevium|actinide|2,8,18,32,31,8,2|10|16",
  "102|No|Nobelium|actinide|2,8,18,32,32,8,2|10|17",
  "103|Lr|Lawrencium|actinide|2,8,18,32,32,8,3|10|18",
  "104|Rf|Rutherfordium|transition-metal|2,8,18,32,32,10,2|7|4",
  "105|Db|Dubnium|transition-metal|2,8,18,32,32,11,2|7|5",
  "106|Sg|Seaborgium|transition-metal|2,8,18,32,32,12,2|7|6",
  "107|Bh|Bohrium|transition-metal|2,8,18,32,32,13,2|7|7",
  "108|Hs|Hassium|transition-metal|2,8,18,32,32,14,2|7|8",
  "109|Mt|Meitnerium|transition-metal|2,8,18,32,32,15,2|7|9",
  "110|Ds|Darmstadtium|transition-metal|2,8,18,32,32,16,2|7|10",
  "111|Rg|Roentgenium|transition-metal|2,8,18,32,32,17,2|7|11",
  "112|Cn|Copernicium|transition-metal|2,8,18,32,32,18,2|7|12",
  "113|Nh|Nihonium|post-transition|2,8,18,32,32,18,3|7|13",
  "114|Fl|Flerovium|post-transition|2,8,18,32,32,18,4|7|14",
  "115|Mc|Moscovium|post-transition|2,8,18,32,32,18,5|7|15",
  "116|Lv|Livermorium|post-transition|2,8,18,32,32,18,6|7|16",
  "117|Ts|Tennessine|halogen|2,8,18,32,32,18,7|7|17",
  "118|Og|Oganesson|noble-gas|2,8,18,32,32,18,8|7|18"
];

function buildFullPeriodicTable(): ElementData[] {
  return rawData.map(line => {
    const [num, sym, name, cat, elec, row, col] = line.split('|');
    const atomicNumber = parseInt(num, 10);
    
    let specialty = "Бұл өте ерекше химиялық қасиеттерге ие элемент.";
    let danger = "Қалыпты жағдайда қауіпсіз, бірақ белгілі бір қосылыстарында қауіпті болуы мүмкін.";
    let description = `${name} элементі, табиғаттағы маңызды рөлі бар.`;
    let uses = 'Әр түрлі өнеркәсіп салаларында қолданылады.';

    // Enhance info based on categories or specific elements
    if (cat === 'alkali-metal') {
       danger = "Өте белсенді, сумен әрекеттесіп жарылыс береді және сілті түзеді!";
       specialty = "Сумен ең күшті реакцияға түсетін өте жұмсақ металл.";
    } else if (cat === 'halogen') {
       danger = "Буы мен газы өте улы және тыныс алу жолдарын күйдіреді.";
       specialty = "Электртерістігі жоғары, кез-келген дерлік металмен тұз түзеді.";
    } else if (cat === 'noble-gas') {
       specialty = "Электрондық қабаты толық болғандықтан химиялық инертті.";
       danger = "Улы емес, бірақ жабық кеңістікте оттегіні ығыстырып, тұншықтыруы мүмкін.";
    } else if (cat === 'lanthanide' || cat === 'actinide') {
       specialty = "f-деңгейшесі толтырылатын жұмбақ және ерекше күрделі элементтер.";
       if (atomicNumber >= 84) {
          danger = "РАДИОАКТИВТІ. Альфа/бета сәулелену көзі, мутация немесе сәулелік ауру тудырады.";
       }
    } else if (cat === 'transition-metal') {
       specialty = "Айнымалы тотығу дәрежелері мен түрлі-түсті қосылыстар түзу қабілеті бар.";
    }

    if (atomicNumber === 1 || atomicNumber === 2 || atomicNumber === 6 || atomicNumber === 7 || atomicNumber === 8 || atomicNumber === 9) {
      if (atomicNumber === 1) { 
         specialty = "Ғаламдағы ең көп таралған және ең жеңіл элемент."; 
         danger = "Өте жанғыш және жарылғыш газ."; 
      }
      if (atomicNumber === 6) specialty = "Органикалық тіршіліктің негізгі кірпіші.";
      if (atomicNumber === 8) specialty = "Жер қыртысындағы ең көп таралған элемент, жануды қолдайды.";
    }

    return {
      number: atomicNumber,
      symbol: sym,
      name: name,
      group: cat === 'noble-gas' ? '18/VIIIA' : cat === 'halogen' ? '17/VIIA' : cat === 'alkali-metal' ? '1/IA' : "Unknown",
      period: parseInt(row)<8 ? parseInt(row) : (parseInt(row)===9?6:7),
      category: cat,
      electrons: elec.split(',').map(Number),
      description,
      uses,
      gridRow: parseInt(row),
      gridCol: parseInt(col),
      specialty,
      danger
    };
  });
}

export const elements: ElementData[] = buildFullPeriodicTable();

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'alkali-metal': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
    case 'alkaline-earth': return 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300';
    case 'transition-metal': return 'bg-pink-500/20 border-pink-500/50 text-pink-400';
    case 'post-transition': return 'bg-cyan-600/20 border-cyan-600/50 text-cyan-300';
    case 'metalloid': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
    case 'nonmetal': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    case 'halogen': return 'bg-green-500/20 border-green-500/50 text-green-400';
    case 'noble-gas': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
    case 'lanthanide': return 'bg-indigo-400/20 border-indigo-400/50 text-indigo-300';
    case 'actinide': return 'bg-rose-500/20 border-rose-500/50 text-rose-400';
    default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
  }
}
