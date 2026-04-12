/**
 * Shows the "Solicitação de serviços" nav link only when a mock session exists.
 */
function initSharedLayout() {
  var servicesLink = document.getElementById('nav-services');
  if (!servicesLink) return;
  if (typeof isLoggedIn === 'function' && isLoggedIn()) {
    servicesLink.classList.remove('is-hidden');
    servicesLink.removeAttribute('aria-hidden');
  } else {
    servicesLink.classList.add('is-hidden');
    servicesLink.setAttribute('aria-hidden', 'true');
  }
}

document.addEventListener('DOMContentLoaded', initSharedLayout);
