/* Gray Matter payment configuration.
   Stripe/Link stays hidden until enabled AND a verified HTTPS checkout URL is set.
   Never commit secret keys here. */
window.GM_PAYMENT = {
  stripeEnabled: false,
  checkoutUrl: '',
  invoiceLookupUrl: '',
  paymentInstructionsEmail: 'graymattertechllc@gmail.com'
};