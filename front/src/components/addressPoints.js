//An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
//Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/
function randn_bm() {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

const generateRandomNumber = (min, max) => {
  return randn_bm() * (max - min) + min
}
const rdmLat = () => generateRandomNumber(-37.681261, -37.920916)
const rdmLong = () => generateRandomNumber(144.769483, 145.159619)

const rdmAddresses = []
for (let i = 0; i < 5000; i++) {
  rdmAddresses.push([rdmLat(), rdmLong()])
}
export { rdmAddresses }
