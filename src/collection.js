import { newProducts } from './new-pieces.js';

export const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export const categories = [
  ['all', 'All pieces'],
  ['outerwear', 'Outerwear'],
  ['tops', 'Tops'],
  ['bottoms', 'Bottoms'],
];

const originalProducts = [
  {
    id: 'rift-jacket',
    name: 'Rift Jacket',
    color: 'Stone',
    category: 'outerwear',
    price: 348,
    description: 'A cropped jacket in brushed cotton moleskin. Curved seams shape the sleeves, and a high funnel collar closes with a gunmetal zip. Two angled welt pockets sit low on the front.',
    material: '100% cotton moleskin. Cotton lining. Gunmetal zip.',
    fit: 'Boxy through the chest, with dropped shoulders and a hem that sits at the waist.',
    care: 'Dry clean. Steam lightly from the inside.',
    measurements: [[112, 52], [116, 54], [120, 56], [124, 58], [128, 60]],
    detail: true,
    related: ['drift-denim', 'underlay-top', 'hinge-jacket'],
  },
  {
    id: 'drift-denim',
    name: 'Drift Denim',
    color: 'Washed black',
    category: 'bottoms',
    price: 238,
    description: 'Heavy cotton denim with an exaggerated leg and a curved seam that runs from hip to hem. The black wash leaves a soft fade across the thighs and along the edges.',
    material: '100% cotton denim. Metal shank button and concealed zip fly.',
    fit: 'High rise with a fitted waist and a wide, full length leg.',
    care: 'Wash inside out at 30°C with similar colors. Line dry.',
    measurements: [[68, 77], [73, 78], [78, 79], [83, 80], [88, 81]],
    detail: true,
    related: ['rift-jacket', 'offset-jean', 'strata-knit'],
  },
  {
    id: 'slag-bomber',
    name: 'Slag Bomber',
    color: 'Espresso',
    category: 'outerwear',
    price: 596,
    description: 'An espresso leather bomber with rounded shoulders and full sleeves. Soft ribbing gathers the cuffs and hem, and a brass zip sits between two angled welt pockets.',
    material: 'Full grain cowhide. Cotton blend ribbing. Cupro lining.',
    fit: 'Relaxed through the body with room for a layer underneath.',
    care: 'Specialist leather clean only. Store on a broad hanger.',
    measurements: [[116, 57], [120, 59], [124, 61], [128, 63], [132, 65]],
    detail: true,
    related: ['plane-trouser', 'underlay-top', 'scarp-rider'],
  },
  {
    id: 'fault-knit',
    name: 'Fault Knit',
    color: 'Chalk',
    category: 'tops',
    price: 148,
    description: 'A fine cotton rib top with a diagonal fold at the neckline. A single off center seam follows the body, and the narrow sleeves extend past the wrist.',
    material: '96% cotton, 4% elastane. Fine rib knit.',
    fit: 'Close to the body with stretch. The neckline sits lower on one shoulder.',
    care: 'Wash gently at 30°C. Reshape and dry flat.',
    measurements: [[68, 49], [72, 51], [76, 53], [80, 55], [84, 57]],
    related: ['drift-denim', 'fold-trouser', 'rift-jacket'],
  },
  {
    id: 'fold-trouser',
    name: 'Fold Trouser',
    color: 'Faded olive',
    category: 'bottoms',
    price: 218,
    description: 'Two deep pleats on each side open into a roomy leg that tapers gently at the ankle. Cut from compact olive cotton twill with a concealed waist closure.',
    material: '100% cotton twill. Concealed hook and zip fly.',
    fit: 'Sits high at the waist with a generous thigh and a soft taper.',
    care: 'Wash at 30°C with similar colors. Hang to dry.',
    measurements: [[66, 72], [71, 73], [76, 74], [81, 75], [86, 76]],
    related: ['slag-bomber', 'fault-knit', 'trace-longsleeve'],
  },
  {
    id: 'trace-longsleeve',
    name: 'Trace Longsleeve',
    color: 'Charcoal',
    category: 'tops',
    price: 118,
    description: 'A washed cotton jersey crewneck. Tonal flatlock seams trace the shoulders and curve in at the waist, leaving a clean front panel.',
    material: '100% cotton jersey. Bound crew neckline.',
    fit: 'A straight, close fit through the chest with a full length sleeve.',
    care: 'Wash inside out at 30°C. Line dry.',
    measurements: [[86, 60], [92, 62], [98, 64], [104, 66], [110, 68]],
    related: ['fold-trouser', 'drift-denim', 'rift-jacket'],
  },
];

export const products = [...originalProducts.slice(0, 3), ...newProducts];
export const archivedProducts = originalProducts.slice(3).map(product => ({
  ...product, archived: true, detail: true, related: ['rift-jacket', 'drift-denim', 'slag-bomber'],
}));
export const productById = new Map([...products, ...archivedProducts].map(product => [product.id, product]));

export const featuredProducts = [
  'scarp-rider', 'offset-jean', 'hinge-jacket',
  'break-trouser', 'slag-bomber', 'strata-knit',
].map(id => productById.get(id));
export const productPath = product => `/product/${product.id}/`;
export const photoPath = (product, view = 'front', scale = '') =>
  `/assets/${product.id}${view === 'front' ? '' : `-${view}`}${scale ? `-${scale}` : ''}.webp`;

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format;
