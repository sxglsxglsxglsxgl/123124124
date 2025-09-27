(function () {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const appliedValues = new Map();

  function update() {
    const top = vv ? Math.max(0, vv.offsetTop) : null;
    const bottom = vv ? Math.max(0, window.innerHeight - (vv.height + vv.offsetTop)) : null;
    const left = vv ? Math.max(0, vv.offsetLeft) : null;
    const right = vv ? Math.max(0, window.innerWidth - (vv.width + vv.offsetLeft)) : null;

    function setVar(name, val) {
      if (val == null) return;

      const clamped = Math.max(0, val);
      const previous = appliedValues.has(name) ? appliedValues.get(name) : null;
      const isEffectivelyZero = clamped < 0.5;

      if (isEffectivelyZero) {
        if (previous != null) {
          root.style.removeProperty(name);
          appliedValues.delete(name);
        }
        return;
      }

      if (previous == null || Math.abs(previous - clamped) > 0.5) {
        root.style.setProperty(name, clamped + 'px');
        appliedValues.set(name, clamped);
      }
    }

    setVar('--safe-top', top);
    setVar('--safe-bottom', bottom);
    setVar('--safe-left', left);
    setVar('--safe-right', right);
  }

  update();
  if (vv) {
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
  }
  window.addEventListener('orientationchange', update);
})();
