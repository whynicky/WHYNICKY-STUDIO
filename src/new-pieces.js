const cottonCare = 'Wash at 30°C with similar colors. Line dry.';
const denimCare = 'Wash inside out at 30°C with similar colors. Hang to dry.';
const woolCare = 'Dry clean or air between wears.';
const knitCare = 'Hand wash cold. Reshape and dry flat.';

const designs = [
  {
    id: 'hinge-jacket', name: 'Hinge Jacket', category: 'outerwear', color: 'Oxblood', price: 384,
    description: 'Elbow darts hold the volume in the sleeves of this cropped drill jacket. A raised collar and offset snap placket cut a clean line across the front.',
    material: 'Heavy washed cotton drill. Matte metal snaps.', fit: 'Wide shoulders and a straight waist length body.',
    care: cottonCare, baseSize: [116, 54], detail: true, related: ['offset-jean', 'underlay-top', 'rift-jacket'],
  },
  {
    id: 'scarp-rider', name: 'Scarp Rider', category: 'outerwear', color: 'Washed black', price: 648,
    description: 'A diagonal zip cuts through a padded stand collar. Curved elbow panels give the sleeves their shape, and the worn leather shows lighter grain at the seams.',
    material: 'Distressed full grain cowhide. Blackened metal zip.', fit: 'Cropped and broad, with room through the elbow and shoulder.',
    care: 'Specialist leather clean only.', baseSize: [120, 57], detail: true, related: ['offset-jean', 'break-trouser', 'slag-bomber'],
  },
  {
    id: 'flue-coat', name: 'Flue Coat', category: 'outerwear', color: 'Coal', price: 548,
    description: 'A broad saddle yoke carries the weight of waxed cotton duck. The storm collar folds open on one side, and a deep rear vent releases the slightly tapered hem in motion.',
    material: 'Heavy waxed cotton duck. Concealed fastening.', fit: 'Dropped shoulder, generous barrel sleeve and a mid-calf hem.',
    care: 'Sponge clean and air dry. Rewax as needed.', baseSize: [132, 122], related: ['break-trouser', 'cinder-knit', 'offset-jean'],
  },
  {
    id: 'overland-coat', name: 'Overland Parka', category: 'outerwear', color: 'Cold olive', price: 488,
    description: 'A three panel hood rises from a deep storm yoke. Heavy gabardine falls to a split hem, with a diagonal zip and inset pockets for the hands.',
    material: 'Heavy cotton gabardine. Concealed metal zip.', fit: 'Loose through the sleeve and body with a long hem.',
    care: 'Spot clean or dry clean.', baseSize: [132, 118], detail: true, related: ['offset-jean', 'arc-knee', 'cinder-knit'],
  },
  {
    id: 'vault-vest', name: 'Vault Vest', category: 'outerwear', color: 'Espresso', price: 278,
    description: 'A wide angular panel crosses the waxed cotton front and closes under the collar. The shoulders project beyond deep armholes to leave room for a sleeve underneath.',
    material: 'Waxed cotton. Concealed snaps.', fit: 'Cropped with wide shoulders and open armholes.',
    care: 'Spot clean with cold water. Hang to air.', baseSize: [116, 56], detail: true, related: ['underlay-top', 'arc-knee', 'moraine-vest'],
  },
  {
    id: 'suture-blazer', name: 'Suture Blazer', category: 'outerwear', color: 'Charcoal', price: 448,
    description: 'Asymmetric lapels interrupt a long wool jacket. A low single button and diagonal shoulder seams keep the front broad and the waist relaxed.',
    material: 'Dry wool suiting. Cupro lining.', fit: 'An extended shoulder and a loose hip length body.',
    care: woolCare, baseSize: [120, 78], related: ['plane-trouser', 'loom-shirt', 'flue-coat'],
  },
  {
    id: 'relay-jacket', name: 'Relay Jacket', category: 'outerwear', color: 'Faded indigo', price: 326,
    description: 'Three steel snaps hold an offset panel across the chest. The indigo fades along the saddle seams and the long, split cuffs.',
    material: 'Heavy cotton denim. Matte steel snaps.', fit: 'Straight and cropped, with curved full length sleeves.',
    care: denimCare, baseSize: [116, 55], detail: true, related: ['silt-trouser', 'drift-denim', 'offset-jean'],
  },
  {
    id: 'moraine-vest', name: 'Moraine Vest', category: 'outerwear', color: 'Stone', price: 248,
    description: 'Felted wool crosses diagonally and closes at the waist with a small hook. Shaped seams under the arms carry the volume of the shoulder down to a flat hem.',
    material: 'Felted wool. Concealed hook.', fit: 'Boxy through the body with a generous armhole.',
    care: woolCare, baseSize: [112, 58], related: ['loom-shirt', 'plane-trouser', 'vault-vest'],
  },
  {
    id: 'offset-jean', name: 'Offset Jean', category: 'bottoms', color: 'Faded indigo', price: 268,
    description: 'Curved panels of washed indigo sweep from the hip to the raw hems. The legs stay wide through their full length, and the seams take on a lighter fade.',
    material: 'Heavy cotton denim. Metal shank button.', fit: 'Very wide from hip to hem, with an extra long leg.',
    care: denimCare, baseSize: [80, 83], detail: true, related: ['scarp-rider', 'overland-coat', 'hinge-jacket'],
  },
  {
    id: 'silt-trouser', name: 'Silt Trouser', category: 'bottoms', color: 'Stone', price: 238,
    description: 'A stone twill panel wraps the front and falls diagonally across one wide leg. The single visible waist button holds the fold in place.',
    material: 'Compact cotton twill. Horn button.', fit: 'High waist with two straight, generous legs.',
    care: cottonCare, baseSize: [78, 80], detail: true, related: ['strata-knit', 'relay-jacket', 'splay-top'],
  },
  {
    id: 'arc-knee', name: 'Arc Knee Pant', category: 'bottoms', color: 'Cold olive', price: 258,
    description: 'Oval inserts articulate the knees in heavy brushed canvas. The leg bows gently over the knee and narrows toward a clean ankle opening.',
    material: 'Brushed cotton canvas. Concealed hook.', fit: 'Relaxed through the hip and knee with a slight taper.',
    care: cottonCare, baseSize: [80, 78], related: ['vault-vest', 'cinder-knit', 'overland-coat'],
  },
  {
    id: 'plane-trouser', name: 'Plane Trouser', category: 'bottoms', color: 'Espresso', price: 288,
    description: 'Deep folds open into long side gussets in matte espresso wool. The waistband sits flat above a wide, straight hem.',
    material: 'Wool twill. Concealed hook and fly.', fit: 'High waist and an extra long, wide leg.',
    care: woolCare, baseSize: [79, 82], related: ['suture-blazer', 'soot-overshirt', 'slag-bomber'],
  },
  {
    id: 'torsion-trouser', name: 'Torsion Trouser', category: 'bottoms', color: 'Oxblood', price: 228,
    description: 'A shorter denim panel overlaps one thigh and joins the outseam on a diagonal. An exposed button fly and worn hems carry the same red brown wash.',
    material: 'Heavy washed cotton denim. Metal fly buttons.', fit: 'Wide leg with a long inseam and a flat waist.',
    care: denimCare, baseSize: [80, 81], related: ['relay-jacket', 'splay-top', 'underlay-top'],
  },
  {
    id: 'break-trouser', name: 'Break Trouser', category: 'bottoms', color: 'Washed black', price: 272,
    description: 'Two tucks fold over each calf and step down toward the hem. Washed black drill holds the folds while the upper leg stays straight and roomy.',
    material: 'Heavy cotton drill. Concealed zip fly.', fit: 'Straight and relaxed with a hem that sits near the ankle.',
    care: cottonCare, baseSize: [80, 76], related: ['flue-coat', 'shear-knit', 'scarp-rider'],
  },
  {
    id: 'strata-knit', name: 'Strata Knit', category: 'tops', color: 'Bone', price: 198,
    description: 'Dark flatlock stitches follow a displaced shoulder seam in heavy rib knit. Long sleeves gather at the elbow, and the lower edge is finished with an exposed stitch.',
    material: 'Heavy cotton and wool rib knit.', fit: 'Boxy with dropped shoulders and sleeves that extend over the wrist.',
    care: knitCare, baseSize: [120, 65], detail: true, related: ['silt-trouser', 'drift-denim', 'moraine-vest'],
  },
  {
    id: 'shear-knit', name: 'Shear Knit', category: 'tops', color: 'Oxblood', price: 218,
    description: 'The direction of the rib changes across a diagonal joining seam. A tall skewed collar and curved elbow seams keep the shape of the heavy knit.',
    material: 'Chunky wool knit.', fit: 'Relaxed through the chest with a broad cuff and a loose waist.',
    care: knitCare, baseSize: [116, 66], related: ['break-trouser', 'plane-trouser', 'flue-coat'],
  },
  {
    id: 'underlay-top', name: 'Underlay Longsleeve', category: 'tops', color: 'Washed black', price: 168,
    description: 'A short, angled shell of compact jersey sits over a longer rib layer. The finer fabric extends past the outer cuffs and the slanted hem.',
    material: 'Compact cotton jersey over fine cotton rib.', fit: 'Wide at the shoulder with an extended body and cuff.',
    care: cottonCare, baseSize: [112, 73], detail: true, related: ['vault-vest', 'drift-denim', 'hinge-jacket'],
  },
  {
    id: 'loom-shirt', name: 'Loom Shirt', category: 'tops', color: 'Bone', price: 188,
    description: 'A diagonal fold covers a partial placket in dense poplin. The sleeves end in broad cuffs, and one side of the rounded shirt hem falls lower.',
    material: 'Brushed cotton poplin. Tonal buttons.', fit: 'Loose with an extended sleeve and an uneven hip length hem.',
    care: cottonCare, baseSize: [114, 75], related: ['moraine-vest', 'suture-blazer', 'plane-trouser'],
  },
  {
    id: 'cinder-knit', name: 'Cinder Knit', category: 'tops', color: 'Graphite', price: 208,
    description: 'Flecked reverse stockinette gives this cropped pullover a dry, raised surface. The raglan sleeves swell toward the elbow and gather into deep rib cuffs.',
    material: 'Flecked wool in reverse stockinette with rib trims.', fit: 'Short, wide body with a round neck and generous sleeves.',
    care: knitCare, baseSize: [124, 56], related: ['plane-trouser', 'arc-knee', 'flue-coat'],
  },
  {
    id: 'splay-top', name: 'Splay Top', category: 'tops', color: 'Stone', price: 162,
    description: 'Two layers of compact jersey cross the front under a broad shoulder. The raw hem slopes down to one side and the armholes are cut deep.',
    material: 'Compact washed cotton jersey.', fit: 'Oversized sleeveless body with a longer side hem.',
    care: cottonCare, baseSize: [116, 71], related: ['torsion-trouser', 'silt-trouser', 'relay-jacket'],
  },
  {
    id: 'soot-overshirt', name: 'Soot Overshirt', category: 'tops', color: 'Soot', price: 218,
    description: 'Two inverted pleats open below the back yoke of this cropped overshirt. Washed dobby picks up a lighter grain around the inset chest welt and wide cuffs.',
    material: 'Heavy washed cotton dobby. Horn buttons.', fit: 'Wide, square body with a short hem and long sleeves.',
    care: cottonCare, baseSize: [124, 56], related: ['offset-jean', 'plane-trouser', 'vault-vest'],
  },
];

export const newProducts = designs.map(({ baseSize: [width, length], ...product }) => ({
  ...product,
  measurements: [-2, -1, 0, 1, 2].map(step => [
    width + step * (product.category === 'bottoms' ? 5 : 4),
    length + step * (product.category === 'bottoms' ? 1 : 2),
  ]),
}));
