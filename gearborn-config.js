// Runtime config for local/static play.
// GitHub Actions rewrites this file during Pages deployment using the
// GEARBORN_GOD_MODE_CODE secret or variable.
window.__GEARBORN_CONFIG__ = Object.assign({}, window.__GEARBORN_CONFIG__, {
  GOD_MODE_CODE: ""
});

window.GEARBORN_GOD_MODE_CODE = window.__GEARBORN_CONFIG__.GOD_MODE_CODE || "";
