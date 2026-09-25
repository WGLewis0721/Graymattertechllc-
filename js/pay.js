(function(){
'use strict';
const $=id=>document.getElementById(id);
const service=$('pay-service'), number=$('project-number'), business=$('business-name');
const panel=$('review-panel'), pay=$('pay-now'), request=$('request-payment'), status=$('checkout-status');
const file=$('invoice-file'), drop=$('invoice-drop'), selected=$('invoice-selected');
const cfg=window.GM_PAYMENT||{};

function showReview(source){
  const serviceName=service.value || (source==='invoice'?'Invoice payment':'');
  $('review-service').textContent=serviceName||'To be confirmed';
  $('review-number').textContent=number.value.trim()||'To be confirmed';
  $('review-business').textContent=business.value.trim()||'To be confirmed';
  $('review-amount').textContent='Confirmed from invoice';
  panel.hidden=false;
  const url=(cfg.checkoutUrl||'').trim();
  const stripeReady=cfg.stripeEnabled===true && /^https:\/\//i.test(url);
  pay.hidden=!stripeReady;
  pay.disabled=!stripeReady;
  request.hidden=stripeReady;
  const ref=number.value.trim() || (file.files[0] ? file.files[0].name : 'invoice/payment');
  const subject=encodeURIComponent('Gray Matter payment request - '+ref);
  const body=encodeURIComponent('Hello Gray Matter,\n\nI am ready to pay.\n\nService: '+(serviceName||'Please confirm')+'\nInvoice / Project: '+ref+'\nBusiness: '+(business.value.trim()||'')+'\n\nPlease send payment instructions for the verified amount due.');
  request.href='mailto:'+(cfg.paymentInstructionsEmail||'graymattertechllc@gmail.com')+'?subject='+subject+'&body='+body;
  status.textContent=stripeReady
    ? 'Secure checkout opens with Stripe. Eligible customers can use Link. Card details are never stored on this website.'
    : 'Send your invoice or project reference and Gray Matter will reply with payment instructions for the verified amount due. Online Stripe and Link checkout is currently hidden.';
  panel.scrollIntoView({behavior:'smooth',block:'center'});
}
$('service-continue').addEventListener('click',()=>{
  if(!service.value){service.focus();return;}
  showReview('service');
});
pay.addEventListener('click',()=>{const url=(cfg.checkoutUrl||'').trim();if(/^https:\/\//i.test(url)) window.location.assign(url);});

function setFile(f){
  if(!f)return;
  const allowed=['application/pdf','image/jpeg','image/png'];
  if(!allowed.includes(f.type)||f.size>10*1024*1024){alert('Please choose a PDF, JPG, or PNG under 10 MB.');return;}
  $('invoice-file-name').textContent=f.name;
  $('invoice-file-size').textContent=(f.size/1024/1024).toFixed(2)+' MB';
  drop.hidden=true; selected.hidden=false; $('invoice-continue').disabled=false;
  const match=f.name.match(/GM[-_ ]?\d{4}[-_ ]?\d{3,}/i);
  if(match&&!number.value) number.value=match[0].replace(/_/g,'-').replace(/ /g,'-').toUpperCase();
}
file.addEventListener('change',()=>setFile(file.files[0]));
['dragenter','dragover'].forEach(evt=>drop.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover')}));
['dragleave','drop'].forEach(evt=>drop.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];setFile(f)});
$('invoice-remove').addEventListener('click',()=>{file.value='';selected.hidden=true;drop.hidden=false;$('invoice-continue').disabled=true;});
$('invoice-continue').addEventListener('click',()=>showReview('invoice'));
})();