(function (p, o, s, t, m, a, n) {
  if (!p[s]) {
    p[s] = function () {
      (p[t] || (p[t] = [])).push(arguments);
    };
  }

  if (!o.getElementById(s + t)) {
    n = o.createElement("script");
    n.id = s + t;
    n.async = 1;
    n.src = m;
    o.getElementsByTagName("head")[0].appendChild(n);
  }
})(window, document, "_pm", "PostmanRunObject", "https://run.pstmn.io/button.js");