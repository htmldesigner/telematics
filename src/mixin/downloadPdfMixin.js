import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default {
methods: {
 createPDF() {
  html2canvas(document.querySelector('#my-table'), {imageTimeout: 5000, useCORS: true}).then(canvas => {
   document.getElementById('pdf').appendChild(canvas)
   let imgData = canvas.toDataURL('image/png')
   const pdf = new jsPDF({
    orientation: 'pt',
   });
   const imgProps= pdf.getImageProperties(imgData);
   const pdfWidth = pdf.internal.pageSize.getWidth();
   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
   pdf.addImage(imgData, 'PNG', 0, 5, pdfWidth, pdfHeight);
   pdf.save('download.pdf');
   document.getElementById('pdf').innerHTML = ''
  }).catch(()=>{
   this.$store.dispatch('setError', 'Нет данных для скачивания').then(()=>{
    this.$store.dispatch('clearError')
   })
  })
 }
}
}