import moment from 'moment'

export default {
 bind(el, binding, vnode) {
 },

 inserted(el, binding, vnode) {
  el.addEventListener('mouseover', function (event) {
   if (binding.value) {
    let tooltipElem = document.createElement('div')
    tooltipElem.className = 'tooltips'

    let text = ''

    if (binding.modifiers.objects) {
     text = `<div class="tooltips_content">

    <div class="tooltips_header">
      <div class="name">${binding.value.name}</div>
      <div class="last_contact">${binding.value.geo ? moment(binding.value.geo.fix_date).format('MM-DD-YYYY hh:mm') : ''}</div>
    </div>
    
     <div class="address">${binding.value.address ? '<hr>' + binding.value.address + '<hr>' : ''}</div>

     <div class="tooltips_footer">
       ${binding.value.geo ? '<div class="speed"><span>Последняя скорость</span>' + binding.value.geo.speed + ' км/ч' + '</div>' : ''}
      ${binding.value.geo ? '<div class="coords"><span>Координаты</span>' + binding.value.geo.latitude + '<br>' + binding.value.geo.longitude + '</div>' : ''}
     </div>
     
    
    </div>`

    } else {
     text = `<div class="tooltips_content"><div class="tooltips_small_text"><span>${binding.value}</span></div></div>`
    }

    document.body.append(tooltipElem)
    tooltipElem.innerHTML = text

    let left = event.pageX + 10;
    if (left < 0) left = +10; // не заезжать за левый край окна

    let top = event.pageY - tooltipElem.offsetHeight - 5;
    if (top < 0) { // если подсказка не помещается сверху, то отображать её снизу
     top = event.pageY.top + el.offsetHeight + 2;
    }
    tooltipElem.style.left = left + 'px';
    tooltipElem.style.top = top + 'px';
   }
  })

  el.addEventListener('mouseout', function (event) {
   let elem = document.querySelector('.tooltips')
   if (elem)elem.remove()
   // removeEventListener('mouseover', listener, false)
  })

 },

 update(el, binding, vnode){
  let elem = document.querySelector('.tooltips')
  if (elem)elem.remove()
 },

 unbind() {
  let elem = document.querySelector('.tooltips')
  if (elem)elem.remove()
 }

}