(function () {
  var HOLD_MS = 5000;
  var links = [
    { label: 'Analytics', url: 'https://mlesniak.goatcounter.com' },
  ];

  function init() {
    var trigger = document.getElementById('c64-trigger');
    if (!trigger) return;

    var dropdown = document.createElement('div');
    dropdown.id = 'admin-dropdown';
    links.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.label;
      a.target = '_blank';
      a.rel = 'noopener';
      dropdown.appendChild(a);
    });
    document.body.appendChild(dropdown);

    var timer = null;
    var longPressed = false;

    function showDropdown() {
      longPressed = true;
      var rect = trigger.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + window.scrollY + 4) + 'px';
      dropdown.style.left = (rect.left + window.scrollX) + 'px';
      dropdown.classList.add('visible');
    }

    function startTimer() {
      longPressed = false;
      timer = setTimeout(showDropdown, HOLD_MS);
    }

    function cancelTimer() {
      clearTimeout(timer);
      timer = null;
    }

    trigger.addEventListener('mousedown', startTimer);
    trigger.addEventListener('mouseup', function () { if (!longPressed) cancelTimer(); });
    trigger.addEventListener('mouseleave', function () { if (!longPressed) cancelTimer(); });
    trigger.addEventListener('touchstart', startTimer, { passive: true });
    trigger.addEventListener('touchend', function () { if (!longPressed) cancelTimer(); });
    trigger.addEventListener('touchcancel', cancelTimer);

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target) && e.target !== trigger) {
        dropdown.classList.remove('visible');
        longPressed = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
