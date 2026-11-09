const frames = {
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
  'night-home-blue': ['A model in the Slag Bomber and Drift Denim stands beside blue-gray steel shutters on a wet street at night.', ['slag-bomber', 'drift-denim'], 'wide'],
};

const frame = id => [id, ...frames[id]];
export const lookbookFrames = [
  'night-01', 'fit-a', 'stage-b', 'studio-03', 'flue-look', 'fit-b2', 'night-04',
  'fit-c', 'stage-a', 'studio-home-03', 'night-03', 'cinder-look', 'fit-a2',
  'stage-b2', 'concrete-01', 'cinder-detail', 'stage-c', 'soot-look', 'night-02',
  'soot-detail', 'stage-c2', 'studio-01', 'flue-detail', 'fit-b', 'stage-a2', 'fit-c2',
].map(frame);

export const homeFrames = ['night-home-blue', 'flue-look', 'soot-look', 'cinder-look'].map(frame);

export const formats = {
  wide: [1600, 900],
  landscape: [1440, 1080],
  portrait: [1000, 1250],
};
