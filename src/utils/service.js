import moment from 'moment'

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


let icon = {
 stop: require('@/assets/stops.svg'),
 stopFull: require('@/assets/stops-off.svg'),
 stopNoContact: require('@/assets/NoContact.svg'),
 pending: require('@/assets/stop-full.svg'),
 move: require('@/assets/start.svg'),
}

const statusClass = (object) => {
 if (object.geo) {
  let now = moment(new Date()) //todays
  let end = moment(object.geo.fix_date) // another date
  let duration = moment.duration(now.diff(end))
  let diffTime = duration.asMinutes()

  if (diffTime > 10) {
   // 'red'
   return icon.stopFull
  } else if (diffTime < 5) {
   // 'green'
   if (object.geo.speed > 0) {
    return icon.move
   } else {
    return icon.stop
   }

  } else {
   // 'yellow'
   return icon.pending
  }
 } else {
  return icon.stopNoContact
 }

}


export default {
 objectsArrayCreate,
 statusClass
}