const objectsArrayCreate = (group, objects) => {
 let createArray = []
 for (let i in group) {
  let keyFirst = group[i].id
  let grobjects = Object.values(objects).filter(el => {
   return group[i].objects.includes(el.id)
  })
  let prepareArray = {
   "key": 0 + '-' + keyFirst,
   "data": group[i],
   "children": []
  }
  if (grobjects) {
   for (let i in grobjects) {
    let keySecond = grobjects[i].id
    prepareArray.children.push({data: grobjects[i], key: keyFirst + '-' + keySecond})
   }
  }
  createArray.push(prepareArray)
 }
 return Array.from(new Set(createArray))
}

// const geoZoneArr = (group, geozone) => {
//  for (let i in group) {
//   let keyFirst = group[i].id
//   let grobjects = Object.values(geozone).filter(el => {return group[i].objects.includes(el.id)})
//   let createArray = {
//    "key": 0 + '-' + keyFirst,
//    "data": group[i],
//    "children": []
//   }
//   if (grobjects) {
//    for (let i in grobjects) {
//     let keySecond = grobjects[i].id
//     createArray.children.push({data: grobjects[i], key: keyFirst + '-' + keySecond})
//    }
//   }
//   console.log(createArray)
//  }
// }


export default {
 objectsArrayCreate,
}