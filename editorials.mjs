const frames = {
  'banner-hero': ['Two models in worn leather, wide denim and oxblood cotton stand beneath the WHYNICKY® STUDIO canvas banner.', ['scarp-rider', 'offset-jean', 'hinge-jacket', 'break-trouser'], 'bannerWide'],
  'banner-medium': ['The cropped oxblood Hinge Jacket and stepped hems of the Break Trouser in window light.', ['hinge-jacket', 'break-trouser'], 'campaignPortrait'],
  'banner-detail': ['A close portrait showing the raised collar and diagonal zip of the worn leather Scarp Rider.', ['scarp-rider'], 'campaignDetail'],
  'banner-scarp-fit': ['The Scarp Rider and wide Offset Jean beneath the canvas banner.', ['scarp-rider', 'offset-jean'], 'portrait'],
  'overland-fitting': ['The long olive Overland Parka worn with the tapered Arc Knee Pant.', ['overland-coat', 'arc-knee'], 'campaignPortrait'],
  'tailoring-fitting': ['The charcoal Suture Blazer over an ivory Loom Shirt with the espresso Plane Trouser.', ['suture-blazer', 'loom-shirt', 'plane-trouser'], 'campaignPortrait'],
  'splay-fitting': ['The layered Splay Top and wrapped Silt Trouser in washed stone.', ['splay-top', 'silt-trouser'], 'campaignPortrait'],
  'fault-lines-campaign': ['Two models sit by a dark leather sofa beneath the studio wordmark.', ['soot-overshirt', 'offset-jean', 'slag-bomber', 'drift-denim'], 'campaignPortrait'],
  'studio-city-campaign': ['A burgundy and ivory WHYNICKY® STUDIO billboard lights a city street at dusk.', [], 'city'],
  'night-01': ['A model sits by a red shutter in the Slag Bomber and wide black Drift Denim.', ['slag-bomber', 'drift-denim'], 'wide'],
  'night-02': ['A model leans against a metal doorway in the Scarp Rider and washed blue Offset Jean.', ['scarp-rider', 'offset-jean'], 'portrait'],
  'night-03': ['Direct flash picks out the Slag Bomber’s grain and rib collar.', ['slag-bomber'], 'portrait'],
  'night-04': ['The rear shoulder seam of the Scarp Rider catches the flash.', ['scarp-rider', 'offset-jean'], 'landscape'],
  'studio-01': ['A red-haired model sits in the ribbed Strata Knit and wrapped Silt Trouser.', ['strata-knit', 'silt-trouser'], 'wide'],
  'studio-03': ['Side light traces the raised stitching on the shoulder of the Strata Knit.', ['strata-knit'], 'portrait'],
  'studio-home-03': ['The Silt Trouser’s wrap and the raw lower edge of the Strata Knit.', ['silt-trouser', 'strata-knit'], 'portrait'],
  'concrete-01': ['A model in the Rift Jacket and Drift Denim pauses on the stairs.', ['rift-jacket', 'drift-denim'], 'wide'],
  'fit-a': ['Cropped indigo Relay Jacket and oxblood Torsion Trouser in a full-length fitting.', ['relay-jacket', 'torsion-trouser'], 'portrait'],
  'fit-b': ['A model with close braids in the waxed Vault Vest and wide Plane Trouser.', ['vault-vest', 'plane-trouser'], 'portrait'],
  'fit-c': ['Washed blue Offset Jean and black Underlay Longsleeve in a sideways stride.', ['offset-jean', 'underlay-top'], 'landscape'],
  'stage-a': ['A model steps into a diagonal strip of light in the oxblood Hinge Jacket.', ['hinge-jacket', 'break-trouser'], 'portrait'],
  'stage-b': ['Side light crosses the shoulder of a felted Moraine Vest.', ['moraine-vest', 'arc-knee'], 'landscape'],
  'stage-c': ['A model in the high-collared Shear Knit and wrapped Silt Trouser stands in directional light.', ['shear-knit', 'silt-trouser'], 'portrait'],
  'flue-look': ['The back vent of the long Flue Coat opens as the model walks across the studio.', ['flue-coat', 'break-trouser'], 'wide'],
  'flue-studio': ['The long charcoal Flue Coat and stepped Break Trouser against a pale studio backdrop.', ['flue-coat', 'break-trouser'], 'fittingWide'],
  'soot-look': ['The short Soot Overshirt sits above the long, wide Offset Jean.', ['soot-overshirt', 'offset-jean'], 'portrait'],
  'cinder-look': ['A seated model wears the short Cinder Knit with folded espresso Plane Trouser.', ['cinder-knit', 'plane-trouser'], 'portrait'],
  'flue-detail': ['A close profile shows the Flue Coat’s high collar and shaped sleeve.', ['flue-coat'], 'portrait'],
  'soot-detail': ['A close look at the Soot Overshirt’s dry weave, inset pocket and deep cuff.', ['soot-overshirt', 'offset-jean'], 'landscape'],
  'cinder-detail': ['A model turns toward soft light with the Cinder Knit’s rib cuff at her jaw.', ['cinder-knit'], 'landscape'],
  'fit-a2': ['A model adjusts his cuff to show the rear shoulder of the Relay Jacket.', ['relay-jacket', 'torsion-trouser'], 'landscape'],
  'fit-b2': ['The angular overlap and open armhole of the Vault Vest in profile.', ['vault-vest', 'plane-trouser'], 'portrait'],
  'fit-c2': ['The curved Offset Jean hems fall over black boots.', ['offset-jean', 'underlay-top'], 'portrait'],
  'stage-a2': ['A close portrait in the raised collar and red cotton drill of the Hinge Jacket.', ['hinge-jacket'], 'landscape'],
  'stage-b2': ['A model in profile shows the curved knee of the Arc Knee Pant and the angular Moraine Vest.', ['arc-knee', 'moraine-vest'], 'portrait'],
  'stage-c2': ['A seated model shows how the Silt Trouser panel hangs over a raised knee.', ['silt-trouser', 'shear-knit'], 'landscape'],
  'after-hours-lounge': ['Two models in worn leather jackets and wide denim by a brown leather sofa.', ['slag-bomber', 'drift-denim'], 'loungeWide'],
  'night-home-blue-mobile': ['The Slag Bomber and wide Drift Denim beside a steel shutter.', ['slag-bomber', 'drift-denim'], 'nightMobile'],
  'rift-fitting': ['The short stone Rift Jacket and Drift Denim worn on concrete stairs.', ['rift-jacket', 'drift-denim'], 'portrait'],
  'flue-fitting': ['The long Flue Coat in stride with the Break Trouser.', ['flue-coat', 'break-trouser'], 'portrait'],
  'underlay-fitting': ['The Underlay Longsleeve sits in layers above the wide Offset Jean.', ['underlay-top', 'offset-jean'], 'portrait'],
};

const frame = id => [id, ...frames[id]];
export const lookbookFrames = [
  'banner-hero', 'banner-medium', 'night-01', 'fit-a', 'studio-03',
  'banner-detail', 'fit-b', 'concrete-01', 'night-02', 'cinder-look',
  'flue-look', 'soot-look', 'studio-01', 'stage-c2', 'night-03',
  'overland-fitting', 'tailoring-fitting', 'splay-fitting', 'fault-lines-campaign', 'studio-city-campaign',
].map(frame);

export const heroFrame = frame('banner-hero');
export const campaignFrames = ['banner-medium', 'banner-detail'].map(frame);
export const studioCampaignFrames = ['fault-lines-campaign', 'studio-city-campaign'].map(frame);
export const homeFrames = ['after-hours-lounge', 'flue-studio', 'soot-look', 'cinder-look'].map(frame);

const productFittings = {
  'rift-jacket': 'rift-fitting',
  'drift-denim': 'night-home-blue-mobile',
  'slag-bomber': 'night-home-blue-mobile',
  'hinge-jacket': 'banner-medium',
  'scarp-rider': 'banner-scarp-fit',
  'flue-coat': 'flue-fitting',
  'overland-coat': 'overland-fitting',
  'vault-vest': 'fit-b',
  'suture-blazer': 'tailoring-fitting',
  'relay-jacket': 'fit-a',
  'moraine-vest': 'stage-b2',
  'offset-jean': 'banner-scarp-fit',
  'silt-trouser': 'splay-fitting',
  'arc-knee': 'stage-b2',
  'plane-trouser': 'cinder-look',
  'torsion-trouser': 'fit-a',
  'break-trouser': 'banner-medium',
  'strata-knit': 'studio-01',
  'shear-knit': 'stage-c',
  'underlay-top': 'underlay-fitting',
  'loom-shirt': 'tailoring-fitting',
  'cinder-knit': 'cinder-look',
  'splay-top': 'splay-fitting',
  'soot-overshirt': 'soot-look',
};

export function fittingFor(product) {
  const id = productFittings[product.id];
  return id ? frame(id) : undefined;
}

export const formats = {
  wide: [1600, 900],
  landscape: [1440, 1080],
  portrait: [1000, 1250],
  fittingWide: [1586, 992],
  loungeWide: [1672, 941, 960],
  bannerWide: [1672, 941],
  campaignPortrait: [1122, 1402],
  campaignDetail: [1448, 1086],
  nightMobile: [640, 941],
  city: [1535, 1025, 960],
};
