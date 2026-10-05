var _excluded = ["_snRows", "_defaultSnIds"],
  _excluded2 = ["__scopeAction", "__scopeActiveId"],
  _excluded3 = ["__scopeAction", "__scopeActiveId"];
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useCallback = _React.useCallback;
var C = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#30363d",
  accent: "#e05c00",
  blue: "#1f6feb",
  green: "#238636",
  red: "#da3633",
  yellow: "#d29922",
  text: "#e6edf3",
  muted: "#8b949e",
  purple: "#8957e5",
  input: "#0d1117",
  raised: "#1c2128",
  stripe: "#ffffff06",
  hover: "#ffffff08"
};
var DARK_PALETTE = _objectSpread({}, C);
var LIGHT_PALETTE = _objectSpread(_objectSpread({}, C), {}, {
  bg: "#f3f5f7",
  surface: "#ffffff",
  input: "#ffffff",
  raised: "#e9edf1",
  border: "#c4ccd5",
  text: "#202830",
  muted: "#536170",
  accent: "#b84a00",
  blue: "#155ac4",
  green: "#197035",
  red: "#c52828",
  yellow: "#916600",
  stripe: "#20283006",
  hover: "#2028300c"
});
var currentTheme = "dark";
try {
  if (localStorage.getItem("sp-f001-theme") === "light") currentTheme = "light";
} catch (_unused) {}
var applyTheme = function applyTheme(theme) {
  currentTheme = theme;
  Object.assign(C, theme === "light" ? LIGHT_PALETTE : DARK_PALETTE);
  document.documentElement.style.colorScheme = theme;
  document.body.style.background = C.bg;
  document.body.style.color = C.text;
};
applyTheme(currentTheme);
var ThemeButton = function ThemeButton() {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": currentTheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre",
    title: currentTheme === "dark" ? "Mode clair" : "Mode sombre",
    onClick: function onClick() {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
      try {
        localStorage.setItem("sp-f001-theme", currentTheme);
      } catch (_unused2) {}
      window.dispatchEvent(new Event("sp-f001-theme-change"));
    },
    style: {
      background: C.raised,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      width: 30,
      height: 28,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 18,
      flexShrink: 0
    }
  }, currentTheme === "dark" ? "☀" : "☾");
};
var QuickOfSearch = function QuickOfSearch(_ref) {
  var ofList = _ref.ofList,
    currentId = _ref.currentId,
    onSelect = _ref.onSelect,
    disabled = _ref.disabled;
  var _useState = useState(""),
    _useState2 = _slicedToArray(_useState, 2),
    query = _useState2[0],
    setQuery = _useState2[1];
  var _useState3 = useState(""),
    _useState4 = _slicedToArray(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    focused = _useState6[0],
    setFocused = _useState6[1];
  var _useState7 = useState(-1),
    _useState8 = _slicedToArray(_useState7, 2),
    highlight = _useState8[0],
    setHighlight = _useState8[1];
  var normalize = function normalize(value) {
    return value.trim().replace(/^OF\s*[:#-]?\s*/i, "").toUpperCase();
  };
  useEffect(function () {
    var _ofList$find;
    setQuery(((_ofList$find = ofList.find(function (o) {
      return o.id === currentId;
    })) === null || _ofList$find === void 0 ? void 0 : _ofList$find.of) || "");
    setError("");
    setFocused(false);
  }, [currentId]);
  var choose = function choose(o) {
    if (disabled) return;
    setQuery(o.of);
    setError("");
    setFocused(false);
    setHighlight(-1);
    if (o.id !== currentId) onSelect(o.id);
  };
  var submit = function submit() {
    var number = normalize(query);
    var matches = ofList.filter(function (o) {
      return String(o.of || "").trim().toUpperCase() === number;
    });
    if (matches.length !== 1) {
      setError(matches.length ? "Plusieurs dossiers portent ce numéro d'OF" : "OF introuvable");
      return;
    }
    choose(matches[0]);
  };
  useEffect(function () {
    if (!focused || disabled || !query.trim()) return;
    var matches = ofList.filter(function (o) {
      return normalize(String(o.of || "")) === normalize(query);
    });
    if (matches.length !== 1 || matches[0].id === currentId) return;
    var timer = setTimeout(function () {
      return choose(matches[0]);
    }, 300);
    return function () {
      return clearTimeout(timer);
    };
  }, [query, focused, disabled, currentId, ofList]);
  var suggestions = ofList.filter(function (o) {
    return query.trim() && String(o.of || "").toUpperCase().includes(normalize(query));
  }).slice(0, 12);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 240,
      maxWidth: "24vw"
    }
  }, /*#__PURE__*/React.createElement("input", {
    "aria-label": "Rechercher ou scanner un num\xE9ro d'OF",
    "aria-expanded": focused && suggestions.length > 0,
    "aria-controls": "quick-of-search",
    value: query,
    disabled: disabled,
    autoComplete: "off",
    onFocus: function onFocus(e) {
      e.target.select();
      setFocused(true);
    },
    onBlur: function onBlur() {
      return setFocused(false);
    },
    onChange: function onChange(e) {
      setQuery(e.target.value);
      setError("");
      setFocused(true);
      setHighlight(-1);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Escape") {
        setFocused(false);
        setHighlight(-1);
        return;
      }
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && suggestions.length) {
        e.preventDefault();
        setFocused(true);
        setHighlight(function (i) {
          return e.key === "ArrowDown" ? Math.min(i + 1, suggestions.length - 1) : Math.max(i - 1, 0);
        });
        return;
      }
      if ((e.key === "Enter" || e.key === "Tab") && query.trim() && !disabled) {
        if (e.key === "Enter") e.preventDefault();
        if (focused && highlight >= 0 && suggestions[highlight]) choose(suggestions[highlight]);else submit();
      }
    },
    placeholder: "N\xB0 OF",
    style: {
      width: "100%",
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(error ? C.red : C.border),
      borderRadius: 4,
      padding: "7px 8px",
      fontSize: 14,
      fontWeight: 700
    }
  }), focused && suggestions.length > 0 && /*#__PURE__*/React.createElement("div", {
    id: "quick-of-search",
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      width: 360,
      maxWidth: "80vw",
      maxHeight: 300,
      overflowY: "auto",
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      zIndex: 120,
      boxShadow: "0 4px 12px #0003"
    }
  }, suggestions.map(function (o, i) {
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      type: "button",
      onMouseDown: function onMouseDown(e) {
        return e.preventDefault();
      },
      onClick: function onClick() {
        return choose(o);
      },
      style: {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "7px 10px",
        border: 0,
        borderBottom: "1px solid ".concat(C.border),
        background: highlight === i ? C.blue + "20" : C.surface,
        color: C.text,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontFamily: "monospace"
      }
    }, o.of), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 11,
        color: C.muted,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, o.description || ""));
  })), error && /*#__PURE__*/React.createElement("span", {
    role: "alert",
    style: {
      position: "absolute",
      top: "100%",
      left: 0,
      background: C.surface,
      color: C.red,
      fontSize: 11,
      padding: 4,
      whiteSpace: "nowrap"
    }
  }, error));
};
var HeaderClock = function HeaderClock() {
  var _useState9 = useState(function () {
      return new Date();
    }),
    _useState0 = _slicedToArray(_useState9, 2),
    date = _useState0[0],
    setDate = _useState0[1];
  useEffect(function () {
    var timer = setInterval(function () {
      return setDate(new Date());
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  var iso = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  iso.setUTCDate(iso.getUTCDate() + 4 - (iso.getUTCDay() || 7));
  var week = Math.ceil(((iso - new Date(Date.UTC(iso.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
  return /*#__PURE__*/React.createElement("div", {
    "aria-label": "Date, heure et semaine",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: C.text,
      whiteSpace: "nowrap",
      fontFamily: "monospace"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, "S", String(week).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, date.toLocaleDateString("fr-FR")), /*#__PURE__*/React.createElement("time", {
    style: {
      fontSize: 23,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums"
    }
  }, date.toLocaleTimeString("fr-FR")));
};
var ROLES = ["Consultation", "Opérateur", "Contrôleur", "Logistique", "Product Assurance", "Chef de projet", "Manager", "Admin"];
var normalizeRole = function normalizeRole(user) {
  var role = String((user === null || user === void 0 ? void 0 : user.role) || "Opérateur").toLowerCase();
  if ((user === null || user === void 0 ? void 0 : user.trigram) === "ADMIN" || role === "admin") return "Admin";
  if (role === "manager" || role === "chef d'équipe" || role === "chef d’equipe" || role === "chef d’équipe") return "Manager";
  if (role === "chef de projet" || role === "project manager" || role === "project leader") return "Chef de projet";
  if (role === "product assurance" || role === "assurance produit" || role === "pa") return "Product Assurance";
  if (role === "contrôleur" || role === "controleur") return "Contrôleur";
  if (role === "logistique" || role === "logisticien" || role === "logisticienne") return "Logistique";
  if (role === "consultation" || role === "lecteur seul" || role === "lecture seule" || role === "lecteur") return "Consultation";
  return "Opérateur";
};
var accountSearchText = function accountSearchText(account) {
  return "".concat((account === null || account === void 0 ? void 0 : account.role) || "", " ").concat((account === null || account === void 0 ? void 0 : account.service) || "").toLowerCase();
};
var isProductAssuranceAccount = function isProductAssuranceAccount(account) {
  return normalizeRole(account) === "Product Assurance" || /product assurance|assurance produit/.test(accountSearchText(account));
};
var isProjectLeadAccount = function isProjectLeadAccount(account) {
  return normalizeRole(account) === "Chef de projet" || /chef de projet|project manager|project leader/.test(accountSearchText(account));
};
var isAdminManager = function isAdminManager(user) {
  return ["Admin", "Manager"].includes(normalizeRole(user));
};
var canWriteData = function canWriteData(user) {
  return ["Opérateur", "Contrôleur", "Logistique", "Manager", "Admin"].includes(normalizeRole(user));
};
var canManageUsers = function canManageUsers(user) {
  return isAdminManager(user);
};
var canManageLists = function canManageLists(user) {
  return isAdminManager(user);
};
var canControlRework = function canControlRework(user) {
  return ["Admin", "Manager", "Contrôleur"].includes(normalizeRole(user));
};
var canTraceability = function canTraceability(user) {
  return ["Admin", "Manager", "Logistique"].includes(normalizeRole(user));
};
var canRecordMating = function canRecordMating(user, connector) {
  return !!(user !== null && user !== void 0 && user.trigram) && ["Opérateur", "Contrôleur", "Manager", "Admin"].includes(normalizeRole(user)) && !!(connector !== null && connector !== void 0 && connector.validated) && !connector.deleted;
};
var canComment = function canComment(user) {
  return !!(user !== null && user !== void 0 && user.trigram);
};
var canEditLine = function canEditLine(user) {
  var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (isAdminManager(user)) return true;
  if (!canWriteData(user)) return false;
  var owner = row.createdVisa || row.createdBy || row.visa || row.openVisa || "";
  return !owner || owner === (user === null || user === void 0 ? void 0 : user.trigram);
};
var OF_TYPES = {
  production: {
    label: "Production"
  },
  reprise: {
    label: "Reprise / Rework"
  }
};
var DEFAULT_STATUS_TYPES = [{
  id: "a_faire",
  label: "À faire",
  color: "#8b949e",
  closed: false
}, {
  id: "en_cours",
  label: "En cours",
  color: "#1f6feb",
  closed: false
}, {
  id: "ip",
  label: "IP",
  color: "#d29922",
  closed: false
}, {
  id: "a_cloturer",
  label: "À clôturer",
  color: "#e05c00",
  closed: false
}, {
  id: "bloque",
  label: "Bloqué",
  color: "#d29922",
  closed: false
}, {
  id: "termine",
  label: "Terminé",
  color: "#238636",
  closed: true
}, {
  id: "cloture",
  label: "Clôturé",
  color: "#238636",
  closed: true
}];
var STATUTS = {};
var UNIT_STATUTS = STATUTS;
var normalizeStatusTypes = function normalizeStatusTypes(list) {
  var seen = new Set();
  var clean = (Array.isArray(list) ? list : DEFAULT_STATUS_TYPES).map(function (item, index) {
    var id = String((item === null || item === void 0 ? void 0 : item.id) || "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
    if (!id || seen.has(id)) return null;
    seen.add(id);
    return {
      id: id,
      label: String(item.label || id).trim(),
      color: /^#[0-9a-f]{6}$/i.test(item.color || "") ? item.color : "#8b949e",
      closed: !!item.closed,
      order: index
    };
  }).filter(Boolean);
  return clean.length ? clean : DEFAULT_STATUS_TYPES.map(function (item, index) {
    return _objectSpread(_objectSpread({}, item), {}, {
      order: index
    });
  });
};
var applyStatusTypes = function applyStatusTypes(list) {
  var clean = normalizeStatusTypes(list);
  Object.keys(STATUTS).forEach(function (key) {
    return delete STATUTS[key];
  });
  clean.forEach(function (item) {
    STATUTS[item.id] = {
      label: item.label,
      color: item.color,
      closed: item.closed
    };
  });
  return clean;
};
applyStatusTypes(DEFAULT_STATUS_TYPES);
var now = function now() {
  return new Date().toLocaleDateString("fr-FR");
};
var nowDT = function nowDT() {
  var d = new Date();
  return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
};
var uid = function uid() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};
var fmtSAP = function fmtSAP(v) {
  return String(v !== null && v !== void 0 ? v : "").replace(/[^0-9]/g, "");
};
var fmtCodeERP = function fmtCodeERP(v) {
  var d = v.replace(/[^0-9]/g, "").slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.slice(0, 3) + " " + d.slice(3);
  return d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6);
};

// ─── UI ────────────────────────────────────────────────────────────────────
var Input = function Input(_ref2) {
  var value = _ref2.value,
    _onChange = _ref2.onChange,
    _onBlur = _ref2.onBlur,
    _onKeyDown = _ref2.onKeyDown,
    placeholder = _ref2.placeholder,
    title = _ref2.title,
    _ref2$style = _ref2.style,
    style = _ref2$style === void 0 ? {} : _ref2$style,
    small = _ref2.small,
    _ref2$type = _ref2.type,
    type = _ref2$type === void 0 ? "text" : _ref2$type,
    readOnly = _ref2.readOnly,
    required = _ref2.required,
    entryField = _ref2.entryField;
  var empty = !value || value === "";
  var borderCol = required && empty ? C.yellow : style.borderColor || C.border;
  return /*#__PURE__*/React.createElement("input", {
    "data-entry-field": entryField,
    type: type,
    value: value || "",
    onChange: function onChange(e) {
      return _onChange && _onChange(e.target.value);
    },
    onBlur: function onBlur(e) {
      return _onBlur && _onBlur(e);
    },
    onKeyDown: function onKeyDown(e) {
      return _onKeyDown && _onKeyDown(e);
    },
    placeholder: title !== null && title !== void 0 && title.startsWith("Filtrer") ? "Filtrer…" : "",
    title: title || (placeholder ? "Attendu : ".concat(placeholder) : undefined),
    readOnly: readOnly,
    style: _objectSpread(_objectSpread({
      width: "100%",
      fontFamily: "monospace",
      outline: "none",
      padding: small ? "3px 5px" : "5px 8px",
      fontSize: small ? 11 : 13
    }, style), {}, {
      background: style.background || (readOnly ? C.raised : C.input),
      color: style.color || (readOnly ? C.muted : C.text),
      border: "1px solid ".concat(borderCol),
      borderRadius: 4,
      cursor: readOnly ? "default" : "text",
      borderColor: borderCol
    })
  });
};
var Select = function Select(_ref3) {
  var value = _ref3.value,
    _onChange2 = _ref3.onChange,
    options = _ref3.options,
    disabled = _ref3.disabled,
    _ref3$style = _ref3.style,
    style = _ref3$style === void 0 ? {} : _ref3$style,
    entryField = _ref3.entryField;
  return /*#__PURE__*/React.createElement("select", {
    "data-entry-field": entryField,
    value: value || "",
    disabled: disabled,
    onChange: function onChange(e) {
      return _onChange2(e.target.value);
    },
    style: _objectSpread({
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: disabled ? C.muted : C.text,
      padding: "4px 6px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? .7 : 1
    }, style)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "-"), options.map(function (o) {
    return /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o);
  }));
};
var Btn = function Btn(_ref4) {
  var onClick = _ref4.onClick,
    children = _ref4.children,
    _ref4$color = _ref4.color,
    color = _ref4$color === void 0 ? C.accent : _ref4$color,
    small = _ref4.small,
    disabled = _ref4.disabled,
    full = _ref4.full;
  return /*#__PURE__*/React.createElement("button", {
    className: "no-print",
    onClick: onClick,
    disabled: disabled,
    style: {
      background: disabled ? C.border : color,
      color: "#fff",
      border: "none",
      borderRadius: 4,
      padding: small ? "3px 8px" : "6px 14px",
      fontSize: small ? 11 : 13,
      cursor: disabled ? "default" : "pointer",
      fontWeight: 600,
      letterSpacing: .5,
      opacity: disabled ? .5 : 1,
      whiteSpace: "nowrap",
      width: full ? "100%" : undefined
    }
  }, children);
};
var MultiFilter = function MultiFilter(_ref5) {
  var _options$find;
  var value = _ref5.value,
    _onChange3 = _ref5.onChange,
    options = _ref5.options,
    _ref5$label = _ref5.label,
    label = _ref5$label === void 0 ? "Tous" : _ref5$label,
    _ref5$title = _ref5.title,
    title = _ref5$title === void 0 ? "Filtre" : _ref5$title;
  var _useState1 = useState(null),
    _useState10 = _slicedToArray(_useState1, 2),
    position = _useState10[0],
    setPosition = _useState10[1];
  var selected = Array.isArray(value) ? value : !value || value === "all" ? [] : [value];
  var caption = selected.length === 0 ? label : selected.length === 1 ? ((_options$find = options.find(function (o) {
    return o.value === selected[0];
  })) === null || _options$find === void 0 ? void 0 : _options$find.label) || selected[0] : "".concat(selected.length, " choix");
  return /*#__PURE__*/React.createElement("details", {
    onToggle: function onToggle(e) {
      if (e.currentTarget.open) {
        var r = e.currentTarget.getBoundingClientRect();
        setPosition({
          top: r.bottom + 3,
          left: Math.max(8, Math.min(r.left, window.innerWidth - 210))
        });
      } else setPosition(null);
    },
    style: {
      position: "relative",
      fontWeight: 400,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("summary", {
    title: title,
    "aria-label": title,
    style: {
      listStyle: "none",
      cursor: "pointer",
      background: C.input,
      border: "1px solid ".concat(selected.length ? C.blue : C.border),
      borderRadius: 4,
      color: selected.length ? C.blue : C.text,
      padding: "4px 5px",
      fontSize: 11,
      whiteSpace: "nowrap"
    }
  }, caption, " \u25BE"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      top: (position === null || position === void 0 ? void 0 : position.top) || 0,
      left: (position === null || position === void 0 ? void 0 : position.left) || 0,
      visibility: position ? "visible" : "hidden",
      zIndex: 350,
      minWidth: 180,
      maxHeight: 260,
      overflowY: "auto",
      background: C.surface,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      padding: 8,
      boxShadow: "0 4px 12px #00000022"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return _onChange3([]);
    },
    style: {
      background: "none",
      border: 0,
      color: C.blue,
      cursor: "pointer",
      padding: "3px 0 7px"
    }
  }, label), options.map(function (o) {
    return /*#__PURE__*/React.createElement("label", {
      key: o.value,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 0",
        fontSize: 12,
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: selected.includes(o.value),
      onChange: function onChange(e) {
        return _onChange3(e.target.checked ? [].concat(_toConsumableArray(selected), [o.value]) : selected.filter(function (v) {
          return v !== o.value;
        }));
      }
    }), o.label);
  })));
};
var filterHasValue = function filterHasValue(value) {
  return Array.isArray(value) ? value.length > 0 : !!value;
};
var filterMatches = function filterMatches(filter, value) {
  return !filterHasValue(filter) || filter === "all" || (Array.isArray(filter) ? filter.includes(value) : filter === value);
};
var _workedOnOf = function workedOnOf(data, visa) {
  if (!data || _typeof(data) !== "object") return false;
  return Object.entries(data).some(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
      key = _ref7[0],
      value = _ref7[1];
    return _typeof(value) === "object" ? _workedOnOf(value, visa) : /visa|createdBy/i.test(key) && String(value || "").toUpperCase() === visa;
  });
};
var _deletedLineIds = function deletedLineIds(data) {
  if (!data || _typeof(data) !== "object") return [];
  return [].concat(_toConsumableArray(data.deleted && data.id ? [data.id] : []), _toConsumableArray(Object.values(data).flatMap(function (v) {
    return _deletedLineIds(v);
  })));
};
var _purgeDeletedLines = function purgeDeletedLines(data) {
  var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (Array.isArray(data)) return data.filter(function (v) {
    return !(v !== null && v !== void 0 && v.deleted && (!ids || ids.has(v.id)));
  }).map(function (v) {
    return _purgeDeletedLines(v, ids);
  });
  if (data && _typeof(data) === "object") return Object.fromEntries(Object.entries(data).map(function (_ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
      k = _ref9[0],
      v = _ref9[1];
    return [k, _purgeDeletedLines(v, ids)];
  }));
  return data;
};
var IconBtn = function IconBtn(_ref0) {
  var onClick = _ref0.onClick,
    title = _ref0.title,
    children = _ref0.children,
    _ref0$color = _ref0.color,
    color = _ref0$color === void 0 ? C.accent : _ref0$color,
    disabled = _ref0.disabled;
  return /*#__PURE__*/React.createElement("button", {
    className: "no-print",
    onClick: onClick,
    disabled: disabled,
    title: title,
    style: {
      width: 22,
      height: 22,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: disabled ? C.border : color,
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: disabled ? "default" : "pointer",
      fontSize: 12,
      fontWeight: 800,
      opacity: disabled ? .45 : 1,
      lineHeight: 1,
      padding: 0,
      flexShrink: 0
    }
  }, children);
};
var PurgeLineButton = function PurgeLineButton(_ref1) {
  var user = _ref1.user,
    data = _ref1.data,
    onChange = _ref1.onChange,
    id = _ref1.id,
    _ref1$label = _ref1.label,
    label = _ref1$label === void 0 ? "cette ligne annulée" : _ref1$label;
  if (!isAdminManager(user)) return null;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: "Effacer d\xE9finitivement cette ligne annul\xE9e",
    onClick: function onClick(e) {
      e.stopPropagation();
      if (!_deletedLineIds(data).includes(id)) return;
      if (!window.confirm("Effacer d\xE9finitivement ".concat(label, ", ses remarques et son historique ? Cette action est irr\xE9versible."))) return;
      onChange(_purgeDeletedLines(data, new Set([id])));
    },
    style: {
      background: C.red + "15",
      border: "1px solid ".concat(C.red),
      borderRadius: 4,
      color: C.red,
      cursor: "pointer",
      padding: "3px 7px",
      fontSize: 11,
      marginLeft: 8,
      pointerEvents: "all"
    }
  }, "Effacer d\xE9finitivement");
};
var MiniIconBtn = function MiniIconBtn(_ref10) {
  var onClick = _ref10.onClick,
    title = _ref10.title,
    children = _ref10.children,
    _ref10$color = _ref10.color,
    color = _ref10$color === void 0 ? C.accent : _ref10$color,
    disabled = _ref10.disabled;
  return /*#__PURE__*/React.createElement("button", {
    className: "no-print",
    onClick: onClick,
    disabled: disabled,
    title: title,
    style: {
      width: 18,
      height: 18,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: disabled ? C.border : color,
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: disabled ? "default" : "pointer",
      fontSize: 10,
      fontWeight: 800,
      opacity: disabled ? .45 : 1,
      lineHeight: 1,
      padding: 0,
      flexShrink: 0
    }
  }, children);
};
var copyToClipboard = function copyToClipboard(text) {
  var v = String(text || "").trim();
  if (!v) return;
  try {
    var _navigator$clipboard;
    if ((_navigator$clipboard = navigator.clipboard) !== null && _navigator$clipboard !== void 0 && _navigator$clipboard.writeText) {
      navigator.clipboard.writeText(v);
      return;
    }
  } catch (_unused3) {}
  try {
    var ta = document.createElement("textarea");
    ta.value = v;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch (_unused4) {}
};
var buildTeamsOfText = function buildTeamsOfText(header) {
  var units = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var article = String((header === null || header === void 0 ? void 0 : header.codeArticle) || (header === null || header === void 0 ? void 0 : header.articleNo) || "N/A").trim() || "N/A";
  var description = String((header === null || header === void 0 ? void 0 : header.description) || "N/A").trim() || "N/A";
  var sourceUnits = (units || []).filter(function (unit) {
    return unit && !unit.deleted && (cleanSn(unit.sn) || cleanSn(unit.lot));
  });
  var fallback = cleanSn(header === null || header === void 0 ? void 0 : header.sn) || (cleanSn(header === null || header === void 0 ? void 0 : header.lot) ? "LOT ".concat(cleanSn(header.lot)) : "N/A");
  var identities = sourceUnits.length ? sourceUnits.map(function (unit) {
    return cleanSn(unit.sn) || "LOT ".concat(cleanSn(unit.lot));
  }) : [fallback];
  return _toConsumableArray(new Set(identities)).map(function (identity) {
    return "".concat(article, " - ").concat(description, " - ").concat(identity);
  }).join("\n");
};
var normLot = function normLot(v) {
  var s = String(v !== null && v !== void 0 ? v : "").trim().toUpperCase();
  if (/^\d+$/.test(s)) return s.padStart(10, "0").slice(-10);
  return s;
};
var CopyBtn = function CopyBtn(_ref11) {
  var value = _ref11.value,
    _ref11$title = _ref11.title,
    title = _ref11$title === void 0 ? "Copier" : _ref11$title;
  var disabled = !String(value || "").trim();
  return /*#__PURE__*/React.createElement(IconBtn, {
    onClick: function onClick(e) {
      var _e$stopPropagation;
      e === null || e === void 0 || (_e$stopPropagation = e.stopPropagation) === null || _e$stopPropagation === void 0 || _e$stopPropagation.call(e);
      copyToClipboard(value);
    },
    color: C.border,
    title: title,
    disabled: disabled
  }, "\u2398");
};
var CopyCell = function CopyCell(_ref12) {
  var value = _ref12.value,
    children = _ref12.children,
    title = _ref12.title;
  return /*#__PURE__*/React.createElement("div", {
    onDoubleClick: function onDoubleClick(e) {
      e.stopPropagation();
      copyToClipboard(value);
    },
    title: "".concat(title || "Copier", " : double-clic"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 0,
      minWidth: 0,
      cursor: String(value || "").trim() ? "copy" : "default"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, children));
};
var StampStatus = function StampStatus(_ref13) {
  var done = _ref13.done,
    visa = _ref13.visa,
    date = _ref13.date,
    color = _ref13.color,
    label = _ref13.label,
    onStamp = _ref13.onStamp,
    onClear = _ref13.onClear,
    _ref13$canClear = _ref13.canClear,
    canClear = _ref13$canClear === void 0 ? false : _ref13$canClear,
    _ref13$clearTitle = _ref13.clearTitle,
    clearTitle = _ref13$clearTitle === void 0 ? "Annuler en mode modification" : _ref13$clearTitle,
    onDateChange = _ref13.onDateChange,
    _ref13$disabled = _ref13.disabled,
    disabled = _ref13$disabled === void 0 ? false : _ref13$disabled;
  return done ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 0,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontWeight: 700,
      fontSize: 10,
      color: color
    }
  }, visa), canClear && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    title: clearTitle,
    "aria-label": clearTitle,
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 12,
      background: "none",
      border: 0,
      padding: "0 2px"
    }
  }, "\u21BA")), onDateChange ? /*#__PURE__*/React.createElement(Input, {
    value: date || "",
    onChange: onDateChange,
    small: true,
    title: "Corriger la date/heure du tampon",
    style: {
      width: 86,
      fontSize: 8,
      fontFamily: "monospace",
      textAlign: "center",
      padding: "1px 3px"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontSize: 8,
      color: C.muted
    }
  }, date)) : /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onStamp,
    disabled: disabled,
    style: {
      background: (disabled ? C.border : color) + "22",
      border: "1px solid ".concat(disabled ? C.border : color),
      borderRadius: 3,
      color: disabled ? C.muted : color,
      fontSize: 9,
      padding: "1px 4px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 700,
      whiteSpace: "nowrap",
      opacity: disabled ? .55 : 1
    }
  }, label);
};
var ActionGroup = function ActionGroup(_ref14) {
  var children = _ref14.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "no-print",
    style: {
      display: "inline-flex",
      gap: 2,
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "all"
    }
  }, children);
};
var Badge = function Badge(_ref15) {
  var label = _ref15.label,
    color = _ref15.color;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: color + "22",
      border: "1px solid ".concat(color),
      color: color,
      borderRadius: 3,
      padding: "1px 6px",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: .5,
      fontFamily: "monospace",
      whiteSpace: "nowrap"
    }
  }, label);
};

// ─── Prochain étuvage ─────────────────────────────────────────────────────
// Cycle fixe : dernier étuvage + 72h
var nextEtuvageInfo = function nextEtuvageInfo(etuvageRows) {
  var done = (etuvageRows || []).filter(function (r) {
    return !r.deleted && r.entreeDT;
  });

  // Parse "DD/MM/YYYY HH:MM"
  var parseDT = function parseDT(s) {
    if (!s) return null;
    var _s$split = s.split(" "),
      _s$split2 = _slicedToArray(_s$split, 2),
      datePart = _s$split2[0],
      timePart = _s$split2[1];
    var _datePart$split = datePart.split("/"),
      _datePart$split2 = _slicedToArray(_datePart$split, 3),
      dd = _datePart$split2[0],
      mm = _datePart$split2[1],
      yyyy = _datePart$split2[2];
    var _split = (timePart || "00:00").split(":"),
      _split2 = _slicedToArray(_split, 2),
      hh = _split2[0],
      mn = _split2[1];
    return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd), parseInt(hh), parseInt(mn));
  };

  // Find most recent
  var last = done.reduce(function (a, b) {
    var da = parseDT(a === null || a === void 0 ? void 0 : a.entreeDT) || new Date(0);
    var db = parseDT(b.entreeDT) || new Date(0);
    return db > da ? b : a;
  }, null);
  var lastDT = last ? parseDT(last.entreeDT) : null;
  var fmtDt = function fmtDt(d) {
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var yy = String(d.getFullYear()).slice(2);
    var hh = String(d.getHours()).padStart(2, "0");
    var mn = String(d.getMinutes()).padStart(2, "0");
    return "".concat(dd, "/").concat(mm, "/").concat(yy, " ").concat(hh, ":").concat(mn);
  };
  var dayNames = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  if (!lastDT) {
    return {
      label: "Aucun étuvage enregistré",
      overdue: false,
      diffDays: 0,
      diffH: 0,
      lastLabel: null,
      count: 0
    };
  }

  // Next = last + 72h exactly
  var next = new Date(lastDT.getTime() + 72 * 3600 * 1000);
  var now = new Date();
  var diffMs = next - now;
  var overdue = diffMs < 0;
  var absDiff = Math.abs(diffMs);
  var diffDays = Math.floor(absDiff / 86400000);
  var diffH = Math.floor(absDiff % 86400000 / 3600000);
  var diffMin = Math.floor(absDiff % 3600000 / 60000);
  return {
    label: dayNames[next.getDay()] + " " + fmtDt(next),
    nextAt: next.getTime(),
    overdue: overdue,
    diffDays: diffDays,
    diffH: diffH,
    diffMin: diffMin,
    lastLabel: fmtDt(lastDT),
    count: done.length
  };
};
// ─── Validation de ligne ──────────────────────────────────────────────────
// Chaque ligne a un état validated:bool + validError:str
// Tant que non validée : éditable + bouton ✓ Valider
// Validée : verrouillée + bouton ✎ Modifier
// Suppression : brouillon → suppression directe; validée → soft-delete

var ROW_LOCKED_STYLE = {
  pointerEvents: "none",
  opacity: 1
};
var LOCKED_INPUT_STYLE = {
  get background() {
    return currentTheme === "light" ? "#f0f3f6" : C.raised;
  },
  get color() {
    return currentTheme === "light" ? C.text : C.muted;
  },
  cursor: "default"
};

// Vérifie les champs requis, retourne liste des labels manquants
var checkRequired = function checkRequired(row, requiredFields) {
  return requiredFields.filter(function (_ref16) {
    var key = _ref16.key;
    return !row[key] || String(row[key]).trim() === "";
  }).map(function (_ref17) {
    var label = _ref17.label;
    return label;
  });
};
var duplicateRow = function duplicateRow(row, user) {
  var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _objectSpread(_objectSpread({}, row), {}, {
    id: uid(),
    createdVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
    createdDT: nowDT(),
    validated: false,
    validError: "",
    deleted: false,
    deletedReason: "",
    deletedVisa: "",
    deletedDate: "",
    editBase: undefined,
    editHistory: [],
    comments: row.comments ? _toConsumableArray(row.comments) : []
  }, extra);
};
var appDateTimestamp = function appDateTimestamp(value) {
  var match = String(value || "").match(/^(\d{2})[/.](\d{2})[/.](\d{2}|\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) return 0;
  var year = match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3]);
  return new Date(year, Number(match[2]) - 1, Number(match[1]), Number(match[4] || 0), Number(match[5] || 0), Number(match[6] || 0)).getTime();
};
var sortByNewestOperation = function sortByNewestOperation(items) {
  var getDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (item) {
    return item === null || item === void 0 ? void 0 : item.createdDT;
  };
  var getDraft = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (item) {
    return !(item !== null && item !== void 0 && item.validated) && !(item !== null && item !== void 0 && item.deleted);
  };
  return _toConsumableArray(items || []).map(function (item, index) {
    return {
      item: item,
      index: index,
      time: appDateTimestamp(getDate(item)),
      draft: getDraft(item)
    };
  }).sort(function (a, b) {
    return Number(b.draft) - Number(a.draft) || b.time - a.time || b.index - a.index;
  }).map(function (entry) {
    return entry.item;
  });
};
var copyOriginTitle = function copyOriginTitle(origin) {
  return origin ? ["Copi\xE9 depuis OF ".concat(origin.sourceOf || "N/A", " \xB7 ").concat(origin.sourceArticle || "Article N/A", " \xB7 ").concat(origin.sourceUnits || "SN/LOT N/A"), "Copi\xE9 le ".concat(origin.copiedAt || "N/A", " par ").concat(origin.copiedBy || "N/A"), origin.mode === "same" ? "Même opération sur plusieurs SN/OF" : "Nouvelle opération à partir de la ligne source"].join("\n") : "";
};
var CopyOriginMark = function CopyOriginMark(_ref18) {
  var origin = _ref18.origin;
  return origin ? /*#__PURE__*/React.createElement("span", {
    "aria-label": "Provenance de la copie",
    title: copyOriginTitle(origin),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      color: C.blue,
      fontSize: 12,
      fontWeight: 800,
      cursor: "help"
    }
  }, "\u29C9") : null;
};
var snapshotFields = function snapshotFields(row, fields) {
  return fields.reduce(function (a, f) {
    var _row$f$key;
    return _objectSpread(_objectSpread({}, a), {}, _defineProperty({}, f.key, (_row$f$key = row === null || row === void 0 ? void 0 : row[f.key]) !== null && _row$f$key !== void 0 ? _row$f$key : ""));
  }, {});
};
var changedFields = function changedFields(before, after, fields) {
  return fields.map(function (f) {
    var _before$f$key, _after$f$key;
    return {
      label: f.label,
      from: String((_before$f$key = before === null || before === void 0 ? void 0 : before[f.key]) !== null && _before$f$key !== void 0 ? _before$f$key : ""),
      to: String((_after$f$key = after === null || after === void 0 ? void 0 : after[f.key]) !== null && _after$f$key !== void 0 ? _after$f$key : "")
    };
  }).filter(function (c) {
    return c.from !== c.to;
  });
};
var withEditHistory = function withEditHistory(row, user, fields) {
  var changes = row.editBase ? changedFields(row.editBase, row, fields) : [];
  return _objectSpread(_objectSpread({}, row), {}, {
    validated: true,
    validError: "",
    editBase: undefined,
    _scopeEditConfirmed: undefined,
    editHistory: changes.length ? [].concat(_toConsumableArray(row.editHistory || []), [{
      id: uid(),
      dt: nowDT(),
      visa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
      changes: changes
    }]) : row.editHistory || []
  });
};
var HistoryNote = function HistoryNote(_ref19) {
  var row = _ref19.row,
    _ref19$open = _ref19.open,
    open = _ref19$open === void 0 ? false : _ref19$open;
  return ((row === null || row === void 0 ? void 0 : row.editHistory) || []).length > 0 && /*#__PURE__*/React.createElement("details", {
    className: "edit-history",
    open: open,
    style: {
      color: C.blue,
      fontSize: 10,
      fontFamily: "monospace"
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      fontWeight: 800,
      listStyle: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      border: "1px solid ".concat(C.blue),
      borderRadius: 6,
      padding: "2px 6px",
      background: C.blue + "12"
    }
  }, "\u270E Historique modifs (", (row.editHistory || []).length, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 4
    }
  }, _toConsumableArray(row.editHistory || []).slice(-3).reverse().map(function (h) {
    return /*#__PURE__*/React.createElement("span", {
      key: h.id,
      style: {
        color: C.muted
      }
    }, "le ", /*#__PURE__*/React.createElement("strong", null, h.dt), " par ", /*#__PURE__*/React.createElement("strong", null, h.visa), " \u2014 ", (h.changes || []).map(function (c) {
      return "".concat(c.label, " \"").concat(c.from || "—", "\" \u2192 \"").concat(c.to || "—", "\"");
    }).join(" ; "));
  })));
};
var HistoryTrail = function HistoryTrail() {
  return null;
};
var HistoryBtn = function HistoryBtn(_ref20) {
  var row = _ref20.row,
    _ref20$mini = _ref20.mini,
    mini = _ref20$mini === void 0 ? false : _ref20$mini;
  var hist = (row === null || row === void 0 ? void 0 : row.editHistory) || [];
  var disabled = hist.length === 0;
  var show = function show(e) {
    var _e$stopPropagation2;
    e === null || e === void 0 || (_e$stopPropagation2 = e.stopPropagation) === null || _e$stopPropagation2 === void 0 || _e$stopPropagation2.call(e);
    if (disabled) return;
    window.alert(hist.slice().reverse().map(function (h) {
      return "".concat(h.dt, " - ").concat(h.visa, "\n") + (h.changes || []).map(function (c) {
        return "\u2022 ".concat(c.label, ": \"").concat(c.from || "—", "\" \u2192 \"").concat(c.to || "—", "\"");
      }).join("\n");
    }).join("\n\n"));
  };
  var BtnCmp = mini ? MiniIconBtn : IconBtn;
  return /*#__PURE__*/React.createElement(BtnCmp, {
    onClick: show,
    color: disabled ? C.border : C.blue,
    title: disabled ? "Historique : aucune modification" : "Historique des modifications",
    disabled: disabled
  }, "\u25F7", hist.length || "");
};
var pdfAscii = function pdfAscii(v) {
  return String(v !== null && v !== void 0 ? v : "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ").trim() || "-";
};
var pdfText = function pdfText(v) {
  return String(v !== null && v !== void 0 ? v : "").replace(/[’‘]/g, "'").replace(/[–—]/g, "-").replace(/œ/g, "oe").replace(/Œ/g, "OE").replace(/[^\x20-\x7E\xA0-\xFF\n]/g, " ").replace(/\s+/g, " ").trim() || "-";
};
var pdfEsc = function pdfEsc(v) {
  return _toConsumableArray(pdfText(v)).map(function (character) {
    if (character === "\\") return "\\\\";
    if (character === "(") return "\\(";
    if (character === ")") return "\\)";
    var code = character.charCodeAt(0);
    return code >= 128 ? "\\".concat(code.toString(8).padStart(3, "0")) : character;
  }).join("");
};
var HELVETICA_WIDTHS = {
  " ": 278,
  "!": 278,
  '"': 355,
  "#": 556,
  "$": 556,
  "%": 889,
  "&": 667,
  "'": 191,
  "(": 333,
  ")": 333,
  "*": 389,
  "+": 584,
  ",": 278,
  "-": 333,
  ".": 278,
  "/": 278,
  ":": 278,
  ";": 278,
  "<": 584,
  "=": 584,
  ">": 584,
  "?": 556,
  "@": 1015,
  "A": 667,
  "B": 667,
  "C": 722,
  "D": 722,
  "E": 667,
  "F": 611,
  "G": 778,
  "H": 722,
  "I": 278,
  "J": 500,
  "K": 667,
  "L": 556,
  "M": 833,
  "N": 722,
  "O": 778,
  "P": 667,
  "Q": 778,
  "R": 722,
  "S": 667,
  "T": 611,
  "U": 722,
  "V": 667,
  "W": 944,
  "X": 667,
  "Y": 667,
  "Z": 611,
  "[": 278,
  "\\": 278,
  "]": 278,
  "^": 469,
  "_": 556,
  "`": 333,
  "a": 556,
  "b": 556,
  "c": 500,
  "d": 556,
  "e": 556,
  "f": 278,
  "g": 556,
  "h": 556,
  "i": 222,
  "j": 222,
  "k": 500,
  "l": 222,
  "m": 833,
  "n": 556,
  "o": 556,
  "p": 556,
  "q": 556,
  "r": 333,
  "s": 500,
  "t": 278,
  "u": 556,
  "v": 500,
  "w": 722,
  "x": 500,
  "y": 500,
  "z": 500,
  "{": 334,
  "|": 260,
  "}": 334,
  "~": 584
};
"0123456789".split("").forEach(function (character) {
  HELVETICA_WIDTHS[character] = 556;
});
var pdfHelveticaTextWidth = function pdfHelveticaTextWidth(value, size) {
  return _toConsumableArray(pdfText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")).reduce(function (sum, character) {
    return sum + (HELVETICA_WIDTHS[character] || 556);
  }, 0) * size / 1000;
};
var pdfSafeName = function pdfSafeName(v) {
  return pdfAscii(v).replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "rapport";
};
var fileSafeName = function fileSafeName(v) {
  return pdfAscii(v).replace(/#/g, "SN").replace(/[<>:"/\\|?*\x00-\x1F]+/g, " ").replace(/\s+/g, " ").trim().replace(/[ .]+$/, "") || "export";
};
var csvCell = function csvCell(v) {
  return "\"".concat(String(v !== null && v !== void 0 ? v : "").replace(/"/g, '""'), "\"");
};
var strikeText = function strikeText(v) {
  return String(v !== null && v !== void 0 ? v : "").split("").map(function (ch) {
    return ch + "\u0336";
  }).join("");
};
var compactArticleCode = function compactArticleCode(v) {
  return String(v !== null && v !== void 0 ? v : "").replace(/\s+/g, "").trim();
};
var consoDescriptionForCsv = function consoDescriptionForCsv() {
  var conso = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var code = compactArticleCode(conso.sap || conso.code || "");
  var label = String(conso.label || fallback || "").trim();
  return code ? label.replace(new RegExp("^" + code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*[-–—]?\\s*", "i"), "").trim() : label;
};
var visaStamp = function visaStamp(visa, dt) {
  return [visa, dt].filter(Boolean).join(" - ");
};
var isFourEquip = function isFourEquip(r) {
  return !!(r !== null && r !== void 0 && r.isFour || r !== null && r !== void 0 && r.four || r !== null && r !== void 0 && r.isOven);
};
var uniqueOvenChoices = function uniqueOvenChoices(rows) {
  var seen = new Set();
  return (rows || []).filter(function (row) {
    if (row.deleted || !isFourEquip(row)) return false;
    var key = String(row.nInv || row.designation || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
var computeReworkWarnings = function computeReworkWarnings() {
  var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var snRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "all";
  var repereKey = function repereKey(r) {
    return ((r === null || r === void 0 ? void 0 : r.repere) || "").trim().toUpperCase();
  };
  var units = snRows.length ? snRows.map(function (s) {
    return {
      id: s.id,
      label: snTitle(s)
    };
  }) : [{
    id: "all",
    label: "Tous"
  }];
  var unitIdsForRow = function unitIdsForRow(row) {
    var scope = snScope(row, snRows);
    var excluded = ((row === null || row === void 0 ? void 0 : row.snExcludeIds) || []).filter(function (id) {
      return units.some(function (u) {
        return u.id === id;
      });
    });
    var ids = scope.mode === "all" ? units.map(function (u) {
      return u.id;
    }).filter(function (id) {
      return !excluded.includes(id);
    }) : scope.ids.filter(function (id) {
      return units.some(function (u) {
        return u.id === id;
      });
    });
    if (filter && filter !== "all" && filter !== "scope-all") return ids.includes(filter) ? [filter] : [];
    if (filter === "scope-all") return scope.mode === "all" ? ids : [];
    return ids;
  };
  var unitLabel = function unitLabel(id) {
    var _units$find;
    return ((_units$find = units.find(function (u) {
      return u.id === id;
    })) === null || _units$find === void 0 ? void 0 : _units$find.label) || "Tous";
  };
  var state = {
    installed: {},
    openD: {},
    first: [],
    pointed: [],
    mismatch: [],
    sequence: []
  };
  var lastAction = {};
  var valueKey = function valueKey(r) {
    return String(r.valeur || "").replace(/\s+/g, "").toUpperCase();
  };
  var addMismatch = function addMismatch(previous, current, kind, repere, uid) {
    var fromValue = valueKey(previous),
      toValue = valueKey(current);
    if (fromValue && toValue && fromValue !== toValue && !previous.isAdjust && !current.isAdjust) {
      state.mismatch.push({
        repere: repere,
        previous: previous,
        current: current,
        d: previous.action1 === "D" ? previous : current,
        s: current.action1 === "D" ? previous : current,
        kind: kind,
        unitId: uid,
        snLabel: unitLabel(uid)
      });
    }
  };
  var ordered = rows.map(function (r, index) {
    return {
      r: r,
      index: index
    };
  }).sort(function (a, b) {
    var stamp = function stamp(r) {
      return String(r.createdDT || "").replace(/^(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
    };
    return a.r.createdDT && b.r.createdDT ? stamp(a.r).localeCompare(stamp(b.r)) || a.index - b.index : a.index - b.index;
  });
  ordered.forEach(function (_ref21) {
    var r = _ref21.r;
    if (r.deleted) return;
    var key = repereKey(r);
    if (!key || !["S", "D", "P"].includes(r.action1)) return;
    unitIdsForRow(r).forEach(function (uid) {
      var k = "".concat(uid, "::").concat(key);
      var previous = lastAction[k];
      if (previous && (previous.action1 === r.action1 || previous.action1 === "S" && r.action1 === "P")) state.sequence.push({
        repere: key,
        row: r,
        previous: previous,
        unitId: uid,
        snLabel: unitLabel(uid)
      });
      if (r.action1 === "S") {
        var _state$openD$k, _state$installed$k;
        var d = (_state$openD$k = state.openD[k]) === null || _state$openD$k === void 0 ? void 0 : _state$openD$k.d;
        if (d) {
          addMismatch(d, r, "resolder", key, uid);
          delete state.openD[k];
        } else if (((_state$installed$k = state.installed[k]) === null || _state$installed$k === void 0 ? void 0 : _state$installed$k.action1) === "P") {
          addMismatch(state.installed[k], r, "finish-point", key, uid);
        }
        state.installed[k] = r;
      }
      if (r.action1 === "D") {
        var installed = state.installed[k];
        if (installed) addMismatch(installed, r, "desolder", key, uid);
        state.openD[k] = {
          repere: key,
          d: r,
          initial: !installed,
          unitId: uid,
          snLabel: unitLabel(uid)
        };
        delete state.installed[k];
      }
      if (r.action1 === "P") {
        var _state$openD$k2;
        var _d = (_state$openD$k2 = state.openD[k]) === null || _state$openD$k2 === void 0 ? void 0 : _state$openD$k2.d;
        if (_d) {
          addMismatch(_d, r, "repoint", key, uid);
          delete state.openD[k];
        }
        state.installed[k] = r;
      }
      lastAction[k] = r;
    });
  });
  state.first = Object.values(state.openD).filter(function (w) {
    return w.initial;
  });
  state.pointed = Object.entries(state.installed).filter(function (_ref22) {
    var _ref23 = _slicedToArray(_ref22, 2),
      r = _ref23[1];
    return r.action1 === "P";
  }).map(function (_ref24) {
    var _ref25 = _slicedToArray(_ref24, 2),
      k = _ref25[0],
      row = _ref25[1];
    var _k$split = k.split("::"),
      _k$split2 = _slicedToArray(_k$split, 2),
      unitId = _k$split2[0],
      repere = _k$split2[1];
    return {
      repere: repere,
      row: row,
      unitId: unitId,
      snLabel: unitLabel(unitId)
    };
  });
  return state;
};
var computeOpenDesoudes = function computeOpenDesoudes() {
  var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return Object.values(rows.reduce(function (open, r) {
    if (r !== null && r !== void 0 && r.deleted) return open;
    var key = ((r === null || r === void 0 ? void 0 : r.repere) || "").trim().toUpperCase();
    if (!key) return open;
    if (["S", "P"].includes(r.action1)) delete open[key];else if (r.action1 === "D") open[key] = r;
    return open;
  }, {}));
};
var REWORK_CTRL_ALLOWED_ACTIONS = new Set(["S", "R", "P"]);
var REWORK_CTRL_REQUIRED_ACTIONS = new Set(["S", "R"]);
var canActionReceiveCtrl = function canActionReceiveCtrl(action) {
  return REWORK_CTRL_ALLOWED_ACTIONS.has(action);
};
var computeMissingReworkControls = function computeMissingReworkControls() {
  var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return rows.filter(function (r) {
    return !(r !== null && r !== void 0 && r.deleted) && REWORK_CTRL_REQUIRED_ACTIONS.has(r === null || r === void 0 ? void 0 : r.action1) && !(r !== null && r !== void 0 && r.visaCtrl);
  });
};
var connectorSortKey = function connectorSortKey(v) {
  return String(v || "").trim().toUpperCase().replace(/^([A-Z]+)(\d+)$/, function (_, a, n) {
    return "".concat(a).concat(String(n).padStart(6, "0"));
  });
};
var normalizeMatingAction = function normalizeMatingAction(action) {
  return action === "Matting" ? "Mating" : action === "Dematting" ? "Demating" : action;
};
var buildMatingCycles = function buildMatingCycles(c) {
  var events = ((c === null || c === void 0 ? void 0 : c.events) || []).filter(function (e) {
    return !e.deleted && e.action;
  }).map(function (e) {
    return _objectSpread(_objectSpread({}, e), {}, {
      action: normalizeMatingAction(e.action)
    });
  });
  var cycles = [];
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var next = events[i + 1];
    if (ev.action === "Mating") {
      var row = {
        mat: ev,
        dem: null
      };
      if ((next === null || next === void 0 ? void 0 : next.action) === "Demating") {
        row.dem = next;
        i++;
      }
      cycles.push(row);
    } else if (ev.action === "Demating") {
      cycles.push({
        mat: null,
        dem: ev
      });
    }
  }
  return cycles;
};
var cycleLastDt = function cycleLastDt(cycle) {
  var _cycle$dem, _cycle$mat;
  return (cycle === null || cycle === void 0 || (_cycle$dem = cycle.dem) === null || _cycle$dem === void 0 ? void 0 : _cycle$dem.dt) || (cycle === null || cycle === void 0 || (_cycle$mat = cycle.mat) === null || _cycle$mat === void 0 ? void 0 : _cycle$mat.dt) || "";
};
var connectorStateTone = function connectorStateTone(lastAction) {
  return lastAction === "Mating" ? {
    fill: "0.88 0.96 0.90",
    stroke: "0.14 0.45 0.21",
    text: "0.14 0.45 0.21"
  } : lastAction === "Demating" ? {
    fill: "0.99 0.91 0.91",
    stroke: "0.85 0.21 0.20",
    text: "0.85 0.21 0.20"
  } : {
    fill: "0.90 0.93 0.97",
    stroke: "0.78 0.82 0.87",
    text: "0.00 0.27 0.57"
  };
};
var REPORT_SECTIONS = [{
  id: "rework",
  label: "Adjust/Rework",
  title: "Adjust / Rework"
}, {
  id: "consommables",
  label: "Consommables",
  title: "Consommables"
}, {
  id: "etuvage",
  label: "Étuvages",
  title: "Etuvages"
}, {
  id: "testequip",
  label: "Test Équipement",
  title: "Test Equip."
}, {
  id: "demating",
  label: "Mating/Demating",
  title: "Mating / Demating"
}, {
  id: "faits",
  label: "Faits techniques",
  title: "Faits"
}, {
  id: "openwork",
  label: "Open Work",
  title: "Open Work"
}];
var buildSimplePdf = function buildSimplePdf(_ref26) {
  var width = _ref26.width,
    height = _ref26.height,
    pages = _ref26.pages,
    _ref26$logoImage = _ref26.logoImage,
    logoImage = _ref26$logoImage === void 0 ? null : _ref26$logoImage;
  var objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [] /Count 0 >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"];
  var logoObjId = logoImage ? objects.length + 1 : null;
  if (logoImage) {
    objects.push("<< /Type /XObject /Subtype /Image /Width ".concat(logoImage.width, " /Height ").concat(logoImage.height, " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ").concat(logoImage.data.length + 1, " >>\nstream\n").concat(logoImage.data, ">\nendstream"));
  }
  var pageIds = [];
  pages.forEach(function (ops) {
    var pageId = objects.length + 1;
    var contentId = pageId + 1;
    pageIds.push(pageId);
    var xobj = logoObjId ? "/XObject << /Logo ".concat(logoObjId, " 0 R >> ") : "";
    objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ".concat(width.toFixed(2), " ").concat(height.toFixed(2), "] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> ").concat(xobj, ">> /Contents ").concat(contentId, " 0 R >>"));
    var stream = ops.join("\n");
    objects.push("<< /Length ".concat(stream.length, " >>\nstream\n").concat(stream, "\nendstream"));
  });
  objects[1] = "<< /Type /Pages /Kids [".concat(pageIds.map(function (id) {
    return "".concat(id, " 0 R");
  }).join(" "), "] /Count ").concat(pageIds.length, " >>");
  var pdf = "%PDF-1.4\n";
  var offsets = [0];
  objects.forEach(function (object, index) {
    offsets[index + 1] = pdf.length;
    pdf += "".concat(index + 1, " 0 obj\n").concat(object, "\nendobj\n");
  });
  var xref = pdf.length;
  pdf += "xref\n0 ".concat(objects.length + 1, "\n0000000000 65535 f \n");
  for (var id = 1; id <= objects.length; id++) pdf += String(offsets[id]).padStart(10, "0") + " 00000 n \n";
  pdf += "trailer\n<< /Size ".concat(objects.length + 1, " /Root 1 0 R >>\nstartxref\n").concat(xref, "\n%%EOF");
  return new Blob([pdf], {
    type: "application/pdf"
  });
};
var componentLabelUnits = function componentLabelUnits(ofData, row) {
  var _ofData$units;
  var selectedUnitIds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var header = (ofData === null || ofData === void 0 ? void 0 : ofData.header) || {};
  var units = ((ofData === null || ofData === void 0 || (_ofData$units = ofData.units) === null || _ofData$units === void 0 ? void 0 : _ofData$units.rows) || snRowsFromHeader(header)).filter(function (unit) {
    return !unit.deleted && hasUnitIdentity(unit);
  });
  var selected = selectedUnitIds !== null && selectedUnitIds !== void 0 && selectedUnitIds.length ? units.filter(function (unit) {
    return selectedUnitIds.includes(unit.id);
  }) : units;
  var matched = selected.filter(function (unit) {
    return rowMatchesSn(row, unit, units);
  });
  if (matched.length) return matched;
  if (units.length) return [];
  return [{
    id: "of-global",
    sn: header.sn || "",
    lot: header.lot || ""
  }];
};
var buildComponentLabelPdf = function buildComponentLabelPdf(_ref27) {
  var ofData = _ref27.ofData,
    row = _ref27.row,
    _ref27$selectedUnitId = _ref27.selectedUnitIds,
    selectedUnitIds = _ref27$selectedUnitId === void 0 ? null : _ref27$selectedUnitId;
  var MM = 72 / 25.4;
  var width = 76 * MM,
    height = 50.8 * MM;
  var header = (ofData === null || ofData === void 0 ? void 0 : ofData.header) || {};
  var units = componentLabelUnits(ofData, row, selectedUnitIds);
  if (!units.length) throw new Error("Cette ligne ne concerne pas le SN sélectionné.");
  var clipped = function clipped(value, max) {
    var text = pdfText(value || "N/A");
    return text.length > max ? text.slice(0, Math.max(1, max - 3)) + "..." : text;
  };
  var txt = function txt(value, x, y) {
    var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 7;
    var bold = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "0.08 0.10 0.14";
    return "BT /".concat(bold ? "F2" : "F1", " ").concat(size, " Tf ").concat(color, " rg 1 0 0 1 ").concat(x.toFixed(2), " ").concat(y.toFixed(2), " Tm (").concat(pdfEsc(value), ") Tj ET");
  };
  var line = function line(x1, y1, x2, y2) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "0.70 0.73 0.77";
    var lineWidth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : .45;
    return "q ".concat(color, " RG ").concat(lineWidth, " w ").concat(x1.toFixed(2), " ").concat(y1.toFixed(2), " m ").concat(x2.toFixed(2), " ").concat(y2.toFixed(2), " l S Q");
  };
  var rect = function rect(x, y, w, h) {
    var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "0.20 0.24 0.30";
    var lineWidth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : .55;
    return "q ".concat(color, " RG ").concat(lineWidth, " w ").concat(x.toFixed(2), " ").concat(y.toFixed(2), " ").concat(w.toFixed(2), " ").concat(h.toFixed(2), " re S Q");
  };
  var pages = units.map(function (unit) {
    var identity = unit.sn || unit.lot || "N/A";
    var description = clipped(header.description, 58);
    var madeArticle = compactArticleCode(header.codeArticle || header.articleNo) || "N/A";
    var componentArticle = compactArticleCode(row === null || row === void 0 ? void 0 : row.codeERP) || "N/A";
    var ofAndSn = "".concat(header.of || "N/A", " - ").concat(identity);
    var articleLine = "".concat(madeArticle, " - ").concat(description);
    var mainLine = "".concat((row === null || row === void 0 ? void 0 : row.repere) || "N/A", " - ").concat((row === null || row === void 0 ? void 0 : row.valeur) || "N/A");
    var componentLine = "(".concat(componentArticle, ")");
    var footerLine = "Dessoud\xE9 le ".concat((row === null || row === void 0 ? void 0 : row.createdDT) || "N/A", " | Visa : ").concat((row === null || row === void 0 ? void 0 : row.createdVisa) || "N/A");
    var fit = function fit(value, max, min, maxWidth) {
      return Math.max(min, Math.min(max, maxWidth / Math.max(1, pdfHelveticaTextWidth(value, 1))));
    };
    var centered = function centered(value, y, size) {
      var bold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "0.08 0.10 0.14";
      return txt(value, (width - pdfHelveticaTextWidth(value, size)) / 2, y, size, bold, color);
    };
    var ofSize = fit(ofAndSn, 12, 8, width - 12);
    var articleSize = fit(articleLine, 9.5, 6.2, width - 12);
    var mainSize = fit(mainLine, 16, 9, width - 8);
    var componentSize = fit(componentLine, 8.5, 6, width - 10);
    var footerSize = fit(footerLine, 7.2, 5.3, width - 10);
    var ops = ["q 0.02 0.02 0.02 rg 0 ".concat((height - 42).toFixed(2), " ").concat(width.toFixed(2), " 42 re f Q"), centered(ofAndSn, height - 17, ofSize, false, "1 1 1"), centered(articleLine, height - 35, articleSize, false, "1 1 1"), centered(mainLine, height - 61, mainSize, false), centered(componentLine, height - 79, componentSize, false), line(0, height - 86, width, height - 86, "0.08 0.10 0.14", 1.15), line(0, 19, width, 19, "0.08 0.10 0.14", 1.15), centered(footerLine, 7, footerSize, false)];
    return ops;
  });
  return buildSimplePdf({
    width: width,
    height: height,
    pages: pages
  });
};
var buildComponentRetentionSheetsPdf = function buildComponentRetentionSheetsPdf(_ref28) {
  var _ofData$units2, _ofData$rework;
  var ofData = _ref28.ofData,
    _ref28$selectedUnitId = _ref28.selectedUnitIds,
    selectedUnitIds = _ref28$selectedUnitId === void 0 ? null : _ref28$selectedUnitId,
    _ref28$logoImage = _ref28.logoImage,
    logoImage = _ref28$logoImage === void 0 ? null : _ref28$logoImage,
    _ref28$exportedAt = _ref28.exportedAt,
    exportedAt = _ref28$exportedAt === void 0 ? "" : _ref28$exportedAt,
    _ref28$exportedBy = _ref28.exportedBy,
    exportedBy = _ref28$exportedBy === void 0 ? "" : _ref28$exportedBy;
  var MM = 72 / 25.4;
  var width = 297 * MM,
    height = 210 * MM;
  var header = (ofData === null || ofData === void 0 ? void 0 : ofData.header) || {};
  var allUnits = ((ofData === null || ofData === void 0 || (_ofData$units2 = ofData.units) === null || _ofData$units2 === void 0 ? void 0 : _ofData$units2.rows) || snRowsFromHeader(header)).filter(function (unit) {
    return !unit.deleted && hasUnitIdentity(unit);
  });
  var units = selectedUnitIds !== null && selectedUnitIds !== void 0 && selectedUnitIds.length ? allUnits.filter(function (unit) {
    return selectedUnitIds.includes(unit.id);
  }) : allUnits;
  var targets = units.length ? units : [{
    id: "of-global",
    sn: header.sn || "",
    lot: header.lot || ""
  }];
  var rows = ((ofData === null || ofData === void 0 || (_ofData$rework = ofData.rework) === null || _ofData$rework === void 0 ? void 0 : _ofData$rework.rows) || []).filter(function (row) {
    return !row.deleted && row.validated && row.action1 === "D";
  });
  var labelsPerPage = 9;
  var labelW = 76 * MM,
    labelH = 50.8 * MM,
    gapX = 8 * MM,
    gapY = 3 * MM;
  var startX = (width - (labelW * 3 + gapX * 2)) / 2;
  var gridTop = height - 39 * MM;
  var textWidth = function textWidth(value, size) {
    var bold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return pdfText(value).length * size * (bold ? .54 : .48);
  };
  var pages = [];
  targets.forEach(function (unit) {
    var unitRows = rows.filter(function (row) {
      return unit.id === "of-global" || rowMatchesSn(row, unit, allUnits);
    });
    var requiredPages = Math.max(2, Math.ceil(unitRows.length / labelsPerPage));
    var pageCount = requiredPages % 2 === 0 ? requiredPages : requiredPages + 1;
    for (var sheet = 0; sheet < pageCount; sheet++) {
      var ops = [];
      var title = "COMPOSANTS DESSOUDÉS CONSERVÉS";
      var margin = 28,
        top = height - margin;
      if (logoImage) {
        var logoW = 113.39;
        var logoH = Math.min(32, logoW * logoImage.height / logoImage.width);
        ops.push("q ".concat(logoW.toFixed(2), " 0 0 ").concat(logoH.toFixed(2), " ").concat(margin.toFixed(2), " ").concat((top - logoH + 2).toFixed(2), " cm /Logo Do Q"));
      }
      ops.push("BT /F2 14 Tf 0.12 0.43 0.92 rg 1 0 0 1 ".concat(((width - textWidth(title, 14, true)) / 2).toFixed(2), " ").concat((top - 7).toFixed(2), " Tm (").concat(pdfEsc(title), ") Tj ET"));
      ops.push("BT /F2 7 Tf 0.00 0.27 0.57 rg 1 0 0 1 ".concat((width - margin - textWidth("SP-F001A", 7, true)).toFixed(2), " ").concat((top - 8).toFixed(2), " Tm (SP-F001A) Tj ET"));
      var exportText = pdfText("".concat(exportedAt).concat(exportedBy ? " - ".concat(exportedBy) : ""));
      ops.push("BT /F1 6 Tf 0.31 0.35 0.41 rg 1 0 0 1 ".concat((width - margin - textWidth(exportText, 6)).toFixed(2), " ").concat((top - 20).toFixed(2), " Tm (").concat(pdfEsc(exportText), ") Tj ET"));
      var lineY = top - 34;
      ops.push("q 0.00 0.27 0.57 RG .6 w ".concat(margin.toFixed(2), " ").concat(lineY.toFixed(2), " m ").concat((width - margin).toFixed(2), " ").concat(lineY.toFixed(2), " l S Q"));
      var identity = snTitle(unit);
      var article = "".concat(compactArticleCode(header.codeArticle || header.articleNo) || "N/A", " - ").concat(header.description || "N/A");
      ops.push("BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ".concat(margin.toFixed(2), " ").concat((lineY - 14).toFixed(2), " Tm (").concat(pdfEsc(header.otp || header.projet || "N/A"), ") Tj ET"));
      ops.push("BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ".concat(((width - textWidth(header.of || "N/A", 8.5, true)) / 2 - 170).toFixed(2), " ").concat((lineY - 14).toFixed(2), " Tm (").concat(pdfEsc(header.of || "N/A"), ") Tj ET"));
      ops.push("BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ".concat(((width - textWidth(article, 8.5, true)) / 2).toFixed(2), " ").concat((lineY - 14).toFixed(2), " Tm (").concat(pdfEsc(article), ") Tj ET"));
      ops.push("BT /F2 8.5 Tf 0.08 0.10 0.14 rg 1 0 0 1 ".concat((width - margin - textWidth(identity, 8.5, true)).toFixed(2), " ").concat((lineY - 14).toFixed(2), " Tm (").concat(pdfEsc(identity), ") Tj ET"));
      for (var slot = 0; slot < labelsPerPage; slot++) {
        var col = slot % 3,
          rowIndex = Math.floor(slot / 3);
        var x = startX + col * (labelW + gapX);
        var y = gridTop - (rowIndex + 1) * labelH - rowIndex * gapY;
        var number = sheet * labelsPerPage + slot + 1;
        ops.push("q 0.55 0.58 0.63 RG .6 w [3 2] 0 d ".concat(x.toFixed(2), " ").concat(y.toFixed(2), " ").concat(labelW.toFixed(2), " ").concat(labelH.toFixed(2), " re S Q"));
        var slotText = String(number);
        ops.push("BT /F2 30 Tf 0.72 0.74 0.78 rg 1 0 0 1 ".concat((x + (labelW - textWidth(slotText, 30, true)) / 2).toFixed(2), " ").concat((y + labelH / 2 - 10).toFixed(2), " Tm (").concat(pdfEsc(slotText), ") Tj ET"));
      }
      var footerY = 14;
      var footerLeft = "Composants dessoudés conservés";
      var confidentiality = "Document confidentiel - diffusion limitee aux personnes autorisees.";
      ops.push("q 0.00 0.27 0.57 RG .55 w ".concat(margin.toFixed(2), " 28 m ").concat((width - margin).toFixed(2), " 28 l S Q"));
      ops.push("BT /F1 5.8 Tf 0.31 0.35 0.41 rg 1 0 0 1 ".concat(margin.toFixed(2), " ").concat(footerY, " Tm (").concat(pdfEsc(footerLeft), ") Tj ET"));
      ops.push("BT /F1 5.8 Tf 0.31 0.35 0.41 rg 1 0 0 1 ".concat(((width - textWidth(confidentiality, 5.8)) / 2).toFixed(2), " ").concat(footerY, " Tm (").concat(pdfEsc(confidentiality), ") Tj ET"));
      pages.push(ops);
    }
  });
  return buildSimplePdf({
    width: width,
    height: height,
    pages: pages,
    logoImage: logoImage
  });
};
var buildDirectReportPdf = function buildDirectReportPdf(_ref29) {
  var _ofData, _ofData2;
  var ofData = _ref29.ofData,
    lists = _ref29.lists,
    exportedAt = _ref29.exportedAt,
    exportedBy = _ref29.exportedBy,
    _ref29$includeHistory = _ref29.includeHistory,
    includeHistory = _ref29$includeHistory === void 0 ? false : _ref29$includeHistory,
    _ref29$includeDeleted = _ref29.includeDeleted,
    includeDeleted = _ref29$includeDeleted === void 0 ? true : _ref29$includeDeleted,
    _ref29$skipEmptyRepor = _ref29.skipEmptyReports,
    skipEmptyReports = _ref29$skipEmptyRepor === void 0 ? false : _ref29$skipEmptyRepor,
    _ref29$selectedSectio = _ref29.selectedSections,
    selectedSections = _ref29$selectedSectio === void 0 ? null : _ref29$selectedSectio,
    _ref29$selectedSnIds = _ref29.selectedSnIds,
    selectedSnIds = _ref29$selectedSnIds === void 0 ? null : _ref29$selectedSnIds,
    _ref29$logoImage = _ref29.logoImage,
    logoImage = _ref29$logoImage === void 0 ? null : _ref29$logoImage;
  ofData = withUnitMetadata(ofData);
  var includeSection = function includeSection(title) {
    return !selectedSections || REPORT_SECTIONS.some(function (s) {
      return s.title === title && selectedSections.includes(s.id);
    });
  };
  var h = ((_ofData = ofData) === null || _ofData === void 0 ? void 0 : _ofData.header) || {};
  var W = 841.89,
    H = 595.28,
    M = 28;
  var usable = W - M * 2;
  var pages = [];
  var newPage = function newPage() {
    var p = {
      ops: [],
      y: H - M,
      context: "",
      section: ""
    };
    pages.push(p);
    return p;
  };
  var page = newPage();
  var color = {
    ink: "0.07 0.09 0.13",
    muted: "0.31 0.35 0.41",
    line: "0.78 0.82 0.87",
    head: "0.90 0.92 0.95",
    soft: "0.96 0.97 0.98",
    orange: "0.12 0.43 0.92",
    blue: "0.00 0.27 0.57",
    green: "0.14 0.45 0.21",
    red: "0.85 0.21 0.20",
    warn: "0.95 0.56 0.00"
  };
  var PDF_CONFIDENTIALITY = "Document confidentiel - diffusion limitee aux personnes autorisees.";
  var PDF_LOGO_WIDTH_PT = 113.39; // 40 mm
  var setFill = function setFill(c) {
    return "".concat(c, " rg");
  };
  var setStroke = function setStroke(c) {
    return "".concat(c, " RG");
  };
  var text = function text(txt, x, y) {
    var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 7;
    var bold = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var c = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : color.ink;
    page.ops.push("BT /".concat(bold ? "F2" : "F1", " ").concat(size, " Tf ").concat(setFill(c), " 1 0 0 1 ").concat(x.toFixed(2), " ").concat(y.toFixed(2), " Tm (").concat(pdfEsc(txt), ") Tj ET"));
  };
  var line = function line(x1, y1, x2, y2) {
    var c = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : color.line;
    var w = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : .35;
    return page.ops.push("q ".concat(setStroke(c), " ").concat(w, " w ").concat(x1.toFixed(2), " ").concat(y1.toFixed(2), " m ").concat(x2.toFixed(2), " ").concat(y2.toFixed(2), " l S Q"));
  };
  var rect = function rect(x, y, w, h) {
    var fill = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var stroke = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : color.line;
    var lineWidth = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : .35;
    page.ops.push("q ".concat(stroke ? setStroke(stroke) : "", " ").concat(fill ? setFill(fill) : "", " ").concat(lineWidth, " w ").concat(x.toFixed(2), " ").concat(y.toFixed(2), " ").concat(w.toFixed(2), " ").concat(h.toFixed(2), " re ").concat(fill && stroke ? "B" : fill ? "f" : "S", " Q"));
  };
  var image = function image(name, x, y, w, h) {
    page.ops.push("q ".concat(w.toFixed(2), " 0 0 ").concat(h.toFixed(2), " ").concat(x.toFixed(2), " ").concat(y.toFixed(2), " cm /").concat(name, " Do Q"));
  };
  var wrap = function wrap(txt, w) {
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
    var max = Math.max(3, Math.floor(w / (size * .48)));
    var words = pdfText(txt).split(" ");
    var lines = [];
    var cur = "";
    words.forEach(function (word) {
      if ((cur + " " + word).trim().length > max) {
        if (cur) lines.push(cur);
        cur = word;
      } else cur = (cur + " " + word).trim();
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : ["-"];
  };
  var wrapped = function wrapped(txt, x, y, w) {
    var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 6.4;
    var maxLines = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
    var c = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : color.ink;
    var bold = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    wrap(txt, w, size).slice(0, maxLines).forEach(function (ln, i) {
      return text(ln, x, y - i * (size + 1.3), size, bold, c);
    });
  };
  var textW = function textW(txt) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
    var bold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return pdfText(txt).length * size * (bold ? .54 : .48);
  };
  var wrappedRight = function wrappedRight(txt, x, y, w) {
    var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 6.4;
    var maxLines = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
    var c = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : color.ink;
    var bold = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    wrap(txt, w, size).slice(0, maxLines).forEach(function (ln, i) {
      return text(ln, x + w - textW(ln, size, bold), y - i * (size + 1.3), size, bold, c);
    });
  };
  var wrappedCenter = function wrappedCenter(txt, x, y, w) {
    var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 6.4;
    var maxLines = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
    var c = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : color.ink;
    var bold = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    wrap(txt, w, size).slice(0, maxLines).forEach(function (ln, i) {
      return text(ln, x + (w - textW(ln, size, bold)) / 2, y - i * (size + 1.3), size, bold, c);
    });
  };
  var statusLabel = function statusLabel(s) {
    var _STATUTS$s, _UNIT_STATUTS$s;
    return (STATUTS === null || STATUTS === void 0 || (_STATUTS$s = STATUTS[s]) === null || _STATUTS$s === void 0 ? void 0 : _STATUTS$s.label) || (UNIT_STATUTS === null || UNIT_STATUTS === void 0 || (_UNIT_STATUTS$s = UNIT_STATUTS[s]) === null || _UNIT_STATUTS$s === void 0 ? void 0 : _UNIT_STATUTS$s.label) || s || "-";
  };
  var ofTypeLabel = function ofTypeLabel(t) {
    var _OF_TYPES$t;
    return (OF_TYPES === null || OF_TYPES === void 0 || (_OF_TYPES$t = OF_TYPES[t]) === null || _OF_TYPES$t === void 0 ? void 0 : _OF_TYPES$t.label) || t || "Production";
  };
  var unitLabel = function unitLabel(u) {
    return snTitle(u);
  };
  var activeUnits = (((_ofData2 = ofData) === null || _ofData2 === void 0 || (_ofData2 = _ofData2.units) === null || _ofData2 === void 0 ? void 0 : _ofData2.rows) || []).filter(function (u) {
    return !u.deleted && hasUnitIdentity(u);
  });
  var fallbackUnit = {
    id: "of-global",
    sn: h.sn || h.snProduitFini || "",
    lot: h.lot || "",
    status: "en_cours",
    remarque: ""
  };
  var packUnits = activeUnits.length ? activeUnits : [fallbackUnit];
  var selectedSet = selectedSnIds && selectedSnIds.length ? new Set(selectedSnIds) : new Set(packUnits.map(function (u) {
    return u.id;
  }).filter(Boolean));
  var selectedUnits = activeUnits.length ? activeUnits.filter(function (u) {
    return selectedSet.has(u.id);
  }) : packUnits;
  var selectedSnLabel = selectedUnits.length ? selectedUnits.map(snTitle).join(" ; ") : "Tous les SN";
  var rowInSelectedSn = function rowInSelectedSn(row) {
    if (!activeUnits.length || !selectedSet.size) return true;
    var scope = snScope(row, activeUnits);
    if (scope.mode === "all") return true;
    return scope.ids.some(function (id) {
      return selectedSet.has(id);
    });
  };
  var unitMatches = function unitMatches(row, unit) {
    return !unit || unit.id === "of-global" ? true : rowMatchesSn(row, unit, activeUnits);
  };
  var trace = function trace(r) {
    var hist = ((r === null || r === void 0 ? void 0 : r.editHistory) || []).flatMap(function (e) {
      return (e.changes || []).map(function (c) {
        return "Modifie ".concat(e.dt, " ").concat(e.visa, ": ").concat(c.label, " \"").concat(c.from || "-", "\" -> \"").concat(c.to || "-", "\"");
      });
    });
    if (r !== null && r !== void 0 && r.remarque) hist.push("Remarque: ".concat(r.remarque));
    if (r !== null && r !== void 0 && r.deleted) hist.push("Annule ".concat(r.deletedDate || "", " ").concat(r.deletedVisa || "", ": ").concat(r.deletedReason || ""));
    if (r !== null && r !== void 0 && r.restoredReason) hist.push("Reactive ".concat(r.restoredDate || "", " ").concat(r.restoredVisa || "", ": ").concat(r.restoredReason || ""));
    return hist.join(" | ");
  };
  var commentsForPdf = function commentsForPdf(r) {
    return ((r === null || r === void 0 ? void 0 : r.comments) || []).filter(function (c) {
      return String((c === null || c === void 0 ? void 0 : c.text) || "").trim();
    }).map(function (c) {
      return "".concat(c.visa || "-", " - ").concat(c.dt || "-", " - ").concat(c.text || "");
    });
  };
  var headerBlock = function headerBlock(title) {
    var _REPORT_SECTIONS$find;
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var sectionName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : title;
    page.context = title;
    page.section = sectionName;
    var logoH = logoImage !== null && logoImage !== void 0 && logoImage.width && logoImage !== null && logoImage !== void 0 && logoImage.height ? Math.min(32, PDF_LOGO_WIDTH_PT * logoImage.height / logoImage.width) : 20;
    var top = page.y;
    var sectionTitle = pdfText(((_REPORT_SECTIONS$find = REPORT_SECTIONS.find(function (section) {
      return String(title).includes(section.title);
    })) === null || _REPORT_SECTIONS$find === void 0 ? void 0 : _REPORT_SECTIONS$find.title) || String(title).replace(/ - suite$/, ""));
    var sectionSize = 14;
    if (logoImage) {
      image("Logo", M, top - logoH + 2, PDF_LOGO_WIDTH_PT, logoH);
    } else {
      rect(M, top - 29, PDF_LOGO_WIDTH_PT, 22, null, color.line);
      text("LOGO", M + PDF_LOGO_WIDTH_PT / 2 - 10, top - 21, 7, true, color.muted);
    }
    text(sectionTitle, (W - textW(sectionTitle, sectionSize, true)) / 2, top - 7, sectionSize, true, color.orange);
    var exportText = pdfAscii("".concat(exportedAt, " - ").concat(exportedBy));
    text("SP-F001A", W - M - textW("SP-F001A", 7, true), top - 8, 7, true, color.blue);
    text(exportText, W - M - textW(exportText, 6), top - 20, 6, false, color.muted);
    var lineY = top - 34;
    line(M, lineY, W - M, lineY, color.orange, .6);
    var article = h.codeArticle || h.articleNo || "-";
    var unitIdentity = function unitIdentity(current) {
      var identity = [(current === null || current === void 0 ? void 0 : current.sn) || "", (current === null || current === void 0 ? void 0 : current.lot) || ""].filter(Boolean).join(" / ") || "-";
      var quantity = current !== null && current !== void 0 && current.lot ? trackedLotQty(current) : "";
      return "".concat(identity).concat(String(quantity || "").trim() ? " - Qt\xE9 ".concat(quantity) : "");
    };
    var meta = [[h.otp || h.projet || "-", 1.1, "left"], [h.of || "-", .85, "center"], ["".concat(article, " - ").concat(h.description || "-"), 3, "center"], [unit ? unitIdentity(unit) : selectedUnits.map(unitIdentity).join(" ; ") || "-", 1.35, "right"]];
    page.y = lineY - 15;
    var totalWeight = meta.reduce(function (sum, item) {
      return sum + item[1];
    }, 0);
    var metaX = M;
    meta.forEach(function (m) {
      var cw = usable * m[1] / totalWeight;
      var contentWidth = cw - 8;
      if (m[2] === "right") {
        wrappedRight(m[0], metaX, page.y, contentWidth, 9.5, 2, color.ink, true);
      } else if (m[2] === "center") {
        wrappedCenter(m[0], metaX, page.y, contentWidth, 9.5, 2, color.ink, true);
      } else {
        wrapped(m[0], metaX, page.y, contentWidth, 9.5, 2, color.ink, true);
      }
      metaX += cw;
    });
    page.y -= 24;
  };
  var table = function table(headers, rows, widths, sectionTitle) {
    var unit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var tableLine = "0.18 0.20 0.22";
    var sum = widths.reduce(function (a, b) {
      return a + b;
    }, 0);
    widths = widths.map(function (w) {
      return w / sum * usable;
    });
    var drawHead = function drawHead() {
      var x = M;
      rect(x, page.y - 19, usable, 19, color.head, tableLine, .22);
      headers.forEach(function (hd, i) {
        wrapped(hd, x + 2, page.y - 9, widths[i] - 4, 5.6, 2, color.ink, true);
        x += widths[i];
        if (i) line(x - widths[i], page.y, x - widths[i], page.y - 19, tableLine, .22);
      });
      page.y -= 19;
    };
    drawHead();
    rows.forEach(function (row, rowIndex) {
      var _rowObj$comments;
      var rowObj = Array.isArray(row) ? {
        cells: row
      } : row;
      if (rowObj !== null && rowObj !== void 0 && rowObj.fullText) {
        var fullLines = wrap(rowObj.fullText, usable - 8, 6.4).slice(0, 2);
        var _rh = Math.max(15, fullLines.length * 7.8 + 6);
        if (page.y - _rh < M + 28) {
          page = newPage();
          headerBlock("".concat(sectionTitle, " - suite"), unit, sectionTitle);
          drawHead();
        }
        rect(M, page.y - _rh, usable, _rh, rowObj.fill || "0.90 0.93 0.97", rowObj.stroke || color.line);
        fullLines.forEach(function (ln, i) {
          return text(ln, M + 4, page.y - 9 - i * 7.8, 6.4, true, rowObj.color || color.blue);
        });
        page.y -= _rh;
        return;
      }
      var cells = headers.map(function (_, i) {
        var _rowObj$cells$i, _rowObj$cells;
        return (_rowObj$cells$i = rowObj === null || rowObj === void 0 || (_rowObj$cells = rowObj.cells) === null || _rowObj$cells === void 0 ? void 0 : _rowObj$cells[i]) !== null && _rowObj$cells$i !== void 0 ? _rowObj$cells$i : "";
      });
      var lineCounts = cells.map(function (cell, i) {
        return wrap(cell, widths[i] - 4, 6.1).slice(0, 5).length;
      });
      var rh = Math.max(13, Math.max.apply(Math, _toConsumableArray(lineCounts)) * 7.5 + 5);
      if (page.y - rh < M + 28) {
        page = newPage();
        headerBlock("".concat(sectionTitle, " - suite"), unit, sectionTitle);
        drawHead();
      }
      var x = M;
      rect(x, page.y - rh, usable, rh, rowIndex % 2 === 1 ? "0.94 0.95 0.96" : null, tableLine, .22);
      var rowColor = rowObj !== null && rowObj !== void 0 && rowObj.deleted ? color.red : color.ink;
      cells.forEach(function (cell, i) {
        var _rowObj$cellStyles;
        var style = rowObj === null || rowObj === void 0 || (_rowObj$cellStyles = rowObj.cellStyles) === null || _rowObj$cellStyles === void 0 ? void 0 : _rowObj$cellStyles[i];
        if (style !== null && style !== void 0 && style.fill) rect(x, page.y - rh, widths[i], rh, style.fill, tableLine, .22);
        var cellLines = wrap(cell, widths[i] - 4, 6.1).slice(0, 5);
        cellLines.forEach(function (cellLine, lineIndex) {
          var baseline = page.y - 8 - lineIndex * 7.4;
          text(cellLine, x + 2, baseline, 6.1, !!(style !== null && style !== void 0 && style.bold), (style === null || style === void 0 ? void 0 : style.color) || rowColor);
          if (rowObj !== null && rowObj !== void 0 && rowObj.deleted) line(x + 2, baseline + 2, x + 2 + Math.min(widths[i] - 4, textW(cellLine, 6.1, !!(style !== null && style !== void 0 && style.bold))), baseline + 2, color.red, .55);
        });
        x += widths[i];
        if (i) line(x - widths[i], page.y, x - widths[i], page.y - rh, tableLine, .22);
      });
      page.y -= rh;
      if (rowObj !== null && rowObj !== void 0 && rowObj.deleted && rowObj !== null && rowObj !== void 0 && rowObj.deleteText) {
        var reasonLines = wrap(rowObj.deleteText, usable - 12, 5.8).slice(0, 3);
        var dh = Math.max(11, reasonLines.length * 6.5 + 5);
        if (page.y - dh < M + 28) {
          page = newPage();
          headerBlock("".concat(sectionTitle, " - suite"), unit, sectionTitle);
          drawHead();
        }
        rect(M, page.y - dh, usable, dh, "0.99 0.91 0.91", color.red);
        reasonLines.forEach(function (ln, i) {
          return text(ln, M + 4, page.y - 8 - i * 6.5, 5.8, true, color.red);
        });
        page.y -= dh;
      }
      if (rowObj !== null && rowObj !== void 0 && (_rowObj$comments = rowObj.comments) !== null && _rowObj$comments !== void 0 && _rowObj$comments.length) {
        rowObj.comments.slice(0, 8).forEach(function (item) {
          var commentLines = wrap(item, usable - 12, 5.8).slice(0, 3);
          var ch = Math.max(11, commentLines.length * 6.5 + 5);
          if (page.y - ch < M + 28) {
            page = newPage();
            headerBlock("".concat(sectionTitle, " - suite"), unit, sectionTitle);
            drawHead();
          }
          rect(M, page.y - ch, usable, ch, "0.90 0.95 1.00", color.blue);
          commentLines.forEach(function (ln, i) {
            return text(ln, M + 4, page.y - 8 - i * 6.5, 5.8, false, color.blue);
          });
          page.y -= ch;
        });
      }
      if (includeHistory && rowObj !== null && rowObj !== void 0 && rowObj.trace) {
        var items = String(rowObj.trace || "").split(" | ").filter(Boolean).slice(0, 6);
        items.forEach(function (item) {
          var traceLines = wrap(item, usable - 12, 5.8).slice(0, 3);
          var th = Math.max(11, traceLines.length * 6.5 + 5);
          if (page.y - th < M + 28) {
            page = newPage();
            headerBlock("".concat(sectionTitle, " - suite"), unit, sectionTitle);
            drawHead();
          }
          rect(M, page.y - th, usable, th, "0.91 0.93 0.96", color.line);
          traceLines.forEach(function (ln, i) {
            return text(ln, M + 4, page.y - 8 - i * 6.5, 5.8, false, color.muted);
          });
          page.y -= th;
        });
      }
    });
  };
  var section = function section(title, headers, rows, widths, unit) {
    if (!includeSection(title)) return;
    if (skipEmptyReports && !rows.length) return;
    page = newPage();
    var displayTitle = unit && unit.id !== "of-global" ? "".concat(unitLabel(unit), " - ").concat(title) : title;
    headerBlock(displayTitle, unit, displayTitle);
    var body = rows.length ? rows : [headers.map(function (_, i) {
      return i === 0 ? "Aucune ligne" : "";
    })];
    table(headers, body, widths, displayTitle, unit);
  };
  var warningBlock = function warningBlock(title, items, tone, sectionTitle, unit) {
    if (!items.length) return;
    var c = tone === "red" ? color.red : color.warn;
    var fill = tone === "red" ? "0.99 0.91 0.91" : "1.00 0.96 0.84";
    var lines = items.flatMap(function (item) {
      return wrap(item, usable - 18, 6.1).slice(0, 2);
    });
    while (lines.length) {
      var capacity = Math.floor((page.y - M - 28 - 25) / 7);
      if (capacity < 1) {
        page = newPage();
        headerBlock("".concat(sectionTitle, " - suite"), unit, sectionTitle);
        capacity = Math.floor((page.y - M - 28 - 25) / 7);
      }
      var chunk = lines.splice(0, capacity);
      var _h = Math.max(20, chunk.length * 7 + 17);
      rect(M, page.y - _h, usable, _h, fill, c);
      text(title, M + 6, page.y - 10, 6.6, true, c);
      chunk.forEach(function (ln, i) {
        return text(ln, M + 12, page.y - 19 - i * 7, 6.1, false, c);
      });
      page.y -= _h + 8;
    }
  };
  var infoBlock = function infoBlock(pairs, x, y, w) {
    var col = w / 2;
    pairs.forEach(function (m, i) {
      var px = x + i % 2 * col;
      var py = y - Math.floor(i / 2) * 22;
      text(m[0], px, py, 6, false, color.muted);
      wrapped(m[1], px, py - 8, col - 12, 7.2, 2, color.ink);
    });
  };
  var consoById = Object.fromEntries(((lists === null || lists === void 0 ? void 0 : lists.consommables) || []).map(function (c) {
    return [c.id, c];
  }));
  var rowPdf = function rowPdf(cells, row) {
    var extraTrace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    return {
      cells: cells,
      deleted: !!(row !== null && row !== void 0 && row.deleted),
      deleteText: row !== null && row !== void 0 && row.deleted ? "Annul\xE9 le ".concat(row.deletedDate || "-", " par ").concat(row.deletedVisa || "-", " - Motif : ").concat(row.deletedReason || "-") : "",
      comments: commentsForPdf(row),
      trace: [trace(row), extraTrace].filter(Boolean).join(" | ")
    };
  };
  var rowPdfWithComments = function rowPdfWithComments(cells, row) {
    var extraComments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var extraTrace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    return _objectSpread(_objectSpread({}, rowPdf(cells, row, extraTrace)), {}, {
      comments: [].concat(_toConsumableArray(commentsForPdf(row)), _toConsumableArray(extraComments.filter(Boolean)))
    });
  };
  selectedUnits.forEach(function (unit) {
    var _ofData3, _ofData4, _ofData5, _ofData6, _ofData7, _ofData8, _ofData9, _ofData0;
    var inUnit = function inUnit(row) {
      return unitMatches(row, unit) && rowInSelectedSn(row) && (includeDeleted || !(row !== null && row !== void 0 && row.deleted));
    };
    var reworkRowsForUnit = (((_ofData3 = ofData) === null || _ofData3 === void 0 || (_ofData3 = _ofData3.rework) === null || _ofData3 === void 0 ? void 0 : _ofData3.rows) || []).filter(inUnit);
    var reworkWarnings = computeReworkWarnings(reworkRowsForUnit);
    var openDesoudes = computeOpenDesoudes(reworkRowsForUnit);
    var openPointes = reworkWarnings.pointed;
    var hdArticles = reworkRowsForUnit.filter(function (r) {
      var dc = dcCheck(r.dc, r.createdDT);
      return !r.deleted && ["S", "P", "M"].includes(r.action1) && (dc === null || dc === void 0 ? void 0 : dc.max) !== undefined && !dc.ok;
    });
    var actionName = function actionName(code) {
      return (ACTION_LABELS === null || ACTION_LABELS === void 0 ? void 0 : ACTION_LABELS[code]) || code || "action";
    };
    var warningEntries = [].concat(_toConsumableArray(hdArticles.map(function (row) {
      return {
        row: row,
        tone: "red",
        problem: "Date code ".concat(row.dc || "-", " hors validit\xE9 \xE0 la date de l\u2019op\xE9ration")
      };
    })), _toConsumableArray(openPointes.map(function (item) {
      return {
        row: item.row,
        tone: "red",
        repere: item.repere,
        problem: "Composant point\xE9".concat(item.row.valeur ? " (valeur ".concat(item.row.valeur, ")") : "", " : un soudage final est requis")
      };
    })), _toConsumableArray(openDesoudes.map(function (row) {
      return {
        row: row,
        tone: "yellow",
        problem: "Composant dessoud\xE9".concat(row.valeur ? " (valeur ".concat(row.valeur, ")") : "", " : aucun soudage ult\xE9rieur enregistr\xE9")
      };
    })), _toConsumableArray(reworkWarnings.sequence.map(function (item) {
      return {
        row: item.row,
        tone: "red",
        repere: item.repere,
        problem: "Deux actions ".concat(actionName(item.row.action1), " cons\xE9cutives : une alternance soudage / dessoudage est attendue")
      };
    })), _toConsumableArray(reworkWarnings.mismatch.map(function (item) {
      return {
        row: item.current,
        tone: "red",
        repere: item.repere,
        problem: "Valeur incoh\xE9rente : ".concat(actionName(item.previous.action1), " ").concat(item.previous.valeur || "-", ", puis ").concat(actionName(item.current.action1), " ").concat(item.current.valeur || "-")
      };
    })), _toConsumableArray(reworkWarnings.first.map(function (item) {
      return {
        row: item.d,
        tone: "red",
        repere: item.repere,
        problem: "L’historique commence par un dessoudage sans soudage initial enregistré"
      };
    })));
    var warningSeen = new Set();
    var warningRows = warningEntries.map(function (entry) {
      var _entry$row, _entry$row2, _entry$row3;
      return {
        repere: String(entry.repere || ((_entry$row = entry.row) === null || _entry$row === void 0 ? void 0 : _entry$row.repere) || "N/A").trim() || "N/A",
        problem: entry.problem,
        operator: ((_entry$row2 = entry.row) === null || _entry$row2 === void 0 ? void 0 : _entry$row2.createdVisa) || "N/A",
        date: ((_entry$row3 = entry.row) === null || _entry$row3 === void 0 ? void 0 : _entry$row3.createdDT) || "N/A",
        tone: entry.tone
      };
    }).filter(function (item) {
      var key = [item.repere, item.problem, item.operator, item.date].join("|");
      if (warningSeen.has(key)) return false;
      warningSeen.add(key);
      return true;
    }).sort(function (a, b) {
      return a.repere.localeCompare(b.repere, undefined, {
        numeric: true
      }) || a.problem.localeCompare(b.problem);
    }).map(function (item) {
      return {
        cells: [item.repere, item.problem, item.operator, item.date],
        cellStyles: {
          0: {
            bold: true
          }
        }
      };
    });
    var pdfValue = function pdfValue(value) {
      return String(value !== null && value !== void 0 ? value : "").trim() ? value : "N/A";
    };
    var rework = (((_ofData4 = ofData) === null || _ofData4 === void 0 || (_ofData4 = _ofData4.rework) === null || _ofData4 === void 0 ? void 0 : _ofData4.rows) || []).filter(inUnit).map(function (r) {
      var quantity = String(r.qty || r.qte || "").trim();
      var repere = quantity && Number(quantity) !== 1 ? "".concat(quantity, "x ").concat(pdfValue(r.repere)) : pdfValue(r.repere);
      var controlRequired = ["S", "R"].includes(r.action1);
      var controlVisa = r.visaCtrl || (controlRequired ? "Contrôle à faire" : "N/A");
      return _objectSpread(_objectSpread({}, rowPdf([repere, r.isAdjust ? "Oui" : "Non", pdfValue(r.action1), pdfValue(r.codeERP), pdfValue(r.valeur), pdfValue(r.lot), pdfValue(r.dc), pdfValue(r.sn), pdfValue(r.fiche), pdfValue(r.etape), pdfValue(r.createdVisa), pdfValue(r.createdDT), controlVisa, pdfValue(r.dateCtrl)], r)), {}, {
        cellStyles: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, hdArticles.some(function (hd) {
          return hd.id === r.id;
        }) ? {
          6: {
            color: color.red,
            bold: true
          }
        } : {}), !r.deleted && missingReworkTrace(r, true).includes("LOT") ? {
          5: {
            fill: "0.99 0.91 0.91",
            color: color.red,
            bold: true
          }
        } : {}), !r.deleted && missingReworkTrace(r, true).includes("DC") ? {
          6: {
            fill: "0.99 0.91 0.91",
            color: color.red,
            bold: true
          }
        } : {}), controlRequired && !r.visaCtrl ? {
          12: {
            fill: "0.99 0.91 0.91",
            color: color.red,
            bold: true
          }
        } : {})
      });
    });
    if (includeSection("Adjust / Rework") && (!skipEmptyReports || rework.length || warningRows.length)) {
      var title = "Adjust / Rework";
      var displayTitle = unit && unit.id !== "of-global" ? "".concat(unitLabel(unit), " - ").concat(title) : title;
      page = newPage();
      headerBlock(displayTitle, unit, displayTitle);
      if (warningRows.length) {
        text("Points à vérifier", M, page.y - 1, 7.2, true, color.red);
        page.y -= 10;
        table(["Repère TOPO", "Problème", "Opérateur", "Date / heure"], warningRows, [19, 70, 18, 27], displayTitle, unit);
        page.y -= 8;
      }
      table(["Repère TOPO", "ADJ", "Act.", "Code article", "Valeur - description", "LOT", "Date code", "SN composant", "Fiche suiveuse / fait", "N° OP", "VISA", "Date", "CTRL", "CTRL le"], rework.length ? rework : [["N/A"]], [22, 9, 9, 27, 55, 19, 17, 17, 39, 11, 15, 24, 36, 24], displayTitle, unit);
    }
    var cons = (((_ofData5 = ofData) === null || _ofData5 === void 0 || (_ofData5 = _ofData5.consommables) === null || _ofData5 === void 0 ? void 0 : _ofData5.ops) || []).filter(inUnit).flatMap(function (op) {
      return (op.items || [{}]).filter(function (it) {
        return includeDeleted || !(it !== null && it !== void 0 && it.deleted);
      }).map(function (it) {
        var conso = consoById[it.consoId] || {};
        var code = compactArticleCode(conso.sap || conso.code || it.consoId);
        var desc = consoDescriptionForCsv(conso, it.consoId);
        var status = dpStatus(it.dp, it.createdDT || op.createdDT);
        var polymerization = polymerizationStatus(conso, it.createdDT || op.createdDT);
        var polymerizationTrace = polymerization ? "Polym\xE9risation ".concat(polymerization.hours, " h - sous vide d\xE8s le ").concat(formatAvailabilityDT(polymerization.readyAt)) : "";
        var invalid = !!it.dp && !isValidDMY(it.dp);
        var row = rowPdfWithComments([it.createdDT || op.createdDT, it.createdVisa || op.createdVisa, op.fiche, op.op, code, desc, it.echantillon || "", it.lot, "".concat(it.dp || "").concat(invalid ? " - DATE INVALIDE" : status && status.label !== "OK" ? " - ".concat(status.label) : "")], it, commentsForPdf(op), [trace(op), polymerizationTrace].filter(Boolean).join(" | "));
        return _objectSpread(_objectSpread({}, row), {}, {
          cellStyles: _objectSpread(_objectSpread({}, invalid || (status === null || status === void 0 ? void 0 : status.label) === "PÉRIMÉ" ? {
            8: {
              fill: "0.99 0.91 0.91",
              color: color.red,
              bold: true
            }
          } : {}), (status === null || status === void 0 ? void 0 : status.label) === "BIENTÔT" ? {
            8: {
              fill: "0.99 0.96 0.84",
              bold: true
            }
          } : {})
        });
      });
    });
    section("Consommables", ["Date", "Visa", "Fiche suiveuse", "OP", "Code article", "Description", "N ech.", "LOT", "DP"], cons, [23, 12, 26, 11, 34, 88, 22, 30, 20], unit);
    var testEquipRows = (((_ofData6 = ofData) === null || _ofData6 === void 0 || (_ofData6 = _ofData6.testequip) === null || _ofData6 === void 0 ? void 0 : _ofData6.rows) || []).filter(inUnit).sort(function (a, b) {
      return (isFourEquip(b) ? 1 : 0) - (isFourEquip(a) ? 1 : 0);
    }).map(function (r) {
      return rowPdf([r.createdDT, r.createdVisa, isFourEquip(r) ? "FOUR" : "-", r.nInv, r.type, r.designation, r.dateExpiration, r.checkDate], r);
    });
    section("Test Equip.", ["Date", "Visa", "Four", "N INV", "Type", "Designation", "Date calib", "Ctrl"], testEquipRows, [23, 13, 18, 30, 26, 79, 25, 24], unit);
    section("Faits", ["Date", "Visa", "Type", "Numero", "Date ouv.", "Lien", "Commentaires"], (((_ofData7 = ofData) === null || _ofData7 === void 0 || (_ofData7 = _ofData7.faits) === null || _ofData7 === void 0 ? void 0 : _ofData7.rows) || []).filter(inUnit).map(function (r) {
      return rowPdf([r.createdDT, r.createdVisa, r.type, r.numero, r.date, r.lien, r.commentaires], r);
    }), [24, 14, 18, 32, 24, 72, 86], unit);
    section("Etuvages", ["Date", "Visa", "Four", "Duree", "Temp", "Entree", "Visa E", "Sortie", "Visa S"], (((_ofData8 = ofData) === null || _ofData8 === void 0 || (_ofData8 = _ofData8.etuvage) === null || _ofData8 === void 0 ? void 0 : _ofData8.rows) || []).filter(inUnit).map(function (r) {
      return rowPdf([r.createdDT, r.createdVisa, r.fourN, r.duree, r.temp, r.entreeDT, r.entreeVisa, r.sortieDT, r.sortieVisa], r);
    }), [23, 13, 26, 16, 16, 36, 14, 36, 14], unit);
    var demConnectors = (((_ofData9 = ofData) === null || _ofData9 === void 0 || (_ofData9 = _ofData9.demating) === null || _ofData9 === void 0 ? void 0 : _ofData9.connectors) || []).filter(function (c) {
      return !c.deleted && inUnit(c);
    }).sort(function (a, b) {
      return connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect));
    });
    var demRows = demConnectors.flatMap(function (c) {
      var events = (c.events || []).filter(function (e) {
        return !e.deleted && e.action;
      });
      var last = events.slice(-1)[0] || {};
      var cycles = buildMatingCycles(c);
      var state = last.action === "Mating" ? "Matte" : last.action === "Demating" ? "Dematte" : "-";
      var lastText = last.action ? "".concat(last.action, " ").concat(last.dt || "-", " ").concat(last.visa || "-") : "Aucune action";
      var tone = connectorStateTone(last.action);
      var group = {
        fullText: "".concat(c.nConect || "Connecteur ?", " - Etat actuel : ").concat(state, " - Derniere action : ").concat(lastText, " - ").concat(cycles.length, " cycle").concat(cycles.length > 1 ? "s" : ""),
        fill: tone.fill,
        stroke: tone.stroke,
        color: tone.text
      };
      if (!cycles.length) return [group, rowPdf(["", "0", "-", "-", "-", "-"], c)];
      var sortedCycles = cycles.map(function (cy, i) {
        return {
          cy: cy,
          n: i + 1
        };
      }).sort(function (a, b) {
        return String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))) || b.n - a.n;
      });
      return [group].concat(_toConsumableArray(sortedCycles.map(function (_ref30) {
        var _cy$mat, _cy$mat2, _cy$dem, _cy$dem2;
        var cy = _ref30.cy,
          n = _ref30.n;
        return rowPdf(["", String(n), ((_cy$mat = cy.mat) === null || _cy$mat === void 0 ? void 0 : _cy$mat.dt) || "-", ((_cy$mat2 = cy.mat) === null || _cy$mat2 === void 0 ? void 0 : _cy$mat2.visa) || "-", ((_cy$dem = cy.dem) === null || _cy$dem === void 0 ? void 0 : _cy$dem.dt) || "-", ((_cy$dem2 = cy.dem) === null || _cy$dem2 === void 0 ? void 0 : _cy$dem2.visa) || "-"], c);
      })));
    });
    section("Mating / Demating", ["", "Cycle", "Mating date", "Visa M", "Demating date", "Visa D"], demRows, [8, 14, 44, 18, 44, 18], unit);
    section("Open Work", ["Date", "Visa", "N OW", "Description", "Ouverture", "Cloture", "Commentaires"], (((_ofData0 = ofData) === null || _ofData0 === void 0 || (_ofData0 = _ofData0.openwork) === null || _ofData0 === void 0 ? void 0 : _ofData0.rows) || []).filter(inUnit).map(function (r) {
      return rowPdf([r.createdDT, r.createdVisa, r.nOW, r.description, "".concat(r.openDate || "-", " / ").concat(r.openVisa || "-"), "".concat(r.closedDate || "-", " / ").concat(r.closedVisa || "-"), r.commentaires], r);
    }), [23, 13, 15, 86, 38, 38, 83], unit);
  });
  var printablePages = pages.filter(function (p) {
    return p.ops.length;
  });
  if (!printablePages.length) throw new Error("Aucun rapport non vide pour les SN sélectionnés.");
  var sectionCounts = {};
  printablePages.forEach(function (p) {
    var key = p.section || p.context || "Rapport";
    sectionCounts[key] = (sectionCounts[key] || 0) + 1;
  });
  var sectionSeen = {};
  var objects = ["<< /Type /Catalog /Pages 2 0 R >>"];
  var pageKids = [];
  var font1 = 3,
    font2 = 4;
  objects.push("<< /Type /Pages /Kids [] /Count 0 >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  var logoObjId = logoImage ? objects.length + 1 : null;
  if (logoImage) {
    objects.push("<< /Type /XObject /Subtype /Image /Width ".concat(logoImage.width, " /Height ").concat(logoImage.height, " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ").concat(logoImage.data.length + 1, " >>\nstream\n").concat(logoImage.data, ">\nendstream"));
  }
  printablePages.forEach(function (p, i) {
    var sectionKey = p.section || p.context || "Rapport";
    sectionSeen[sectionKey] = (sectionSeen[sectionKey] || 0) + 1;
    var footerY = 14;
    var actionLegend = "Actions : S = Soudé | D = Dessoudé | P = Pointé | M = Matière | R = Rework";
    var showActionLegend = String(p.section || p.context || "").includes("Adjust / Rework");
    var pageText = "Page ".concat(sectionSeen[sectionKey], " / ").concat(sectionCounts[sectionKey]);
    p.ops.push("q ".concat(setStroke(color.blue), " .55 w ").concat(M.toFixed(2), " 28 m ").concat((W - M).toFixed(2), " 28 l S Q"));
    if (showActionLegend) p.ops.push("BT /F1 5.8 Tf ".concat(setFill(color.muted), " 1 0 0 1 ").concat(M.toFixed(2), " ").concat(footerY, " Tm (").concat(pdfEsc(actionLegend), ") Tj ET"));
    p.ops.push("BT /F1 5.8 Tf ".concat(setFill(color.muted), " 1 0 0 1 ").concat(((W - textW(PDF_CONFIDENTIALITY, 5.8)) / 2).toFixed(2), " ").concat(footerY, " Tm (").concat(pdfEsc(PDF_CONFIDENTIALITY), ") Tj ET"));
    p.ops.push("BT /F2 7 Tf ".concat(setFill(color.muted), " 1 0 0 1 ").concat((W - M - textW(pageText, 7, true)).toFixed(2), " ").concat(footerY, " Tm (").concat(pdfEsc(pageText), ") Tj ET"));
    var stream = p.ops.join("\n");
    var contentId = objects.length + 2;
    var pageId = objects.length + 1;
    pageKids.push("".concat(pageId, " 0 R"));
    var xobj = logoObjId ? "/XObject << /Logo ".concat(logoObjId, " 0 R >> ") : "";
    objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ".concat(W, " ").concat(H, "] /Resources << /Font << /F1 ").concat(font1, " 0 R /F2 ").concat(font2, " 0 R >> ").concat(xobj, ">> /Contents ").concat(contentId, " 0 R >>"));
    objects.push("<< /Length ".concat(stream.length, " >>\nstream\n").concat(stream, "\nendstream"));
  });
  objects[1] = "<< /Type /Pages /Kids [".concat(pageKids.join(" "), "] /Count ").concat(printablePages.length, " >>");
  var pdf = "%PDF-1.4\n";
  var offsets = [0];
  objects.forEach(function (obj, i) {
    offsets[i + 1] = pdf.length;
    pdf += "".concat(i + 1, " 0 obj\n").concat(obj, "\nendobj\n");
  });
  var xref = pdf.length;
  pdf += "xref\n0 ".concat(objects.length + 1, "\n0000000000 65535 f \n");
  for (var i = 1; i <= objects.length; i++) pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  pdf += "trailer\n<< /Size ".concat(objects.length + 1, " /Root 1 0 R >>\nstartxref\n").concat(xref, "\n%%EOF");
  return new Blob([pdf], {
    type: "application/pdf"
  });
};
var loadPdfLogoImage = function loadPdfLogoImage(src) {
  return new Promise(function (resolve) {
    var raw = String(src || "").trim();
    if (!raw) {
      resolve(null);
      return;
    }
    var url = raw.replace(/\\/g, "/");
    if (/^[a-zA-Z]:\//.test(url)) {
      resolve(null);
      return;
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        var dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        var b64 = dataUrl.split(",")[1] || "";
        var bin = atob(b64);
        var hex = "";
        for (var i = 0; i < bin.length; i++) hex += bin.charCodeAt(i).toString(16).padStart(2, "0");
        resolve({
          width: canvas.width,
          height: canvas.height,
          data: hex
        });
      } catch (_unused5) {
        resolve(null);
      }
    };
    img.onerror = function () {
      return resolve(null);
    };
    img.src = url;
  });
};
var mergeGeneratedPdfBlobs = /*#__PURE__*/function () {
  var _mergeGeneratedPdfBlobs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(blobs) {
    var sources, merged, pageIds, nextId, objects, pdf, offsets, xref, id;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return Promise.all(blobs.map(function (blob) {
            return blob.text();
          }));
        case 1:
          sources = _context.v;
          merged = [];
          pageIds = [];
          nextId = 3;
          sources.forEach(function (source) {
            var parsed = _toConsumableArray(source.matchAll(/(?:^|\n)(\d+) 0 obj\n([\s\S]*?)\nendobj/g)).map(function (match) {
              return {
                oldId: Number(match[1]),
                body: match[2]
              };
            });
            var idMap = new Map([[1, 1], [2, 2]]);
            parsed.filter(function (object) {
              return object.oldId > 2;
            }).forEach(function (object) {
              return idMap.set(object.oldId, nextId++);
            });
            parsed.filter(function (object) {
              return object.oldId > 2;
            }).forEach(function (object) {
              var id = idMap.get(object.oldId);
              var body = object.body.replace(/(\d+) 0 R/g, function (_, raw) {
                return "".concat(idMap.get(Number(raw)) || raw, " 0 R");
              });
              merged.push({
                id: id,
                body: body
              });
              if (/\/Type \/Page\b/.test(body)) pageIds.push(id);
            });
          });
          if (pageIds.length) {
            _context.n = 2;
            break;
          }
          throw new Error("Aucune page à imprimer.");
        case 2:
          objects = [{
            id: 1,
            body: "<< /Type /Catalog /Pages 2 0 R >>"
          }, {
            id: 2,
            body: "<< /Type /Pages /Kids [".concat(pageIds.map(function (id) {
              return "".concat(id, " 0 R");
            }).join(" "), "] /Count ").concat(pageIds.length, " >>")
          }].concat(merged).sort(function (a, b) {
            return a.id - b.id;
          });
          pdf = "%PDF-1.4\n";
          offsets = [0];
          objects.forEach(function (object) {
            offsets[object.id] = pdf.length;
            pdf += "".concat(object.id, " 0 obj\n").concat(object.body, "\nendobj\n");
          });
          xref = pdf.length;
          pdf += "xref\n0 ".concat(objects.length + 1, "\n0000000000 65535 f \n");
          for (id = 1; id <= objects.length; id++) pdf += String(offsets[id] || 0).padStart(10, "0") + " 00000 n \n";
          pdf += "trailer\n<< /Size ".concat(objects.length + 1, " /Root 1 0 R >>\nstartxref\n").concat(xref, "\n%%EOF");
          return _context.a(2, new Blob([pdf], {
            type: "application/pdf"
          }));
      }
    }, _callee);
  }));
  function mergeGeneratedPdfBlobs(_x) {
    return _mergeGeneratedPdfBlobs.apply(this, arguments);
  }
  return mergeGeneratedPdfBlobs;
}();
var downloadBrowserBlob = function downloadBrowserBlob(blob, name) {
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () {
    return URL.revokeObjectURL(url);
  }, 1000);
};

// ─── Modale d'annulation de ligne (soft-delete) ───────────────────────────
var DeleteModal = function DeleteModal(_ref31) {
  var onConfirm = _ref31.onConfirm,
    onCancel = _ref31.onCancel,
    _ref31$godMode = _ref31.godMode,
    godMode = _ref31$godMode === void 0 ? false : _ref31$godMode;
  var _useState11 = useState(""),
    _useState12 = _slicedToArray(_useState11, 2),
    reason = _useState12[0],
    setReason = _useState12[1];
  useEffect(function () {
    if (godMode) onConfirm("");
  }, [godMode]);
  if (godMode) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "2px solid ".concat(C.red),
      borderRadius: 10,
      padding: 24,
      width: 460,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: C.red,
      fontSize: 15,
      marginBottom: 6
    }
  }, "\u2715 Annuler cette ligne"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 12,
      marginBottom: 16,
      lineHeight: 1.6
    }
  }, "La ligne sera ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.text
    }
  }, "barr\xE9e et conserv\xE9e"), " dans l'historique. L'annulation est trac\xE9e (visa + date) et r\xE9versible."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 6
    }
  }, "Motif de l'annulation *"), /*#__PURE__*/React.createElement(Input, {
    value: reason,
    onChange: setReason
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: onCancel,
    color: C.border
  }, "Annuler"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return reason.trim() && onConfirm(reason.trim());
    },
    color: C.red,
    disabled: !reason.trim()
  }, "\u2715 Confirmer"))));
};
var PdfOptionsModal = function PdfOptionsModal(_ref32) {
  var snRows = _ref32.snRows,
    _ref32$defaultSelecte = _ref32.defaultSelectedIds,
    defaultSelectedIds = _ref32$defaultSelecte === void 0 ? null : _ref32$defaultSelecte,
    _ref32$includeHistory = _ref32.includeHistoryDefault,
    includeHistoryDefault = _ref32$includeHistory === void 0 ? false : _ref32$includeHistory,
    onCancel = _ref32.onCancel,
    onConfirm = _ref32.onConfirm;
  var _useState13 = useState(includeHistoryDefault),
    _useState14 = _slicedToArray(_useState13, 2),
    includeHistory = _useState14[0],
    setIncludeHistory = _useState14[1];
  var _useState15 = useState(true),
    _useState16 = _slicedToArray(_useState15, 2),
    includeDeleted = _useState16[0],
    setIncludeDeleted = _useState16[1];
  var _useState17 = useState(true),
    _useState18 = _slicedToArray(_useState17, 2),
    skipEmptyReports = _useState18[0],
    setSkipEmptyReports = _useState18[1];
  var _useState19 = useState(true),
    _useState20 = _slicedToArray(_useState19, 2),
    includePdf = _useState20[0],
    setIncludePdf = _useState20[1];
  var _useState21 = useState(false),
    _useState22 = _slicedToArray(_useState21, 2),
    includeCsv = _useState22[0],
    setIncludeCsv = _useState22[1];
  var _useState23 = useState(function () {
      return REPORT_SECTIONS.map(function (s) {
        return s.id;
      });
    }),
    _useState24 = _slicedToArray(_useState23, 2),
    selectedSections = _useState24[0],
    setSelectedSections = _useState24[1];
  var _useState25 = useState(function () {
      return defaultSelectedIds !== null && defaultSelectedIds !== void 0 && defaultSelectedIds.length ? defaultSelectedIds : snRows.map(function (u) {
        return u.id;
      });
    }),
    _useState26 = _slicedToArray(_useState25, 2),
    selected = _useState26[0],
    setSelected = _useState26[1];
  var toggle = function toggle(id) {
    return setSelected(function (prev) {
      return prev.includes(id) ? prev.filter(function (x) {
        return x !== id;
      }) : [].concat(_toConsumableArray(prev), [id]);
    });
  };
  var selectAll = function selectAll() {
    return setSelected(snRows.map(function (u) {
      return u.id;
    }));
  };
  var selectNone = function selectNone() {
    return setSelected([]);
  };
  var canGenerate = (!snRows.length || selected.length > 0) && (includePdf || includeCsv) && (!includePdf || selectedSections.length > 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 320,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "2px solid ".concat(C.blue),
      borderRadius: 10,
      padding: 20,
      width: 520,
      maxWidth: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 12px 40px #0008"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: C.blue,
      fontSize: 15,
      marginBottom: 6,
      textTransform: "uppercase"
    }
  }, "Export rapport"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 12,
      marginBottom: 14,
      lineHeight: 1.5
    }
  }, "Export rapport de production"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includePdf,
    onChange: function onChange(e) {
      return setIncludePdf(e.target.checked);
    },
    style: {
      accentColor: C.blue
    }
  }), "PDF"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includeCsv,
    onChange: function onChange(e) {
      return setIncludeCsv(e.target.checked);
    },
    style: {
      accentColor: C.blue
    }
  }), "CSV Adjust/Rework + Consommables")), includePdf && /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      padding: 10,
      margin: "0 0 14px"
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      color: C.text,
      fontSize: 12,
      fontWeight: 700
    }
  }, "Pages du PDF"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.border,
    onClick: function onClick() {
      return setSelectedSections(REPORT_SECTIONS.map(function (s) {
        return s.id;
      }));
    }
  }, "Tout cocher"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.border,
    onClick: function onClick() {
      return setSelectedSections([]);
    }
  }, "Tout d\xE9cocher")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, REPORT_SECTIONS.map(function (s) {
    return /*#__PURE__*/React.createElement("label", {
      key: s.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: C.text,
        fontSize: 12,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: selectedSections.includes(s.id),
      onChange: function onChange() {
        return setSelectedSections(function (prev) {
          return prev.includes(s.id) ? prev.filter(function (id) {
            return id !== s.id;
          }) : [].concat(_toConsumableArray(prev), [s.id]);
        });
      }
    }), s.label);
  }))), snRows.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: selectAll,
    color: C.blue,
    small: true
  }, "Tout cocher"), /*#__PURE__*/React.createElement(Btn, {
    onClick: selectNone,
    color: C.border,
    small: true
  }, "Tout decocher")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 220,
      overflow: "auto",
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: 8,
      marginBottom: 12
    }
  }, snRows.map(function (u) {
    return /*#__PURE__*/React.createElement("label", {
      key: u.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 4px",
        borderBottom: "1px solid ".concat(C.border, "55"),
        cursor: "pointer",
        fontFamily: "monospace",
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: selected.includes(u.id),
      onChange: function onChange() {
        return toggle(u.id);
      },
      style: {
        accentColor: C.blue
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.text
      }
    }, snTitle(u)));
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: 10,
      color: C.muted,
      marginBottom: 12
    }
  }, "Aucun SN dans la table SN : le rapport exportera les lignes globales de l'OF."), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      marginBottom: 16,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includeHistory,
    onChange: function onChange(e) {
      return setIncludeHistory(e.target.checked);
    },
    style: {
      accentColor: C.blue
    }
  }), "Inclure les historiques de modification des lignes"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      marginBottom: 16,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includeDeleted,
    onChange: function onChange(e) {
      return setIncludeDeleted(e.target.checked);
    },
    style: {
      accentColor: C.blue
    }
  }), "Inclure les lignes annul\xE9es barr\xE9es"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      marginBottom: 16,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: skipEmptyReports,
    onChange: function onChange(e) {
      return setSkipEmptyReports(e.target.checked);
    },
    style: {
      accentColor: C.blue
    }
  }), "Ne pas exporter les rapports vides"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: onCancel,
    color: C.border,
    small: true
  }, "Annuler"), /*#__PURE__*/React.createElement(Btn, {
    disabled: !canGenerate,
    onClick: function onClick() {
      return canGenerate && onConfirm({
        selectedSnIds: selected,
        selectedSections: selectedSections,
        includeHistory: includeHistory,
        includeDeleted: includeDeleted,
        skipEmptyReports: skipEmptyReports,
        includePdf: includePdf,
        includeCsv: includeCsv
      });
    },
    color: canGenerate ? C.green : C.border,
    small: true
  }, "Generer"))));
};
var BulkPdfOptionsModal = function BulkPdfOptionsModal(_ref33) {
  var rows = _ref33.rows,
    onCancel = _ref33.onCancel,
    onConfirm = _ref33.onConfirm;
  var _useState27 = useState(false),
    _useState28 = _slicedToArray(_useState27, 2),
    includeHistory = _useState28[0],
    setIncludeHistory = _useState28[1];
  var _useState29 = useState(true),
    _useState30 = _slicedToArray(_useState29, 2),
    includeDeleted = _useState30[0],
    setIncludeDeleted = _useState30[1];
  var _useState31 = useState(true),
    _useState32 = _slicedToArray(_useState31, 2),
    skipEmptyReports = _useState32[0],
    setSkipEmptyReports = _useState32[1];
  var _useState33 = useState(function () {
      return REPORT_SECTIONS.map(function (section) {
        return section.id;
      });
    }),
    _useState34 = _slicedToArray(_useState33, 2),
    selectedSections = _useState34[0],
    setSelectedSections = _useState34[1];
  var _useState35 = useState(false),
    _useState36 = _slicedToArray(_useState35, 2),
    running = _useState36[0],
    setRunning = _useState36[1];
  var _useState37 = useState(""),
    _useState38 = _slicedToArray(_useState37, 2),
    error = _useState38[0],
    setError = _useState38[1];
  var ofCount = new Set(rows.map(function (row) {
    return row.id;
  })).size;
  var run = /*#__PURE__*/function () {
    var _run = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            setRunning(true);
            setError("");
            _context2.p = 1;
            _context2.n = 2;
            return onConfirm({
              selectedSections: selectedSections,
              includeHistory: includeHistory,
              includeDeleted: includeDeleted,
              skipEmptyReports: skipEmptyReports
            });
          case 2:
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t = _context2.v;
            setError((_t === null || _t === void 0 ? void 0 : _t.message) || String(_t));
            setRunning(false);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    function run() {
      return _run.apply(this, arguments);
    }
    return run;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 320,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "bulk-pdf-title",
    style: {
      background: C.surface,
      border: "2px solid ".concat(C.blue),
      borderRadius: 8,
      padding: 20,
      width: 520,
      maxWidth: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 12px 40px #0008"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    id: "bulk-pdf-title",
    style: {
      margin: "0 0 6px",
      fontSize: 16,
      color: C.blue
    }
  }, "Impression en masse"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 12,
      marginBottom: 14
    }
  }, ofCount, " dossier", ofCount > 1 ? "s" : "", " \xB7 ", rows.length, " SN/lot", rows.length > 1 ? "s" : "", " s\xE9lectionn\xE9", rows.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      padding: 10,
      margin: "0 0 14px"
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      color: C.text,
      fontSize: 12,
      fontWeight: 700
    }
  }, "Pages du PDF group\xE9"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.border,
    onClick: function onClick() {
      return setSelectedSections(REPORT_SECTIONS.map(function (section) {
        return section.id;
      }));
    }
  }, "Tout cocher"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.border,
    onClick: function onClick() {
      return setSelectedSections([]);
    }
  }, "Tout d\xE9cocher")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, REPORT_SECTIONS.map(function (section) {
    return /*#__PURE__*/React.createElement("label", {
      key: section.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: C.text,
        fontSize: 12,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: selectedSections.includes(section.id),
      onChange: function onChange() {
        return setSelectedSections(function (previous) {
          return previous.includes(section.id) ? previous.filter(function (id) {
            return id !== section.id;
          }) : [].concat(_toConsumableArray(previous), [section.id]);
        });
      }
    }), section.label);
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      marginBottom: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includeHistory,
    onChange: function onChange(event) {
      return setIncludeHistory(event.target.checked);
    }
  }), "Inclure les historiques de modification"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      marginBottom: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includeDeleted,
    onChange: function onChange(event) {
      return setIncludeDeleted(event.target.checked);
    }
  }), "Inclure les lignes annul\xE9es barr\xE9es"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.text,
      fontSize: 12,
      marginBottom: 14,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: skipEmptyReports,
    onChange: function onChange(event) {
      return setSkipEmptyReports(event.target.checked);
    }
  }), "Ne pas exporter les rapports vides"), error && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      color: C.red,
      fontSize: 12,
      marginBottom: 10
    }
  }, error), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: onCancel,
    disabled: running,
    color: C.border,
    small: true
  }, "Annuler"), /*#__PURE__*/React.createElement(Btn, {
    onClick: run,
    disabled: running || !selectedSections.length,
    color: C.blue,
    small: true
  }, running ? "Génération…" : "Créer le PDF à imprimer"))));
};
var RestoreModal = function RestoreModal(_ref34) {
  var onConfirm = _ref34.onConfirm,
    onCancel = _ref34.onCancel;
  var _useState39 = useState(""),
    _useState40 = _slicedToArray(_useState39, 2),
    reason = _useState40[0],
    setReason = _useState40[1];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "2px solid ".concat(C.yellow),
      borderRadius: 10,
      padding: 24,
      width: 460,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: C.yellow,
      fontSize: 15,
      marginBottom: 6
    }
  }, "\u21A9 R\xE9activer cette ligne"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 12,
      marginBottom: 16,
      lineHeight: 1.6
    }
  }, "La r\xE9activation sera trac\xE9e avec visa, date et motif."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 6
    }
  }, "Motif de la r\xE9activation *"), /*#__PURE__*/React.createElement(Input, {
    value: reason,
    onChange: setReason
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: onCancel,
    color: C.border
  }, "Annuler"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return reason.trim() && onConfirm(reason.trim());
    },
    color: C.yellow,
    disabled: !reason.trim()
  }, "\u21A9 Confirmer"))));
};
var TH = function TH(_ref35) {
  var children = _ref35.children,
    w = _ref35.w,
    color = _ref35.color;
  return /*#__PURE__*/React.createElement("th", {
    style: {
      background: C.raised,
      color: color || C.muted,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: .8,
      textTransform: "uppercase",
      padding: "4px 5px",
      textAlign: "left",
      borderBottom: "1px solid ".concat(C.border),
      whiteSpace: "nowrap",
      width: w
    }
  }, children);
};
var TD = function TD(_ref36) {
  var children = _ref36.children,
    center = _ref36.center,
    style = _ref36.style,
    onClick = _ref36.onClick;
  return /*#__PURE__*/React.createElement("td", {
    onClick: onClick,
    style: _objectSpread({
      padding: "3px 5px",
      borderBottom: "1px solid ".concat(C.border, "20"),
      fontSize: 12,
      textAlign: center ? "center" : "left",
      verticalAlign: "middle"
    }, style)
  }, children);
};
var SectionTitle = function SectionTitle(_ref37) {
  var children = _ref37.children;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: C.accent,
      letterSpacing: .5,
      marginBottom: 14,
      textTransform: "uppercase",
      borderBottom: "1px solid ".concat(C.border),
      paddingBottom: 10
    }
  }, children);
};

// ─── Header OF — éditable ──────────────────────────────────────────────────
var Header = function Header(_ref38) {
  var _STATUTS, _STATUTS2, _STATUTS3, _STATUTS4, _STATUTS5, _STATUTS6;
  var h = _ref38.of,
    onUpdate = _ref38.onUpdate,
    onUpdateStatus = _ref38.onUpdateStatus,
    user = _ref38.user,
    onCommentsChange = _ref38.onCommentsChange;
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    editing = _useState42[0],
    setEditing = _useState42[1];
  var _useState43 = useState({}),
    _useState44 = _slicedToArray(_useState43, 2),
    draft = _useState44[0],
    setDraft = _useState44[1];
  var _useState45 = useState(""),
    _useState46 = _slicedToArray(_useState45, 2),
    copiedField = _useState46[0],
    setCopiedField = _useState46[1];
  var startEdit = function startEdit() {
    if (!isAdminManager(user)) return;
    setDraft(_objectSpread({}, h));
    setEditing(true);
  };
  var save = function save() {
    var _snRows = draft._snRows,
      _defaultSnIds = draft._defaultSnIds,
      cleanDraft = _objectWithoutProperties(draft, _excluded);
    onUpdate(cleanDraft);
    setEditing(false);
  };
  var cancel = function cancel() {
    return setEditing(false);
  };
  var headerSnRows = snRowsFromHeader(h);
  var headerSnFull = headerSnRows.map(snTitle).join(" · ") || h.sn || "—";
  var headerSnDisplay = headerSnRows.length > 4 ? "".concat(headerSnRows.length, " SN") : headerSnFull;
  var copyHeaderField = function copyHeaderField(label, value) {
    copyToClipboard(value);
    setCopiedField(label);
    setTimeout(function () {
      return setCopiedField(function (current) {
        return current === label ? "" : current;
      });
    }, 1400);
  };
  var FIELDS = [{
    key: "of",
    label: "OF"
  }, {
    key: "codeArticle",
    label: "N° Article"
  }, {
    key: "description",
    label: "Description"
  }, {
    key: "otp",
    label: "OTP"
  }];
  if (editing) return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 6,
      padding: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.accent,
      fontWeight: 700,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "\u270E Modifier les informations du dossier"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8,
      marginBottom: 12
    }
  }, FIELDS.map(function (_ref39) {
    var key = _ref39.key,
      label = _ref39.label;
    return /*#__PURE__*/React.createElement("div", {
      key: key
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        letterSpacing: .8,
        textTransform: "uppercase",
        marginBottom: 3
      }
    }, label), /*#__PURE__*/React.createElement(Input, {
      value: draft[key] || "",
      onChange: function onChange(v) {
        return setDraft(function (d) {
          return _objectSpread(_objectSpread({}, d), {}, _defineProperty({}, key, v));
        });
      },
      small: true
    }));
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      letterSpacing: .8,
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, "OF reprise"), /*#__PURE__*/React.createElement("select", {
    value: draft.ofRework || "non",
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          ofRework: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "4px 6px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "non"
  }, "Non"), /*#__PURE__*/React.createElement("option", {
    value: "oui"
  }, "Oui"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      letterSpacing: .8,
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, "Statut OF"), /*#__PURE__*/React.createElement("select", {
    value: draft.status || "en_cours",
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          status: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: ((_STATUTS = STATUTS[draft.status || "en_cours"]) === null || _STATUTS === void 0 ? void 0 : _STATUTS.color) + "22",
      border: "1px solid ".concat((_STATUTS2 = STATUTS[draft.status || "en_cours"]) === null || _STATUTS2 === void 0 ? void 0 : _STATUTS2.color),
      borderRadius: 4,
      color: (_STATUTS3 = STATUTS[draft.status || "en_cours"]) === null || _STATUTS3 === void 0 ? void 0 : _STATUTS3.color,
      padding: "4px 6px",
      fontSize: 11,
      fontFamily: "monospace",
      fontWeight: 700,
      outline: "none"
    }
  }, Object.entries(STATUTS).map(function (_ref40) {
    var _ref41 = _slicedToArray(_ref40, 2),
      k = _ref41[0],
      v = _ref41[1];
    return /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, v.label);
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: save,
    color: C.green,
    small: true
  }, "\u2713 Enregistrer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: cancel,
    color: C.border,
    small: true
  }, "Annuler")));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: 1,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "0.9fr 1fr 1.9fr .7fr 1fr .7fr .85fr .7fr",
      gap: 1,
      flex: 1,
      background: C.border,
      border: "1px solid ".concat(C.border),
      borderRadius: "6px 0 0 6px",
      overflow: "hidden",
      fontSize: 11
    }
  }, [["OF", h.of || "—"], ["Article", h.codeArticle || "—"], ["Description", h.description || "—"], ["SN", headerSnDisplay, headerSnFull], ["OTP", h.otp || h.projet || "—"], ["OF reprise", String(h.ofRework || "non").toLowerCase() === "oui" || String(h.ofRework || "").toLowerCase() === "true" ? "Oui" : "Non"]].map(function (_ref42) {
    var _ref43 = _slicedToArray(_ref42, 3),
      label = _ref43[0],
      val = _ref43[1],
      title = _ref43[2];
    var copyValue = title || val,
      copied = copiedField === label;
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      role: "button",
      tabIndex: 0,
      "aria-label": copied ? "".concat(label, " copi\xE9") : "".concat(label, " : ").concat(copyValue, ". Double-cliquer pour copier"),
      onDoubleClick: function onDoubleClick() {
        return copyHeaderField(label, copyValue);
      },
      onKeyDown: function onKeyDown(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          copyHeaderField(label, copyValue);
        }
      },
      style: {
        background: copied ? C.green + "20" : C.surface,
        padding: "4px 10px",
        minWidth: 0,
        cursor: "copy",
        outline: "none",
        boxShadow: copied ? "inset 0 0 0 1px ".concat(C.green) : undefined
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 8,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 1
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      title: "".concat(copyValue, " \u2014 double-cliquer pour copier"),
      style: {
        color: copied ? C.green : C.text,
        fontWeight: 700,
        fontFamily: "monospace",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, copied ? "✓ " : "", val));
  }), h.of && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      padding: "4px 10px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 8,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 1
    }
  }, "Photos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "\uD83D\uDCC1"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontSize: 9,
      color: C.muted,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: 70
    },
    title: "S:\\OP_SPACE\\Photos_OF\\".concat(h.of)
  }, "OF"), /*#__PURE__*/React.createElement("span", {
    onClick: function onClick(e) {
      e.stopPropagation();
      var path = "S:\\OP_SPACE\\Photos_OF\\".concat(h.of);
      try {
        var ta = document.createElement("textarea");
        ta.value = path;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch (_unused6) {
        window.prompt("Copier (Ctrl+C):", path);
      }
    },
    style: {
      cursor: "pointer",
      color: C.blue,
      fontSize: 9,
      flexShrink: 0,
      background: C.blue + "22",
      border: "1px solid ".concat(C.blue),
      borderRadius: 3,
      padding: "1px 5px",
      whiteSpace: "nowrap"
    },
    title: "Copier le chemin"
  }, "\u2398"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      padding: "4px 10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 8,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 2
    }
  }, "Statut OF"), /*#__PURE__*/React.createElement("select", {
    disabled: !isAdminManager(user),
    value: h.status || "en_cours",
    onChange: function onChange(e) {
      return onUpdateStatus && onUpdateStatus(e.target.value);
    },
    style: {
      background: ((_STATUTS4 = STATUTS[h.status || "en_cours"]) === null || _STATUTS4 === void 0 ? void 0 : _STATUTS4.color) + "22",
      border: "1px solid ".concat((_STATUTS5 = STATUTS[h.status || "en_cours"]) === null || _STATUTS5 === void 0 ? void 0 : _STATUTS5.color),
      borderRadius: 14,
      padding: "2px 8px",
      fontSize: 10,
      fontWeight: 700,
      color: (_STATUTS6 = STATUTS[h.status || "en_cours"]) === null || _STATUTS6 === void 0 ? void 0 : _STATUTS6.color,
      outline: "none",
      cursor: "pointer",
      width: "100%"
    }
  }, Object.entries(STATUTS).map(function (_ref44) {
    var _ref45 = _slicedToArray(_ref44, 2),
      k = _ref45[0],
      v = _ref45[1];
    return /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, v.label);
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: !isAdminManager(user),
    onClick: startEdit,
    title: "Modifier les informations du dossier (Admin / Manager)",
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: "0 6px 0 0",
      color: C.muted,
      cursor: "pointer",
      padding: "0 12px",
      fontSize: 14,
      flex: 1,
      borderLeft: "none",
      transition: "color .15s"
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.target.style.color = C.accent;
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.target.style.color = C.muted;
    }
  }, "\u270E"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: "0 0 6px 0",
      borderLeft: "none",
      borderTop: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 12px"
    }
  }, /*#__PURE__*/React.createElement(CommentBtn, {
    comments: h.comments || [],
    onChange: function onChange(v) {
      return onCommentsChange && onCommentsChange(v);
    },
    user: user
  }))));
};
var cleanSn = function cleanSn(v) {
  return String(v !== null && v !== void 0 ? v : "").trim().toUpperCase();
};
var hasUnitIdentity = function hasUnitIdentity(u) {
  return !!(cleanSn(u.sn) || cleanSn(u.lot));
};
var isTrackedLot = function isTrackedLot(row) {
  return row.unitKind ? row.unitKind === "lot" : !cleanSn(row.sn) && !!cleanSn(row.lot);
};
var normalizeTrackedUnit = function normalizeTrackedUnit(row) {
  return isTrackedLot(row) ? _objectSpread(_objectSpread({}, row), {}, {
    sn: "",
    lot: cleanSn(row.lot || row.sn),
    unitKind: "lot"
  }) : row;
};
var snTitle = function snTitle(u) {
  return [(u === null || u === void 0 ? void 0 : u.sn) || "", u !== null && u !== void 0 && u.lot ? "LOT ".concat(u.lot) : ""].filter(Boolean).join(" · ") || "SN / lot ?";
};
var snRowsFromHeader = function snRowsFromHeader(header) {
  return ((header === null || header === void 0 ? void 0 : header._snRows) || []).map(normalizeTrackedUnit).filter(function (r) {
    return !r.deleted && hasUnitIdentity(r);
  });
};
var snScope = function snScope(row) {
  var snRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var ids = Array.isArray(row === null || row === void 0 ? void 0 : row.snIds) ? row.snIds.filter(Boolean) : [];
  if (!ids.length && row !== null && row !== void 0 && row.unitId) ids = [row.unitId];
  ids = _toConsumableArray(new Set(ids)).filter(function (id) {
    return snRows.some(function (s) {
      return s.id === id;
    });
  });
  if ((row === null || row === void 0 ? void 0 : row.snScope) === "custom" || ids.length) return {
    mode: "custom",
    ids: ids
  };
  return {
    mode: "all",
    ids: []
  };
};
var snScopeLabel = function snScopeLabel(row) {
  var snRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var scope = snScope(row, snRows);
  var excluded = ((row === null || row === void 0 ? void 0 : row.snExcludeIds) || []).filter(function (id) {
    return snRows.some(function (s) {
      return s.id === id;
    });
  });
  if (scope.mode === "all") {
    if (excluded.length) return "Tous sauf ".concat(excluded.length, " SN");
    return "Tous";
  }
  var labels = scope.ids.map(function (id) {
    return snRows.find(function (s) {
      return s.id === id;
    });
  }).filter(Boolean).map(snTitle);
  return labels.length > 2 ? "".concat(labels.length, " SN") : labels.join(" + ") || "SN ?";
};
var defaultSnScope = function defaultSnScope(header) {
  var rows = snRowsFromHeader(header);
  var ids = ((header === null || header === void 0 ? void 0 : header._entrySnIds) || (header === null || header === void 0 ? void 0 : header._defaultSnIds) || []).filter(function (id) {
    return rows.some(function (s) {
      return s.id === id;
    });
  });
  return ids.length ? {
    snScope: "custom",
    snIds: ids,
    unitId: ids[0]
  } : {
    snScope: "all",
    snIds: [],
    unitId: ""
  };
};
var rowMatchesSn = function rowMatchesSn(row, snRow) {
  var snRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!snRow) return true;
  var scope = snScope(row, snRows);
  var excluded = ((row === null || row === void 0 ? void 0 : row.snExcludeIds) || []).filter(function (id) {
    return snRows.some(function (s) {
      return s.id === id;
    });
  });
  if (scope.mode === "all") return !excluded.includes(snRow.id);
  return scope.ids.includes(snRow.id);
};
var workSnFilter = function workSnFilter(header) {
  var rows = snRowsFromHeader(header);
  var id = ((header === null || header === void 0 ? void 0 : header._defaultSnIds) || []).find(function (x) {
    return rows.some(function (s) {
      return s.id === x;
    });
  });
  return id || "all";
};
var scopeDecisionForEdit = function scopeDecisionForEdit(row, header) {
  if (!(row !== null && row !== void 0 && row.validated) && !(row !== null && row !== void 0 && row.editBase)) return {};
  var active = workSnFilter(header);
  if (active === "all") return {};
  var snRows = snRowsFromHeader(header);
  var scope = snScope(row, snRows);
  var targets = snRows.filter(function (u) {
    return rowMatchesSn(row, u, snRows);
  });
  if (targets.length < 2 || !targets.some(function (u) {
    return u.id === active;
  })) return {};
  if (row !== null && row !== void 0 && row._scopeEditConfirmed) return {};
  var unit = snRowsFromHeader(header).find(function (s) {
    return s.id === active;
  });
  var choice = window.prompt("Cette ligne concerne ".concat(scope.mode === "all" ? "tous les SN" : "".concat(targets.length, " SN"), ".\n\n1 = isoler et modifier uniquement ce SN (").concat(unit ? snTitle(unit) : "SN courant", ")\n2 = modifier pour tous les SN de cette ligne\n3 = annuler l'operation\n\nVotre choix :"), "1");
  if (choice === null || String(choice).trim() === "3") return null;
  if (String(choice).trim() === "2") return {
    _scopeEditConfirmed: true
  };
  return {
    snScope: "custom",
    snIds: [active],
    unitId: active,
    __scopeAction: "split",
    __scopeActiveId: active
  };
};
var scopeDecisionForDelete = function scopeDecisionForDelete(row, header) {
  var active = workSnFilter(header);
  if (active === "all") return {};
  if (snScope(row, snRowsFromHeader(header)).mode !== "all") return {};
  var unit = snRowsFromHeader(header).find(function (s) {
    return s.id === active;
  });
  var choice = window.prompt("Cette ligne est ciblee \"Tous les SN\".\n\n1 = annuler uniquement pour ce SN (".concat(unit ? snTitle(unit) : "SN courant", ")\n2 = annuler pour tous les SN\n3 = annuler l'operation\n\nVotre choix :"), "1");
  if (choice === null || String(choice).trim() === "3") return null;
  if (String(choice).trim() === "2") return {};
  return {
    __scopeAction: "split",
    __scopeActiveId: active
  };
};
var scopedPatch = function scopedPatch(row, header, fields) {
  var decision = scopeDecisionForEdit(row, header);
  if (decision === null) return row;
  var __scopeAction = decision.__scopeAction,
    __scopeActiveId = decision.__scopeActiveId,
    patch = _objectWithoutProperties(decision, _excluded2);
  return _objectSpread(_objectSpread(_objectSpread({}, row), patch), fields);
};
var remainingSnScope = function remainingSnScope(row, active) {
  if (row.snScope === "custom" || (row.snIds || []).length || row.unitId) {
    var _row$snIds;
    var ids = ((_row$snIds = row.snIds) !== null && _row$snIds !== void 0 && _row$snIds.length ? row.snIds : [row.unitId]).filter(function (id) {
      return id && id !== active;
    });
    return {
      snScope: "custom",
      snIds: ids,
      unitId: ids[0] || ""
    };
  }
  return {
    snExcludeIds: _toConsumableArray(new Set([].concat(_toConsumableArray(row.snExcludeIds || []), [active])))
  };
};
var scopedRowsPatch = function scopedRowsPatch(rows, id, header, fieldsForRow) {
  var cloneExtra = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var inserted = null;
  var independent = [];
  var next = rows.map(function (r) {
    if (r.id !== id) return r;
    var fields = typeof fieldsForRow === "function" ? fieldsForRow(r) : fieldsForRow;
    var decision = scopeDecisionForEdit(r, header);
    if (decision === null) return r;
    if (decision.__scopeAction === "split") {
      var active = decision.__scopeActiveId;
      var excluded = _toConsumableArray(new Set([].concat(_toConsumableArray(r.snExcludeIds || []), [active])));
      inserted = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, r), fields), cloneExtra), {}, {
        id: uid(),
        snScope: "custom",
        snIds: [active],
        unitId: active,
        snExcludeIds: [],
        _scopeEditConfirmed: undefined
      });
      return _objectSpread(_objectSpread(_objectSpread({}, r), remainingSnScope(r, active)), {}, {
        _scopeEditConfirmed: undefined
      });
    }
    var __scopeAction = decision.__scopeAction,
      __scopeActiveId = decision.__scopeActiveId,
      patch = _objectWithoutProperties(decision, _excluded3);
    var result = _objectSpread(_objectSpread(_objectSpread({}, r), patch), fields);
    var newlyValidated = !r.validated && result.validated || (result.items || []).some(function (item) {
      var _find;
      return item.validated && !((_find = (r.items || []).find(function (old) {
        return old.id === item.id;
      })) !== null && _find !== void 0 && _find.validated);
    });
    if (newlyValidated && header !== null && header !== void 0 && header._confirmMultiSn) {
      var units = snRowsFromHeader(header);
      var targets = units.filter(function (unit) {
        return rowMatchesSn(result, unit, units);
      });
      if (targets.length > 1) {
        if (!window.confirm("Cr\xE9er ".concat(targets.length, " lignes ind\xE9pendantes, une par SN / LOT ?\n\n").concat(targets.map(snTitle).join("\n"), "\n\nChaque ligne pourra \xEAtre modifi\xE9e ou annul\xE9e s\xE9par\xE9ment."))) return r;
        var _clone = function clone(value, newIds) {
          return Array.isArray(value) ? value.map(function (item) {
            return _clone(item, newIds);
          }) : value && _typeof(value) === "object" ? Object.fromEntries(Object.entries(value).map(function (_ref46) {
            var _ref47 = _slicedToArray(_ref46, 2),
              key = _ref47[0],
              item = _ref47[1];
            return [key, key === "id" && newIds ? uid() : _clone(item, newIds)];
          })) : value;
        };
        var copies = targets.map(function (unit, index) {
          return _objectSpread(_objectSpread({}, _clone(result, index > 0)), {}, {
            snScope: "custom",
            snIds: [unit.id],
            unitId: unit.id,
            snExcludeIds: [],
            _scopeEditConfirmed: undefined
          });
        });
        independent.push.apply(independent, _toConsumableArray(copies.slice(1)));
        return copies[0];
      }
    }
    return result;
  });
  return [].concat(_toConsumableArray(next), _toConsumableArray(inserted ? [inserted] : []), independent);
};
var scopedRowsDelete = function scopedRowsDelete(rows, id, header, fieldsForRow) {
  var inserted = null;
  var next = rows.map(function (r) {
    if (r.id !== id) return r;
    var fields = typeof fieldsForRow === "function" ? fieldsForRow(r) : fieldsForRow;
    var decision = scopeDecisionForDelete(r, header);
    if (decision === null) return r;
    if (decision.__scopeAction === "split") {
      var active = decision.__scopeActiveId;
      var excluded = _toConsumableArray(new Set([].concat(_toConsumableArray(r.snExcludeIds || []), [active])));
      if (!snRowsFromHeader(header).some(function (u) {
        return !excluded.includes(u.id);
      })) return _objectSpread(_objectSpread({}, r), fields);
      inserted = _objectSpread(_objectSpread(_objectSpread({}, r), fields), {}, {
        id: uid(),
        snScope: "custom",
        snIds: [active],
        unitId: active,
        snExcludeIds: [],
        _scopeEditConfirmed: undefined
      });
      return _objectSpread(_objectSpread(_objectSpread({}, r), remainingSnScope(r, active)), {}, {
        _scopeEditConfirmed: undefined
      });
    }
    return _objectSpread(_objectSpread({}, r), fields);
  });
  return inserted ? [].concat(_toConsumableArray(next), [inserted]) : next;
};
var _rowMatchesSnFilter = function rowMatchesSnFilter(row, filter, header) {
  if (Array.isArray(filter)) return !filter.length || filter.some(function (f) {
    return _rowMatchesSnFilter(row, f, header);
  });
  if (!filter || filter === "all") return true;
  var rows = snRowsFromHeader(header);
  var scope = snScope(row, rows);
  if (filter === "scope-all") return scope.mode === "all";
  var snRow = rows.find(function (s) {
    return s.id === filter;
  });
  return snRow ? rowMatchesSn(row, snRow, rows) : scope.ids.includes(filter);
};
var effectiveScopedRows = function effectiveScopedRows(data, tab) {
  var _data$units, _data$tab;
  var units = ((data === null || data === void 0 || (_data$units = data.units) === null || _data$units === void 0 ? void 0 : _data$units.rows) || snRowsFromHeader((data === null || data === void 0 ? void 0 : data.header) || {})).filter(function (u) {
    return !u.deleted && hasUnitIdentity(u);
  });
  return ((data === null || data === void 0 || (_data$tab = data[tab]) === null || _data$tab === void 0 ? void 0 : _data$tab.rows) || []).filter(function (r) {
    return !r.deleted && (!units.length || units.some(function (u) {
      return rowMatchesSn(r, u, units);
    }));
  });
};
var effectiveEtuvageRows = function effectiveEtuvageRows(data) {
  return effectiveScopedRows(data, "etuvage");
};
var SnFilter = function SnFilter(_ref48) {
  var value = _ref48.value,
    onChange = _ref48.onChange,
    header = _ref48.header,
    _ref48$title = _ref48.title,
    title = _ref48$title === void 0 ? "Filtrer SN cible" : _ref48$title;
  var rows = snRowsFromHeader(header);
  if (!rows.length) return null;
  return /*#__PURE__*/React.createElement(MultiFilter, {
    value: value,
    onChange: onChange,
    label: "Tous",
    title: title,
    options: [{
      value: "scope-all",
      label: "Cible Tous"
    }].concat(_toConsumableArray(rows.map(function (s) {
      return {
        value: s.id,
        label: snTitle(s)
      };
    })))
  });
};
var SnScopePicker = function SnScopePicker(_ref49) {
  var row = _ref49.row,
    header = _ref49.header,
    onChange = _ref49.onChange,
    _ref49$disabled = _ref49.disabled,
    disabled = _ref49$disabled === void 0 ? false : _ref49$disabled;
  var rows = snRowsFromHeader(header);
  var scope = snScope(row, rows);
  var label = snScopeLabel(row, rows);
  var _useState47 = useState(false),
    _useState48 = _slicedToArray(_useState47, 2),
    open = _useState48[0],
    setOpen = _useState48[1];
  var _useState49 = useState({
      top: 0,
      left: 0
    }),
    _useState50 = _slicedToArray(_useState49, 2),
    pos = _useState50[0],
    setPos = _useState50[1];
  var btnRef = React.useRef(null);
  var panelRef = React.useRef(null);
  var place = function place() {
    var _btnRef$current;
    var r = (_btnRef$current = btnRef.current) === null || _btnRef$current === void 0 ? void 0 : _btnRef$current.getBoundingClientRect();
    if (!r) return;
    var w = 230;
    setPos({
      top: Math.min(r.bottom + 4, window.innerHeight - 40),
      left: Math.max(8, Math.min(r.left, window.innerWidth - w - 8))
    });
  };
  useEffect(function () {
    if (!open) return;
    place();
    var close = function close(e) {
      var _btnRef$current2, _panelRef$current;
      if ((_btnRef$current2 = btnRef.current) !== null && _btnRef$current2 !== void 0 && _btnRef$current2.contains(e.target) || (_panelRef$current = panelRef.current) !== null && _panelRef$current !== void 0 && _panelRef$current.contains(e.target)) return;
      setOpen(false);
    };
    var key = function key(e) {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return function () {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);
  if (!rows.length) return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontSize: 10,
      color: C.muted
    }
  }, "Tous");
  if (disabled) return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      fontSize: 10,
      color: scope.mode === "all" ? C.green : C.blue
    }
  }, label);
  var setAll = function setAll() {
    var _rows$;
    onChange({
      snScope: "custom",
      snIds: rows.map(function (s) {
        return s.id;
      }),
      unitId: ((_rows$ = rows[0]) === null || _rows$ === void 0 ? void 0 : _rows$.id) || "",
      snExcludeIds: []
    });
    setOpen(false);
  };
  var setCustom = function setCustom(ids) {
    return onChange({
      snScope: "custom",
      snIds: ids,
      unitId: ids[0] || "",
      snExcludeIds: []
    });
  };
  var toggle = function toggle(id) {
    var next = scope.ids.includes(id) ? scope.ids.filter(function (x) {
      return x !== id;
    }) : [].concat(_toConsumableArray(scope.ids), [id]);
    setCustom(next.length ? next : [id]);
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "no-print",
    style: {
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("button", {
    ref: btnRef,
    onClick: function onClick(e) {
      e.stopPropagation();
      place();
      setOpen(function (o) {
        return !o;
      });
    },
    title: "Appliquer cette op\xE9ration \xE0 : ".concat(label),
    style: {
      background: C.input,
      cursor: "pointer",
      fontFamily: "monospace",
      fontSize: 10,
      color: scope.mode === "all" ? C.green : C.blue,
      border: "1px solid ".concat(scope.mode === "all" ? C.green : C.blue),
      borderRadius: 4,
      padding: "2px 5px",
      whiteSpace: "nowrap",
      maxWidth: 72,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label), open && /*#__PURE__*/React.createElement("div", {
    ref: panelRef,
    style: {
      position: "fixed",
      top: pos.top,
      left: pos.left,
      zIndex: 600,
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: 8,
      width: 230,
      boxShadow: "0 14px 34px #000b"
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: C.text,
      fontSize: 11,
      marginBottom: 5,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    checked: scope.mode === "all" || scope.ids.length === rows.length,
    onChange: setAll,
    style: {
      accentColor: C.green
    }
  }), "Appliquer \xE0 tous les SN / LOT"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid ".concat(C.border),
      paddingTop: 5,
      maxHeight: 220,
      overflowY: "auto"
    }
  }, rows.map(function (s) {
    return /*#__PURE__*/React.createElement("label", {
      key: s.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: C.text,
        fontSize: 11,
        marginBottom: 4,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: scope.mode === "custom" && scope.ids.includes(s.id),
      onChange: function onChange() {
        return toggle(s.id);
      },
      style: {
        accentColor: C.blue
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace"
      }
    }, snTitle(s)));
  }))));
};
var unitsFromHeader = function unitsFromHeader() {
  var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var visa = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return (h._snRows || []).length ? {
    mode: (h._snRows || []).length > 1 ? "multi" : "single",
    rows: (h._snRows || []).map(function (r) {
      var _r$snProduitFini;
      return _objectSpread(_objectSpread({}, r), {}, {
        id: r.id || uid(),
        sn: r.sn || "",
        lot: r.lot || h.lot || "",
        status: r.status || "en_cours",
        snProduitFini: (_r$snProduitFini = r.snProduitFini) !== null && _r$snProduitFini !== void 0 ? _r$snProduitFini : (h._snRows || []).filter(function (u) {
          return !u.deleted;
        }).length === 1 ? h.snProduitFini || "" : "",
        qteInitiale: r.qteInitiale || r.qte || "",
        unitKind: r.unitKind || r.kind || "",
        remarque: r.remarque || "",
        createdVisa: r.createdVisa || visa || h.createdBy || "",
        createdDT: r.createdDT || h.createdAt || nowDT(),
        deleted: !!r.deleted
      });
    })
  } : h.sn || h.lot ? {
    mode: "single",
    rows: [{
      id: uid(),
      sn: h.sn || "",
      lot: h.lot || "",
      status: "en_cours",
      snProduitFini: h.snProduitFini || "",
      qteInitiale: h.qteInitiale || h.qte || "",
      unitKind: h.unitKind || "",
      remarque: "",
      createdVisa: visa || h.createdBy || "",
      createdDT: h.createdAt || nowDT(),
      deleted: false
    }]
  } : {
    mode: "single",
    rows: []
  };
};
var withUnitMetadata = function withUnitMetadata(data) {
  var _data$demating, _data$units2;
  if (Array.isArray((_data$demating = data.demating) === null || _data$demating === void 0 ? void 0 : _data$demating.connectors)) data = _objectSpread(_objectSpread({}, data), {}, {
    demating: _objectSpread(_objectSpread({}, data.demating), {}, {
      connectors: data.demating.connectors.map(function (c) {
        return _objectSpread(_objectSpread({}, c), {}, {
          events: (c.events || []).map(function (e) {
            return _objectSpread(_objectSpread({}, e), {}, {
              action: normalizeMatingAction(e.action)
            });
          })
        });
      })
    })
  });
  var units = Array.isArray((_data$units2 = data.units) === null || _data$units2 === void 0 ? void 0 : _data$units2.rows) ? data.units : unitsFromHeader(data.header);
  var active = units.rows.filter(function (u) {
    return !u.deleted;
  });
  var rows = units.rows.map(function (u) {
    var _u$snProduitFini, _data$header;
    return _objectSpread(_objectSpread({}, normalizeTrackedUnit(u)), {}, {
      status: u.status || "en_cours",
      snProduitFini: (_u$snProduitFini = u.snProduitFini) !== null && _u$snProduitFini !== void 0 ? _u$snProduitFini : active.length === 1 ? ((_data$header = data.header) === null || _data$header === void 0 ? void 0 : _data$header.snProduitFini) || "" : ""
    });
  });
  return _objectSpread(_objectSpread({}, data), {}, {
    units: _objectSpread(_objectSpread({}, units), {}, {
      rows: rows
    }),
    header: _objectSpread(_objectSpread({}, data.header), {}, {
      _snRows: rows
    })
  });
};
var patchTrackedUnit = function patchTrackedUnit(data, unitId, fields) {
  var normalized = withUnitMetadata(data);
  if (!normalized.units.rows.some(function (u) {
    return u.id === unitId && !u.deleted;
  })) throw new Error("Pièce introuvable dans cet OF.");
  var allowed = {};
  if (Object.hasOwn(fields, "snProduitFini")) allowed.snProduitFini = String(fields.snProduitFini || "").trim();
  if (Object.hasOwn(fields, "status")) {
    if (!Object.hasOwn(UNIT_STATUTS, fields.status)) throw new Error("Statut SN invalide.");
    allowed.status = fields.status;
  }
  var rows = normalized.units.rows.map(function (u) {
    return u.id === unitId ? _objectSpread(_objectSpread({}, u), allowed) : u;
  });
  return _objectSpread(_objectSpread({}, normalized), {}, {
    units: _objectSpread(_objectSpread({}, normalized.units), {}, {
      rows: rows
    }),
    header: _objectSpread(_objectSpread({}, normalized.header), {}, {
      _snRows: rows
    })
  });
};
var trackedLotQty = function trackedLotQty(row) {
  var _ref50, _ref51, _row$qteActuelle;
  return (_ref50 = (_ref51 = (_row$qteActuelle = row.qteActuelle) !== null && _row$qteActuelle !== void 0 ? _row$qteActuelle : row.qteInitiale) !== null && _ref51 !== void 0 ? _ref51 : row.qte) !== null && _ref50 !== void 0 ? _ref50 : "";
};
var convertTrackedUnitKind = function convertTrackedUnitKind(data, unitId, targetKind, user) {
  var normalized = withUnitMetadata(data);
  var source = normalized.units.rows.find(function (unit) {
    return unit.id === unitId && !unit.deleted;
  });
  if (!source) throw new Error("SN / lot introuvable.");
  if (!["sn", "lot"].includes(targetKind)) throw new Error("Type de pièce invalide.");
  if (targetKind === "sn") {
    var _value = cleanSn(source.sn || source.lot);
    if (!_value) throw new Error("Numéro de série vide.");
    if (normalized.units.rows.some(function (unit) {
      return unit.id !== unitId && !unit.deleted && cleanSn(unit.sn) === _value;
    })) throw new Error("SN ".concat(_value, " d\xE9j\xE0 pr\xE9sent dans cet OF."));
    return _objectSpread(_objectSpread({}, normalized), {}, {
      units: _objectSpread(_objectSpread({}, normalized.units), {}, {
        rows: normalized.units.rows.map(function (unit) {
          return unit.id === unitId ? _objectSpread(_objectSpread({}, unit), {}, {
            sn: _value,
            lot: "",
            unitKind: "sn",
            qteInitiale: "",
            qteActuelle: "",
            qte: "",
            kindHistory: [].concat(_toConsumableArray(unit.kindHistory || []), [{
              from: isTrackedLot(source) ? "lot" : "sn",
              to: "sn",
              dt: nowDT(),
              visa: (user === null || user === void 0 ? void 0 : user.trigram) || ""
            }])
          }) : unit;
        })
      })
    });
  }
  var value = cleanSn(source.lot || source.sn);
  if (!value) throw new Error("Numéro de lot vide.");
  if (normalized.units.rows.some(function (unit) {
    return unit.id !== unitId && !unit.deleted && isTrackedLot(unit) && cleanSn(unit.lot) === value;
  })) throw new Error("Lot ".concat(value, " d\xE9j\xE0 pr\xE9sent dans cet OF."));
  return _objectSpread(_objectSpread({}, normalized), {}, {
    units: _objectSpread(_objectSpread({}, normalized.units), {}, {
      rows: normalized.units.rows.map(function (unit) {
        return unit.id === unitId ? _objectSpread(_objectSpread({}, unit), {}, {
          sn: "",
          lot: value,
          unitKind: "lot",
          qteInitiale: unit.qteInitiale || "1",
          qteActuelle: unit.qteActuelle || unit.qteInitiale || "1",
          kindHistory: [].concat(_toConsumableArray(unit.kindHistory || []), [{
            from: isTrackedLot(source) ? "lot" : "sn",
            to: "lot",
            dt: nowDT(),
            visa: (user === null || user === void 0 ? void 0 : user.trigram) || ""
          }])
        }) : unit;
      })
    })
  });
};
var changeTrackedLotQuantity = function changeTrackedLotQuantity(data, sourceId, value, user) {
  if (!isAdminManager(user)) throw new Error("Seuls Admin et Manager peuvent modifier les quantités.");
  var normalized = withUnitMetadata(data),
    source = normalized.units.rows.find(function (u) {
      return u.id === sourceId && !u.deleted;
    });
  if (!source || !isTrackedLot(source)) throw new Error("Lot introuvable.");
  if (!/^[1-9]\d*$/.test(String(value).trim()) || !Number.isSafeInteger(Number(value))) throw new Error("La quantité doit être un entier strictement positif.");
  var qty = String(Number(value));
  if (qty === String(trackedLotQty(source))) return normalized;
  var event = {
    id: uid(),
    before: trackedLotQty(source),
    after: qty,
    dt: nowDT(),
    visa: user.trigram
  };
  return withUnitMetadata(_objectSpread(_objectSpread({}, normalized), {}, {
    units: _objectSpread(_objectSpread({}, normalized.units), {}, {
      rows: normalized.units.rows.map(function (u) {
        return u.id === sourceId ? _objectSpread(_objectSpread({}, u), {}, {
          qteInitiale: u.qteInitiale || u.qte || qty,
          qteActuelle: qty,
          quantityHistory: [].concat(_toConsumableArray(u.quantityHistory || []), [event])
        }) : u;
      })
    })
  }));
};
var splitTrackedLot = function splitTrackedLot(data, sourceId, remaining, destinations, user) {
  if (!isAdminManager(user)) throw new Error("Seuls Admin et Manager peuvent scinder un lot.");
  var normalized = withUnitMetadata(data),
    units = normalized.units.rows;
  var source = units.find(function (u) {
    return u.id === sourceId && !u.deleted;
  });
  if (!source || !isTrackedLot(source)) throw new Error("Lot source introuvable.");
  var quantity = function quantity(value) {
    if (!/^[1-9]\d*$/.test(String(value).trim()) || !Number.isSafeInteger(Number(value))) throw new Error("Les quantités doivent être des entiers strictement positifs.");
    return Number(value);
  };
  var initial = quantity(trackedLotQty(source)),
    left = quantity(remaining);
  if (!Array.isArray(destinations) || !destinations.length) throw new Error("Ajoutez au moins un lot destination.");
  var labels = new Set(units.filter(function (u) {
    return !u.deleted;
  }).flatMap(function (u) {
    return [cleanSn(u.sn), cleanSn(u.lot)];
  }).filter(Boolean));
  var targets = destinations.map(function (d) {
    var lot = cleanSn(d.lot);
    if (!lot || ["N/A", "NA", "-"].includes(lot) || labels.has(lot)) throw new Error("Chaque nouveau lot doit avoir un numéro unique dans cet OF.");
    labels.add(lot);
    return {
      lot: lot,
      qty: quantity(d.qty)
    };
  });
  if (left + targets.reduce(function (sum, d) {
    return sum + d.qty;
  }, 0) !== initial) throw new Error("La somme des quantit\xE9s doit \xEAtre \xE9gale \xE0 ".concat(initial, "."));
  var dt = nowDT(),
    visa = user.trigram,
    splitId = uid();
  var children = targets.map(function (d) {
    return _objectSpread(_objectSpread({}, source), {}, {
      id: uid(),
      sn: "",
      lot: d.lot,
      unitKind: "lot",
      qteInitiale: String(d.qty),
      qteActuelle: String(d.qty),
      qte: String(d.qty),
      parentUnitId: source.id,
      splitId: splitId,
      splitDate: dt,
      createdVisa: visa,
      createdDT: dt,
      snError: "",
      quantityHistory: [],
      deleted: false
    });
  });
  var result = _objectSpread(_objectSpread({}, normalized), {}, {
    units: _objectSpread(_objectSpread({}, normalized.units), {}, {
      mode: "multi",
      rows: [].concat(_toConsumableArray(units.map(function (u) {
        return u.id === source.id ? _objectSpread(_objectSpread({}, u), {}, {
          qteActuelle: String(left),
          quantityHistory: [].concat(_toConsumableArray(u.quantityHistory || []), [{
            id: uid(),
            before: String(initial),
            after: String(left),
            dt: dt,
            visa: visa,
            splitId: splitId
          }])
        }) : u;
      })), _toConsumableArray(children))
    }),
    lotSplits: [].concat(_toConsumableArray(normalized.lotSplits || []), [{
      id: splitId,
      sourceId: sourceId,
      sourceLot: source.sn || source.lot,
      initialQty: initial,
      remainingQty: left,
      destinations: children.map(function (u) {
        return {
          id: u.id,
          lot: u.lot,
          qty: Number(u.qteInitiale)
        };
      }),
      dt: dt,
      visa: visa
    }])
  });
  var active = units.filter(function (u) {
    return !u.deleted && hasUnitIdentity(u);
  });
  var inherit = function inherit(row) {
    var ids = active.filter(function (u) {
      return rowMatchesSn(row, u, active);
    }).map(function (u) {
      return u.id;
    });
    if (ids.includes(source.id)) ids.push.apply(ids, _toConsumableArray(children.map(function (u) {
      return u.id;
    })));
    return _objectSpread(_objectSpread({}, row), {}, {
      snScope: "custom",
      snIds: ids,
      unitId: ids[0] || "",
      snExcludeIds: []
    });
  };
  for (var _i = 0, _arr = [["rework", "rows"], ["consommables", "ops"], ["testequip", "rows"], ["faits", "rows"], ["etuvage", "rows"], ["demating", "connectors"], ["openwork", "rows"]]; _i < _arr.length; _i++) {
    var _result$tab;
    var _arr$_i = _slicedToArray(_arr[_i], 2),
      tab = _arr$_i[0],
      key = _arr$_i[1];
    if (Array.isArray((_result$tab = result[tab]) === null || _result$tab === void 0 ? void 0 : _result$tab[key])) result[tab] = _objectSpread(_objectSpread({}, result[tab]), {}, _defineProperty({}, key, result[tab][key].map(inherit)));
  }
  return withUnitMetadata(result);
};
var SplitLotModal = function SplitLotModal(_ref52) {
  var source = _ref52.source,
    onConfirm = _ref52.onConfirm,
    onClose = _ref52.onClose;
  var _useState51 = useState(trackedLotQty(source)),
    _useState52 = _slicedToArray(_useState51, 2),
    remaining = _useState52[0],
    setRemaining = _useState52[1];
  var _useState53 = useState([{
      lot: "",
      qty: ""
    }]),
    _useState54 = _slicedToArray(_useState53, 2),
    destinations = _useState54[0],
    setDestinations = _useState54[1];
  var _useState55 = useState(""),
    _useState56 = _slicedToArray(_useState55, 2),
    error = _useState56[0],
    setError = _useState56[1];
  var total = Number(remaining || 0) + destinations.reduce(function (sum, d) {
    return sum + Number(d.qty || 0);
  }, 0);
  var inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: 7,
    background: C.input,
    color: C.text,
    border: "1px solid ".concat(C.border),
    borderRadius: 4
  };
  var patch = function patch(index, key, value) {
    setError("");
    setDestinations(function (ds) {
      return ds.map(function (d, i) {
        return i === index ? _objectSpread(_objectSpread({}, d), {}, _defineProperty({}, key, value)) : d;
      });
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 500,
      background: "#0009",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Scinder le lot",
    style: {
      width: 640,
      maxWidth: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      background: C.surface,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 8,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 16px",
      fontSize: 18
    }
  }, "Scinder le lot"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, "Lot source : ", /*#__PURE__*/React.createElement("strong", null, source.sn || source.lot), " \u2014 Qt\xE9 actuelle : ", /*#__PURE__*/React.createElement("strong", null, trackedLotQty(source) || "Non renseignée")), /*#__PURE__*/React.createElement("label", null, "Qt\xE9 conserv\xE9e dans le lot source", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Qt\xE9 conserv\xE9e",
    type: "number",
    min: "1",
    step: "1",
    value: remaining,
    onChange: function onChange(e) {
      setError("");
      setRemaining(e.target.value);
    },
    style: _objectSpread(_objectSpread({}, inputStyle), {}, {
      marginTop: 5,
      marginBottom: 16
    })
  })), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, null, "Nouveau lot"), /*#__PURE__*/React.createElement(TH, {
    w: 90
  }, "Qt\xE9"), /*#__PURE__*/React.createElement(TH, {
    w: 36
  }))), /*#__PURE__*/React.createElement("tbody", null, destinations.map(function (d, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("input", {
      "aria-label": "Lot destination ".concat(i + 1),
      value: d.lot,
      onChange: function onChange(e) {
        return patch(i, "lot", e.target.value);
      },
      style: inputStyle
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("input", {
      "aria-label": "Qt\xE9 destination ".concat(i + 1),
      type: "number",
      min: "1",
      step: "1",
      value: d.qty,
      onChange: function onChange(e) {
        return patch(i, "qty", e.target.value);
      },
      style: inputStyle
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(IconBtn, {
      title: "Retirer ce lot destination",
      disabled: destinations.length === 1,
      color: C.red,
      onClick: function onClick() {
        return setDestinations(function (ds) {
          return ds.filter(function (_, index) {
            return index !== i;
          });
        });
      }
    }, "\xD7")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: function onClick() {
      return setDestinations(function (ds) {
        return [].concat(_toConsumableArray(ds), [{
          lot: "",
          qty: ""
        }]);
      });
    }
  }, "+ Lot destination"), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: total === Number(trackedLotQty(source)) ? C.green : C.red
    }
  }, "Total : ", total, " / ", trackedLotQty(source) || "?")), error && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      color: C.red,
      marginTop: 12
    }
  }, error), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: onClose
  }, "Annuler"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.blue,
    onClick: function onClick() {
      try {
        onConfirm(remaining, destinations);
      } catch (e) {
        setError(e.message);
      }
    }
  }, "Confirmer le split"))));
};
var TrackedSNs = function TrackedSNs(_ref53) {
  var data = _ref53.data,
    onChange = _ref53.onChange,
    onSplitLot = _ref53.onSplitLot,
    onLotQuantity = _ref53.onLotQuantity,
    onConvertUnit = _ref53.onConvertUnit,
    _ref53$splitHistory = _ref53.splitHistory,
    splitHistory = _ref53$splitHistory === void 0 ? [] : _ref53$splitHistory,
    header = _ref53.header,
    user = _ref53.user,
    activeUnitId = _ref53.activeUnitId,
    onActiveUnitChange = _ref53.onActiveUnitChange;
  var _useState57 = useState(null),
    _useState58 = _slicedToArray(_useState57, 2),
    splitSource = _useState58[0],
    setSplitSource = _useState58[1];
  var editable = isAdminManager(user);
  var rows = (data === null || data === void 0 ? void 0 : data.rows) || [];
  var mode = (data === null || data === void 0 ? void 0 : data.mode) || (rows.filter(function (r) {
    return !r.deleted;
  }).length > 1 ? "multi" : "single");
  var visible = rows.filter(function (r) {
    return !r.deleted;
  });
  var showQty = visible.some(function (r) {
    return isTrackedLot(r) || String(r.qteInitiale || r.qte || "").trim();
  });
  var emit = function emit(next) {
    if (editable) onChange(_objectSpread(_objectSpread({}, data), {}, {
      mode: mode
    }, next));
  };
  var add = function add() {
    if (mode === "single" && visible.length >= 1) return;
    emit({
      rows: [].concat(_toConsumableArray(rows), [{
        id: uid(),
        sn: "",
        lot: "",
        qteInitiale: "",
        unitKind: "",
        status: "en_cours",
        snProduitFini: "",
        remarque: "",
        createdVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
        createdDT: nowDT(),
        deleted: false
      }])
    });
  };
  var setMode = function setMode(m) {
    if (!editable) return;
    if (m === "single" && visible.length > 1) {
      window.alert("Mode 1 OF / 1 SN impossible tant que plusieurs SN sont présents.");
      return;
    }
    onChange(_objectSpread(_objectSpread({}, data), {}, {
      mode: m,
      rows: rows
    }));
    if (m === "single" && visible[0]) onActiveUnitChange(visible[0].id);
  };
  var upd = function upd(id, f, v) {
    return emit({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, _defineProperty({}, f, v)) : r;
      })
    });
  };
  var updSn = function updSn(id, v) {
    var sn = cleanSn(v);
    if (sn && visible.some(function (r) {
      return r.id !== id && cleanSn(r.sn) === sn;
    })) {
      emit({
        rows: rows.map(function (r) {
          return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
            snError: "SN ".concat(sn, " d\xE9j\xE0 pr\xE9sent dans cet OF")
          }) : r;
        })
      });
      return;
    }
    emit({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
          sn: sn,
          unitKind: sn ? "sn" : r.lot ? "lot" : "",
          snError: ""
        }) : r;
      })
    });
  };
  var updLot = function updLot(id, value) {
    var lot = cleanSn(value),
      row = rows.find(function (r) {
        return r.id === id;
      });
    if (!row) return;
    if (lot && !row.sn && visible.some(function (r) {
      return r.id !== id && !r.sn && cleanSn(r.lot) === lot;
    })) {
      emit({
        rows: rows.map(function (r) {
          return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
            snError: "Lot ".concat(lot, " d\xE9j\xE0 pr\xE9sent dans cet OF")
          }) : r;
        })
      });
      return;
    }
    emit({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
          lot: lot,
          unitKind: r.sn ? "sn" : lot ? "lot" : "",
          snError: ""
        }) : r;
      })
    });
  };
  var dup = function dup(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r) return;
    if (mode === "single" && visible.length >= 1) return;
    emit({
      rows: [].concat(_toConsumableArray(rows), [_objectSpread(_objectSpread({}, r), {}, {
        id: uid(),
        sn: "",
        lot: "",
        unitKind: "",
        parentUnitId: undefined,
        splitId: undefined,
        quantityHistory: [],
        snProduitFini: "",
        status: "en_cours",
        snError: "",
        createdVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
        createdDT: nowDT(),
        deleted: false
      })])
    });
  };
  var del = function del(id) {
    if (!editable) return;
    var next = rows.filter(function (r) {
      return r.id !== id;
    });
    if (activeUnitId === id) onActiveUnitChange("all");
    emit({
      rows: next
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 8,
      padding: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.accent,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Pi\xE8ces de l'OF"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted
    }
  }, "Article et description restent fixes : ", (header === null || header === void 0 ? void 0 : header.codeArticle) || (header === null || header === void 0 ? void 0 : header.description) || "article OF non renseigné", ".")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("select", {
    disabled: !editable,
    value: mode,
    onChange: function onChange(e) {
      return setMode(e.target.value);
    },
    style: {
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "5px 8px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "single"
  }, "1 OF / 1 SN ou lot"), /*#__PURE__*/React.createElement("option", {
    value: "multi"
  }, "1 OF / plusieurs SN ou lots")), editable && /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    small: true,
    disabled: mode === "single" && visible.length >= 1
  }, "+ SN / lot"))), visible.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 11,
      padding: "8px 0"
    }
  }, "Aucun SN suivi - ajoutez le ou les SN concern\xE9s par cet OF.") : /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 12,
      minWidth: 620
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 150
  }, "SN"), /*#__PURE__*/React.createElement(TH, {
    w: 150
  }, "LOT"), showQty && /*#__PURE__*/React.createElement(TH, {
    w: 90
  }, "Qt\xE9 actuelle"), /*#__PURE__*/React.createElement(TH, {
    w: 150
  }, "SN produit fini"), /*#__PURE__*/React.createElement(TH, {
    w: 120
  }, "Statut SN"), /*#__PURE__*/React.createElement(TH, null, "Remarque"), /*#__PURE__*/React.createElement(TH, {
    w: 240
  }))), /*#__PURE__*/React.createElement("tbody", null, visible.map(function (r, i) {
    var _rows$find, _UNIT_STATUTS, _UNIT_STATUTS2, _UNIT_STATUTS3;
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        background: activeUnitId === r.id ? C.blue + "12" : i % 2 === 0 ? "transparent" : C.stripe
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      readOnly: !editable || isTrackedLot(r),
      value: r.sn,
      onChange: function onChange(v) {
        return updSn(r.id, v);
      },
      small: true,
      style: {
        fontFamily: "monospace",
        textTransform: "uppercase",
        borderColor: r.snError ? C.red : undefined
      }
    }), r.snError && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.red,
        marginTop: 2,
        fontFamily: "monospace"
      }
    }, r.snError)), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      readOnly: !editable,
      value: r.lot,
      onChange: function onChange(v) {
        return updLot(r.id, v);
      },
      small: true,
      style: {
        fontFamily: "monospace"
      }
    }), r.parentUnitId && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.muted,
        marginTop: 3
      }
    }, "Issu de ", ((_rows$find = rows.find(function (u) {
      return u.id === r.parentUnitId;
    })) === null || _rows$find === void 0 ? void 0 : _rows$find.lot) || r.parentUnitId)), showQty && /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      readOnly: !editable || isTrackedLot(r),
      value: trackedLotQty(r),
      onChange: function onChange(v) {
        return upd(r.id, "qteInitiale", cleanImportQty(v));
      },
      small: true,
      style: {
        fontFamily: "monospace",
        textAlign: "center"
      }
    }), isTrackedLot(r) && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.muted,
        marginTop: 3
      }
    }, "Initiale : ", r.qteInitiale || r.qte || "-")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      readOnly: !editable,
      value: r.snProduitFini || "",
      onChange: function onChange(v) {
        return upd(r.id, "snProduitFini", v);
      },
      small: true,
      title: "Produit final dans lequel cette pi\xE8ce est mont\xE9e"
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("select", {
      disabled: !editable,
      value: r.status || "en_cours",
      onChange: function onChange(e) {
        return upd(r.id, "status", e.target.value);
      },
      style: {
        background: ((_UNIT_STATUTS = UNIT_STATUTS[r.status || "en_cours"]) === null || _UNIT_STATUTS === void 0 ? void 0 : _UNIT_STATUTS.color) + "22",
        border: "1px solid ".concat((_UNIT_STATUTS2 = UNIT_STATUTS[r.status || "en_cours"]) === null || _UNIT_STATUTS2 === void 0 ? void 0 : _UNIT_STATUTS2.color),
        borderRadius: 4,
        color: (_UNIT_STATUTS3 = UNIT_STATUTS[r.status || "en_cours"]) === null || _UNIT_STATUTS3 === void 0 ? void 0 : _UNIT_STATUTS3.color,
        padding: "4px 6px",
        fontSize: 11,
        fontFamily: "monospace",
        fontWeight: 700,
        outline: "none",
        width: "100%"
      }
    }, Object.entries(UNIT_STATUTS).map(function (_ref54) {
      var _ref55 = _slicedToArray(_ref54, 2),
        k = _ref55[0],
        v = _ref55[1];
      return /*#__PURE__*/React.createElement("option", {
        key: k,
        value: k
      }, v.label);
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      readOnly: !editable,
      value: r.remarque,
      onChange: function onChange(v) {
        return upd(r.id, "remarque", v);
      },
      small: true
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return onActiveUnitChange(r.id);
      },
      color: C.blue,
      title: "Travailler sur ce SN",
      disabled: !hasUnitIdentity(r)
    }, "\u25CF"), editable && /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer",
      disabled: mode === "single"
    }, "\u29C9"), editable && /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Supprimer"
    }, "\xD7"), editable && onSplitLot && isTrackedLot(r) && /*#__PURE__*/React.createElement(Btn, {
      small: true,
      color: C.blue,
      onClick: function onClick() {
        return setSplitSource(r);
      }
    }, "Scinder"), editable && onLotQuantity && isTrackedLot(r) && /*#__PURE__*/React.createElement(Btn, {
      small: true,
      color: C.blue,
      onClick: function onClick() {
        var value = window.prompt("Nouvelle quantit\xE9 du lot ".concat(r.sn || r.lot), trackedLotQty(r));
        if (value !== null) {
          try {
            onLotQuantity(r.id, value);
          } catch (e) {
            window.alert(e.message);
          }
        }
      }
    }, "Qt\xE9"), editable && onConvertUnit && isTrackedLot(r) && /*#__PURE__*/React.createElement(Btn, {
      small: true,
      color: C.yellow,
      onClick: function onClick() {
        var qty = Number(trackedLotQty(r));
        if (qty > 1 && !window.confirm("Le lot ".concat(r.lot, " contient ").concat(qty, " pi\xE8ces. Le convertir tout de m\xEAme en un seul SN ?"))) return;
        try {
          onConvertUnit(r.id, "sn");
        } catch (e) {
          window.alert(e.message);
        }
      }
    }, "\u2192 SN"), editable && onConvertUnit && !isTrackedLot(r) && /*#__PURE__*/React.createElement(Btn, {
      small: true,
      color: C.yellow,
      onClick: function onClick() {
        try {
          onConvertUnit(r.id, "lot");
        } catch (e) {
          window.alert(e.message);
        }
      }
    }, "\u2192 LOT"))));
  })))), splitSource && /*#__PURE__*/React.createElement(SplitLotModal, {
    source: rows.find(function (u) {
      return u.id === splitSource.id;
    }) || splitSource,
    onClose: function onClose() {
      return setSplitSource(null);
    },
    onConfirm: function onConfirm(remaining, destinations) {
      onSplitLot(splitSource.id, remaining, destinations);
      setSplitSource(null);
    }
  }), (splitHistory.length > 0 || visible.some(function (u) {
    var _u$quantityHistory;
    return (_u$quantityHistory = u.quantityHistory) === null || _u$quantityHistory === void 0 ? void 0 : _u$quantityHistory.length;
  })) && /*#__PURE__*/React.createElement("details", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      color: C.blue
    }
  }, "Historique des lots"), splitHistory.map(function (event) {
    return /*#__PURE__*/React.createElement("div", {
      key: event.id,
      style: {
        padding: "6px 0",
        borderBottom: "1px solid ".concat(C.border),
        fontSize: 12
      }
    }, event.dt, " - ", event.visa, " : ", event.sourceLot, " (", event.initialQty, ") \u2192 ", event.sourceLot, " (", event.remainingQty, ") + ", event.destinations.map(function (d) {
      return "".concat(d.lot, " (").concat(d.qty, ")");
    }).join(" + "));
  }), visible.flatMap(function (u) {
    return (u.quantityHistory || []).filter(function (e) {
      return !e.splitId;
    }).map(function (e) {
      return /*#__PURE__*/React.createElement("div", {
        key: "".concat(u.id, "-").concat(e.id),
        style: {
          padding: "6px 0",
          borderBottom: "1px solid ".concat(C.border),
          fontSize: 12
        }
      }, e.dt, " - ", e.visa, " : ", u.sn || u.lot, " - Qt\xE9 ", e.before || "non renseignée", " \u2192 ", e.after);
    });
  })));
};

// ─── Système de commentaires threadés ────────────────────────────────────
// comments = [{id, dt, visa, text, replyTo}]
var CommentBtn = function CommentBtn(_ref56) {
  var comments = _ref56.comments,
    onChange = _ref56.onChange,
    user = _ref56.user,
    _ref56$disabled = _ref56.disabled,
    disabled = _ref56$disabled === void 0 ? false : _ref56$disabled;
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    open = _React$useState2[0],
    setOpen = _React$useState2[1];
  var _React$useState3 = React.useState(""),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    draft = _React$useState4[0],
    setDraft = _React$useState4[1];
  var _React$useState5 = React.useState(null),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    replyTo = _React$useState6[0],
    setReplyTo = _React$useState6[1]; // {id, visa, text}
  var _React$useState7 = React.useState(null),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    editId = _React$useState8[0],
    setEditId = _React$useState8[1];
  var inputRef = React.useRef(null);
  var listRef = React.useRef(null);
  var list = comments || [];
  var count = list.length;
  var openModal = function openModal(e) {
    e.stopPropagation();
    setOpen(true);
  };
  var close = function close() {
    setOpen(false);
    setDraft("");
    setReplyTo(null);
    setEditId(null);
  };
  var post = function post() {
    if (disabled) return;
    if (!draft.trim()) return;
    if (editId) {
      onChange(list.map(function (c) {
        return c.id === editId && (c.visa === (user === null || user === void 0 ? void 0 : user.trigram) || isAdminManager(user)) ? _objectSpread(_objectSpread({}, c), {}, {
          text: draft.trim(),
          editedDT: nowDT()
        }) : c;
      }));
      setDraft("");
      setReplyTo(null);
      setEditId(null);
      return;
    }
    var c = {
      id: uid(),
      dt: nowDT(),
      visa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
      text: draft.trim(),
      replyTo: replyTo ? replyTo.id : null
    };
    onChange([].concat(_toConsumableArray(list), [c]));
    setDraft("");
    setReplyTo(null);
    setTimeout(function () {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 50);
  };
  var del = function del(id) {
    if (disabled) return;
    onChange(list.filter(function (c) {
      return c.id !== id || !(c.visa === (user === null || user === void 0 ? void 0 : user.trigram) || isAdminManager(user));
    }));
  };
  var startEdit = function startEdit(c) {
    if (disabled || !(c.visa === (user === null || user === void 0 ? void 0 : user.trigram) || isAdminManager(user))) return;
    setReplyTo(null);
    setEditId(c.id);
    setDraft(c.text || "");
    setTimeout(function () {
      var _inputRef$current;
      return (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
    }, 50);
  };
  var startReply = function startReply(c) {
    if (disabled) return;
    setEditId(null);
    setReplyTo(c);
    setTimeout(function () {
      var _inputRef$current2;
      return (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.focus();
    }, 50);
  };
  React.useEffect(function () {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    onClick: openModal,
    title: count ? "".concat(count, " commentaire").concat(count > 1 ? "s" : "") : "Ajouter un commentaire",
    style: {
      cursor: "pointer",
      fontSize: 15,
      opacity: count ? 1 : .35,
      userSelect: "none",
      position: "relative",
      display: "inline-block"
    }
  }, "\uD83D\uDCAC", count > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -5,
      right: -7,
      background: C.accent,
      color: "#fff",
      borderRadius: 10,
      fontSize: 8,
      fontWeight: 700,
      padding: "1px 4px",
      minWidth: 14,
      textAlign: "center",
      lineHeight: "14px"
    }
  }, count > 9 ? "9+" : count)), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) close();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 10,
      width: "100%",
      maxWidth: 560,
      maxHeight: "82vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "11px 16px",
      borderBottom: "1px solid ".concat(C.border),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: C.accent,
      fontSize: 13
    }
  }, "\uD83D\uDCAC Commentaires ", count > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontWeight: 400
    }
  }, "(", count, ")")), /*#__PURE__*/React.createElement("span", {
    onClick: close,
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 20,
      lineHeight: 1
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "12px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, list.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 32,
      fontSize: 12
    }
  }, "Aucun commentaire \u2014 soyez le premier !"), list.map(function (c) {
    var parent = c.replyTo ? list.find(function (x) {
      return x.id === c.replyTo;
    }) : null;
    var isOwn = c.visa === (user === null || user === void 0 ? void 0 : user.trigram);
    var canManage = isOwn || isAdminManager(user);
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: isOwn ? "flex-end" : "flex-start"
      }
    }, parent && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#0d111780",
        border: "1px solid ".concat(C.border),
        borderRadius: 4,
        padding: "3px 10px",
        fontSize: 10,
        color: C.muted,
        maxWidth: "80%",
        borderLeft: "3px solid ".concat(C.blue)
      }
    }, "\u21A9 ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: C.blue
      }
    }, parent.visa), " : ", parent.text.slice(0, 60), parent.text.length > 60 ? "…" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        background: isOwn ? C.accent + "22" : C.raised,
        border: "1px solid ".concat(isOwn ? C.accent + "66" : C.border),
        borderRadius: isOwn ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        padding: "8px 12px",
        maxWidth: "80%",
        borderLeft: isOwn ? undefined : "3px solid ".concat(C.blue)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 11,
        color: isOwn ? C.accent : C.blue
      }
    }, c.visa), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 9,
        color: C.muted
      }
    }, c.dt), c.editedDT && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 8,
        color: C.muted
      }
    }, "modifi\xE9 ", c.editedDT)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: C.text,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
      }
    }, c.text)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        paddingLeft: 6,
        paddingRight: 6
      }
    }, !disabled && /*#__PURE__*/React.createElement("span", {
      onClick: function onClick() {
        return startReply(c);
      },
      style: {
        cursor: "pointer",
        color: C.muted,
        fontSize: 10,
        display: "flex",
        alignItems: "center",
        gap: 3
      }
    }, "\u21A9 R\xE9pondre"), canManage && !disabled && /*#__PURE__*/React.createElement("span", {
      onClick: function onClick() {
        return startEdit(c);
      },
      style: {
        cursor: "pointer",
        color: C.blue,
        fontSize: 10
      }
    }, "\u270E \xC9diter"), canManage && !disabled && /*#__PURE__*/React.createElement("span", {
      onClick: function onClick() {
        return del(c.id);
      },
      style: {
        cursor: "pointer",
        color: "#da3633",
        fontSize: 10
      }
    }, "\uD83D\uDDD1\uFE0F Supprimer")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid ".concat(C.border),
      padding: "10px 14px",
      flexShrink: 0,
      background: C.input
    }
  }, replyTo && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: C.raised,
      borderLeft: "3px solid ".concat(C.blue),
      borderRadius: 4,
      padding: "4px 10px",
      marginBottom: 8,
      fontSize: 10,
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u21A9 R\xE9ponse \xE0 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.blue
    }
  }, replyTo.visa), " : ", replyTo.text.slice(0, 50), replyTo.text.length > 50 ? "…" : ""), /*#__PURE__*/React.createElement("span", {
    onClick: function onClick() {
      return setReplyTo(null);
    },
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 14,
      marginLeft: 8
    }
  }, "\xD7")), editId && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: C.blue + "18",
      borderLeft: "3px solid ".concat(C.blue),
      borderRadius: 4,
      padding: "4px 10px",
      marginBottom: 8,
      fontSize: 10,
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u270E Modification de votre remarque"), /*#__PURE__*/React.createElement("span", {
    onClick: function onClick() {
      setEditId(null);
      setDraft("");
    },
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 14,
      marginLeft: 8
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: inputRef,
    value: draft,
    onChange: function onChange(e) {
      return setDraft(e.target.value);
    },
    readOnly: disabled,
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) post();
    },
    placeholder: disabled ? "Lecture seule" : editId ? "Modifier votre remarque…" : replyTo ? "Votre réponse…" : "Nouvelle remarque… (Ctrl+↵ pour envoyer)",
    rows: 2,
    style: {
      width: "100%",
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      color: C.text,
      fontSize: 12,
      fontFamily: "system-ui",
      padding: "8px 10px",
      resize: "none",
      outline: "none",
      boxSizing: "border-box",
      lineHeight: 1.5
    }
  })), /*#__PURE__*/React.createElement(Btn, {
    onClick: post,
    color: C.accent,
    small: true,
    disabled: disabled || !draft.trim()
  }, editId ? "✓ Modifier" : replyTo ? "↩ Répondre" : "💬 Envoyer")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginTop: 4
    }
  }, "Ctrl+\u21B5 pour envoyer rapidement")))));
};

// ─── 1. Adjust / Rework — auto-visa Opér. ──────────────────────────────────
var ACTIONS = ["S", "D", "P", "M", "R"];
var ACTION_LABELS = {
  S: "Soudé",
  D: "Désoudé",
  P: "Pointé",
  M: "Matière",
  R: "Rework"
};
var REWORK_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "repere",
  label: "Repère TOPO"
}, {
  key: "action1",
  label: "Action"
}, {
  key: "isAdjust",
  label: "Adjust"
}, {
  key: "qty",
  label: "QTÉ"
}, {
  key: "codeERP",
  label: "Code article"
}, {
  key: "valeur",
  label: "Valeur"
}, {
  key: "lot",
  label: "LOT"
}, {
  key: "dc",
  label: "DC"
}, {
  key: "sn",
  label: "SN"
}, {
  key: "fiche",
  label: "Fiche suiveuse"
}, {
  key: "etape",
  label: "OP"
}];
var parseActivityDate = function parseActivityDate(raw) {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  var value = String(raw || "").trim();
  if (!value) return null;
  var local = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (local) {
    var d = new Date(Number(local[3]), Number(local[2]) - 1, Number(local[1]), Number(local[4] || 0), Number(local[5] || 0));
    if (d.getFullYear() === Number(local[3]) && d.getMonth() === Number(local[2]) - 1 && d.getDate() === Number(local[1])) return d;
    return null;
  }
  var parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
var currentYYWW = function currentYYWW(referenceDate) {
  var d = parseActivityDate(referenceDate) || new Date();
  var utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  var day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  var yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  var week = Math.ceil(((utc - yearStart) / 86400000 + 1) / 7);
  return utc.getUTCFullYear() % 100 * 100 + week;
};
var dcCheck = function dcCheck(raw, referenceDate) {
  var value = String(raw || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!value) return null;
  if (value === "N/A" || value === "NA") return {
    ok: true,
    na: true,
    label: "N/A"
  };
  var m = value.match(/^(\d{2})(\d{2})(?:R(\d+))?$/);
  if (!m) return {
    ok: false,
    label: "DC invalide"
  };
  var base = Number(m[1]) * 100 + Number(m[2]);
  var week = Number(m[2]);
  var relief = Number(m[3] || 0);
  if (week < 1 || week > 53) return {
    ok: false,
    label: "Semaine DC invalide"
  };
  var max = base - (relief ? 300 : 0) + 700 + relief * 400;
  var limit = currentYYWW(referenceDate);
  return {
    ok: max >= limit,
    max: max,
    limit: limit,
    label: max >= limit ? "OK jusqu'\xE0 ".concat(String(max).padStart(4, "0")) : "Hors date depuis ".concat(String(max).padStart(4, "0"))
  };
};
var missingReworkTrace = function missingReworkTrace(row) {
  var includePointed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (includePointed ? ["S", "P", "M"] : ["S", "M"]).includes(row === null || row === void 0 ? void 0 : row.action1) ? [{
    key: "lot",
    label: "LOT"
  }, {
    key: "dc",
    label: "DC"
  }].filter(function (f) {
    return !String(row[f.key] || "").trim();
  }).map(function (f) {
    return f.label;
  }) : [];
};
var buildMaterialRequest = function buildMaterialRequest(_ref57) {
  var header = _ref57.header,
    rows = _ref57.rows,
    user = _ref57.user;
  var units = snRowsFromHeader(header);
  var requested = rows.filter(function (r) {
    return !r.deleted && ["S", "M"].includes(r.action1) && (!units.length || units.some(function (u) {
      return rowMatchesSn(r, u, units);
    }));
  });
  var concerned = units.filter(function (u) {
    return requested.some(function (r) {
      return rowMatchesSn(r, u, units);
    });
  });
  var materialLine = function materialLine(r, i) {
    var fields = ["".concat(i + 1, ". Rep\xE8re TOPO : ").concat(r.repere || "Non renseigné"), "Qt\xE9 : ".concat(r.qty || "Non renseignée"), "Code article : ".concat(compactArticleCode(r.codeERP) || "Non renseigné"), "Valeur : ".concat(r.valeur || "Non renseignée")];
    var available = function available(value) {
      var text = String(value || "").trim();
      return text && !["N/A", "NA", "-"].includes(text.toUpperCase()) ? text : "";
    };
    var lot = available(r.lot),
      dc = available(r.dc);
    if (lot) fields.push("Lot pr\xE9f\xE9rentiel : ".concat(lot));
    if (dc && !lot) fields.push("Lot selon disponibilité");
    if (dc && !lot) fields.push("DC min : ".concat(dc));
    if (!lot && !dc) fields.push("LOT / DC : Selon disponibilité");
    return fields.join(" | ");
  };
  var groups = concerned.length ? concerned.map(function (u) {
    return {
      label: snTitle(u),
      rows: requested.filter(function (r) {
        return rowMatchesSn(r, u, units);
      })
    };
  }) : [{
    label: header.sn || header.lot || "Non renseigné",
    rows: requested
  }];
  var lines = groups.flatMap(function (group) {
    return ["Demande pour SN / LOT : ".concat(group.label)].concat(_toConsumableArray(group.rows.map(materialLine)), [""]);
  });
  return {
    subject: "Demande mati\xE8re - OF ".concat(header.of || "Non renseigné"),
    body: ["Bonjour,", "", "Merci de préparer les matières suivantes :", "", "OF : ".concat(header.of || "Non renseigné"), "Article OF : ".concat(compactArticleCode(header.codeArticle) || "Non renseigné", " - ").concat(header.description || ""), "SN / LOT concern\xE9s : ".concat(concerned.map(snTitle).join(", ") || header.sn || header.lot || "Non renseigné"), "OTP : ".concat(header.otp || header.projet || "Non renseigné"), ""].concat(_toConsumableArray(lines), ["", "Merci,", [user.prenom, user.nom].filter(Boolean).join(" ") || user.trigram, user.trigram]).join("\n")
  };
};
var materialCcRequired = function materialCcRequired(user) {
  return !isAdminManager(user);
};
var selectedManagerEmails = function selectedManagerEmails(managers, copyTo) {
  return _toConsumableArray(new Set(managers.filter(function (manager) {
    return copyTo.includes(manager.trigram) && manager.email;
  }).map(function (manager) {
    return manager.email;
  })));
};
var useUserAccounts = function useUserAccounts() {
  var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var _useState59 = useState([]),
    _useState60 = _slicedToArray(_useState59, 2),
    accounts = _useState60[0],
    setAccounts = _useState60[1];
  var _useState61 = useState(""),
    _useState62 = _slicedToArray(_useState61, 2),
    error = _useState62[0],
    setError = _useState62[1];
  useEffect(function () {
    if (!enabled) {
      setAccounts([]);
      setError("");
      return;
    }
    var active = true;
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var index, loaded;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.n = 1;
            return getUserIndex();
          case 1:
            index = _context4.v;
            _context4.n = 2;
            return Promise.all(index.map(/*#__PURE__*/function () {
              var _ref59 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(trigram) {
                var result;
                return _regenerator().w(function (_context3) {
                  while (1) switch (_context3.n) {
                    case 0:
                      _context3.n = 1;
                      return window.storage.get("user:".concat(trigram), true);
                    case 1:
                      result = _context3.v;
                      return _context3.a(2, result ? JSON.parse(result.value) : null);
                  }
                }, _callee3);
              }));
              return function (_x2) {
                return _ref59.apply(this, arguments);
              };
            }()));
          case 2:
            loaded = _context4.v;
            if (active) setAccounts(loaded.filter(Boolean).sort(function (a, b) {
              return a.trigram.localeCompare(b.trigram);
            }));
          case 3:
            return _context4.a(2);
        }
      }, _callee4);
    }))()["catch"](function () {
      if (active) setError("Impossible de charger les utilisateurs");
    });
    return function () {
      active = false;
    };
  }, [enabled]);
  return {
    accounts: accounts,
    error: error
  };
};
var useCcManagers = function useCcManagers() {
  var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var _useUserAccounts = useUserAccounts(enabled),
    accounts = _useUserAccounts.accounts,
    error = _useUserAccounts.error;
  return {
    managers: accounts.filter(function (account) {
      return normalizeRole(account) === "Manager";
    }),
    error: error
  };
};
var ManagerCcPicker = function ManagerCcPicker(_ref60) {
  var managers = _ref60.managers,
    copyTo = _ref60.copyTo,
    _onChange4 = _ref60.onChange,
    _ref60$required = _ref60.required,
    required = _ref60$required === void 0 ? false : _ref60$required,
    _ref60$error = _ref60.error,
    error = _ref60$error === void 0 ? "" : _ref60$error,
    _ref60$legend = _ref60.legend,
    legend = _ref60$legend === void 0 ? "CC manager" : _ref60$legend,
    _ref60$mode = _ref60.mode,
    mode = _ref60$mode === void 0 ? "cc" : _ref60$mode;
  var usable = managers.filter(function (manager) {
    return manager.email;
  });
  return /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: "1px solid ".concat(required && !selectedManagerEmails(managers, copyTo).length ? C.yellow : C.border),
      borderRadius: 4,
      margin: "0 0 10px",
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      fontSize: 12
    }
  }, legend, required ? " (obligatoire)" : " (facultatif)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, managers.map(function (manager) {
    var name = [manager.prenom, manager.nom].filter(Boolean).join(" ") || manager.trigram;
    var selected = copyTo.includes(manager.trigram);
    return /*#__PURE__*/React.createElement("label", {
      key: manager.trigram,
      title: "".concat(name).concat(manager.email ? " - ".concat(manager.email) : " - E-mail manquant"),
      style: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        cursor: manager.email ? "pointer" : "not-allowed"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "aria-label": mode === "to" ? "Ajouter ".concat(manager.trigram, " aux destinataires") : "Mettre ".concat(manager.trigram, " en copie"),
      disabled: !manager.email,
      checked: selected,
      onChange: function onChange(event) {
        return _onChange4(function (ids) {
          return event.target.checked ? [].concat(_toConsumableArray(ids), [manager.trigram]) : ids.filter(function (id) {
            return id !== manager.trigram;
          });
        });
      },
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        opacity: 0,
        cursor: manager.email ? "pointer" : "not-allowed"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800,
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 4,
        border: "1px solid ".concat(selected ? C.blue : C.border),
        background: selected ? C.blue + "20" : C.input,
        color: manager.email ? selected ? C.blue : C.text : C.muted,
        opacity: manager.email ? 1 : .55,
        pointerEvents: "none"
      }
    }, manager.trigram));
  }), !managers.length && !error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.muted
    }
  }, "Aucun utilisateur correspondant")), required && !usable.length && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      fontSize: 11,
      color: C.red,
      marginTop: 6
    }
  }, "Aucun utilisateur correspondant avec une adresse e-mail n\u2019est disponible."), required && usable.length > 0 && !selectedManagerEmails(managers, copyTo).length && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.yellow,
      marginTop: 6
    }
  }, "S\xE9lectionnez au moins un trigramme ", mode === "to" ? "destinataire" : "en copie", "."), error && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      fontSize: 11,
      color: C.red,
      marginTop: 6
    }
  }, error));
};
var MaterialRequestModal = function MaterialRequestModal(_ref61) {
  var header = _ref61.header,
    rows = _ref61.rows,
    user = _ref61.user,
    onClose = _ref61.onClose;
  var _useState63 = useState(function () {
      return buildMaterialRequest({
        header: header,
        rows: rows,
        user: user
      });
    }),
    _useState64 = _slicedToArray(_useState63, 2),
    draft = _useState64[0],
    setDraft = _useState64[1];
  var _useState65 = useState("logistique.ch@safran-timing.safrangroup.com"),
    _useState66 = _slicedToArray(_useState65, 2),
    recipient = _useState66[0],
    setRecipient = _useState66[1];
  var _useState67 = useState([]),
    _useState68 = _slicedToArray(_useState67, 2),
    copyTo = _useState68[0],
    setCopyTo = _useState68[1];
  var _useCcManagers = useCcManagers(),
    managers = _useCcManagers.managers,
    ccError = _useCcManagers.error;
  var ccRequired = materialCcRequired(user);
  var ccEmails = selectedManagerEmails(managers, copyTo);
  var _useState69 = useState(""),
    _useState70 = _slicedToArray(_useState69, 2),
    message = _useState70[0],
    setMessage = _useState70[1];
  var copy = /*#__PURE__*/function () {
    var _copy = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var text, _navigator$clipboard2, area, _t2;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            text = "Objet : ".concat(draft.subject, "\n\n").concat(draft.body);
            _context5.p = 1;
            if (!((_navigator$clipboard2 = navigator.clipboard) !== null && _navigator$clipboard2 !== void 0 && _navigator$clipboard2.writeText)) {
              _context5.n = 3;
              break;
            }
            _context5.n = 2;
            return navigator.clipboard.writeText(text);
          case 2:
            _context5.n = 4;
            break;
          case 3:
            throw new Error("Clipboard unavailable");
          case 4:
            setMessage("Brouillon copié");
            _context5.n = 6;
            break;
          case 5:
            _context5.p = 5;
            _t2 = _context5.v;
            area = document.createElement("textarea");
            area.value = text;
            area.style.position = "fixed";
            area.style.opacity = "0";
            document.body.appendChild(area);
            area.select();
            try {
              setMessage(document.execCommand("copy") ? "Brouillon copié" : "Copie impossible");
            } finally {
              document.body.removeChild(area);
            }
          case 6:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 5]]);
    }));
    function copy() {
      return _copy.apply(this, arguments);
    }
    return copy;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 330,
      background: "#000000aa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "material-request-title",
    style: {
      width: 850,
      maxWidth: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      background: C.surface,
      color: C.text,
      border: "1px solid ".concat(C.blue),
      borderRadius: 6,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    id: "material-request-title",
    style: {
      margin: 0,
      fontSize: 16
    }
  }, "Demande mati\xE8re - Logistique"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Fermer",
    title: "Fermer",
    onClick: onClose,
    style: {
      border: 0,
      background: "transparent",
      color: C.muted,
      fontSize: 20,
      cursor: "pointer"
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 10,
      fontSize: 12
    }
  }, "Destinataire", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Destinataire",
    value: recipient,
    onChange: function onChange(e) {
      return setRecipient(e.target.value);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement(ManagerCcPicker, {
    managers: managers,
    copyTo: copyTo,
    onChange: setCopyTo,
    required: ccRequired,
    error: ccError
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 10,
      fontSize: 12
    }
  }, "Objet", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Objet",
    value: draft.subject,
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          subject: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: 12
    }
  }, "Message", /*#__PURE__*/React.createElement("textarea", {
    "aria-label": "Message",
    value: draft.body,
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          body: e.target.value
        });
      });
    },
    style: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      height: 320,
      maxHeight: "55vh",
      resize: "vertical",
      padding: 10,
      fontFamily: "monospace",
      fontSize: 13,
      lineHeight: 1.5,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "status",
    style: {
      fontSize: 12,
      color: message.startsWith("Statut non modifié") ? C.red : C.green
    }
  }, message), /*#__PURE__*/React.createElement(Btn, {
    onClick: onClose,
    color: C.border,
    small: true
  }, "Fermer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: copy,
    color: C.border,
    small: true
  }, "Copier le brouillon"), /*#__PURE__*/React.createElement(Btn, {
    disabled: !draft.subject.trim() || !draft.body.trim() || ccRequired && !ccEmails.length,
    onClick: function onClick() {
      window.location.href = "mailto:".concat(encodeURIComponent(recipient.trim()), "?cc=").concat(encodeURIComponent(ccEmails.join(",")), "&subject=").concat(encodeURIComponent(draft.subject), "&body=").concat(encodeURIComponent(draft.body));
    },
    color: C.blue,
    small: true
  }, "Ouvrir la messagerie"))));
};
var latestSharedFicheOp = function latestSharedFicheOp(data, header) {
  var _header$_entrySnIds, _data$rework, _data$consommables, _candidates$map$sort$;
  var active = (header === null || header === void 0 || (_header$_entrySnIds = header._entrySnIds) === null || _header$_entrySnIds === void 0 ? void 0 : _header$_entrySnIds[0]) || workSnFilter(header);
  var timestamp = function timestamp(row) {
    if (Number(row.ficheOpUpdatedAt) > 0) return Number(row.ficheOpUpdatedAt);
    var match = String(row.createdDT || "").match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
    return match ? new Date(+match[3], +match[2] - 1, +match[1], +match[4], +match[5], +(match[6] || 0)).getTime() : 0;
  };
  var candidates = [].concat(_toConsumableArray(((data === null || data === void 0 || (_data$rework = data.rework) === null || _data$rework === void 0 ? void 0 : _data$rework.rows) || []).map(function (row) {
    return _objectSpread(_objectSpread({}, row), {}, {
      op: row.etape
    });
  })), _toConsumableArray(((data === null || data === void 0 || (_data$consommables = data.consommables) === null || _data$consommables === void 0 ? void 0 : _data$consommables.ops) || []).filter(function (row) {
    var _row$items;
    return !((_row$items = row.items) !== null && _row$items !== void 0 && _row$items.length) || row.items.some(function (item) {
      return !item.deleted;
    });
  }))).filter(function (row) {
    return !row.deleted && String(row.fiche || "").trim() && String(row.op || "").trim() && _rowMatchesSnFilter(row, active, header);
  });
  var latest = (_candidates$map$sort$ = candidates.map(function (row, index) {
    return {
      row: row,
      index: index,
      time: timestamp(row)
    };
  }).sort(function (a, b) {
    return b.time - a.time || b.index - a.index;
  })[0]) === null || _candidates$map$sort$ === void 0 ? void 0 : _candidates$map$sort$.row;
  return {
    fiche: (latest === null || latest === void 0 ? void 0 : latest.fiche) || "",
    op: (latest === null || latest === void 0 ? void 0 : latest.op) || ""
  };
};
var copyReworkToUnit = function copyReworkToUnit(row, user, unit) {
  var includeChecks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var copyMode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "new";
  var copyOrigin = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var sameOperation = copyMode === "same";
  var effectiveChecks = sameOperation || includeChecks;
  if (!canWriteData(user)) throw new Error("Accès en écriture requis");
  if (includeChecks && !sameOperation && (!canControlRework(user) || !canTraceability(user))) throw new Error("Droits CTRL et TRA requis");
  if (includeChecks && !sameOperation && row.visaCtrl === user.trigram && !isAdminManager(user)) throw new Error("Autocontrôle interdit");
  var fields = ["repere", "qty", "action1", "codeERP", "valeur", "lot", "dc", "sn", "fiche", "etape", "isAdjust"];
  var copied = duplicateRow({}, user, _objectSpread(_objectSpread({}, Object.fromEntries(fields.map(function (key) {
    var _row$key;
    return [key, (_row$key = row[key]) !== null && _row$key !== void 0 ? _row$key : key === "isAdjust" ? false : ""];
  }))), {}, {
    snScope: "custom",
    snIds: [unit.id],
    unitId: unit.id,
    snExcludeIds: [],
    comments: [],
    validated: true,
    visaOper: user.trigram,
    dateOper: now(),
    sortieVisa: "",
    remarques: "",
    copyOrigin: copyOrigin,
    visaCtrl: effectiveChecks ? row.visaCtrl || "" : "",
    dateCtrl: effectiveChecks ? row.dateCtrl || "" : "",
    tracaOk: effectiveChecks ? !!row.tracaOk : false,
    visaTraca: effectiveChecks ? row.visaTraca || "" : "",
    dateTraca: effectiveChecks ? row.dateTraca || "" : ""
  }));
  if (sameOperation) Object.assign(copied, {
    createdVisa: row.createdVisa || user.trigram,
    createdDT: row.createdDT || nowDT(),
    visaOper: row.visaOper || row.createdVisa || user.trigram,
    dateOper: row.dateOper || row.createdDT || now()
  });
  return copied;
};
var normalizeCopySearch = function normalizeCopySearch(value) {
  return String(value !== null && value !== void 0 ? value : "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
};
var copyTableLineToUnit = function copyTableLineToUnit(tab, row, user, unit) {
  var includeChecks = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var copyMode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "new";
  var reuseSample = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var copyOrigin = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  var sameOperation = copyMode === "same";
  var effectiveChecks = sameOperation || includeChecks;
  if (tab === "rework") return copyReworkToUnit(row, user, unit, includeChecks, copyMode, copyOrigin);
  if (!canWriteData(user)) throw new Error("Accès en écriture requis");
  if (includeChecks && !sameOperation && (!canControlRework(user) || !canTraceability(user))) throw new Error("Droits CTRL et TRA requis");
  var fields = {
    consommables: ["fiche", "op"],
    testequip: ["isFour", "nInv", "type", "designation", "dateExpiration"],
    faits: ["type", "numero", "lien"],
    etuvage: ["fourN", "duree", "temp"],
    openwork: ["description"],
    demating: ["nConect"]
  }[tab];
  if (!fields) throw new Error("Tableau non pris en charge");
  var scope = {
    snScope: "custom",
    snIds: [unit.id],
    unitId: unit.id,
    snExcludeIds: [],
    comments: []
  };
  var copied = duplicateRow({}, user, _objectSpread(_objectSpread(_objectSpread({}, Object.fromEntries(fields.map(function (key) {
    var _row$key2;
    return [key, (_row$key2 = row[key]) !== null && _row$key2 !== void 0 ? _row$key2 : ""];
  }))), scope), {}, {
    validated: true,
    copyOrigin: copyOrigin
  }));
  if (tab === "consommables") copied.items = (row.items || []).map(function (item) {
    return duplicateRow({}, user, _objectSpread(_objectSpread({}, Object.fromEntries(["consoId", "lot", "dp"].map(function (key) {
      return [key, item[key] || ""];
    }))), {}, {
      echantillon: sameOperation || reuseSample ? item.echantillon || "" : "",
      comments: [],
      copyOrigin: copyOrigin,
      validated: true,
      tracaOk: effectiveChecks ? !!item.tracaOk : false,
      visaTraca: effectiveChecks ? item.visaTraca || "" : "",
      dateTraca: effectiveChecks ? item.dateTraca || "" : ""
    }));
  });
  if (sameOperation) {
    Object.assign(copied, {
      createdVisa: row.createdVisa || user.trigram,
      createdDT: row.createdDT || nowDT()
    });
    if (tab === "consommables") copied.items = copied.items.map(function (item, index) {
      var _row$items2, _row$items3;
      return _objectSpread(_objectSpread({}, item), {}, {
        createdVisa: ((_row$items2 = row.items) === null || _row$items2 === void 0 || (_row$items2 = _row$items2[index]) === null || _row$items2 === void 0 ? void 0 : _row$items2.createdVisa) || row.createdVisa || user.trigram,
        createdDT: ((_row$items3 = row.items) === null || _row$items3 === void 0 || (_row$items3 = _row$items3[index]) === null || _row$items3 === void 0 ? void 0 : _row$items3.createdDT) || row.createdDT || nowDT()
      });
    });
  }
  if (tab === "testequip") Object.assign(copied, {
    visa: sameOperation ? row.visa || row.createdVisa || user.trigram : user.trigram,
    checkDate: sameOperation ? row.checkDate || now() : now()
  });
  if (tab === "faits") Object.assign(copied, {
    visa: sameOperation ? row.visa || row.createdVisa || user.trigram : user.trigram,
    date: sameOperation ? row.date || now() : now(),
    closedVisa: sameOperation ? row.closedVisa || "" : "",
    closedDate: sameOperation ? row.closedDate || "" : ""
  });
  if (tab === "etuvage") Object.assign(copied, {
    entreeVisa: sameOperation ? row.entreeVisa || "" : "",
    entreeDT: sameOperation ? row.entreeDT || "" : "",
    sortieVisa: sameOperation ? row.sortieVisa || "" : "",
    sortieDT: sameOperation ? row.sortieDT || "" : "",
    comments: sameOperation ? (row.comments || []).map(function (comment) {
      return _objectSpread(_objectSpread({}, comment), {}, {
        id: uid()
      });
    }) : []
  });
  if (tab === "openwork") Object.assign(copied, {
    openVisa: sameOperation ? row.openVisa || row.createdVisa || user.trigram : user.trigram,
    openDate: sameOperation ? row.openDate || now() : now(),
    closedVisa: sameOperation ? row.closedVisa || "" : "",
    closedDate: sameOperation ? row.closedDate || "" : ""
  });
  if (tab === "demating") Object.assign(copied, {
    validated: true,
    events: sameOperation ? (row.events || []).map(function (event) {
      return _objectSpread(_objectSpread({}, event), {}, {
        id: uid()
      });
    }) : [],
    connError: ""
  });
  return copied;
};
var copySourceKey = function copySourceKey(tab, row) {
  var _row$items4;
  return (row === null || row === void 0 ? void 0 : row._copyKey) || (tab === "consommables" && row !== null && row !== void 0 && (_row$items4 = row.items) !== null && _row$items4 !== void 0 && (_row$items4 = _row$items4[0]) !== null && _row$items4 !== void 0 && _row$items4.id ? "consommables:".concat(row.id, ":").concat(row.items[0].id) : "".concat(tab, ":").concat((row === null || row === void 0 ? void 0 : row.id) || ""));
};
var copySourceLabel = function copySourceLabel(tab, row) {
  var _row$items5, _row$items6;
  return ({
    rework: [row.repere, row.action1, row.codeERP, row.valeur],
    consommables: [row.fiche, row.op, (_row$items5 = row.items) === null || _row$items5 === void 0 || (_row$items5 = _row$items5[0]) === null || _row$items5 === void 0 ? void 0 : _row$items5.consoId, (_row$items6 = row.items) === null || _row$items6 === void 0 || (_row$items6 = _row$items6[0]) === null || _row$items6 === void 0 ? void 0 : _row$items6.lot],
    testequip: [row.nInv, row.type, row.designation],
    faits: [row.type, row.numero],
    etuvage: [row.fourN, row.duree && "".concat(row.duree, " h"), row.temp && "".concat(row.temp, " \xB0C")],
    openwork: [row.nOW, row.description],
    demating: [row.nConect]
  }[tab] || [row.repere, row.numero, row.description]).filter(Boolean).join(" · ") || "Ligne";
};
var copySourcesForTab = function copySourcesForTab(tab, data, header) {
  var _data$consommables2, _data$demating2, _data$tab2;
  var filter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "all";
  if (!data) return [];
  if (tab === "consommables") return (((_data$consommables2 = data.consommables) === null || _data$consommables2 === void 0 ? void 0 : _data$consommables2.ops) || []).flatMap(function (op) {
    return op.deleted ? [] : (op.items || []).filter(function (item) {
      return !item.deleted;
    }).map(function (item) {
      return _objectSpread(_objectSpread({}, op), {}, {
        items: [item],
        _copyKey: "consommables:".concat(op.id, ":").concat(item.id)
      });
    });
  }).filter(function (row) {
    return _rowMatchesSnFilter(row, filter, header);
  });
  var collection = tab === "demating" ? (_data$demating2 = data.demating) === null || _data$demating2 === void 0 ? void 0 : _data$demating2.connectors : (_data$tab2 = data[tab]) === null || _data$tab2 === void 0 ? void 0 : _data$tab2.rows;
  return (collection || []).filter(function (row) {
    return !row.deleted && _rowMatchesSnFilter(row, filter, header);
  }).map(function (row) {
    return _objectSpread(_objectSpread({}, row), {}, {
      _copyKey: "".concat(tab, ":").concat(row.id)
    });
  });
};
var CopyReworkModal = function CopyReworkModal(_ref62) {
  var row = _ref62.row,
    _ref62$sourceRows = _ref62.sourceRows,
    sourceRows = _ref62$sourceRows === void 0 ? [] : _ref62$sourceRows,
    ofList = _ref62.ofList,
    user = _ref62.user,
    onCopy = _ref62.onCopy,
    onClose = _ref62.onClose,
    busy = _ref62.busy,
    sourceOfId = _ref62.sourceOfId,
    sourceHeader = _ref62.sourceHeader,
    defaultUnitIds = _ref62.defaultUnitIds,
    _ref62$tab = _ref62.tab,
    tab = _ref62$tab === void 0 ? "rework" : _ref62$tab;
  var _useState71 = useState([]),
    _useState72 = _slicedToArray(_useState71, 2),
    targets = _useState72[0],
    setTargets = _useState72[1];
  var _useState73 = useState([]),
    _useState74 = _slicedToArray(_useState73, 2),
    selected = _useState74[0],
    setSelected = _useState74[1];
  var _useState75 = useState(function () {
      return [copySourceKey(tab, row)];
    }),
    _useState76 = _slicedToArray(_useState75, 2),
    selectedSources = _useState76[0],
    setSelectedSources = _useState76[1];
  var _useState77 = useState(""),
    _useState78 = _slicedToArray(_useState77, 2),
    search = _useState78[0],
    setSearch = _useState78[1];
  var _useState79 = useState(false),
    _useState80 = _slicedToArray(_useState79, 2),
    includeChecks = _useState80[0],
    setIncludeChecks = _useState80[1];
  var _useState81 = useState(function () {
      return tab === "etuvage" ? "same" : "new";
    }),
    _useState82 = _slicedToArray(_useState81, 2),
    copyMode = _useState82[0],
    setCopyMode = _useState82[1];
  var _useState83 = useState(false),
    _useState84 = _slicedToArray(_useState83, 2),
    reuseSample = _useState84[0],
    setReuseSample = _useState84[1];
  var _useState85 = useState(true),
    _useState86 = _slicedToArray(_useState85, 2),
    loading = _useState86[0],
    setLoading = _useState86[1];
  var _useState87 = useState(false),
    _useState88 = _slicedToArray(_useState87, 2),
    running = _useState88[0],
    setRunning = _useState88[1];
  var _useState89 = useState(""),
    _useState90 = _slicedToArray(_useState89, 2),
    message = _useState90[0],
    setMessage = _useState90[1];
  var _useState91 = useState([]),
    _useState92 = _slicedToArray(_useState91, 2),
    completed = _useState92[0],
    setCompleted = _useState92[1];
  var checksAllowed = canControlRework(user) && canTraceability(user);
  var availableSources = sourceRows.length ? sourceRows : [row];
  var chosenSources = availableSources.filter(function (source) {
    return selectedSources.includes(copySourceKey(tab, source));
  });
  var sourceUnits = snRowsFromHeader(sourceHeader);
  var sourceUnitLabels = sourceUnits.filter(function (unit) {
    return chosenSources.some(function (source) {
      return rowMatchesSn(source, unit, sourceUnits);
    });
  }).map(snTitle);
  var sourceUnitText = sourceUnitLabels.join(" + ") || (sourceHeader === null || sourceHeader === void 0 ? void 0 : sourceHeader.sn) || (sourceHeader === null || sourceHeader === void 0 ? void 0 : sourceHeader.lot) || "Non renseigné";
  useEffect(function () {
    var active = true;
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var results, destinations, failed;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            _context7.n = 1;
            return Promise.all(ofList.filter(function (entry) {
              return !entry.deleted;
            }).map(/*#__PURE__*/function () {
              var _ref64 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(entry) {
                var _data$header2, record, data, _destinations, _iterator, _step, unit, _t3;
                return _regenerator().w(function (_context6) {
                  while (1) switch (_context6.p = _context6.n) {
                    case 0:
                      _context6.p = 0;
                      _context6.n = 1;
                      return window.storage.get("of:".concat(entry.id), true);
                    case 1:
                      record = _context6.v;
                      if (record) {
                        _context6.n = 2;
                        break;
                      }
                      return _context6.a(2, {
                        destinations: [],
                        failed: 0
                      });
                    case 2:
                      data = withUnitMetadata(JSON.parse(record.value));
                      if (!((_data$header2 = data.header) !== null && _data$header2 !== void 0 && _data$header2.deleted)) {
                        _context6.n = 3;
                        break;
                      }
                      return _context6.a(2, {
                        destinations: [],
                        failed: 0
                      });
                    case 3:
                      _destinations = [];
                      _iterator = _createForOfIteratorHelper(data.units.rows.filter(function (u) {
                        return !u.deleted && hasUnitIdentity(u);
                      }));
                      try {
                        for (_iterator.s(); !(_step = _iterator.n()).done;) {
                          unit = _step.value;
                          _destinations.push({
                            key: JSON.stringify([entry.id, unit.id]),
                            ofId: entry.id,
                            unitId: unit.id,
                            of: data.header.of || entry.of,
                            label: snTitle(unit),
                            sn: unit.sn || "",
                            lot: unit.lot || "",
                            article: data.header.codeArticle || "",
                            description: data.header.description || ""
                          });
                        }
                      } catch (err) {
                        _iterator.e(err);
                      } finally {
                        _iterator.f();
                      }
                      return _context6.a(2, {
                        destinations: _destinations,
                        failed: 0
                      });
                    case 4:
                      _context6.p = 4;
                      _t3 = _context6.v;
                      return _context6.a(2, {
                        destinations: [],
                        failed: 1
                      });
                  }
                }, _callee6, null, [[0, 4]]);
              }));
              return function (_x3) {
                return _ref64.apply(this, arguments);
              };
            }()));
          case 1:
            results = _context7.v;
            destinations = results.flatMap(function (result) {
              return result.destinations;
            });
            failed = results.reduce(function (sum, result) {
              return sum + result.failed;
            }, 0);
            if (active) {
              destinations.sort(function (a, b) {
                return Number(b.ofId === sourceOfId && defaultUnitIds.includes(b.unitId)) - Number(a.ofId === sourceOfId && defaultUnitIds.includes(a.unitId)) || Number(b.ofId === sourceOfId) - Number(a.ofId === sourceOfId) || String(a.of).localeCompare(String(b.of), undefined, {
                  numeric: true
                }) || a.label.localeCompare(b.label, undefined, {
                  numeric: true
                });
              });
              setTargets(destinations);
              setSelected([]);
              setLoading(false);
              if (failed) setMessage("".concat(failed, " OF non charg\xE9(s). Fermez puis r\xE9essayez pour actualiser."));
            }
          case 2:
            return _context7.a(2);
        }
      }, _callee7);
    }))();
    return function () {
      active = false;
    };
  }, []);
  var query = normalizeCopySearch(search);
  var tokens = query.split(" ").filter(Boolean);
  var matches = targets.filter(function (target) {
    if (!query) return target.ofId === sourceOfId;
    var haystack = normalizeCopySearch("".concat(target.of, " ").concat(target.article, " ").concat(compactArticleCode(target.article), " ").concat(target.description, " ").concat(target.label, " ").concat(target.sn, " ").concat(target.lot));
    return tokens.every(function (token) {
      return haystack.includes(token);
    });
  });
  var limit = query ? 80 : 12;
  var visible = matches.slice(0, limit);
  var copy = /*#__PURE__*/function () {
    var _copy2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var result, _t4;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            setRunning(true);
            setMessage("");
            _context8.p = 1;
            _context8.n = 2;
            return onCopy(chosenSources, targets.filter(function (t) {
              return selected.includes(t.key);
            }), includeChecks, copyMode, reuseSample);
          case 2:
            result = _context8.v;
            setCompleted(function (ids) {
              return [].concat(_toConsumableArray(ids), _toConsumableArray(result.copied));
            });
            setSelected(function (ids) {
              return ids.filter(function (id) {
                return !result.copied.includes(id);
              });
            });
            setMessage("".concat(result.copyCount || 0, " ligne(s) copi\xE9e(s). ").concat(result.errors.join(" ; ")));
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t4 = _context8.v;
            setMessage(_t4.message || "Copie impossible");
          case 4:
            _context8.p = 4;
            setRunning(false);
            return _context8.f(4);
          case 5:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 3, 4, 5]]);
    }));
    function copy() {
      return _copy2.apply(this, arguments);
    }
    return copy;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 340,
      background: "#000000aa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Copier vers OF / SN",
    style: {
      width: 800,
      maxWidth: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      padding: 18,
      background: C.surface,
      color: C.text,
      border: "1px solid ".concat(C.blue),
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 12px",
      fontSize: 18
    }
  }, "Copier vers OF / SN / LOT \u2014 ", row.repere || "Ligne"), /*#__PURE__*/React.createElement("div", {
    "aria-label": "Source de la copie",
    style: {
      display: "grid",
      gridTemplateColumns: "auto minmax(90px,.7fr) minmax(180px,1.6fr) minmax(130px,1fr)",
      gap: 12,
      alignItems: "center",
      padding: "8px 10px",
      marginBottom: 10,
      background: C.raised,
      borderLeft: "3px solid ".concat(C.blue),
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.blue
    }
  }, "COPIE DE"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.muted,
      fontSize: 10
    }
  }, "OF"), /*#__PURE__*/React.createElement("strong", null, (sourceHeader === null || sourceHeader === void 0 ? void 0 : sourceHeader.of) || sourceOfId || "—")), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      overflowWrap: "anywhere"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.muted,
      fontSize: 10
    }
  }, "ARTICLE"), /*#__PURE__*/React.createElement("strong", null, (sourceHeader === null || sourceHeader === void 0 ? void 0 : sourceHeader.codeArticle) || "N/A"), (sourceHeader === null || sourceHeader === void 0 ? void 0 : sourceHeader.description) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.muted,
      marginTop: 1
    }
  }, sourceHeader.description)), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      overflowWrap: "anywhere"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.muted,
      fontSize: 10
    }
  }, "SN / LOT"), /*#__PURE__*/React.createElement("strong", null, sourceUnitText))), /*#__PURE__*/React.createElement("details", {
    style: {
      marginBottom: 10,
      border: "1px solid ".concat(C.border),
      background: C.surface
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      padding: "7px 10px",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      color: C.text
    }
  }, "Lignes \xE0 copier : ", chosenSources.length, " s\xE9lectionn\xE9e(s) sur ", availableSources.length), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 170,
      overflow: "auto",
      borderTop: "1px solid ".concat(C.border)
    }
  }, availableSources.map(function (source) {
    var key = copySourceKey(tab, source),
      checked = selectedSources.includes(key);
    return /*#__PURE__*/React.createElement("label", {
      key: key,
      style: {
        display: "grid",
        gridTemplateColumns: "24px minmax(0,1fr) auto",
        gap: 8,
        alignItems: "center",
        padding: "6px 10px",
        borderBottom: "1px solid ".concat(C.border),
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "aria-label": "Copier la source ".concat(copySourceLabel(tab, source)),
      checked: checked,
      disabled: running || checked && chosenSources.length === 1,
      onChange: function onChange(e) {
        return setSelectedSources(function (keys) {
          return e.target.checked ? _toConsumableArray(new Set([].concat(_toConsumableArray(keys), [key]))) : keys.filter(function (value) {
            return value !== key;
          });
        });
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        overflowWrap: "anywhere"
      }
    }, copySourceLabel(tab, source)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted,
        fontSize: 11
      }
    }, snScopeLabel(source, sourceUnits)));
  }))), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    "aria-label": "Rechercher les destinations",
    placeholder: "Rechercher : OF, N\xB0 article, description, SN ou LOT",
    value: search,
    disabled: running,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    },
    style: {
      width: "100%",
      padding: 8,
      marginBottom: 6,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginBottom: 10
    }
  }, loading ? "Chargement des destinations…" : query ? "".concat(matches.length, " destination(s) trouv\xE9e(s)").concat(matches.length > limit ? " \u2014 ".concat(limit, " affich\xE9es, pr\xE9cisez la recherche") : "") : "SN / LOT de l'OF actuel affich\xE9s. Tapez pour rechercher dans les ".concat(targets.length, " destinations.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.border,
    disabled: loading || running,
    onClick: function onClick() {
      return setSelected(function (ids) {
        return _toConsumableArray(new Set([].concat(_toConsumableArray(ids), _toConsumableArray(visible.filter(function (t) {
          return !completed.includes(t.key);
        }).map(function (t) {
          return t.key;
        })))));
      });
    }
  }, "Tout s\xE9lectionner"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    color: C.border,
    disabled: running,
    onClick: function onClick() {
      return setSelected([]);
    }
  }, "Tout d\xE9s\xE9lectionner")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflow: "auto",
      border: "1px solid ".concat(C.border)
    }
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10
    }
  }, "Chargement\u2026") : visible.length ? visible.map(function (t) {
    return /*#__PURE__*/React.createElement("label", {
      key: t.key,
      style: {
        display: "grid",
        gridTemplateColumns: "24px 110px minmax(130px,1fr) minmax(130px,1.4fr)",
        gap: 8,
        padding: "7px 10px",
        borderBottom: "1px solid ".concat(C.border),
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "aria-label": "OF ".concat(t.of, " \u2014 ").concat(t.label),
      checked: selected.includes(t.key),
      disabled: running || completed.includes(t.key),
      onChange: function onChange(e) {
        return setSelected(function (ids) {
          return e.target.checked ? [].concat(_toConsumableArray(ids), [t.key]) : ids.filter(function (id) {
            return id !== t.key;
          });
        });
      }
    }), /*#__PURE__*/React.createElement("span", null, t.of), /*#__PURE__*/React.createElement("span", null, t.label, completed.includes(t.key) ? " — Copié" : ""), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0,
        overflowWrap: "anywhere"
      }
    }, t.article, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        color: C.muted,
        fontSize: 12,
        marginTop: 2
      }
    }, t.description || "—")));
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10
    }
  }, query ? "Aucune destination trouvée" : "Aucun SN / LOT dans l'OF actuel")), /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: "1px solid ".concat(C.border),
      padding: "9px 10px",
      margin: "12px 0 8px"
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      fontSize: 11,
      color: C.muted,
      padding: "0 5px"
    }
  }, "Type de copie"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "flex-start",
      fontSize: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "copy-mode",
    value: "same",
    checked: copyMode === "same",
    disabled: running,
    onChange: function onChange() {
      return setCopyMode("same");
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "M\xEAme op\xE9ration sur plusieurs SN/OF"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.muted,
      marginTop: 2
    }
  }, "Conserve l\u2019auteur, les dates, les visas, CTRL et TRA."))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "flex-start",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "copy-mode",
    value: "new",
    checked: copyMode === "new",
    disabled: running || tab === "etuvage",
    onChange: function onChange() {
      return setCopyMode("new");
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Nouvelle op\xE9ration \xE0 partir de cette ligne"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.muted,
      marginTop: 2
    }
  }, "La personne qui copie devient l\u2019auteur ; les informations techniques sont reprises."), tab === "etuvage" && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.yellow,
      marginTop: 2
    }
  }, "Un \xE9tuvage r\xE9alis\xE9 est toujours recopi\xE9 comme la m\xEAme op\xE9ration.")))), copyMode === "new" && ["rework", "consommables"].includes(tab) && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      margin: "8px 0",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: includeChecks,
    disabled: !checksAllowed || running,
    onChange: function onChange(e) {
      return setIncludeChecks(e.target.checked);
    }
  }), "Inclure ", tab === "rework" ? "le contrôle et la traçabilité" : "la traçabilité", !checksAllowed ? " (Admin / Manager)" : ""), copyMode === "new" && includeChecks && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.yellow,
      fontSize: 12,
      marginBottom: 8
    }
  }, "CTRL / TRA repris avec leurs visas et dates d\u2019origine."), tab === "consommables" && copyMode === "new" && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      margin: "8px 0",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: reuseSample,
    disabled: running,
    onChange: function onChange(e) {
      return setReuseSample(e.target.checked);
    }
  }), "Reprendre le N\xB0 d\u2019\xE9chantillon source"), /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      fontSize: 12,
      marginBottom: 10
    }
  }, message), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: onClose,
    color: C.border,
    disabled: running
  }, "Fermer"), /*#__PURE__*/React.createElement(Btn, {
    small: true,
    onClick: copy,
    color: C.blue,
    disabled: loading || running || busy || !selected.length || !chosenSources.length
  }, running ? "Copie…" : "Copier ".concat(chosenSources.length, " ligne(s) vers ").concat(selected.length, " destination(s)")))));
};
var TabRework = function TabRework(_ref65) {
  var _header$_defaultSnIds, _header$_defaultSnIds2, _header$_defaultSnIds3, _header$_snRows;
  var data = _ref65.data,
    onChange = _ref65.onChange,
    user = _ref65.user,
    _ref65$perms = _ref65.perms,
    perms = _ref65$perms === void 0 ? {} : _ref65$perms,
    header = _ref65.header,
    _ref65$forceShowDelet = _ref65.forceShowDeleted,
    forceShowDeleted = _ref65$forceShowDelet === void 0 ? false : _ref65$forceShowDelet,
    onCopyAcross = _ref65.onCopyAcross,
    contextData = _ref65.contextData;
  var rows = data.rows || [];
  var _useState93 = useState([]),
    _useState94 = _slicedToArray(_useState93, 2),
    requestIds = _useState94[0],
    setRequestIds = _useState94[1];
  var tableRef = React.useRef(null);
  var _useState95 = useState(null),
    _useState96 = _slicedToArray(_useState95, 2),
    focusNewId = _useState96[0],
    setFocusNewId = _useState96[1];
  useEffect(function () {
    var _tableRef$current;
    if (!focusNewId) return;
    var row = Array.from(((_tableRef$current = tableRef.current) === null || _tableRef$current === void 0 ? void 0 : _tableRef$current.querySelectorAll('[data-rework-row]')) || []).find(function (el) {
      return el.dataset.reworkRow === focusNewId;
    });
    var field = row === null || row === void 0 ? void 0 : row.querySelector('[data-entry-field="repere"]');
    if (field) {
      field.focus();
      setFocusNewId(null);
    }
  }, [focusNewId, rows]);
  var navigateEntry = function navigateEntry(e) {
    if (e.key !== "Tab") return;
    var fields = Array.from(e.currentTarget.querySelectorAll('[data-entry-field]:not([readonly]):not(:disabled)'));
    var index = fields.indexOf(e.target);
    var validate = e.currentTarget.querySelector('button[title="Valider"]');
    var next = index >= 0 ? e.shiftKey ? fields[index - 1] : fields[index + 1] || validate : e.shiftKey && e.target === validate ? fields[fields.length - 1] : null;
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };
  var _useState97 = useState(false),
    _useState98 = _slicedToArray(_useState97, 2),
    showMaterialDraft = _useState98[0],
    setShowMaterialDraft = _useState98[1];
  useEffect(function () {
    setRequestIds([]);
    setShowMaterialDraft(false);
  }, [header === null || header === void 0 ? void 0 : header.of, header === null || header === void 0 || (_header$_defaultSnIds = header._defaultSnIds) === null || _header$_defaultSnIds === void 0 ? void 0 : _header$_defaultSnIds.join("|")]);
  var canEdit = function canEdit(row) {
    return canEditLine(user, row);
  };
  var canCommentRow = function canCommentRow() {
    return perms.canComment !== false;
  };
  var snRows = snRowsFromHeader(header);
  var warnSn = function warnSn(row) {
    return snScopeLabel(row, snRows);
  };
  var selectedUnitIds = header !== null && header !== void 0 && (_header$_defaultSnIds2 = header._defaultSnIds) !== null && _header$_defaultSnIds2 !== void 0 && _header$_defaultSnIds2.length ? header._defaultSnIds : null;
  var printRetentionSheets = /*#__PURE__*/function () {
    var _printRetentionSheets = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var logoImage, blob, _t5;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            _context9.p = 0;
            _context9.n = 1;
            return loadPdfLogoImage("assets/logo.png");
          case 1:
            logoImage = _context9.v;
            blob = buildComponentRetentionSheetsPdf({
              ofData: contextData,
              selectedUnitIds: selectedUnitIds,
              logoImage: logoImage,
              exportedAt: nowDT(),
              exportedBy: (user === null || user === void 0 ? void 0 : user.trigram) || ""
            });
            downloadBrowserBlob(blob, fileSafeName("Feuille composants dessoud\xE9s - OF ".concat((header === null || header === void 0 ? void 0 : header.of) || "OF", " - ").concat((selectedUnitIds === null || selectedUnitIds === void 0 ? void 0 : selectedUnitIds.length) === 1 ? snTitle(snRows.find(function (unit) {
              return unit.id === selectedUnitIds[0];
            })) : "Tous les SN")) + ".pdf");
            _context9.n = 3;
            break;
          case 2:
            _context9.p = 2;
            _t5 = _context9.v;
            window.alert("Impression impossible : ".concat((_t5 === null || _t5 === void 0 ? void 0 : _t5.message) || _t5));
          case 3:
            return _context9.a(2);
        }
      }, _callee9, null, [[0, 2]]);
    }));
    function printRetentionSheets() {
      return _printRetentionSheets.apply(this, arguments);
    }
    return printRetentionSheets;
  }();
  var printComponentLabel = function printComponentLabel(row) {
    try {
      var blob = buildComponentLabelPdf({
        ofData: contextData,
        row: row,
        selectedUnitIds: selectedUnitIds
      });
      downloadBrowserBlob(blob, fileSafeName("\xC9tiquette composant dessoud\xE9 - OF ".concat((header === null || header === void 0 ? void 0 : header.of) || "OF", " - ").concat(row.repere || "Repère")) + ".pdf");
    } catch (error) {
      window.alert("\xC9tiquette impossible : ".concat((error === null || error === void 0 ? void 0 : error.message) || error));
    }
  };
  var labelPrintButton = function labelPrintButton(row) {
    return row.action1 === "D" && row.validated && !row.deleted && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "no-print",
      onClick: function onClick() {
        return printComponentLabel(row);
      },
      title: "Imprimer l\u2019\xE9tiquette composant 50 \xD7 75 mm",
      style: {
        height: 22,
        minWidth: 31,
        padding: "0 4px",
        border: 0,
        borderRadius: 4,
        background: C.accent,
        color: "#fff",
        fontSize: 9,
        fontWeight: 900,
        cursor: "pointer",
        lineHeight: 1
      }
    }, "ETQ");
  };
  var rowsInWorkScope = rows.filter(function (r) {
    return _rowMatchesSnFilter(r, workSnFilter(header), header);
  });
  var requestRows = rowsInWorkScope.filter(function (r) {
    return !r.deleted && ["S", "M"].includes(r.action1) && requestIds.includes(r.id);
  });
  useEffect(function () {
    setRequestIds(function (ids) {
      var next = ids.filter(function (id) {
        return rows.some(function (r) {
          return r.id === id && !r.deleted && ["S", "M"].includes(r.action1);
        });
      });
      return next.length === ids.length ? ids : next;
    });
  }, [rows]);
  var repereKey = function repereKey(r) {
    return ((r === null || r === void 0 ? void 0 : r.repere) || "").trim().toUpperCase();
  };
  var priorAdjust = function priorAdjust(row, key) {
    return rows.some(function (previous) {
      return previous.id !== row.id && !previous.deleted && previous.isAdjust && repereKey(previous) === key && snRows.some(function (unit) {
        return rowMatchesSn(previous, unit, snRows) && rowMatchesSn(row, unit, snRows);
      });
    });
  };
  var isAdjustRow = function isAdjustRow(r) {
    return !!(r !== null && r !== void 0 && r.isAdjust);
  };
  var desoudes = computeOpenDesoudes(rowsInWorkScope);
  var desoudageChecks = computeReworkWarnings(rows, snRows, workSnFilter(header));
  var missingControls = computeMissingReworkControls(rowsInWorkScope);
  var add = function add() {
    if (!perms.canWrite) return;
    var last = latestSharedFicheOp(contextData || {
      rework: data
    }, header);
    var id = uid();
    setFilters({
      snTarget: workSnFilter(header),
      repere: "",
      action1: "",
      codeERP: "",
      valeur: "",
      lot: "",
      dc: "",
      sn: "",
      fiche: "",
      etape: "",
      adjust: "all"
    });
    setFocusNewId(id);
    onChange({
      rows: [].concat(_toConsumableArray(rows), [_objectSpread(_objectSpread({
        id: id,
        createdVisa: user.trigram,
        createdDT: nowDT()
      }, defaultSnScope(header)), {}, {
        sortieVisa: "",
        repere: "",
        qty: "",
        action1: "",
        codeERP: "",
        valeur: "",
        lot: "",
        dc: "",
        sn: "",
        fiche: last.fiche,
        etape: last.op,
        ficheOpUpdatedAt: Date.now(),
        isAdjust: false,
        visaOper: "",
        dateOper: "",
        visaCtrl: "",
        dateCtrl: "",
        remarques: "",
        editHistory: [],
        tracaOk: false,
        visaTraca: "",
        dateTraca: ""
      })])
    });
  };
  var _useState99 = useState(null),
    _useState100 = _slicedToArray(_useState99, 2),
    deleteTarget = _useState100[0],
    setDeleteTarget = _useState100[1];
  var _useState101 = useState(null),
    _useState102 = _slicedToArray(_useState101, 2),
    restoreTarget = _useState102[0],
    setRestoreTarget = _useState102[1];
  var _useState103 = useState(false),
    _useState104 = _slicedToArray(_useState103, 2),
    showDeleted = _useState104[0],
    setShowDeleted = _useState104[1];
  var _useState105 = useState(true),
    _useState106 = _slicedToArray(_useState105, 2),
    hideAchevees = _useState106[0],
    setHideAchevees = _useState106[1];
  var _useState107 = useState({
      snTarget: workSnFilter(header),
      repere: "",
      action1: "",
      codeERP: "",
      valeur: "",
      lot: "",
      dc: "",
      sn: "",
      fiche: "",
      etape: "",
      adjust: "all"
    }),
    _useState108 = _slicedToArray(_useState107, 2),
    filters = _useState108[0],
    setFilters = _useState108[1];
  useEffect(function () {
    return setFilters(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, {
        snTarget: workSnFilter(header)
      });
    });
  }, [header === null || header === void 0 || (_header$_defaultSnIds3 = header._defaultSnIds) === null || _header$_defaultSnIds3 === void 0 ? void 0 : _header$_defaultSnIds3.join("|"), header === null || header === void 0 || (_header$_snRows = header._snRows) === null || _header$_snRows === void 0 ? void 0 : _header$_snRows.length]);
  var upd = function upd(id, f, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (f === "comments" ? !canCommentRow() : !canEdit(r)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, _objectSpread(_defineProperty({}, f, v), ["fiche", "etape"].includes(f) ? {
        ficheOpUpdatedAt: Date.now()
      } : {}))
    });
  };
  var updAction = function updAction(id, nextAction) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r) || r.action1 === nextAction) return;
    if (r.visaCtrl && !canActionReceiveCtrl(nextAction)) {
      var actionLabel = ACTION_LABELS[nextAction] || nextAction;
      if (!window.confirm("L'action ".concat(actionLabel, " ne permet pas de contr\xF4le. Retirer le CTRL existant avant de changer l'action ?"))) return;
      onChange({
        rows: scopedRowsPatch(rows, id, header, {
          action1: nextAction,
          visaCtrl: "",
          dateCtrl: "",
          ctrlCancellationHistory: [].concat(_toConsumableArray(r.ctrlCancellationHistory || []), [{
            visaCtrl: r.visaCtrl,
            dateCtrl: r.dateCtrl,
            cancelledVisa: user.trigram,
            cancelledDT: nowDT(),
            reason: "Action modifi\xE9e de ".concat(r.action1 || "N/A", " vers ").concat(nextAction)
          }])
        })
      });
      return;
    }
    upd(id, "action1", nextAction);
  };
  var patchRow = function patchRow(id, fields) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, fields)
    });
  };
  var updRepere = function updRepere(id, v) {
    var row = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(row)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, function (r) {
        var nextKey = String(v || "").trim().toUpperCase();
        return {
          repere: String(v || "").toUpperCase(),
          qty: nextKey && r.qty === "" && r.action1 !== "M" ? "1" : r.qty,
          isAdjust: priorAdjust(r, nextKey) || !!r.isAdjust
        };
      })
    });
  };
  var updAdjust = function updAdjust(id, checked) {
    var row = rows.find(function (r) {
      return r.id === id;
    });
    if (!canEdit(row)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, {
        isAdjust: checked
      })
    });
  };
  var dup = function dup(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || !perms.canWrite) return;
    if (onCopyAcross && !r.deleted) {
      onCopyAcross(r);
      return;
    }
    onChange({
      rows: [].concat(_toConsumableArray(rows), [duplicateRow(r, user, {
        visaOper: "",
        dateOper: "",
        visaCtrl: "",
        dateCtrl: "",
        tracaOk: false,
        visaTraca: "",
        dateTraca: ""
      })])
    });
  };
  // Un brouillon neuf disparaît; une ligne déjà validée garde sa trace d'annulation.
  var del = function del(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    var isFreshDraft = !(r !== null && r !== void 0 && r.validated) && !(r !== null && r !== void 0 && r.editBase) && !(r !== null && r !== void 0 && r.visaOper) && !(r !== null && r !== void 0 && r.dateOper) && !(r !== null && r !== void 0 && r.visaCtrl) && !(r !== null && r !== void 0 && r.dateCtrl) && !(r !== null && r !== void 0 && r.tracaOk);
    if (isFreshDraft) onChange({
      rows: rows.filter(function (x) {
        return x.id !== id;
      })
    });else if (!r.validated) onChange({
      rows: scopedRowsDelete(rows, id, header, {
        deleted: true,
        deletedReason: "",
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });else setDeleteTarget(id);
  };
  var restore = function restore(reason) {
    onChange({
      rows: rows.map(function (r) {
        return r.id === restoreTarget ? _objectSpread(_objectSpread({}, r), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: user.trigram,
          restoredDate: nowDT()
        }) : r;
      })
    });
    setRestoreTarget(null);
  };
  var confirmDel = function confirmDel(reason) {
    var r = rows.find(function (x) {
      return x.id === deleteTarget;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsDelete(rows, deleteTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });
    setDeleteTarget(null);
  };
  var deletedCount = rows.filter(function (r) {
    return r.deleted;
  }).length;
  var isAchevee = function isAchevee(r) {
    return r.action1 !== "P" && (!["S", "R"].includes(r.action1) || !!r.visaCtrl) && !!r.tracaOk && missingReworkTrace(r, true).length === 0;
  };
  var acheveesCount = rows.filter(function (r) {
    return !r.deleted && isAchevee(r);
  }).length;
  var visibleRows = sortByNewestOperation(rows).filter(function (r) {
    if (r.deleted && !showDeleted && !forceShowDeleted) return false;
    if (!r.deleted && hideAchevees && !forceShowDeleted && isAchevee(r)) return false;
    var txt = function txt(key) {
      return String(r[key] || "").toUpperCase();
    };
    if (!_rowMatchesSnFilter(r, filters.snTarget, header)) return false;
    if (filters.repere && !txt("repere").includes(filters.repere.toUpperCase())) return false;
    if (!filterMatches(filters.action1, r.action1)) return false;
    if (filters.codeERP && !txt("codeERP").includes(filters.codeERP.toUpperCase())) return false;
    if (filters.valeur && !txt("valeur").includes(filters.valeur.toUpperCase())) return false;
    if (filters.lot && !txt("lot").includes(filters.lot.toUpperCase())) return false;
    if (filters.dc && !txt("dc").includes(filters.dc.toUpperCase())) return false;
    if (filters.sn && !txt("sn").includes(filters.sn.toUpperCase())) return false;
    if (filters.fiche && !txt("fiche").includes(filters.fiche.toUpperCase())) return false;
    if (filters.etape && !txt("etape").includes(filters.etape.toUpperCase())) return false;
    if (filters.adjust === "yes" && !isAdjustRow(r)) return false;
    if (filters.adjust === "no" && isAdjustRow(r)) return false;
    return true;
  });
  var hasFilters = Object.entries(filters).some(function (_ref66) {
    var _ref67 = _slicedToArray(_ref66, 2),
      k = _ref67[0],
      v = _ref67[1];
    return v !== "all" && filterHasValue(v);
  });
  var fset = function fset(k, v) {
    return setFilters(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, k, v));
    });
  };
  var stampTraca = function stampTraca(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (r && !r.deleted && perms.canTraceability) onChange({
      rows: scopedRowsPatch(rows, id, header, {
        tracaOk: true,
        visaTraca: user.trigram,
        dateTraca: nowDT()
      })
    });
  };
  var clearTraca = function clearTraca(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || r.deleted || !r.tracaOk || !perms.canTraceability) return;
    if (!window.confirm("Annuler la validation de traçabilité de cette ligne ?")) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, {
        tracaOk: false,
        visaTraca: "",
        dateTraca: "",
        tracaCancellationHistory: [].concat(_toConsumableArray(r.tracaCancellationHistory || []), [{
          visaTraca: r.visaTraca,
          dateTraca: r.dateTraca,
          cancelledVisa: user.trigram,
          cancelledDT: nowDT()
        }])
      })
    });
  };
  var setTracaDate = function setTracaDate(id, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (r && !r.deleted && perms.canTraceability) onChange({
      rows: scopedRowsPatch(rows, id, header, {
        dateTraca: v
      })
    });
  };
  var stampOper = function stampOper(id) {
    return onChange({
      rows: scopedRowsPatch(rows, id, header, {
        visaOper: user.trigram,
        dateOper: now(),
        validated: true,
        validError: ""
      })
    });
  };
  var clearOper = function clearOper(id) {
    return onChange({
      rows: scopedRowsPatch(rows, id, header, {
        visaOper: "",
        dateOper: ""
      })
    });
  };
  var ctrlOwner = function ctrlOwner(r) {
    return (r === null || r === void 0 ? void 0 : r.visaOper) || (r === null || r === void 0 ? void 0 : r.createdVisa) || (r === null || r === void 0 ? void 0 : r.visa) || "";
  };
  var canCtrlRow = function canCtrlRow(r) {
    return !!r && !r.deleted && canActionReceiveCtrl(r.action1) && perms.canControlRework && (isAdminManager(user) || ctrlOwner(r) !== (user === null || user === void 0 ? void 0 : user.trigram));
  };
  var stampCtrl = function stampCtrl(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canCtrlRow(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, {
        visaCtrl: user.trigram,
        dateCtrl: nowDT()
      })
    });
  };
  var clearCtrl = function clearCtrl(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || r.deleted || !r.visaCtrl || !perms.canControlRework) return;
    if (!window.confirm("D\xE9valider le contr\xF4le de ".concat(r.repere || "cette ligne", " (").concat(r.visaCtrl, " - ").concat(r.dateCtrl || "", ") ?"))) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, {
        visaCtrl: "",
        dateCtrl: "",
        ctrlCancellationHistory: [].concat(_toConsumableArray(r.ctrlCancellationHistory || []), [{
          visaCtrl: r.visaCtrl,
          dateCtrl: r.dateCtrl,
          cancelledVisa: user.trigram,
          cancelledDT: nowDT()
        }])
      })
    });
  };
  var setCtrlDate = function setCtrlDate(id, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canCtrlRow(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, {
        dateCtrl: v
      })
    });
  };
  var REQUIRED = [{
    key: "repere",
    label: "Repère TOPO"
  }, {
    key: "action1",
    label: "Action"
  }, {
    key: "qty",
    label: "QTÉ"
  }, {
    key: "fiche",
    label: "Fiche suiveuse"
  }, {
    key: "etape",
    label: "OP"
  }];
  var validateRow = function validateRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    var refuse = function refuse(message) {
      upd(id, "validError", message);
      window.alert("Ligne non valid\xE9e :\n\n".concat(message));
    };
    var required = [].concat(REQUIRED, _toConsumableArray(["S", "D", "P"].includes(r === null || r === void 0 ? void 0 : r.action1) ? [{
      key: "valeur",
      label: "Valeur"
    }] : []), _toConsumableArray(["S", "P", "M"].includes(r === null || r === void 0 ? void 0 : r.action1) ? [{
      key: "codeERP",
      label: "Code article"
    }] : []));
    var miss = checkRequired(r, required);
    if (miss.length) {
      refuse("Champs requis manquants : " + miss.join(", "));
    } else {
      var checks = computeReworkWarnings(rows.filter(function (x) {
        return x.validated || x.id === id;
      }), snRows);
      var sequence = checks.sequence.filter(function (w) {
        return w.row.id === id || w.previous.id === id;
      });
      if (sequence.length) {
        refuse(sequence.map(function (w) {
          return "".concat(w.snLabel, " - ").concat(w.repere, " : ").concat(w.previous.action1, " \u2192 ").concat(w.row.action1, " interdit");
        }).join(" ; "));
        return;
      }
      onChange({
        rows: scopedRowsPatch(rows, id, header, function (x) {
          return withEditHistory(x, user, REWORK_EDIT_FIELDS);
        })
      });
    }
  };
  var unlockRow = function unlockRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(r, REWORK_EDIT_FIELDS)
        }) : r;
      })
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1520
    }
  }, desoudes.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.yellow + "18",
      border: "1px solid ".concat(C.yellow),
      borderRadius: 6,
      padding: "9px 14px",
      marginBottom: 12,
      display: "flex",
      alignItems: "flex-start",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.yellow,
      fontSize: 16,
      lineHeight: 1
    }
  }, "\u26A0"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.yellow,
      fontWeight: 800,
      fontSize: 12,
      marginBottom: 4
    }
  }, desoudes.length, " composant", desoudes.length > 1 ? "s" : "", " d\xE9soud\xE9", desoudes.length > 1 ? "s" : "", " \xE0 surveiller"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, desoudes.map(function (r) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: r.id,
      label: "".concat(warnSn(r), " - ").concat(r.repere || "repère ?", " - valeur D ").concat(r.valeur || "?", " - Fiche suiveuse ").concat(r.fiche || "?", " - OP ").concat(r.etape || "?"),
      color: C.yellow
    });
  })))), (desoudageChecks.sequence.length > 0 || desoudageChecks.mismatch.length > 0 || desoudageChecks.first.length > 0 || desoudageChecks.pointed.length > 0 || missingControls.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.red + "18",
      border: "1px solid ".concat(C.red),
      borderRadius: 6,
      padding: "9px 14px",
      marginBottom: 12,
      display: "flex",
      alignItems: "flex-start",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.red,
      fontSize: 16,
      lineHeight: 1
    }
  }, "\u26A0"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.red,
      fontWeight: 800,
      fontSize: 12,
      marginBottom: 4
    }
  }, "Contr\xF4le soudage / dessoudage / pointage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, desoudageChecks.sequence.map(function (w) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: "seq-".concat(w.unitId, "-").concat(w.row.id),
      label: "".concat(w.snLabel, " - ").concat(w.repere, " - ").concat(w.previous.action1, " \u2192 ").concat(w.row.action1, " interdit"),
      color: C.red
    });
  }), desoudageChecks.mismatch.map(function (w) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: "".concat(w.unitId || "all", "-").concat(w.repere, "-").concat(w.previous.id, "-").concat(w.current.id),
      label: "".concat(w.snLabel || warnSn(w.current), " - ").concat(w.repere, " - valeur ").concat(w.previous.action1, " ").concat(w.previous.valeur || "?", " \u2260 ").concat(w.current.action1, " ").concat(w.current.valeur || "?"),
      color: C.red
    });
  }), desoudageChecks.first.map(function (w) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: "".concat(w.unitId || "all", "-").concat(w.repere, "-").concat(w.d.id),
      label: "".concat(w.snLabel || warnSn(w.d), " - ").concat(w.repere, " - 1er d\xE9soudage"),
      color: C.yellow
    });
  }), desoudageChecks.pointed.map(function (w) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: "point-".concat(w.unitId || "all", "-").concat(w.repere, "-").concat(w.row.id),
      label: "".concat(w.snLabel || warnSn(w.row), " - ").concat(w.repere, " - point\xE9 non soud\xE9 (S requis)"),
      color: C.red
    });
  }), missingControls.map(function (r) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: "ctrl-".concat(r.id),
      label: "".concat(warnSn(r), " - ").concat(r.repere || "repère ?", " - ").concat(ACTION_LABELS[r.action1] || r.action1, " sans CTRL"),
      color: C.red
    });
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 11,
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap"
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    small: true
  }, "+ Ligne"), perms.canWrite && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowMaterialDraft(true);
    },
    color: C.blue,
    disabled: !requestRows.length,
    small: true
  }, "Demande mati\xE8re (", requestRows.length, ")"), /*#__PURE__*/React.createElement(Btn, {
    onClick: printRetentionSheets,
    color: C.blue,
    small: true
  }, "Feuille composants"), ACTIONS.map(function (a) {
    return /*#__PURE__*/React.createElement("span", {
      key: a
    }, /*#__PURE__*/React.createElement(Badge, {
      label: a,
      color: C.accent
    }), " ", ACTION_LABELS[a], "\xA0\xA0");
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, acheveesCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setHideAchevees(function (s) {
        return !s;
      });
    },
    color: hideAchevees ? "#23863666" : C.border,
    small: true
  }, hideAchevees ? "\u25BC Op\xE9rations achev\xE9es (".concat(acheveesCount, ")") : "▲ Masquer achevées"), deletedCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulées" : "▼ Voir annulées (" + deletedCount + ")"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    ref: tableRef,
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Date / Heure"), /*#__PURE__*/React.createElement(TH, {
    w: 48,
    color: C.accent
  }, "Visa"), /*#__PURE__*/React.createElement(TH, {
    w: 82
  }, "N\xB0 SN"), /*#__PURE__*/React.createElement(TH, {
    w: 66
  }, "Rep\xE8re TOPO"), /*#__PURE__*/React.createElement(TH, {
    w: 58
  }, "Adj"), /*#__PURE__*/React.createElement(TH, {
    w: 38
  }, "QT\xC9"), /*#__PURE__*/React.createElement(TH, {
    w: 62
  }, "Action"), /*#__PURE__*/React.createElement(TH, {
    w: 92
  }, "Code article"), /*#__PURE__*/React.createElement(TH, {
    w: 92
  }, "Valeur"), /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "LOT"), /*#__PURE__*/React.createElement(TH, {
    w: 68
  }, "DC"), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }, "SN"), /*#__PURE__*/React.createElement(TH, {
    w: 124
  }, "Fiche suiveuse"), /*#__PURE__*/React.createElement(TH, {
    w: 56
  }, "OP"), /*#__PURE__*/React.createElement(TH, {
    w: 48
  }, "Ctrl"), /*#__PURE__*/React.createElement(TH, {
    w: 46,
    color: C.green
  }, "TRA"), perms.canWrite && !forceShowDeleted && /*#__PURE__*/React.createElement(TH, {
    w: 38
  }, "DEM"), /*#__PURE__*/React.createElement(TH, {
    w: 28
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement(TH, {
    w: 145
  })), /*#__PURE__*/React.createElement("tr", {
    style: {
      background: C.blue + "0c",
      borderBottom: "2px solid ".concat(C.border)
    }
  }, /*#__PURE__*/React.createElement("th", {
    colSpan: 2,
    style: {
      color: C.blue,
      fontSize: 11,
      textAlign: "left",
      padding: "6px 5px"
    }
  }, "\u2315 Filtres"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(SnFilter, {
    value: filters.snTarget,
    onChange: function onChange(v) {
      return fset("snTarget", v);
    },
    header: header
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.repere,
    onChange: function onChange(v) {
      return fset("repere", v);
    },
    small: true,
    title: "Filtrer rep\xE8re topo"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: filters.adjust,
    onChange: function onChange(e) {
      return fset("adjust", e.target.value);
    },
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "4px 3px",
      fontSize: 10,
      fontFamily: "monospace",
      outline: "none"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Tous"), /*#__PURE__*/React.createElement("option", {
    value: "yes"
  }, "Oui"), /*#__PURE__*/React.createElement("option", {
    value: "no"
  }, "Non"))), /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(MultiFilter, {
    value: filters.action1,
    onChange: function onChange(v) {
      return fset("action1", v);
    },
    title: "Filtrer les actions",
    options: ACTIONS.map(function (a) {
      return {
        value: a,
        label: ACTION_LABELS[a] || a
      };
    })
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.codeERP,
    onChange: function onChange(v) {
      return fset("codeERP", v);
    },
    small: true,
    title: "Filtrer code article"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.valeur,
    onChange: function onChange(v) {
      return fset("valeur", v);
    },
    small: true,
    title: "Filtrer valeur"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.lot,
    onChange: function onChange(v) {
      return fset("lot", v);
    },
    small: true,
    title: "Filtrer lot"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.dc,
    onChange: function onChange(v) {
      return fset("dc", v);
    },
    small: true,
    title: "Filtrer DC"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.sn,
    onChange: function onChange(v) {
      return fset("sn", v);
    },
    small: true,
    title: "Filtrer SN"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.fiche,
    onChange: function onChange(v) {
      return fset("fiche", v);
    },
    small: true,
    title: "Filtrer fiche suiveuse"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.etape,
    onChange: function onChange(v) {
      return fset("etape", v);
    },
    small: true,
    title: "Filtrer OP"
  })), /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", null), perms.canWrite && !forceShowDeleted && /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px",
      textAlign: "center"
    }
  }, hasFilters && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setFilters({
        snTarget: workSnFilter(header),
        repere: "",
        action1: "",
        codeERP: "",
        valeur: "",
        lot: "",
        dc: "",
        sn: "",
        fiche: "",
        etape: "",
        adjust: "all"
      });
    },
    title: "Effacer les filtres",
    style: {
      background: C.border,
      border: "none",
      borderRadius: 4,
      color: C.text,
      width: 26,
      height: 22,
      cursor: "pointer",
      fontWeight: 800
    }
  }, "\xD7")))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.flatMap(function (r, i) {
    var dc = ["S", "P", "M"].includes(r.action1) ? dcCheck(r.dc, r.createdDT) : null;
    var traceMissing = missingReworkTrace(r, true);
    var missingStyle = {
      background: C.red + "12",
      borderColor: C.red + "66",
      color: C.red
    };
    var coherenceIssues = desoudageChecks.mismatch.filter(function (w) {
      return w.previous.id === r.id || w.current.id === r.id;
    });
    var coherenceStyle = coherenceIssues.length ? {
      background: C.red + "18",
      borderColor: C.red,
      color: C.red,
      fontWeight: 800
    } : {};
    var editable = canEdit(r);
    var locked = !!r.validated || !editable;
    return [/*#__PURE__*/React.createElement("tr", {
      key: r.id,
      "data-rework-row": r.id,
      onKeyDown: navigateEntry,
      style: {
        background: r.deleted ? "#da363318" : r.tracaOk ? "#23863610" : i % 2 === 0 ? "transparent" : C.stripe,
        textDecoration: r.deleted ? "line-through" : undefined,
        opacity: r.deleted ? .6 : 1,
        pointerEvents: r.deleted ? "none" : undefined,
        borderLeft: r.validated ? "3px solid ".concat(C.green) : r.validError ? "3px solid ".concat(C.red) : "3px solid ".concat(C.border)
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted
      }
    }, r.createdDT || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        color: C.accent
      }
    }, r.createdVisa || "—"), /*#__PURE__*/React.createElement(CopyOriginMark, {
      origin: r.copyOrigin
    })), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement(SnScopePicker, {
      row: r,
      header: header,
      onChange: function onChange(fields) {
        return patchRow(r.id, fields);
      },
      disabled: locked
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      entryField: "repere",
      value: r.repere,
      onChange: function onChange(v) {
        return updRepere(r.id, v);
      },
      small: true,
      readOnly: locked,
      style: _objectSpread(_objectSpread({}, locked ? LOCKED_INPUT_STYLE : {}), {}, {
        textTransform: "uppercase"
      })
    })), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement("input", {
      "data-entry-field": "isAdjust",
      type: "checkbox",
      checked: isAdjustRow(r),
      disabled: locked,
      onChange: function onChange(e) {
        return updAdjust(r.id, e.target.checked);
      },
      title: "Composant adjust : appliqu\xE9 \xE0 toutes les lignes du m\xEAme rep\xE8re",
      style: {
        width: 16,
        height: 16,
        accentColor: C.accent,
        cursor: locked ? "default" : "pointer"
      }
    })), /*#__PURE__*/React.createElement(TD, null, r.action1 === "M" || !r.repere ? /*#__PURE__*/React.createElement(Input, {
      entryField: "qty",
      value: r.qty,
      onChange: function onChange(v) {
        return upd(r.id, "qty", v);
      },
      small: true,
      readOnly: locked,
      style: _objectSpread({}, locked ? LOCKED_INPUT_STYLE : {})
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted,
        padding: "0 4px"
      }
    }, "\u2014")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Select, {
      entryField: "action1",
      value: r.action1,
      onChange: function onChange(v) {
        return updAction(r.id, v);
      },
      options: ACTIONS,
      disabled: locked,
      style: {
        width: "100%",
        padding: "4px 3px"
      }
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: r.codeERP,
      title: "Copier code article"
    }, /*#__PURE__*/React.createElement(Input, {
      entryField: "codeERP",
      value: r.codeERP,
      onChange: function onChange(v) {
        return upd(r.id, "codeERP", v);
      },
      small: true,
      readOnly: locked,
      style: _objectSpread({
        width: "100%",
        fontFamily: "monospace"
      }, locked ? LOCKED_INPUT_STYLE : {}),
      title: "Code article ou texte libre",
      placeholder: "Code article"
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      entryField: "valeur",
      value: r.valeur,
      onChange: function onChange(v) {
        return upd(r.id, "valeur", v);
      },
      small: true,
      readOnly: locked,
      title: coherenceIssues.length ? coherenceIssues.map(function (w) {
        return "Coh\xE9rence valeur : ".concat(w.previous.action1, " ").concat(w.previous.valeur || "?", " \u2260 ").concat(w.current.action1, " ").concat(w.current.valeur || "?");
      }).join("\n") : "Valeur du composant",
      style: _objectSpread(_objectSpread({
        width: "100%"
      }, locked ? LOCKED_INPUT_STYLE : {}), coherenceStyle)
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: r.lot,
      title: "Copier LOT"
    }, /*#__PURE__*/React.createElement(Input, {
      entryField: "lot",
      value: r.lot,
      onChange: function onChange(v) {
        return upd(r.id, "lot", v.toUpperCase().slice(0, 12));
      },
      onBlur: function onBlur(e) {
        return upd(r.id, "lot", normLot(e.target.value));
      },
      small: true,
      readOnly: locked,
      title: "Lot : num\xE9rique sur 10 chiffres, ou texte libre / N/A",
      style: _objectSpread(_objectSpread({
        width: "100%",
        fontFamily: "monospace"
      }, locked ? LOCKED_INPUT_STYLE : {}), traceMissing.includes("LOT") ? missingStyle : {})
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(Input, {
      entryField: "dc",
      value: r.dc,
      onChange: function onChange(v) {
        return upd(r.id, "dc", v.toUpperCase().slice(0, 6));
      },
      small: true,
      readOnly: locked,
      title: dc && !dc.ok ? "Anomalie : DC ".concat(r.dc, " \u2014 ").concat(dc.label, " \xE0 la date de la ligne") : (dc === null || dc === void 0 ? void 0 : dc.label) || "DC (ex: 2552R1) ou N/A si non disponible",
      style: _objectSpread(_objectSpread({
        width: "100%",
        fontFamily: "monospace"
      }, locked ? LOCKED_INPUT_STYLE : {}), {}, {
        borderColor: dc && !dc.ok ? C.red : dc !== null && dc !== void 0 && dc.ok ? C.green : undefined,
        color: dc && !dc.ok ? C.red : dc !== null && dc !== void 0 && dc.ok ? C.green : undefined
      }, traceMissing.includes("DC") ? missingStyle : {})
    })))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: r.sn,
      title: "Copier SN"
    }, /*#__PURE__*/React.createElement(Input, {
      entryField: "sn",
      value: r.sn,
      onChange: function onChange(v) {
        return upd(r.id, "sn", v);
      },
      small: true,
      readOnly: locked,
      style: _objectSpread({
        width: "100%"
      }, locked ? LOCKED_INPUT_STYLE : {})
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      entryField: "fiche",
      value: r.fiche,
      onChange: function onChange(v) {
        return upd(r.id, "fiche", v.toUpperCase());
      },
      small: true,
      required: true,
      readOnly: locked,
      title: "Fiche suiveuse / FT / NC / DM (ex: R4B-Q001, FT-042)",
      placeholder: "R4B-Q001",
      style: _objectSpread({
        fontFamily: "monospace",
        width: "100%",
        textTransform: "uppercase"
      }, locked ? LOCKED_INPUT_STYLE : {})
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      entryField: "etape",
      value: r.etape || "",
      onChange: function onChange(v) {
        return upd(r.id, "etape", v);
      },
      small: true,
      required: true,
      readOnly: locked,
      title: "OP (ex: 10, 20, 30...)",
      placeholder: "Et.",
      style: _objectSpread({
        textAlign: "center",
        width: "100%"
      }, locked ? LOCKED_INPUT_STYLE : {})
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, !r.visaCtrl && !canActionReceiveCtrl(r.action1) ? /*#__PURE__*/React.createElement("span", {
      title: "Contr\xF4le non applicable \xE0 cette action",
      style: {
        fontFamily: "monospace",
        fontSize: 10,
        color: C.muted
      }
    }, "N/A") : /*#__PURE__*/React.createElement(StampStatus, {
      done: !!r.visaCtrl,
      visa: r.visaCtrl,
      date: r.dateCtrl,
      color: C.blue,
      label: "Ctrl",
      onStamp: function onStamp() {
        return stampCtrl(r.id);
      },
      onClear: function onClear() {
        return clearCtrl(r.id);
      },
      canClear: !r.deleted && perms.canControlRework,
      clearTitle: "D\xE9valider le contr\xF4le",
      onDateChange: r.editBase && canCtrlRow(r) ? function (v) {
        return setCtrlDate(r.id, v);
      } : null,
      disabled: !canCtrlRow(r)
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(StampStatus, {
      done: !!r.tracaOk,
      visa: r.visaTraca,
      date: r.dateTraca,
      color: C.green,
      label: "Tra\xE7a",
      onStamp: function onStamp() {
        return stampTraca(r.id);
      },
      onClear: function onClear() {
        return clearTraca(r.id);
      },
      canClear: !r.deleted && perms.canTraceability,
      clearTitle: "D\xE9valider la tra\xE7abilit\xE9",
      onDateChange: r.editBase && !r.deleted && perms.canTraceability ? function (v) {
        return setTracaDate(r.id, v);
      } : null,
      disabled: r.deleted || !perms.canTraceability
    })), perms.canWrite && !forceShowDeleted && /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "aria-label": "Demander la mati\xE8re ".concat(r.repere || "ligne", " ").concat(r.codeERP || ""),
      title: ["S", "M"].includes(r.action1) ? "Sélectionner pour la demande matière" : "Demande matière réservée aux actions S et M",
      disabled: !!r.deleted || !["S", "M"].includes(r.action1),
      checked: !r.deleted && ["S", "M"].includes(r.action1) && requestIds.includes(r.id),
      onChange: function onChange() {
        if (!r.deleted && ["S", "M"].includes(r.action1)) setRequestIds(function (ids) {
          return ids.includes(r.id) ? ids.filter(function (id) {
            return id !== r.id;
          }) : [].concat(_toConsumableArray(ids), [r.id]);
        });
      }
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(CommentBtn, {
      comments: r.comments || [],
      onChange: function onChange(v) {
        return upd(r.id, "comments", v);
      },
      user: user,
      disabled: !canCommentRow()
    })), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !r.deleted && !r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateRow(r.id);
      },
      color: C.green,
      title: "Valider"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.border,
      title: "Supprimer"
    }, "\xD7")), !r.deleted && r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, labelPrintButton(r), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return unlockRow(r.id);
      },
      color: C.yellow,
      title: "Modifier"
    }, "\u270E"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !r.deleted && !editable && perms.canWrite && /*#__PURE__*/React.createElement(ActionGroup, null, labelPrintButton(r), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    })))), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: r.id + "_hist",
      row: r,
      open: forceShowDeleted
    }), r.deleted && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_ann"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 6px",
        background: "#da363325",
        borderBottom: "2px solid #da363355"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: .3
      }
    }, "\u2715 Annul\xE9 le ", /*#__PURE__*/React.createElement("strong", null, r.deletedDate), " par ", /*#__PURE__*/React.createElement("strong", null, r.deletedVisa), r.deletedReason && /*#__PURE__*/React.createElement(React.Fragment, null, "\xA0\u2014\xA0Motif : ", r.deletedReason)), /*#__PURE__*/React.createElement(PurgeLineButton, {
      user: user,
      data: data,
      onChange: onChange,
      id: r.id
    }), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        setRestoreTarget(r.id);
      },
      style: {
        color: "#d29922",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        pointerEvents: "all",
        marginLeft: 16,
        flexShrink: 0
      }
    }, "\u21A9 R\xE9activer"))))];
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 24
    }
  }, "Aucune ligne")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 11,
      color: C.muted
    }
  }, "\u2726 Visa Op\xE9r. pr\xE9-rempli \xB7 \u2713 Valider pour verrouiller \xB7 \xD7 Annuler sur ligne valid\xE9e = barre et conserve la tra\xE7abilit\xE9"), showMaterialDraft && perms.canWrite && requestRows.length > 0 && /*#__PURE__*/React.createElement(MaterialRequestModal, {
    header: header,
    rows: requestRows,
    user: user,
    onClose: function onClose() {
      return setShowMaterialDraft(false);
    }
  }), deleteTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDel,
    onCancel: function onCancel() {
      return setDeleteTarget(null);
    }
  }), restoreTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restore,
    onCancel: function onCancel() {
      return setRestoreTarget(null);
    }
  }));
};
var DEFAULT_CONSOMMABLES = [{
  id: "fx1",
  label: "Flux ELSOLD AP-10",
  sap: "",
  code: "FX-ELSOLD-TYPAP10-A1317",
  cat: "Flux"
}, {
  id: "fx2",
  label: "Flux ELSOLD 045",
  code: "FX-ELSOLD-TYPE045-A0653",
  cat: "Flux"
}, {
  id: "fx3",
  label: "Flux basse temp ST",
  code: "FX-ST-FSW11-A0023",
  cat: "Flux"
}, {
  id: "sd1",
  label: "Sn63Pb37 AP10 pâte",
  code: "SD-SN63PB37-AP10-A1125",
  cat: "Soudure"
}, {
  id: "sd2",
  label: "Sn63Pb37",
  code: "SD-SN63PB37-FX-03-A0021",
  cat: "Soudure"
}, {
  id: "sd3",
  label: "Sn63Pb37 barre",
  code: "SD-SN63PB37P-FX-8X10-A0594",
  cat: "Soudure"
}, {
  id: "sd4",
  label: "Sn96Ag4 0.35mm",
  code: "SD-SN96AG4-03-A0022",
  cat: "Soudure"
}, {
  id: "sd5",
  label: "Sn96Ag4 1mm",
  code: "SD-SN96AG4-1-A0022",
  cat: "Soudure"
}, {
  id: "k1",
  label: "Kapton 3M",
  code: "ADH-KAPTON-3M92-A0066",
  cat: "Kapton"
}, {
  id: "k2",
  label: "2216B/A Gray 3M",
  code: "COL-2216B/A-GRAY-A0367",
  cat: "Colle"
}, {
  id: "k3",
  label: "CAB-O-SIL M5",
  code: "COL-CAB-O-SIL-M5-A1226",
  cat: "Colle"
}, {
  id: "k4",
  label: "HYSOL FP4323",
  code: "COL-HYSOL-FP4323-A1364",
  cat: "Colle"
}, {
  id: "k5",
  label: "Epoxy H20s",
  code: "COL-EPOTEK-H20S-A0020",
  cat: "Colle"
}, {
  id: "k6",
  label: "CV-1152",
  code: "SIL-CV-1152-A1124",
  cat: "Silicone"
}, {
  id: "k7",
  label: "RTV Silicone",
  code: "SIL-CV-2646-A0763",
  cat: "Silicone"
}, {
  id: "k8",
  label: "DC6-1104",
  code: "SIL-DC6-1104-A0087",
  cat: "Silicone"
}, {
  id: "k9",
  label: "R-2930 Thermal",
  code: "SIL-R-2930-A0291",
  cat: "Silicone"
}, {
  id: "p1",
  label: "Primer EC2646",
  code: "PRM-EC2646-A0101",
  cat: "Primer"
}, {
  id: "p2",
  label: "Primer 1200",
  code: "PRM-1200-A0102",
  cat: "Primer"
}];
var CAT_COLORS = {
  Flux: C.blue,
  Soudure: C.accent,
  Kapton: C.purple,
  Colle: C.green,
  Coating: C.blue,
  Silicone: C.yellow,
  Primer: "#e879a0",
  Autre: C.muted
};
var catalogFingerprint = function catalogFingerprint(items) {
  return items === null ? null : JSON.stringify(items.map(function (item) {
    return Object.keys(item).sort().map(function (key) {
      return [key, item[key]];
    });
  }));
};

// ─── Gestionnaire de la liste consommables (stockage partagé global) ────────
var ConsommableListManager = function ConsommableListManager(_ref68) {
  var items = _ref68.items,
    onClose = _ref68.onClose,
    onSave = _ref68.onSave;
  var _useState109 = useState(items.map(function (i) {
      return _objectSpread({}, i);
    })),
    _useState110 = _slicedToArray(_useState109, 2),
    list = _useState110[0],
    setList = _useState110[1];
  var _useState111 = useState({
      label: "",
      sap: "",
      code: "",
      cat: "Flux",
      polymerizationHours: ""
    }),
    _useState112 = _slicedToArray(_useState111, 2),
    newItem = _useState112[0],
    setNewItem = _useState112[1];
  var CATS = ["Flux", "Soudure", "Kapton", "Colle", "Coating", "Silicone", "Primer", "Autre"];
  var hasPolymerization = function hasPolymerization(item) {
    return supportsPolymerization(item);
  };
  var add = function add() {
    if (!newItem.label.trim()) return;
    setList(function (l) {
      return [].concat(_toConsumableArray(l), [_objectSpread({
        id: uid()
      }, newItem)]);
    });
    setNewItem({
      label: "",
      sap: "",
      code: "",
      cat: newItem.cat,
      polymerizationHours: ""
    });
  };
  var del = function del(id) {
    return setList(function (l) {
      return l.filter(function (i) {
        return i.id !== id;
      });
    });
  };
  var upd = function upd(id, f, v) {
    return setList(function (l) {
      return l.map(function (i) {
        return i.id === id ? _objectSpread(_objectSpread({}, i), {}, _defineProperty({}, f, v)) : i;
      });
    });
  };
  var move = function move(id, dir) {
    var idx = list.findIndex(function (i) {
      return i.id === id;
    });
    if (idx < 0) return;
    var nl = _toConsumableArray(list);
    var t = nl[idx + dir];
    nl[idx + dir] = nl[idx];
    nl[idx] = t;
    setList(nl);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 10,
      width: "100%",
      maxWidth: 940,
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 20px",
      borderBottom: "1px solid ".concat(C.border),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: C.text,
      fontSize: 14
    }
  }, "\u2699 G\xE9rer la liste des consommables"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return onSave(list);
    },
    color: C.green,
    small: true
  }, "\u2713 Enregistrer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: onClose,
    color: C.border,
    small: true
  }, "Annuler"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      borderBottom: "1px solid ".concat(C.border),
      background: C.input
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Ajouter un consommable"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto 100px auto",
      gap: 8,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "N\xB0 SAP"), /*#__PURE__*/React.createElement(Input, {
    value: newItem.sap || "",
    onChange: function onChange(v) {
      return setNewItem(function (n) {
        return _objectSpread(_objectSpread({}, n), {}, {
          sap: fmtSAP(v)
        });
      });
    },
    placeholder: "1600000046",
    small: true,
    style: {
      width: 118,
      fontFamily: "monospace"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "D\xC9SIGNATION"), /*#__PURE__*/React.createElement(Input, {
    value: newItem.label,
    onChange: function onChange(v) {
      return setNewItem(function (n) {
        return _objectSpread(_objectSpread({}, n), {}, {
          label: v
        });
      });
    },
    placeholder: "ex: Flux ELSOLD AP-10",
    small: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "CAT\xC9GORIE"), /*#__PURE__*/React.createElement("select", {
    value: newItem.cat,
    onChange: function onChange(e) {
      return setNewItem(function (n) {
        return _objectSpread(_objectSpread({}, n), {}, {
          cat: e.target.value
        });
      });
    },
    style: {
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "4px 8px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none"
    }
  }, CATS.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c
    }, c);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "POLYM\xC9RISATION [H]"), /*#__PURE__*/React.createElement(Input, {
    value: newItem.polymerizationHours || "",
    onChange: function onChange(v) {
      return setNewItem(function (n) {
        return _objectSpread(_objectSpread({}, n), {}, {
          polymerizationHours: v
        });
      });
    },
    type: "number",
    small: true,
    readOnly: !hasPolymerization(newItem),
    title: hasPolymerization(newItem) ? "Durée avant mise sous vide, en heures" : "Non applicable aux flux et soudures",
    style: _objectSpread({
      width: 92,
      textAlign: "center"
    }, !hasPolymerization(newItem) ? LOCKED_INPUT_STYLE : {})
  })), /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    color: C.accent,
    small: true
  }, "+ Ajouter"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 30
  }, "#"), /*#__PURE__*/React.createElement(TH, {
    w: 120
  }, "N\xB0 SAP"), /*#__PURE__*/React.createElement(TH, null, "D\xE9signation"), /*#__PURE__*/React.createElement(TH, {
    w: 110
  }, "Cat\xE9gorie"), /*#__PURE__*/React.createElement(TH, {
    w: 95
  }, "Polym. [h]"), /*#__PURE__*/React.createElement(TH, {
    w: 60
  }, "Ordre"), /*#__PURE__*/React.createElement(TH, {
    w: 30
  }))), /*#__PURE__*/React.createElement("tbody", null, list.map(function (item, i) {
    return /*#__PURE__*/React.createElement("tr", {
      key: item.id,
      style: {
        background: i % 2 === 0 ? "transparent" : C.stripe
      }
    }, /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted,
        fontSize: 10
      }
    }, i + 1)), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: item.sap || "",
      onChange: function onChange(v) {
        return upd(item.id, "sap", fmtSAP(v));
      },
      small: true,
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        width: 118
      },
      placeholder: "1600000046"
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: item.label,
      onChange: function onChange(v) {
        return upd(item.id, "label", v);
      },
      small: true
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("select", {
      value: item.cat || "Autre",
      onChange: function onChange(e) {
        return upd(item.id, "cat", e.target.value);
      },
      style: {
        background: C.input,
        border: "1px solid ".concat(CAT_COLORS[item.cat || "Autre"]),
        borderRadius: 4,
        color: CAT_COLORS[item.cat || "Autre"],
        padding: "3px 6px",
        fontSize: 10,
        fontFamily: "monospace",
        outline: "none"
      }
    }, CATS.map(function (c) {
      return /*#__PURE__*/React.createElement("option", {
        key: c
      }, c);
    }))), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, hasPolymerization(item) ? /*#__PURE__*/React.createElement(Input, {
      value: item.polymerizationHours || "",
      onChange: function onChange(v) {
        return upd(item.id, "polymerizationHours", v);
      },
      type: "number",
      small: true,
      title: "Dur\xE9e avant mise sous vide, en heures",
      style: {
        width: 78,
        textAlign: "center"
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted
      }
    }, "\u2014")), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 3,
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return move(item.id, -1);
      },
      disabled: i === 0,
      style: {
        background: "none",
        border: "none",
        color: i === 0 ? C.border : C.muted,
        cursor: i === 0 ? "default" : "pointer",
        fontSize: 12,
        padding: "2px 4px"
      }
    }, "\u25B2"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return move(item.id, +1);
      },
      disabled: i === list.length - 1,
      style: {
        background: "none",
        border: "none",
        color: i === list.length - 1 ? C.border : C.muted,
        cursor: i === list.length - 1 ? "default" : "pointer",
        fontSize: 12,
        padding: "2px 4px"
      }
    }, "\u25BC"))), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("span", {
      onClick: function onClick() {
        return del(item.id);
      },
      style: {
        cursor: "pointer",
        color: C.red,
        fontSize: 14,
        fontWeight: 700
      }
    }, "\xD7")));
  }))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 24
    }
  }, "Liste vide"))));
};

// ─── Onglet Consommables (matrice dynamique) ────────────────────────────────
// DP date status
// ─── Helpers date JJ.MM.AA ─────────────────────────────────────────────────
var normDP = function normDP(s) {
  if (!s) return s;
  s = s.trim();
  // Already formatted JJ.MM.AA
  if (/^\d{2}\.\d{2}\.\d{2}$/.test(s)) return s;
  // Digits only JJMMAA "270126" → "27.01.26"
  var d = s.replace(/\D/g, "");
  if (d.length === 6) return d.slice(0, 2) + "." + d.slice(2, 4) + "." + d.slice(4, 6);
  // JJ/MM/AA or JJ-MM-AA
  var m = s.match(/^(\d{2})[/\-](\d{2})[/\-](\d{2})$/);
  if (m) return m[1] + "." + m[2] + "." + m[3];
  return s;
};
var parseDMY = function parseDMY(s) {
  if (!s) return null;
  var n = normDP(s);
  var m = n.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;
  var _m = _slicedToArray(m, 4),
    dd = _m[1],
    mm = _m[2],
    yy = _m[3];
  var year = 2000 + Number(yy),
    month = Number(mm) - 1,
    day = Number(dd);
  var date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
};
var isValidDMY = function isValidDMY(s) {
  return !s || !!parseDMY(normDP(s));
};
var dateDayNumber = function dateDayNumber(d) {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000;
};
var dpStatus = function dpStatus(s, referenceDate) {
  var d = parseDMY(normDP(s));
  if (!d) return null;
  var reference = parseActivityDate(referenceDate) || new Date();
  var diff = dateDayNumber(d) - dateDayNumber(reference);
  if (diff < 0) return {
    color: C.red,
    label: "PÉRIMÉ",
    bg: "#da363340",
    days: diff
  };
  if (diff === 0) return {
    color: C.green,
    label: "OK",
    bg: "transparent",
    days: diff
  };
  if (diff < 30) return {
    color: C.yellow,
    label: "BIENTÔT",
    bg: "#d2992230",
    days: diff
  };
  return {
    color: C.green,
    label: "OK",
    bg: "transparent",
    days: diff
  };
};
var NON_POLYMERIZING_CATEGORIES = new Set(["FLUX", "SOUDURE"]);
var supportsPolymerization = function supportsPolymerization(consumable) {
  var category = String((consumable === null || consumable === void 0 ? void 0 : consumable.cat) || "").trim().toUpperCase();
  return !!category && !NON_POLYMERIZING_CATEGORIES.has(category);
};
var polymerizationStatus = function polymerizationStatus(consumable, lineDate) {
  var _consumable$polymeriz;
  var referenceDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Date();
  if (!supportsPolymerization(consumable)) return null;
  var hours = Number(String((_consumable$polymeriz = consumable === null || consumable === void 0 ? void 0 : consumable.polymerizationHours) !== null && _consumable$polymeriz !== void 0 ? _consumable$polymeriz : "").replace(",", "."));
  var start = parseActivityDate(lineDate);
  var reference = parseActivityDate(referenceDate) || new Date();
  if (!start || !Number.isFinite(hours) || hours <= 0) return null;
  var readyAt = new Date(start.getTime() + hours * 3600000);
  return {
    hours: hours,
    start: start,
    readyAt: readyAt,
    done: reference >= readyAt
  };
};
var formatAvailabilityDT = function formatAvailabilityDT(value) {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? "".concat(value.toLocaleDateString("fr-FR"), " \xE0 ").concat(value.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  })) : "date inconnue";
};

// ─── Onglet Consommables — 1 ligne par consommable, liste déroulante ─────────
// Custom dropdown for consommables — colored by category
var ConsoDropdown = function ConsoDropdown(_ref69) {
  var value = _ref69.value,
    onChange = _ref69.onChange,
    consommables = _ref69.consommables,
    cats = _ref69.cats,
    _ref69$display = _ref69.display,
    display = _ref69$display === void 0 ? "label" : _ref69$display;
  var _React$useState9 = React.useState(false),
    _React$useState0 = _slicedToArray(_React$useState9, 2),
    open = _React$useState0[0],
    setOpen = _React$useState0[1];
  var _React$useState1 = React.useState(""),
    _React$useState10 = _slicedToArray(_React$useState1, 2),
    query = _React$useState10[0],
    setQuery = _React$useState10[1];
  var _ref70 = React.useRef(null);
  var inputRef = React.useRef(null);
  React.useEffect(function () {
    var close = function close(e) {
      if (_ref70.current && !_ref70.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", close);
    return function () {
      return document.removeEventListener("mousedown", close);
    };
  }, []);

  // Focus search input when opening
  React.useEffect(function () {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);
  var selected = consommables.find(function (c) {
    return c.id === value;
  });
  var selColor = selected ? CAT_COLORS[selected.cat || "Autre"] || C.muted : C.muted;
  var q = query.trim().toLowerCase();
  var itemCode = function itemCode(c) {
    return compactArticleCode((c === null || c === void 0 ? void 0 : c.sap) || (c === null || c === void 0 ? void 0 : c.code) || "");
  };
  // If searching: flat filtered list; else: grouped by cat
  var filtered = q ? consommables.filter(function (c) {
    return (c.sap || "").replace(/\s/g, "").includes(q.replace(/\s/g, "")) || (c.code || "").toLowerCase().includes(q) || (c.label || "").toLowerCase().includes(q) || (c.cat || "").toLowerCase().includes(q);
  }) : null;
  var firstMatch = (filtered || consommables)[0];
  var displayValue = open || query ? query : selected ? display === "code" ? itemCode(selected) : selected.label : "";
  var handleSelect = function handleSelect(id) {
    onChange(id);
    setOpen(false);
    setQuery("");
  };
  var handleKeyDown = function handleKeyDown(e) {
    if (e.key === "Enter" && firstMatch) {
      e.preventDefault();
      handleSelect(firstMatch.id);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: _ref70,
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: displayValue,
    "aria-label": display === "code" ? "Code SAP du consommable" : "Désignation du consommable",
    onFocus: function onFocus() {
      return setOpen(true);
    },
    onClick: function onClick(e) {
      e.stopPropagation();
      setOpen(true);
    },
    onChange: function onChange(e) {
      setQuery(e.target.value);
      setOpen(true);
    },
    onKeyDown: handleKeyDown,
    placeholder: "Taper SAP ou d\xE9signation...",
    title: "Taper un N\xB0 SAP ou une d\xE9signation, Entr\xE9e s\xE9lectionne le premier r\xE9sultat",
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(!value ? C.yellow : selColor),
      borderRadius: 4,
      padding: "4px 8px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none",
      boxSizing: "border-box",
      color: selected && !open && !query ? selColor : C.text
    }
  }), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      zIndex: 9999,
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      boxShadow: "0 8px 32px #000c",
      width: 280,
      maxHeight: 320,
      display: "flex",
      flexDirection: "column",
      marginTop: 2
    },
    ref: function ref(el) {
      if (el && _ref70.current) {
        var rect = _ref70.current.getBoundingClientRect();
        var spaceBelow = window.innerHeight - rect.bottom;
        var h = Math.min(320, el.scrollHeight || 320);
        el.style.left = rect.left + "px";
        el.style.width = Math.max(320, rect.width) + "px";
        if (spaceBelow > h + 8) {
          el.style.top = rect.bottom + 2 + "px";
          el.style.bottom = "";
        } else {
          el.style.bottom = window.innerHeight - rect.top + 2 + "px";
          el.style.top = "";
        }
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return handleSelect("");
    },
    style: {
      padding: "5px 10px",
      fontSize: 11,
      color: C.muted,
      cursor: "pointer",
      borderBottom: "1px solid ".concat(C.border),
      flexShrink: 0
    },
    onMouseEnter: function onMouseEnter(e) {
      return e.currentTarget.style.background = C.hover;
    },
    onMouseLeave: function onMouseLeave(e) {
      return e.currentTarget.style.background = "transparent";
    }
  }, "\u2014 aucun \u2014"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      flex: 1
    }
  }, filtered ? filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px",
      textAlign: "center",
      color: C.muted,
      fontSize: 11
    }
  }, "Aucun r\xE9sultat") : filtered.map(function (c) {
    var catCol = CAT_COLORS[c.cat || "Autre"] || C.muted;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onClick: function onClick() {
        return handleSelect(c.id);
      },
      style: {
        padding: "5px 14px",
        fontSize: 11,
        fontFamily: "monospace",
        cursor: "pointer",
        color: catCol,
        borderLeft: "3px solid ".concat(catCol),
        borderBottom: "1px solid ".concat(C.border, "22")
      },
      onMouseEnter: function onMouseEnter(e) {
        return e.currentTarget.style.background = catCol + "22";
      },
      onMouseLeave: function onMouseLeave(e) {
        return e.currentTarget.style.background = "transparent";
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, itemCode(c) || "—"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted,
        marginLeft: 6
      }
    }, "\u2014 ", c.label), /*#__PURE__*/React.createElement("span", {
      style: {
        color: catCol,
        opacity: .6,
        fontSize: 9,
        marginLeft: 6
      }
    }, "[", c.cat, "]"));
  }) : cats.map(function (cat) {
    var items = consommables.filter(function (c) {
      return (c.cat || "Autre") === cat;
    });
    if (!items.length) return null;
    var catCol = CAT_COLORS[cat] || C.muted;
    return /*#__PURE__*/React.createElement("div", {
      key: cat
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "4px 10px",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 1,
        color: catCol,
        background: C.input,
        textTransform: "uppercase",
        borderBottom: "1px solid ".concat(C.border, "33"),
        position: "sticky",
        top: 0
      }
    }, cat), items.map(function (c) {
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        onClick: function onClick() {
          return handleSelect(c.id);
        },
        style: {
          padding: "5px 14px",
          fontSize: 11,
          fontFamily: "monospace",
          cursor: "pointer",
          color: catCol,
          borderLeft: "3px solid ".concat(catCol),
          borderBottom: "1px solid ".concat(C.border, "22")
        },
        onMouseEnter: function onMouseEnter(e) {
          return e.currentTarget.style.background = catCol + "22";
        },
        onMouseLeave: function onMouseLeave(e) {
          return e.currentTarget.style.background = "transparent";
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 700
        }
      }, itemCode(c) || "—"), /*#__PURE__*/React.createElement("span", {
        style: {
          color: C.muted,
          marginLeft: 6
        }
      }, "\u2014 ", c.label));
    }));
  }))));
};
var CONSO_OP_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "fiche",
  label: "Fiche suiveuse"
}, {
  key: "op",
  label: "OP"
}];
var CONSO_ITEM_EDIT_FIELDS = [{
  key: "consoId",
  label: "Consommable"
}, {
  key: "echantillon",
  label: "N° échantillon"
}, {
  key: "lot",
  label: "LOT"
}, {
  key: "dp",
  label: "DP"
}, {
  key: "tracaOk",
  label: "Traça"
}, {
  key: "comments",
  label: "Commentaires"
}];
var TabConsommables = function TabConsommables(_ref71) {
  var _header$_defaultSnIds4, _header$_snRows2;
  var data = _ref71.data,
    onChange = _ref71.onChange,
    user = _ref71.user,
    _ref71$perms = _ref71.perms,
    perms = _ref71$perms === void 0 ? {} : _ref71$perms,
    consommables = _ref71.consommables,
    onEditList = _ref71.onEditList,
    header = _ref71.header,
    _ref71$forceShowDelet = _ref71.forceShowDeleted,
    forceShowDeleted = _ref71$forceShowDelet === void 0 ? false : _ref71$forceShowDelet,
    contextData = _ref71.contextData,
    onCopyAcross = _ref71.onCopyAcross;
  // Stockage conserve opérations → consommables, mais l'interface affiche une ligne plate par consommable.
  var ops = data.ops || [];
  var canEditOp = function canEditOp(op) {
    return canEditLine(user, op);
  };
  var canEditItem = function canEditItem(op, it) {
    return canEditLine(user, it) && canEditLine(user, op);
  };
  var _useState113 = useState(null),
    _useState114 = _slicedToArray(_useState113, 2),
    deleteOpTarget = _useState114[0],
    setDeleteOpTarget = _useState114[1];
  var _useState115 = useState(null),
    _useState116 = _slicedToArray(_useState115, 2),
    deleteItemTarget = _useState116[0],
    setDeleteItemTarget = _useState116[1]; // {oid, iid}
  var _useState117 = useState(null),
    _useState118 = _slicedToArray(_useState117, 2),
    restoreOpTarget = _useState118[0],
    setRestoreOpTarget = _useState118[1];
  var _useState119 = useState(null),
    _useState120 = _slicedToArray(_useState119, 2),
    restoreItemTarget = _useState120[0],
    setRestoreItemTarget = _useState120[1]; // {oid, iid}
  var _useState121 = useState(false),
    _useState122 = _slicedToArray(_useState121, 2),
    showDeleted = _useState122[0],
    setShowDeleted = _useState122[1];
  var _useState123 = useState({
      snTarget: workSnFilter(header),
      date: "",
      visa: "",
      fiche: "",
      op: "",
      sap: "",
      conso: "",
      echantillon: "",
      lot: "",
      dp: "",
      traca: "all",
      remarque: ""
    }),
    _useState124 = _slicedToArray(_useState123, 2),
    filters = _useState124[0],
    setFilters = _useState124[1];
  var _useState125 = useState(function () {
      return new Date();
    }),
    _useState126 = _slicedToArray(_useState125, 2),
    polymerizationNow = _useState126[0],
    setPolymerizationNow = _useState126[1];
  useEffect(function () {
    var timer = setInterval(function () {
      return setPolymerizationNow(new Date());
    }, 60000);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  useEffect(function () {
    return setFilters(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, {
        snTarget: workSnFilter(header)
      });
    });
  }, [header === null || header === void 0 || (_header$_defaultSnIds4 = header._defaultSnIds) === null || _header$_defaultSnIds4 === void 0 ? void 0 : _header$_defaultSnIds4.join("|"), header === null || header === void 0 || (_header$_snRows2 = header._snRows) === null || _header$_snRows2 === void 0 ? void 0 : _header$_snRows2.length]);
  var cats = _toConsumableArray(new Set(consommables.map(function (i) {
    return i.cat || "Autre";
  })));
  var getConso = function getConso(id) {
    return consommables.find(function (c) {
      return c.id === id;
    });
  };
  var makeItem = function makeItem() {
    return {
      id: uid(),
      createdDT: nowDT(),
      createdVisa: user.trigram,
      consoId: "",
      echantillon: "",
      lot: "",
      dp: "",
      remarque: "",
      tracaOk: false,
      visaTraca: "",
      dateTraca: "",
      comments: [],
      deleted: false,
      deletedReason: "",
      deletedVisa: "",
      deletedDate: ""
    };
  };
  var makeOp = function makeOp(scope, last, item) {
    return _objectSpread(_objectSpread({
      id: uid(),
      createdDT: nowDT(),
      createdVisa: user.trigram
    }, scope), {}, {
      fiche: (last === null || last === void 0 ? void 0 : last.fiche) || "",
      op: (last === null || last === void 0 ? void 0 : last.op) || "",
      ficheOpUpdatedAt: Date.now(),
      validated: false,
      connError: "",
      deleted: false,
      deletedReason: "",
      deletedVisa: "",
      deletedDate: "",
      items: [item || makeItem()]
    });
  };
  var lastContext = function lastContext() {
    var scope = defaultSnScope(header);
    var last = latestSharedFicheOp(contextData || {
      consommables: data
    }, header);
    return {
      scope: scope,
      last: last
    };
  };

  // ── Opérations ──────────────────────────────────────────────
  var addOp = function addOp() {
    if (!perms.canWrite) return;
    var _lastContext = lastContext(),
      scope = _lastContext.scope,
      last = _lastContext.last;
    onChange({
      ops: [].concat(_toConsumableArray(ops), [makeOp(scope, last)])
    });
  };
  var dupLine = function dupLine(oid, iid) {
    if (!perms.canWrite) return;
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (!o) return;
    var it = (o.items || []).find(function (x) {
      return x.id === iid;
    });
    if (onCopyAcross && it && !o.deleted && !it.deleted) {
      onCopyAcross(_objectSpread(_objectSpread({}, o), {}, {
        items: [it]
      }));
      return;
    }
    var clone = makeItem();
    var clonedItem = it ? _objectSpread(_objectSpread({}, clone), {}, {
      consoId: it.consoId || "",
      echantillon: it.echantillon || "",
      lot: it.lot || "",
      dp: it.dp || "",
      remarque: it.remarque || "",
      comments: it.comments ? _toConsumableArray(it.comments) : [],
      tracaOk: false,
      visaTraca: "",
      dateTraca: ""
    }) : clone;
    var newOp = makeOp({
      snScope: o.snScope,
      snIds: _toConsumableArray(o.snIds || [])
    }, o, clonedItem);
    onChange({
      ops: [].concat(_toConsumableArray(ops), [newOp])
    });
  };
  var updOp = function updOp(oid, f, v) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (canEditOp(o)) onChange({
      ops: scopedRowsPatch(ops, oid, header, _objectSpread(_defineProperty({}, f, v), ["fiche", "op"].includes(f) ? {
        ficheOpUpdatedAt: Date.now()
      } : {}))
    });
  };
  var patchOp = function patchOp(oid, fields) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (canEditOp(o)) onChange({
      ops: scopedRowsPatch(ops, oid, header, fields)
    });
  };
  var validateOp = function validateOp(oid) {
    var _o$fiche, _o$op;
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (!canEditOp(o)) return;
    if (!(o !== null && o !== void 0 && (_o$fiche = o.fiche) !== null && _o$fiche !== void 0 && _o$fiche.trim()) || !(o !== null && o !== void 0 && (_o$op = o.op) !== null && _o$op !== void 0 && _o$op.trim())) {
      onChange({
        ops: ops.map(function (x) {
          return x.id === oid ? _objectSpread(_objectSpread({}, x), {}, {
            connError: "Fiche suiveuse et OP requis"
          }) : x;
        })
      });
      return;
    }
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (o) {
        return withEditHistory(_objectSpread(_objectSpread({}, o), {}, {
          connError: ""
        }), user, CONSO_OP_EDIT_FIELDS);
      })
    });
  };
  var unlockOp = function unlockOp(oid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (canEditOp(o)) onChange({
      ops: ops.map(function (o) {
        return o.id === oid ? _objectSpread(_objectSpread({}, o), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(o, CONSO_OP_EDIT_FIELDS)
        }) : o;
      })
    });
  };
  var confirmDelOp = function confirmDelOp(reason) {
    var o = ops.find(function (x) {
      return x.id === deleteOpTarget;
    });
    if (canEditOp(o)) onChange({
      ops: scopedRowsDelete(ops, deleteOpTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });
    setDeleteOpTarget(null);
  };
  var restoreOp = function restoreOp(reason) {
    onChange({
      ops: ops.map(function (o) {
        return o.id === restoreOpTarget ? _objectSpread(_objectSpread({}, o), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: user.trigram,
          restoredDate: nowDT()
        }) : o;
      })
    });
    setRestoreOpTarget(null);
  };
  var dupOp = function dupOp(oid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (!o) return;
    if (!perms.canWrite) return;
    var clone = _objectSpread(_objectSpread({}, o), {}, {
      id: uid(),
      createdDT: nowDT(),
      createdVisa: user.trigram,
      validated: false,
      connError: "",
      deleted: false,
      deletedReason: "",
      deletedVisa: "",
      deletedDate: "",
      items: []
    });
    onChange({
      ops: [].concat(_toConsumableArray(ops), [clone])
    });
  };

  // ── Items (consommables) ─────────────────────────────────────
  var addItem = function addItem(oid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (!o) return;
    if (!canEditOp(o)) return;
    onChange({
      ops: ops.map(function (x) {
        return x.id !== oid ? x : _objectSpread(_objectSpread({}, x), {}, {
          items: [].concat(_toConsumableArray(x.items || []), [makeItem()])
        });
      })
    });
  };
  var updItem = function updItem(oid, iid, f, v) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (f === "comments" ? !perms.canComment : !canEditItem(o, it)) return;
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (o) {
        return {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, _defineProperty({}, f, v)) : it;
          })
        };
      })
    });
  };
  var delItem = function delItem(oid, iid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    if (!canEditOp(o)) return;
    if (iid === "__empty_" + oid) {
      onChange({
        ops: ops.filter(function (x) {
          return x.id !== oid;
        })
      });
      return;
    }
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!canEditItem(o, it)) return;
    if (!it) return;
    var isDraft = !it.validated && !(o !== null && o !== void 0 && o.validated) && !it.editBase && !(o !== null && o !== void 0 && o.editBase) && !it.tracaOk && !it.deleted && !(o !== null && o !== void 0 && o.deleted);
    if (isDraft) {
      var isOnlyDraft = (o.items || []).length <= 1;
      onChange({
        ops: isOnlyDraft ? ops.filter(function (x) {
          return x.id !== oid;
        }) : ops.map(function (x) {
          return x.id !== oid ? x : _objectSpread(_objectSpread({}, x), {}, {
            items: (x.items || []).filter(function (i) {
              return i.id !== iid;
            })
          });
        })
      });
    } else if (!it.validated || !o.validated) {
      onChange({
        ops: scopedRowsDelete(ops, oid, header, function (op) {
          return {
            items: op.items.map(function (item) {
              return item.id === iid ? _objectSpread(_objectSpread({}, item), {}, {
                deleted: true,
                deletedReason: "",
                deletedVisa: user.trigram,
                deletedDate: nowDT()
              }) : item;
            })
          };
        })
      });
    } else setDeleteItemTarget({
      oid: oid,
      iid: iid
    });
  };
  var confirmDelItem = function confirmDelItem(reason) {
    var oid = deleteItemTarget.oid,
      iid = deleteItemTarget.iid;
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (canEditItem(o, it)) onChange({
      ops: scopedRowsDelete(ops, oid, header, function (o) {
        return {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              deleted: true,
              deletedReason: reason,
              deletedVisa: user.trigram,
              deletedDate: nowDT()
            }) : it;
          })
        };
      })
    });
    setDeleteItemTarget(null);
  };
  var restoreItem = function restoreItem(reason) {
    var oid = restoreItemTarget.oid,
      iid = restoreItemTarget.iid;
    onChange({
      ops: ops.map(function (o) {
        return o.id !== oid ? o : _objectSpread(_objectSpread({}, o), {}, {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              deleted: false,
              restoredReason: reason,
              restoredVisa: user.trigram,
              restoredDate: nowDT()
            }) : it;
          })
        });
      })
    });
    setRestoreItemTarget(null);
  };
  var stampTraca = function stampTraca(oid, iid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!o || !it || o.deleted || it.deleted || !perms.canTraceability) return;
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (o) {
        return {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              tracaOk: true,
              visaTraca: user.trigram,
              dateTraca: nowDT()
            }) : it;
          })
        };
      })
    });
  };
  var clearTraca = function clearTraca(oid, iid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!o || !it || o.deleted || it.deleted || !it.tracaOk || !perms.canTraceability) return;
    if (!window.confirm("Annuler la validation de traçabilité de ce consommable ?")) return;
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (o) {
        return {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              tracaOk: false,
              visaTraca: "",
              dateTraca: "",
              tracaCancellationHistory: [].concat(_toConsumableArray(it.tracaCancellationHistory || []), [{
                visaTraca: it.visaTraca,
                dateTraca: it.dateTraca,
                cancelledVisa: user.trigram,
                cancelledDT: nowDT()
              }])
            }) : it;
          })
        };
      })
    });
  };
  var setTracaDate = function setTracaDate(oid, iid, v) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!o || !it || o.deleted || it.deleted || !perms.canTraceability) return;
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (o) {
        return {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              dateTraca: v
            }) : it;
          })
        };
      })
    });
  };
  var validateItem = function validateItem(oid, iid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!canEditItem(o, it)) return;
    if (!it) return;
    var miss = [];
    if (!it.consoId) miss.push("Consommable");
    if (!it.lot) miss.push("LOT");
    if (!it.dp) miss.push("DP");
    if (it.dp && !isValidDMY(it.dp)) miss.push("DP invalide (JJ.MM.AA)");
    if (miss.length) {
      onChange({
        ops: ops.map(function (x) {
          return x.id !== oid ? x : _objectSpread(_objectSpread({}, x), {}, {
            items: x.items.map(function (i) {
              return i.id === iid ? _objectSpread(_objectSpread({}, i), {}, {
                validError: "Requis : " + miss.join(", ")
              }) : i;
            })
          });
        })
      });
      return;
    }
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (o) {
        return {
          items: o.items.map(function (i) {
            return i.id === iid ? withEditHistory(_objectSpread(_objectSpread({}, i), {}, {
              validError: ""
            }), user, CONSO_ITEM_EDIT_FIELDS) : i;
          })
        };
      })
    });
  };
  var unlockItem = function unlockItem(oid, iid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!canEditItem(o, it)) return;
    onChange({
      ops: ops.map(function (o) {
        return o.id !== oid ? o : _objectSpread(_objectSpread({}, o), {}, {
          items: o.items.map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              validated: false,
              _scopeEditConfirmed: false,
              editBase: snapshotFields(it, CONSO_ITEM_EDIT_FIELDS)
            }) : it;
          })
        });
      })
    });
  };
  var validateLine = function validateLine(oid, iid) {
    var _o$fiche2, _o$op2;
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!canEditItem(o, it)) return;
    if (!o || !it) return;
    var opMissing = [];
    if (!((_o$fiche2 = o.fiche) !== null && _o$fiche2 !== void 0 && _o$fiche2.trim())) opMissing.push("Fiche suiveuse");
    if (!((_o$op2 = o.op) !== null && _o$op2 !== void 0 && _o$op2.trim())) opMissing.push("OP");
    var itemMissing = [];
    if (!it.consoId) itemMissing.push("Consommable");
    if (!it.lot) itemMissing.push("LOT");
    if (!it.dp) itemMissing.push("DP");
    if (it.dp && !isValidDMY(it.dp)) itemMissing.push("DP invalide (JJ.MM.AA)");
    if (opMissing.length || itemMissing.length) {
      onChange({
        ops: ops.map(function (x) {
          return x.id !== oid ? x : _objectSpread(_objectSpread({}, x), {}, {
            connError: opMissing.length ? "Requis : " + opMissing.join(", ") : "",
            items: (x.items || []).map(function (i) {
              return i.id === iid ? _objectSpread(_objectSpread({}, i), {}, {
                validError: itemMissing.length ? "Requis : " + itemMissing.join(", ") : ""
              }) : i;
            })
          });
        })
      });
      return;
    }
    onChange({
      ops: scopedRowsPatch(ops, oid, header, function (x) {
        return withEditHistory(_objectSpread(_objectSpread({}, x), {}, {
          connError: "",
          items: (x.items || []).map(function (i) {
            return i.id === iid ? withEditHistory(_objectSpread(_objectSpread({}, i), {}, {
              validError: ""
            }), user, CONSO_ITEM_EDIT_FIELDS) : i;
          })
        }), user, CONSO_OP_EDIT_FIELDS);
      })
    });
  };
  var unlockLine = function unlockLine(oid, iid) {
    var o = ops.find(function (x) {
      return x.id === oid;
    });
    var it = ((o === null || o === void 0 ? void 0 : o.items) || []).find(function (x) {
      return x.id === iid;
    });
    if (!canEditItem(o, it)) return;
    onChange({
      ops: ops.map(function (o) {
        return o.id !== oid ? o : _objectSpread(_objectSpread({}, o), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(o, CONSO_OP_EDIT_FIELDS),
          items: (o.items || []).map(function (it) {
            return it.id === iid ? _objectSpread(_objectSpread({}, it), {}, {
              validated: false,
              _scopeEditConfirmed: false,
              editBase: snapshotFields(it, CONSO_ITEM_EDIT_FIELDS)
            }) : it;
          })
        });
      })
    });
  };
  var totalDelOps = ops.filter(function (o) {
    return o.deleted;
  }).length;
  var flatRows = ops.flatMap(function (o) {
    var realItems = o.items || [];
    return (realItems.length ? realItems : [{
      id: "__empty_" + o.id,
      empty: true,
      createdDT: o.createdDT,
      createdVisa: o.createdVisa,
      consoId: "",
      echantillon: "",
      lot: "",
      dp: "",
      remarque: ""
    }]).map(function (it) {
      return {
        o: o,
        it: it,
        oid: o.id,
        iid: it.id
      };
    });
  });
  var visibleRows = sortByNewestOperation(flatRows.filter(function (_ref72) {
    var o = _ref72.o,
      it = _ref72.it;
    if (o.deleted && !showDeleted && !forceShowDeleted) return false;
    if (it.deleted && !showDeleted && !forceShowDeleted) return false;
    if (!_rowMatchesSnFilter(o, filters.snTarget, header)) return false;
    var conso = getConso(it.consoId);
    var consoText = [conso === null || conso === void 0 ? void 0 : conso.sap, conso === null || conso === void 0 ? void 0 : conso.label, conso === null || conso === void 0 ? void 0 : conso.cat, it.consoId].filter(Boolean).join(" ");
    var txt = function txt(v) {
      return String(v || "").toUpperCase();
    };
    if (filters.date && !txt(it.createdDT || o.createdDT).includes(txt(filters.date))) return false;
    if (filters.visa && !txt(it.createdVisa || o.createdVisa).includes(txt(filters.visa))) return false;
    if (filters.fiche && !txt(o.fiche).includes(txt(filters.fiche))) return false;
    if (filters.op && !txt(o.op).includes(txt(filters.op))) return false;
    if (filters.sap && !compactArticleCode((conso === null || conso === void 0 ? void 0 : conso.sap) || (conso === null || conso === void 0 ? void 0 : conso.code) || "").toUpperCase().includes(compactArticleCode(filters.sap).toUpperCase())) return false;
    if (filters.conso && !txt(consoText).includes(txt(filters.conso))) return false;
    if (filters.echantillon && !txt(it.echantillon).includes(txt(filters.echantillon))) return false;
    if (filters.lot && !txt(it.lot).includes(txt(filters.lot))) return false;
    if (filters.dp && !txt(it.dp).includes(txt(filters.dp))) return false;
    var commentText = (it.comments || []).map(function (c) {
      return c.text;
    }).join(" ");
    if (filters.remarque && !txt([it.remarque, commentText].filter(Boolean).join(" ")).includes(txt(filters.remarque))) return false;
    if (filters.traca === "yes" && !it.tracaOk) return false;
    if (filters.traca === "no" && it.tracaOk) return false;
    return true;
  }), function (entry) {
    var _entry$it, _entry$o;
    return ((_entry$it = entry.it) === null || _entry$it === void 0 ? void 0 : _entry$it.createdDT) || ((_entry$o = entry.o) === null || _entry$o === void 0 ? void 0 : _entry$o.createdDT);
  }, function (entry) {
    var _entry$it$validated, _entry$it2, _entry$o2, _entry$it3, _entry$o3;
    return !((_entry$it$validated = (_entry$it2 = entry.it) === null || _entry$it2 === void 0 ? void 0 : _entry$it2.validated) !== null && _entry$it$validated !== void 0 ? _entry$it$validated : (_entry$o2 = entry.o) === null || _entry$o2 === void 0 ? void 0 : _entry$o2.validated) && !((_entry$it3 = entry.it) !== null && _entry$it3 !== void 0 && _entry$it3.deleted) && !((_entry$o3 = entry.o) !== null && _entry$o3 !== void 0 && _entry$o3.deleted);
  });
  var hasFilters = Object.entries(filters).some(function (_ref73) {
    var _ref74 = _slicedToArray(_ref73, 2),
      k = _ref74[0],
      v = _ref74[1];
    return v !== "all" && filterHasValue(v);
  });
  var clearFilters = function clearFilters() {
    return setFilters({
      snTarget: workSnFilter(header),
      date: "",
      visa: "",
      fiche: "",
      op: "",
      sap: "",
      conso: "",
      echantillon: "",
      lot: "",
      dp: "",
      traca: "all",
      remarque: ""
    });
  };
  var expirySummary = visibleRows.reduce(function (summary, _ref75) {
    var o = _ref75.o,
      it = _ref75.it;
    if (it.dp && !isValidDMY(it.dp)) summary.invalid++;else {
      var status = dpStatus(it.dp, it.createdDT || o.createdDT);
      if ((status === null || status === void 0 ? void 0 : status.label) === "PÉRIMÉ") summary.expired++;
      if ((status === null || status === void 0 ? void 0 : status.label) === "BIENTÔT") summary.soon++;
    }
    return summary;
  }, {
    expired: 0,
    soon: 0,
    invalid: 0
  });
  var expiryParts = [expirySummary.expired && "".concat(expirySummary.expired, " p\xE9rim\xE9").concat(expirySummary.expired > 1 ? "s" : ""), expirySummary.soon && "".concat(expirySummary.soon, " bient\xF4t"), expirySummary.invalid && "".concat(expirySummary.invalid, " date").concat(expirySummary.invalid > 1 ? "s" : "", " invalide").concat(expirySummary.invalid > 1 ? "s" : "")].filter(Boolean);
  var polymerizations = visibleRows.flatMap(function (_ref76) {
    var o = _ref76.o,
      it = _ref76.it;
    if (!o.validated || !it.validated) return [];
    var consumable = getConso(it.consoId);
    var status = polymerizationStatus(consumable, it.createdDT || o.createdDT, polymerizationNow);
    return status ? [_objectSpread(_objectSpread({}, status), {}, {
      consumable: consumable,
      o: o,
      it: it
    })] : [];
  });
  var vacuumReadyAt = polymerizations.reduce(function (latest, p) {
    return !latest || p.readyAt > latest ? p.readyAt : latest;
  }, null);
  var vacuumPending = polymerizations.some(function (p) {
    return !p.done;
  });
  var vacuumTitle = polymerizations.map(function (p) {
    return "".concat(snScopeLabel(p.o, snRowsFromHeader(header)), " \u2014 ").concat(p.consumable.label || p.consumable.sap || "Consommable", " : sous vide d\xE8s le ").concat(formatAvailabilityDT(p.readyAt));
  }).join("\n");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1500
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement(Btn, {
    onClick: addOp,
    small: true
  }, "+ Ligne"), expiryParts.length > 0 && /*#__PURE__*/React.createElement("span", {
    title: "Anomalies de p\xE9remption des consommables affich\xE9s",
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 4,
      border: "2px solid ".concat(expirySummary.expired || expirySummary.invalid ? C.red : C.yellow),
      background: (expirySummary.expired || expirySummary.invalid ? C.red : C.yellow) + "20",
      color: expirySummary.expired || expirySummary.invalid ? C.red : C.yellow,
      fontSize: 12,
      fontWeight: 900,
      fontFamily: "monospace",
      whiteSpace: "nowrap"
    }
  }, "\u26A0 ", expiryParts.join(" · ")), vacuumReadyAt && /*#__PURE__*/React.createElement("span", {
    title: vacuumTitle,
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 4,
      border: "2px solid ".concat(vacuumPending ? C.yellow : C.green),
      background: (vacuumPending ? C.yellow : C.green) + "20",
      color: vacuumPending ? C.yellow : C.green,
      fontSize: 12,
      fontWeight: 900,
      fontFamily: "monospace",
      whiteSpace: "nowrap"
    }
  }, vacuumPending ? "◷ POLYMÉRISATION — SOUS VIDE DÈS LE" : "✓ SOUS VIDE POSSIBLE DEPUIS LE", " ", formatAvailabilityDT(vacuumReadyAt))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, perms.canManageLists && /*#__PURE__*/React.createElement(Btn, {
    onClick: onEditList,
    color: C.border,
    small: true
  }, "\u2699 G\xE9rer la liste"), totalDelOps > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulées" : "▼ Voir annulées"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      overflowX: "auto",
      border: "1px solid ".concat(C.border),
      borderRadius: 8,
      maxHeight: "calc(100vh - 330px)"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: C.raised
    }
  }, /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Date / Heure"), /*#__PURE__*/React.createElement(TH, {
    w: 34,
    color: C.accent
  }, "Visa"), /*#__PURE__*/React.createElement(TH, {
    w: 82
  }, "SN(s)"), /*#__PURE__*/React.createElement(TH, {
    w: 82
  }, "Fiche suiveuse"), /*#__PURE__*/React.createElement(TH, {
    w: 34
  }, "OP"), /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Code SAP"), /*#__PURE__*/React.createElement(TH, {
    w: 180
  }, "D\xE9signation"), /*#__PURE__*/React.createElement(TH, {
    w: 132
  }, "LOT"), /*#__PURE__*/React.createElement(TH, {
    w: 62
  }, "DP"), /*#__PURE__*/React.createElement(TH, {
    w: 68
  }, "N\xB0 \xE9chant."), /*#__PURE__*/React.createElement(TH, {
    w: 145
  }, "Sous vide d\xE8s"), /*#__PURE__*/React.createElement(TH, {
    w: 52,
    color: C.green
  }, "Tra\xE7a"), /*#__PURE__*/React.createElement(TH, {
    w: 28
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("th", {
    style: {
      position: "sticky",
      right: 0,
      zIndex: 3,
      background: C.raised,
      color: C.muted,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: .8,
      textTransform: "uppercase",
      padding: "6px 8px",
      textAlign: "center",
      borderBottom: "1px solid ".concat(C.border),
      whiteSpace: "nowrap",
      width: 110
    }
  })), /*#__PURE__*/React.createElement("tr", {
    style: {
      background: C.blue + "0c",
      borderBottom: "2px solid ".concat(C.border)
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.date,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          date: v
        });
      });
    },
    small: true,
    title: "Filtrer date"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.visa,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          visa: v
        });
      });
    },
    small: true,
    title: "Filtrer visa"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(SnFilter, {
    value: filters.snTarget,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          snTarget: v
        });
      });
    },
    header: header
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.fiche,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          fiche: v
        });
      });
    },
    small: true,
    title: "Filtrer fiche suiveuse"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.op,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          op: v
        });
      });
    },
    small: true,
    title: "Filtrer OP"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.sap,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          sap: v
        });
      });
    },
    small: true,
    title: "Filtrer code SAP"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.conso,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          conso: v
        });
      });
    },
    small: true,
    title: "Filtrer consommable"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.lot,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          lot: v
        });
      });
    },
    small: true,
    title: "Filtrer LOT"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.dp,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          dp: v
        });
      });
    },
    small: true,
    title: "Filtrer DP"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.echantillon,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          echantillon: v
        });
      });
    },
    small: true,
    title: "Filtrer N\xB0 \xE9chantillon"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: filters.traca,
    onChange: function onChange(e) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          traca: e.target.value
        });
      });
    },
    style: {
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "4px 6px",
      fontSize: 10,
      fontFamily: "monospace",
      outline: "none",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "*"), /*#__PURE__*/React.createElement("option", {
    value: "yes"
  }, "Oui"), /*#__PURE__*/React.createElement("option", {
    value: "no"
  }, "Non"))), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: "3px 4px"
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: filters.remarque,
    onChange: function onChange(v) {
      return setFilters(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          remarque: v
        });
      });
    },
    small: true,
    title: "Filtrer remarque"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      position: "sticky",
      right: 0,
      zIndex: 3,
      background: C.raised,
      padding: "3px 4px",
      textAlign: "center"
    }
  }, hasFilters && /*#__PURE__*/React.createElement(IconBtn, {
    onClick: clearFilters,
    color: C.border,
    title: "Effacer les filtres"
  }, "\xD7")))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.flatMap(function (_ref77, idx) {
    var o = _ref77.o,
      it = _ref77.it,
      oid = _ref77.oid,
      iid = _ref77.iid;
    var conso = getConso(it.consoId);
    var consoCode = compactArticleCode((conso === null || conso === void 0 ? void 0 : conso.sap) || (conso === null || conso === void 0 ? void 0 : conso.code) || "");
    var catColor = CAT_COLORS[(conso === null || conso === void 0 ? void 0 : conso.cat) || "Autre"] || C.muted;
    var lineDate = it.createdDT || o.createdDT;
    var st = dpStatus(it.dp, lineDate);
    var polymerization = polymerizationStatus(conso, lineDate, polymerizationNow);
    var inv = it.dp && !isValidDMY(it.dp);
    var opDeleted = o.deleted;
    var rowDeleted = opDeleted || it.deleted;
    var valid = !!o.validated && !!it.validated;
    var editable = canEditItem(o, it);
    var locked = valid || !editable;
    var rowKey = "".concat(oid, "_").concat(iid);
    return [/*#__PURE__*/React.createElement("tr", {
      key: rowKey,
      style: {
        background: rowDeleted ? "#da363318" : it.tracaOk ? "#23863610" : idx % 2 === 0 ? "transparent" : C.stripe,
        borderLeft: "3px solid ".concat(rowDeleted ? C.red : it.tracaOk ? C.green : valid ? C.green : conso ? catColor : C.border),
        textDecoration: rowDeleted ? "line-through" : undefined,
        opacity: rowDeleted ? .6 : 1,
        pointerEvents: rowDeleted ? "none" : undefined
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 10,
        color: C.muted
      }
    }, it.createdDT || o.createdDT || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800,
        fontSize: 12,
        color: C.accent
      }
    }, it.createdVisa || o.createdVisa || "—"), /*#__PURE__*/React.createElement(CopyOriginMark, {
      origin: it.copyOrigin || o.copyOrigin
    })), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: rowDeleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement(CopyCell, {
      value: snScopeLabel(o, snRowsFromHeader(header)),
      title: "Copier SN cible"
    }, /*#__PURE__*/React.createElement(SnScopePicker, {
      row: o,
      header: header,
      onChange: function onChange(fields) {
        return patchOp(oid, fields);
      },
      disabled: locked
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: o.fiche,
      onChange: function onChange(v) {
        return updOp(oid, "fiche", v);
      },
      small: true,
      readOnly: locked,
      style: _objectSpread({
        fontFamily: "monospace"
      }, locked ? LOCKED_INPUT_STYLE : {
        borderColor: !o.fiche ? C.yellow : C.border
      })
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: o.op,
      onChange: function onChange(v) {
        return updOp(oid, "op", v);
      },
      small: true,
      readOnly: locked,
      style: _objectSpread({
        textAlign: "center"
      }, locked ? LOCKED_INPUT_STYLE : {
        borderColor: !o.op ? C.yellow : C.border
      })
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: consoCode,
      title: "Copier code article"
    }, locked ? /*#__PURE__*/React.createElement(Input, {
      value: consoCode,
      small: true,
      readOnly: true,
      title: "Code SAP : ".concat(consoCode || "—"),
      style: _objectSpread({
        fontFamily: "monospace"
      }, LOCKED_INPUT_STYLE)
    }) : /*#__PURE__*/React.createElement(ConsoDropdown, {
      display: "code",
      value: it.consoId || "",
      onChange: function onChange(v) {
        return updItem(oid, iid, "consoId", v);
      },
      consommables: consommables,
      cats: cats
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: (conso === null || conso === void 0 ? void 0 : conso.label) || "",
      title: "Copier d\xE9signation"
    }, /*#__PURE__*/React.createElement(Input, {
      value: (conso === null || conso === void 0 ? void 0 : conso.label) || "",
      small: true,
      readOnly: true,
      title: "D\xE9signation : ".concat((conso === null || conso === void 0 ? void 0 : conso.label) || "—"),
      style: LOCKED_INPUT_STYLE
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: it.lot,
      title: "Copier LOT"
    }, /*#__PURE__*/React.createElement(Input, {
      value: it.lot,
      onChange: function onChange(v) {
        return updItem(oid, iid, "lot", v.toUpperCase());
      },
      onBlur: function onBlur(e) {
        return updItem(oid, iid, "lot", normLot(e.target.value));
      },
      small: true,
      readOnly: locked,
      placeholder: "0000020516",
      style: _objectSpread({
        fontFamily: "monospace"
      }, locked ? LOCKED_INPUT_STYLE : {
        borderColor: !it.lot ? C.yellow : C.border
      })
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(Input, {
      value: it.dp,
      onChange: function onChange(v) {
        return updItem(oid, iid, "dp", v);
      },
      placeholder: "JJ.MM.AA",
      small: true,
      readOnly: locked,
      title: inv ? "Date invalide — format JJ.MM.AA" : (st === null || st === void 0 ? void 0 : st.label) === "PÉRIMÉ" ? "Anomalie : consommable p\xE9rim\xE9 \xE0 la date de la ligne (".concat(lineDate || "date inconnue", ")") : (st === null || st === void 0 ? void 0 : st.label) === "BIENTÔT" ? "Date de péremption proche" : "Date de péremption",
      onBlur: function onBlur(e) {
        return !locked && updItem(oid, iid, "dp", normDP(e.target.value));
      },
      style: _objectSpread(_objectSpread({}, locked ? LOCKED_INPUT_STYLE : {}), {}, {
        borderColor: inv ? C.red : !it.dp ? C.yellow : st ? st.color : C.border,
        background: inv ? C.red + "12" : st === null || st === void 0 ? void 0 : st.bg,
        color: inv ? C.red : st === null || st === void 0 ? void 0 : st.color,
        fontWeight: (st === null || st === void 0 ? void 0 : st.label) === "PÉRIMÉ" ? 800 : undefined
      })
    })))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(CopyCell, {
      value: it.echantillon,
      title: "Copier N\xB0 \xE9chantillon"
    }, /*#__PURE__*/React.createElement(Input, {
      value: it.echantillon || "",
      onChange: function onChange(v) {
        return updItem(oid, iid, "echantillon", v);
      },
      small: true,
      readOnly: locked,
      placeholder: "N\xB0 ech.",
      style: _objectSpread({
        fontFamily: "monospace"
      }, locked ? LOCKED_INPUT_STYLE : {})
    }))), /*#__PURE__*/React.createElement(TD, null, polymerization ? /*#__PURE__*/React.createElement("span", {
      title: "".concat(polymerization.done ? "Sous vide possible depuis le" : "Sous vide dès le", " ").concat(formatAvailabilityDT(polymerization.readyAt)),
      style: {
        display: "block",
        padding: "3px 5px",
        borderRadius: 4,
        textAlign: "center",
        fontFamily: "monospace",
        border: "1px solid ".concat(polymerization.done ? C.green : C.yellow),
        background: (polymerization.done ? C.green : C.yellow) + "18",
        color: polymerization.done ? C.green : C.yellow,
        fontSize: 9,
        fontWeight: 900,
        lineHeight: 1.25
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 10
      }
    }, polymerization.done ? "✓ PRÊT" : "◷ ATTENTE"), formatAvailabilityDT(polymerization.readyAt)) : /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        textAlign: "center",
        color: C.muted
      }
    }, "\u2014")), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: "all"
      }
    }, /*#__PURE__*/React.createElement(StampStatus, {
      done: !!it.tracaOk,
      visa: it.visaTraca,
      date: it.dateTraca,
      color: C.green,
      label: "Tra\xE7a",
      onStamp: function onStamp() {
        return stampTraca(oid, iid);
      },
      onClear: function onClear() {
        return clearTraca(oid, iid);
      },
      canClear: !rowDeleted && perms.canTraceability,
      clearTitle: "D\xE9valider la tra\xE7abilit\xE9",
      onDateChange: (it.editBase || o.editBase) && !rowDeleted && perms.canTraceability ? function (v) {
        return setTracaDate(oid, iid, v);
      } : null,
      disabled: rowDeleted || !perms.canTraceability
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(CommentBtn, {
      comments: it.comments || [],
      onChange: function onChange(v) {
        return updItem(oid, iid, "comments", v);
      },
      user: user,
      disabled: !perms.canComment
    }), it.remarque && /*#__PURE__*/React.createElement("span", {
      title: it.remarque,
      style: {
        fontSize: 10,
        color: C.muted,
        fontFamily: "monospace",
        maxWidth: 70,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, it.remarque))), /*#__PURE__*/React.createElement("td", {
      style: {
        position: "sticky",
        right: 0,
        zIndex: 2,
        background: rowDeleted ? "#2b1719" : it.tracaOk ? "#14231b" : idx % 2 === 0 ? C.surface : C.raised,
        padding: "5px 8px",
        borderBottom: "1px solid ".concat(C.border, "20"),
        fontSize: 12,
        textAlign: "center",
        verticalAlign: "middle",
        pointerEvents: "all",
        width: 110
      }
    }, !rowDeleted && !valid && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateLine(oid, iid);
      },
      color: C.green,
      title: "Valider"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dupLine(oid, iid);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: {
        editHistory: [].concat(_toConsumableArray(o.editHistory || []), _toConsumableArray(it.editHistory || []))
      }
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return delItem(oid, iid);
      },
      color: C.border,
      title: "Supprimer"
    }, "\xD7")), !rowDeleted && valid && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return unlockLine(oid, iid);
      },
      color: C.yellow,
      title: "Modifier"
    }, "\u270E"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dupLine(oid, iid);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: {
        editHistory: [].concat(_toConsumableArray(o.editHistory || []), _toConsumableArray(it.editHistory || []))
      }
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return delItem(oid, iid);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !rowDeleted && !editable && perms.canWrite && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dupLine(oid, iid);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: {
        editHistory: [].concat(_toConsumableArray(o.editHistory || []), _toConsumableArray(it.editHistory || []))
      }
    })), rowDeleted && /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return opDeleted ? setRestoreOpTarget(oid) : setRestoreItemTarget({
          oid: oid,
          iid: iid
        });
      },
      color: C.yellow,
      title: "R\xE9activer"
    }, "\u21A9"))), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: rowKey + "_ophist",
      row: o,
      open: forceShowDeleted
    }), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: rowKey + "_hist",
      row: it,
      open: forceShowDeleted
    }), rowDeleted && /*#__PURE__*/React.createElement("tr", {
      key: rowKey + "_ann"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 5px",
        background: "#da363325",
        borderBottom: "1px solid #da363355"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace"
      }
    }, "\u2715 Annul\xE9 le ", /*#__PURE__*/React.createElement("strong", null, it.deletedDate || o.deletedDate), " par ", /*#__PURE__*/React.createElement("strong", null, it.deletedVisa || o.deletedVisa), " \u2014 ", it.deletedReason || o.deletedReason), /*#__PURE__*/React.createElement(PurgeLineButton, {
      user: user,
      data: data,
      onChange: onChange,
      id: opDeleted ? oid : iid
    }), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        opDeleted ? setRestoreOpTarget(oid) : setRestoreItemTarget({
          oid: oid,
          iid: iid
        });
      },
      style: {
        color: "#d29922",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        pointerEvents: "all",
        marginLeft: 16
      }
    }, "\u21A9 R\xE9activer"))))];
  }))), ops.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 32
    }
  }, "Cliquez ", /*#__PURE__*/React.createElement("strong", null, "+ Ligne"), " pour commencer")), deleteOpTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDelOp,
    onCancel: function onCancel() {
      return setDeleteOpTarget(null);
    }
  }), deleteItemTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDelItem,
    onCancel: function onCancel() {
      return setDeleteItemTarget(null);
    }
  }), restoreOpTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restoreOp,
    onCancel: function onCancel() {
      return setRestoreOpTarget(null);
    }
  }), restoreItemTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restoreItem,
    onCancel: function onCancel() {
      return setRestoreItemTarget(null);
    }
  }));
};

// ─── 4. Test Equipment — format AAAA-MM + détection hors calibration ───────
var normCalib = function normCalib(s) {
  if (!s) return s;
  var d = s.replace(/\D/g, "");
  // AAMM "2506" → "2025-06"
  if (d.length === 4) return "20" + d.slice(0, 2) + "-" + d.slice(2, 4);
  return s;
};
var parseCalibDate = function parseCalibDate(s) {
  if (!s) return null;
  s = normCalib(s);
  if (!s.includes("-")) return null;
  var _s$split3 = s.split("-"),
    _s$split4 = _slicedToArray(_s$split3, 2),
    yyyy = _s$split4[0],
    mm = _s$split4[1];
  if (!yyyy || !mm) return null;
  // fin du mois indiqué
  return new Date(parseInt(yyyy), parseInt(mm), 0); // jour 0 du mois suivant = dernier jour du mois
};
var isValidCalibDate = function isValidCalibDate(s) {
  if (!s) return true;
  var n = normCalib(s);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(n)) return false;
  return true;
};
var calibStatus = function calibStatus(s) {
  var d = parseCalibDate(normCalib(s));
  if (!d) return null;
  var diff = (d - new Date()) / 86400000;
  if (diff < 0) return {
    label: "HORS CALIBRATION",
    color: C.red,
    bg: "#da363322"
  };
  if (diff <= 30) return {
    label: "EXPIRE BIENTÔT",
    color: C.yellow,
    bg: "#d2992222"
  };
  return {
    label: "OK",
    color: C.green,
    bg: "#23863622"
  };
};
var TEST_EQUIP_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "isFour",
  label: "Four"
}, {
  key: "nInv",
  label: "N° INV"
}, {
  key: "type",
  label: "Type"
}, {
  key: "designation",
  label: "Désignation"
}, {
  key: "dateExpiration",
  label: "Date calibration"
}, {
  key: "checkDate",
  label: "Date contrôle"
}];
var TabTestEquip = function TabTestEquip(_ref78) {
  var data = _ref78.data,
    onChange = _ref78.onChange,
    user = _ref78.user,
    _ref78$perms = _ref78.perms,
    perms = _ref78$perms === void 0 ? {} : _ref78$perms,
    header = _ref78.header,
    _ref78$forceShowDelet = _ref78.forceShowDeleted,
    forceShowDeleted = _ref78$forceShowDelet === void 0 ? false : _ref78$forceShowDelet,
    onCopyAcross = _ref78.onCopyAcross;
  var rows = data.rows || [];
  var canEdit = function canEdit(row) {
    return canEditLine(user, row);
  };
  var add = function add() {
    if (!perms.canWrite) return;
    onChange({
      rows: [].concat(_toConsumableArray(rows), [_objectSpread(_objectSpread({
        id: uid()
      }, defaultSnScope(header)), {}, {
        nInv: "",
        type: "",
        designation: "",
        dateExpiration: "",
        isFour: false,
        visa: user.trigram,
        checkDate: now(),
        createdVisa: user.trigram,
        createdDT: nowDT(),
        commentaires: ""
      })])
    });
  };
  var _useState127 = useState(null),
    _useState128 = _slicedToArray(_useState127, 2),
    deleteTarget = _useState128[0],
    setDeleteTarget = _useState128[1];
  var _useState129 = useState(null),
    _useState130 = _slicedToArray(_useState129, 2),
    restoreTarget = _useState130[0],
    setRestoreTarget = _useState130[1];
  var _useState131 = useState(false),
    _useState132 = _slicedToArray(_useState131, 2),
    showDeleted = _useState132[0],
    setShowDeleted = _useState132[1];
  var snFilter = workSnFilter(header);
  var upd = function upd(id, f, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (f === "comments" ? !perms.canComment : !canEdit(r)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, _defineProperty({}, f, v))
    });
  };
  var patchRow = function patchRow(id, fields) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, fields)
    });
  };
  var dup = function dup(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || !perms.canWrite) return;
    if (onCopyAcross && !r.deleted) {
      onCopyAcross(r);
      return;
    }
    onChange({
      rows: [].concat(_toConsumableArray(rows), [duplicateRow(r, user, {
        visa: user.trigram,
        checkDate: now()
      })])
    });
  };
  var del = function del(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    if (!r.validated && !r.editBase) onChange({
      rows: rows.filter(function (x) {
        return x.id !== id;
      })
    });else if (!r.validated) onChange({
      rows: scopedRowsDelete(rows, id, header, {
        deleted: true,
        deletedReason: "",
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });else setDeleteTarget(id);
  };
  var restore = function restore(reason) {
    onChange({
      rows: rows.map(function (r) {
        return r.id === restoreTarget ? _objectSpread(_objectSpread({}, r), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: user.trigram,
          restoredDate: nowDT()
        }) : r;
      })
    });
    setRestoreTarget(null);
  };
  var confirmDel = function confirmDel(reason) {
    onChange({
      rows: scopedRowsDelete(rows, deleteTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });
    setDeleteTarget(null);
  };
  var deletedCount = rows.filter(function (r) {
    return r.deleted;
  }).length;
  var REQUIRED = [{
    key: "nInv",
    label: "N° INV"
  }, {
    key: "type",
    label: "Type"
  }, {
    key: "designation",
    label: "Désignation"
  }, {
    key: "dateExpiration",
    label: "Date calibration"
  }];
  var validateRow = function validateRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    var miss = checkRequired(r, REQUIRED);
    if (miss.length) {
      upd(id, "validError", "Champs requis : " + miss.join(", "));
    } else {
      onChange({
        rows: scopedRowsPatch(rows, id, header, function (x) {
          return withEditHistory(x, user, TEST_EQUIP_EDIT_FIELDS);
        })
      });
    }
  };
  var unlockRow = function unlockRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(r, TEST_EQUIP_EDIT_FIELDS)
        }) : r;
      })
    });
  };
  var horsCalib = effectiveScopedRows({
    header: header,
    testequip: {
      rows: rows
    }
  }, "testequip").filter(function (r) {
    var _calibStatus;
    return _rowMatchesSnFilter(r, snFilter, header) && ((_calibStatus = calibStatus(r.dateExpiration)) === null || _calibStatus === void 0 ? void 0 : _calibStatus.color) === C.red;
  });
  var visibleRows = sortByNewestOperation(rows).filter(function (r) {
    return (!r.deleted || showDeleted || forceShowDeleted) && _rowMatchesSnFilter(r, snFilter, header);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1450
    }
  }, horsCalib.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#da363322",
      border: "1px solid ".concat(C.red),
      borderRadius: 6,
      padding: "10px 14px",
      marginBottom: 14,
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.red,
      fontSize: 16
    }
  }, "\u26A0"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.red,
      fontWeight: 700,
      fontSize: 13
    }
  }, horsCalib.length, " appareil", horsCalib.length > 1 ? "s" : "", " hors calibration :\xA0", horsCalib.map(function (r) {
    return r.designation || r.nInv || "?";
  }).join(", "))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginBottom: 12
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement("div", {
    style: {
      marginRight: "auto"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    small: true
  }, "+ \xC9quipement")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontFamily: "monospace"
    }
  }, "Filtre SN : ", snFilter === "all" ? "TRAVAIL = Tous" : snScopeLabel({
    snScope: "custom",
    snIds: [snFilter]
  }, snRowsFromHeader(header))), deletedCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulées" : "▼ Voir annulées (" + deletedCount + ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Date / Heure"), /*#__PURE__*/React.createElement(TH, {
    w: 46,
    color: C.accent
  }, "Visa"), /*#__PURE__*/React.createElement(TH, {
    w: 78
  }, "N\xB0 SN"), /*#__PURE__*/React.createElement(TH, {
    w: 48
  }, "Four"), /*#__PURE__*/React.createElement(TH, null, "N\xB0 INV"), /*#__PURE__*/React.createElement(TH, null, "TYPE"), /*#__PURE__*/React.createElement(TH, null, "D\xC9SIGNATION"), /*#__PURE__*/React.createElement(TH, {
    w: 105
  }, "Date calib"), /*#__PURE__*/React.createElement(TH, {
    w: 95
  }, "Statut"), /*#__PURE__*/React.createElement(TH, {
    w: 96
  }, "Date contr\xF4le"), /*#__PURE__*/React.createElement(TH, {
    w: 36
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.flatMap(function (r, i) {
    var st = calibStatus(r.dateExpiration);
    var invalid = r.dateExpiration && !isValidCalibDate(r.dateExpiration);
    var editable = canEdit(r);
    var locked = !!r.validated || !editable;
    return [/*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        background: r.deleted ? "#da363318" : (st === null || st === void 0 ? void 0 : st.bg) || (i % 2 === 0 ? "transparent" : C.stripe),
        textDecoration: r.deleted ? "line-through" : undefined,
        opacity: r.deleted ? .6 : 1,
        pointerEvents: r.deleted ? "none" : undefined,
        borderLeft: r.validated ? "3px solid ".concat(C.green) : r.validError ? "3px solid ".concat(C.red) : "3px solid ".concat(C.border)
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted
      }
    }, r.createdDT || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        color: C.accent
      }
    }, r.createdVisa || "—"), /*#__PURE__*/React.createElement(CopyOriginMark, {
      origin: r.copyOrigin
    })), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement(SnScopePicker, {
      row: r,
      header: header,
      onChange: function onChange(fields) {
        return patchRow(r.id, fields);
      },
      disabled: locked
    })), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !!r.isFour,
      disabled: locked,
      onChange: function onChange(e) {
        return upd(r.id, "isFour", e.target.checked);
      },
      title: "D\xE9finir cet \xE9quipement comme four pour le proposer dans l'onglet \xC9tuvages",
      style: {
        width: 16,
        height: 16,
        accentColor: C.accent,
        cursor: locked ? "default" : "pointer"
      }
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.nInv,
      onChange: function onChange(v) {
        return upd(r.id, "nInv", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.type,
      onChange: function onChange(v) {
        return upd(r.id, "type", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.designation,
      onChange: function onChange(v) {
        return upd(r.id, "designation", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.dateExpiration,
      onChange: function onChange(v) {
        return upd(r.id, "dateExpiration", v);
      },
      placeholder: "2026-06 ou AAMM",
      small: true,
      readOnly: locked,
      onBlur: function onBlur(e) {
        return !locked && upd(r.id, "dateExpiration", normCalib(e.target.value));
      },
      style: _objectSpread({}, locked ? LOCKED_INPUT_STYLE : {
        borderColor: invalid ? C.red : undefined,
        color: invalid ? C.red : undefined
      })
    }), invalid && !locked && /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.red,
        fontSize: 9,
        marginTop: 2
      }
    }, "Format AAAA-MM, mois 01-12")), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, st ? /*#__PURE__*/React.createElement(Badge, {
      label: st.label,
      color: st.color
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted,
        fontSize: 10
      }
    }, "\u2014")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.checkDate,
      onChange: function onChange(v) {
        return upd(r.id, "checkDate", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(CommentBtn, {
      comments: r.comments || [],
      onChange: function onChange(v) {
        return upd(r.id, "comments", v);
      },
      user: user,
      disabled: !perms.canComment
    })), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !r.deleted && !r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateRow(r.id);
      },
      color: C.green,
      title: "Valider"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.border,
      title: "Supprimer"
    }, "\xD7")), !r.deleted && r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return unlockRow(r.id);
      },
      color: C.yellow,
      title: "Modifier"
    }, "\u270E"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return setDeleteTarget(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !r.deleted && !editable && perms.canWrite && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    })))), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: r.id + "_hist",
      row: r,
      open: forceShowDeleted
    }), r.deleted && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_ann"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 6px",
        background: "#da363325",
        borderBottom: "2px solid #da363355"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: .3
      }
    }, "\u2715 Annul\xE9 le ", /*#__PURE__*/React.createElement("strong", null, r.deletedDate), " par ", /*#__PURE__*/React.createElement("strong", null, r.deletedVisa), "\xA0\u2014\xA0Motif : ", r.deletedReason), /*#__PURE__*/React.createElement(PurgeLineButton, {
      user: user,
      data: data,
      onChange: onChange,
      id: r.id
    }), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        setRestoreTarget(r.id);
      },
      style: {
        color: "#d29922",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        pointerEvents: "all",
        textDecoration: "none",
        marginLeft: 16,
        flexShrink: 0
      }
    }, "\u21A9 R\xE9activer"))))];
  })))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 24
    }
  }, "Aucun \xE9quipement"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 11,
      color: C.muted
    }
  }, "\u2726 Visa pr\xE9-rempli \xB7 \xD7 annule et barre la ligne \xB7 Format date calibration : AAAA-MM (ex: 2026-06 = juin 2026)"), deleteTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDel,
    onCancel: function onCancel() {
      return setDeleteTarget(null);
    }
  }), restoreTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restore,
    onCancel: function onCancel() {
      return setRestoreTarget(null);
    }
  }));
};

// ─── 5. DM ─────────────────────────────────────────────────────────────────
// ─── Types de faits par défaut ─────────────────────────────────────────────
var DEFAULT_FAIT_TYPES = [{
  id: "NC",
  label: "NC — Non-Conformité",
  color: C.red
}, {
  id: "DM",
  label: "DM — Demande de Modif.",
  color: C.blue
}, {
  id: "ISS",
  label: "ISS — Fait Technique",
  color: C.yellow
}];
var FaitTypeColor = {
  NC: C.red,
  DM: C.blue,
  ISS: C.yellow
};
var getFaitColor = function getFaitColor(typeId, types) {
  var t = types.find(function (t) {
    return t.id === typeId;
  });
  return (t === null || t === void 0 ? void 0 : t.color) || FaitTypeColor[typeId] || C.muted;
};

// ─── Gestionnaire types de faits ───────────────────────────────────────────
var FaitTypesManager = function FaitTypesManager(_ref79) {
  var types = _ref79.types,
    onClose = _ref79.onClose,
    onSave = _ref79.onSave;
  var _useState133 = useState(types.map(function (t) {
      return _objectSpread({}, t);
    })),
    _useState134 = _slicedToArray(_useState133, 2),
    list = _useState134[0],
    setList = _useState134[1];
  var _useState135 = useState({
      id: "",
      label: "",
      color: C.purple
    }),
    _useState136 = _slicedToArray(_useState135, 2),
    newT = _useState136[0],
    setNewT = _useState136[1];
  var COLORS = [C.red, C.blue, C.yellow, C.green, C.purple, C.accent, C.muted];
  var add = function add() {
    if (!newT.id.trim() || !newT.label.trim()) return;
    if (list.find(function (t) {
      return t.id === newT.id.toUpperCase();
    })) return;
    setList(function (l) {
      return [].concat(_toConsumableArray(l), [_objectSpread(_objectSpread({}, newT), {}, {
        id: newT.id.toUpperCase()
      })]);
    });
    setNewT({
      id: "",
      label: "",
      color: newT.color
    });
  };
  var del = function del(id) {
    return setList(function (l) {
      return l.filter(function (t) {
        return t.id !== id;
      });
    });
  };
  var upd = function upd(id, f, v) {
    return setList(function (l) {
      return l.map(function (t) {
        return t.id === id ? _objectSpread(_objectSpread({}, t), {}, _defineProperty({}, f, v)) : t;
      });
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 10,
      width: "100%",
      maxWidth: 560,
      maxHeight: "80vh",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 20px",
      borderBottom: "1px solid ".concat(C.border),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: C.text,
      fontSize: 14
    }
  }, "\u2699 Types de faits"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return onSave(list);
    },
    color: C.green,
    small: true
  }, "\u2713 Enregistrer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: onClose,
    color: C.border,
    small: true
  }, "Annuler"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      borderBottom: "1px solid ".concat(C.border),
      background: C.input
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, "Ajouter un type"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "80px 1fr auto auto",
      gap: 8,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "CODE"), /*#__PURE__*/React.createElement(Input, {
    value: newT.id,
    onChange: function onChange(v) {
      return setNewT(function (n) {
        return _objectSpread(_objectSpread({}, n), {}, {
          id: v.toUpperCase()
        });
      });
    },
    small: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "LIBELL\xC9"), /*#__PURE__*/React.createElement(Input, {
    value: newT.label,
    onChange: function onChange(v) {
      return setNewT(function (n) {
        return _objectSpread(_objectSpread({}, n), {}, {
          label: v
        });
      });
    },
    small: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      marginBottom: 3
    }
  }, "COULEUR"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, COLORS.map(function (c) {
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: function onClick() {
        return setNewT(function (n) {
          return _objectSpread(_objectSpread({}, n), {}, {
            color: c
          });
        });
      },
      style: {
        width: 18,
        height: 18,
        borderRadius: 3,
        background: c,
        border: newT.color === c ? "2px solid #fff" : "2px solid transparent",
        cursor: "pointer"
      }
    });
  }))), /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    color: C.accent,
    small: true
  }, "+ Ajouter"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      flex: 1,
      padding: "8px 0"
    }
  }, list.map(function (t) {
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 20px",
        borderBottom: "1px solid ".concat(C.border, "20")
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      label: t.id,
      color: t.color
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        color: C.text
      }
    }, t.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 3
      }
    }, COLORS.map(function (c) {
      return /*#__PURE__*/React.createElement("button", {
        key: c,
        onClick: function onClick() {
          return upd(t.id, "color", c);
        },
        style: {
          width: 14,
          height: 14,
          borderRadius: 2,
          background: c,
          border: t.color === c ? "2px solid #fff" : "1px solid transparent",
          cursor: "pointer"
        }
      });
    })), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick() {
        return del(t.id);
      },
      style: {
        cursor: "pointer",
        color: C.red,
        fontSize: 14,
        fontWeight: 700
      }
    }, "\xD7"));
  }))));
};
var StatusTypesManager = function StatusTypesManager(_ref80) {
  var types = _ref80.types,
    onClose = _ref80.onClose,
    onSave = _ref80.onSave;
  var _useState137 = useState(function () {
      return normalizeStatusTypes(types);
    }),
    _useState138 = _slicedToArray(_useState137, 2),
    list = _useState138[0],
    setList = _useState138[1];
  var _useState139 = useState(""),
    _useState140 = _slicedToArray(_useState139, 2),
    label = _useState140[0],
    setLabel = _useState140[1];
  var _useState141 = useState("#8957e5"),
    _useState142 = _slicedToArray(_useState141, 2),
    color = _useState142[0],
    setColor = _useState142[1];
  var _useState143 = useState(""),
    _useState144 = _slicedToArray(_useState143, 2),
    error = _useState144[0],
    setError = _useState144[1];
  var makeId = function makeId(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32);
  };
  var add = function add() {
    var id = makeId(label);
    if (!id || !label.trim()) {
      setError("Libellé requis");
      return;
    }
    if (list.some(function (item) {
      return item.id === id;
    })) {
      setError("Ce statut existe déjà");
      return;
    }
    setList(function (current) {
      return [].concat(_toConsumableArray(current), [{
        id: id,
        label: label.trim(),
        color: color,
        closed: false,
        order: current.length
      }]);
    });
    setLabel("");
    setError("");
  };
  var update = function update(id, field, value) {
    return setList(function (current) {
      return current.map(function (item) {
        return item.id === id ? _objectSpread(_objectSpread({}, item), {}, _defineProperty({}, field, value)) : item;
      });
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 350,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    onClick: function onClick(event) {
      if (event.target === event.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 720,
      maxHeight: "84vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      borderBottom: "1px solid ".concat(C.border)
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: C.text
    }
  }, "Statuts OF et SN/LOT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted
    }
  }, "Cette liste est commune aux deux niveaux.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return onSave(normalizeStatusTypes(list));
    },
    color: C.green,
    small: true
  }, "Enregistrer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: onClose,
    color: C.border,
    small: true
  }, "Annuler"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: "grid",
      gridTemplateColumns: "1fr 70px auto",
      gap: 8,
      alignItems: "end",
      borderBottom: "1px solid ".concat(C.border),
      background: C.input
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, "Nouveau statut"), /*#__PURE__*/React.createElement(Input, {
    value: label,
    onChange: function onChange(value) {
      setLabel(value);
      setError("");
    },
    onKeyDown: function onKeyDown(event) {
      if (event.key === "Enter") add();
    },
    placeholder: "Ex. En attente qualit\xE9",
    small: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      textTransform: "uppercase",
      marginBottom: 3
    }
  }, "Couleur"), /*#__PURE__*/React.createElement("input", {
    "aria-label": "Couleur du nouveau statut",
    type: "color",
    value: color,
    onChange: function onChange(event) {
      return setColor(event.target.value);
    },
    style: {
      width: "100%",
      height: 28,
      padding: 1,
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    color: C.accent,
    small: true
  }, "+ Ajouter"), error && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      fontSize: 11,
      color: C.red
    }
  }, error)), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 130
  }, "Code"), /*#__PURE__*/React.createElement(TH, null, "Libell\xE9"), /*#__PURE__*/React.createElement(TH, {
    w: 90
  }, "Couleur"), /*#__PURE__*/React.createElement(TH, {
    w: 130
  }, "\xC9tat final"))), /*#__PURE__*/React.createElement("tbody", null, list.map(function (item) {
    return /*#__PURE__*/React.createElement("tr", {
      key: item.id
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        color: C.muted
      }
    }, item.id)), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: item.label,
      onChange: function onChange(value) {
        return update(item.id, "label", value);
      },
      small: true
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("input", {
      "aria-label": "Couleur ".concat(item.label),
      type: "color",
      value: item.color,
      onChange: function onChange(event) {
        return update(item.id, "color", event.target.value);
      },
      style: {
        width: 42,
        height: 24,
        padding: 1,
        background: C.input,
        border: "1px solid ".concat(C.border),
        borderRadius: 4
      }
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: C.text
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !!item.closed,
      onChange: function onChange(event) {
        return update(item.id, "closed", event.target.checked);
      }
    }), " Oui")));
  }))))));
};

// ─── 5+6. Faits (NC / DM / ISS / …) ───────────────────────────────────────
var FAITS_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "type",
  label: "Type"
}, {
  key: "numero",
  label: "N°"
}, {
  key: "visa",
  label: "Visa ouverture"
}, {
  key: "date",
  label: "Date ouverture"
}, {
  key: "lien",
  label: "Lien"
}, {
  key: "commentaires",
  label: "Commentaires"
}, {
  key: "closedDate",
  label: "Date clôture"
}, {
  key: "closedVisa",
  label: "Visa clôture"
}];
var TabFaits = function TabFaits(_ref81) {
  var data = _ref81.data,
    onChange = _ref81.onChange,
    user = _ref81.user,
    _ref81$perms = _ref81.perms,
    perms = _ref81$perms === void 0 ? {} : _ref81$perms,
    faitTypes = _ref81.faitTypes,
    onEditTypes = _ref81.onEditTypes,
    header = _ref81.header,
    _ref81$forceShowDelet = _ref81.forceShowDeleted,
    forceShowDeleted = _ref81$forceShowDelet === void 0 ? false : _ref81$forceShowDelet,
    onCopyAcross = _ref81.onCopyAcross;
  var rows = data.rows || [];
  var types = faitTypes;
  var isClosed = function isClosed(r) {
    return !!r.closedDate;
  };
  var canEdit = function canEdit(row) {
    return canEditLine(user, row);
  };
  var add = function add() {
    if (!perms.canWrite) return;
    onChange({
      rows: [].concat(_toConsumableArray(rows), [_objectSpread(_objectSpread({
        id: uid(),
        createdVisa: user.trigram,
        createdDT: nowDT()
      }, defaultSnScope(header)), {}, {
        type: "",
        numero: "",
        visa: user.trigram,
        date: now(),
        lien: "",
        commentaires: "",
        closedVisa: "",
        closedDate: ""
      })])
    });
  };
  var upd = function upd(id, f, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (f === "comments" || f === "commentaires" ? !perms.canComment : !canEdit(r)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, _defineProperty({}, f, v))
    });
  };
  var patchRow = function patchRow(id, fields) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, fields)
    });
  };
  var dup = function dup(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || !perms.canWrite) return;
    if (onCopyAcross && !r.deleted) {
      onCopyAcross(r);
      return;
    }
    onChange({
      rows: [].concat(_toConsumableArray(rows), [duplicateRow(r, user, {
        visa: user.trigram,
        date: now(),
        closedVisa: "",
        closedDate: ""
      })])
    });
  };
  var _useState145 = useState(null),
    _useState146 = _slicedToArray(_useState145, 2),
    deleteTarget = _useState146[0],
    setDeleteTarget = _useState146[1];
  var _useState147 = useState(null),
    _useState148 = _slicedToArray(_useState147, 2),
    restoreTarget = _useState148[0],
    setRestoreTarget = _useState148[1];
  var _useState149 = useState(false),
    _useState150 = _slicedToArray(_useState149, 2),
    showDeleted = _useState150[0],
    setShowDeleted = _useState150[1];
  var _useState151 = useState(null),
    _useState152 = _slicedToArray(_useState151, 2),
    copiedLien = _useState152[0],
    setCopiedLien = _useState152[1];
  var snFilter = workSnFilter(header);
  var del = function del(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    if (!r.validated && !r.editBase && !r.closedDate && !r.closedVisa) onChange({
      rows: rows.filter(function (x) {
        return x.id !== id;
      })
    });else if (!r.validated) onChange({
      rows: scopedRowsDelete(rows, id, header, {
        deleted: true,
        deletedReason: "",
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });else setDeleteTarget(id);
  };
  var restore = function restore(reason) {
    onChange({
      rows: rows.map(function (r) {
        return r.id === restoreTarget ? _objectSpread(_objectSpread({}, r), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: user.trigram,
          restoredDate: nowDT()
        }) : r;
      })
    });
    setRestoreTarget(null);
  };
  var confirmDel = function confirmDel(reason) {
    var r = rows.find(function (x) {
      return x.id === deleteTarget;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsDelete(rows, deleteTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });
    setDeleteTarget(null);
  };
  var deletedCount = rows.filter(function (r) {
    return r.deleted;
  }).length;
  var REQUIRED = [{
    key: "type",
    label: "Type"
  }, {
    key: "numero",
    label: "N° (référence)"
  }, {
    key: "visa",
    label: "Visa"
  }, {
    key: "date",
    label: "Date ouverture"
  }];
  var validateRow = function validateRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    var miss = checkRequired(r, REQUIRED);
    if (miss.length) {
      upd(id, "validError", "Champs requis : " + miss.join(", "));
    } else {
      onChange({
        rows: scopedRowsPatch(rows, id, header, function (x) {
          return withEditHistory(x, user, FAITS_EDIT_FIELDS);
        })
      });
    }
  };
  var unlockRow = function unlockRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(r, FAITS_EDIT_FIELDS)
        }) : r;
      })
    });
  };
  var close = function close(id) {
    var row = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(row)) onChange({
      rows: scopedRowsPatch(rows, id, header, function (r) {
        return withEditHistory(_objectSpread(_objectSpread({}, r), {}, {
          closedVisa: user.trigram,
          closedDate: now(),
          editBase: r.editBase || snapshotFields(r, FAITS_EDIT_FIELDS)
        }), user, FAITS_EDIT_FIELDS);
      })
    });
  };
  var reopen = function reopen(id) {
    var row = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(row)) onChange({
      rows: scopedRowsPatch(rows, id, header, function (r) {
        return withEditHistory(_objectSpread(_objectSpread({}, r), {}, {
          closedVisa: "",
          closedDate: "",
          editBase: r.editBase || snapshotFields(r, FAITS_EDIT_FIELDS)
        }), user, FAITS_EDIT_FIELDS);
      })
    });
  };
  var activeRows = effectiveScopedRows({
    header: header,
    faits: {
      rows: rows
    }
  }, "faits").filter(function (r) {
    return _rowMatchesSnFilter(r, snFilter, header);
  });
  var open = activeRows.filter(function (r) {
    return !isClosed(r);
  }).length;
  var closed = activeRows.filter(isClosed).length;

  // Compteurs par type
  var typeCounts = types.map(function (t) {
    return _objectSpread(_objectSpread({}, t), {}, {
      n: activeRows.filter(function (r) {
        return r.type === t.id;
      }).length
    });
  });
  var visibleRows = sortByNewestOperation(rows).filter(function (r) {
    return (!r.deleted || showDeleted || forceShowDeleted) && _rowMatchesSnFilter(r, snFilter, header);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1500
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    small: true
  }, "+ Fait"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: "4px 14px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Total"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.text,
      fontSize: 20,
      fontWeight: 900,
      fontFamily: "monospace",
      lineHeight: 1
    }
  }, activeRows.length)), typeCounts.filter(function (t) {
    return t.n > 0;
  }).map(function (t) {
    return /*#__PURE__*/React.createElement(Badge, {
      key: t.id,
      label: "".concat(t.n, " ").concat(t.id),
      color: t.color
    });
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(open, " ouvert").concat(open > 1 ? "s" : ""),
    color: C.yellow
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(closed, " cl\xF4tur\xE9").concat(closed > 1 ? "s" : ""),
    color: C.green
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontFamily: "monospace"
    }
  }, "Filtre SN : ", snFilter === "all" ? "TRAVAIL = Tous" : snScopeLabel({
    snScope: "custom",
    snIds: [snFilter]
  }, snRowsFromHeader(header))), perms.canManageLists && /*#__PURE__*/React.createElement(Btn, {
    onClick: onEditTypes,
    color: C.border,
    small: true
  }, "\u2699 Types"), deletedCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulées" : "▼ Voir annulées (" + deletedCount + ")"))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Date / Heure"), /*#__PURE__*/React.createElement(TH, {
    w: 46,
    color: C.accent
  }, "Visa"), /*#__PURE__*/React.createElement(TH, {
    w: 78
  }, "N\xB0 SN"), /*#__PURE__*/React.createElement(TH, {
    w: 76
  }, "Type"), /*#__PURE__*/React.createElement(TH, {
    w: 105
  }, "N\xB0 (saisi)"), /*#__PURE__*/React.createElement(TH, {
    w: 66,
    color: C.accent
  }, "Visa \u2726"), /*#__PURE__*/React.createElement(TH, {
    w: 82
  }, "Date ouv."), /*#__PURE__*/React.createElement(TH, {
    w: 180
  }, "Lien / Chemin r\xE9seau"), /*#__PURE__*/React.createElement(TH, null, "Commentaires"), /*#__PURE__*/React.createElement(TH, {
    w: 82
  }, "Date cl\xF4t."), /*#__PURE__*/React.createElement(TH, {
    w: 70
  }, "Visa cl\xF4t."), /*#__PURE__*/React.createElement(TH, {
    w: 108
  }, "Action"), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.flatMap(function (r, i) {
    var _types$find;
    var typeColor = getFaitColor(r.type, types);
    var closed_r = isClosed(r);
    var editable = canEdit(r);
    var locked = !!r.validated || !editable;
    return [/*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        background: r.deleted ? "#da363318" : closed_r ? "#23863612" : i % 2 === 0 ? "transparent" : C.stripe,
        textDecoration: r.deleted ? "line-through" : undefined,
        opacity: r.deleted ? .6 : closed_r ? .85 : 1,
        pointerEvents: r.deleted ? "none" : undefined,
        borderLeft: r.validated ? "3px solid ".concat(C.green) : r.validError ? "3px solid ".concat(C.red) : "3px solid ".concat(C.border)
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted
      }
    }, r.createdDT || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        color: C.accent
      }
    }, r.createdVisa || "—"), /*#__PURE__*/React.createElement(CopyOriginMark, {
      origin: r.copyOrigin
    })), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement(SnScopePicker, {
      row: r,
      header: header,
      onChange: function onChange(fields) {
        return patchRow(r.id, fields);
      },
      disabled: locked
    })), /*#__PURE__*/React.createElement(TD, null, locked ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        color: typeColor,
        background: typeColor + "22",
        padding: "2px 8px",
        borderRadius: 4
      }
    }, r.type || "—") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
      value: r.type || "",
      onChange: function onChange(e) {
        return upd(r.id, "type", e.target.value);
      },
      style: {
        background: C.input,
        border: "1px solid ".concat(r.type ? typeColor : C.yellow),
        borderRadius: 4,
        color: r.type ? typeColor : C.muted,
        padding: "4px 6px",
        fontSize: 11,
        fontFamily: "monospace",
        fontWeight: 700,
        outline: "none",
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u2014 type \u2014"), types.map(function (t) {
      return /*#__PURE__*/React.createElement("option", {
        key: t.id,
        value: t.id
      }, t.id);
    })), r.type && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: C.muted,
        marginTop: 2
      }
    }, ((_types$find = types.find(function (t) {
      return t.id === r.type;
    })) === null || _types$find === void 0 ? void 0 : _types$find.label) || r.type))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.numero,
      onChange: function onChange(v) {
        return upd(r.id, "numero", v);
      },
      small: true,
      required: true,
      readOnly: locked,
      title: "Num\xE9ro du fait (ex: NC-2024-001, DM-0042\u2026)",
      style: _objectSpread({
        fontFamily: "monospace",
        fontWeight: 700
      }, locked ? LOCKED_INPUT_STYLE : {
        color: r.numero ? typeColor : undefined
      })
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.visa,
      onChange: function onChange(v) {
        return upd(r.id, "visa", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {
        background: "#e05c0015",
        borderColor: C.accent,
        color: C.accent,
        fontWeight: 700
      }
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.date,
      onChange: function onChange(v) {
        return upd(r.id, "date", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, function () {
      var isHttp = r.lien && (r.lien.startsWith("http") || r.lien.startsWith("www.") || /^[a-zA-Z0-9-]+\./.test(r.lien.split("/")[0]));
      var href = r.lien ? r.lien.startsWith("http") ? r.lien : "https://" + r.lien : "";
      var isPath = r.lien && !isHttp;
      var copied = copiedLien === r.id;
      var copyPath = function copyPath(e) {
        e.stopPropagation();
        try {
          var ta = document.createElement("textarea");
          ta.value = r.lien;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          setCopiedLien(r.id);
          setTimeout(function () {
            return setCopiedLien(null);
          }, 2000);
        } catch (_unused9) {
          window.prompt("Copier ce chemin (Ctrl+C):", r.lien);
        }
      };
      if (locked && r.lien) return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "nowrap"
        }
      }, isHttp ? /*#__PURE__*/React.createElement("a", {
        href: href,
        target: "_blank",
        rel: "noreferrer",
        style: {
          color: C.blue,
          fontSize: 11,
          fontFamily: "monospace",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 4,
          minWidth: 0,
          cursor: "pointer"
        },
        onClick: function onClick(e) {
          return e.stopPropagation();
        }
      }, "\uD83D\uDD17 ", /*#__PURE__*/React.createElement("span", {
        style: {
          textDecoration: "underline",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 160
        }
      }, r.lien)) : /*#__PURE__*/React.createElement("span", {
        onClick: copyPath,
        style: {
          color: copied ? "#238636" : C.blue,
          fontSize: 10,
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          gap: 4,
          cursor: "pointer",
          minWidth: 0
        },
        title: "Cliquer pour copier le chemin"
      }, copied ? "✓ Copié !" : "📁", /*#__PURE__*/React.createElement("span", {
        style: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 160,
          textDecoration: "underline"
        }
      }, r.lien)));
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 4,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(Input, {
        value: r.lien || "",
        onChange: function onChange(v) {
          return upd(r.id, "lien", v);
        },
        small: true,
        readOnly: locked,
        title: "URL (https://\u2026) ou chemin r\xE9seau (\\\\\\\\serveur\\\\dossier)",
        style: _objectSpread({
          flex: 1,
          fontSize: 10
        }, locked ? LOCKED_INPUT_STYLE : {})
      }), isHttp && /*#__PURE__*/React.createElement("a", {
        href: href,
        target: "_blank",
        rel: "noreferrer",
        style: {
          color: C.blue,
          fontSize: 14,
          textDecoration: "none",
          flexShrink: 0,
          cursor: "pointer"
        },
        onClick: function onClick(e) {
          return e.stopPropagation();
        },
        title: "Ouvrir le lien"
      }, "\uD83D\uDD17"), isPath && /*#__PURE__*/React.createElement("span", {
        onClick: copyPath,
        style: {
          color: copied ? "#238636" : C.muted,
          fontSize: 12,
          flexShrink: 0,
          cursor: "pointer"
        },
        title: "Copier le chemin"
      }, "\uD83D\uDCC1"));
    }()), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.commentaires,
      onChange: function onChange(v) {
        return upd(r.id, "commentaires", v);
      },
      small: true,
      readOnly: !perms.canComment,
      style: !perms.canComment ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.closedDate,
      onChange: function onChange(v) {
        return upd(r.id, "closedDate", v);
      },
      small: true,
      readOnly: !editable,
      style: _objectSpread(_objectSpread({}, editable ? {} : LOCKED_INPUT_STYLE), {}, {
        background: closed_r ? "#23863620" : undefined,
        color: closed_r ? C.green : undefined
      })
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.closedVisa,
      onChange: function onChange(v) {
        return upd(r.id, "closedVisa", v);
      },
      small: true,
      readOnly: !editable,
      style: _objectSpread(_objectSpread({}, editable ? {} : LOCKED_INPUT_STYLE), {}, {
        background: closed_r ? "#23863620" : undefined,
        color: closed_r ? C.green : undefined,
        fontWeight: closed_r ? 700 : 400
      })
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return closed_r ? reopen(r.id) : close(r.id);
      },
      title: closed_r ? "Réouvrir ce fait" : "Clore ce fait",
      style: {
        background: (closed_r ? C.yellow : C.green) + "22",
        border: "1px solid ".concat(closed_r ? C.yellow : C.green),
        borderRadius: 3,
        color: closed_r ? C.yellow : C.green,
        fontSize: 9,
        padding: "2px 7px",
        cursor: "pointer",
        fontWeight: 800,
        whiteSpace: "nowrap"
      }
    }, closed_r ? "Ouvrir" : "Clore"))), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !r.deleted && !r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateRow(r.id);
      },
      color: C.green,
      title: "Valider"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.border,
      title: "Supprimer"
    }, "\xD7")), !r.deleted && r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return unlockRow(r.id);
      },
      color: C.yellow,
      title: "Modifier"
    }, "\u270E"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !r.deleted && !editable && perms.canWrite && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    })))), r.validError && !r.validated && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_err"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 5px",
        background: "#da363315",
        borderBottom: "1px solid #da363340"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace"
      }
    }, "\u26A0 ", r.validError))), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: r.id + "_hist",
      row: r,
      open: forceShowDeleted
    }), r.deleted && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_ann"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 6px",
        background: "#da363325",
        borderBottom: "2px solid #da363355"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: .3
      }
    }, "\u2715 Annul\xE9 le ", /*#__PURE__*/React.createElement("strong", null, r.deletedDate), " par ", /*#__PURE__*/React.createElement("strong", null, r.deletedVisa), "\xA0\u2014\xA0Motif : ", r.deletedReason), /*#__PURE__*/React.createElement(PurgeLineButton, {
      user: user,
      data: data,
      onChange: onChange,
      id: r.id
    }), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        setRestoreTarget(r.id);
      },
      style: {
        color: "#d29922",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        pointerEvents: "all",
        textDecoration: "none",
        marginLeft: 16,
        flexShrink: 0
      }
    }, "\u21A9 R\xE9activer"))))];
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 24
    }
  }, "Aucun fait enregistr\xE9"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 11,
      color: C.muted
    }
  }, "\u2726 Visa pr\xE9-rempli \xB7 N\xB0 saisi manuellement \xB7 \uD83D\uDD17 lien cliquable si http \xB7 \uD83D\uDCC1 chemin r\xE9seau \xB7 \xD7 annule et barre la ligne"), deleteTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDel,
    onCancel: function onCancel() {
      return setDeleteTarget(null);
    }
  }), restoreTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restore,
    onCancel: function onCancel() {
      return setRestoreTarget(null);
    }
  }));
};

// ─── 7. Étuvages ───────────────────────────────────────────────────────────
var ETUVAGE_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "fourN",
  label: "Four N°"
}, {
  key: "duree",
  label: "Durée"
}, {
  key: "temp",
  label: "Temp"
}, {
  key: "entreeDT",
  label: "Entrée four"
}, {
  key: "entreeVisa",
  label: "Visa entrée"
}, {
  key: "sortieDT",
  label: "Sortie four"
}, {
  key: "sortieVisa",
  label: "Visa sortie"
}];
var TabEtuvage = function TabEtuvage(_ref82) {
  var data = _ref82.data,
    onChange = _ref82.onChange,
    user = _ref82.user,
    _ref82$perms = _ref82.perms,
    perms = _ref82$perms === void 0 ? {} : _ref82$perms,
    allRows = _ref82.allRows,
    tstRows = _ref82.tstRows,
    header = _ref82.header,
    _ref82$forceShowDelet = _ref82.forceShowDeleted,
    forceShowDeleted = _ref82$forceShowDelet === void 0 ? false : _ref82$forceShowDelet,
    onCopyAcross = _ref82.onCopyAcross;
  var rows = data.rows || [];
  var canEdit = function canEdit(row) {
    return canEditLine(user, row);
  };
  var fours = uniqueOvenChoices(tstRows);
  var _useState153 = useState(null),
    _useState154 = _slicedToArray(_useState153, 2),
    deleteTarget = _useState154[0],
    setDeleteTarget = _useState154[1];
  var _useState155 = useState(null),
    _useState156 = _slicedToArray(_useState155, 2),
    restoreTarget = _useState156[0],
    setRestoreTarget = _useState156[1];
  var _useState157 = useState(false),
    _useState158 = _slicedToArray(_useState157, 2),
    showDeleted = _useState158[0],
    setShowDeleted = _useState158[1];
  var snFilter = workSnFilter(header);
  var add = function add() {
    if (!perms.canWrite) return;
    onChange({
      rows: [].concat(_toConsumableArray(rows), [_objectSpread(_objectSpread({
        id: uid()
      }, defaultSnScope(header)), {}, {
        createdVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
        createdDT: nowDT(),
        fourN: "",
        duree: "",
        temp: "",
        entreeVisa: "",
        entreeDT: "",
        sortieVisa: "",
        sortieDT: "",
        comments: []
      })])
    });
  };
  var upd = function upd(id, f, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (f === "comments" ? !perms.canComment : !canEdit(r)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, _defineProperty({}, f, v))
    });
  };
  var patchRow = function patchRow(id, fields) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, fields)
    });
  };
  var dup = function dup(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || !perms.canWrite) return;
    if (onCopyAcross && !r.deleted) {
      onCopyAcross(r);
      return;
    }
    onChange({
      rows: [].concat(_toConsumableArray(rows), [duplicateRow(r, user, {
        entreeVisa: "",
        entreeDT: "",
        sortieVisa: "",
        sortieDT: ""
      })])
    });
  };
  var del = function del(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    if (!r.validated && !r.editBase && !r.entreeDT && !r.sortieDT) onChange({
      rows: rows.filter(function (x) {
        return x.id !== id;
      })
    });else if (!r.validated) onChange({
      rows: scopedRowsDelete(rows, id, header, {
        deleted: true,
        deletedReason: "",
        deletedVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
        deletedDate: nowDT()
      })
    });else setDeleteTarget(id);
  };
  var restore = function restore(reason) {
    onChange({
      rows: rows.map(function (r) {
        return r.id === restoreTarget ? _objectSpread(_objectSpread({}, r), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
          restoredDate: nowDT()
        }) : r;
      })
    });
    setRestoreTarget(null);
  };
  var confirmDel = function confirmDel(reason) {
    var r = rows.find(function (x) {
      return x.id === deleteTarget;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsDelete(rows, deleteTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
        deletedDate: nowDT()
      })
    });
    setDeleteTarget(null);
  };
  var deletedCount = rows.filter(function (r) {
    return r.deleted;
  }).length;

  // validateAndEnter: check required fields then stamp entrée atomically
  var validateAndEnter = function validateAndEnter(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    if (!r) return;
    var miss = [];
    if (!r.fourN) miss.push("Four N°");
    if (!r.duree) miss.push("Durée [H]");
    if (!r.temp) miss.push("Temp [°C]");
    if (miss.length) {
      onChange({
        rows: rows.map(function (x) {
          return x.id === id ? _objectSpread(_objectSpread({}, x), {}, {
            validError: "Requis avant entrée : " + miss.join(", ")
          }) : x;
        })
      });
      return;
    }
    onChange({
      rows: scopedRowsPatch(rows, id, header, function (x) {
        var next = _objectSpread(_objectSpread({}, x), {}, {
          entreeDT: x.entreeDT || nowDT(),
          entreeVisa: x.entreeVisa || (user === null || user === void 0 ? void 0 : user.trigram) || "",
          validated: true,
          validError: ""
        });
        return withEditHistory(next, user, ETUVAGE_EDIT_FIELDS);
      })
    });
  };
  var validateRow = function validateRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    if (!r) return;
    var miss = [];
    if (!r.fourN) miss.push("Four N°");
    if (!r.duree) miss.push("Durée [H]");
    if (!r.temp) miss.push("Temp [°C]");
    if (miss.length) {
      onChange({
        rows: rows.map(function (x) {
          return x.id === id ? _objectSpread(_objectSpread({}, x), {}, {
            validError: "Requis : " + miss.join(", ")
          }) : x;
        })
      });
      return;
    }
    onChange({
      rows: scopedRowsPatch(rows, id, header, function (x) {
        return withEditHistory(_objectSpread(_objectSpread({}, x), {}, {
          validated: true,
          validError: ""
        }), user, ETUVAGE_EDIT_FIELDS);
      })
    });
  };
  var unlockRow = function unlockRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: rows.map(function (x) {
        return x.id === id ? _objectSpread(_objectSpread({}, x), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(x, ETUVAGE_EDIT_FIELDS)
        }) : x;
      })
    });
  };
  var stamp = function stamp(id, field) {
    var row = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(row)) return;
    var extra = field === "entreeDT" ? {
      entreeVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
      validated: true,
      validError: ""
    } : field === "sortieDT" ? {
      sortieVisa: (user === null || user === void 0 ? void 0 : user.trigram) || ""
    } : {};
    onChange({
      rows: scopedRowsPatch(rows, id, header, _objectSpread(_defineProperty({}, field, nowDT()), extra))
    });
  };
  var patchEtuvageStamp = function patchEtuvageStamp(id, fields) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, fields)
    });
  };
  var nei = nextEtuvageInfo((allRows || rows).filter(function (r) {
    return _rowMatchesSnFilter(r, snFilter, header);
  }));
  var visibleRows = sortByNewestOperation(rows, function (r) {
    return r.entreeDT || r.createdDT;
  }).filter(function (r) {
    return (!r.deleted || showDeleted || forceShowDeleted) && _rowMatchesSnFilter(r, snFilter, header);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1500
    }
  }, /*#__PURE__*/React.createElement("datalist", {
    id: "fours-etuvage"
  }, fours.map(function (f) {
    return /*#__PURE__*/React.createElement("option", {
      key: f.id,
      value: String(f.nInv || f.designation).trim()
    }, [f.nInv, f.designation].filter(Boolean).join(" — "));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: nei.overdue ? "#da363318" : "#1f6feb12",
      border: "1px solid ".concat(nei.overdue ? C.red : C.blue),
      borderRadius: 6,
      padding: "8px 14px",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, nei.overdue ? "🔴" : "🕐"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Prochain \xE9tuvage"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontWeight: 700,
      fontSize: 13,
      color: nei.overdue ? C.red : C.blue
    }
  }, nei.label)), !nei.overdue && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 11
    }
  }, "dans ", nei.diffDays > 0 ? "".concat(nei.diffDays, "j ") : "", nei.diffH > 0 ? "".concat(nei.diffH, "h ") : "", nei.diffMin || 0, "min"), nei.overdue && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.red,
      fontSize: 11,
      fontWeight: 700
    }
  }, "EN RETARD"), nei.lastLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginLeft: "auto"
    }
  }, "Dernier : ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace"
    }
  }, nei.lastLabel), "\xA0\xB7\xA0", nei.count, " \xE9tuvage", nei.count > 1 ? "s" : "", " au total")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginBottom: 12
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement("div", {
    style: {
      marginRight: "auto"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    small: true
  }, "+ \xC9tuvage")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontFamily: "monospace"
    }
  }, "Filtre SN : ", snFilter === "all" ? "TRAVAIL = Tous" : snScopeLabel({
    snScope: "custom",
    snIds: [snFilter]
  }, snRowsFromHeader(header))), deletedCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulées" : "▼ Voir annulées (" + deletedCount + ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Date / Heure"), /*#__PURE__*/React.createElement(TH, {
    w: 46,
    color: C.accent
  }, "Visa"), /*#__PURE__*/React.createElement(TH, {
    w: 78
  }, "N\xB0 SN"), /*#__PURE__*/React.createElement(TH, {
    w: 70
  }, "Four N\xB0"), /*#__PURE__*/React.createElement(TH, {
    w: 58
  }, "Dur\xE9e [H]"), /*#__PURE__*/React.createElement(TH, {
    w: 58
  }, "Temp [\xB0C]"), /*#__PURE__*/React.createElement(TH, {
    w: 96
  }, "\u25B6 Entr\xE9e"), /*#__PURE__*/React.createElement(TH, {
    w: 122
  }, "Date/Heure entr\xE9e"), /*#__PURE__*/React.createElement(TH, {
    w: 96
  }, "\u25A0 Sortie"), /*#__PURE__*/React.createElement(TH, {
    w: 122
  }, "Date/Heure sortie"), /*#__PURE__*/React.createElement(TH, {
    w: 34
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.flatMap(function (r, i) {
    var inFour = !!r.entreeDT,
      outFour = !!r.sortieDT;
    var editable = canEdit(r);
    var locked = !!r.validated || !editable;
    var fourVal = r.fourN.trim().toLowerCase();
    var fourOk = !r.fourN || fours.some(function (t) {
      return (t.nInv || "").trim().toLowerCase() === fourVal || (t.designation || "").trim().toLowerCase() === fourVal;
    });
    return [/*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        background: r.deleted ? "#da363318" : outFour ? "#23863610" : inFour ? "#1f6feb10" : i % 2 === 0 ? "transparent" : C.stripe,
        textDecoration: r.deleted ? "line-through" : undefined,
        opacity: r.deleted ? .6 : 1,
        pointerEvents: r.deleted ? "none" : undefined,
        borderLeft: r.validated ? "3px solid ".concat(C.green) : r.validError ? "3px solid ".concat(C.red) : "3px solid ".concat(C.border)
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted
      }
    }, r.createdDT || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        color: C.accent
      }
    }, r.createdVisa || "—"), /*#__PURE__*/React.createElement(CopyOriginMark, {
      origin: r.copyOrigin
    })), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement(SnScopePicker, {
      row: r,
      header: header,
      onChange: function onChange(fields) {
        return patchRow(r.id, fields);
      },
      disabled: locked
    })), /*#__PURE__*/React.createElement(TD, null, locked ? /*#__PURE__*/React.createElement(Input, {
      value: r.fourN,
      small: true,
      readOnly: true,
      style: LOCKED_INPUT_STYLE
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      list: "fours-etuvage",
      value: r.fourN || "",
      onChange: function onChange(e) {
        return upd(r.id, "fourN", e.target.value);
      },
      placeholder: fours.length ? "Choisir four" : "Aucun four",
      style: {
        width: "100%",
        fontFamily: "monospace",
        outline: "none",
        padding: "4px 6px",
        fontSize: 11,
        background: C.input,
        color: r.fourN && !fourOk ? C.yellow : C.text,
        border: "1px solid ".concat(r.fourN && !fourOk ? C.yellow : C.border),
        borderRadius: 4
      }
    })), r.fourN && !fourOk && !locked && /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.yellow,
        fontSize: 9,
        marginTop: 1,
        whiteSpace: "nowrap"
      }
    }, "\u26A0 non coch\xE9 four"), !r.fourN && !fours.length && !locked && /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        marginTop: 1,
        whiteSpace: "nowrap"
      }
    }, "Cochez un four dans Test Equip.")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.duree,
      onChange: function onChange(v) {
        return upd(r.id, "duree", v);
      },
      small: true,
      placeholder: "h",
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.temp,
      onChange: function onChange(v) {
        return upd(r.id, "temp", v);
      },
      small: true,
      placeholder: "\xB0C",
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !inFour ? editable && /*#__PURE__*/React.createElement(Btn, {
      onClick: function onClick() {
        return validateAndEnter(r.id);
      },
      color: C.blue,
      small: true
    }, "\u25B6 Entr\xE9e four") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      label: "\u25B6 EN FOUR",
      color: C.blue
    }), !locked ? /*#__PURE__*/React.createElement(Input, {
      value: r.entreeVisa || "",
      onChange: function onChange(v) {
        return patchEtuvageStamp(r.id, {
          entreeVisa: v
        });
      },
      small: true,
      title: "Corriger le visa entr\xE9e",
      style: {
        width: 48,
        fontSize: 9,
        fontFamily: "monospace",
        textAlign: "center",
        padding: "1px 3px",
        color: C.blue
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 9,
        color: C.blue
      }
    }, r.entreeVisa))), /*#__PURE__*/React.createElement(TD, null, !locked ? /*#__PURE__*/React.createElement(Input, {
      value: r.entreeDT || "",
      onChange: function onChange(v) {
        return patchEtuvageStamp(r.id, _objectSpread({
          entreeDT: v,
          entreeVisa: v ? r.entreeVisa || (user === null || user === void 0 ? void 0 : user.trigram) || "" : ""
        }, v ? {} : {
          sortieDT: "",
          sortieVisa: ""
        }));
      },
      small: true,
      title: "Corriger la date/heure d'entr\xE9e. Vider retire l'\xE9tat entr\xE9e four.",
      readOnly: !editable,
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: r.entreeDT ? C.blue : C.muted
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: inFour ? C.blue : C.muted
      }
    }, r.entreeDT || "—")), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !outFour ? editable && /*#__PURE__*/React.createElement(Btn, {
      onClick: function onClick() {
        return stamp(r.id, "sortieDT");
      },
      color: C.green,
      small: true,
      disabled: !inFour
    }, "\u25A0 Sortie") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      label: "\u25A0 SORTI",
      color: C.green
    }), !locked ? /*#__PURE__*/React.createElement(Input, {
      value: r.sortieVisa || "",
      onChange: function onChange(v) {
        return patchEtuvageStamp(r.id, {
          sortieVisa: v
        });
      },
      small: true,
      title: "Corriger le visa sortie",
      style: {
        width: 48,
        fontSize: 9,
        fontFamily: "monospace",
        textAlign: "center",
        padding: "1px 3px",
        color: C.green
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 9,
        color: C.green
      }
    }, r.sortieVisa))), /*#__PURE__*/React.createElement(TD, null, !r.validated ? /*#__PURE__*/React.createElement(Input, {
      value: r.sortieDT || "",
      onChange: function onChange(v) {
        return patchEtuvageStamp(r.id, {
          sortieDT: v,
          sortieVisa: v ? r.sortieVisa || (user === null || user === void 0 ? void 0 : user.trigram) || "" : ""
        });
      },
      small: true,
      title: "Corriger la date/heure de sortie. Vider retire l'\xE9tat sortie four.",
      readOnly: !editable,
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: r.sortieDT ? C.green : C.muted
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: outFour ? C.green : C.muted
      }
    }, r.sortieDT || "—")), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, /*#__PURE__*/React.createElement(CommentBtn, {
      comments: r.comments || [],
      onChange: function onChange(v) {
        return upd(r.id, "comments", v);
      },
      user: user,
      disabled: !perms.canComment
    })), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !r.deleted && !inFour && !r.editBase && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.border,
      title: "Supprimer"
    }, "\xD7")), !r.deleted && !inFour && r.editBase && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateRow(r.id);
      },
      color: C.green,
      title: "Valider les modifications"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !r.deleted && inFour && r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return unlockRow(r.id);
      },
      color: C.yellow,
      title: "Modifier"
    }, "\u270E"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !r.deleted && inFour && !r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateRow(r.id);
      },
      color: C.green,
      title: "Valider les modifications"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")), !r.deleted && !editable && perms.canWrite && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    })))), r.validError && !r.validated && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_err"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "2px 10px 4px",
        background: "#da363315",
        borderBottom: "1px solid #da363340"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace"
      }
    }, "\u26A0 ", r.validError))), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: r.id + "_hist",
      row: r,
      open: forceShowDeleted
    }), r.deleted && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_ann"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 6px",
        background: "#da363325",
        borderBottom: "2px solid #da363355"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: .3
      }
    }, "\u2715 Annul\xE9 le ", /*#__PURE__*/React.createElement("strong", null, r.deletedDate), " par ", /*#__PURE__*/React.createElement("strong", null, r.deletedVisa), "\xA0\u2014\xA0Motif : ", r.deletedReason), /*#__PURE__*/React.createElement(PurgeLineButton, {
      user: user,
      data: data,
      onChange: onChange,
      id: r.id
    }), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        setRestoreTarget(r.id);
      },
      style: {
        color: "#d29922",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        pointerEvents: "all",
        textDecoration: "none",
        marginLeft: 16,
        flexShrink: 0
      }
    }, "\u21A9 R\xE9activer"))))];
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 24
    }
  }, "Aucun \xE9tuvage")), deleteTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDel,
    onCancel: function onCancel() {
      return setDeleteTarget(null);
    }
  }), restoreTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restore,
    onCancel: function onCancel() {
      return setRestoreTarget(null);
    }
  }));
};

// ─── 8. Mating / Demating ────────────────────────────────────────────────
// Modèle : journal d'actions par connecteur
// events = [{id, dt, visa, action:"Mating"|"Demating", remarque:"", comments:[]}]
// Cycles = events.length / 2  (décimal : 0.5, 1, 1.5, 2…)
// Alternance stricte après la première action (libre)
// Suppression avec motif sur chaque événement
var CONNECTOR_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "nConect",
  label: "Connecteur"
}];
var ConnectorActionButton = function ConnectorActionButton(_ref83) {
  var action = _ref83.action,
    connector = _ref83.connector,
    disabled = _ref83.disabled,
    title = _ref83.title,
    onClick = _ref83.onClick;
  var mating = action === "Mating",
    tone = mating ? C.green : C.red;
  var half = {
    width: 6,
    height: 10,
    border: "2px solid currentColor",
    borderRadius: 2,
    display: "inline-block"
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "".concat(action, " ").concat(connector),
    disabled: disabled,
    title: title,
    onClick: onClick,
    style: {
      height: 34,
      minWidth: 0,
      width: "100%",
      padding: "2px",
      border: "1px solid ".concat(disabled ? C.border : tone),
      borderRadius: 4,
      background: disabled ? C.raised : tone + "18",
      color: disabled ? C.muted : tone,
      cursor: disabled ? "default" : "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      fontFamily: "system-ui,sans-serif",
      fontSize: 11,
      lineHeight: "13px",
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 12,
      gap: 2,
      opacity: disabled ? .5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: half
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 23,
      textAlign: "center",
      fontSize: 13,
      lineHeight: 1
    }
  }, mating ? "→←" : "←→"), /*#__PURE__*/React.createElement("span", {
    style: half
  })), /*#__PURE__*/React.createElement("span", null, action));
};
var TabDeMating = function TabDeMating(_ref84) {
  var data = _ref84.data,
    onChange = _ref84.onChange,
    user = _ref84.user,
    _ref84$perms = _ref84.perms,
    perms = _ref84$perms === void 0 ? {} : _ref84$perms,
    header = _ref84.header,
    _ref84$forceShowDelet = _ref84.forceShowDeleted,
    forceShowDeleted = _ref84$forceShowDelet === void 0 ? false : _ref84$forceShowDelet,
    onCopyAcross = _ref84.onCopyAcross;
  var connectors = data.connectors || [];
  var canEdit = function canEdit(row) {
    return canEditLine(user, row);
  };
  var _useState159 = useState(null),
    _useState160 = _slicedToArray(_useState159, 2),
    deleteEvTarget = _useState160[0],
    setDeleteEvTarget = _useState160[1]; // {cid,eid}
  var _useState161 = useState(null),
    _useState162 = _slicedToArray(_useState161, 2),
    deleteConnTarget = _useState162[0],
    setDeleteConnTarget = _useState162[1]; // cid
  var _useState163 = useState(null),
    _useState164 = _slicedToArray(_useState163, 2),
    restoreEvTarget = _useState164[0],
    setRestoreEvTarget = _useState164[1]; // {cid,eid}
  var _useState165 = useState(null),
    _useState166 = _slicedToArray(_useState165, 2),
    restoreConnTarget = _useState166[0],
    setRestoreConnTarget = _useState166[1]; // cid
  var _useState167 = useState(false),
    _useState168 = _slicedToArray(_useState167, 2),
    showDeleted = _useState168[0],
    setShowDeleted = _useState168[1];
  var _useState169 = useState("all"),
    _useState170 = _slicedToArray(_useState169, 2),
    historyConnector = _useState170[0],
    setHistoryConnector = _useState170[1];
  var snFilter = workSnFilter(header);
  var scopeIds = function scopeIds(row) {
    var snRows = snRowsFromHeader(header);
    if (!snRows.length) return ["__of__"];
    var scope = snScope(row, snRows);
    var excluded = ((row === null || row === void 0 ? void 0 : row.snExcludeIds) || []).filter(function (id) {
      return snRows.some(function (s) {
        return s.id === id;
      });
    });
    return scope.mode === "all" ? snRows.map(function (s) {
      return s.id;
    }).filter(function (id) {
      return !excluded.includes(id);
    }) : scope.ids;
  };
  var makeConnector = function makeConnector(scope) {
    var nConect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    return _objectSpread(_objectSpread({
      id: uid()
    }, scope), {}, {
      nConect: nConect,
      validated: true,
      connError: "",
      deleted: false,
      deletedReason: "",
      deletedVisa: "",
      deletedDate: "",
      createdVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
      createdDT: nowDT(),
      comments: [],
      events: []
    });
  };
  var appendConnectors = function appendConnectors(additions) {
    var _iterator2 = _createForOfIteratorHelper(additions),
      _step2;
    try {
      var _loop = function _loop() {
          var c = _step2.value;
          var ids = scopeIds(c);
          var duplicate = connectors.some(function (x) {
            return !x.deleted && String(x.nConect || "").trim().toUpperCase() === c.nConect && scopeIds(x).some(function (id) {
              return ids.includes(id);
            });
          });
          if (duplicate) {
            window.alert("Connecteur ".concat(c.nConect, " d\xE9j\xE0 existant pour le SN ou lot concern\xE9."));
            return {
              v: void 0
            };
          }
        },
        _ret;
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        _ret = _loop();
        if (_ret) return _ret.v;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    onChange({
      connectors: [].concat(_toConsumableArray(connectors), _toConsumableArray(additions))
    });
  };

  // ── Connecteurs ─────────────────────────────────────────────
  var addC = function addC() {
    var _header$_entrySnIds2;
    if (!perms.canWrite) return;
    var snRows = snRowsFromHeader(header);
    var active = (header === null || header === void 0 || (_header$_entrySnIds2 = header._entrySnIds) === null || _header$_entrySnIds2 === void 0 ? void 0 : _header$_entrySnIds2[0]) || workSnFilter(header);
    var name = window.prompt("Nom du connecteur à créer (ex: J4)", "");
    if (name === null) return;
    var nConect = String(name || "").trim().toUpperCase();
    if (!nConect) {
      window.alert("Nom du connecteur requis (ex: J4).");
      return;
    }
    if (snRows.length > 1) {
      var createAll = window.confirm("Cr\xE9er ".concat(nConect || "ce connecteur", " pour tous les SN / LOT ?\n\n").concat(snRows.map(snTitle).join("\n"), "\n\nOK = cr\xE9er un connecteur ind\xE9pendant par SN / LOT.\nAnnuler = cr\xE9er uniquement pour le SN de saisie."));
      if (createAll) {
        appendConnectors(snRows.map(function (sn) {
          return makeConnector({
            snScope: "custom",
            snIds: [sn.id],
            unitId: sn.id
          }, nConect);
        }));
        return;
      }
      if (active === "all") {
        window.alert("Sélectionne d'abord un SN dans TRAVAIL pour créer un connecteur sur un seul SN.");
        return;
      }
      appendConnectors([makeConnector({
        snScope: "custom",
        snIds: [active],
        unitId: active
      }, nConect)]);
      return;
    }
    appendConnectors([makeConnector(defaultSnScope(header), nConect)]);
  };
  var updC = function updC(cid, f, v) {
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (f === "comments" ? !perms.canComment : !canEdit(c)) return;
    onChange({
      connectors: scopedRowsPatch(connectors, cid, header, _defineProperty({}, f, v))
    });
  };
  var patchC = function patchC(cid, fields) {
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (canEdit(c)) onChange({
      connectors: scopedRowsPatch(connectors, cid, header, fields)
    });
  };
  var validateConn = function validateConn(cid) {
    var _c$nConect;
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (!canEdit(c)) return;
    if (!(c !== null && c !== void 0 && (_c$nConect = c.nConect) !== null && _c$nConect !== void 0 && _c$nConect.trim())) {
      onChange({
        connectors: connectors.map(function (x) {
          return x.id === cid ? _objectSpread(_objectSpread({}, x), {}, {
            connError: "Nom du connecteur requis (ex: J13)"
          }) : x;
        })
      });
      return;
    }
    var snRows = snRowsFromHeader(header);
    var currentIds = scopeIds(c);
    var same = String(c.nConect || "").trim().toUpperCase();
    var duplicate = connectors.find(function (x) {
      return x.id !== cid && !x.deleted && String(x.nConect || "").trim().toUpperCase() === same && scopeIds(x).some(function (id) {
        return currentIds.includes(id);
      });
    });
    if (duplicate) {
      var dupIds = scopeIds(duplicate).filter(function (id) {
        return currentIds.includes(id);
      });
      var label = dupIds.includes("__of__") ? "cet OF" : dupIds.slice(0, 3).map(function (id) {
        return snTitle(snRows.find(function (s) {
          return s.id === id;
        }));
      }).join(" + ") + (dupIds.length > 3 ? " + ".concat(dupIds.length - 3, " SN") : "");
      onChange({
        connectors: connectors.map(function (x) {
          return x.id === cid ? _objectSpread(_objectSpread({}, x), {}, {
            connError: "Connecteur ".concat(same, " d\xE9j\xE0 existant sur ").concat(label)
          }) : x;
        })
      });
      return;
    }
    onChange({
      connectors: scopedRowsPatch(connectors, cid, header, function (x) {
        return withEditHistory(_objectSpread(_objectSpread({}, x), {}, {
          connError: ""
        }), user, CONNECTOR_EDIT_FIELDS);
      })
    });
  };
  var unlockConn = function unlockConn(cid) {
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (canEdit(c)) onChange({
      connectors: connectors.map(function (c) {
        return c.id === cid ? _objectSpread(_objectSpread({}, c), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(c, CONNECTOR_EDIT_FIELDS)
        }) : c;
      })
    });
  };
  var restoreC = function restoreC(reason) {
    onChange({
      connectors: connectors.map(function (c) {
        return c.id === restoreConnTarget ? _objectSpread(_objectSpread({}, c), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
          restoredDate: nowDT()
        }) : c;
      })
    });
    setRestoreConnTarget(null);
  };
  var confirmDelConn = function confirmDelConn(reason) {
    var c = connectors.find(function (x) {
      return x.id === deleteConnTarget;
    });
    if (canEdit(c)) onChange({
      connectors: scopedRowsDelete(connectors, deleteConnTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
        deletedDate: nowDT()
      })
    });
    setDeleteConnTarget(null);
  };
  var delConn = function delConn(cid) {
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (!canEdit(c)) return;
    if (!c.validated && !c.editBase && !(c.events || []).length) onChange({
      connectors: connectors.filter(function (x) {
        return x.id !== cid;
      })
    });else if (!c.validated) onChange({
      connectors: scopedRowsDelete(connectors, cid, header, {
        deleted: true,
        deletedReason: "",
        deletedVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
        deletedDate: nowDT()
      })
    });else setDeleteConnTarget(cid);
  };

  // ── Événements ───────────────────────────────────────────────
  // Dernier événement actif (non supprimé)
  var lastActive = function lastActive(c) {
    return _toConsumableArray(c.events || []).filter(function (e) {
      return !e.deleted;
    }).slice(-1)[0] || null;
  };

  // Prochaine action attendue : "either" si aucun event, sinon opposé du dernier
  var nextExpected = function nextExpected(c) {
    var last = lastActive(c);
    if (!last) return "either";
    return last.action === "Mating" ? "Demating" : "Mating";
  };

  // Compteur de cycles (décimal)
  var cycleCount = function cycleCount(c) {
    var n = (c.events || []).filter(function (e) {
      return !e.deleted;
    }).length;
    return n / 2;
  };

  // Statut
  var connStatus = function connStatus(c) {
    var last = lastActive(c);
    if (!last) return {
      label: "Aucune action",
      color: C.muted
    };
    return last.action === "Mating" ? {
      label: "⚡ MATÉ",
      color: C.green
    } : {
      label: "✓ DÉMATÉ",
      color: C.red
    };
  };
  var addEvent = function addEvent(cid, action) {
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (!c) return;
    if (!canRecordMating(user, c)) return;
    var ne = nextExpected(c);
    if (ne !== "either" && ne !== action) return; // should not happen (button disabled)
    var ev = {
      id: uid(),
      dt: nowDT(),
      visa: (user === null || user === void 0 ? void 0 : user.trigram) || "",
      action: action,
      remarque: "",
      comments: [],
      deleted: false,
      deletedReason: "",
      deletedVisa: "",
      deletedDate: ""
    };
    var ids = scopeIds(c);
    if (ids.length > 1) {
      var active = workSnFilter(header);
      var _snRows2 = snRowsFromHeader(header);
      var activeRow = _snRows2.find(function (s) {
        return s.id === active;
      });
      if (!activeRow || !rowMatchesSn(c, activeRow, _snRows2)) {
        window.alert("Choisis d'abord le SN de travail avant d'enregistrer un Mating/Demating.");
        return;
      }
      var inserted = null;
      var next = connectors.map(function (x) {
        if (x.id !== cid) return x;
        var excluded = _toConsumableArray(new Set([].concat(_toConsumableArray(x.snExcludeIds || []), [active])));
        inserted = _objectSpread(_objectSpread({}, x), {}, {
          id: uid(),
          snScope: "custom",
          snIds: [active],
          unitId: active,
          snExcludeIds: [],
          events: [].concat(_toConsumableArray(x.events || []), [ev]),
          _scopeEditConfirmed: undefined
        });
        return _objectSpread(_objectSpread(_objectSpread({}, x), remainingSnScope(x, active)), {}, {
          _scopeEditConfirmed: undefined
        });
      });
      onChange({
        connectors: [].concat(_toConsumableArray(next), [inserted])
      });
      return;
    }
    onChange({
      connectors: scopedRowsPatch(connectors, cid, header, {
        events: [].concat(_toConsumableArray(c.events || []), [ev])
      })
    });
  };
  var requestEventFromTile = function requestEventFromTile(c, chosenAction) {
    if (!canRecordMating(user, c)) return;
    var expected = nextExpected(c);
    var action = chosenAction || expected;
    if (chosenAction && expected !== "either" && chosenAction !== expected) return;
    if (expected === "either" && !chosenAction) {
      var choice = window.prompt("".concat(c.nConect || "Connecteur", " : premi\xE8re action \xE0 enregistrer\n\n1 = Mating\n2 = Demating\n3 = annuler"), "1");
      if (choice === null || String(choice).trim() === "3") return;
      action = String(choice).trim() === "2" ? "Demating" : "Mating";
    }
    var label = action === "Mating" ? "Mating" : "Demating";
    if (window.confirm("".concat(c.nConect || "Connecteur", " : enregistrer ").concat(label, " maintenant ?"))) {
      addEvent(c.id, action);
    }
  };
  var updEv = function updEv(cid, eid, f, v) {
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (f === "comments" ? !perms.canComment : !canEdit(c)) return;
    onChange({
      connectors: scopedRowsPatch(connectors, cid, header, function (c) {
        return {
          events: c.events.map(function (e) {
            return e.id === eid ? _objectSpread(_objectSpread({}, e), {}, _defineProperty({}, f, v)) : e;
          })
        };
      })
    });
  };
  var confirmDelEv = function confirmDelEv(reason) {
    var cid = deleteEvTarget.cid,
      eid = deleteEvTarget.eid;
    var c = connectors.find(function (x) {
      return x.id === cid;
    });
    if (canEdit(c)) onChange({
      connectors: scopedRowsPatch(connectors, cid, header, function (c) {
        return {
          events: c.events.map(function (e) {
            return e.id === eid ? _objectSpread(_objectSpread({}, e), {}, {
              deleted: true,
              deletedReason: reason,
              deletedVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
              deletedDate: nowDT()
            }) : e;
          })
        };
      })
    });
    setDeleteEvTarget(null);
  };
  var restoreEv = function restoreEv(reason) {
    var cid = restoreEvTarget.cid,
      eid = restoreEvTarget.eid;
    onChange({
      connectors: scopedRowsPatch(connectors, cid, header, function (c) {
        return {
          events: c.events.map(function (e) {
            return e.id === eid ? _objectSpread(_objectSpread({}, e), {}, {
              deleted: false,
              restoredReason: reason,
              restoredVisa: (user === null || user === void 0 ? void 0 : user.trigram) || "?",
              restoredDate: nowDT()
            }) : e;
          })
        };
      })
    });
    setRestoreEvTarget(null);
  };
  var totalDeleted = connectors.filter(function (c) {
    return c.deleted;
  }).length;
  var visibleConnectors = connectors.filter(function (c) {
    return (!c.deleted || showDeleted || forceShowDeleted) && _rowMatchesSnFilter(c, snFilter, header);
  });
  var snRows = snRowsFromHeader(header);
  var connectorGroups = snFilter === "all" && snRows.length ? snRows.map(function (sn) {
    return {
      id: sn.id,
      label: snTitle(sn),
      rows: visibleConnectors.filter(function (c) {
        return rowMatchesSn(c, sn, snRows);
      })
    };
  }).filter(function (g) {
    return g.rows.length;
  }) : [{
    id: "active",
    label: null,
    rows: visibleConnectors
  }];
  var historyRows = connectors.flatMap(function (c) {
    return (c.events || []).map(function (ev, idx) {
      return {
        c: c,
        ev: ev,
        cycle: (idx + 1) / 2
      };
    });
  }).filter(function (x) {
    return (!x.c.deleted || showDeleted || forceShowDeleted) && (!x.ev.deleted || showDeleted || forceShowDeleted) && _rowMatchesSnFilter(x.c, snFilter, header) && (historyConnector === "all" || x.c.id === historyConnector);
  }).reverse();
  var activeVisibleConnectors = visibleConnectors.filter(function (c) {
    return !c.deleted;
  });
  var summaryStats = {
    total: activeVisibleConnectors.length,
    mattes: activeVisibleConnectors.filter(function (c) {
      var _lastActive;
      return ((_lastActive = lastActive(c)) === null || _lastActive === void 0 ? void 0 : _lastActive.action) === "Mating";
    }).length,
    demattes: activeVisibleConnectors.filter(function (c) {
      var _lastActive2;
      return ((_lastActive2 = lastActive(c)) === null || _lastActive2 === void 0 ? void 0 : _lastActive2.action) === "Demating";
    }).length,
    sansAction: activeVisibleConnectors.filter(function (c) {
      return !lastActive(c);
    }).length,
    cycles: activeVisibleConnectors.reduce(function (s, c) {
      return s + cycleCount(c);
    }, 0)
  };
  var cycleRows = visibleConnectors.filter(function (c) {
    return !c.deleted && (historyConnector === "all" || c.id === historyConnector);
  }).sort(function (a, b) {
    return connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect));
  }).flatMap(function (c) {
    var status = connStatus(c);
    var cycles = buildMatingCycles(c);
    if (!cycles.length) return [{
      c: c,
      status: status,
      idx: 0,
      mat: null,
      dem: null,
      empty: true
    }];
    return cycles.map(function (cy, i) {
      return {
        cy: cy,
        idx: i + 1
      };
    }).sort(function (a, b) {
      return String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy)));
    }).map(function (_ref85) {
      var cy = _ref85.cy,
        idx = _ref85.idx;
      return {
        c: c,
        status: status,
        idx: idx,
        mat: cy.mat,
        dem: cy.dem,
        empty: false
      };
    });
  });
  var cycleGroups = visibleConnectors.filter(function (c) {
    return !c.deleted && (historyConnector === "all" || c.id === historyConnector);
  }).sort(function (a, b) {
    return connectorSortKey(a.nConect).localeCompare(connectorSortKey(b.nConect));
  }).map(function (c) {
    var status = connStatus(c);
    var last = lastActive(c);
    var cycles = buildMatingCycles(c).map(function (cy, i) {
      return {
        cy: cy,
        n: i + 1
      };
    }).sort(function (a, b) {
      return String(cycleLastDt(b.cy)).localeCompare(String(cycleLastDt(a.cy))) || b.n - a.n;
    }).map(function (_ref86, i) {
      var cy = _ref86.cy;
      return {
        idx: i + 1,
        mat: cy.mat,
        dem: cy.dem,
        empty: false
      };
    });
    return {
      c: c,
      status: status,
      last: last,
      cycles: cycles.length ? cycles : [{
        idx: 0,
        mat: null,
        dem: null,
        empty: true
      }]
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1500
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement(Btn, {
    onClick: addC,
    small: true
  }, "+ Connecteur"), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(summaryStats.total, " connecteur").concat(summaryStats.total > 1 ? "s" : ""),
    color: C.border
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(summaryStats.mattes, " mat\xE9").concat(summaryStats.mattes > 1 ? "s" : ""),
    color: C.green
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(summaryStats.demattes, " d\xE9mat\xE9").concat(summaryStats.demattes > 1 ? "s" : ""),
    color: C.red
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(summaryStats.sansAction, " sans action"),
    color: C.muted
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(summaryStats.cycles, " cycles"),
    color: C.blue
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontFamily: "monospace"
    }
  }, "Filtre SN : ", snFilter === "all" ? "TRAVAIL = Tous" : snScopeLabel({
    snScope: "custom",
    snIds: [snFilter]
  }, snRows)), totalDeleted > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulés" : "▼ Voir annulés"))), connectors.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 48,
      fontSize: 13
    }
  }, "Cliquez ", /*#__PURE__*/React.createElement("strong", null, "+ Connecteur"), " pour ajouter un connecteur (J13, J15\u2026)"), connectors.length > 0 && connectorGroups.map(function (group) {
    return /*#__PURE__*/React.createElement("div", {
      key: group.id,
      style: {
        marginBottom: 16
      }
    }, group.label && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: "8px 0 7px"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      label: group.label,
      color: C.blue
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: C.muted,
        fontFamily: "monospace"
      }
    }, group.rows.length, " connecteur", group.rows.length > 1 ? "s" : "")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(156px,1fr))",
        gap: 8
      }
    }, group.rows.map(function (c) {
      var st = connStatus(c);
      var cy = cycleCount(c);
      var ne = nextExpected(c);
      var editable = canEdit(c);
      var last = lastActive(c);
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        role: "group",
        "aria-label": "Connecteur ".concat(c.nConect || "sans nom"),
        style: {
          minHeight: 124,
          border: "1px solid ".concat(c.deleted ? C.red : st.color),
          background: c.deleted ? "#da363318" : st.color + "16",
          borderRadius: 6,
          padding: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: c.validated && !c.deleted ? "0 0 0 1px ".concat(st.color, "22 inset") : undefined
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 6
        }
      }, !c.validated ? /*#__PURE__*/React.createElement("div", {
        onClick: function onClick(e) {
          return e.stopPropagation();
        },
        style: {
          width: 62
        }
      }, /*#__PURE__*/React.createElement(Input, {
        value: c.nConect,
        onChange: function onChange(v) {
          return updC(c.id, "nConect", v.toUpperCase());
        },
        placeholder: "J13",
        small: true,
        readOnly: !editable,
        style: _objectSpread({
          fontWeight: 900,
          fontSize: 12,
          textTransform: "uppercase",
          padding: "2px 4px"
        }, !editable ? LOCKED_INPUT_STYLE : {})
      })) : /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "monospace",
          fontSize: 16,
          fontWeight: 900,
          color: C.text,
          lineHeight: 1
        }
      }, c.nConect || "J?", /*#__PURE__*/React.createElement(CopyOriginMark, {
        origin: c.copyOrigin
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontFamily: "monospace",
          color: st.color,
          fontWeight: 800
        }
      }, cy)), c.connError && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: C.yellow,
          fontFamily: "monospace"
        }
      }, c.connError), !c.validated && /*#__PURE__*/React.createElement("div", {
        onClick: function onClick(e) {
          return e.stopPropagation();
        },
        style: {
          pointerEvents: "all"
        }
      }, /*#__PURE__*/React.createElement(SnScopePicker, {
        row: c,
        header: header,
        onChange: function onChange(fields) {
          return patchC(c.id, fields);
        },
        disabled: !!c.validated || !editable
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 9,
          color: st.color,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: .2
        }
      }, st.label.replace("⚡ ", "").replace("✓ ", "")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: C.muted,
          fontFamily: "monospace",
          marginTop: 1
        }
      }, last ? "".concat(last.visa || "?", " \xB7 ").concat(last.dt || "") : "aucune action")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          marginTop: 4
        }
      }, ["Mating", "Demating"].map(function (action) {
        return /*#__PURE__*/React.createElement(ConnectorActionButton, {
          key: action,
          action: action,
          connector: c.nConect || "Connecteur",
          disabled: !canRecordMating(user, c) || ne !== "either" && ne !== action,
          title: !c.validated ? "Valider le connecteur avant action" : !canRecordMating(user, c) ? "Action non autorisée" : ne !== "either" && ne !== action ? "".concat(action, " d\xE9j\xE0 enregistr\xE9") : "Enregistrer ".concat(action, " sur ").concat(c.nConect || "ce connecteur"),
          onClick: function onClick() {
            return requestEventFromTile(c, action);
          }
        });
      })), /*#__PURE__*/React.createElement("div", {
        onClick: function onClick(e) {
          return e.stopPropagation();
        },
        style: {
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 4,
          pointerEvents: "all",
          flexWrap: "wrap"
        }
      }, /*#__PURE__*/React.createElement(CommentBtn, {
        comments: c.comments || [],
        onChange: function onChange(v) {
          return updC(c.id, "comments", v);
        },
        user: user,
        disabled: !perms.canComment
      }), !c.deleted && perms.canWrite && onCopyAcross && /*#__PURE__*/React.createElement(MiniIconBtn, {
        onClick: function onClick() {
          return onCopyAcross(c);
        },
        color: C.blue,
        title: "Copier vers OF / SN"
      }, "\u29C9"), !c.deleted && !c.validated && editable && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MiniIconBtn, {
        onClick: function onClick() {
          return validateConn(c.id);
        },
        color: C.green,
        title: "Valider"
      }, "\u2713"), /*#__PURE__*/React.createElement(HistoryBtn, {
        row: c,
        mini: true
      }), /*#__PURE__*/React.createElement(MiniIconBtn, {
        onClick: function onClick() {
          return delConn(c.id);
        },
        color: C.border,
        title: "Supprimer"
      }, "\xD7")), !c.deleted && c.validated && editable && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MiniIconBtn, {
        onClick: function onClick() {
          return unlockConn(c.id);
        },
        color: C.yellow,
        title: "Modifier"
      }, "\u270E"), /*#__PURE__*/React.createElement(HistoryBtn, {
        row: c,
        mini: true
      }), /*#__PURE__*/React.createElement(MiniIconBtn, {
        onClick: function onClick() {
          return delConn(c.id);
        },
        color: C.red,
        title: "Annuler"
      }, "\xD7")), !c.deleted && !editable && perms.canWrite && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HistoryBtn, {
        row: c,
        mini: true
      })), c.deleted && /*#__PURE__*/React.createElement(PurgeLineButton, {
        user: user,
        data: data,
        onChange: onChange,
        id: c.id
      }), c.deleted && editable && /*#__PURE__*/React.createElement(MiniIconBtn, {
        onClick: function onClick() {
          return setRestoreConnTarget(c.id);
        },
        color: C.yellow,
        title: "R\xE9activer"
      }, "\u21A9")));
    })));
  }), connectors.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid ".concat(C.border),
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.raised,
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      justifyContent: "space-between",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.accent,
      fontSize: 12,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Cycles Mating/Demating"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10
    }
  }, "Une ligne par cycle, tri\xE9e par connecteur")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Connecteur"), /*#__PURE__*/React.createElement("select", {
    value: historyConnector,
    onChange: function onChange(e) {
      return setHistoryConnector(e.target.value);
    },
    style: {
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "4px 8px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none",
      minWidth: 120
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Tous"), visibleConnectors.map(function (c) {
    return /*#__PURE__*/React.createElement("option", {
      key: c.id,
      value: c.id
    }, c.nConect || "J?");
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 88
  }, "Connecteur"), /*#__PURE__*/React.createElement(TH, {
    w: 94
  }, "\xC9tat actuel"), /*#__PURE__*/React.createElement(TH, {
    w: 48
  }, "Cycle"), /*#__PURE__*/React.createElement(TH, {
    w: 122
  }, "Mating date"), /*#__PURE__*/React.createElement(TH, {
    w: 52,
    color: C.accent
  }, "Visa M"), /*#__PURE__*/React.createElement(TH, {
    w: 122
  }, "Demating date"), /*#__PURE__*/React.createElement(TH, {
    w: 52,
    color: C.accent
  }, "Visa D"), /*#__PURE__*/React.createElement(TH, {
    w: 78
  }, "N\xB0 SN"), /*#__PURE__*/React.createElement(TH, {
    w: 42
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement(TH, {
    w: 112
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, cycleGroups.flatMap(function (_ref87, gi) {
    var c = _ref87.c,
      status = _ref87.status,
      last = _ref87.last,
      cycles = _ref87.cycles;
    var tone = connectorStateTone(last === null || last === void 0 ? void 0 : last.action);
    return [/*#__PURE__*/React.createElement("tr", {
      key: "".concat(c.id, "_group"),
      style: {
        background: (last === null || last === void 0 ? void 0 : last.action) === "Mating" ? C.green + "1f" : (last === null || last === void 0 ? void 0 : last.action) === "Demating" ? C.red + "1f" : C.blue + "12",
        borderLeft: "3px solid ".concat(tone.stroke)
      }
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 10,
      style: {
        padding: "7px 10px",
        borderBottom: "1px solid ".concat(C.border)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 13,
        fontWeight: 900,
        color: C.text
      }
    }, c.nConect || "J?"), /*#__PURE__*/React.createElement(Badge, {
      label: status.label.replace("⚡ ", "").replace("✓ ", ""),
      color: status.color
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 10,
        color: C.muted
      }
    }, "Derni\xE8re action : ", (last === null || last === void 0 ? void 0 : last.action) || "aucune", " ", (last === null || last === void 0 ? void 0 : last.dt) || "", " ", (last === null || last === void 0 ? void 0 : last.visa) || ""), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 10,
        color: C.blue
      }
    }, snScopeLabel(c, snRowsFromHeader(header))), /*#__PURE__*/React.createElement(CommentBtn, {
      comments: c.comments || [],
      onChange: function onChange(v) {
        return updC(c.id, "comments", v);
      },
      user: user,
      disabled: !perms.canComment
    }))))].concat(_toConsumableArray(cycles.map(function (_ref88, i) {
      var idx = _ref88.idx,
        mat = _ref88.mat,
        dem = _ref88.dem,
        empty = _ref88.empty;
      return /*#__PURE__*/React.createElement("tr", {
        key: "".concat(c.id, "_").concat(idx || "empty", "_").concat(i),
        style: {
          background: (gi + i) % 2 === 0 ? "transparent" : C.stripe
        }
      }, /*#__PURE__*/React.createElement(TD, null), /*#__PURE__*/React.createElement(TD, null), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "monospace",
          fontSize: 11,
          color: C.muted
        }
      }, empty ? "—" : idx)), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "monospace",
          fontSize: 11,
          color: mat ? C.green : C.muted
        }
      }, (mat === null || mat === void 0 ? void 0 : mat.dt) || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 12,
          color: mat ? C.accent : C.muted
        }
      }, (mat === null || mat === void 0 ? void 0 : mat.visa) || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "monospace",
          fontSize: 11,
          color: dem ? C.blue : C.muted
        }
      }, (dem === null || dem === void 0 ? void 0 : dem.dt) || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: 12,
          color: dem ? C.accent : C.muted
        }
      }, (dem === null || dem === void 0 ? void 0 : dem.visa) || "—")), /*#__PURE__*/React.createElement(TD, null), /*#__PURE__*/React.createElement(TD, null), /*#__PURE__*/React.createElement(TD, {
        center: true,
        style: {
          pointerEvents: "all"
        }
      }, canEdit(c) && /*#__PURE__*/React.createElement(ActionGroup, null, mat && /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return setDeleteEvTarget({
            cid: c.id,
            eid: mat.id
          });
        },
        title: "Annuler l'action Mating",
        style: {
          background: C.green + "22",
          border: "1px solid ".concat(C.green),
          borderRadius: 4,
          color: C.green,
          fontSize: 9,
          padding: "2px 5px",
          cursor: "pointer",
          fontWeight: 800,
          whiteSpace: "nowrap"
        }
      }, "Annuler M"), dem && /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return setDeleteEvTarget({
            cid: c.id,
            eid: dem.id
          });
        },
        title: "Annuler l'action Demating",
        style: {
          background: C.blue + "22",
          border: "1px solid ".concat(C.blue),
          borderRadius: 4,
          color: C.blue,
          fontSize: 9,
          padding: "2px 5px",
          cursor: "pointer",
          fontWeight: 800,
          whiteSpace: "nowrap"
        }
      }, "Annuler D"))));
    })));
  }))), cycleGroups.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 14,
      fontSize: 12
    }
  }, "Aucun connecteur actif"))), deleteEvTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDelEv,
    onCancel: function onCancel() {
      return setDeleteEvTarget(null);
    }
  }), deleteConnTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDelConn,
    onCancel: function onCancel() {
      return setDeleteConnTarget(null);
    }
  }), restoreEvTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restoreEv,
    onCancel: function onCancel() {
      return setRestoreEvTarget(null);
    }
  }), restoreConnTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restoreC,
    onCancel: function onCancel() {
      return setRestoreConnTarget(null);
    }
  }));
};
// ─── 9. Open Work ──────────────────────────────────────────────────────────
var OPENWORK_EDIT_FIELDS = [{
  key: "snScope",
  label: "Mode SN"
}, {
  key: "snIds",
  label: "N° SN"
}, {
  key: "nOW",
  label: "N° OW"
}, {
  key: "description",
  label: "Description"
}, {
  key: "openVisa",
  label: "Visa ouverture"
}, {
  key: "openDate",
  label: "Date ouverture"
}, {
  key: "closedVisa",
  label: "Visa clôture"
}, {
  key: "closedDate",
  label: "Date clôture"
}, {
  key: "commentaires",
  label: "Commentaires"
}];
var TabOpenWork = function TabOpenWork(_ref89) {
  var data = _ref89.data,
    onChange = _ref89.onChange,
    user = _ref89.user,
    _ref89$perms = _ref89.perms,
    perms = _ref89$perms === void 0 ? {} : _ref89$perms,
    header = _ref89.header,
    _ref89$forceShowDelet = _ref89.forceShowDeleted,
    forceShowDeleted = _ref89$forceShowDelet === void 0 ? false : _ref89$forceShowDelet,
    onCopyAcross = _ref89.onCopyAcross;
  var rows = data.rows || [];
  var canEdit = function canEdit(row) {
    return canEditLine(user, row);
  };
  var add = function add() {
    if (!perms.canWrite) return;
    onChange({
      rows: [].concat(_toConsumableArray(rows), [_objectSpread(_objectSpread({
        id: uid()
      }, defaultSnScope(header)), {}, {
        createdVisa: user.trigram,
        createdDT: nowDT(),
        nOW: String(rows.length + 1).padStart(3, "0"),
        description: "",
        openVisa: user.trigram,
        openDate: now(),
        closedVisa: "",
        closedDate: "",
        commentaires: ""
      })])
    });
  };
  var _useState171 = useState(null),
    _useState172 = _slicedToArray(_useState171, 2),
    deleteTarget = _useState172[0],
    setDeleteTarget = _useState172[1];
  var _useState173 = useState(null),
    _useState174 = _slicedToArray(_useState173, 2),
    restoreTarget = _useState174[0],
    setRestoreTarget = _useState174[1];
  var _useState175 = useState(false),
    _useState176 = _slicedToArray(_useState175, 2),
    showDeleted = _useState176[0],
    setShowDeleted = _useState176[1];
  var snFilter = workSnFilter(header);
  var upd = function upd(id, f, v) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (f === "comments" ? !perms.canComment : !canEdit(r)) return;
    onChange({
      rows: scopedRowsPatch(rows, id, header, _defineProperty({}, f, v))
    });
  };
  var patchRow = function patchRow(id, fields) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsPatch(rows, id, header, fields)
    });
  };
  var dup = function dup(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!r || !perms.canWrite) return;
    if (onCopyAcross && !r.deleted) {
      onCopyAcross(r);
      return;
    }
    onChange({
      rows: [].concat(_toConsumableArray(rows), [duplicateRow(r, user, {
        nOW: String(rows.length + 1).padStart(3, "0"),
        openVisa: user.trigram,
        openDate: now(),
        closedVisa: "",
        closedDate: ""
      })])
    });
  };
  var del = function del(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    if (!r.validated && !r.editBase && !r.closedDate && !r.closedVisa) onChange({
      rows: rows.filter(function (x) {
        return x.id !== id;
      })
    });else if (!r.validated) onChange({
      rows: scopedRowsDelete(rows, id, header, {
        deleted: true,
        deletedReason: "",
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });else setDeleteTarget(id);
  };
  var restore = function restore(reason) {
    onChange({
      rows: rows.map(function (r) {
        return r.id === restoreTarget ? _objectSpread(_objectSpread({}, r), {}, {
          deleted: false,
          restoredReason: reason,
          restoredVisa: user.trigram,
          restoredDate: nowDT()
        }) : r;
      })
    });
    setRestoreTarget(null);
  };
  var confirmDel = function confirmDel(reason) {
    var r = rows.find(function (x) {
      return x.id === deleteTarget;
    });
    if (canEdit(r)) onChange({
      rows: scopedRowsDelete(rows, deleteTarget, header, {
        deleted: true,
        deletedReason: reason,
        deletedVisa: user.trigram,
        deletedDate: nowDT()
      })
    });
    setDeleteTarget(null);
  };
  var deletedCount = rows.filter(function (r) {
    return r.deleted;
  }).length;
  var REQUIRED = [{
    key: "description",
    label: "Description"
  }, {
    key: "openVisa",
    label: "Visa"
  }];
  var validateRow = function validateRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (!canEdit(r)) return;
    var miss = checkRequired(r, REQUIRED);
    if (miss.length) {
      upd(id, "validError", "Champs requis : " + miss.join(", "));
    } else {
      onChange({
        rows: scopedRowsPatch(rows, id, header, function (x) {
          return withEditHistory(x, user, OPENWORK_EDIT_FIELDS);
        })
      });
    }
  };
  var unlockRow = function unlockRow(id) {
    var r = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(r)) onChange({
      rows: rows.map(function (r) {
        return r.id === id ? _objectSpread(_objectSpread({}, r), {}, {
          validated: false,
          _scopeEditConfirmed: false,
          editBase: snapshotFields(r, OPENWORK_EDIT_FIELDS)
        }) : r;
      })
    });
  };
  var close = function close(id) {
    var row = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(row)) onChange({
      rows: scopedRowsPatch(rows, id, header, function (r) {
        return withEditHistory(_objectSpread(_objectSpread({}, r), {}, {
          closedVisa: user.trigram,
          closedDate: now(),
          editBase: r.editBase || snapshotFields(r, OPENWORK_EDIT_FIELDS)
        }), user, OPENWORK_EDIT_FIELDS);
      })
    });
  };
  var reopen = function reopen(id) {
    var row = rows.find(function (x) {
      return x.id === id;
    });
    if (canEdit(row)) onChange({
      rows: scopedRowsPatch(rows, id, header, function (r) {
        return withEditHistory(_objectSpread(_objectSpread({}, r), {}, {
          closedVisa: "",
          closedDate: "",
          editBase: r.editBase || snapshotFields(r, OPENWORK_EDIT_FIELDS)
        }), user, OPENWORK_EDIT_FIELDS);
      })
    });
  };
  var isClosed = function isClosed(r) {
    return !!r.closedDate;
  };
  var activeRows = effectiveScopedRows({
    header: header,
    openwork: {
      rows: rows
    }
  }, "openwork").filter(function (r) {
    return _rowMatchesSnFilter(r, snFilter, header);
  });
  var open = activeRows.filter(function (r) {
    return !isClosed(r);
  }).length;
  var closed = activeRows.filter(isClosed).length;
  var visibleRows = sortByNewestOperation(rows, function (r) {
    return r.openDate || r.createdDT;
  }).filter(function (r) {
    return (!r.deleted || showDeleted || forceShowDeleted) && _rowMatchesSnFilter(r, snFilter, header);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1450
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, perms.canWrite && /*#__PURE__*/React.createElement(Btn, {
    onClick: add,
    small: true
  }, "+ Open Work"), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(open, " OPEN"),
    color: C.yellow
  }), /*#__PURE__*/React.createElement(Badge, {
    label: "".concat(closed, " CL\xD4TUR\xC9").concat(closed > 1 ? "S" : ""),
    color: C.green
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontFamily: "monospace"
    }
  }, "Filtre SN : ", snFilter === "all" ? "TRAVAIL = Tous" : snScopeLabel({
    snScope: "custom",
    snIds: [snFilter]
  }, snRowsFromHeader(header))), deletedCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowDeleted(function (s) {
        return !s;
      });
    },
    color: showDeleted ? "#da3633" : C.border,
    small: true
  }, showDeleted ? "▲ Masquer annulées" : "▼ Voir annulées (" + deletedCount + ")"))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, {
    w: 118
  }, "Date / Heure"), /*#__PURE__*/React.createElement(TH, {
    w: 46,
    color: C.accent
  }, "Visa"), /*#__PURE__*/React.createElement(TH, {
    w: 78
  }, "N\xB0 SN"), /*#__PURE__*/React.createElement(TH, {
    w: 52
  }, "N\xB0 OW"), /*#__PURE__*/React.createElement(TH, null, "Description"), /*#__PURE__*/React.createElement(TH, {
    w: 76
  }, "Visa cl\xF4t."), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }, "Date cl\xF4t."), /*#__PURE__*/React.createElement(TH, null, "Commentaires"), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }, "Action"), /*#__PURE__*/React.createElement(TH, {
    w: 104
  }))), /*#__PURE__*/React.createElement("tbody", null, visibleRows.flatMap(function (r, i) {
    var editable = canEdit(r);
    var locked = !!r.validated || !editable;
    return [/*#__PURE__*/React.createElement("tr", {
      key: r.id,
      style: {
        background: r.deleted ? "#da363318" : isClosed(r) ? "#23863612" : i % 2 === 0 ? "transparent" : C.stripe,
        textDecoration: r.deleted ? "line-through" : undefined,
        opacity: r.deleted ? .6 : isClosed(r) ? .8 : 1,
        pointerEvents: r.deleted ? "none" : undefined,
        borderLeft: r.validated ? "3px solid ".concat(C.green) : r.validError ? "3px solid ".concat(C.red) : "3px solid ".concat(C.border)
      }
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted
      }
    }, r.createdDT || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: 12,
        color: C.accent
      }
    }, r.createdVisa || "—"), /*#__PURE__*/React.createElement(CopyOriginMark, {
      origin: r.copyOrigin
    })), /*#__PURE__*/React.createElement(TD, {
      style: {
        pointerEvents: r.deleted ? "none" : "all"
      }
    }, /*#__PURE__*/React.createElement(SnScopePicker, {
      row: r,
      header: header,
      onChange: function onChange(fields) {
        return patchRow(r.id, fields);
      },
      disabled: locked
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(Badge, {
      label: r.nOW,
      color: isClosed(r) ? C.green : C.yellow
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.description,
      onChange: function onChange(v) {
        return upd(r.id, "description", v);
      },
      small: true,
      readOnly: locked,
      style: locked ? LOCKED_INPUT_STYLE : {}
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.closedVisa,
      onChange: function onChange(v) {
        return upd(r.id, "closedVisa", v);
      },
      small: true,
      readOnly: !editable,
      style: _objectSpread(_objectSpread({}, !editable ? LOCKED_INPUT_STYLE : {}), {}, {
        background: isClosed(r) ? "#23863620" : undefined
      })
    })), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement(Input, {
      value: r.closedDate,
      onChange: function onChange(v) {
        return upd(r.id, "closedDate", v);
      },
      small: true,
      readOnly: !editable,
      placeholder: "\u2014",
      style: _objectSpread(_objectSpread({}, !editable ? LOCKED_INPUT_STYLE : {}), {}, {
        background: isClosed(r) ? "#23863620" : undefined,
        color: isClosed(r) ? C.green : undefined,
        fontWeight: isClosed(r) ? 700 : 400
      })
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(CommentBtn, {
      comments: r.comments || [],
      onChange: function onChange(v) {
        return upd(r.id, "comments", v);
      },
      user: user,
      disabled: !perms.canComment
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return isClosed(r) ? reopen(r.id) : close(r.id);
      },
      title: isClosed(r) ? "Réouvrir cet Open Work" : "Clore cet Open Work",
      style: {
        background: (isClosed(r) ? C.yellow : C.green) + "22",
        border: "1px solid ".concat(isClosed(r) ? C.yellow : C.green),
        borderRadius: 3,
        color: isClosed(r) ? C.yellow : C.green,
        fontSize: 9,
        padding: "2px 7px",
        cursor: "pointer",
        fontWeight: 800,
        whiteSpace: "nowrap"
      }
    }, isClosed(r) ? "Ouvrir" : "Clore"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    })), !editable && perms.canWrite && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }))), /*#__PURE__*/React.createElement(TD, {
      center: true,
      style: {
        pointerEvents: "all"
      }
    }, !r.deleted && !r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return validateRow(r.id);
      },
      color: C.green,
      title: "Valider"
    }, "\u2713"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.border,
      title: "Supprimer"
    }, "\xD7")), !r.deleted && r.validated && editable && /*#__PURE__*/React.createElement(ActionGroup, null, /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return unlockRow(r.id);
      },
      color: C.yellow,
      title: "Modifier"
    }, "\u270E"), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return dup(r.id);
      },
      color: C.blue,
      title: "Dupliquer"
    }, "\u29C9"), /*#__PURE__*/React.createElement(HistoryBtn, {
      row: r
    }), /*#__PURE__*/React.createElement(IconBtn, {
      onClick: function onClick() {
        return del(r.id);
      },
      color: C.red,
      title: "Annuler"
    }, "\xD7")))), r.validError && !r.validated && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_err"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 5px",
        background: "#da363315",
        borderBottom: "1px solid #da363340"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace"
      }
    }, "\u26A0 ", r.validError))), /*#__PURE__*/React.createElement(HistoryTrail, {
      key: r.id + "_hist",
      row: r,
      open: forceShowDeleted
    }), r.deleted && /*#__PURE__*/React.createElement("tr", {
      key: r.id + "_ann"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 99,
      style: {
        padding: "3px 10px 6px",
        background: "#da363325",
        borderBottom: "2px solid #da363355"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#da3633",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: .3
      }
    }, "\u2715 Annul\xE9 le ", /*#__PURE__*/React.createElement("strong", null, r.deletedDate), " par ", /*#__PURE__*/React.createElement("strong", null, r.deletedVisa), "\xA0\u2014\xA0Motif : ", r.deletedReason), /*#__PURE__*/React.createElement(PurgeLineButton, {
      user: user,
      data: data,
      onChange: onChange,
      id: r.id
    }), /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        setRestoreTarget(r.id);
      },
      style: {
        color: "#d29922",
        fontSize: 11,
        cursor: "pointer",
        fontWeight: 700,
        pointerEvents: "all",
        textDecoration: "none",
        marginLeft: 16,
        flexShrink: 0
      }
    }, "\u21A9 R\xE9activer"))))];
  }))), rows.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 24
    }
  }, "Aucun open work"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 11,
      color: C.muted
    }
  }, "Le bouton \"\u2713 Cl\xF4turer\" remplit automatiquement la date du jour \u2014 \xD7 annule et barre la ligne"), deleteTarget && /*#__PURE__*/React.createElement(DeleteModal, {
    godMode: perms.godMode,
    onConfirm: confirmDel,
    onCancel: function onCancel() {
      return setDeleteTarget(null);
    }
  }), restoreTarget && /*#__PURE__*/React.createElement(RestoreModal, {
    onConfirm: restore,
    onCancel: function onCancel() {
      return setRestoreTarget(null);
    }
  }));
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────
var hash = function hash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h.toString(36);
};
var ADMIN_TRIGRAM = "ADMIN";
var DEFAULT_ADMIN_PASSWORD = "admin";
var USER_INDEX_KEY = "users-list";
var defaultUserPassword = function defaultUserPassword(trigram) {
  return "".concat(String(trigram || "").trim().toLowerCase(), "0");
};
var cleanUserImportCell = function cleanUserImportCell(v) {
  return String(v || "").replace(/\*\*/g, "").trim();
};
var parseImportRows = function parseImportRows(text) {
  var source = String(text || "").replace(/^\uFEFF/, "");
  var first = source.split(/\r?\n/).find(function (l) {
    return l.trim();
  }) || "";
  var delimiter = first.includes(";") ? ";" : first.includes("\t") ? "\t" : first.includes("|") ? "|" : ",";
  var rows = [];
  var row = [],
    cell = "",
    quoted = false;
  for (var i = 0; i < source.length; i++) {
    var c = source[i];
    if (c === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (quoted || !cell.trim()) quoted = !quoted;else cell += c;
    } else if (c === delimiter && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && source[i + 1] === '\n') i++;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell.trim());
  rows.push(row);
  return rows.map(function (r) {
    return delimiter === "|" ? r.filter(function (v, i) {
      return v || i > 0 && i < r.length - 1;
    }) : r;
  }).filter(function (r) {
    return r.some(Boolean);
  });
};
var readImportFile = /*#__PURE__*/function () {
  var _readImportFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(file) {
    var bytes, text;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return file.arrayBuffer();
        case 1:
          bytes = _context0.v;
          text = new TextDecoder("utf-8").decode(bytes);
          return _context0.a(2, text.includes("\uFFFD") ? new TextDecoder("windows-1252").decode(bytes) : text);
      }
    }, _callee0);
  }));
  function readImportFile(_x4) {
    return _readImportFile.apply(this, arguments);
  }
  return readImportFile;
}();
var ImportCsvFile = function ImportCsvFile(_ref90) {
  var onText = _ref90.onText,
    onError = _ref90.onError;
  return /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".csv,.txt,.tsv",
    "aria-label": "Charger un fichier CSV",
    style: {
      color: C.text,
      maxWidth: "100%",
      marginBottom: 8
    },
    onChange: (/*#__PURE__*/function () {
      var _ref91 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(e) {
        var _e$target$files;
        var file, _t6, _t7;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
              e.target.value = "";
              if (file) {
                _context1.n = 1;
                break;
              }
              return _context1.a(2);
            case 1:
              _context1.p = 1;
              _t6 = onText;
              _context1.n = 2;
              return readImportFile(file);
            case 2:
              _t6(_context1.v);
              _context1.n = 4;
              break;
            case 3:
              _context1.p = 3;
              _t7 = _context1.v;
              onError("Erreur de lecture du fichier CSV");
            case 4:
              return _context1.a(2);
          }
        }, _callee1, null, [[1, 3]]);
      }));
      return function (_x5) {
        return _ref91.apply(this, arguments);
      };
    }())
  });
};
var splitUserImportLine = function splitUserImportLine(line) {
  var txt = String(line || "").trim();
  if (!txt) return [];
  if (txt.includes("|")) return txt.split("|").map(cleanUserImportCell).filter(function (v, i, a) {
    return v || i > 0 && i < a.length - 1;
  });
  if (txt.includes("\t")) return txt.split("\t").map(cleanUserImportCell);
  if (txt.includes(";")) return txt.split(";").map(cleanUserImportCell);
  if (/\s{2,}/.test(txt)) return txt.split(/\s{2,}/).map(cleanUserImportCell);
  return txt.split(",").map(cleanUserImportCell);
};
var userImportLabel = function userImportLabel(v) {
  return cleanUserImportCell(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
var isUserImportSeparator = function isUserImportSeparator(cells) {
  return cells.length && cells.every(function (c) {
    return !c || /^:?-{2,}:?$/.test(c);
  });
};
var roleFromImport = function roleFromImport(v) {
  return normalizeRole({
    role: cleanUserImportCell(v) || "Opérateur"
  });
};
var parseUserImportPaste = function parseUserImportPaste(text) {
  var rows = [];
  var headers = null;
  var headerKey = function headerKey(label) {
    var l = userImportLabel(label);
    if (l.includes("trigram") || l === "visa" || l === "user") return "trigram";
    if (l.includes("prenom") || l.includes("first")) return "prenom";
    if (l === "nom" || l.includes("name")) return "nom";
    if (l.includes("service") || l.includes("depart")) return "service";
    if (l.includes("role") || l.includes("fonction")) return "role";
    if (l.includes("mail")) return "email";
    return "";
  };
  parseImportRows(text).forEach(function (rawCells) {
    var cells = rawCells.map(cleanUserImportCell);
    if (!cells.length || !cells.some(Boolean) || isUserImportSeparator(cells)) return;
    var detected = cells.map(headerKey);
    if (detected.includes("trigram") && (detected.includes("role") || detected.includes("nom") || detected.includes("prenom"))) {
      headers = {};
      detected.forEach(function (key, i) {
        if (key && headers[key] === undefined) headers[key] = i;
      });
      return;
    }
    var pick = function pick(key) {
      return headers ? cells[headers[key]] : cells[{
        trigram: 0,
        prenom: 1,
        nom: 2,
        service: 3,
        role: 4,
        email: 5
      }[key]];
    };
    var trigram = cleanUserImportCell(pick("trigram")).toUpperCase().replace(/\s+/g, "");
    if (!trigram) return;
    rows.push(_objectSpread({
      trigram: trigram,
      prenom: cleanUserImportCell(pick("prenom")),
      nom: cleanUserImportCell(pick("nom")),
      service: cleanUserImportCell(pick("service")) || "Production",
      role: roleFromImport(pick("role"))
    }, pick("email") !== undefined ? {
      email: cleanUserImportCell(pick("email"))
    } : {}));
  });
  return _toConsumableArray(new Map(rows.map(function (u) {
    return [u.trigram, u];
  })).values());
};
var comparableUser = function comparableUser(u) {
  return JSON.stringify({
    trigram: String((u === null || u === void 0 ? void 0 : u.trigram) || "").toUpperCase(),
    prenom: String((u === null || u === void 0 ? void 0 : u.prenom) || "").trim(),
    nom: String((u === null || u === void 0 ? void 0 : u.nom) || "").trim(),
    service: String((u === null || u === void 0 ? void 0 : u.service) || "").trim(),
    role: normalizeRole(u),
    email: String((u === null || u === void 0 ? void 0 : u.email) || "").trim()
  });
};
var getUserIndex = /*#__PURE__*/function () {
  var _getUserIndex = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
    var r, _t8;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          _context10.n = 1;
          return window.storage.get(USER_INDEX_KEY, true);
        case 1:
          r = _context10.v;
          return _context10.a(2, r ? JSON.parse(r.value) : []);
        case 2:
          _context10.p = 2;
          _t8 = _context10.v;
          return _context10.a(2, []);
      }
    }, _callee10, null, [[0, 2]]);
  }));
  function getUserIndex() {
    return _getUserIndex.apply(this, arguments);
  }
  return getUserIndex;
}();
var setUserIndex = /*#__PURE__*/function () {
  var _setUserIndex = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(list) {
    var clean;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          clean = _toConsumableArray(new Set((list || []).map(function (t) {
            return String(t).toUpperCase();
          }).filter(Boolean))).sort();
          _context11.n = 1;
          return window.storage.set(USER_INDEX_KEY, JSON.stringify(clean), true);
        case 1:
          return _context11.a(2, clean);
      }
    }, _callee11);
  }));
  function setUserIndex(_x6) {
    return _setUserIndex.apply(this, arguments);
  }
  return setUserIndex;
}();
var DEFAULT_SERVICES = ["Production", "Qualité", "Ingénierie", "Méthodes", "Support"];
var servicesFromUsers = function servicesFromUsers(users) {
  return _toConsumableArray(new Set([].concat(DEFAULT_SERVICES, _toConsumableArray(users.map(function (u) {
    return String(u.service || "").trim();
  }).filter(Boolean))))).sort(function (a, b) {
    return a.localeCompare(b, "fr");
  });
};
var loadUserServices = /*#__PURE__*/function () {
  var _loadUserServices = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
    var keys, users, _t1, _t10, _t11, _t12, _t13, _t14, _t15;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          _context13.n = 1;
          return getUserIndex();
        case 1:
          keys = _context13.v.map(function (t) {
            return "user:".concat(t);
          });
          _context13.p = 2;
          if (!window.storage.list) {
            _context13.n = 4;
            break;
          }
          _t1 = _toConsumableArray;
          _t10 = Set;
          _t11 = [];
          _t12 = _toConsumableArray(keys);
          _t13 = _toConsumableArray;
          _context13.n = 3;
          return window.storage.list(true);
        case 3:
          _t14 = _t11.concat.call(_t11, _t12, _t13(_context13.v));
          keys = _t1(new _t10(_t14));
        case 4:
          _context13.n = 6;
          break;
        case 5:
          _context13.p = 5;
          _t15 = _context13.v;
        case 6:
          _context13.n = 7;
          return Promise.all(keys.filter(function (k) {
            return k.startsWith("user:");
          }).map(/*#__PURE__*/function () {
            var _ref92 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(key) {
              var _t9, _t0;
              return _regenerator().w(function (_context12) {
                while (1) switch (_context12.p = _context12.n) {
                  case 0:
                    _context12.p = 0;
                    _t9 = JSON;
                    _context12.n = 1;
                    return window.storage.get(key, true);
                  case 1:
                    return _context12.a(2, _t9.parse.call(_t9, _context12.v.value));
                  case 2:
                    _context12.p = 2;
                    _t0 = _context12.v;
                    return _context12.a(2, {});
                }
              }, _callee12, null, [[0, 2]]);
            }));
            return function (_x7) {
              return _ref92.apply(this, arguments);
            };
          }()));
        case 7:
          users = _context13.v;
          return _context13.a(2, servicesFromUsers(users));
      }
    }, _callee13, null, [[2, 5]]);
  }));
  function loadUserServices() {
    return _loadUserServices.apply(this, arguments);
  }
  return loadUserServices;
}();
var ensureDefaultAdmin = /*#__PURE__*/function () {
  var _ensureDefaultAdmin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
    var key, users, _t16;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          key = "user:".concat(ADMIN_TRIGRAM);
          _context14.p = 1;
          _context14.n = 2;
          return window.storage.get(key, true);
        case 2:
          _context14.n = 4;
          break;
        case 3:
          _context14.p = 3;
          _t16 = _context14.v;
          _context14.n = 4;
          return window.storage.set(key, JSON.stringify({
            trigram: ADMIN_TRIGRAM,
            pwd: hash(DEFAULT_ADMIN_PASSWORD),
            role: "Admin",
            service: "Administration",
            prenom: "Compte",
            nom: "Admin"
          }), true);
        case 4:
          _context14.n = 5;
          return getUserIndex();
        case 5:
          users = _context14.v;
          if (users.includes(ADMIN_TRIGRAM)) {
            _context14.n = 6;
            break;
          }
          _context14.n = 6;
          return setUserIndex([].concat(_toConsumableArray(users), [ADMIN_TRIGRAM]));
        case 6:
          return _context14.a(2);
      }
    }, _callee14, null, [[1, 3]]);
  }));
  function ensureDefaultAdmin() {
    return _ensureDefaultAdmin.apply(this, arguments);
  }
  return ensureDefaultAdmin;
}();

// ─── Profil utilisateur ────────────────────────────────────────────────────
var ProfileModal = function ProfileModal(_ref93) {
  var user = _ref93.user,
    onClose = _ref93.onClose,
    onSave = _ref93.onSave;
  var _React$useState11 = React.useState(_objectSpread({}, user)),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    profile = _React$useState12[0],
    setProfile = _React$useState12[1];
  var _React$useState13 = React.useState(false),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    pwdSection = _React$useState14[0],
    setPwdSection = _React$useState14[1];
  var _React$useState15 = React.useState(""),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    oldPwd = _React$useState16[0],
    setOldPwd = _React$useState16[1];
  var _React$useState17 = React.useState(""),
    _React$useState18 = _slicedToArray(_React$useState17, 2),
    newPwd = _React$useState18[0],
    setNewPwd = _React$useState18[1];
  var _React$useState19 = React.useState(""),
    _React$useState20 = _slicedToArray(_React$useState19, 2),
    newPwd2 = _React$useState20[0],
    setNewPwd2 = _React$useState20[1];
  var _React$useState21 = React.useState(""),
    _React$useState22 = _slicedToArray(_React$useState21, 2),
    err = _React$useState22[0],
    setErr = _React$useState22[1];
  var _React$useState23 = React.useState(""),
    _React$useState24 = _slicedToArray(_React$useState23, 2),
    ok = _React$useState24[0],
    setOk = _React$useState24[1];
  var _React$useState25 = React.useState(servicesFromUsers([user])),
    _React$useState26 = _slicedToArray(_React$useState25, 2),
    SERVICES = _React$useState26[0],
    setServices = _React$useState26[1];
  React.useEffect(function () {
    loadUserServices().then(setServices)["catch"](function () {});
  }, []);
  var saveProfile = function saveProfile() {
    onSave(_objectSpread({}, profile));
    setOk("✓ Profil mis à jour");
    setErr("");
  };
  var changePwd = /*#__PURE__*/function () {
    var _changePwd = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
      var key, r, u, _t17;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.p = _context15.n) {
          case 0:
            setErr("");
            setOk("");
            if (!(!oldPwd || !newPwd)) {
              _context15.n = 1;
              break;
            }
            setErr("Tous les champs sont requis");
            return _context15.a(2);
          case 1:
            if (!(newPwd !== newPwd2)) {
              _context15.n = 2;
              break;
            }
            setErr("Les mots de passe ne correspondent pas");
            return _context15.a(2);
          case 2:
            if (!(newPwd.length < 4)) {
              _context15.n = 3;
              break;
            }
            setErr("Mot de passe trop court (min 4 caractères)");
            return _context15.a(2);
          case 3:
            _context15.p = 3;
            if (!window.authApi) {
              _context15.n = 5;
              break;
            }
            _context15.n = 4;
            return window.authApi.changePassword(oldPwd, newPwd);
          case 4:
            setOk("✓ Mot de passe modifié");
            setOldPwd("");
            setNewPwd("");
            setNewPwd2("");
            setPwdSection(false);
            return _context15.a(2);
          case 5:
            key = "user:".concat(user.trigram);
            _context15.n = 6;
            return window.storage.get(key, true);
          case 6:
            r = _context15.v;
            if (r) {
              _context15.n = 7;
              break;
            }
            setErr("Compte introuvable");
            return _context15.a(2);
          case 7:
            u = JSON.parse(r.value);
            if (!(u.pwd !== hash(oldPwd))) {
              _context15.n = 8;
              break;
            }
            setErr("Mot de passe actuel incorrect");
            return _context15.a(2);
          case 8:
            _context15.n = 9;
            return window.storage.set(key, JSON.stringify(_objectSpread(_objectSpread(_objectSpread({}, u), profile), {}, {
              pwd: hash(newPwd)
            })), true);
          case 9:
            setOk("✓ Mot de passe modifié");
            setOldPwd("");
            setNewPwd("");
            setNewPwd2("");
            setPwdSection(false);
            _context15.n = 11;
            break;
          case 10:
            _context15.p = 10;
            _t17 = _context15.v;
            setErr("Erreur lors du changement");
          case 11:
            return _context15.a(2);
        }
      }, _callee15, null, [[3, 10]]);
    }));
    function changePwd() {
      return _changePwd.apply(this, arguments);
    }
    return changePwd;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 10,
      width: "100%",
      maxWidth: 480,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 20px",
      borderBottom: "1px solid ".concat(C.border),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.accent + "33",
      border: "1px solid ".concat(C.accent),
      borderRadius: "50%",
      width: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      fontWeight: 900,
      color: C.accent,
      fontSize: 14
    }
  }, user.trigram), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: C.text
    }
  }, "Mon profil"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted
    }
  }, user.nom && user.prenom ? "".concat(user.prenom, " ").concat(user.nom) : user.trigram))), /*#__PURE__*/React.createElement("span", {
    onClick: onClose,
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 20
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, [["Prénom", "prenom", ""], ["Nom", "nom", ""]].map(function (_ref94) {
    var _ref95 = _slicedToArray(_ref94, 3),
      label = _ref95[0],
      key = _ref95[1],
      ph = _ref95[2];
    return /*#__PURE__*/React.createElement("div", {
      key: key
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8,
        marginBottom: 3
      }
    }, label), /*#__PURE__*/React.createElement(Input, {
      value: profile[key] || "",
      onChange: function onChange(v) {
        return setProfile(function (p) {
          return _objectSpread(_objectSpread({}, p), {}, _defineProperty({}, key, v));
        });
      },
      placeholder: ph || label,
      small: true
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 3
    }
  }, "Service"), /*#__PURE__*/React.createElement("select", {
    value: profile.service || "",
    onChange: function onChange(e) {
      return setProfile(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          service: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "5px 8px",
      fontSize: 12,
      fontFamily: "monospace",
      outline: "none"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2014 choisir \u2014"), SERVICES.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s
    }, s);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 3
    }
  }, "R\xF4le"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.muted,
      padding: "5px 8px",
      fontSize: 12,
      fontFamily: "monospace"
    }
  }, normalizeRole(profile)))), ok && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#23863620",
      border: "1px solid #238636",
      borderRadius: 4,
      padding: "6px 12px",
      color: C.green,
      fontSize: 12
    }
  }, ok), err && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#da363320",
      border: "1px solid #da3633",
      borderRadius: 4,
      padding: "6px 12px",
      color: C.red,
      fontSize: 12
    }
  }, err), /*#__PURE__*/React.createElement(Btn, {
    onClick: saveProfile,
    color: C.green,
    small: true
  }, "\u2713 Enregistrer le profil"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid ".concat(C.border),
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return setPwdSection(function (v) {
        return !v;
      });
    },
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 11,
      display: "flex",
      alignItems: "center",
      gap: 6,
      userSelect: "none"
    }
  }, pwdSection ? "▼" : "▶", " Changer le mot de passe"), pwdSection && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, [["Mot de passe actuel", oldPwd, setOldPwd], ["Nouveau mot de passe", newPwd, setNewPwd], ["Confirmer le nouveau", newPwd2, setNewPwd2]].map(function (_ref96) {
    var _ref97 = _slicedToArray(_ref96, 3),
      label = _ref97[0],
      val = _ref97[1],
      set = _ref97[2];
    return /*#__PURE__*/React.createElement("div", {
      key: label
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8,
        marginBottom: 3
      }
    }, label), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: val,
      onChange: function onChange(e) {
        return set(e.target.value);
      },
      style: {
        width: "100%",
        background: C.input,
        border: "1px solid ".concat(C.border),
        borderRadius: 4,
        color: C.text,
        padding: "5px 8px",
        fontSize: 12,
        fontFamily: "monospace",
        outline: "none",
        boxSizing: "border-box"
      }
    }));
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: changePwd,
    color: C.blue,
    small: true
  }, "\uD83D\uDD11 Changer le mot de passe"))))));
};
var AdminUsersModal = function AdminUsersModal(_ref98) {
  var onClose = _ref98.onClose;
  var blank = {
    trigram: "",
    prenom: "",
    nom: "",
    service: "Production",
    role: "Opérateur",
    email: "",
    pwd: ""
  };
  var _React$useState27 = React.useState([]),
    _React$useState28 = _slicedToArray(_React$useState27, 2),
    users = _React$useState28[0],
    setUsers = _React$useState28[1];
  var _React$useState29 = React.useState(blank),
    _React$useState30 = _slicedToArray(_React$useState29, 2),
    form = _React$useState30[0],
    setForm = _React$useState30[1];
  var _React$useState31 = React.useState(false),
    _React$useState32 = _slicedToArray(_React$useState31, 2),
    newService = _React$useState32[0],
    setNewService = _React$useState32[1];
  var _React$useState33 = React.useState(""),
    _React$useState34 = _slicedToArray(_React$useState33, 2),
    importText = _React$useState34[0],
    setImportText = _React$useState34[1];
  var _React$useState35 = React.useState(""),
    _React$useState36 = _slicedToArray(_React$useState35, 2),
    err = _React$useState36[0],
    setErr = _React$useState36[1];
  var _React$useState37 = React.useState(""),
    _React$useState38 = _slicedToArray(_React$useState37, 2),
    ok = _React$useState38[0],
    setOk = _React$useState38[1];
  var roleColor = function roleColor(role) {
    var r = normalizeRole({
      role: role
    });
    if (r === "Admin") return C.red;
    if (r === "Manager") return C.blue;
    if (r === "Contrôleur") return C.yellow;
    if (r === "Logistique") return C.purple;
    if (r === "Consultation") return C.muted;
    return C.green;
  };
  var load = React.useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    var _rows, index, storageKeys, discovered, merged, rows, seen, _iterator3, _step3, trigram, r, _t18, _t19, _t20;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          if (!window.authApi) {
            _context16.n = 2;
            break;
          }
          _context16.n = 1;
          return window.authApi.users();
        case 1:
          _rows = _context16.v;
          setUsers(_rows.sort(function (a, b) {
            return (a.trigram || "").localeCompare(b.trigram || "");
          }));
          return _context16.a(2);
        case 2:
          _context16.n = 3;
          return ensureDefaultAdmin();
        case 3:
          _context16.n = 4;
          return getUserIndex();
        case 4:
          index = _context16.v;
          _context16.p = 5;
          if (!window.storage.list) {
            _context16.n = 9;
            break;
          }
          _context16.n = 6;
          return window.storage.list(true);
        case 6:
          storageKeys = _context16.v;
          discovered = storageKeys.filter(function (k) {
            return String(k || "").startsWith("user:");
          }).map(function (k) {
            return String(k).slice(5).toUpperCase();
          }).filter(Boolean);
          merged = _toConsumableArray(new Set([].concat(_toConsumableArray(index), _toConsumableArray(discovered)))).sort();
          if (!(merged.length !== index.length || merged.some(function (v, i) {
            return v !== index[i];
          }))) {
            _context16.n = 8;
            break;
          }
          _context16.n = 7;
          return setUserIndex(merged);
        case 7:
          index = _context16.v;
          _context16.n = 9;
          break;
        case 8:
          index = merged;
        case 9:
          _context16.n = 11;
          break;
        case 10:
          _context16.p = 10;
          _t18 = _context16.v;
        case 11:
          rows = [];
          seen = new Set();
          _iterator3 = _createForOfIteratorHelper(index);
          _context16.p = 12;
          _iterator3.s();
        case 13:
          if ((_step3 = _iterator3.n()).done) {
            _context16.n = 19;
            break;
          }
          trigram = _step3.value;
          if (!seen.has(trigram)) {
            _context16.n = 14;
            break;
          }
          return _context16.a(3, 18);
        case 14:
          seen.add(trigram);
          _context16.p = 15;
          _context16.n = 16;
          return window.storage.get("user:".concat(trigram), true);
        case 16:
          r = _context16.v;
          if (r) rows.push(JSON.parse(r.value));
          _context16.n = 18;
          break;
        case 17:
          _context16.p = 17;
          _t19 = _context16.v;
        case 18:
          _context16.n = 13;
          break;
        case 19:
          _context16.n = 21;
          break;
        case 20:
          _context16.p = 20;
          _t20 = _context16.v;
          _iterator3.e(_t20);
        case 21:
          _context16.p = 21;
          _iterator3.f();
          return _context16.f(21);
        case 22:
          setUsers(rows.sort(function (a, b) {
            return (a.trigram || "").localeCompare(b.trigram || "");
          }));
        case 23:
          return _context16.a(2);
      }
    }, _callee16, null, [[15, 17], [12, 20, 21, 22], [5, 10]]);
  })), []);
  React.useEffect(function () {
    load();
  }, [load]);
  var resetMessages = function resetMessages() {
    setErr("");
    setOk("");
  };
  var saveUser = /*#__PURE__*/function () {
    var _saveUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var trigram, existing, pwd, next, _t21, _t22, _t23, _t24;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.p = _context17.n) {
          case 0:
            resetMessages();
            trigram = form.trigram.trim().toUpperCase();
            if (trigram) {
              _context17.n = 1;
              break;
            }
            setErr("Trigramme requis");
            return _context17.a(2);
          case 1:
            if (!(trigram.length < 2 || trigram.length > 8)) {
              _context17.n = 2;
              break;
            }
            setErr("Trigramme : 2 à 8 caractères");
            return _context17.a(2);
          case 2:
            if (!(form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))) {
              _context17.n = 3;
              break;
            }
            setErr("Adresse e-mail invalide");
            return _context17.a(2);
          case 3:
            _context17.p = 3;
            existing = users.find(function (u) {
              return u.trigram === trigram;
            }) || {};
            if (!window.authApi) {
              _context17.n = 6;
              break;
            }
            _context17.n = 4;
            return window.authApi.saveUser(_objectSpread(_objectSpread(_objectSpread({}, existing), form), {}, {
              email: String(form.email || "").trim(),
              trigram: trigram,
              role: normalizeRole(form)
            }), form.pwd);
          case 4:
            setForm(blank);
            setOk("Utilisateur ".concat(trigram, " enregistr\xE9").concat(form.pwd ? "" : " - MDP initial : ".concat(defaultUserPassword(trigram))));
            _context17.n = 5;
            return load();
          case 5:
            return _context17.a(2);
          case 6:
            pwd = form.pwd ? hash(form.pwd) : existing.pwd || hash(defaultUserPassword(trigram));
            next = _objectSpread(_objectSpread(_objectSpread({}, existing), form), {}, {
              email: String(form.email || "").trim(),
              trigram: trigram,
              role: normalizeRole(form),
              pwd: pwd,
              mustChangePassword: form.pwd ? true : !!existing.mustChangePassword
            });
            _context17.n = 7;
            return window.storage.set("user:".concat(trigram), JSON.stringify(next), true);
          case 7:
            _t21 = setUserIndex;
            _t22 = [];
            _t23 = _toConsumableArray;
            _context17.n = 8;
            return getUserIndex();
          case 8:
            _context17.n = 9;
            return _t21(_t22.concat.call(_t22, _t23(_context17.v), [trigram]));
          case 9:
            setForm(blank);
            setOk("Utilisateur ".concat(trigram, " enregistr\xE9").concat(form.pwd ? "" : " - MDP initial : ".concat(defaultUserPassword(trigram))));
            _context17.n = 10;
            return load();
          case 10:
            _context17.n = 12;
            break;
          case 11:
            _context17.p = 11;
            _t24 = _context17.v;
            setErr("Erreur lors de l'enregistrement");
          case 12:
            return _context17.a(2);
        }
      }, _callee17, null, [[3, 11]]);
    }));
    function saveUser() {
      return _saveUser.apply(this, arguments);
    }
    return saveUser;
  }();
  var importUsers = /*#__PURE__*/function () {
    var _importUsers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
      var parsed, created, updated, unchanged, result, currentIndex, nextIndex, _iterator4, _step4, imported, existing, r, next, _t25, _t26, _t27;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.p = _context18.n) {
          case 0:
            resetMessages();
            parsed = parseUserImportPaste(importText);
            if (parsed.length) {
              _context18.n = 1;
              break;
            }
            setErr("Aucun utilisateur détecté dans le collage");
            return _context18.a(2);
          case 1:
            if (!parsed.some(function (u) {
              return u.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email);
            })) {
              _context18.n = 2;
              break;
            }
            setErr("Adresse e-mail invalide dans l'import");
            return _context18.a(2);
          case 2:
            created = 0, updated = 0, unchanged = 0;
            _context18.p = 3;
            if (!window.authApi) {
              _context18.n = 6;
              break;
            }
            _context18.n = 4;
            return window.authApi.importUsers(parsed);
          case 4:
            result = _context18.v;
            created = result.created || 0;
            updated = result.updated || 0;
            unchanged = result.unchanged || 0;
            setImportText("");
            setOk("Import utilisateurs : ".concat(created, " cr\xE9\xE9").concat(created > 1 ? "s" : "", ", ").concat(updated, " modifi\xE9").concat(updated > 1 ? "s" : "", ", ").concat(unchanged, " inchang\xE9").concat(unchanged > 1 ? "s" : "", ". MDP initial = trigramme minuscule + 0."));
            _context18.n = 5;
            return load();
          case 5:
            return _context18.a(2);
          case 6:
            _context18.n = 7;
            return getUserIndex();
          case 7:
            currentIndex = _context18.v;
            nextIndex = _toConsumableArray(currentIndex);
            _iterator4 = _createForOfIteratorHelper(parsed);
            _context18.p = 8;
            _iterator4.s();
          case 9:
            if ((_step4 = _iterator4.n()).done) {
              _context18.n = 20;
              break;
            }
            imported = _step4.value;
            existing = null;
            _context18.p = 10;
            _context18.n = 11;
            return window.storage.get("user:".concat(imported.trigram), true);
          case 11:
            r = _context18.v;
            if (r) existing = JSON.parse(r.value);
            _context18.n = 13;
            break;
          case 12:
            _context18.p = 12;
            _t25 = _context18.v;
          case 13:
            if (!existing) {
              _context18.n = 16;
              break;
            }
            next = _objectSpread(_objectSpread(_objectSpread({}, existing), imported), {}, {
              pwd: existing.pwd || hash(defaultUserPassword(imported.trigram))
            });
            if (!(comparableUser(existing) === comparableUser(next))) {
              _context18.n = 14;
              break;
            }
            unchanged++;
            return _context18.a(3, 19);
          case 14:
            _context18.n = 15;
            return window.storage.set("user:".concat(imported.trigram), JSON.stringify(next), true);
          case 15:
            updated++;
            _context18.n = 18;
            break;
          case 16:
            _context18.n = 17;
            return window.storage.set("user:".concat(imported.trigram), JSON.stringify(_objectSpread(_objectSpread({}, imported), {}, {
              pwd: hash(defaultUserPassword(imported.trigram))
            })), true);
          case 17:
            created++;
          case 18:
            if (!nextIndex.includes(imported.trigram)) nextIndex.push(imported.trigram);
          case 19:
            _context18.n = 9;
            break;
          case 20:
            _context18.n = 22;
            break;
          case 21:
            _context18.p = 21;
            _t26 = _context18.v;
            _iterator4.e(_t26);
          case 22:
            _context18.p = 22;
            _iterator4.f();
            return _context18.f(22);
          case 23:
            _context18.n = 24;
            return setUserIndex(nextIndex);
          case 24:
            setImportText("");
            setOk("Import utilisateurs : ".concat(created, " cr\xE9\xE9").concat(created > 1 ? "s" : "", ", ").concat(updated, " modifi\xE9").concat(updated > 1 ? "s" : "", ", ").concat(unchanged, " inchang\xE9").concat(unchanged > 1 ? "s" : "", ". MDP initial = trigramme minuscule + 0."));
            _context18.n = 25;
            return load();
          case 25:
            _context18.n = 27;
            break;
          case 26:
            _context18.p = 26;
            _t27 = _context18.v;
            setErr("Erreur pendant l'import utilisateurs");
          case 27:
            return _context18.a(2);
        }
      }, _callee18, null, [[10, 12], [8, 21, 22, 23], [3, 26]]);
    }));
    function importUsers() {
      return _importUsers.apply(this, arguments);
    }
    return importUsers;
  }();
  var editUser = function editUser(u) {
    resetMessages();
    setNewService(false);
    setForm(_objectSpread(_objectSpread({}, u), {}, {
      role: normalizeRole(u),
      pwd: ""
    }));
  };
  var deleteUser = /*#__PURE__*/function () {
    var _deleteUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(trigram) {
      var _t28, _t29;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.p = _context19.n) {
          case 0:
            resetMessages();
            if (!(trigram === ADMIN_TRIGRAM)) {
              _context19.n = 1;
              break;
            }
            setErr("Le compte ADMIN ne peut pas être supprimé");
            return _context19.a(2);
          case 1:
            if (window.confirm("Supprimer l'utilisateur ".concat(trigram, " ?"))) {
              _context19.n = 2;
              break;
            }
            return _context19.a(2);
          case 2:
            _context19.p = 2;
            if (!window.authApi) {
              _context19.n = 5;
              break;
            }
            _context19.n = 3;
            return window.authApi.deleteUser(trigram);
          case 3:
            setOk("Utilisateur ".concat(trigram, " supprim\xE9"));
            _context19.n = 4;
            return load();
          case 4:
            return _context19.a(2);
          case 5:
            _context19.n = 6;
            return window.storage["delete"]("user:".concat(trigram), true);
          case 6:
            _t28 = setUserIndex;
            _context19.n = 7;
            return getUserIndex();
          case 7:
            _context19.n = 8;
            return _t28(_context19.v.filter(function (t) {
              return t !== trigram;
            }));
          case 8:
            setOk("Utilisateur ".concat(trigram, " supprim\xE9"));
            _context19.n = 9;
            return load();
          case 9:
            _context19.n = 11;
            break;
          case 10:
            _context19.p = 10;
            _t29 = _context19.v;
            setErr("Erreur lors de la suppression");
          case 11:
            return _context19.a(2);
        }
      }, _callee19, null, [[2, 10]]);
    }));
    function deleteUser(_x8) {
      return _deleteUser.apply(this, arguments);
    }
    return deleteUser;
  }();
  var resetPassword = /*#__PURE__*/function () {
    var _resetPassword = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(account) {
      var _result, result, stored, _t30;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.p = _context20.n) {
          case 0:
            resetMessages();
            if (window.confirm("R\xE9initialiser le mot de passe de ".concat(account.trigram, " \xE0 ").concat(defaultUserPassword(account.trigram), " ? Il devra le changer \xE0 sa prochaine connexion."))) {
              _context20.n = 1;
              break;
            }
            return _context20.a(2);
          case 1:
            _context20.p = 1;
            if (!window.authApi) {
              _context20.n = 4;
              break;
            }
            _context20.n = 2;
            return window.authApi.resetPassword(account.trigram);
          case 2:
            _result = _context20.v;
            setOk("Mot de passe temporaire de ".concat(account.trigram, " : ").concat(_result.temporaryPassword, ". Changement obligatoire \xE0 la prochaine connexion."));
            _context20.n = 3;
            return load();
          case 3:
            return _context20.a(2);
          case 4:
            _context20.n = 5;
            return window.storage.get("user:".concat(account.trigram), true);
          case 5:
            result = _context20.v;
            stored = JSON.parse(result.value);
            _context20.n = 6;
            return window.storage.set("user:".concat(account.trigram), JSON.stringify(_objectSpread(_objectSpread({}, stored), {}, {
              pwd: hash(defaultUserPassword(account.trigram)),
              mustChangePassword: true
            })), true);
          case 6:
            setOk("Mot de passe temporaire de ".concat(account.trigram, " : ").concat(defaultUserPassword(account.trigram), ". Changement obligatoire \xE0 la prochaine connexion."));
            _context20.n = 7;
            return load();
          case 7:
            _context20.n = 9;
            break;
          case 8:
            _context20.p = 8;
            _t30 = _context20.v;
            setErr("Erreur lors de la réinitialisation du mot de passe");
          case 9:
            return _context20.a(2);
        }
      }, _callee20, null, [[1, 8]]);
    }));
    function resetPassword(_x9) {
      return _resetPassword.apply(this, arguments);
    }
    return resetPassword;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 8,
      width: "100%",
      maxWidth: 1080,
      maxHeight: "86vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      borderBottom: "1px solid ".concat(C.border),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      color: C.accent,
      fontSize: 14
    }
  }, "Administration utilisateurs"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted
    }
  }, users.length, " utilisateur", users.length > 1 ? "s" : "")), /*#__PURE__*/React.createElement("span", {
    onClick: onClose,
    style: {
      cursor: "pointer",
      color: C.muted,
      fontSize: 22
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: "grid",
      gridTemplateColumns: "320px minmax(0,1fr)",
      gap: 16,
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 10
    }
  }, "Cr\xE9er / modifier"), [["Trigramme", "trigram", "ADMIN"], ["Prénom", "prenom", "Julien"], ["Nom", "nom", "Grosjean"], ["Service", "service", "Production"], ["E-mail", "email", "prenom.nom@entreprise.com"]].map(function (_ref100) {
    var _ref101 = _slicedToArray(_ref100, 3),
      label = _ref101[0],
      key = _ref101[1],
      ph = _ref101[2];
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      style: {
        marginBottom: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8,
        marginBottom: 3
      }
    }, label), key === "service" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
      "aria-label": "Service",
      value: newService ? "__new__" : form.service || "",
      onChange: function onChange(e) {
        var adding = e.target.value === "__new__";
        setNewService(adding);
        setForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            service: adding ? "" : e.target.value
          });
        });
      },
      style: {
        width: "100%",
        background: C.input,
        border: "1px solid ".concat(C.border),
        borderRadius: 4,
        color: C.text,
        padding: "5px 8px",
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Choisir un service"), servicesFromUsers([].concat(_toConsumableArray(users), [form])).map(function (s) {
      return /*#__PURE__*/React.createElement("option", {
        key: s,
        value: s
      }, s);
    }), /*#__PURE__*/React.createElement("option", {
      value: "__new__"
    }, "+ Nouveau service")), newService && /*#__PURE__*/React.createElement(Input, {
      value: form.service || "",
      onChange: function onChange(v) {
        return setForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            service: v
          });
        });
      },
      placeholder: "Nouveau service",
      small: true
    })) : /*#__PURE__*/React.createElement(Input, {
      value: form[key] || "",
      onChange: function onChange(v) {
        return setForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, _defineProperty({}, key, key === "trigram" ? v.toUpperCase() : v));
        });
      },
      placeholder: ph,
      small: true,
      readOnly: key === "trigram" && form.trigram === ADMIN_TRIGRAM
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 3
    }
  }, "R\xF4le"), /*#__PURE__*/React.createElement("select", {
    value: form.role || "Opérateur",
    onChange: function onChange(e) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          role: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "4px 6px",
      fontSize: 11,
      fontFamily: "monospace",
      outline: "none"
    }
  }, ROLES.map(function (r) {
    return /*#__PURE__*/React.createElement("option", {
      key: r,
      value: r
    }, r);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 3
    }
  }, "Mot de passe"), /*#__PURE__*/React.createElement(Input, {
    value: form.pwd || "",
    onChange: function onChange(v) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          pwd: v
        });
      });
    },
    type: "password",
    placeholder: form.trigram ? defaultUserPassword(form.trigram) : "auto",
    small: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: C.muted,
      marginTop: 3
    }
  }, "Vide = ", form.trigram ? defaultUserPassword(form.trigram) : "trigramme minuscule + 0", " \xE0 la cr\xE9ation, inchang\xE9 \xE0 la modification. Un mot de passe impos\xE9 devra \xEAtre chang\xE9 \xE0 la prochaine connexion.")), err && /*#__PURE__*/React.createElement(ErrBox, {
    msg: err
  }), ok && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.green + "22",
      border: "1px solid ".concat(C.green),
      color: C.green,
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
      marginBottom: 14
    }
  }, ok), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: saveUser,
    color: C.green,
    small: true
  }, form.trigram && users.some(function (u) {
    return u.trigram === form.trigram;
  }) ? "Mettre à jour" : "Créer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      setForm(blank);
      resetMessages();
    },
    color: C.border,
    small: true
  }, "R\xE9initialiser")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid ".concat(C.border),
      marginTop: 14,
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: .8,
      marginBottom: 6
    }
  }, "Import utilisateurs"), /*#__PURE__*/React.createElement(ImportCsvFile, {
    onText: function onText(text) {
      setImportText(text);
      resetMessages();
    },
    onError: setErr
  }), /*#__PURE__*/React.createElement("textarea", {
    value: importText,
    onChange: function onChange(e) {
      setImportText(e.target.value);
      resetMessages();
    },
    placeholder: "Trigramme;Prénom;Nom;Service;Rôle;E-mail\nJGR;Julien;Grosjean;Opération Spatiale;Manager;julien@entreprise.com",
    rows: 6,
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      fontSize: 11,
      fontFamily: "monospace",
      padding: "7px 8px",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: importUsers,
    color: importText.trim() ? C.green : C.border,
    small: true,
    disabled: !importText.trim()
  }, "Importer"))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: "auto",
      maxHeight: "62vh"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(TH, null, "Trigramme"), /*#__PURE__*/React.createElement(TH, null, "Nom"), /*#__PURE__*/React.createElement(TH, null, "Service"), /*#__PURE__*/React.createElement(TH, null, "R\xF4le"), /*#__PURE__*/React.createElement(TH, {
    w: 180
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, users.map(function (u) {
    return /*#__PURE__*/React.createElement("tr", {
      key: u.trigram
    }, /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800,
        color: u.trigram === ADMIN_TRIGRAM ? C.accent : C.text
      }
    }, u.trigram)), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.text,
        fontWeight: 650
      }
    }, [u.prenom, u.nom].filter(Boolean).join(" ") || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.text
      }
    }, u.service || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid ".concat(roleColor(u.role)),
        background: roleColor(u.role) + "22",
        color: roleColor(u.role),
        borderRadius: 4,
        padding: "2px 7px",
        fontSize: 11,
        fontWeight: 800,
        whiteSpace: "nowrap"
      }
    }, normalizeRole(u))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Btn, {
      onClick: function onClick() {
        return editUser(u);
      },
      color: C.blue,
      small: true
    }, "Modifier / MDP"), /*#__PURE__*/React.createElement(Btn, {
      onClick: function onClick() {
        return resetPassword(u);
      },
      color: C.yellow,
      small: true
    }, "R\xE9initialiser MDP"), /*#__PURE__*/React.createElement(Btn, {
      onClick: function onClick() {
        return deleteUser(u.trigram);
      },
      color: C.red,
      small: true,
      disabled: u.trigram === ADMIN_TRIGRAM
    }, "Supprimer"))));
  })))))));
};
var RequiredPasswordChange = function RequiredPasswordChange(_ref102) {
  var user = _ref102.user,
    onDone = _ref102.onDone,
    onLogout = _ref102.onLogout;
  var _useState177 = useState(""),
    _useState178 = _slicedToArray(_useState177, 2),
    password = _useState178[0],
    setPassword = _useState178[1];
  var _useState179 = useState(""),
    _useState180 = _slicedToArray(_useState179, 2),
    confirmation = _useState180[0],
    setConfirmation = _useState180[1];
  var _useState181 = useState(""),
    _useState182 = _slicedToArray(_useState181, 2),
    error = _useState182[0],
    setError = _useState182[1];
  var _useState183 = useState(false),
    _useState184 = _slicedToArray(_useState183, 2),
    saving = _useState184[0],
    setSaving = _useState184[1];
  var save = /*#__PURE__*/function () {
    var _save = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(event) {
      var updated, result, stored, next, _t31;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.p = _context21.n) {
          case 0:
            event.preventDefault();
            setError("");
            if (password.trim()) {
              _context21.n = 1;
              break;
            }
            setError("Nouveau mot de passe requis");
            return _context21.a(2);
          case 1:
            if (!(password !== confirmation)) {
              _context21.n = 2;
              break;
            }
            setError("Les mots de passe ne correspondent pas");
            return _context21.a(2);
          case 2:
            setSaving(true);
            _context21.p = 3;
            if (!window.authApi) {
              _context21.n = 6;
              break;
            }
            _context21.n = 4;
            return window.authApi.changePassword("", password);
          case 4:
            updated = _context21.v;
            _context21.n = 5;
            return onDone(updated);
          case 5:
            return _context21.a(2);
          case 6:
            _context21.n = 7;
            return window.storage.get("user:".concat(user.trigram), true);
          case 7:
            result = _context21.v;
            stored = JSON.parse(result.value);
            if (!(stored.pwd === hash(password))) {
              _context21.n = 8;
              break;
            }
            setError("Choisissez un mot de passe différent du mot de passe temporaire");
            return _context21.a(2);
          case 8:
            next = _objectSpread(_objectSpread({}, stored), {}, {
              pwd: hash(password),
              mustChangePassword: false
            });
            _context21.n = 9;
            return window.storage.set("user:".concat(user.trigram), JSON.stringify(next), true);
          case 9:
            _context21.n = 10;
            return onDone({
              trigram: user.trigram
            });
          case 10:
            _context21.n = 12;
            break;
          case 11:
            _context21.p = 11;
            _t31 = _context21.v;
            setError((_t31 === null || _t31 === void 0 ? void 0 : _t31.message) || "Changement non enregistré. Réessayez.");
          case 12:
            _context21.p = 12;
            setSaving(false);
            return _context21.f(12);
          case 13:
            return _context21.a(2);
        }
      }, _callee21, null, [[3, 11, 12, 13]]);
    }));
    function save(_x0) {
      return _save.apply(this, arguments);
    }
    return save;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "system-ui,sans-serif"
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: save,
    style: {
      width: 400,
      maxWidth: "100%",
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 20,
      margin: "0 0 16px"
    }
  }, "Changement de mot de passe obligatoire"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      color: C.muted
    }
  }, user.trigram), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 12
    }
  }, "Nouveau mot de passe", /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    autoComplete: "new-password",
    type: "password",
    value: password,
    onChange: function onChange(e) {
      return setPassword(e.target.value);
    },
    style: {
      display: "block",
      width: "100%",
      padding: 8,
      marginTop: 4,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 16
    }
  }, "Confirmer le mot de passe", /*#__PURE__*/React.createElement("input", {
    autoComplete: "new-password",
    type: "password",
    value: confirmation,
    onChange: function onChange(e) {
      return setConfirmation(e.target.value);
    },
    style: {
      display: "block",
      width: "100%",
      padding: 8,
      marginTop: 4,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), error && /*#__PURE__*/React.createElement(ErrBox, {
    msg: error
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: saving,
    style: {
      padding: "8px 12px",
      background: C.green,
      color: "white",
      border: 0,
      borderRadius: 4,
      cursor: "pointer"
    }
  }, saving ? "Enregistrement…" : "Enregistrer le mot de passe"), /*#__PURE__*/React.createElement(Btn, {
    onClick: onLogout,
    color: C.border,
    small: true
  }, "D\xE9connexion"))));
};
var LoginScreen = function LoginScreen(_ref103) {
  var onLogin = _ref103.onLogin;
  var _useState185 = useState(""),
    _useState186 = _slicedToArray(_useState185, 2),
    tri = _useState186[0],
    setTri = _useState186[1];
  var _useState187 = useState(""),
    _useState188 = _slicedToArray(_useState187, 2),
    pwd = _useState188[0],
    setPwd = _useState188[1];
  var _useState189 = useState(""),
    _useState190 = _slicedToArray(_useState189, 2),
    err = _useState190[0],
    setErr = _useState190[1];
  var reset = function reset() {
    setErr("");
  };
  var doLogin = /*#__PURE__*/function () {
    var _doLogin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
      var key, profile, r, u, _t32;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.p = _context22.n) {
          case 0:
            if (!(!tri || !pwd)) {
              _context22.n = 1;
              break;
            }
            setErr("Trigramme et mot de passe requis");
            return _context22.a(2);
          case 1:
            key = "user:".concat(tri.toUpperCase());
            _context22.p = 2;
            if (!window.authApi) {
              _context22.n = 4;
              break;
            }
            _context22.n = 3;
            return window.authApi.login(tri.toUpperCase(), pwd);
          case 3:
            profile = _context22.v;
            onLogin(profile);
            return _context22.a(2);
          case 4:
            _context22.n = 5;
            return window.storage.get(key, true);
          case 5:
            r = _context22.v;
            if (r) {
              _context22.n = 6;
              break;
            }
            setErr("Trigramme inconnu — demandez la création du compte à un admin");
            return _context22.a(2);
          case 6:
            u = JSON.parse(r.value);
            if (!(u.pwd !== hash(pwd))) {
              _context22.n = 7;
              break;
            }
            setErr("Mot de passe incorrect");
            return _context22.a(2);
          case 7:
            onLogin({
              trigram: tri.toUpperCase(),
              role: u.role || "Opérateur"
            });
            _context22.n = 9;
            break;
          case 8:
            _context22.p = 8;
            _t32 = _context22.v;
            setErr((_t32 === null || _t32 === void 0 ? void 0 : _t32.message) || "Erreur de connexion");
          case 9:
            return _context22.a(2);
        }
      }, _callee22, null, [[2, 8]]);
    }));
    function doLogin() {
      return _doLogin.apply(this, arguments);
    }
    return doLogin;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "system-ui,sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 16,
      right: 20
    }
  }, /*#__PURE__*/React.createElement(ThemeButton, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 400
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png",
    alt: "Safran",
    style: {
      width: 200,
      maxWidth: "100%",
      height: 65,
      objectFit: "contain",
      background: "#ffffff",
      borderRadius: 4,
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginBottom: 8
    }
  }, "Safran Timing Technologies SA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 900,
      color: C.text,
      fontFamily: "monospace"
    }
  }, "SP-F001A7"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 50,
      height: 3,
      background: C.accent,
      borderRadius: 2,
      margin: "14px auto 0"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 10,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Trigramme"), /*#__PURE__*/React.createElement(Input, {
    value: tri,
    onChange: function onChange(v) {
      return setTri(v.toUpperCase());
    },
    placeholder: "ex: JGR",
    style: {
      textTransform: "uppercase",
      letterSpacing: 3,
      fontWeight: 700,
      fontSize: 16,
      textAlign: "center"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: .8
    }
  }, "Mot de passe"), /*#__PURE__*/React.createElement(Input, {
    value: pwd,
    onChange: setPwd,
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        doLogin();
      }
    }
  })), err && /*#__PURE__*/React.createElement(ErrBox, {
    msg: err
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: doLogin,
    color: C.accent,
    full: true
  }, "Se connecter"))));
};
var ErrBox = function ErrBox(_ref104) {
  var msg = _ref104.msg;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.red + "22",
      border: "1px solid ".concat(C.red),
      color: C.red,
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
      marginBottom: 14
    }
  }, msg);
};

// ─── ACCUEIL : vue tableur + favs par user ──────────────────────────────────
var homeRowsForOf = function homeRowsForOf(entry, data) {
  var units = withUnitMetadata(data || {
    header: entry
  }).units.rows.filter(function (u) {
    return !u.deleted && (cleanSn(u.sn) || cleanSn(u.lot));
  });
  return units.length ? units.map(function (u) {
    return _objectSpread(_objectSpread({}, entry), {}, {
      sn: u.sn || "",
      lot: u.lot || entry.lot || "",
      snProduitFini: u.snProduitFini || "",
      unitStatus: u.status || "en_cours",
      _homeUnitId: u.id,
      _homeUnitKind: u.unitKind || (u.lot || entry.lot ? "lot" : "sn"),
      _homeSnCount: units.length,
      _homeQty: trackedLotQty(u)
    });
  }) : [_objectSpread(_objectSpread({}, entry), {}, {
    sn: "",
    lot: "",
    snProduitFini: "",
    _homeUnitKind: "sn",
    _homeQty: ""
  })];
};
var SORT_OPTS = [{
  id: "fav",
  label: "⭐ Favoris d'abord"
}, {
  id: "opens",
  label: "Derniers ouverts"
}, {
  id: "of",
  label: "N° OF"
}, {
  id: "projet",
  label: "OTP"
}];
var parseSnList = function parseSnList(text) {
  return _toConsumableArray(new Set(String(text || "").split(/\r?\n|;|,/).map(cleanSn).filter(Boolean)));
};
var cleanImportArticle = function cleanImportArticle(v) {
  return String(v || "").replace(/\s+/g, "").trim();
};
var cleanImportQty = function cleanImportQty(v) {
  var s = String(v || "").trim();
  if (!s || s === "-" || /^n\/?a$/i.test(s)) return "";
  return s.replace(",", ".");
};
var isDashCell = function isDashCell(v) {
  return /^:?-{2,}:?$/.test(String(v || "").trim());
};
var splitImportLine = function splitImportLine(line) {
  var txt = String(line || "").trim();
  if (!txt) return [];
  if (txt.includes("|")) {
    return txt.split("|").map(function (v) {
      return v.trim();
    }).filter(function (v, i, a) {
      return v || i > 0 && i < a.length - 1;
    });
  }
  if (txt.includes("\t")) return txt.split("\t").map(function (v) {
    return v.trim();
  });
  if (txt.includes(";")) return txt.split(";").map(function (v) {
    return v.trim();
  });
  var cells = [];
  var cur = "",
    quoted = false;
  for (var i = 0; i < txt.length; i++) {
    var c = txt[i],
      next = txt[i + 1];
    if (c === '"' && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (c === '"') {
      quoted = !quoted;
      continue;
    }
    if (c === "," && !quoted) {
      cells.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  cells.push(cur.trim());
  return cells;
};
var parseImportSnLot = function parseImportSnLot(snLot, qty) {
  var raw = String(snLot || "").trim();
  var value = cleanSn(raw);
  if (!value || value === "-") return null;
  var qtyNumber = Number(String(qty !== null && qty !== void 0 ? qty : "").replace(",", "."));
  var explicitLot = /^(?:N\/?A|NA|-|LOT[\s_-]?\w+)/i.test(value);
  var isSn = value.startsWith("#") || /^SN[\s_-]?\w+/i.test(value) || !explicitLot && qtyNumber === 1;
  return {
    sn: isSn ? value : "",
    lot: isSn ? "" : value,
    qteInitiale: cleanImportQty(qty),
    unitKind: isSn ? "sn" : "lot"
  };
};
var parseOfImportPaste = function parseOfImportPaste(text) {
  var groups = new Map();
  parseImportRows(text).forEach(function (cells) {
    if (cells.length < 6 || !cells.some(Boolean)) return;
    if (cells.every(function (c) {
      return !String(c || "").trim() || isDashCell(c);
    })) return;
    var lower = cells.map(function (c) {
      return String(c || "").toLowerCase();
    });
    if (lower.some(function (c) {
      return c.includes("projet");
    }) && lower.some(function (c) {
      return c.includes("of");
    })) return;
    var hasQtyCols = cells.length >= 8;
    var _ref105 = hasQtyCols ? cells : [""].concat(_toConsumableArray(cells), [""]),
      _ref106 = _slicedToArray(_ref105, 8),
      qtyRaw = _ref106[0],
      projet = _ref106[1],
      articleNo = _ref106[2],
      articleSap = _ref106[3],
      description = _ref106[4],
      snLot = _ref106[5],
      ofRaw = _ref106[6],
      repriseRaw = _ref106[7];
    var of = String(ofRaw || "").trim();
    if (!of) return;
    var key = of.toUpperCase();
    var item = parseImportSnLot(snLot, qtyRaw);
    var isReprise = /x/i.test(String(repriseRaw || ""));
    if (!groups.has(key)) {
      groups.set(key, {
        of: of,
        projet: String(projet || "").trim(),
        articleNo: String(articleNo || "").trim(),
        codeArticle: cleanImportArticle(articleSap || articleNo),
        description: String(description || "").trim(),
        ofRework: isReprise ? "oui" : "non",
        typeOF: isReprise ? "reprise" : "production",
        items: []
      });
    }
    var g = groups.get(key);
    if (!g.projet) g.projet = String(projet || "").trim();
    if (!g.articleNo) g.articleNo = String(articleNo || "").trim();
    if (!g.codeArticle) g.codeArticle = cleanImportArticle(articleSap || articleNo);
    if (!g.description) g.description = String(description || "").trim();
    if (isReprise) {
      g.ofRework = "oui";
      g.typeOF = "reprise";
    }
    if (item) {
      var itemKey = "".concat(item.unitKind, "|").concat(cleanSn(item.sn), "|").concat(cleanSn(item.lot));
      var existing = g.items.find(function (x) {
        return "".concat(x.unitKind, "|").concat(cleanSn(x.sn), "|").concat(cleanSn(x.lot)) === itemKey;
      });
      if (existing) {
        if (!existing.qteInitiale && item.qteInitiale) existing.qteInitiale = item.qteInitiale;
      } else {
        g.items.push(item);
      }
    }
  });
  return _toConsumableArray(groups.values());
};
var ofWarnings = function ofWarnings(data) {
  var _data$units3, _data$header3, _data$consommables3, _data$consommables4, _data$header4;
  var consommables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var messages = [];
  var rows = effectiveScopedRows(data, "rework");
  var checks = computeReworkWarnings(rows, (data === null || data === void 0 || (_data$units3 = data.units) === null || _data$units3 === void 0 ? void 0 : _data$units3.rows) || (data === null || data === void 0 || (_data$header3 = data.header) === null || _data$header3 === void 0 ? void 0 : _data$header3._snRows) || []);
  if (checks.sequence.length) messages.push("Actions soudage/dessoudage consécutives incohérentes");
  if (checks.mismatch.length || checks.first.length) messages.push("Dessoudage / cohérence valeur à vérifier");
  if (checks.pointed.length) messages.push("Composants pointés non soudés");
  if (computeOpenDesoudes(rows).length) messages.push("Composants dessoudés à surveiller");
  if (computeMissingReworkControls(rows).length) messages.push("Contrôles manquants");
  if (rows.some(function (r) {
    var _dcCheck;
    return ["S", "P", "M"].includes(r.action1) && ((_dcCheck = dcCheck(r.dc, r.createdDT)) === null || _dcCheck === void 0 ? void 0 : _dcCheck.ok) === false;
  })) messages.push("DC non conforme / article hors date");
  if (rows.some(function (r) {
    return missingReworkTrace(r, true).length > 0;
  })) messages.push("Traçabilité à compléter (LOT/DC)");
  var consoRows = ((data === null || data === void 0 || (_data$consommables3 = data.consommables) === null || _data$consommables3 === void 0 ? void 0 : _data$consommables3.ops) || []).filter(function (o) {
    return !o.deleted;
  }).flatMap(function (o) {
    return (o.items || []).filter(function (it) {
      return !it.deleted;
    }).map(function (it) {
      return {
        it: it,
        status: dpStatus(it.dp, it.createdDT || o.createdDT)
      };
    });
  });
  if (consoRows.some(function (_ref107) {
    var it = _ref107.it;
    return it.dp && !isValidDMY(it.dp);
  })) messages.push("Date de péremption consommable invalide");
  if (consoRows.some(function (_ref108) {
    var status = _ref108.status;
    return (status === null || status === void 0 ? void 0 : status.label) === "PÉRIMÉ";
  })) messages.push("Consommable périmé à la date d'utilisation");
  if (consoRows.some(function (_ref109) {
    var status = _ref109.status;
    return (status === null || status === void 0 ? void 0 : status.label) === "BIENTÔT";
  })) messages.push("Consommable bientôt périmé à la date d'utilisation");
  var consoById = Object.fromEntries(consommables.map(function (item) {
    return [item.id, item];
  }));
  var pendingPolymerizations = ((data === null || data === void 0 || (_data$consommables4 = data.consommables) === null || _data$consommables4 === void 0 ? void 0 : _data$consommables4.ops) || []).filter(function (o) {
    return !o.deleted && o.validated;
  }).flatMap(function (o) {
    return (o.items || []).filter(function (it) {
      return !it.deleted && it.validated;
    }).map(function (it) {
      return polymerizationStatus(consoById[it.consoId], it.createdDT || o.createdDT);
    }).filter(function (status) {
      return status && !status.done;
    });
  });
  if (pendingPolymerizations.length) {
    var readyAt = pendingPolymerizations.reduce(function (latest, status) {
      return !latest || status.readyAt > latest ? status.readyAt : latest;
    }, null);
    messages.push("Polym\xE9risation en cours \u2014 sous vide d\xE8s le ".concat(formatAvailabilityDT(readyAt)));
  }
  if (effectiveScopedRows(data, "testequip").some(function (r) {
    var _calibStatus2;
    return ((_calibStatus2 = calibStatus(r.dateExpiration)) === null || _calibStatus2 === void 0 ? void 0 : _calibStatus2.color) === C.red;
  })) messages.push("Équipement hors calibration");
  if (effectiveScopedRows(data, "faits").some(function (r) {
    return !r.closedDate;
  })) messages.push("Fait technique ouvert");
  if (effectiveScopedRows(data, "openwork").some(function (r) {
    return !r.closedDate;
  })) messages.push("Open Work ouvert");
  if (nextEtuvageInfo(effectiveEtuvageRows(data)).overdue) messages.push("Étuvage à renouveler");
  if ((data === null || data === void 0 || (_data$header4 = data.header) === null || _data$header4 === void 0 ? void 0 : _data$header4.status) === "bloque") messages.push("OF bloqué");
  return messages;
};
var FinishedProductSn = function FinishedProductSn(_ref110) {
  var of = _ref110.of,
    user = _ref110.user,
    onSave = _ref110.onSave;
  var _useState191 = useState(of.snProduitFini || ""),
    _useState192 = _slicedToArray(_useState191, 2),
    draft = _useState192[0],
    setDraft = _useState192[1];
  useEffect(function () {
    setDraft(of.snProduitFini || "");
  }, [of.snProduitFini]);
  var commit = /*#__PURE__*/function () {
    var _commit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      var value, _t33;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.p = _context23.n) {
          case 0:
            value = draft.trim();
            if (!(value === (of.snProduitFini || "") || !isAdminManager(user))) {
              _context23.n = 1;
              break;
            }
            return _context23.a(2);
          case 1:
            _context23.p = 1;
            _context23.n = 2;
            return onSave(of.id, of._homeUnitId, value);
          case 2:
            _context23.n = 4;
            break;
          case 3:
            _context23.p = 3;
            _t33 = _context23.v;
            window.alert("Enregistrement impossible : ".concat((_t33 === null || _t33 === void 0 ? void 0 : _t33.message) || _t33));
            setDraft(of.snProduitFini || "");
          case 4:
            return _context23.a(2);
        }
      }, _callee23, null, [[1, 3]]);
    }));
    function commit() {
      return _commit.apply(this, arguments);
    }
    return commit;
  }();
  if (!isAdminManager(user) || !of._homeUnitId) return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "monospace",
      color: C.text
    }
  }, of.snProduitFini || "—");
  return /*#__PURE__*/React.createElement("input", {
    "aria-label": "SN produit fini de ".concat(of.sn || of.lot, " - OF ").concat(of.of),
    title: "SN du produit final dans lequel cette pi\xE8ce est mont\xE9e",
    value: draft,
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    onChange: function onChange(e) {
      return setDraft(e.target.value);
    },
    onBlur: commit,
    onKeyDown: function onKeyDown(e) {
      if (e.key === "Enter") e.currentTarget.blur();
      if (e.key === "Escape") setDraft(of.snProduitFini || "");
    },
    style: {
      width: "100%",
      minWidth: 100,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      padding: "5px 7px",
      fontSize: 12,
      fontFamily: "monospace"
    }
  });
};
var homeWorkedFilter = function homeWorkedFilter(rows, workedIds, onlyWorked, searchActive) {
  var worked = new Set(workedIds);
  var active = onlyWorked && !searchActive && rows.some(function (row) {
    return worked.has(row.id);
  });
  return {
    active: active,
    rows: active ? rows.filter(function (row) {
      return worked.has(row.id);
    }) : rows
  };
};
var homeRowKey = function homeRowKey(row) {
  return "".concat(row.id, ":").concat(row._homeUnitId || "of");
};
var homeUnitName = function homeUnitName(row) {
  return row.sn || row.lot || "Sans SN / LOT";
};
var homeOtpName = function homeOtpName(row) {
  return String(row.otp || row.projet || "Non renseigné").trim() || "Non renseigné";
};
var hasSingleMeetingOtp = function hasSingleMeetingOtp(rows) {
  return new Set(rows.map(homeOtpName)).size === 1;
};
var groupHomeMailRows = function groupHomeMailRows(rows) {
  var groups = new Map();
  rows.forEach(function (row) {
    if (!groups.has(row.id)) groups.set(row.id, {
      id: row.id,
      of: row.of || "Non renseigné",
      otp: row.otp || row.projet || "",
      codeArticle: compactArticleCode(row.codeArticle || row.articleNo) || "",
      description: row.description || "",
      rows: []
    });
    var group = groups.get(row.id);
    if (!group.rows.some(function (item) {
      return homeRowKey(item) === homeRowKey(row);
    })) group.rows.push(row);
  });
  return _toConsumableArray(groups.values());
};
var homeMailSummary = function homeMailSummary(groups) {
  return groups.flatMap(function (group) {
    return ["OF ".concat(group.of).concat(group.otp ? " | OTP ".concat(group.otp) : ""), "Article : ".concat(group.codeArticle || "Non renseigné").concat(group.description ? " - ".concat(group.description) : "")].concat(_toConsumableArray(group.rows.map(function (row) {
      return "- ".concat(row.sn || (row.lot ? "LOT ".concat(row.lot) : "Sans SN / LOT"));
    })), [""]);
  });
};
var compactOfRanges = function compactOfRanges(values) {
  var unique = _toConsumableArray(new Set(values.map(function (value) {
    return String(value || "").trim();
  }).filter(Boolean)));
  var numeric = unique.filter(function (value) {
    return /^\d+$/.test(value);
  }).sort(function (a, b) {
    return Number(a) - Number(b);
  });
  var other = unique.filter(function (value) {
    return !/^\d+$/.test(value);
  });
  var ranges = [];
  for (var index = 0; index < numeric.length;) {
    var end = index;
    while (end + 1 < numeric.length && Number(numeric[end + 1]) === Number(numeric[end]) + 1) end++;
    ranges.push(end > index ? "".concat(numeric[index], "-").concat(numeric[end]) : numeric[index]);
    index = end + 1;
  }
  return [].concat(ranges, _toConsumableArray(other)).join("; ");
};
var closureFactLabel = function closureFactLabel(fact) {
  return fact.numero || fact.commentaires || "Fait";
};
var closureMailTable = function closureMailTable(groups) {
  var rows = groups.flatMap(function (group) {
    return group.rows.map(function (row) {
      return _objectSpread(_objectSpread({}, row), {}, {
        _mailOf: group.of,
        _mailArticle: group.codeArticle || "-",
        _mailDescription: group.description || "-"
      });
    });
  });
  rows.sort(function (a, b) {
    return a._mailArticle.localeCompare(b._mailArticle, undefined, {
      numeric: true,
      sensitivity: "base"
    }) || a._mailOf.localeCompare(b._mailOf, undefined, {
      numeric: true,
      sensitivity: "base"
    });
  });
  var lines = [];
  var previousArticle = "";
  rows.forEach(function (row) {
    if (previousArticle && previousArticle !== row._mailArticle) lines.push("");
    var isLot = row._homeUnitKind === "lot";
    var quantity = isLot && String(row._homeQty || "").trim() ? "".concat(row._homeQty, "x") : "";
    var facts = (row._homeFacts || []).map(closureFactLabel).filter(Boolean);
    var columns = [row._mailOf, row._mailArticle, row._mailDescription, "".concat(isLot ? "LOT" : "SN", " : ").concat(homeUnitName(row))];
    if (String(row.snProduitFini || "").trim()) columns.push("SN produit fini : ".concat(String(row.snProduitFini).trim()));
    if (quantity) columns.push(quantity);
    if (facts.length) columns.push("Faits : ".concat(facts.join(" ; ")));
    lines.push(columns.join(" | "));
    previousArticle = row._mailArticle;
  });
  return [].concat(lines, [""]);
};
var buildClosureRequest = function buildClosureRequest(_ref111) {
  var rows = _ref111.rows,
    user = _ref111.user;
  var groups = groupHomeMailRows(rows);
  var otps = _toConsumableArray(new Set(groups.map(function (group) {
    return group.otp;
  }).filter(Boolean)));
  var intro = "Merci de clôturer et mettre en stock les sous-ensembles suivants :";
  return {
    subject: "Cl\xF4ture | OF ".concat(compactOfRanges(groups.map(function (group) {
      return group.of;
    }))).concat(otps.length ? " | OTP ".concat(otps.join("; ")) : ""),
    body: ["Bonjour,", "", intro, ""].concat(_toConsumableArray(closureMailTable(groups)), ["Merci,", [user.prenom, user.nom].filter(Boolean).join(" ") || user.trigram, user.trigram]).join("\n")
  };
};
var buildIpInvitation = function buildIpInvitation(_ref112) {
  var rows = _ref112.rows,
    user = _ref112.user,
    ipName = _ref112.ipName;
  var groups = groupHomeMailRows(rows);
  var otps = _toConsumableArray(new Set(groups.map(function (group) {
    return group.otp || "Non renseigné";
  })));
  var articles = _toConsumableArray(new Set(groups.map(function (group) {
    return "".concat(group.codeArticle || "Non renseigné").concat(group.description ? " - ".concat(group.description) : "");
  })));
  var units = _toConsumableArray(new Set(rows.map(homeUnitName)));
  var finishedUnits = _toConsumableArray(new Set(rows.map(function (row) {
    return String(row.snProduitFini || "").trim();
  }).filter(Boolean)));
  var name = String(ipName || "").trim() || "IP";
  var intro = "Voici le r\xE9sum\xE9 des sous-ensembles pr\xE9vus pour l\u2019inspection ".concat(name, " :");
  var subjectParts = [name, articles.join(" / "), units.join(", "), "OTP ".concat(otps.join(" / "))];
  if (finishedUnits.length) subjectParts.push("SN produit fini ".concat(finishedUnits.join(", ")));
  return {
    subject: subjectParts.join(" | "),
    body: ["Bonjour,", "", intro, ""].concat(_toConsumableArray(closureMailTable(groups)), ["Merci,", [user.prenom, user.nom].filter(Boolean).join(" ") || user.trigram, user.trigram]).join("\n")
  };
};
var defaultMeetingSlot = function defaultMeetingSlot() {
  var date = new Date();
  date.setSeconds(0, 0);
  date.setMinutes(date.getMinutes() < 30 ? 30 : 0);
  if (date.getMinutes() === 0) date.setHours(date.getHours() + 1);
  var pad = function pad(value) {
    return String(value).padStart(2, "0");
  };
  return {
    date: "".concat(date.getFullYear(), "-").concat(pad(date.getMonth() + 1), "-").concat(pad(date.getDate())),
    time: "".concat(pad(date.getHours()), ":").concat(pad(date.getMinutes()))
  };
};
var parseMeetingRecipients = function parseMeetingRecipients(value) {
  return _toConsumableArray(new Set(String(value || "").split(/[;,\s]+/).map(function (item) {
    return item.trim();
  }).filter(function (item) {
    return /^\S+@\S+\.\S+$/.test(item);
  })));
};
var escapeIcsText = function escapeIcsText(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
};
var formatIcsLocal = function formatIcsLocal(date) {
  var pad = function pad(value) {
    return String(value).padStart(2, "0");
  };
  return "".concat(date.getFullYear()).concat(pad(date.getMonth() + 1)).concat(pad(date.getDate()), "T").concat(pad(date.getHours())).concat(pad(date.getMinutes()), "00");
};
var buildOutlookMeetingIcs = function buildOutlookMeetingIcs(_ref113) {
  var subject = _ref113.subject,
    body = _ref113.body,
    date = _ref113.date,
    time = _ref113.time,
    _ref113$duration = _ref113.duration,
    duration = _ref113$duration === void 0 ? 60 : _ref113$duration,
    _ref113$location = _ref113.location,
    location = _ref113$location === void 0 ? "" : _ref113$location,
    _ref113$recipients = _ref113.recipients,
    recipients = _ref113$recipients === void 0 ? [] : _ref113$recipients,
    _ref113$requiredRecip = _ref113.requiredRecipients,
    requiredRecipients = _ref113$requiredRecip === void 0 ? recipients : _ref113$requiredRecip,
    _ref113$optionalRecip = _ref113.optionalRecipients,
    optionalRecipients = _ref113$optionalRecip === void 0 ? [] : _ref113$optionalRecip,
    _ref113$organizer = _ref113.organizer,
    organizer = _ref113$organizer === void 0 ? {} : _ref113$organizer;
  var matchDate = String(date || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  var matchTime = String(time || "").match(/^(\d{2}):(\d{2})$/);
  if (!matchDate || !matchTime) throw new Error("Date ou heure de réunion invalide");
  var start = new Date(+matchDate[1], +matchDate[2] - 1, +matchDate[3], +matchTime[1], +matchTime[2]);
  var end = new Date(start.getTime() + Math.max(15, Number(duration) || 60) * 60000);
  var stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  var organizerName = [organizer.prenom, organizer.nom].filter(Boolean).join(" ") || organizer.trigram || "SP-F001A";
  var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Safran Timing Technologies SA//SP-F001A//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT", "UID:".concat(Date.now(), "-").concat(uid(), "@sp-f001a"), "DTSTAMP:".concat(stamp), "DTSTART:".concat(formatIcsLocal(start)), "DTEND:".concat(formatIcsLocal(end)), "SUMMARY:".concat(escapeIcsText(subject)), "DESCRIPTION:".concat(escapeIcsText(body)), "CATEGORIES:IP", "COLOR:#FFD966", "X-APPLE-CALENDAR-COLOR:#FFD966", "STATUS:CONFIRMED", "TRANSP:OPAQUE", "X-MICROSOFT-CDO-BUSYSTATUS:BUSY"];
  if (String(location || "").trim()) lines.push("LOCATION:".concat(escapeIcsText(String(location).trim())));
  if (organizer.email) lines.push("ORGANIZER;CN=".concat(escapeIcsText(organizerName), ":mailto:").concat(organizer.email));
  requiredRecipients.forEach(function (email) {
    return lines.push("ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:".concat(email));
  });
  optionalRecipients.forEach(function (email) {
    return lines.push("ATTENDEE;ROLE=OPT-PARTICIPANT;RSVP=TRUE:mailto:".concat(email));
  });
  lines.push("END:VEVENT", "END:VCALENDAR", "");
  return lines.join("\r\n");
};
var downloadOutlookMeeting = function downloadOutlookMeeting(_ref114) {
  var draft = _ref114.draft,
    date = _ref114.date,
    time = _ref114.time,
    duration = _ref114.duration,
    location = _ref114.location,
    requiredRecipients = _ref114.requiredRecipients,
    optionalRecipients = _ref114.optionalRecipients,
    user = _ref114.user;
  var content = buildOutlookMeetingIcs({
    subject: draft.subject,
    body: draft.body,
    date: date,
    time: time,
    duration: duration,
    location: location,
    requiredRecipients: requiredRecipients,
    optionalRecipients: optionalRecipients,
    organizer: user
  });
  var blob = new Blob([content], {
    type: "text/calendar;charset=utf-8"
  });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  link.download = "Invitation-IP-".concat(String(draft.subject || "reunion").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80), ".ics");
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () {
    return URL.revokeObjectURL(url);
  }, 1000);
};
var HomeMailModal = function HomeMailModal(_ref115) {
  var kind = _ref115.kind,
    rows = _ref115.rows,
    user = _ref115.user,
    onClose = _ref115.onClose,
    onMarkForClosure = _ref115.onMarkForClosure;
  var isIp = kind === "ip";
  var _useState193 = useState(""),
    _useState194 = _slicedToArray(_useState193, 2),
    ipName = _useState194[0],
    setIpName = _useState194[1];
  var _useState195 = useState(isIp ? "" : "logistique.ch@safran-timing.safrangroup.com"),
    _useState196 = _slicedToArray(_useState195, 2),
    recipient = _useState196[0],
    setRecipient = _useState196[1];
  var _useState197 = useState(defaultMeetingSlot),
    _useState198 = _slicedToArray(_useState197, 1),
    meetingSlot = _useState198[0];
  var _useState199 = useState(meetingSlot.date),
    _useState200 = _slicedToArray(_useState199, 2),
    meetingDate = _useState200[0],
    setMeetingDate = _useState200[1];
  var _useState201 = useState(meetingSlot.time),
    _useState202 = _slicedToArray(_useState201, 2),
    meetingTime = _useState202[0],
    setMeetingTime = _useState202[1];
  var _useState203 = useState("60"),
    _useState204 = _slicedToArray(_useState203, 2),
    meetingDuration = _useState204[0],
    setMeetingDuration = _useState204[1];
  var _useState205 = useState(""),
    _useState206 = _slicedToArray(_useState205, 2),
    meetingRoom = _useState206[0],
    setMeetingRoom = _useState206[1];
  var _useState207 = useState(""),
    _useState208 = _slicedToArray(_useState207, 2),
    meetingPlace = _useState208[0],
    setMeetingPlace = _useState208[1];
  var _useState209 = useState([]),
    _useState210 = _slicedToArray(_useState209, 2),
    copyTo = _useState210[0],
    setCopyTo = _useState210[1];
  var _useState211 = useState([]),
    _useState212 = _slicedToArray(_useState211, 2),
    inviteProjectTo = _useState212[0],
    setInviteProjectTo = _useState212[1];
  var _useState213 = useState([]),
    _useState214 = _slicedToArray(_useState213, 2),
    inviteAssuranceTo = _useState214[0],
    setInviteAssuranceTo = _useState214[1];
  var _useState215 = useState([]),
    _useState216 = _slicedToArray(_useState215, 2),
    inviteCc = _useState216[0],
    setInviteCc = _useState216[1];
  var _useCcManagers2 = useCcManagers(!isIp),
    managers = _useCcManagers2.managers,
    ccError = _useCcManagers2.error;
  var _useUserAccounts2 = useUserAccounts(isIp),
    inviteAccounts = _useUserAccounts2.accounts,
    inviteAccountsError = _useUserAccounts2.error;
  var assuranceAccounts = inviteAccounts.filter(isProductAssuranceAccount);
  var projectAccounts = inviteAccounts.filter(function (account) {
    return account.trigram !== user.trigram && isProjectLeadAccount(account);
  });
  var invitationCcAccounts = inviteAccounts.filter(function (account) {
    return account.trigram !== user.trigram && normalizeRole(account) === "Manager";
  });
  var ccEmails = selectedManagerEmails(managers, copyTo);
  var projectMeetingEmails = selectedManagerEmails(projectAccounts, inviteProjectTo);
  var assuranceMeetingEmails = selectedManagerEmails(assuranceAccounts, inviteAssuranceTo);
  var requiredMeetingEmails = _toConsumableArray(new Set([].concat(_toConsumableArray(projectMeetingEmails), _toConsumableArray(assuranceMeetingEmails))));
  var optionalMeetingEmails = selectedManagerEmails(invitationCcAccounts, inviteCc).filter(function (email) {
    return !requiredMeetingEmails.includes(email);
  });
  var makeDraft = function makeDraft() {
    return isIp ? buildIpInvitation({
      rows: rows,
      user: user,
      ipName: ipName
    }) : buildClosureRequest({
      rows: rows,
      user: user
    });
  };
  var _useState217 = useState(makeDraft),
    _useState218 = _slicedToArray(_useState217, 2),
    draft = _useState218[0],
    setDraft = _useState218[1];
  var _useState219 = useState(""),
    _useState220 = _slicedToArray(_useState219, 2),
    message = _useState220[0],
    setMessage = _useState220[1];
  var _useState221 = useState(!isIp),
    _useState222 = _slicedToArray(_useState221, 2),
    markForClosure = _useState222[0],
    setMarkForClosure = _useState222[1];
  var _useState223 = useState(false),
    _useState224 = _slicedToArray(_useState223, 2),
    sending = _useState224[0],
    setSending = _useState224[1];
  useEffect(function () {
    if (isIp) setDraft(buildIpInvitation({
      rows: rows,
      user: user,
      ipName: ipName
    }));
  }, [ipName]);
  var color = isIp ? C.yellow : C.green;
  var copy = /*#__PURE__*/function () {
    var _copy3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var text, _t34;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.p = _context24.n) {
          case 0:
            text = "Objet : ".concat(draft.subject, "\n\n").concat(draft.body);
            _context24.p = 1;
            _context24.n = 2;
            return navigator.clipboard.writeText(text);
          case 2:
            setMessage("Brouillon copié");
            _context24.n = 4;
            break;
          case 3:
            _context24.p = 3;
            _t34 = _context24.v;
            setMessage("Copie impossible");
          case 4:
            return _context24.a(2);
        }
      }, _callee24, null, [[1, 3]]);
    }));
    function copy() {
      return _copy3.apply(this, arguments);
    }
    return copy;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 340,
      background: "#000000aa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "home-mail-title",
    style: {
      width: 850,
      maxWidth: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      background: C.surface,
      color: C.text,
      border: "2px solid ".concat(color),
      borderRadius: 6,
      padding: 18,
      boxShadow: "0 0 0 4px ".concat(color, "18")
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    id: "home-mail-title",
    style: {
      margin: 0,
      fontSize: 16,
      color: color
    }
  }, isIp ? "Séance IP" : "Clôture logistique", " \u2014 ", rows.length, " sous-ensemble", rows.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Fermer",
    title: "Fermer",
    onClick: onClose,
    style: {
      border: 0,
      background: "transparent",
      color: C.muted,
      fontSize: 20,
      cursor: "pointer"
    }
  }, "\xD7")), isIp && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 10,
      fontSize: 12,
      fontWeight: 700,
      color: C.yellow
    }
  }, "Nom de l\u2019IP", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Nom de l\u2019IP",
    autoFocus: true,
    value: ipName,
    onChange: function onChange(e) {
      return setIpName(e.target.value);
    },
    placeholder: "Ex. RX-IP-800 (selon fiche suiveuse)",
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      padding: 8,
      background: C.input,
      color: C.text,
      border: "2px solid ".concat(C.yellow),
      borderRadius: 4
    }
  })), isIp && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(150px,1fr) minmax(120px,.7fr) minmax(150px,.8fr)",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12
    }
  }, "Date", /*#__PURE__*/React.createElement("input", {
    type: "date",
    "aria-label": "Date de la r\xE9union",
    value: meetingDate,
    onChange: function onChange(event) {
      return setMeetingDate(event.target.value);
    },
    style: {
      display: "block",
      width: "100%",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12
    }
  }, "Heure", /*#__PURE__*/React.createElement("input", {
    type: "time",
    "aria-label": "Heure de la r\xE9union",
    value: meetingTime,
    onChange: function onChange(event) {
      return setMeetingTime(event.target.value);
    },
    style: {
      display: "block",
      width: "100%",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12
    }
  }, "Dur\xE9e", /*#__PURE__*/React.createElement("select", {
    "aria-label": "Dur\xE9e de la r\xE9union",
    value: meetingDuration,
    onChange: function onChange(event) {
      return setMeetingDuration(event.target.value);
    },
    style: {
      display: "block",
      width: "100%",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  }, [30, 45, 60, 90, 120].map(function (minutes) {
    return /*#__PURE__*/React.createElement("option", {
      key: minutes,
      value: minutes
    }, minutes < 60 ? "".concat(minutes, " min") : "".concat(minutes / 60, " h"));
  })))), isIp && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2,minmax(160px,1fr))",
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12
    }
  }, "Salle", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Salle de la r\xE9union",
    value: meetingRoom,
    onChange: function onChange(event) {
      return setMeetingRoom(event.target.value);
    },
    placeholder: "#512",
    style: {
      display: "block",
      width: "100%",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12
    }
  }, "Table / place", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Table ou place de la r\xE9union",
    value: meetingPlace,
    onChange: function onChange(event) {
      return setMeetingPlace(event.target.value);
    },
    placeholder: "P17",
    style: {
      display: "block",
      width: "100%",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  }))), !isIp && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 10,
      fontSize: 12
    }
  }, "Destinataire", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Destinataire",
    value: recipient,
    onChange: function onChange(e) {
      return setRecipient(e.target.value);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), isIp && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ManagerCcPicker, {
    managers: projectAccounts,
    copyTo: inviteProjectTo,
    onChange: setInviteProjectTo,
    required: true,
    error: inviteAccountsError,
    legend: "\xC0 - Chefs de projet",
    mode: "to"
  }), /*#__PURE__*/React.createElement(ManagerCcPicker, {
    managers: assuranceAccounts,
    copyTo: inviteAssuranceTo,
    onChange: setInviteAssuranceTo,
    required: true,
    legend: "\xC0 - Product Assurance",
    mode: "to"
  }), /*#__PURE__*/React.createElement(ManagerCcPicker, {
    managers: invitationCcAccounts,
    copyTo: inviteCc,
    onChange: setInviteCc,
    legend: "CC - Managers"
  })), !isIp && /*#__PURE__*/React.createElement(ManagerCcPicker, {
    managers: managers,
    copyTo: copyTo,
    onChange: setCopyTo,
    error: ccError
  }), !isIp && /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
      padding: "8px 10px",
      fontSize: 12,
      fontWeight: 700,
      color: markForClosure ? C.green : C.muted,
      background: C.green + "0d",
      border: "1px solid ".concat(markForClosure ? C.green : C.border),
      borderRadius: 4,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: markForClosure,
    onChange: function onChange(e) {
      return setMarkForClosure(e.target.checked);
    }
  }), "Passer les \xE9l\xE9ments s\xE9lectionn\xE9s au statut \xAB \xC0 cl\xF4turer \xBB"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginBottom: 10,
      fontSize: 12
    }
  }, "Objet", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Objet",
    value: draft.subject,
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          subject: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      padding: 7,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontSize: 12
    }
  }, "Message", /*#__PURE__*/React.createElement("textarea", {
    "aria-label": "Message",
    value: draft.body,
    onChange: function onChange(e) {
      return setDraft(function (d) {
        return _objectSpread(_objectSpread({}, d), {}, {
          body: e.target.value
        });
      });
    },
    style: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      marginTop: 4,
      height: 330,
      maxHeight: "50vh",
      resize: "vertical",
      padding: 10,
      fontFamily: "system-ui,sans-serif",
      fontSize: 13,
      lineHeight: 1.5,
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "status",
    style: {
      fontSize: 12,
      color: C.green
    }
  }, message), /*#__PURE__*/React.createElement(Btn, {
    onClick: onClose,
    color: C.border,
    small: true
  }, "Fermer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: copy,
    color: C.border,
    small: true
  }, "Copier le brouillon"), isIp ? /*#__PURE__*/React.createElement(Btn, {
    disabled: !ipName.trim() || !meetingDate || !meetingTime || !projectMeetingEmails.length || !assuranceMeetingEmails.length || !draft.subject.trim() || !draft.body.trim(),
    onClick: function onClick() {
      downloadOutlookMeeting({
        draft: draft,
        date: meetingDate,
        time: meetingTime,
        duration: meetingDuration,
        location: [meetingRoom, meetingPlace].map(function (value) {
          return value.trim();
        }).filter(Boolean).join(" "),
        requiredRecipients: requiredMeetingEmails,
        optionalRecipients: optionalMeetingEmails,
        user: user
      });
      setMessage("Brouillon Outlook créé : ouvrez-le, modifiez-le puis cliquez sur Inviter des participants pour l’envoyer.");
    },
    color: color,
    small: true
  }, "Cr\xE9er le brouillon Outlook") : /*#__PURE__*/React.createElement(Btn, {
    disabled: sending || !recipient.trim() || !draft.subject.trim() || !draft.body.trim(),
    onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
      var cc, _t35;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.p = _context25.n) {
          case 0:
            setMessage("");
            setSending(true);
            _context25.p = 1;
            if (!(markForClosure && onMarkForClosure)) {
              _context25.n = 2;
              break;
            }
            _context25.n = 2;
            return onMarkForClosure(rows);
          case 2:
            cc = ccEmails.length ? "&cc=".concat(encodeURIComponent(ccEmails.join(","))) : "";
            window.location.href = "mailto:".concat(encodeURIComponent(recipient.trim()), "?subject=").concat(encodeURIComponent(draft.subject)).concat(cc, "&body=").concat(encodeURIComponent(draft.body));
            _context25.n = 4;
            break;
          case 3:
            _context25.p = 3;
            _t35 = _context25.v;
            setMessage("Statut non modifi\xE9 : ".concat((_t35 === null || _t35 === void 0 ? void 0 : _t35.message) || _t35));
          case 4:
            _context25.p = 4;
            setSending(false);
            return _context25.f(4);
          case 5:
            return _context25.a(2);
        }
      }, _callee25, null, [[1, 3, 4, 5]]);
    })),
    color: color,
    small: true
  }, sending ? "Mise à jour…" : "Ouvrir la messagerie"))));
};
var pendingHomePolymerization = function pendingHomePolymerization(data, consommables, unitId, referenceDate) {
  var _data$units4, _data$consommables5;
  var units = (data === null || data === void 0 || (_data$units4 = data.units) === null || _data$units4 === void 0 ? void 0 : _data$units4.rows) || snRowsFromHeader((data === null || data === void 0 ? void 0 : data.header) || {});
  var unit = units.find(function (item) {
    return item.id === unitId && !item.deleted;
  });
  var byId = Object.fromEntries((consommables || []).map(function (item) {
    return [item.id, item];
  }));
  var pending = ((data === null || data === void 0 || (_data$consommables5 = data.consommables) === null || _data$consommables5 === void 0 ? void 0 : _data$consommables5.ops) || []).filter(function (op) {
    return !op.deleted && op.validated && (!unit || rowMatchesSn(op, unit, units));
  }).flatMap(function (op) {
    return (op.items || []).filter(function (item) {
      return !item.deleted && item.validated;
    }).map(function (item) {
      return polymerizationStatus(byId[item.consoId], item.createdDT || op.createdDT, referenceDate);
    });
  }).filter(function (status) {
    return status && !status.done;
  });
  return pending.reduce(function (latest, status) {
    return !latest || status.readyAt > latest.readyAt ? status : latest;
  }, null);
};
var homeFactsForUnit = function homeFactsForUnit(data, unitId) {
  var _data$units5;
  var units = (data === null || data === void 0 || (_data$units5 = data.units) === null || _data$units5 === void 0 ? void 0 : _data$units5.rows) || snRowsFromHeader((data === null || data === void 0 ? void 0 : data.header) || {});
  var unit = units.find(function (item) {
    return item.id === unitId && !item.deleted;
  });
  return effectiveScopedRows(data, "faits").filter(function (row) {
    return !unit || rowMatchesSn(row, unit, units);
  });
};
var OFSelector = function OFSelector(_ref117) {
  var _STATUTS1, _STATUTS10, _STATUTS11;
  var ofList = _ref117.ofList,
    consommables = _ref117.consommables,
    onSelect = _ref117.onSelect,
    onCreate = _ref117.onCreate,
    onDelete = _ref117.onDelete,
    onImportOFs = _ref117.onImportOFs,
    user = _ref117.user,
    onLogout = _ref117.onLogout,
    openHistory = _ref117.openHistory,
    onUpdateStatus = _ref117.onUpdateStatus,
    onUnitStatusChange = _ref117.onUnitStatusChange,
    onFinishedSnChange = _ref117.onFinishedSnChange,
    onSaveProfile = _ref117.onSaveProfile,
    onManageUsers = _ref117.onManageUsers,
    onManageStatuses = _ref117.onManageStatuses;
  var blankForm = {
    of: "",
    sn: "",
    snLines: "",
    lot: "",
    snProduitFini: "",
    codeArticle: "",
    description: "",
    otp: "",
    ofRework: "non",
    typeOF: "production",
    status: "en_cours"
  };
  var _useState225 = useState(""),
    _useState226 = _slicedToArray(_useState225, 2),
    search = _useState226[0],
    setSearch = _useState226[1];
  var _useState227 = useState(0),
    _useState228 = _slicedToArray(_useState227, 2),
    page = _useState228[0],
    setPage = _useState228[1];
  var _useState229 = useState(25),
    _useState230 = _slicedToArray(_useState229, 2),
    pageSize = _useState230[0],
    setPageSize = _useState230[1];
  var _useState231 = useState({}),
    _useState232 = _slicedToArray(_useState231, 2),
    columnFilters = _useState232[0],
    setColumnFilters = _useState232[1];
  var _useState233 = useState({}),
    _useState234 = _slicedToArray(_useState233, 2),
    dataById = _useState234[0],
    setDataById = _useState234[1];
  var _useState235 = useState("fav"),
    _useState236 = _slicedToArray(_useState235, 2),
    sort = _useState236[0],
    setSort = _useState236[1];
  var _useState237 = useState({
      key: "",
      direction: "asc"
    }),
    _useState238 = _slicedToArray(_useState237, 2),
    columnSort = _useState238[0],
    setColumnSort = _useState238[1];
  var _useState239 = useState([]),
    _useState240 = _slicedToArray(_useState239, 2),
    filterStatus = _useState240[0],
    setFilterStatus = _useState240[1];
  var _useState241 = useState(true),
    _useState242 = _slicedToArray(_useState241, 2),
    onlyWorked = _useState242[0],
    setOnlyWorked = _useState242[1];
  var _useState243 = useState(false),
    _useState244 = _slicedToArray(_useState243, 2),
    onlyWarnings = _useState244[0],
    setOnlyWarnings = _useState244[1];
  var _useState245 = useState([]),
    _useState246 = _slicedToArray(_useState245, 2),
    workedIds = _useState246[0],
    setWorkedIds = _useState246[1];
  var _useState247 = useState({}),
    _useState248 = _slicedToArray(_useState247, 2),
    warningsById = _useState248[0],
    setWarningsById = _useState248[1];
  var _useState249 = useState({}),
    _useState250 = _slicedToArray(_useState249, 2),
    openOWById = _useState250[0],
    setOpenOWById = _useState250[1];
  var _useState251 = useState({}),
    _useState252 = _slicedToArray(_useState251, 2),
    etuvagesById = _useState252[0],
    setEtuvagesById = _useState252[1];
  var _useState253 = useState({}),
    _useState254 = _slicedToArray(_useState253, 2),
    snLabelsById = _useState254[0],
    setSnLabelsById = _useState254[1];
  var _useState255 = useState(true),
    _useState256 = _slicedToArray(_useState255, 2),
    loadingWorked = _useState256[0],
    setLoadingWorked = _useState256[1];
  var _useState257 = useState([]),
    _useState258 = _slicedToArray(_useState257, 2),
    selectedKeys = _useState258[0],
    setSelectedKeys = _useState258[1];
  var _useState259 = useState(null),
    _useState260 = _slicedToArray(_useState259, 2),
    homeMailKind = _useState260[0],
    setHomeMailKind = _useState260[1];
  var _useState261 = useState(false),
    _useState262 = _slicedToArray(_useState261, 2),
    showBulkPdf = _useState262[0],
    setShowBulkPdf = _useState262[1];
  var _useState263 = useState(""),
    _useState264 = _slicedToArray(_useState263, 2),
    copiedTeamsKey = _useState264[0],
    setCopiedTeamsKey = _useState264[1];
  var _useState265 = useState(function () {
      return new Date();
    }),
    _useState266 = _slicedToArray(_useState265, 2),
    homeNow = _useState266[0],
    setHomeNow = _useState266[1];
  useEffect(function () {
    var timer = setInterval(function () {
      return setHomeNow(new Date());
    }, 60000);
    return function () {
      return clearInterval(timer);
    };
  }, []);
  useEffect(function () {
    var cancelled = false;
    setLoadingWorked(true);
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
      var grouped, results, _t37;
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.p = _context27.n) {
          case 0:
            grouped = null;
            _context27.p = 1;
            if (!window.storage.homeDocuments) {
              _context27.n = 3;
              break;
            }
            _context27.n = 2;
            return window.storage.homeDocuments();
          case 2:
            grouped = _context27.v;
          case 3:
            _context27.n = 5;
            break;
          case 4:
            _context27.p = 4;
            _t37 = _context27.v;
          case 5:
            _context27.n = 6;
            return Promise.all(ofList.map(/*#__PURE__*/function () {
              var _ref119 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(o) {
                var _data$units6, data, r, _t36;
                return _regenerator().w(function (_context26) {
                  while (1) switch (_context26.p = _context26.n) {
                    case 0:
                      _context26.p = 0;
                      data = grouped && Object.prototype.hasOwnProperty.call(grouped, o.id) ? grouped[o.id] : null;
                      if (data) {
                        _context26.n = 2;
                        break;
                      }
                      _context26.n = 1;
                      return window.storage.get("of:".concat(o.id), true);
                    case 1:
                      r = _context26.v;
                      data = JSON.parse(r.value);
                    case 2:
                      return _context26.a(2, {
                        id: o.id,
                        data: data,
                        worked: _workedOnOf(data, user.trigram) || _workedOnOf(o, user.trigram),
                        warnings: ofWarnings(data, consommables),
                        openOW: effectiveScopedRows(data, "openwork").filter(function (r) {
                          return !r.closedDate;
                        }).length,
                        etuvages: effectiveEtuvageRows(data),
                        snLabels: (((_data$units6 = data.units) === null || _data$units6 === void 0 ? void 0 : _data$units6.rows) || snRowsFromHeader(data.header)).filter(function (u) {
                          return !u.deleted && hasUnitIdentity(u);
                        }).map(snTitle)
                      });
                    case 3:
                      _context26.p = 3;
                      _t36 = _context26.v;
                      return _context26.a(2, {
                        id: o.id,
                        worked: _workedOnOf(o, user.trigram),
                        warnings: o.status === "bloque" ? ["OF bloqué"] : []
                      });
                  }
                }, _callee26, null, [[0, 3]]);
              }));
              return function (_x1) {
                return _ref119.apply(this, arguments);
              };
            }()));
          case 6:
            results = _context27.v;
            if (!cancelled) {
              setWorkedIds(results.filter(function (r) {
                return r.worked;
              }).map(function (r) {
                return r.id;
              }));
              setWarningsById(Object.fromEntries(results.map(function (r) {
                return [r.id, r.warnings];
              })));
              setOpenOWById(Object.fromEntries(results.map(function (r) {
                return [r.id, r.openOW || 0];
              })));
              setEtuvagesById(Object.fromEntries(results.map(function (r) {
                return [r.id, r.etuvages || []];
              })));
              setSnLabelsById(Object.fromEntries(results.filter(function (r) {
                return r.snLabels;
              }).map(function (r) {
                return [r.id, r.snLabels];
              })));
              setDataById(Object.fromEntries(results.filter(function (r) {
                return r.data;
              }).map(function (r) {
                return [r.id, r.data];
              })));
              setLoadingWorked(false);
            }
          case 7:
            return _context27.a(2);
        }
      }, _callee27, null, [[1, 4]]);
    }))();
    return function () {
      cancelled = true;
    };
  }, [ofList, user.trigram, consommables]);
  var _useState267 = useState(true),
    _useState268 = _slicedToArray(_useState267, 2),
    hideCloture = _useState268[0],
    setHideCloture = _useState268[1];
  var _useState269 = useState(false),
    _useState270 = _slicedToArray(_useState269, 2),
    showNew = _useState270[0],
    setShowNew = _useState270[1];
  var _useState271 = useState(false),
    _useState272 = _slicedToArray(_useState271, 2),
    showProfile = _useState272[0],
    setShowProfile = _useState272[1];
  var _useState273 = useState([]),
    _useState274 = _slicedToArray(_useState273, 2),
    favs = _useState274[0],
    setFavs = _useState274[1];
  var _useState275 = useState(blankForm),
    _useState276 = _slicedToArray(_useState275, 2),
    form = _useState276[0],
    setForm = _useState276[1];
  var _useState277 = useState(""),
    _useState278 = _slicedToArray(_useState277, 2),
    importText = _useState278[0],
    setImportText = _useState278[1];
  var _useState279 = useState(""),
    _useState280 = _slicedToArray(_useState279, 2),
    importMsg = _useState280[0],
    setImportMsg = _useState280[1];

  // Charger les favs de cet user
  useEffect(function () {
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28() {
      var r, _t38;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.p = _context28.n) {
          case 0:
            _context28.p = 0;
            _context28.n = 1;
            return window.storage.get("favs:".concat(user.trigram), false);
          case 1:
            r = _context28.v;
            if (r) setFavs(JSON.parse(r.value));
            _context28.n = 3;
            break;
          case 2:
            _context28.p = 2;
            _t38 = _context28.v;
          case 3:
            return _context28.a(2);
        }
      }, _callee28, null, [[0, 2]]);
    }))();
  }, [user.trigram]);
  var toggleFav = /*#__PURE__*/function () {
    var _toggleFav = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(id) {
      var nf, _t39;
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.p = _context29.n) {
          case 0:
            nf = favs.includes(id) ? favs.filter(function (f) {
              return f !== id;
            }) : [].concat(_toConsumableArray(favs), [id]);
            setFavs(nf);
            _context29.p = 1;
            _context29.n = 2;
            return window.storage.set("favs:".concat(user.trigram), JSON.stringify(nf), false);
          case 2:
            _context29.n = 4;
            break;
          case 3:
            _context29.p = 3;
            _t39 = _context29.v;
          case 4:
            return _context29.a(2);
        }
      }, _callee29, null, [[1, 3]]);
    }));
    function toggleFav(_x10) {
      return _toggleFav.apply(this, arguments);
    }
    return toggleFav;
  }();

  // Tri
  var sorted = _toConsumableArray(ofList).sort(function (a, b) {
    if (sort === "fav") {
      var fa = favs.includes(a.id) ? 1 : 0,
        fb = favs.includes(b.id) ? 1 : 0;
      if (fa !== fb) return fb - fa;
    }
    if (sort === "opens") {
      var ia = openHistory.indexOf(a.id),
        ib = openHistory.indexOf(b.id);
      var ra = ia === -1 ? 9999 : ia,
        rb = ib === -1 ? 9999 : ib;
      if (ra !== rb) return ra - rb;
    }
    if (sort === "of") return (a.of || "").localeCompare(b.of || "");
    if (sort === "projet") return (a.otp || a.projet || "").localeCompare(b.otp || b.projet || "");
    return 0;
  });
  var nextEtuvageForRow = function nextEtuvageForRow(o) {
    var _data$units7;
    var data = dataById[o.id];
    var units = (data === null || data === void 0 || (_data$units7 = data.units) === null || _data$units7 === void 0 ? void 0 : _data$units7.rows) || o._snRows || [];
    var unit = units.find(function (u) {
      return u.id === o._homeUnitId;
    });
    return nextEtuvageInfo((etuvagesById[o.id] || []).filter(function (r) {
      return !unit || rowMatchesSn(r, unit, units);
    }));
  };
  var columnValue = function columnValue(o, key) {
    var _STATUTS7, _UNIT_STATUTS$o$unitS;
    if (key === "reprise") return ["oui", "true"].includes(String(o.ofRework || "").toLowerCase()) ? "Oui" : "Non";
    if (key === "status") return ((_STATUTS7 = STATUTS[o.status || "en_cours"]) === null || _STATUTS7 === void 0 ? void 0 : _STATUTS7.label) || "";
    if (key === "unitStatus") return ((_UNIT_STATUTS$o$unitS = UNIT_STATUTS[o.unitStatus]) === null || _UNIT_STATUTS$o$unitS === void 0 ? void 0 : _UNIT_STATUTS$o$unitS.label) || "";
    if (key === "otp") return o.otp || o.projet || "";
    if (key === "nextEtuvage") {
      var n = nextEtuvageForRow(o);
      return n.count ? n.label : "";
    }
    return String(o[key] || "");
  };
  var homeSortValue = function homeSortValue(o, key) {
    var _warningsById$o$id, _warningsById$o$id2;
    if (key === "nextEtuvage") return nextEtuvageForRow(o).nextAt || "";
    if (key === "facts") return homeFactsForUnit(dataById[o.id], o._homeUnitId).map(closureFactLabel).filter(Boolean).join(" ");
    if (key === "tracking") return "".concat(((_warningsById$o$id = warningsById[o.id]) === null || _warningsById$o$id === void 0 ? void 0 : _warningsById$o$id.length) || 0, " ").concat(openOWById[o.id] || 0, " ").concat(pendingHomePolymerization(dataById[o.id], consommables, o._homeUnitId, homeNow) ? 1 : 0);
    if (key === "followup") return "".concat(homeFactsForUnit(dataById[o.id], o._homeUnitId).map(closureFactLabel).filter(Boolean).join(" "), " ").concat(((_warningsById$o$id2 = warningsById[o.id]) === null || _warningsById$o$id2 === void 0 ? void 0 : _warningsById$o$id2.length) || 0, " ").concat(openOWById[o.id] || 0, " ").concat(pendingHomePolymerization(dataById[o.id], consommables, o._homeUnitId, homeNow) ? 1 : 0);
    return columnValue(o, key);
  };
  var baseHomeRows = sorted.flatMap(function (o) {
    return homeRowsForOf(o, dataById[o.id]);
  });
  var allHomeRows = columnSort.key ? _toConsumableArray(baseHomeRows).sort(function (a, b) {
    var av = homeSortValue(a, columnSort.key),
      bv = homeSortValue(b, columnSort.key);
    var aBlank = av === null || av === undefined || String(av).trim() === "",
      bBlank = bv === null || bv === undefined || String(bv).trim() === "";
    if (aBlank !== bBlank) return aBlank ? 1 : -1;
    var comparison = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), "fr", {
      numeric: true,
      sensitivity: "base"
    });
    if (comparison) return columnSort.direction === "asc" ? comparison : -comparison;
    return String(a.of || "").localeCompare(String(b.of || ""), "fr", {
      numeric: true,
      sensitivity: "base"
    }) || String(a.sn || a.lot || "").localeCompare(String(b.sn || b.lot || ""), "fr", {
      numeric: true,
      sensitivity: "base"
    });
  }) : baseHomeRows;
  var matching = allHomeRows.filter(function (o) {
    var _STATUTS8, _warningsById$o$id3, _STATUTS9, _STATUTS0;
    var q = search.toLowerCase().trim();
    if (hideCloture && (_STATUTS8 = STATUTS[o.status || "en_cours"]) !== null && _STATUTS8 !== void 0 && _STATUTS8.closed) return false;
    if (onlyWarnings && !((_warningsById$o$id3 = warningsById[o.id]) !== null && _warningsById$o$id3 !== void 0 && _warningsById$o$id3.length)) return false;
    if (filterStatus.length && !filterStatus.includes(o.status || "en_cours") && !filterStatus.includes(o.unitStatus || "en_cours")) return false;
    if (Object.entries(columnFilters).some(function (_ref121) {
      var _ref122 = _slicedToArray(_ref121, 2),
        key = _ref122[0],
        value = _ref122[1];
      return value && !columnValue(o, key).toLowerCase().includes(value.toLowerCase().trim());
    })) return false;
    return !q || [o.of, o.sn, o.lot, o.snProduitFini, o.description, o.otp, o.projet, o.ofRework, o.codeArticle, (_STATUTS9 = STATUTS[o.status || "en_cours"]) === null || _STATUTS9 === void 0 ? void 0 : _STATUTS9.label, (_STATUTS0 = STATUTS[o.unitStatus || "en_cours"]) === null || _STATUTS0 === void 0 ? void 0 : _STATUTS0.label].some(function (v) {
      return v === null || v === void 0 ? void 0 : v.toLowerCase().includes(q);
    });
  });
  var searchActive = !!search.trim() || Object.values(columnFilters).some(function (value) {
    return String(value).trim();
  });
  var workedFilter = homeWorkedFilter(matching, workedIds, onlyWorked, searchActive);
  var filtered = workedFilter.rows;
  var totalPages = Math.ceil(filtered.length / pageSize);
  var currentPage = Math.min(page, Math.max(0, totalPages - 1));
  var paged = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  var selectedRows = allHomeRows.filter(function (row) {
    return selectedKeys.includes(homeRowKey(row));
  }).map(function (row) {
    return _objectSpread(_objectSpread({}, row), {}, {
      _homeFacts: homeFactsForUnit(dataById[row.id], row._homeUnitId)
    });
  });
  var selectionMode = selectedRows.length > 0;
  var mixedMeetingOtp = selectedRows.length > 0 && !hasSingleMeetingOtp(selectedRows);
  var allPageSelected = !!paged.length && paged.every(function (row) {
    return selectedKeys.includes(homeRowKey(row));
  });
  var toggleSelected = function toggleSelected(row) {
    return setSelectedKeys(function (keys) {
      return keys.includes(homeRowKey(row)) ? keys.filter(function (key) {
        return key !== homeRowKey(row);
      }) : [].concat(_toConsumableArray(keys), [homeRowKey(row)]);
    });
  };
  var togglePageSelection = function togglePageSelection(checked) {
    return setSelectedKeys(function (keys) {
      return checked ? _toConsumableArray(new Set([].concat(_toConsumableArray(keys), _toConsumableArray(paged.map(homeRowKey))))) : keys.filter(function (key) {
        return !paged.some(function (row) {
          return homeRowKey(row) === key;
        });
      });
    });
  };
  var exportBulkPdf = /*#__PURE__*/function () {
    var _exportBulkPdf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(options) {
      var logoImage, grouped, blobs, _iterator5, _step5, _step5$value, id, group, data, stored, merged, ofNumbers, suffix, _t40, _t41;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.p = _context30.n) {
          case 0:
            _context30.n = 1;
            return loadPdfLogoImage("assets/logo.png");
          case 1:
            logoImage = _context30.v;
            grouped = new Map();
            selectedRows.forEach(function (row) {
              var group = grouped.get(row.id) || {
                row: row,
                unitIds: []
              };
              if (row._homeUnitId && !group.unitIds.includes(row._homeUnitId)) group.unitIds.push(row._homeUnitId);
              grouped.set(row.id, group);
            });
            blobs = [];
            _iterator5 = _createForOfIteratorHelper(grouped);
            _context30.p = 2;
            _iterator5.s();
          case 3:
            if ((_step5 = _iterator5.n()).done) {
              _context30.n = 8;
              break;
            }
            _step5$value = _slicedToArray(_step5.value, 2), id = _step5$value[0], group = _step5$value[1];
            data = dataById[id];
            if (data) {
              _context30.n = 5;
              break;
            }
            _context30.n = 4;
            return window.storage.get("of:".concat(id), true);
          case 4:
            stored = _context30.v;
            data = JSON.parse(stored.value);
          case 5:
            _context30.p = 5;
            blobs.push(buildDirectReportPdf({
              ofData: data,
              lists: {
                consommables: consommables
              },
              exportedAt: nowDT(),
              exportedBy: (user === null || user === void 0 ? void 0 : user.trigram) || "",
              includeHistory: !!options.includeHistory,
              includeDeleted: options.includeDeleted !== false,
              skipEmptyReports: !!options.skipEmptyReports,
              selectedSections: options.selectedSections,
              selectedSnIds: group.unitIds.length ? group.unitIds : null,
              logoImage: logoImage
            }));
            _context30.n = 7;
            break;
          case 6:
            _context30.p = 6;
            _t40 = _context30.v;
            if (!(!options.skipEmptyReports || !String((_t40 === null || _t40 === void 0 ? void 0 : _t40.message) || _t40).includes("Aucun rapport non vide"))) {
              _context30.n = 7;
              break;
            }
            throw _t40;
          case 7:
            _context30.n = 3;
            break;
          case 8:
            _context30.n = 10;
            break;
          case 9:
            _context30.p = 9;
            _t41 = _context30.v;
            _iterator5.e(_t41);
          case 10:
            _context30.p = 10;
            _iterator5.f();
            return _context30.f(10);
          case 11:
            _context30.n = 12;
            return mergeGeneratedPdfBlobs(blobs);
          case 12:
            merged = _context30.v;
            ofNumbers = _toConsumableArray(grouped.values()).map(function (group) {
              return group.row.of;
            }).filter(Boolean);
            suffix = ofNumbers.length === 1 ? "OF ".concat(ofNumbers[0]) : "".concat(ofNumbers.length, " OF");
            downloadBrowserBlob(merged, fileSafeName("SP-F001A - Impression group\xE9e - ".concat(suffix, " - ").concat(nowDT().replace(/[/:]/g, "-"), " - ").concat((user === null || user === void 0 ? void 0 : user.trigram) || "VISA")) + ".pdf");
            setShowBulkPdf(false);
          case 13:
            return _context30.a(2);
        }
      }, _callee30, null, [[5, 6], [2, 9, 10, 11]]);
    }));
    function exportBulkPdf(_x11) {
      return _exportBulkPdf.apply(this, arguments);
    }
    return exportBulkPdf;
  }();
  var exportBulkComponentSheets = /*#__PURE__*/function () {
    var _exportBulkComponentSheets = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
      var grouped, logoImage, blobs, _iterator6, _step6, _step6$value, id, group, data, stored, merged, ofNumbers, suffix, _t42, _t43;
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.p = _context31.n) {
          case 0:
            grouped = new Map();
            selectedRows.forEach(function (row) {
              var group = grouped.get(row.id) || {
                row: row,
                unitIds: []
              };
              if (row._homeUnitId && !group.unitIds.includes(row._homeUnitId)) group.unitIds.push(row._homeUnitId);
              grouped.set(row.id, group);
            });
            _context31.p = 1;
            _context31.n = 2;
            return loadPdfLogoImage("assets/logo.png");
          case 2:
            logoImage = _context31.v;
            blobs = [];
            _iterator6 = _createForOfIteratorHelper(grouped);
            _context31.p = 3;
            _iterator6.s();
          case 4:
            if ((_step6 = _iterator6.n()).done) {
              _context31.n = 8;
              break;
            }
            _step6$value = _slicedToArray(_step6.value, 2), id = _step6$value[0], group = _step6$value[1];
            data = dataById[id];
            if (data) {
              _context31.n = 6;
              break;
            }
            _context31.n = 5;
            return window.storage.get("of:".concat(id), true);
          case 5:
            stored = _context31.v;
            data = JSON.parse(stored.value);
          case 6:
            blobs.push(buildComponentRetentionSheetsPdf({
              ofData: data,
              selectedUnitIds: group.unitIds.length ? group.unitIds : null,
              logoImage: logoImage,
              exportedAt: nowDT(),
              exportedBy: (user === null || user === void 0 ? void 0 : user.trigram) || ""
            }));
          case 7:
            _context31.n = 4;
            break;
          case 8:
            _context31.n = 10;
            break;
          case 9:
            _context31.p = 9;
            _t42 = _context31.v;
            _iterator6.e(_t42);
          case 10:
            _context31.p = 10;
            _iterator6.f();
            return _context31.f(10);
          case 11:
            _context31.n = 12;
            return mergeGeneratedPdfBlobs(blobs);
          case 12:
            merged = _context31.v;
            ofNumbers = _toConsumableArray(grouped.values()).map(function (group) {
              return group.row.of;
            }).filter(Boolean);
            suffix = ofNumbers.length === 1 ? "OF ".concat(ofNumbers[0]) : "".concat(ofNumbers.length, " OF");
            downloadBrowserBlob(merged, fileSafeName("Feuilles composants dessoud\xE9s - ".concat(suffix)) + ".pdf");
            _context31.n = 14;
            break;
          case 13:
            _context31.p = 13;
            _t43 = _context31.v;
            window.alert("Impression impossible : ".concat((_t43 === null || _t43 === void 0 ? void 0 : _t43.message) || _t43));
          case 14:
            return _context31.a(2);
        }
      }, _callee31, null, [[3, 9, 10, 11], [1, 13]]);
    }));
    function exportBulkComponentSheets() {
      return _exportBulkComponentSheets.apply(this, arguments);
    }
    return exportBulkComponentSheets;
  }();
  var columnFilter = function columnFilter(key, label) {
    return ["status", "unitStatus"].includes(key) ? /*#__PURE__*/React.createElement(MultiFilter, {
      value: filterStatus,
      onChange: function onChange(v) {
        setFilterStatus(v);
        setPage(0);
      },
      label: "Tous",
      title: "Filtrer les statuts OF et SN/LOT",
      options: Object.entries(STATUTS).map(function (_ref123) {
        var _ref124 = _slicedToArray(_ref123, 2),
          value = _ref124[0],
          s = _ref124[1];
        return {
          value: value,
          label: s.label
        };
      })
    }) : key === "reprise" ? /*#__PURE__*/React.createElement("select", {
      "aria-label": "Filtrer Reprise",
      value: columnFilters.reprise || "",
      onChange: function onChange(e) {
        setColumnFilters(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, {
            reprise: e.target.value
          });
        });
        setPage(0);
      },
      style: {
        width: "100%",
        background: C.input,
        color: C.text,
        border: "1px solid ".concat(C.border),
        borderRadius: 4,
        padding: "5px 6px",
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Tous"), /*#__PURE__*/React.createElement("option", null, "Oui"), /*#__PURE__*/React.createElement("option", null, "Non")) : /*#__PURE__*/React.createElement("input", {
      "aria-label": "Filtrer ".concat(label),
      placeholder: "Filtrer\u2026",
      value: columnFilters[key] || "",
      onChange: function onChange(e) {
        setColumnFilters(function (prev) {
          return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, e.target.value));
        });
        setPage(0);
      },
      style: {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "5px 6px",
        fontSize: 12,
        color: C.text,
        background: C.input,
        border: "1px solid ".concat(C.border),
        borderRadius: 4
      }
    });
  };
  var toggleColumnSort = function toggleColumnSort(key) {
    setColumnSort(function (current) {
      return current.key === key ? {
        key: key,
        direction: current.direction === "asc" ? "desc" : "asc"
      } : {
        key: key,
        direction: "asc"
      };
    });
    setPage(0);
  };
  var sortableTh = function sortableTh(key, label, w) {
    var active = columnSort.key === key;
    var order = columnSort.direction === "asc" ? "A-Z" : "Z-A";
    return /*#__PURE__*/React.createElement(TH, {
      w: w
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return toggleColumnSort(key);
      },
      "aria-label": active ? "Trier ".concat(label, ", ordre ").concat(order) : "Trier ".concat(label, " de A \xE0 Z"),
      title: active ? "Tri ".concat(order, " \u2014 cliquer pour inverser") : "Trier ".concat(label, " de A \xE0 Z"),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 5,
        padding: 0,
        border: 0,
        background: "transparent",
        color: active ? C.blue : C.muted,
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 0,
        cursor: "pointer",
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        fontSize: 9,
        color: active ? C.blue : C.border
      }
    }, active ? order : "↕")));
  };
  var create = /*#__PURE__*/function () {
    var _create = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32() {
      var snList, first, last, snRows;
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.n) {
          case 0:
            if (isAdminManager(user)) {
              _context32.n = 1;
              break;
            }
            return _context32.a(2);
          case 1:
            if (form.of) {
              _context32.n = 2;
              break;
            }
            return _context32.a(2);
          case 2:
            snList = parseSnList(form.snLines || form.sn);
            if (!(snList.length > 1)) {
              _context32.n = 3;
              break;
            }
            first = snList[0], last = snList[snList.length - 1];
            if (window.confirm("Cr\xE9er ".concat(snList.length, " SN dans l'OF ").concat(form.of, " de ").concat(first, " \xE0 ").concat(last, " ?"))) {
              _context32.n = 3;
              break;
            }
            return _context32.a(2);
          case 3:
            snRows = snList.map(function (sn) {
              return {
                id: uid(),
                sn: sn,
                lot: form.lot || "",
                status: "en_cours",
                remarque: "",
                createdVisa: user.trigram,
                createdDT: nowDT(),
                deleted: false
              };
            });
            onCreate(_objectSpread(_objectSpread({}, form), {}, {
              sn: snList[0] || form.sn,
              projet: form.otp,
              ofRework: form.ofRework || "non",
              _snRows: snRows,
              createdBy: user.trigram,
              createdAt: now()
            }));
            setForm(_objectSpread({}, blankForm));
            setShowNew(false);
          case 4:
            return _context32.a(2);
        }
      }, _callee32);
    }));
    function create() {
      return _create.apply(this, arguments);
    }
    return create;
  }();
  var importPaste = /*#__PURE__*/function () {
    var _importPaste = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
      var groups, itemCount, msg, _t44;
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.p = _context33.n) {
          case 0:
            if (!(!isAdminManager(user) || !onImportOFs)) {
              _context33.n = 1;
              break;
            }
            return _context33.a(2);
          case 1:
            groups = parseOfImportPaste(importText);
            itemCount = groups.reduce(function (n, g) {
              return n + (g.items || []).length;
            }, 0);
            if (groups.length) {
              _context33.n = 2;
              break;
            }
            setImportMsg("Aucun OF détecté dans le collage.");
            return _context33.a(2);
          case 2:
            if (window.confirm("Importer ".concat(groups.length, " OF et ").concat(itemCount, " ligne(s) SN/LOT depuis ce copier-coller ?"))) {
              _context33.n = 3;
              break;
            }
            return _context33.a(2);
          case 3:
            _context33.p = 3;
            _context33.n = 4;
            return onImportOFs(groups);
          case 4:
            msg = _context33.v;
            setImportMsg(msg || "Import terminé.");
            setImportText("");
            _context33.n = 6;
            break;
          case 5:
            _context33.p = 5;
            _t44 = _context33.v;
            setImportMsg("Erreur import : ".concat((_t44 === null || _t44 === void 0 ? void 0 : _t44.message) || _t44));
          case 6:
            return _context33.a(2);
        }
      }, _callee33, null, [[3, 5]]);
    }));
    function importPaste() {
      return _importPaste.apply(this, arguments);
    }
    return importPaste;
  }();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "system-ui,sans-serif",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png",
    alt: "Safran",
    style: {
      width: 100,
      height: 32,
      objectFit: "contain",
      background: "#ffffff",
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.muted
    }
  }, "Safran Timing Technologies SA")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: C.text,
      fontFamily: "monospace"
    }
  }, "SP-F001A7")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(ThemeButton, null), canManageLists(user) && /*#__PURE__*/React.createElement(Btn, {
    onClick: onManageStatuses,
    color: C.border,
    small: true
  }, "Statuts"), canManageUsers(user) && /*#__PURE__*/React.createElement(Btn, {
    onClick: onManageUsers,
    color: C.blue,
    small: true
  }, "Utilisateurs"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.accent + "22",
      border: "1px solid ".concat(C.accent),
      borderRadius: 20,
      padding: "4px 14px",
      fontFamily: "monospace",
      fontWeight: 700,
      color: C.accent,
      fontSize: 14,
      cursor: "pointer"
    },
    title: "Mon profil",
    onClick: function onClick(e) {
      e.stopPropagation();
      setShowProfile(true);
    }
  }, user.trigram, (user.nom || user.prenom) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 400,
      color: C.muted,
      fontFamily: "system-ui",
      marginLeft: 6
    }
  }, [user.prenom, user.nom].filter(Boolean).join(" "))), /*#__PURE__*/React.createElement(Btn, {
    onClick: onLogout,
    color: C.border,
    small: true
  }, "D\xE9connexion"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 6,
      padding: "5px 14px",
      textAlign: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 9,
      textTransform: "uppercase"
    }
  }, "Dossiers"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.text,
      fontSize: 18,
      fontWeight: 900,
      fontFamily: "monospace",
      lineHeight: 1
    }
  }, ofList.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: search,
    onChange: function onChange(v) {
      setSearch(v);
      setPage(0);
    },
    title: "Rechercher un OF, SN ou lot",
    placeholder: "\uD83D\uDD0D  OF, SN, LOT, SN Produit Fini, OTP\u2026"
  })), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: function onChange(e) {
      setSort(e.target.value);
      setColumnSort({
        key: "",
        direction: "asc"
      });
      setPage(0);
    },
    style: {
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "6px 10px",
      fontSize: 12,
      fontFamily: "monospace",
      outline: "none"
    }
  }, SORT_OPTS.map(function (s) {
    return /*#__PURE__*/React.createElement("option", {
      key: s.id,
      value: s.id
    }, s.label);
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: C.text,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: workedFilter.active,
    disabled: loadingWorked || searchActive || !matching.some(function (o) {
      return workedIds.includes(o.id);
    }),
    onChange: function onChange(e) {
      setOnlyWorked(e.target.checked);
      setPage(0);
    }
  }), "Mes OF travaill\xE9s"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: onlyWarnings ? C.yellow : C.text,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: onlyWarnings,
    onChange: function onChange(e) {
      setOnlyWarnings(e.target.checked);
      setPage(0);
    }
  }), "OF \xE0 surveiller"), /*#__PURE__*/React.createElement(MultiFilter, {
    value: filterStatus,
    onChange: function onChange(v) {
      setFilterStatus(v);
      setPage(0);
    },
    label: "Tous statuts OF/SN",
    title: "Filtrer les statuts OF et SN/LOT",
    options: Object.entries(STATUTS).map(function (_ref125) {
      var _ref126 = _slicedToArray(_ref125, 2),
        value = _ref126[0],
        s = _ref126[1];
      return {
        value: value,
        label: s.label
      };
    })
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setHideCloture(function (v) {
        return !v;
      });
    },
    style: {
      background: hideCloture ? "#23863622" : "transparent",
      border: "1px solid ".concat(hideCloture ? "#238636" : C.border),
      borderRadius: 4,
      color: hideCloture ? "#238636" : C.muted,
      padding: "6px 10px",
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "monospace",
      whiteSpace: "nowrap"
    }
  }, hideCloture ? "✓ États finaux masqués" : "Afficher états finaux"), isAdminManager(user) && /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowNew(function (v) {
        return !v;
      });
    },
    color: showNew ? C.border : C.accent
  }, showNew ? "✕ Annuler" : "+ Nouveau dossier")), isAdminManager(user) && selectionMode && /*#__PURE__*/React.createElement("div", {
    role: "toolbar",
    "aria-label": "Actions sur la s\xE9lection",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      flexWrap: "wrap",
      marginBottom: 12,
      padding: "8px 10px",
      background: C.blue + "10",
      border: "1px solid ".concat(C.blue),
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: C.blue,
      fontSize: 12,
      minWidth: 105
    }
  }, selectedRows.length, " s\xE9lectionn\xE9e", selectedRows.length > 1 ? "s" : ""), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowBulkPdf(true);
    },
    color: C.blue,
    small: true
  }, "Imprimer les dossiers"), /*#__PURE__*/React.createElement(Btn, {
    onClick: exportBulkComponentSheets,
    color: C.blue,
    small: true
  }, "Feuilles composants"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setHomeMailKind("closure");
    },
    color: C.green,
    small: true
  }, "Cl\xF4ture logistique"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setHomeMailKind("ip");
    },
    color: C.yellow,
    small: true,
    disabled: mixedMeetingOtp
  }, "Inspection IP"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setSelectedKeys([]);
    },
    color: C.border,
    small: true
  }, "Annuler la s\xE9lection"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontSize: 11,
      marginLeft: "auto"
    }
  }, "Cliquez sur une ligne pour l\u2019ajouter. La fl\xE8che ouvre toujours le dossier."), mixedMeetingOtp && /*#__PURE__*/React.createElement("span", {
    role: "alert",
    style: {
      width: "100%",
      fontSize: 11,
      color: C.yellow,
      fontWeight: 700
    }
  }, "Une invitation IP ne peut contenir qu\u2019un seul OTP.")), showNew && /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.accent),
      borderRadius: 8,
      padding: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 11,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "Nouveau dossier"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginBottom: 4,
      textTransform: "uppercase"
    }
  }, "SN (un par ligne)"), /*#__PURE__*/React.createElement("textarea", {
    value: form.snLines || form.sn || "",
    onChange: function onChange(e) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          snLines: e.target.value,
          sn: parseSnList(e.target.value)[0] || ""
        });
      });
    },
    placeholder: "SN181\nSN182\nSN183",
    rows: 4,
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      fontSize: 13,
      fontFamily: "monospace",
      padding: "8px 10px",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: C.muted,
      marginTop: 4
    }
  }, parseSnList(form.snLines || form.sn).length || 0, " SN d\xE9tect\xE9", parseSnList(form.snLines || form.sn).length > 1 ? "s" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10,
      marginBottom: 10
    }
  }, [["OF *", "of", "454545", "N° de l'ordre de fabrication"], ["LOT", "lot", "SP-J12345", "Lot"], ["N° Article", "codeArticle", "R4B-S001A", "Référence SAP"], ["OTP", "otp", "7400-SPA-IRNS-MAI", "OTP / programme"]].map(function (_ref127) {
    var _ref128 = _slicedToArray(_ref127, 4),
      label = _ref128[0],
      key = _ref128[1],
      ph = _ref128[2],
      title = _ref128[3];
    return /*#__PURE__*/React.createElement("div", {
      key: key
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 10,
        marginBottom: 4,
        textTransform: "uppercase"
      }
    }, label), /*#__PURE__*/React.createElement(Input, {
      value: form[key] || "",
      onChange: function onChange(v) {
        return setForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, _defineProperty({}, key, v));
        });
      },
      placeholder: ph,
      title: title
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginBottom: 4,
      textTransform: "uppercase"
    }
  }, "Description"), /*#__PURE__*/React.createElement(Input, {
    value: form.description || "",
    onChange: function onChange(v) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          description: v
        });
      });
    },
    placeholder: "Carte \xE9lectronique haute tension"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginBottom: 4,
      textTransform: "uppercase"
    }
  }, "OF reprise"), /*#__PURE__*/React.createElement("select", {
    value: form.ofRework || "non",
    onChange: function onChange(e) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          ofRework: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      padding: "6px 10px",
      fontSize: 13,
      fontFamily: "monospace",
      outline: "none"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "non"
  }, "Non"), /*#__PURE__*/React.createElement("option", {
    value: "oui"
  }, "Oui"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10,
      marginBottom: 4,
      textTransform: "uppercase"
    }
  }, "Statut OF"), /*#__PURE__*/React.createElement("select", {
    value: form.status || "en_cours",
    onChange: function onChange(e) {
      return setForm(function (f) {
        return _objectSpread(_objectSpread({}, f), {}, {
          status: e.target.value
        });
      });
    },
    style: {
      width: "100%",
      background: ((_STATUTS1 = STATUTS[form.status || "en_cours"]) === null || _STATUTS1 === void 0 ? void 0 : _STATUTS1.color) + "22",
      border: "1px solid ".concat((_STATUTS10 = STATUTS[form.status || "en_cours"]) === null || _STATUTS10 === void 0 ? void 0 : _STATUTS10.color),
      borderRadius: 4,
      color: (_STATUTS11 = STATUTS[form.status || "en_cours"]) === null || _STATUTS11 === void 0 ? void 0 : _STATUTS11.color,
      padding: "6px 10px",
      fontSize: 13,
      fontFamily: "monospace",
      fontWeight: 700,
      outline: "none"
    }
  }, Object.entries(STATUTS).map(function (_ref129) {
    var _ref130 = _slicedToArray(_ref129, 2),
      k = _ref130[0],
      v = _ref130[1];
    return /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, v.label);
  })))), /*#__PURE__*/React.createElement(Btn, {
    onClick: create,
    color: form.of ? C.green : C.border,
    disabled: !form.of.trim()
  }, "\u2713 Cr\xE9er le dossier"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid ".concat(C.border),
      marginTop: 16,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 11,
      letterSpacing: 1,
      textTransform: "uppercase"
    }
  }, "Importer depuis copier-coller"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 10
    }
  }, "Ordre colonnes : Qt\xE9 initiale, Projet, Article N\xB0, Article N\xB0SAP, Description, SN / LOT, OF, reprise")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: C.muted,
      fontFamily: "monospace"
    }
  }, parseOfImportPaste(importText).length || 0, " OF")), /*#__PURE__*/React.createElement("textarea", {
    value: importText,
    onChange: function onChange(e) {
      setImportText(e.target.value);
      setImportMsg("");
    },
    placeholder: "Qté initiale;Projet;Article N°;Article N°SAP;Description;SN / LOT;OF;reprise\n1;7400-SPA-PHM2-MAI;A1I3-S100D;250 000 465;MO Core PCB ajust. et Q monté;#11601;1000043;X",
    rows: 5,
    style: {
      width: "100%",
      background: C.input,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      color: C.text,
      fontSize: 12,
      fontFamily: "monospace",
      padding: "8px 10px",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      marginBottom: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(ImportCsvFile, {
    onText: function onText(text) {
      setImportText(text);
      setImportMsg("");
    },
    onError: setImportMsg
  }), /*#__PURE__*/React.createElement(Btn, {
    onClick: importPaste,
    color: importText.trim() ? C.green : C.border,
    disabled: !importText.trim(),
    small: true
  }, "Importer le collage"), importMsg && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: importMsg.startsWith("Erreur") ? C.red : C.muted
    }
  }, importMsg)))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      padding: 40,
      fontSize: 14
    }
  }, (onlyWorked || onlyWarnings) && loadingWorked ? "Chargement des OF…" : onlyWarnings ? "Aucun OF à surveiller avec ces filtres" : search ? "Aucun résultat" : onlyWorked ? "Aucun OF travaillé" : "Aucun dossier"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 6
    }
  }, /*#__PURE__*/React.createElement("tr", null, isAdminManager(user) && /*#__PURE__*/React.createElement(TH, {
    w: 34
  }, /*#__PURE__*/React.createElement("input", {
    "aria-label": "S\xE9lectionner les lignes de la page",
    type: "checkbox",
    checked: allPageSelected,
    onChange: function onChange(e) {
      return togglePageSelection(e.target.checked);
    }
  })), /*#__PURE__*/React.createElement(TH, {
    w: 30
  }, "\u2B50"), sortableTh("of", "OF", 120), sortableTh("codeArticle", "N° Article", 110), sortableTh("sn", "SN", 90), sortableTh("lot", "LOT", 110), sortableTh("description", "Description"), sortableTh("otp", "OTP", 190), sortableTh("snProduitFini", "SN Prod. Fini", 140), sortableTh("reprise", "Reprise", 78), sortableTh("status", "Statut OF", 105), sortableTh("unitStatus", "Statut SN", 110), sortableTh("nextEtuvage", "Prochain étuvage", 150), sortableTh("followup", "Faits / Suivi", 330), /*#__PURE__*/React.createElement(TH, {
    w: isAdminManager(user) ? 140 : 80
  })), /*#__PURE__*/React.createElement("tr", {
    style: {
      background: C.raised
    }
  }, isAdminManager(user) && /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: "Effacer les filtres de colonne",
    "aria-label": "Effacer les filtres de colonne",
    onClick: function onClick() {
      setColumnFilters({});
      setFilterStatus([]);
      setPage(0);
    },
    style: {
      border: 0,
      background: "transparent",
      color: C.muted,
      cursor: "pointer"
    }
  }, "\xD7")), [['of', 'OF'], ['codeArticle', 'N° Article'], ['sn', 'SN'], ['lot', 'LOT'], ['description', 'Description'], ['otp', 'OTP'], ['snProduitFini', 'SN Produit Fini'], ['reprise', 'Reprise'], ['status', 'Statut OF'], ['unitStatus', 'Statut SN'], ['nextEtuvage', 'Prochain étuvage']].map(function (_ref131) {
    var _ref132 = _slicedToArray(_ref131, 2),
      key = _ref132[0],
      label = _ref132[1];
    return /*#__PURE__*/React.createElement("td", {
      key: key,
      style: {
        padding: "4px 5px"
      }
    }, columnFilter(key, label));
  }), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null))), /*#__PURE__*/React.createElement("tbody", null, paged.map(function (o, i) {
    var _STATUTS12, _STATUTS13, _STATUTS14, _UNIT_STATUTS4, _UNIT_STATUTS5, _UNIT_STATUTS6, _warningsById$o$id4, _warningsById$o$id5;
    var isFav = favs.includes(o.id);
    var isRecent = openHistory[0] === o.id;
    var snLabels = snLabelsById[o.id] || snRowsFromHeader(o).map(snTitle);
    var multiSn = snLabels.length > 1;
    var selected = selectedKeys.includes(homeRowKey(o));
    var groupStart = i === 0 || paged[i - 1].id !== o.id;
    var polymerization = pendingHomePolymerization(dataById[o.id], consommables, o._homeUnitId, homeNow);
    var facts = homeFactsForUnit(dataById[o.id], o._homeUnitId);
    return /*#__PURE__*/React.createElement("tr", {
      key: "".concat(o.id, ":").concat(o._homeUnitId || "global"),
      onClick: function onClick() {
        return selectionMode ? toggleSelected(o) : onSelect(o.id, o._homeUnitId);
      },
      title: selectionMode ? "Ajouter ou retirer cette ligne de la sélection" : "Ouvrir ce dossier",
      style: {
        background: selected ? C.yellow + "20" : isFav ? "#e05c0008" : i % 2 === 0 ? "transparent" : C.stripe,
        cursor: selectionMode ? "cell" : "pointer",
        transition: "background .1s",
        borderTop: groupStart ? "2px solid ".concat(C.border) : undefined
      },
      onMouseEnter: function onMouseEnter(e) {
        return e.currentTarget.style.background = selectionMode ? C.blue + "14" : "#e05c0015";
      },
      onMouseLeave: function onMouseLeave(e) {
        return e.currentTarget.style.background = selected ? C.yellow + "20" : isFav ? "#e05c0008" : i % 2 === 0 ? "transparent" : C.stripe;
      }
    }, isAdminManager(user) && /*#__PURE__*/React.createElement(TD, {
      center: true,
      onClick: function onClick(e) {
        e.stopPropagation();
        toggleSelected(o);
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "aria-label": "S\xE9lectionner ".concat(homeUnitName(o), " - OF ").concat(o.of),
      checked: selected,
      onClick: function onClick(e) {
        return e.stopPropagation();
      },
      onChange: function onChange() {
        return toggleSelected(o);
      },
      style: {
        width: 17,
        height: 17,
        cursor: "pointer"
      }
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("span", {
      onClick: function onClick(e) {
        e.stopPropagation();
        toggleFav(o.id);
      },
      style: {
        cursor: "pointer",
        fontSize: 14,
        opacity: isFav ? 1 : .3,
        transition: "opacity .15s"
      },
      title: isFav ? "Retirer des favoris" : "Ajouter aux favoris"
    }, "\u2B50")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontFamily: "monospace",
        color: groupStart ? C.text : C.muted
      }
    }, groupStart ? o.of : "\u21B3 ".concat(o.of)), multiSn && groupStart && /*#__PURE__*/React.createElement("span", {
      title: "".concat(snLabels.length, " SN : ").concat(snLabels.join(", "))
    }, /*#__PURE__*/React.createElement(Badge, {
      label: "Multi-SN",
      color: C.blue
    })), isRecent && /*#__PURE__*/React.createElement(Badge, {
      label: "r\xE9cent",
      color: C.purple
    }))), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        color: C.muted
      }
    }, groupStart ? o.codeArticle || o.articleNo || "—" : "")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        color: o.sn ? C.blue : C.muted,
        fontWeight: 700
      }
    }, o.sn || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        color: C.muted
      }
    }, o.lot || "—")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.text
      }
    }, groupStart ? o.description || "—" : "")), /*#__PURE__*/React.createElement(TD, null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 11,
        color: C.muted,
        whiteSpace: "nowrap"
      }
    }, groupStart ? o.otp || o.projet || "—" : "")), /*#__PURE__*/React.createElement(TD, {
      onClick: function onClick(e) {
        return e.stopPropagation();
      }
    }, /*#__PURE__*/React.createElement(FinishedProductSn, {
      of: o,
      user: user,
      onSave: onFinishedSnChange
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement(Badge, {
      label: String(o.ofRework || "non").toLowerCase() === "oui" || String(o.ofRework || "").toLowerCase() === "true" ? "Oui" : "Non",
      color: String(o.ofRework || "").toLowerCase() === "oui" ? C.yellow : C.border
    })), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("select", {
      disabled: !isAdminManager(user),
      value: o.status || "en_cours",
      onClick: function onClick(e) {
        return e.stopPropagation();
      },
      onChange: function onChange(e) {
        e.stopPropagation();
        onUpdateStatus(o.id, e.target.value);
      },
      style: {
        background: ((_STATUTS12 = STATUTS[o.status || "en_cours"]) === null || _STATUTS12 === void 0 ? void 0 : _STATUTS12.color) + "22",
        border: "1px solid ".concat((_STATUTS13 = STATUTS[o.status || "en_cours"]) === null || _STATUTS13 === void 0 ? void 0 : _STATUTS13.color),
        borderRadius: 20,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
        color: (_STATUTS14 = STATUTS[o.status || "en_cours"]) === null || _STATUTS14 === void 0 ? void 0 : _STATUTS14.color,
        outline: "none",
        cursor: "pointer"
      }
    }, Object.entries(STATUTS).map(function (_ref133) {
      var _ref134 = _slicedToArray(_ref133, 2),
        k = _ref134[0],
        v = _ref134[1];
      return /*#__PURE__*/React.createElement("option", {
        key: k,
        value: k
      }, v.label);
    }))), /*#__PURE__*/React.createElement(TD, {
      onClick: function onClick(e) {
        return e.stopPropagation();
      }
    }, o._homeUnitId ? /*#__PURE__*/React.createElement("select", {
      "aria-label": "Statut SN ".concat(o.sn || o.lot, " - OF ").concat(o.of),
      disabled: !isAdminManager(user),
      value: o.unitStatus || "en_cours",
      onChange: function onChange(e) {
        return onUnitStatusChange(o.id, o._homeUnitId, e.target.value)["catch"](function (error) {
          return window.alert("Enregistrement impossible : ".concat((error === null || error === void 0 ? void 0 : error.message) || error));
        });
      },
      style: {
        width: "100%",
        background: ((_UNIT_STATUTS4 = UNIT_STATUTS[o.unitStatus || "en_cours"]) === null || _UNIT_STATUTS4 === void 0 ? void 0 : _UNIT_STATUTS4.color) + "18",
        color: (_UNIT_STATUTS5 = UNIT_STATUTS[o.unitStatus || "en_cours"]) === null || _UNIT_STATUTS5 === void 0 ? void 0 : _UNIT_STATUTS5.color,
        border: "1px solid ".concat((_UNIT_STATUTS6 = UNIT_STATUTS[o.unitStatus || "en_cours"]) === null || _UNIT_STATUTS6 === void 0 ? void 0 : _UNIT_STATUTS6.color),
        borderRadius: 4,
        padding: "3px 5px",
        fontSize: 12
      }
    }, Object.entries(UNIT_STATUTS).map(function (_ref135) {
      var _ref136 = _slicedToArray(_ref135, 2),
        value = _ref136[0],
        s = _ref136[1];
      return /*#__PURE__*/React.createElement("option", {
        key: value,
        value: value
      }, s.label);
    })) : "—"), /*#__PURE__*/React.createElement(TD, {
      center: true,
      onClick: function onClick(e) {
        return e.stopPropagation();
      }
    }, function () {
      try {
        var nei = nextEtuvageForRow(o);
        if (!nei.count) return /*#__PURE__*/React.createElement("span", {
          style: {
            color: C.muted,
            fontSize: 10
          }
        }, "\u2014");
        return /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: "monospace",
            fontSize: 10,
            color: nei.overdue ? C.red : C.blue,
            fontWeight: nei.overdue ? 700 : 400
          }
        }, nei.overdue ? "🔴 " : "🕐 ", nei.label);
      } catch (e) {
        return /*#__PURE__*/React.createElement("span", {
          style: {
            color: C.muted,
            fontSize: 10
          }
        }, "\u2014");
      }
    }()), /*#__PURE__*/React.createElement(TD, {
      style: {
        minWidth: 330,
        maxWidth: 420
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4,
        alignItems: "center",
        flexWrap: "nowrap",
        overflowX: "auto",
        padding: "1px 0"
      }
    }, facts.map(function (fact) {
      var label = [fact.type, fact.numero].filter(Boolean).join(" ") || "Fait";
      var closed = !!fact.closedDate;
      var detail = [label, fact.commentaires, closed ? "Cl\xF4tur\xE9 ".concat(fact.closedDate) : "Ouvert"].filter(Boolean).join(" — ");
      return /*#__PURE__*/React.createElement("span", {
        key: fact.id || detail,
        title: detail,
        style: {
          display: "inline-block",
          padding: "2px 5px",
          borderRadius: 3,
          whiteSpace: "nowrap",
          fontSize: 10,
          fontWeight: 700,
          flexShrink: 0,
          border: "1px solid ".concat(closed ? C.green : C.yellow),
          background: (closed ? C.green : C.yellow) + "14",
          color: closed ? C.green : C.yellow
        }
      }, label);
    }), polymerization && /*#__PURE__*/React.createElement("span", {
      title: "Sous vide d\xE8s le ".concat(formatAvailabilityDT(polymerization.readyAt)),
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      label: "POLY ".concat(formatAvailabilityDT(polymerization.readyAt)),
      color: C.yellow
    })), openOWById[o.id] > 0 && /*#__PURE__*/React.createElement("span", {
      title: "".concat(openOWById[o.id], " Open Work non cl\xF4tur\xE9(s)"),
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      label: "OW",
      color: C.yellow
    })), !!((_warningsById$o$id4 = warningsById[o.id]) !== null && _warningsById$o$id4 !== void 0 && _warningsById$o$id4.length) && /*#__PURE__*/React.createElement("span", {
      role: "img",
      "aria-label": "OF \xE0 surveiller",
      title: warningsById[o.id].join("\n"),
      style: {
        color: C.yellow,
        fontSize: 18,
        fontWeight: 900,
        flexShrink: 0
      }
    }, "\u26A0"), !facts.length && !polymerization && !openOWById[o.id] && !((_warningsById$o$id5 = warningsById[o.id]) !== null && _warningsById$o$id5 !== void 0 && _warningsById$o$id5.length) && /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted
      }
    }, "\u2014"))), /*#__PURE__*/React.createElement(TD, {
      center: true
    }, /*#__PURE__*/React.createElement("button", {
      title: "Copier N\xB0 article, description et SN dans le presse-papier",
      "aria-label": "Copier les informations de l'OF ".concat(o.of, " - ").concat(homeUnitName(o), " dans le presse-papier"),
      onClick: function onClick(e) {
        e.stopPropagation();
        var key = homeRowKey(o);
        copyToClipboard(buildTeamsOfText(o, [o]));
        setCopiedTeamsKey(key);
        setTimeout(function () {
          return setCopiedTeamsKey(function (current) {
            return current === key ? "" : current;
          });
        }, 1800);
      },
      style: {
        background: copiedTeamsKey === homeRowKey(o) ? C.green : C.blue,
        border: "none",
        borderRadius: 4,
        color: "#fff",
        padding: "4px 7px",
        cursor: "pointer",
        marginRight: 6,
        fontWeight: 800
      }
    }, copiedTeamsKey === homeRowKey(o) ? "✓" : "📋"), isAdminManager(user) && /*#__PURE__*/React.createElement("button", {
      title: "Supprimer cet OF",
      "aria-label": "Supprimer l'OF ".concat(o.of),
      onClick: function onClick(e) {
        e.stopPropagation();
        onDelete(o.id);
      },
      style: {
        background: C.red,
        border: "none",
        borderRadius: 4,
        color: "#fff",
        padding: "4px 8px",
        cursor: "pointer",
        marginRight: 6
      }
    }, "\xD7"), /*#__PURE__*/React.createElement("button", {
      "aria-label": "Ouvrir OF ".concat(o.of, " - ").concat(homeUnitName(o)),
      title: "Ouvrir le dossier",
      onClick: function onClick(e) {
        e.stopPropagation();
        onSelect(o.id, o._homeUnitId);
      },
      style: {
        background: C.accent,
        border: "none",
        borderRadius: 4,
        color: "#fff",
        padding: "4px 10px",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 700
      }
    }, "\u2192")));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 14,
      color: C.muted,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, filtered.length, " ligne(s)"), /*#__PURE__*/React.createElement("label", null, "Lignes par page ", /*#__PURE__*/React.createElement("select", {
    value: pageSize,
    onChange: function onChange(e) {
      setPageSize(Number(e.target.value));
      setPage(0);
    },
    style: {
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.border),
      borderRadius: 4,
      padding: 4
    }
  }, [25, 50, 100].map(function (n) {
    return /*#__PURE__*/React.createElement("option", {
      key: n,
      value: n
    }, n);
  })))), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      justifyContent: "center",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setPage(Math.max(0, currentPage - 1));
    },
    disabled: currentPage === 0,
    small: true,
    color: C.border
  }, "\u2039 Pr\xE9c."), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontSize: 12,
      fontFamily: "monospace"
    }
  }, currentPage + 1, " / ", totalPages), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setPage(Math.min(totalPages - 1, currentPage + 1));
    },
    disabled: currentPage === totalPages - 1,
    small: true,
    color: C.border
  }, "Suiv. \u203A")), showProfile && /*#__PURE__*/React.createElement(ProfileModal, {
    user: user,
    onClose: function onClose() {
      return setShowProfile(false);
    },
    onSave: function onSave(v) {
      onSaveProfile && onSaveProfile(v);
      setShowProfile(false);
    }
  }), showBulkPdf && isAdminManager(user) && /*#__PURE__*/React.createElement(BulkPdfOptionsModal, {
    rows: selectedRows,
    onCancel: function onCancel() {
      return setShowBulkPdf(false);
    },
    onConfirm: exportBulkPdf
  }), homeMailKind && isAdminManager(user) && /*#__PURE__*/React.createElement(HomeMailModal, {
    kind: homeMailKind,
    rows: selectedRows,
    user: user,
    onClose: function onClose() {
      return setHomeMailKind(null);
    },
    onMarkForClosure: function onMarkForClosure(rows) {
      return Promise.all(rows.filter(function (row) {
        return row._homeUnitId;
      }).map(function (row) {
        return onUnitStatusChange(row.id, row._homeUnitId, "a_cloturer");
      }));
    }
  }));
};

// ─── APP ───────────────────────────────────────────────────────────────────
var TABS = [{
  id: "rework",
  label: "Adjust/Rework",
  "short": "RWK"
}, {
  id: "consommables",
  label: "Consommables",
  "short": "CSO"
}, {
  id: "etuvage",
  label: "Étuvages",
  "short": "ETV"
}, {
  id: "testequip",
  label: "Test Équipement",
  "short": "TST"
}, {
  id: "demating",
  label: "Mating",
  "short": "MTG"
}, {
  id: "faits",
  label: "Faits",
  "short": "FAITS"
}, {
  id: "openwork",
  label: "Open Work",
  "short": "OW"
}];
function App() {
  var _ofData$units8, _ofData$etuvage2, _ofData$testequip3;
  var _useState281 = useState(0),
    _useState282 = _slicedToArray(_useState281, 2),
    setThemeRevision = _useState282[1];
  useEffect(function () {
    var refresh = function refresh() {
      return setThemeRevision(function (n) {
        return n + 1;
      });
    };
    window.addEventListener("sp-f001-theme-change", refresh);
    return function () {
      return window.removeEventListener("sp-f001-theme-change", refresh);
    };
  }, []);
  var _useState283 = useState(null),
    _useState284 = _slicedToArray(_useState283, 2),
    user = _useState284[0],
    setUser = _useState284[1];
  var homeSaveQueue = React.useRef(Promise.resolve());
  var _useState285 = useState([]),
    _useState286 = _slicedToArray(_useState285, 2),
    ofList = _useState286[0],
    setOfList = _useState286[1];
  var _useState287 = useState(null),
    _useState288 = _slicedToArray(_useState287, 2),
    currentId = _useState288[0],
    setCurrentId = _useState288[1];
  var _useState289 = useState(DEFAULT_CONSOMMABLES),
    _useState290 = _slicedToArray(_useState289, 2),
    consommables = _useState290[0],
    setConsommables = _useState290[1];
  var _useState291 = useState(false),
    _useState292 = _slicedToArray(_useState291, 2),
    showConsoEditor = _useState292[0],
    setShowConsoEditor = _useState292[1];
  var catalogRead = React.useRef(null);
  var catalogEditBase = React.useRef(null);
  var readConsommables = useCallback(function () {
    if (!catalogRead.current) {
      catalogRead.current = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
        var record, list, _t45;
        return _regenerator().w(function (_context34) {
          while (1) switch (_context34.p = _context34.n) {
            case 0:
              _context34.p = 0;
              _context34.n = 1;
              return window.storage.get("consommables-list", true);
            case 1:
              record = _context34.v;
              if (record) {
                _context34.n = 2;
                break;
              }
              return _context34.a(2, null);
            case 2:
              list = JSON.parse(record.value);
              if (Array.isArray(list)) {
                _context34.n = 3;
                break;
              }
              throw new Error("Catalogue consommables invalide");
            case 3:
              return _context34.a(2, list);
            case 4:
              _context34.p = 4;
              _t45 = _context34.v;
              if (!/not.?found/i.test(_t45.message || "")) {
                _context34.n = 5;
                break;
              }
              return _context34.a(2, null);
            case 5:
              throw _t45;
            case 6:
              return _context34.a(2);
          }
        }, _callee34, null, [[0, 4]]);
      }))()["finally"](function () {
        catalogRead.current = null;
      });
    }
    return catalogRead.current;
  }, []);
  var _useState293 = useState(DEFAULT_FAIT_TYPES),
    _useState294 = _slicedToArray(_useState293, 2),
    faitTypes = _useState294[0],
    setFaitTypes = _useState294[1];
  var _useState295 = useState(false),
    _useState296 = _slicedToArray(_useState295, 2),
    showFaitTypes = _useState296[0],
    setShowFaitTypes = _useState296[1];
  var _useState297 = useState(function () {
      return normalizeStatusTypes(DEFAULT_STATUS_TYPES);
    }),
    _useState298 = _slicedToArray(_useState297, 2),
    statusTypes = _useState298[0],
    setStatusTypes = _useState298[1];
  var _useState299 = useState(false),
    _useState300 = _slicedToArray(_useState299, 2),
    showStatusTypes = _useState300[0],
    setShowStatusTypes = _useState300[1];
  var _useState301 = useState(null),
    _useState302 = _slicedToArray(_useState301, 2),
    ofData = _useState302[0],
    setOfData = _useState302[1];
  var _useState303 = useState("rework"),
    _useState304 = _slicedToArray(_useState303, 2),
    activeTab = _useState304[0],
    setActiveTab = _useState304[1];
  var _useState305 = useState(false),
    _useState306 = _slicedToArray(_useState305, 2),
    saving = _useState306[0],
    setSaving = _useState306[1];
  var _useState307 = useState(false),
    _useState308 = _slicedToArray(_useState307, 2),
    godMode = _useState308[0],
    setGodMode = _useState308[1];
  var _useState309 = useState(null),
    _useState310 = _slicedToArray(_useState309, 2),
    lastSaved = _useState310[0],
    setLastSaved = _useState310[1];
  var _useState311 = useState(""),
    _useState312 = _slicedToArray(_useState311, 2),
    saveError = _useState312[0],
    setSaveError = _useState312[1];
  var _useState313 = useState(null),
    _useState314 = _slicedToArray(_useState313, 2),
    pendingSave = _useState314[0],
    setPendingSave = _useState314[1];
  var _useState315 = useState(false),
    _useState316 = _slicedToArray(_useState315, 2),
    loaded = _useState316[0],
    setLoaded = _useState316[1];
  var _useState317 = useState([]),
    _useState318 = _slicedToArray(_useState317, 2),
    openHistory = _useState318[0],
    setOpenHistory = _useState318[1]; // IDs des OF récemment ouverts
  var _useState319 = useState(false),
    _useState320 = _slicedToArray(_useState319, 2),
    showAdminUsers = _useState320[0],
    setShowAdminUsers = _useState320[1];
  var _useState321 = useState(null),
    _useState322 = _slicedToArray(_useState321, 2),
    copyAcrossRow = _useState322[0],
    setCopyAcrossRow = _useState322[1];
  var _useState323 = useState(false),
    _useState324 = _slicedToArray(_useState323, 2),
    copiedOfInfo = _useState324[0],
    setCopiedOfInfo = _useState324[1];
  var _useState325 = useState(false),
    _useState326 = _slicedToArray(_useState325, 2),
    printAll = _useState326[0],
    setPrintAll = _useState326[1];
  var _useState327 = useState(false),
    _useState328 = _slicedToArray(_useState327, 2),
    pdfIncludeHistory = _useState328[0],
    setPdfIncludeHistory = _useState328[1];
  var _useState329 = useState(false),
    _useState330 = _slicedToArray(_useState329, 2),
    showPdfOptions = _useState330[0],
    setShowPdfOptions = _useState330[1];
  var _useState331 = useState("all"),
    _useState332 = _slicedToArray(_useState331, 2),
    activeUnitId = _useState332[0],
    setActiveUnitId = _useState332[1];
  var _useState333 = useState(""),
    _useState334 = _slicedToArray(_useState333, 2),
    entryUnitId = _useState334[0],
    setEntryUnitId = _useState334[1];
  var _useState335 = useState("dossier"),
    _useState336 = _slicedToArray(_useState335, 2),
    headerPanel = _useState336[0],
    setHeaderPanel = _useState336[1];
  var perms = {
    godMode: godMode && isAdminManager(user),
    role: normalizeRole(user),
    canWrite: canWriteData(user),
    canManageUsers: canManageUsers(user),
    canManageLists: canManageLists(user),
    canControlRework: canControlRework(user),
    canTraceability: canTraceability(user),
    canComment: canComment(user)
  };
  useEffect(function () {
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
      var authenticated, account, _window$authApi, s, lastActivity, session, _account, list, r, _r, _list, _r2, _t46, _t47, _t48, _t49, _t50, _t51, _t52;
      return _regenerator().w(function (_context35) {
        while (1) switch (_context35.p = _context35.n) {
          case 0:
            authenticated = false;
            if (!window.authApi) {
              _context35.n = 4;
              break;
            }
            _context35.p = 1;
            _context35.n = 2;
            return window.authApi.session();
          case 2:
            account = _context35.v;
            setUser(account);
            authenticated = true;
            _context35.n = 4;
            break;
          case 3:
            _context35.p = 3;
            _t46 = _context35.v;
            if ((_window$authApi = window.authApi) !== null && _window$authApi !== void 0 && _window$authApi.unsupported) window.authApi = null;
          case 4:
            if (window.authApi) {
              _context35.n = 14;
              break;
            }
            _context35.p = 5;
            _context35.n = 6;
            return ensureDefaultAdmin();
          case 6:
            _context35.n = 8;
            break;
          case 7:
            _context35.p = 7;
            _t47 = _context35.v;
          case 8:
            _context35.p = 8;
            _context35.n = 9;
            return window.storage.get("session", false);
          case 9:
            s = _context35.v;
            lastActivity = Number(localStorage.getItem("sp-f001-last-activity"));
            if (!(s && lastActivity && Date.now() - lastActivity < 15 * 60 * 1000)) {
              _context35.n = 11;
              break;
            }
            session = JSON.parse(s.value);
            _context35.n = 10;
            return window.storage.get("user:".concat(session.trigram), true);
          case 10:
            _account = _context35.v;
            setUser(_account ? _objectSpread(_objectSpread(_objectSpread({}, session), JSON.parse(_account.value)), {}, {
              pwd: undefined
            }) : session);
            authenticated = true;
            _context35.n = 12;
            break;
          case 11:
            if (!s) {
              _context35.n = 12;
              break;
            }
            _context35.n = 12;
            return window.storage["delete"]("session", false);
          case 12:
            _context35.n = 14;
            break;
          case 13:
            _context35.p = 13;
            _t48 = _context35.v;
          case 14:
            if (!authenticated) {
              _context35.n = 27;
              break;
            }
            _context35.p = 15;
            _context35.n = 16;
            return readConsommables();
          case 16:
            list = _context35.v;
            if (list) setConsommables(list);
            _context35.n = 18;
            break;
          case 17:
            _context35.p = 17;
            _t49 = _context35.v;
          case 18:
            _context35.p = 18;
            _context35.n = 19;
            return window.storage.get("fait-types", true);
          case 19:
            r = _context35.v;
            if (r) setFaitTypes(JSON.parse(r.value));
            _context35.n = 21;
            break;
          case 20:
            _context35.p = 20;
            _t50 = _context35.v;
          case 21:
            _context35.p = 21;
            _context35.n = 22;
            return window.storage.get("status-types", true);
          case 22:
            _r = _context35.v;
            if (_r) {
              _list = applyStatusTypes(JSON.parse(_r.value));
              setStatusTypes(_list);
            }
            _context35.n = 24;
            break;
          case 23:
            _context35.p = 23;
            _t51 = _context35.v;
          case 24:
            _context35.p = 24;
            _context35.n = 25;
            return window.storage.get("of-list", true);
          case 25:
            _r2 = _context35.v;
            if (_r2) setOfList(JSON.parse(_r2.value));
            _context35.n = 27;
            break;
          case 26:
            _context35.p = 26;
            _t52 = _context35.v;
          case 27:
            setLoaded(true);
          case 28:
            return _context35.a(2);
        }
      }, _callee35, null, [[24, 26], [21, 23], [18, 20], [15, 17], [8, 13], [5, 7], [1, 3]]);
    }))();
  }, []);
  var handleLogin = /*#__PURE__*/function () {
    var _handleLogin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(u) {
      var r, stored, list, _r3, _r4, _list2, _r5, _t53, _t54, _t55, _t56, _t57, _t58;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.p = _context36.n) {
          case 0:
            if (window.authApi) {
              _context36.n = 4;
              break;
            }
            _context36.p = 1;
            _context36.n = 2;
            return window.storage.get("user:".concat(u.trigram), true);
          case 2:
            r = _context36.v;
            if (r) {
              stored = JSON.parse(r.value);
              u = _objectSpread(_objectSpread(_objectSpread({}, u), stored), {}, {
                pwd: undefined
              });
            }
            _context36.n = 4;
            break;
          case 3:
            _context36.p = 3;
            _t53 = _context36.v;
          case 4:
            localStorage.setItem("sp-f001-last-activity", String(Date.now()));
            setUser(u);
            _context36.p = 5;
            _context36.n = 6;
            return window.storage.set("session", JSON.stringify(u), false);
          case 6:
            _context36.n = 8;
            break;
          case 7:
            _context36.p = 7;
            _t54 = _context36.v;
          case 8:
            _context36.p = 8;
            _context36.n = 9;
            return readConsommables();
          case 9:
            list = _context36.v;
            if (list) setConsommables(list);
            _context36.n = 11;
            break;
          case 10:
            _context36.p = 10;
            _t55 = _context36.v;
          case 11:
            _context36.p = 11;
            _context36.n = 12;
            return window.storage.get("fait-types", true);
          case 12:
            _r3 = _context36.v;
            if (_r3) setFaitTypes(JSON.parse(_r3.value));
            _context36.n = 14;
            break;
          case 13:
            _context36.p = 13;
            _t56 = _context36.v;
          case 14:
            _context36.p = 14;
            _context36.n = 15;
            return window.storage.get("status-types", true);
          case 15:
            _r4 = _context36.v;
            if (_r4) {
              _list2 = applyStatusTypes(JSON.parse(_r4.value));
              setStatusTypes(_list2);
            }
            _context36.n = 17;
            break;
          case 16:
            _context36.p = 16;
            _t57 = _context36.v;
          case 17:
            _context36.p = 17;
            _context36.n = 18;
            return window.storage.get("of-list", true);
          case 18:
            _r5 = _context36.v;
            if (_r5) setOfList(JSON.parse(_r5.value));
            _context36.n = 20;
            break;
          case 19:
            _context36.p = 19;
            _t58 = _context36.v;
          case 20:
            return _context36.a(2);
        }
      }, _callee36, null, [[17, 19], [14, 16], [11, 13], [8, 10], [5, 7], [1, 3]]);
    }));
    function handleLogin(_x12) {
      return _handleLogin.apply(this, arguments);
    }
    return handleLogin;
  }();
  var handleSaveProfile = /*#__PURE__*/function () {
    var _handleSaveProfile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(profile) {
      var updated, key, r, stored, _t59, _t60;
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.p = _context37.n) {
          case 0:
            if (!window.authApi) {
              _context37.n = 6;
              break;
            }
            _context37.p = 1;
            _context37.n = 2;
            return window.authApi.saveProfile(profile);
          case 2:
            updated = _context37.v;
            setUser(updated);
            _context37.n = 3;
            return window.storage.set("session", JSON.stringify(updated), false);
          case 3:
            _context37.n = 5;
            break;
          case 4:
            _context37.p = 4;
            _t59 = _context37.v;
            window.alert((_t59 === null || _t59 === void 0 ? void 0 : _t59.message) || "Profil non enregistré");
          case 5:
            return _context37.a(2);
          case 6:
            setUser(function (prev) {
              return _objectSpread(_objectSpread({}, prev), profile);
            });
            _context37.p = 7;
            key = "user:".concat(profile.trigram || profile.trigram);
            _context37.n = 8;
            return window.storage.get(key, true);
          case 8:
            r = _context37.v;
            stored = r ? JSON.parse(r.value) : {
              trigram: user.trigram,
              pwd: ""
            };
            _context37.n = 9;
            return window.storage.set(key, JSON.stringify(_objectSpread(_objectSpread(_objectSpread({}, stored), profile), {}, {
              pwd: stored.pwd
            })), true);
          case 9:
            _context37.n = 10;
            return window.storage.set("session", JSON.stringify(_objectSpread(_objectSpread({}, user), profile)), false);
          case 10:
            _context37.n = 12;
            break;
          case 11:
            _context37.p = 11;
            _t60 = _context37.v;
          case 12:
            return _context37.a(2);
        }
      }, _callee37, null, [[7, 11], [1, 4]]);
    }));
    function handleSaveProfile(_x13) {
      return _handleSaveProfile.apply(this, arguments);
    }
    return handleSaveProfile;
  }();
  var _useState337 = useState(false),
    _useState338 = _slicedToArray(_useState337, 2),
    showProfile = _useState338[0],
    setShowProfile = _useState338[1];
  var handleLogout = /*#__PURE__*/function () {
    var _handleLogout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38() {
      var _t61, _t62;
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.p = _context38.n) {
          case 0:
            if (!window.authApi) {
              _context38.n = 4;
              break;
            }
            _context38.p = 1;
            _context38.n = 2;
            return window.authApi.logout();
          case 2:
            _context38.n = 4;
            break;
          case 3:
            _context38.p = 3;
            _t61 = _context38.v;
          case 4:
            setGodMode(false);
            setShowProfile(false);
            setShowAdminUsers(false);
            setShowConsoEditor(false);
            setShowFaitTypes(false);
            setShowStatusTypes(false);
            setShowPdfOptions(false);
            setUser(null);
            setCurrentId(null);
            setOfData(null);
            setActiveUnitId("all");
            setCopyAcrossRow(null);
            localStorage.removeItem("sp-f001-last-activity");
            _context38.p = 5;
            _context38.n = 6;
            return window.storage["delete"]("session", false);
          case 6:
            _context38.n = 8;
            break;
          case 7:
            _context38.p = 7;
            _t62 = _context38.v;
          case 8:
            return _context38.a(2);
        }
      }, _callee38, null, [[5, 7], [1, 3]]);
    }));
    function handleLogout() {
      return _handleLogout.apply(this, arguments);
    }
    return handleLogout;
  }();
  useEffect(function () {
    var expired = function expired() {
      return handleLogout();
    };
    window.addEventListener("sp-f001-session-expired", expired);
    return function () {
      return window.removeEventListener("sp-f001-session-expired", expired);
    };
  }, []);
  useEffect(function () {
    if (!user) return;
    var timeout = 15 * 60 * 1000;
    var lastActivity = Number(localStorage.getItem("sp-f001-last-activity")) || Date.now();
    var expired = false;
    var check = function check() {
      if (expired) return true;
      if (Date.now() - lastActivity >= timeout) {
        expired = true;
        handleLogout();
        return true;
      }
      return false;
    };
    var activity = function activity() {
      if (check()) return;
      var now = Date.now();
      if (now - lastActivity >= 1000) {
        lastActivity = now;
        localStorage.setItem("sp-f001-last-activity", String(now));
      }
    };
    var events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"];
    events.forEach(function (name) {
      return window.addEventListener(name, activity, {
        passive: true
      });
    });
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    var timer = window.setInterval(check, 1000);
    return function () {
      window.clearInterval(timer);
      events.forEach(function (name) {
        return window.removeEventListener(name, activity);
      });
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [user === null || user === void 0 ? void 0 : user.trigram]);
  var selectOf = /*#__PURE__*/function () {
    var _selectOf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(id) {
      var selectedUnitId,
        selectedTab,
        r,
        _safe$units,
        _safe$units2,
        _available$find,
        _available$,
        parsed,
        safe,
        available,
        _args39 = arguments,
        _t63;
      return _regenerator().w(function (_context39) {
        while (1) switch (_context39.p = _context39.n) {
          case 0:
            selectedUnitId = _args39.length > 1 && _args39[1] !== undefined ? _args39[1] : null;
            selectedTab = _args39.length > 2 && _args39[2] !== undefined ? _args39[2] : "rework";
            _context39.p = 1;
            _context39.n = 2;
            return window.storage.get("of:".concat(id), true);
          case 2:
            r = _context39.v;
            if (r) {
              parsed = JSON.parse(r.value); // Ensure all required keys exist
              safe = _objectSpread({
                header: {},
                units: {},
                rework: {},
                consommables: {},
                testequip: {},
                faits: {},
                etuvage: {},
                demating: {},
                openwork: {}
              }, parsed);
              if (!Array.isArray((_safe$units = safe.units) === null || _safe$units === void 0 ? void 0 : _safe$units.rows)) safe.units = unitsFromHeader(safe.header, (user === null || user === void 0 ? void 0 : user.trigram) || "");
              safe = withUnitMetadata(safe);
              setSaveError("");
              setPendingSave(null);
              setOfData(safe);
              setCurrentId(id);
              setActiveTab(selectedTab);
              setEntryUnitId("");
              available = (((_safe$units2 = safe.units) === null || _safe$units2 === void 0 ? void 0 : _safe$units2.rows) || []).filter(function (u) {
                return !u.deleted && hasUnitIdentity(u);
              });
              setActiveUnitId(((_available$find = available.find(function (u) {
                return u.id === selectedUnitId;
              })) === null || _available$find === void 0 ? void 0 : _available$find.id) || ((_available$ = available[0]) === null || _available$ === void 0 ? void 0 : _available$.id) || "all");
              setOpenHistory(function (prev) {
                return [id].concat(_toConsumableArray(prev.filter(function (x) {
                  return x !== id;
                }))).slice(0, 20);
              });
            }
            _context39.n = 4;
            break;
          case 3:
            _context39.p = 3;
            _t63 = _context39.v;
            console.error("selectOf error", _t63);
          case 4:
            return _context39.a(2);
        }
      }, _callee39, null, [[1, 3]]);
    }));
    function selectOf(_x14) {
      return _selectOf.apply(this, arguments);
    }
    return selectOf;
  }();
  var createOf = /*#__PURE__*/function () {
    var _createOf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(header) {
      var id, entry, newList, initialUnits, newData, _initialUnits$rows, _t64;
      return _regenerator().w(function (_context40) {
        while (1) switch (_context40.p = _context40.n) {
          case 0:
            if (isAdminManager(user)) {
              _context40.n = 1;
              break;
            }
            return _context40.a(2);
          case 1:
            id = uid();
            entry = _objectSpread(_objectSpread({
              id: id
            }, header), {}, {
              typeOF: header.typeOF || "production",
              status: header.status || "en_cours",
              lastEtuvageDT: null
            });
            newList = [].concat(_toConsumableArray(ofList), [entry]);
            initialUnits = unitsFromHeader(entry, (user === null || user === void 0 ? void 0 : user.trigram) || entry.createdBy || "");
            newData = {
              header: entry,
              units: initialUnits,
              rework: {},
              flux: {},
              colles: {},
              testequip: {},
              dm: {},
              ncr: {},
              etuvage: {},
              demating: {},
              openwork: {}
            };
            _context40.p = 2;
            _context40.n = 3;
            return window.storage.set("of-list", JSON.stringify(newList), true);
          case 3:
            _context40.n = 4;
            return window.storage.set("of:".concat(id), JSON.stringify(newData), true);
          case 4:
            setOfList(newList);
            setOfData(newData);
            setCurrentId(id);
            setActiveTab("rework");
            setActiveUnitId(((_initialUnits$rows = initialUnits.rows) === null || _initialUnits$rows === void 0 || (_initialUnits$rows = _initialUnits$rows.find(function (u) {
              return !u.deleted && hasUnitIdentity(u);
            })) === null || _initialUnits$rows === void 0 ? void 0 : _initialUnits$rows.id) || "all");
            setOpenHistory(function (prev) {
              return [id].concat(_toConsumableArray(prev)).slice(0, 20);
            });
            _context40.n = 6;
            break;
          case 5:
            _context40.p = 5;
            _t64 = _context40.v;
            console.error(_t64);
          case 6:
            return _context40.a(2);
        }
      }, _callee40, null, [[2, 5]]);
    }));
    function createOf(_x15) {
      return _createOf.apply(this, arguments);
    }
    return createOf;
  }();
  var deleteOf = /*#__PURE__*/function () {
    var _deleteOf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41(id) {
      var entry, record, data, archived, next, _t65;
      return _regenerator().w(function (_context41) {
        while (1) switch (_context41.p = _context41.n) {
          case 0:
            if (isAdminManager(user)) {
              _context41.n = 1;
              break;
            }
            return _context41.a(2);
          case 1:
            entry = ofList.find(function (o) {
              return o.id === id;
            });
            if (!(!entry || !window.confirm("Supprimer l'OF ".concat(entry.of, " et le retirer de la liste des dossiers ?")))) {
              _context41.n = 2;
              break;
            }
            return _context41.a(2);
          case 2:
            _context41.p = 2;
            _context41.n = 3;
            return window.storage.get("of:".concat(id), true);
          case 3:
            record = _context41.v;
            data = record ? JSON.parse(record.value) : {
              header: entry
            };
            archived = _objectSpread(_objectSpread({}, data), {}, {
              header: _objectSpread(_objectSpread({}, data.header), {}, {
                deleted: true,
                deletedVisa: user.trigram,
                deletedDT: nowDT()
              })
            });
            _context41.n = 4;
            return window.storage.set("of:".concat(id), JSON.stringify(archived), true);
          case 4:
            next = ofList.filter(function (o) {
              return o.id !== id;
            });
            _context41.n = 5;
            return window.storage.set("of-list", JSON.stringify(next), true);
          case 5:
            setOfList(next);
            setOpenHistory(function (prev) {
              return prev.filter(function (x) {
                return x !== id;
              });
            });
            if (currentId === id) {
              setCurrentId(null);
              setOfData(null);
            }
            _context41.n = 7;
            break;
          case 6:
            _context41.p = 6;
            _t65 = _context41.v;
            window.alert("Suppression impossible : ".concat((_t65 === null || _t65 === void 0 ? void 0 : _t65.message) || _t65));
          case 7:
            return _context41.a(2);
        }
      }, _callee41, null, [[2, 6]]);
    }));
    function deleteOf(_x16) {
      return _deleteOf.apply(this, arguments);
    }
    return deleteOf;
  }();
  var persistHomeData = /*#__PURE__*/function () {
    var _persistHomeData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42(id, data) {
      var normalized, stored, list, nextList;
      return _regenerator().w(function (_context42) {
        while (1) switch (_context42.n) {
          case 0:
            normalized = withUnitMetadata(data);
            _context42.n = 1;
            return window.storage.set("of:".concat(id), JSON.stringify(normalized), true);
          case 1:
            _context42.n = 2;
            return window.storage.get("of-list", true);
          case 2:
            stored = _context42.v;
            list = stored ? JSON.parse(stored.value) : ofList;
            nextList = list.map(function (o) {
              return o.id === id ? _objectSpread(_objectSpread({}, o), normalized.header) : o;
            });
            _context42.n = 3;
            return window.storage.set("of-list", JSON.stringify(nextList), true);
          case 3:
            setOfList(nextList);
          case 4:
            return _context42.a(2);
        }
      }, _callee42);
    }));
    function persistHomeData(_x17, _x18) {
      return _persistHomeData.apply(this, arguments);
    }
    return persistHomeData;
  }();
  var enqueueHomeSave = function enqueueHomeSave(task) {
    var pending = homeSaveQueue.current["catch"](function () {}).then(task);
    homeSaveQueue.current = pending;
    return pending;
  };
  var updateHomeUnit = function updateHomeUnit(id, unitId, fields) {
    return enqueueHomeSave(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43() {
      var r;
      return _regenerator().w(function (_context43) {
        while (1) switch (_context43.n) {
          case 0:
            if (isAdminManager(user)) {
              _context43.n = 1;
              break;
            }
            return _context43.a(2);
          case 1:
            _context43.n = 2;
            return window.storage.get("of:".concat(id), true);
          case 2:
            r = _context43.v;
            if (r) {
              _context43.n = 3;
              break;
            }
            throw new Error("OF introuvable");
          case 3:
            _context43.n = 4;
            return persistHomeData(id, patchTrackedUnit(JSON.parse(r.value), unitId, fields));
          case 4:
            return _context43.a(2);
        }
      }, _callee43);
    })));
  };
  var updateHomeStatus = function updateHomeStatus(id, status) {
    return enqueueHomeSave(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44() {
      var r, data, _t66;
      return _regenerator().w(function (_context44) {
        while (1) switch (_context44.p = _context44.n) {
          case 0:
            if (isAdminManager(user)) {
              _context44.n = 1;
              break;
            }
            return _context44.a(2);
          case 1:
            _context44.p = 1;
            _context44.n = 2;
            return window.storage.get("of:".concat(id), true);
          case 2:
            r = _context44.v;
            if (r) {
              _context44.n = 3;
              break;
            }
            throw new Error("OF introuvable");
          case 3:
            data = JSON.parse(r.value);
            _context44.n = 4;
            return persistHomeData(id, _objectSpread(_objectSpread({}, data), {}, {
              header: _objectSpread(_objectSpread({}, data.header), {}, {
                status: status
              })
            }));
          case 4:
            _context44.n = 6;
            break;
          case 5:
            _context44.p = 5;
            _t66 = _context44.v;
            window.alert("Enregistrement impossible : ".concat((_t66 === null || _t66 === void 0 ? void 0 : _t66.message) || _t66));
          case 6:
            return _context44.a(2);
        }
      }, _callee44, null, [[1, 5]]);
    })));
  };
  var importOFs = /*#__PURE__*/function () {
    var _importOFs = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45(groups) {
      var valid, nextList, created, updated, addedItems, duplicates, stamp, stampDT, makeUnitRow, baseHeader, fillMissing, rowKey, _iterator7, _step7, _loop2, parts, _t68;
      return _regenerator().w(function (_context46) {
        while (1) switch (_context46.p = _context46.n) {
          case 0:
            if (isAdminManager(user)) {
              _context46.n = 1;
              break;
            }
            return _context46.a(2, "Accès refusé.");
          case 1:
            valid = (groups || []).filter(function (g) {
              return String((g === null || g === void 0 ? void 0 : g.of) || "").trim();
            });
            if (valid.length) {
              _context46.n = 2;
              break;
            }
            return _context46.a(2, "Aucun OF importable.");
          case 2:
            nextList = _toConsumableArray(ofList);
            created = 0, updated = 0, addedItems = 0, duplicates = 0;
            stamp = now();
            stampDT = nowDT();
            makeUnitRow = function makeUnitRow(item) {
              return {
                id: uid(),
                sn: cleanSn(item === null || item === void 0 ? void 0 : item.sn),
                lot: (item === null || item === void 0 ? void 0 : item.lot) || "",
                qteInitiale: (item === null || item === void 0 ? void 0 : item.qteInitiale) || "",
                unitKind: (item === null || item === void 0 ? void 0 : item.unitKind) || "",
                status: "en_cours",
                snProduitFini: "",
                remarque: "",
                createdVisa: user.trigram,
                createdDT: stampDT,
                deleted: false
              };
            };
            baseHeader = function baseHeader(g) {
              var _g$items;
              return {
                of: String(g.of || "").trim(),
                sn: ((_g$items = g.items) === null || _g$items === void 0 || (_g$items = _g$items[0]) === null || _g$items === void 0 ? void 0 : _g$items.sn) || "",
                snProduitFini: "",
                lot: "",
                codeArticle: cleanImportArticle(g.codeArticle || g.articleNo || ""),
                articleNo: g.articleNo || "",
                description: g.description || g.articleNo || "",
                otp: g.projet || "",
                projet: g.projet || "",
                ofRework: g.ofRework || "non",
                typeOF: g.typeOF || (g.ofRework === "oui" ? "reprise" : "production"),
                status: "en_cours",
                createdBy: user.trigram,
                createdAt: stamp
              };
            };
            fillMissing = function fillMissing(target, source) {
              ["of", "codeArticle", "articleNo", "description", "otp", "projet", "ofRework", "typeOF", "status"].forEach(function (k) {
                if ((target[k] === undefined || target[k] === null || target[k] === "") && source[k]) target[k] = source[k];
              });
              if (source.ofRework === "oui") {
                target.ofRework = "oui";
                target.typeOF = "reprise";
              }
              return target;
            };
            rowKey = function rowKey(r) {
              return "".concat(r.unitKind || "", "|").concat(cleanSn(r.sn), "|").concat(cleanSn(r.lot));
            };
            _iterator7 = _createForOfIteratorHelper(valid);
            _context46.p = 3;
            _loop2 = /*#__PURE__*/_regenerator().m(function _loop2() {
              var group, headerBase, existing, _data$units8, _activeRows$, data, r, units, rows, liveRows, addedHere, activeRows, header, updatedData, _snRows3$, id, _snRows3, entry, newData, _t67;
              return _regenerator().w(function (_context45) {
                while (1) switch (_context45.p = _context45.n) {
                  case 0:
                    group = _step7.value;
                    headerBase = baseHeader(group);
                    existing = nextList.find(function (o) {
                      return String(o.of || "").trim().toUpperCase() === headerBase.of.toUpperCase();
                    });
                    if (!existing) {
                      _context45.n = 6;
                      break;
                    }
                    data = null;
                    _context45.p = 1;
                    _context45.n = 2;
                    return window.storage.get("of:".concat(existing.id), true);
                  case 2:
                    r = _context45.v;
                    data = r ? JSON.parse(r.value) : null;
                    _context45.n = 4;
                    break;
                  case 3:
                    _context45.p = 3;
                    _t67 = _context45.v;
                  case 4:
                    if (!data) data = {
                      header: _objectSpread({}, existing),
                      units: unitsFromHeader(existing, (user === null || user === void 0 ? void 0 : user.trigram) || existing.createdBy || ""),
                      rework: {},
                      flux: {},
                      colles: {},
                      testequip: {},
                      dm: {},
                      ncr: {},
                      etuvage: {},
                      demating: {},
                      openwork: {}
                    };
                    data = withUnitMetadata(data);
                    units = (((_data$units8 = data.units) === null || _data$units8 === void 0 ? void 0 : _data$units8.rows) || []).length ? data.units : unitsFromHeader(data.header || existing, (user === null || user === void 0 ? void 0 : user.trigram) || existing.createdBy || "");
                    rows = _toConsumableArray(units.rows || []);
                    liveRows = new Set(rows.filter(function (r) {
                      return !r.deleted;
                    }).map(rowKey).filter(Boolean));
                    addedHere = 0;
                    (group.items || []).forEach(function (item) {
                      var row = makeUnitRow(item);
                      if (!hasUnitIdentity(row)) return;
                      var key = rowKey(row);
                      if (liveRows.has(key)) {
                        duplicates++;
                        return;
                      }
                      rows.push(row);
                      liveRows.add(key);
                      addedHere++;
                      addedItems++;
                    });
                    activeRows = rows.filter(function (r) {
                      return !r.deleted;
                    });
                    header = fillMissing(_objectSpread({}, data.header), headerBase);
                    header.sn = header.sn || ((_activeRows$ = activeRows[0]) === null || _activeRows$ === void 0 ? void 0 : _activeRows$.sn) || "";
                    header._snRows = rows;
                    updatedData = _objectSpread(_objectSpread({}, data), {}, {
                      header: header,
                      units: _objectSpread(_objectSpread({}, units), {}, {
                        mode: activeRows.length > 1 ? "multi" : "single",
                        rows: rows
                      })
                    });
                    _context45.n = 5;
                    return window.storage.set("of:".concat(existing.id), JSON.stringify(updatedData), true);
                  case 5:
                    nextList = nextList.map(function (o) {
                      if (o.id !== existing.id) return o;
                      var next = fillMissing(_objectSpread({}, o), headerBase);
                      next.sn = header.sn;
                      next.snProduitFini = header.snProduitFini;
                      next._snRows = rows;
                      return next;
                    });
                    if (addedHere > 0) updated++;
                    _context45.n = 8;
                    break;
                  case 6:
                    id = uid();
                    _snRows3 = (group.items || []).map(function (item) {
                      return makeUnitRow(item);
                    }).filter(hasUnitIdentity);
                    entry = _objectSpread(_objectSpread({
                      id: id
                    }, headerBase), {}, {
                      sn: ((_snRows3$ = _snRows3[0]) === null || _snRows3$ === void 0 ? void 0 : _snRows3$.sn) || "",
                      snProduitFini: "",
                      _snRows: _snRows3,
                      lastEtuvageDT: null
                    });
                    newData = {
                      header: entry,
                      units: unitsFromHeader(entry, (user === null || user === void 0 ? void 0 : user.trigram) || entry.createdBy || ""),
                      rework: {},
                      flux: {},
                      colles: {},
                      testequip: {},
                      dm: {},
                      ncr: {},
                      etuvage: {},
                      demating: {},
                      openwork: {}
                    };
                    _context45.n = 7;
                    return window.storage.set("of:".concat(id), JSON.stringify(newData), true);
                  case 7:
                    nextList = [].concat(_toConsumableArray(nextList), [entry]);
                    created++;
                    addedItems += _snRows3.length;
                  case 8:
                    return _context45.a(2);
                }
              }, _loop2, null, [[1, 3]]);
            });
            _iterator7.s();
          case 4:
            if ((_step7 = _iterator7.n()).done) {
              _context46.n = 6;
              break;
            }
            return _context46.d(_regeneratorValues(_loop2()), 5);
          case 5:
            _context46.n = 4;
            break;
          case 6:
            _context46.n = 8;
            break;
          case 7:
            _context46.p = 7;
            _t68 = _context46.v;
            _iterator7.e(_t68);
          case 8:
            _context46.p = 8;
            _iterator7.f();
            return _context46.f(8);
          case 9:
            _context46.n = 10;
            return window.storage.set("of-list", JSON.stringify(nextList), true);
          case 10:
            setOfList(nextList);
            parts = ["".concat(created, " OF cr\xE9\xE9").concat(created > 1 ? "s" : "")];
            if (updated) parts.push("".concat(updated, " OF compl\xE9t\xE9").concat(updated > 1 ? "s" : ""));
            parts.push("".concat(addedItems, " ligne").concat(addedItems > 1 ? "s" : "", " SN/LOT ajout\xE9e").concat(addedItems > 1 ? "s" : ""));
            if (duplicates) parts.push("".concat(duplicates, " doublon").concat(duplicates > 1 ? "s" : "", " ignor\xE9").concat(duplicates > 1 ? "s" : ""));
            return _context46.a(2, "Import termin\xE9 : ".concat(parts.join(", "), "."));
        }
      }, _callee45, null, [[3, 7, 8, 9]]);
    }));
    function importOFs(_x19) {
      return _importOFs.apply(this, arguments);
    }
    return importOFs;
  }();
  var save = useCallback(/*#__PURE__*/function () {
    var _ref141 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46(data) {
      var etvRows, lastEtv, _t69;
      return _regenerator().w(function (_context47) {
        while (1) switch (_context47.p = _context47.n) {
          case 0:
            if (currentId) {
              _context47.n = 1;
              break;
            }
            return _context47.a(2);
          case 1:
            data = withUnitMetadata(data);
            setSaving(true);
            _context47.p = 2;
            _context47.n = 3;
            return window.storage.set("of:".concat(currentId), JSON.stringify(data), true);
          case 3:
            setSaveError("");
            setPendingSave(null);
            setLastSaved(new Date().toLocaleTimeString("fr-FR"));
            // Update ofList summary for home screen
            etvRows = effectiveEtuvageRows(data).filter(function (r) {
              return r.entreeDT;
            });
            lastEtv = etvRows.length > 0 ? etvRows.reduce(function (a, b) {
              var sortable = function sortable(s) {
                return s.replace(/^(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
              };
              var pa = sortable(a.entreeDT),
                pb = sortable(b.entreeDT);
              return pb > pa ? b : a;
            }).entreeDT : null;
            setOfList(function (prev) {
              var updated = prev.map(function (o) {
                var _data$header5;
                return o.id === currentId ? _objectSpread(_objectSpread(_objectSpread({}, o), data.header || {}), {}, {
                  lastEtuvageDT: lastEtv,
                  status: ((_data$header5 = data.header) === null || _data$header5 === void 0 ? void 0 : _data$header5.status) || o.status || "en_cours"
                }) : o;
              });
              if (!window.storage.relational) window.storage.set("of-list", JSON.stringify(updated), true)["catch"](function () {});
              return updated;
            });
            _context47.n = 5;
            break;
          case 4:
            _context47.p = 4;
            _t69 = _context47.v;
            setPendingSave(data);
            setSaveError((_t69 === null || _t69 === void 0 ? void 0 : _t69.message) || "La modification n'a pas été enregistrée.");
          case 5:
            setSaving(false);
          case 6:
            return _context47.a(2);
        }
      }, _callee46, null, [[2, 4]]);
    }));
    return function (_x20) {
      return _ref141.apply(this, arguments);
    };
  }(), [currentId]);
  useEffect(function () {
    if (!user || showConsoEditor) return;
    var active = true;
    var refresh = /*#__PURE__*/function () {
      var _refresh = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47() {
        var list, _t70;
        return _regenerator().w(function (_context48) {
          while (1) switch (_context48.p = _context48.n) {
            case 0:
              if (!(document.visibilityState === "hidden")) {
                _context48.n = 1;
                break;
              }
              return _context48.a(2);
            case 1:
              _context48.p = 1;
              _context48.n = 2;
              return readConsommables();
            case 2:
              list = _context48.v;
              if (active && list) setConsommables(function (previous) {
                return catalogFingerprint(previous) === catalogFingerprint(list) ? previous : list;
              });
              _context48.n = 4;
              break;
            case 3:
              _context48.p = 3;
              _t70 = _context48.v;
            case 4:
              return _context48.a(2);
          }
        }, _callee47, null, [[1, 3]]);
      }));
      function refresh() {
        return _refresh.apply(this, arguments);
      }
      return refresh;
    }();
    if (activeTab === "consommables") refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    var timer = window.setInterval(refresh, 30000);
    return function () {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [user === null || user === void 0 ? void 0 : user.trigram, activeTab, showConsoEditor, readConsommables]);
  var openConsommablesEditor = /*#__PURE__*/function () {
    var _openConsommablesEditor = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48() {
      var list, _t71;
      return _regenerator().w(function (_context49) {
        while (1) switch (_context49.p = _context49.n) {
          case 0:
            if (canManageLists(user)) {
              _context49.n = 1;
              break;
            }
            return _context49.a(2);
          case 1:
            _context49.p = 1;
            _context49.n = 2;
            return readConsommables();
          case 2:
            list = _context49.v;
            catalogEditBase.current = catalogFingerprint(list);
            if (list) setConsommables(list);
            setShowConsoEditor(true);
            _context49.n = 4;
            break;
          case 3:
            _context49.p = 3;
            _t71 = _context49.v;
            window.alert("Ouverture de la liste impossible : ".concat(_t71.message || _t71));
          case 4:
            return _context49.a(2);
        }
      }, _callee48, null, [[1, 3]]);
    }));
    function openConsommablesEditor() {
      return _openConsommablesEditor.apply(this, arguments);
    }
    return openConsommablesEditor;
  }();
  var saveConsommables = /*#__PURE__*/function () {
    var _saveConsommables = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49(list) {
      var current, _t72;
      return _regenerator().w(function (_context50) {
        while (1) switch (_context50.p = _context50.n) {
          case 0:
            if (canManageLists(user)) {
              _context50.n = 1;
              break;
            }
            return _context50.a(2);
          case 1:
            _context50.p = 1;
            _context50.n = 2;
            return readConsommables();
          case 2:
            current = _context50.v;
            if (!(catalogFingerprint(current) !== catalogEditBase.current)) {
              _context50.n = 3;
              break;
            }
            throw new Error("La liste a été modifiée par un autre utilisateur. Fermez puis rouvrez la liste avant de refaire vos modifications.");
          case 3:
            _context50.n = 4;
            return window.storage.set("consommables-list", JSON.stringify(list), true);
          case 4:
            setConsommables(list);
            setShowConsoEditor(false);
            _context50.n = 6;
            break;
          case 5:
            _context50.p = 5;
            _t72 = _context50.v;
            window.alert("Liste non enregistr\xE9e : ".concat(_t72.message || _t72));
          case 6:
            return _context50.a(2);
        }
      }, _callee49, null, [[1, 5]]);
    }));
    function saveConsommables(_x21) {
      return _saveConsommables.apply(this, arguments);
    }
    return saveConsommables;
  }();
  var saveFaitTypes = /*#__PURE__*/function () {
    var _saveFaitTypes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50(list) {
      var _t73;
      return _regenerator().w(function (_context51) {
        while (1) switch (_context51.p = _context51.n) {
          case 0:
            if (canManageLists(user)) {
              _context51.n = 1;
              break;
            }
            return _context51.a(2);
          case 1:
            _context51.p = 1;
            _context51.n = 2;
            return window.storage.set("fait-types", JSON.stringify(list), true);
          case 2:
            _context51.n = 4;
            break;
          case 3:
            _context51.p = 3;
            _t73 = _context51.v;
          case 4:
            setFaitTypes(list);
            setShowFaitTypes(false);
          case 5:
            return _context51.a(2);
        }
      }, _callee50, null, [[1, 3]]);
    }));
    function saveFaitTypes(_x22) {
      return _saveFaitTypes.apply(this, arguments);
    }
    return saveFaitTypes;
  }();
  var saveStatusTypes = /*#__PURE__*/function () {
    var _saveStatusTypes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51(list) {
      var clean, _t74;
      return _regenerator().w(function (_context52) {
        while (1) switch (_context52.p = _context52.n) {
          case 0:
            if (canManageLists(user)) {
              _context52.n = 1;
              break;
            }
            return _context52.a(2);
          case 1:
            clean = normalizeStatusTypes(list);
            _context52.p = 2;
            _context52.n = 3;
            return window.storage.set("status-types", JSON.stringify(clean), true);
          case 3:
            applyStatusTypes(clean);
            setStatusTypes(clean);
            setShowStatusTypes(false);
            _context52.n = 5;
            break;
          case 4:
            _context52.p = 4;
            _t74 = _context52.v;
            window.alert("Statuts non enregistr\xE9s : ".concat(_t74.message || _t74));
          case 5:
            return _context52.a(2);
        }
      }, _callee51, null, [[2, 4]]);
    }));
    function saveStatusTypes(_x23) {
      return _saveStatusTypes.apply(this, arguments);
    }
    return saveStatusTypes;
  }();
  var updateTab = function updateTab(tab, tabData) {
    if (!canWriteData(user)) return;
    if (tab === "units" && !isAdminManager(user)) return;
    if (godMode && isAdminManager(user) && tab !== "units") {
      var previous = new Set(_deletedLineIds(ofData[tab]));
      var newlyDeleted = new Set(_deletedLineIds(tabData).filter(function (id) {
        return !previous.has(id);
      }));
      if (newlyDeleted.size) {
        if (!window.confirm("Effacer d\xE9finitivement ".concat(newlyDeleted.size, " ligne(s), avec leurs remarques et historiques ? Cette action est irr\xE9versible."))) return;
        tabData = _purgeDeletedLines(tabData, newlyDeleted);
      }
    }
    var updated = withUnitMetadata(_objectSpread(_objectSpread({}, ofData), {}, _defineProperty({}, tab, tabData)));
    setOfData(updated);
    save(updated);
  };
  var copyReworkAcross = /*#__PURE__*/function () {
    var _copyReworkAcross = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52(requestedRows, targets, includeChecks) {
      var copyMode,
        reuseSample,
        tab,
        collection,
        requested,
        sources,
        copied,
        errors,
        copyCount,
        grouped,
        _iterator8,
        _step8,
        target,
        _iterator9,
        _step9,
        _loop3,
        _args55 = arguments,
        _t77;
      return _regenerator().w(function (_context55) {
        while (1) switch (_context55.p = _context55.n) {
          case 0:
            copyMode = _args55.length > 3 && _args55[3] !== undefined ? _args55[3] : "new";
            reuseSample = _args55.length > 4 && _args55[4] !== undefined ? _args55[4] : false;
            if (canWriteData(user)) {
              _context55.n = 1;
              break;
            }
            throw new Error("Accès en écriture requis");
          case 1:
            if (!saving) {
              _context55.n = 2;
              break;
            }
            throw new Error("Attendez la fin de l'enregistrement en cours");
          case 2:
            tab = copyAcrossRow.tab;
            collection = tab === "consommables" ? "ops" : tab === "demating" ? "connectors" : "rows";
            requested = Array.isArray(requestedRows) ? requestedRows : [requestedRows];
            sources = requested.map(function (selectedRow) {
              var _ofData$tab, _source;
              var source = ofData === null || ofData === void 0 || (_ofData$tab = ofData[tab]) === null || _ofData$tab === void 0 || (_ofData$tab = _ofData$tab[collection]) === null || _ofData$tab === void 0 ? void 0 : _ofData$tab.find(function (r) {
                return r.id === selectedRow.id && !r.deleted;
              });
              if (source && tab === "consommables") source = _objectSpread(_objectSpread({}, source), {}, {
                items: (source.items || []).filter(function (item) {
                  return !item.deleted && selectedRow.items.some(function (selected) {
                    return selected.id === item.id;
                  });
                })
              });
              return tab === "consommables" && !((_source = source) !== null && _source !== void 0 && _source.items.length) ? null : source;
            }).filter(Boolean);
            if (!(!sources.length || sources.length !== requested.length)) {
              _context55.n = 3;
              break;
            }
            throw new Error("Une ou plusieurs lignes source ne sont plus disponibles");
          case 3:
            copied = [], errors = [];
            copyCount = 0;
            grouped = new Map();
            _iterator8 = _createForOfIteratorHelper(targets);
            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                target = _step8.value;
                if (!grouped.has(target.ofId)) grouped.set(target.ofId, []);
                grouped.get(target.ofId).push(target);
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
            setSaving(true);
            _context55.p = 4;
            _iterator9 = _createForOfIteratorHelper(grouped);
            _context55.p = 5;
            _loop3 = /*#__PURE__*/_regenerator().m(function _loop3() {
              var _step9$value, ofId, destinations, _destination$header, _destination$tab, _destination$testequi2, stored, destination, additions, copiedOvens, _destination$testequi, _ofData$testequip, existingRows, sourceOvens, ovenExists, _iterator0, _step0, _loop4, next, _t75, _t76;
              return _regenerator().w(function (_context54) {
                while (1) switch (_context54.p = _context54.n) {
                  case 0:
                    _step9$value = _slicedToArray(_step9.value, 2), ofId = _step9$value[0], destinations = _step9$value[1];
                    _context54.p = 1;
                    _context54.n = 2;
                    return window.storage.get("of:".concat(ofId), true);
                  case 2:
                    stored = _context54.v;
                    if (stored) {
                      _context54.n = 3;
                      break;
                    }
                    throw new Error("OF introuvable");
                  case 3:
                    destination = withUnitMetadata(JSON.parse(stored.value));
                    if (!((_destination$header = destination.header) !== null && _destination$header !== void 0 && _destination$header.deleted)) {
                      _context54.n = 4;
                      break;
                    }
                    throw new Error("OF supprimé");
                  case 4:
                    additions = destinations.flatMap(function (target) {
                      var unit = destination.units.rows.find(function (u) {
                        return u.id === target.unitId && !u.deleted && hasUnitIdentity(u);
                      });
                      if (!unit) throw new Error("SN / LOT ".concat(target.label, " indisponible"));
                      return sources.map(function (source) {
                        var _destination$demating, _ofData$units3, _ofData$header, _ofData$header2, _ofData$header3, _ofData$header4, _ofData$header5;
                        if (tab === "demating" && (((_destination$demating = destination.demating) === null || _destination$demating === void 0 ? void 0 : _destination$demating.connectors) || []).some(function (c) {
                          return !c.deleted && String(c.nConect).trim().toUpperCase() === String(source.nConect).trim().toUpperCase() && _rowMatchesSnFilter(c, unit.id, _objectSpread(_objectSpread({}, destination.header), {}, {
                            _snRows: destination.units.rows
                          }));
                        })) throw new Error("Connecteur ".concat(source.nConect, " d\xE9j\xE0 pr\xE9sent sur ").concat(target.label));
                        var sourceUnits = ((_ofData$units3 = ofData.units) === null || _ofData$units3 === void 0 ? void 0 : _ofData$units3.rows) || snRowsFromHeader(ofData.header);
                        var sourceLabels = sourceUnits.filter(function (sourceUnit) {
                          return !sourceUnit.deleted && rowMatchesSn(source, sourceUnit, sourceUnits);
                        }).map(snTitle);
                        var copyOrigin = {
                          sourceOfId: currentId,
                          sourceOf: ((_ofData$header = ofData.header) === null || _ofData$header === void 0 ? void 0 : _ofData$header.of) || "",
                          sourceArticle: ((_ofData$header2 = ofData.header) === null || _ofData$header2 === void 0 ? void 0 : _ofData$header2.codeArticle) || "",
                          sourceDescription: ((_ofData$header3 = ofData.header) === null || _ofData$header3 === void 0 ? void 0 : _ofData$header3.description) || "",
                          sourceUnits: sourceLabels.join(" + ") || ((_ofData$header4 = ofData.header) === null || _ofData$header4 === void 0 ? void 0 : _ofData$header4.sn) || ((_ofData$header5 = ofData.header) === null || _ofData$header5 === void 0 ? void 0 : _ofData$header5.lot) || "",
                          sourceRowId: source.id || "",
                          copiedAt: nowDT(),
                          copiedBy: user.trigram,
                          mode: tab === "etuvage" ? "same" : copyMode
                        };
                        return copyTableLineToUnit(tab, source, user, unit, includeChecks, tab === "etuvage" ? "same" : copyMode, reuseSample, copyOrigin);
                      });
                    });
                    if (tab === "openwork") additions.forEach(function (r, index) {
                      var _destination$openwork;
                      r.nOW = String((((_destination$openwork = destination.openwork) === null || _destination$openwork === void 0 ? void 0 : _destination$openwork.rows) || []).length + index + 1).padStart(3, "0");
                    });
                    copiedOvens = [];
                    if (!(tab === "etuvage")) {
                      _context54.n = 12;
                      break;
                    }
                    existingRows = ((_destination$testequi = destination.testequip) === null || _destination$testequi === void 0 ? void 0 : _destination$testequi.rows) || [];
                    sourceOvens = uniqueOvenChoices(((_ofData$testequip = ofData.testequip) === null || _ofData$testequip === void 0 ? void 0 : _ofData$testequip.rows) || []);
                    ovenExists = function ovenExists(rows, value) {
                      var wanted = String(value || "").trim().toLowerCase();
                      return rows.some(function (oven) {
                        return [oven.nInv, oven.designation].some(function (field) {
                          return String(field || "").trim().toLowerCase() === wanted;
                        });
                      });
                    };
                    _iterator0 = _createForOfIteratorHelper(sources);
                    _context54.p = 5;
                    _loop4 = /*#__PURE__*/_regenerator().m(function _loop4() {
                      var source, sourceOven;
                      return _regenerator().w(function (_context53) {
                        while (1) switch (_context53.n) {
                          case 0:
                            source = _step0.value;
                            if (!(!source.fourN || ovenExists([].concat(_toConsumableArray(existingRows), copiedOvens), source.fourN))) {
                              _context53.n = 1;
                              break;
                            }
                            return _context53.a(2, 1);
                          case 1:
                            sourceOven = sourceOvens.find(function (oven) {
                              return [oven.nInv, oven.designation].some(function (field) {
                                return String(field || "").trim().toLowerCase() === String(source.fourN).trim().toLowerCase();
                              });
                            });
                            if (sourceOven) copiedOvens.push(_objectSpread(_objectSpread({}, sourceOven), {}, {
                              id: uid(),
                              snScope: "all",
                              snIds: [],
                              unitId: "",
                              snExcludeIds: [],
                              deleted: false,
                              deletedReason: "",
                              deletedVisa: "",
                              deletedDate: ""
                            }));
                          case 2:
                            return _context53.a(2);
                        }
                      }, _loop4);
                    });
                    _iterator0.s();
                  case 6:
                    if ((_step0 = _iterator0.n()).done) {
                      _context54.n = 9;
                      break;
                    }
                    return _context54.d(_regeneratorValues(_loop4()), 7);
                  case 7:
                    if (!_context54.v) {
                      _context54.n = 8;
                      break;
                    }
                    return _context54.a(3, 8);
                  case 8:
                    _context54.n = 6;
                    break;
                  case 9:
                    _context54.n = 11;
                    break;
                  case 10:
                    _context54.p = 10;
                    _t75 = _context54.v;
                    _iterator0.e(_t75);
                  case 11:
                    _context54.p = 11;
                    _iterator0.f();
                    return _context54.f(11);
                  case 12:
                    next = _objectSpread(_objectSpread({}, destination), {}, _defineProperty({}, tab, _objectSpread(_objectSpread({}, destination[tab]), {}, _defineProperty({}, collection, [].concat(_toConsumableArray(((_destination$tab = destination[tab]) === null || _destination$tab === void 0 ? void 0 : _destination$tab[collection]) || []), _toConsumableArray(additions))))), copiedOvens.length ? {
                      testequip: _objectSpread(_objectSpread({}, destination.testequip), {}, {
                        rows: [].concat(_toConsumableArray(((_destination$testequi2 = destination.testequip) === null || _destination$testequi2 === void 0 ? void 0 : _destination$testequi2.rows) || []), copiedOvens)
                      })
                    } : {});
                    _context54.n = 13;
                    return window.storage.set("of:".concat(ofId), JSON.stringify(next), true);
                  case 13:
                    copied.push.apply(copied, _toConsumableArray(destinations.map(function (t) {
                      return t.key;
                    })));
                    copyCount += additions.length;
                    if (ofId === currentId) setOfData(next);
                    _context54.n = 15;
                    break;
                  case 14:
                    _context54.p = 14;
                    _t76 = _context54.v;
                    errors.push("OF ".concat(destinations[0].of, " : ").concat(_t76.message || "Copie impossible"));
                  case 15:
                    return _context54.a(2);
                }
              }, _loop3, null, [[5, 10, 11, 12], [1, 14]]);
            });
            _iterator9.s();
          case 6:
            if ((_step9 = _iterator9.n()).done) {
              _context55.n = 8;
              break;
            }
            return _context55.d(_regeneratorValues(_loop3()), 7);
          case 7:
            _context55.n = 6;
            break;
          case 8:
            _context55.n = 10;
            break;
          case 9:
            _context55.p = 9;
            _t77 = _context55.v;
            _iterator9.e(_t77);
          case 10:
            _context55.p = 10;
            _iterator9.f();
            return _context55.f(10);
          case 11:
            _context55.p = 11;
            setSaving(false);
            return _context55.f(11);
          case 12:
            return _context55.a(2, {
              copied: copied,
              errors: errors,
              copyCount: copyCount
            });
        }
      }, _callee52, null, [[5, 9, 10, 11], [4,, 11, 12]]);
    }));
    function copyReworkAcross(_x24, _x25, _x26) {
      return _copyReworkAcross.apply(this, arguments);
    }
    return copyReworkAcross;
  }();
  var updateHeader = function updateHeader(fields) {
    var _ofData$header6, _ofData$header7, _ofData$units4, _ofData$rework2, _ofData$testequip2, _ofData$faits, _ofData$etuvage, _ofData$openwork, _ofData$consommables, _ofData$demating;
    if (!isAdminManager(user)) return;
    var newHeader = _objectSpread(_objectSpread({}, ofData.header), fields);
    var newSE = fields.codeArticle || fields.description ? fields.codeArticle || fields.description || "" : null;

    // Cascade sousEnsemble to all rows that still had the OLD default value
    var oldDefault = ((_ofData$header6 = ofData.header) === null || _ofData$header6 === void 0 ? void 0 : _ofData$header6.codeArticle) || ((_ofData$header7 = ofData.header) === null || _ofData$header7 === void 0 ? void 0 : _ofData$header7.description) || "";
    var cascadeUnits = function cascadeUnits(arr) {
      return arr || [];
    };
    var cascadeRows = function cascadeRows(arr) {
      return (arr || []).map(function (r) {
        return (!r.sousEnsemble || r.sousEnsemble === oldDefault) && newSE ? _objectSpread(_objectSpread({}, r), {}, {
          sousEnsemble: newSE.toUpperCase()
        }) : r;
      });
    };
    var cascadeOps = function cascadeOps(arr) {
      return (arr || []).map(function (o) {
        return (!o.sousEnsemble || o.sousEnsemble === oldDefault) && newSE ? _objectSpread(_objectSpread({}, o), {}, {
          sousEnsemble: newSE.toUpperCase()
        }) : o;
      });
    };
    var cascadeConns = function cascadeConns(arr) {
      return (arr || []).map(function (c) {
        return (!c.sousEnsemble || c.sousEnsemble === oldDefault) && newSE ? _objectSpread(_objectSpread({}, c), {}, {
          sousEnsemble: newSE.toUpperCase()
        }) : c;
      });
    };
    var updated = _objectSpread(_objectSpread({}, ofData), {}, {
      header: newHeader,
      units: _objectSpread(_objectSpread({}, ofData.units), {}, {
        rows: cascadeUnits((_ofData$units4 = ofData.units) === null || _ofData$units4 === void 0 ? void 0 : _ofData$units4.rows)
      }),
      rework: _objectSpread(_objectSpread({}, ofData.rework), {}, {
        rows: cascadeRows((_ofData$rework2 = ofData.rework) === null || _ofData$rework2 === void 0 ? void 0 : _ofData$rework2.rows)
      }),
      testequip: _objectSpread(_objectSpread({}, ofData.testequip), {}, {
        rows: cascadeRows((_ofData$testequip2 = ofData.testequip) === null || _ofData$testequip2 === void 0 ? void 0 : _ofData$testequip2.rows)
      }),
      faits: _objectSpread(_objectSpread({}, ofData.faits), {}, {
        rows: cascadeRows((_ofData$faits = ofData.faits) === null || _ofData$faits === void 0 ? void 0 : _ofData$faits.rows)
      }),
      etuvage: _objectSpread(_objectSpread({}, ofData.etuvage), {}, {
        rows: cascadeRows((_ofData$etuvage = ofData.etuvage) === null || _ofData$etuvage === void 0 ? void 0 : _ofData$etuvage.rows)
      }),
      openwork: _objectSpread(_objectSpread({}, ofData.openwork), {}, {
        rows: cascadeRows((_ofData$openwork = ofData.openwork) === null || _ofData$openwork === void 0 ? void 0 : _ofData$openwork.rows)
      }),
      consommables: _objectSpread(_objectSpread({}, ofData.consommables), {}, {
        ops: cascadeOps((_ofData$consommables = ofData.consommables) === null || _ofData$consommables === void 0 ? void 0 : _ofData$consommables.ops)
      }),
      demating: _objectSpread(_objectSpread({}, ofData.demating), {}, {
        connectors: cascadeConns((_ofData$demating = ofData.demating) === null || _ofData$demating === void 0 ? void 0 : _ofData$demating.connectors)
      })
    });

    // Update home screen list entry
    var newList = ofList.map(function (o) {
      return o.id === currentId ? _objectSpread(_objectSpread({}, o), fields) : o;
    });
    setOfList(newList);
    try {
      window.storage.set("of-list", JSON.stringify(newList), true);
    } catch (_unused45) {}
    setOfData(updated);
    save(updated);
  };
  useEffect(function () {
    var done = function done() {
      return setPrintAll(false);
    };
    window.addEventListener("afterprint", done);
    return function () {
      return window.removeEventListener("afterprint", done);
    };
  }, []);
  useEffect(function () {
    var onKey = function onKey(e) {
      var _e$target, _e$target2, _ofData$units5;
      if (!currentId || !ofData || !e.ctrlKey || !e.shiftKey) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var tag = String(((_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.tagName) || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag) || (_e$target2 = e.target) !== null && _e$target2 !== void 0 && _e$target2.isContentEditable) return;
      var rows = (((_ofData$units5 = ofData.units) === null || _ofData$units5 === void 0 ? void 0 : _ofData$units5.rows) || []).filter(function (u) {
        return !u.deleted && hasUnitIdentity(u);
      });
      if (!rows.length) return;
      e.preventDefault();
      setActiveUnitId(function (prev) {
        var idx = rows.findIndex(function (u) {
          return u.id === prev;
        });
        if (e.key === "ArrowRight") {
          return idx < 0 ? rows[0].id : rows[(idx + 1) % rows.length].id;
        }
        return idx < 0 ? rows[rows.length - 1].id : rows[(idx - 1 + rows.length) % rows.length].id;
      });
    };
    window.addEventListener("keydown", onKey);
    return function () {
      return window.removeEventListener("keydown", onKey);
    };
  }, [currentId, ofData]);
  useEffect(function () {
    var switching = false;
    var onKey = /*#__PURE__*/function () {
      var _onKey = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53(event) {
        var target, entries, index, next;
        return _regenerator().w(function (_context56) {
          while (1) switch (_context56.p = _context56.n) {
            case 0:
              if (!(!["PageUp", "PageDown"].includes(event.key) || event.defaultPrevented || event.repeat || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)) {
                _context56.n = 1;
                break;
              }
              return _context56.a(2);
            case 1:
              if (!(!user || user.mustChangePassword || !currentId || !ofData || saving || switching || showProfile || showPdfOptions || copyAcrossRow || printAll)) {
                _context56.n = 2;
                break;
              }
              return _context56.a(2);
            case 2:
              target = event.target;
              if (!(target !== null && target !== void 0 && target.isContentEditable || ["input", "textarea", "select"].includes(String((target === null || target === void 0 ? void 0 : target.tagName) || "").toLowerCase()) || document.querySelector('[role="dialog"], [aria-modal="true"]'))) {
                _context56.n = 3;
                break;
              }
              return _context56.a(2);
            case 3:
              entries = ofList.filter(function (entry) {
                return !entry.deleted;
              });
              index = entries.findIndex(function (entry) {
                return entry.id === currentId;
              });
              if (!(index < 0)) {
                _context56.n = 4;
                break;
              }
              return _context56.a(2);
            case 4:
              event.preventDefault();
              next = entries[index + (event.key === "PageDown" ? 1 : -1)];
              if (next) {
                _context56.n = 5;
                break;
              }
              return _context56.a(2);
            case 5:
              switching = true;
              _context56.p = 6;
              _context56.n = 7;
              return selectOf(next.id, null, activeTab);
            case 7:
              _context56.p = 7;
              switching = false;
              return _context56.f(7);
            case 8:
              return _context56.a(2);
          }
        }, _callee53, null, [[6,, 7, 8]]);
      }));
      function onKey(_x27) {
        return _onKey.apply(this, arguments);
      }
      return onKey;
    }();
    window.addEventListener("keydown", onKey);
    return function () {
      return window.removeEventListener("keydown", onKey);
    };
  }, [user, currentId, ofData, ofList, saving, showProfile, showPdfOptions, copyAcrossRow, printAll, activeTab]);
  var printReport = function printReport() {
    setPrintAll(true);
    setTimeout(function () {
      return window.print();
    }, 150);
  };
  var reportFileBaseName = function reportFileBaseName() {
    var _ofData$units6, _selected$, _selected$2, _selected, _selected2, _selected$3, _selected$4;
    var selectedSnIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var units = ((ofData === null || ofData === void 0 || (_ofData$units6 = ofData.units) === null || _ofData$units6 === void 0 ? void 0 : _ofData$units6.rows) || []).filter(function (u) {
      return !u.deleted && hasUnitIdentity(u);
    });
    var selected = selectedSnIds && selectedSnIds.length ? units.filter(function (u) {
      return selectedSnIds.includes(u.id);
    }) : units;
    var snPart = selected.length > 1 ? "".concat(((_selected$ = selected[0]) === null || _selected$ === void 0 ? void 0 : _selected$.sn) || ((_selected$2 = selected[0]) === null || _selected$2 === void 0 ? void 0 : _selected$2.lot) || "SN", "-").concat(((_selected = selected[selected.length - 1]) === null || _selected === void 0 ? void 0 : _selected.sn) || ((_selected2 = selected[selected.length - 1]) === null || _selected2 === void 0 ? void 0 : _selected2.lot) || "SN") : ((_selected$3 = selected[0]) === null || _selected$3 === void 0 ? void 0 : _selected$3.sn) || ((_selected$4 = selected[0]) === null || _selected$4 === void 0 ? void 0 : _selected$4.lot) || (h === null || h === void 0 ? void 0 : h.sn) || (h === null || h === void 0 ? void 0 : h.lot) || "SN";
    var stamp = nowDT().replace(/[/:]/g, "-").replace(/\s+/g, "_");
    return fileSafeName("".concat((h === null || h === void 0 ? void 0 : h.codeArticle) || "Article", " - ").concat((h === null || h === void 0 ? void 0 : h.description) || "Description", " - ").concat(snPart, " - OF ").concat((h === null || h === void 0 ? void 0 : h.of) || "OF", " - ").concat(stamp, " - ").concat((user === null || user === void 0 ? void 0 : user.trigram) || "VISA"));
  };
  var downloadBlob = function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  var exportReportJson = function exportReportJson() {
    var payload = {
      schema: "sp-f001a-report-v1",
      exportedAt: nowDT(),
      exportedBy: (user === null || user === void 0 ? void 0 : user.trigram) || "",
      ofData: ofData,
      lists: {
        consommables: consommables,
        faitTypes: faitTypes
      }
    };
    var name = "SP-F001A_".concat(((h === null || h === void 0 ? void 0 : h.of) || "OF").replace(/[^a-zA-Z0-9_-]+/g, "_"), "_rapport.json");
    var blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8"
    });
    downloadBlob(blob, name);
  };
  var exportSapCsv = function exportSapCsv() {
    var _ofData$units7, _ofData$rework3, _ofData$consommables2;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var snRows = ((ofData === null || ofData === void 0 || (_ofData$units7 = ofData.units) === null || _ofData$units7 === void 0 ? void 0 : _ofData$units7.rows) || []).filter(function (u) {
      return !u.deleted && hasUnitIdentity(u);
    });
    var selectedIds = options.selectedSnIds && options.selectedSnIds.length ? options.selectedSnIds : snRows.map(function (u) {
      return u.id;
    });
    var selectedSnRows = snRows.length ? snRows.filter(function (u) {
      return selectedIds.includes(u.id);
    }) : [];
    var consoById = Object.fromEntries((consommables || []).map(function (c) {
      return [c.id, c];
    }));
    var headers = ["Source", "Date", "Visa", "SN", "LOT", "Fiche", "OP", "Repere/Conso", "Action", "Qte", "N echantillon", "Code article", "Valeur", "LOT comp./conso", "DC/DP", "CTRL", "TRACA", "Annulee", "Annule le", "Annule par", "Motif annulation"];
    var fmt = function fmt(v, deleted) {
      return deleted ? strikeText(v) : String(v !== null && v !== void 0 ? v : "");
    };
    var targetsFor = function targetsFor(row) {
      if (!snRows.length) return [{
        sn: (h === null || h === void 0 ? void 0 : h.sn) || (h === null || h === void 0 ? void 0 : h.snProduitFini) || "",
        lot: (h === null || h === void 0 ? void 0 : h.lot) || "",
        label: snScopeLabel(row, [])
      }];
      return selectedSnRows.filter(function (sn) {
        return rowMatchesSn(row, sn, snRows);
      }).map(function (sn) {
        return {
          sn: sn.sn || "",
          lot: sn.lot || "",
          label: snTitle(sn)
        };
      });
    };
    var rows = [];
    ((ofData === null || ofData === void 0 || (_ofData$rework3 = ofData.rework) === null || _ofData$rework3 === void 0 ? void 0 : _ofData$rework3.rows) || []).forEach(function (r) {
      var deleted = !!r.deleted;
      targetsFor(r).forEach(function (target) {
        return rows.push(["Adjust/Rework", fmt(r.createdDT, deleted), fmt(r.createdVisa, deleted), fmt(target.sn, deleted), fmt(target.lot, deleted), fmt(r.fiche, deleted), fmt(r.etape, deleted), fmt(r.repere, deleted), fmt(ACTION_LABELS[r.action1] || r.action1, deleted), fmt(r.qty || "", deleted), "", fmt(compactArticleCode(r.codeERP), deleted), fmt(r.valeur, deleted), fmt(r.lot, deleted), fmt(r.dc, deleted), fmt(visaStamp(r.visaCtrl, r.dateCtrl), deleted), fmt(visaStamp(r.visaTraca, r.dateTraca), deleted), deleted ? "X" : "", r.deletedDate || "", r.deletedVisa || "", r.deletedReason || ""]);
      });
    });
    ((ofData === null || ofData === void 0 || (_ofData$consommables2 = ofData.consommables) === null || _ofData$consommables2 === void 0 ? void 0 : _ofData$consommables2.ops) || []).forEach(function (op) {
      var items = (op.items || []).length ? op.items : [{}];
      items.forEach(function (it) {
        var conso = consoById[it.consoId] || {};
        var consoCode = compactArticleCode(conso.sap || conso.code || it.consoId);
        var consoDesc = consoDescriptionForCsv(conso, it.consoId);
        var deleted = !!op.deleted || !!it.deleted;
        targetsFor(op).forEach(function (target) {
          return rows.push(["Consommable", fmt(it.createdDT || op.createdDT, deleted), fmt(it.createdVisa || op.createdVisa, deleted), fmt(target.sn, deleted), fmt(target.lot, deleted), fmt(op.fiche, deleted), fmt(op.op, deleted), fmt(consoDesc, deleted), "", fmt(it.qty || it.qte || op.qty || op.qte || "1", deleted), fmt(it.echantillon, deleted), fmt(consoCode, deleted), "", fmt(it.lot, deleted), fmt(it.dp, deleted), "", fmt(visaStamp(it.visaTraca, it.dateTraca), deleted), deleted ? "X" : "", it.deletedDate || op.deletedDate || "", it.deletedVisa || op.deletedVisa || "", it.deletedReason || op.deletedReason || ""]);
        });
      });
    });
    var csv = "\uFEFF" + [headers].concat(rows).map(function (r) {
      return r.map(csvCell).join(";");
    }).join("\r\n");
    downloadBlob(new Blob([csv], {
      type: "text/csv;charset=utf-8"
    }), "".concat(reportFileBaseName(options.selectedSnIds || null), " - Adjust-Rework Consommables.csv"));
  };
  var downloadReportPdf = /*#__PURE__*/function () {
    var _downloadReportPdf = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54() {
      var options,
        includeHistory,
        logoImage,
        blob,
        _args57 = arguments;
      return _regenerator().w(function (_context57) {
        while (1) switch (_context57.n) {
          case 0:
            options = _args57.length > 0 && _args57[0] !== undefined ? _args57[0] : {};
            includeHistory = !!options.includeHistory;
            setPdfIncludeHistory(includeHistory);
            _context57.n = 1;
            return loadPdfLogoImage("assets/logo.png");
          case 1:
            logoImage = _context57.v;
            blob = buildDirectReportPdf({
              ofData: ofData,
              lists: {
                consommables: consommables,
                faitTypes: faitTypes
              },
              exportedAt: nowDT(),
              exportedBy: (user === null || user === void 0 ? void 0 : user.trigram) || "",
              includeHistory: includeHistory,
              includeDeleted: options.includeDeleted !== false,
              skipEmptyReports: !!options.skipEmptyReports,
              selectedSections: options.selectedSections || null,
              selectedSnIds: options.selectedSnIds || null,
              logoImage: logoImage
            });
            downloadBlob(blob, "".concat(reportFileBaseName(options.selectedSnIds || null), ".pdf"));
            if (!options.keepModal) setShowPdfOptions(false);
          case 2:
            return _context57.a(2);
        }
      }, _callee54);
    }));
    function downloadReportPdf() {
      return _downloadReportPdf.apply(this, arguments);
    }
    return downloadReportPdf;
  }();
  var exportReportPack = /*#__PURE__*/function () {
    var _exportReportPack = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55() {
      var options,
        _args58 = arguments;
      return _regenerator().w(function (_context58) {
        while (1) switch (_context58.n) {
          case 0:
            options = _args58.length > 0 && _args58[0] !== undefined ? _args58[0] : {};
            if (!options.includePdf) {
              _context58.n = 1;
              break;
            }
            _context58.n = 1;
            return downloadReportPdf(_objectSpread(_objectSpread({}, options), {}, {
              keepModal: true
            }));
          case 1:
            if (options.includeCsv) exportSapCsv(options);
            setShowPdfOptions(false);
          case 2:
            return _context58.a(2);
        }
      }, _callee55);
    }));
    function exportReportPack() {
      return _exportReportPack.apply(this, arguments);
    }
    return exportReportPack;
  }();
  if (!loaded) return /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.bg,
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: C.muted
    }
  }, "Chargement\u2026");
  if (!user) return /*#__PURE__*/React.createElement(LoginScreen, {
    onLogin: handleLogin
  });
  if (user.mustChangePassword) return /*#__PURE__*/React.createElement(RequiredPasswordChange, {
    user: user,
    onDone: handleLogin,
    onLogout: handleLogout
  });
  if (!currentId || !ofData) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OFSelector, {
    ofList: ofList,
    consommables: consommables,
    onSelect: selectOf,
    onCreate: createOf,
    onDelete: deleteOf,
    onImportOFs: importOFs,
    onFinishedSnChange: function onFinishedSnChange(id, unitId, value) {
      return updateHomeUnit(id, unitId, {
        snProduitFini: value
      });
    },
    onUnitStatusChange: function onUnitStatusChange(id, unitId, status) {
      return updateHomeUnit(id, unitId, {
        status: status
      });
    },
    user: user,
    onLogout: handleLogout,
    openHistory: openHistory,
    onSaveProfile: handleSaveProfile,
    onManageUsers: function onManageUsers() {
      return setShowAdminUsers(true);
    },
    onManageStatuses: function onManageStatuses() {
      return setShowStatusTypes(true);
    },
    onUpdateStatus: updateHomeStatus
  }), showAdminUsers && canManageUsers(user) && /*#__PURE__*/React.createElement(AdminUsersModal, {
    onClose: function onClose() {
      return setShowAdminUsers(false);
    }
  }), showStatusTypes && canManageLists(user) && /*#__PURE__*/React.createElement(StatusTypesManager, {
    types: statusTypes,
    onClose: function onClose() {
      return setShowStatusTypes(false);
    },
    onSave: saveStatusTypes
  }));
  var h = ofData.header;
  var unitRows = ((_ofData$units8 = ofData.units) === null || _ofData$units8 === void 0 ? void 0 : _ofData$units8.rows) || [];
  var snRows = unitRows.filter(function (u) {
    return !u.deleted && hasUnitIdentity(u);
  });
  var activeUnitChoice = snRows.some(function (u) {
    return u.id === activeUnitId;
  }) ? activeUnitId : "all";
  var activeUnit = snRows.find(function (u) {
    return u.id === activeUnitId;
  }) || null;
  var entryUnit = activeUnit || snRows.find(function (u) {
    return u.id === entryUnitId;
  }) || snRows[0] || null;
  var snSummary = snRows.length ? "".concat(snRows.length, " SN") : h.sn ? "SN ".concat(h.sn) : "aucun SN";
  var workHeader = _objectSpread(_objectSpread({}, h), {}, {
    _snRows: snRows,
    _defaultSnIds: activeUnit ? [activeUnit.id] : [],
    _entrySnIds: entryUnit ? [entryUnit.id] : [],
    _confirmMultiSn: true
  });
  var scopedFaits = effectiveScopedRows(ofData, "faits").filter(function (r) {
    return _rowMatchesSnFilter(r, activeUnitChoice, workHeader);
  });
  var faits = scopedFaits.length;
  var faitsOpen = scopedFaits.filter(function (r) {
    return !r.closedDate;
  }).length;
  var ows = effectiveScopedRows(ofData, "openwork").filter(function (r) {
    return !r.closedDate && _rowMatchesSnFilter(r, activeUnitChoice, workHeader);
  }).length;
  // Alerte calibration
  var horsCalib = effectiveScopedRows(ofData, "testequip").filter(function (r) {
    var _calibStatus3;
    return _rowMatchesSnFilter(r, activeUnitChoice, workHeader) && ((_calibStatus3 = calibStatus(r.dateExpiration)) === null || _calibStatus3 === void 0 ? void 0 : _calibStatus3.color) === C.red;
  }).length;
  // Prochain étuvage
  var nei = {
    label: "—",
    overdue: false
  };
  try {
    nei = nextEtuvageInfo(effectiveEtuvageRows(ofData).filter(function (r) {
      return _rowMatchesSnFilter(r, activeUnitChoice, workHeader);
    }));
  } catch (_unused46) {}
  var reportSous = h.codeArticle || h.description || "—";
  var reportSn = snRows.length ? snRows.map(snTitle).join(" ; ") : "".concat(h.sn || "—", " / ").concat(h.lot || "—");
  var ReportTitle = function ReportTitle() {
    var _STATUTS15;
    return printAll ? /*#__PURE__*/React.createElement("div", {
      style: {
        borderBottom: "3px solid ".concat(C.accent),
        paddingBottom: 10,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 900,
        fontFamily: "monospace",
        color: C.text
      }
    }, "Rapport complet SP-F001A7"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gap: 10,
        marginTop: 10,
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "OF"), /*#__PURE__*/React.createElement("strong", null, h.of || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "OTP"), /*#__PURE__*/React.createElement("strong", null, h.otp || h.projet || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "SN suivis"), /*#__PURE__*/React.createElement("strong", null, reportSn)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "Statut OF"), /*#__PURE__*/React.createElement("strong", null, ((_STATUTS15 = STATUTS[h.status || "en_cours"]) === null || _STATUTS15 === void 0 ? void 0 : _STATUTS15.label) || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "\xC9dit\xE9"), /*#__PURE__*/React.createElement("strong", null, nowDT(), " - ", user.trigram)))) : null;
  };
  var ReportHead = function ReportHead(_ref142) {
    var tab = _ref142.tab;
    return printAll ? /*#__PURE__*/React.createElement("div", {
      style: {
        border: "1px solid ".concat(C.border),
        background: C.input,
        borderRadius: 6,
        padding: "8px 12px",
        margin: "0 0 12px",
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "OF"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800
      }
    }, h.of || "—")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "Article OF"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800
      }
    }, reportSous)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "SN suivis"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800
      }
    }, reportSn)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        color: C.muted,
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "Onglet"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontWeight: 800,
        color: C.accent
      }
    }, tab))) : null;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(printAll ? "print-report " : "", "compact-ui"),
    style: {
      background: C.bg,
      minHeight: "100vh",
      color: C.text,
      fontFamily: "system-ui,sans-serif"
    }
  }, /*#__PURE__*/React.createElement("style", null, "\n        @media print {\n          @page { size: A4 landscape; margin: 10mm; }\n          body { background: #fff !important; color: #111 !important; }\n          .no-print, .sticky-tabs, .sticky-of-header > div button { display: none !important; }\n          .print-report, .print-report * {\n            color: #111 !important;\n            box-shadow: none !important;\n            text-shadow: none !important;\n          }\n          .print-report {\n            background: #fff !important;\n            font-size: 9px !important;\n          }\n          .print-report > div:first-of-type,\n          .print-report .sticky-tabs,\n          .print-report .sticky-of-header {\n            position: static !important;\n            display: none !important;\n          }\n          .print-report table {\n            width: 100% !important;\n            min-width: 0 !important;\n            border-collapse: collapse !important;\n            page-break-inside: auto;\n          }\n          .print-report tr { page-break-inside: avoid; page-break-after: auto; }\n          .print-report th {\n            background: #e9edf2 !important;\n            color: #111 !important;\n            border: 1px solid #9aa4af !important;\n            padding: 3px !important;\n          }\n          .print-report td {\n            background: #fff !important;\n            color: #111 !important;\n            border: 1px solid #c3cad1 !important;\n            padding: 3px !important;\n          }\n          .print-report input,\n          .print-report select,\n          .print-report textarea {\n            border: 0 !important;\n            background: transparent !important;\n            color: #111 !important;\n            padding: 0 !important;\n            font-size: 9px !important;\n            min-height: 0 !important;\n          }\n          .print-report details.edit-history {\n            display: block !important;\n            background: #eef5ff !important;\n            border-left: 3px solid #1f6feb !important;\n            padding: 3px 6px !important;\n          }\n          .print-report details.edit-history summary {\n            color: #174ea6 !important;\n            font-weight: 800 !important;\n          }\n        }\n        .compact-ui table td { padding-top: 4px !important; padding-bottom: 4px !important; }\n        .compact-ui table th { padding-top: 5px !important; padding-bottom: 5px !important; }\n        .compact-ui *,\n        .compact-ui *::before,\n        .compact-ui *::after {\n          box-sizing: border-box;\n        }\n        .compact-ui table {\n          max-width: 100%;\n        }\n        .compact-ui th,\n        .compact-ui td {\n          overflow: hidden;\n          text-overflow: ellipsis;\n        }\n        .compact-ui input,\n        .compact-ui select,\n        .compact-ui textarea {\n          min-height: 0 !important;\n          padding-top: 4px !important;\n          padding-bottom: 4px !important;\n        }\n        .compact-ui td:first-child,\n        .compact-ui td:first-child span {\n          white-space: nowrap !important;\n        }\n      "), /*#__PURE__*/React.createElement("div", {
    style: {
      background: perms.godMode ? C.red + "28" : C.surface,
      borderBottom: "2px solid ".concat(perms.godMode ? C.red : C.border),
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      height: 68,
      boxSizing: "border-box",
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setCurrentId(null);
      setActiveUnitId("all");
    },
    style: {
      background: "none",
      border: "none",
      color: C.muted,
      cursor: "pointer",
      fontSize: 18
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(QuickOfSearch, {
    ofList: ofList,
    currentId: currentId,
    onSelect: selectOf,
    disabled: saving
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "active-work-sn",
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: C.muted
    }
  }, "Vue SN"), /*#__PURE__*/React.createElement("select", {
    id: "active-work-sn",
    value: activeUnitChoice,
    onChange: function onChange(e) {
      if (activeUnit) setEntryUnitId(activeUnit.id);
      setActiveUnitId(e.target.value);
    },
    title: "SN affich\xE9 - Ctrl + Shift + \u2190 / \u2192 pour changer de SN",
    style: {
      background: activeUnitChoice === "all" ? C.yellow + "20" : C.input,
      border: "1px solid ".concat(activeUnitChoice === "all" ? C.yellow : C.blue),
      borderRadius: 4,
      color: C.text,
      padding: "4px 8px",
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "monospace",
      outline: "none",
      width: 220,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "all"
  }, "Voir tous les SN (", snRows.length, ")"), snRows.map(function (u) {
    return /*#__PURE__*/React.createElement("option", {
      key: u.id,
      value: u.id
    }, snTitle(u));
  })), activeUnitChoice === "all" && /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.yellow,
      fontSize: 11,
      fontWeight: 800,
      whiteSpace: "nowrap"
    }
  }, "VUE TOUS LES SN")))), /*#__PURE__*/React.createElement(HeaderClock, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    title: lastSaved ? "Dernier enregistrement : ".concat(lastSaved) : "",
    style: {
      fontSize: 11,
      color: C.muted
    }
  }, saving ? "⟳ …" : lastSaved ? "✓" : ""), /*#__PURE__*/React.createElement(ThemeButton, null), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return setShowPdfOptions(true);
    },
    color: C.green,
    small: true
  }, "Rapport"), isAdminManager(user) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    title: "Suppression d\xE9finitive des prochaines lignes annul\xE9es",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      color: godMode ? C.red : C.muted,
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: godMode,
    onChange: function onChange(e) {
      return setGodMode(e.target.checked);
    }
  }), "God mode")), /*#__PURE__*/React.createElement(Btn, {
    onClick: exportReportJson,
    color: C.border,
    small: true
  }, "Export JSON"), /*#__PURE__*/React.createElement(Btn, {
    onClick: handleLogout,
    color: C.border,
    small: true
  }, "D\xE9connexion"), /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return setShowProfile(true);
    },
    style: {
      background: C.accent + "22",
      border: "1px solid ".concat(C.accent),
      borderRadius: 20,
      padding: "3px 12px",
      fontFamily: "monospace",
      fontWeight: 700,
      color: C.accent,
      fontSize: 12,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6
    },
    title: "Mon profil"
  }, user.trigram, (user.nom || user.prenom) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 400,
      color: C.muted,
      fontFamily: "system-ui"
    }
  }, [user.prenom, user.nom].filter(Boolean).join(" ")), "\u270E"))), saveError && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      background: C.red + "18",
      borderBottom: "1px solid ".concat(C.red),
      color: C.red,
      padding: "8px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      fontSize: 12,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u26A0 Enregistrement interrompu : ", saveError), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return pendingSave && save(pendingSave);
    },
    color: C.red,
    small: true,
    disabled: !pendingSave || saving
  }, "R\xE9essayer"), /*#__PURE__*/React.createElement(Btn, {
    onClick: function onClick() {
      return selectOf(currentId, activeUnitId, activeTab);
    },
    color: C.border,
    small: true,
    disabled: saving
  }, "Recharger le dossier"))), showProfile && /*#__PURE__*/React.createElement(ProfileModal, {
    user: user,
    onClose: function onClose() {
      return setShowProfile(false);
    },
    onSave: handleSaveProfile
  }), copyAcrossRow && /*#__PURE__*/React.createElement(CopyReworkModal, {
    row: copyAcrossRow.row,
    sourceRows: copySourcesForTab(copyAcrossRow.tab, ofData, workHeader, activeUnitChoice),
    tab: copyAcrossRow.tab,
    ofList: ofList,
    user: user,
    busy: saving,
    sourceOfId: currentId,
    sourceHeader: ofData.header,
    defaultUnitIds: entryUnit ? [entryUnit.id] : [],
    onCopy: copyReworkAcross,
    onClose: function onClose() {
      return setCopyAcrossRow(null);
    }
  }), showPdfOptions && /*#__PURE__*/React.createElement(PdfOptionsModal, {
    snRows: snRows,
    defaultSelectedIds: activeUnit ? [activeUnit.id] : null,
    includeHistoryDefault: pdfIncludeHistory,
    onCancel: function onCancel() {
      return setShowPdfOptions(false);
    },
    onConfirm: exportReportPack
  }), /*#__PURE__*/React.createElement("div", {
    className: "sticky-tabs",
    style: {
      background: C.surface,
      borderBottom: "1px solid ".concat(C.border),
      display: "flex",
      overflowX: "auto",
      padding: "0 12px",
      position: "sticky",
      top: 68,
      zIndex: 95
    }
  }, TABS.map(function (t) {
    var active = activeTab === t.id;
    var dot = t.id === "faits" && faitsOpen > 0 || t.id === "openwork" && ows > 0 || t.id === "testequip" && horsCalib > 0;
    var dotColor = t.id === "ncr" ? C.red : t.id === "dm" ? C.blue : t.id === "testequip" ? C.red : C.yellow;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return setActiveTab(t.id);
      },
      style: {
        background: "none",
        border: "none",
        borderBottom: active ? "2px solid ".concat(C.accent) : "2px solid transparent",
        color: active ? C.text : C.muted,
        padding: "10px 12px",
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, t.label, dot && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: dotColor
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      maxWidth: 1560
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky-of-header",
    style: {
      position: "sticky",
      top: 111,
      zIndex: 90,
      background: C.bg,
      paddingTop: 4,
      paddingBottom: 2,
      maxWidth: 1520
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 8,
      padding: "8px 12px",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      alignItems: "center"
    }
  }, [["dossier", "Dossier"], ["sn", "Pièces de l'OF"]].map(function (_ref143) {
    var _ref144 = _slicedToArray(_ref143, 2),
      id = _ref144[0],
      label = _ref144[1];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: function onClick() {
        return setHeaderPanel(id);
      },
      style: {
        background: headerPanel === id ? C.accent + "22" : "transparent",
        border: "1px solid ".concat(headerPanel === id ? C.accent : C.border),
        borderRadius: 4,
        color: headerPanel === id ? C.accent : C.muted,
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 800,
        cursor: "pointer",
        textTransform: "uppercase",
        letterSpacing: .6
      }
    }, label);
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "no-print",
    title: "Copier N\xB0 article, description et SN dans le presse-papier",
    "aria-label": "Copier les informations du dossier dans le presse-papier",
    onClick: function onClick() {
      copyToClipboard(buildTeamsOfText(h, activeUnit ? [activeUnit] : snRows));
      setCopiedOfInfo(true);
      setTimeout(function () {
        return setCopiedOfInfo(false);
      }, 1800);
    },
    style: {
      width: 28,
      height: 24,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      border: 0,
      borderRadius: 4,
      background: copiedOfInfo ? C.green : C.blue,
      color: "#fff",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 800
    }
  }, copiedOfInfo ? "✓" : "📋")), perms.canWrite && entryUnit && /*#__PURE__*/React.createElement("div", {
    className: "no-print",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "entry-target-sn",
    style: {
      fontWeight: 700,
      color: C.accent
    }
  }, "Nouvelle ligne pour"), activeUnitChoice === "all" ? /*#__PURE__*/React.createElement("select", {
    id: "entry-target-sn",
    value: entryUnit.id,
    onChange: function onChange(e) {
      return setEntryUnitId(e.target.value);
    },
    style: {
      background: C.input,
      color: C.text,
      border: "1px solid ".concat(C.blue),
      borderRadius: 4,
      padding: "4px 8px",
      fontSize: 12,
      maxWidth: 260
    }
  }, snRows.map(function (unit) {
    return /*#__PURE__*/React.createElement("option", {
      key: unit.id,
      value: unit.id
    }, snTitle(unit));
  })) : /*#__PURE__*/React.createElement("strong", null, snTitle(entryUnit)))), headerPanel === "dossier" ? /*#__PURE__*/React.createElement(Header, {
    of: workHeader,
    onUpdate: updateHeader,
    user: user,
    onCommentsChange: function onCommentsChange(v) {
      var u = _objectSpread(_objectSpread({}, ofData), {}, {
        header: _objectSpread(_objectSpread({}, ofData.header), {}, {
          comments: v
        })
      });
      setOfData(u);
      save(u);
    },
    onUpdateStatus: function onUpdateStatus(status) {
      if (!isAdminManager(user)) return;
      var updated = _objectSpread(_objectSpread({}, ofData), {}, {
        header: _objectSpread(_objectSpread({}, ofData.header), {}, {
          status: status
        })
      });
      var newList = ofList.map(function (o) {
        return o.id === currentId ? _objectSpread(_objectSpread({}, o), {}, {
          status: status
        }) : o;
      });
      setOfList(newList);
      try {
        window.storage.set("of-list", JSON.stringify(newList), true);
      } catch (_unused47) {}
      setOfData(updated);
      save(updated);
    }
  }) : /*#__PURE__*/React.createElement(TrackedSNs, {
    data: ofData.units || {},
    onChange: function onChange(d) {
      return updateTab("units", d);
    },
    splitHistory: ofData.lotSplits || [],
    onSplitLot: function onSplitLot(id, remaining, destinations) {
      var updated = splitTrackedLot(ofData, id, remaining, destinations, user);
      setOfData(updated);
      save(updated);
    },
    onLotQuantity: function onLotQuantity(id, qty) {
      var updated = changeTrackedLotQuantity(ofData, id, qty, user);
      setOfData(updated);
      save(updated);
    },
    onConvertUnit: function onConvertUnit(id, kind) {
      var updated = convertTrackedUnitKind(ofData, id, kind, user);
      setOfData(updated);
      save(updated);
    },
    header: h,
    user: user,
    activeUnitId: activeUnitId,
    onActiveUnitChange: setActiveUnitId
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: "1px solid ".concat(C.border),
      borderRadius: 8,
      padding: 16,
      maxWidth: 1520
    }
  }, /*#__PURE__*/React.createElement(ReportTitle, null), (printAll || activeTab === "rework") && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "Adjust/Rework"
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "Adjust/Rework"), /*#__PURE__*/React.createElement(TabRework, {
    data: ofData.rework,
    contextData: ofData,
    onChange: function onChange(d) {
      return updateTab("rework", d);
    },
    user: user,
    perms: perms,
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "rework",
        row: row
      });
    }
  })), (!printAll && activeTab === "consommables" || printAll) && /*#__PURE__*/React.createElement("div", {
    style: printAll ? {
      breakBefore: "page",
      marginTop: 24
    } : {}
  }, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "Consommables"
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "Consommables"), /*#__PURE__*/React.createElement(TabConsommables, {
    data: ofData.consommables || {},
    contextData: ofData,
    onChange: function onChange(d) {
      return updateTab("consommables", d);
    },
    user: user,
    perms: perms,
    consommables: consommables,
    onEditList: openConsommablesEditor,
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "consommables",
        row: row
      });
    }
  })), (!printAll && activeTab === "testequip" || printAll) && /*#__PURE__*/React.createElement("div", {
    style: printAll ? {
      breakBefore: "page",
      marginTop: 24
    } : {}
  }, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "Test Equip."
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "Test Equip."), /*#__PURE__*/React.createElement(TabTestEquip, {
    data: ofData.testequip,
    onChange: function onChange(d) {
      return updateTab("testequip", d);
    },
    user: user,
    perms: perms,
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "testequip",
        row: row
      });
    }
  })), (!printAll && activeTab === "faits" || printAll) && /*#__PURE__*/React.createElement("div", {
    style: printAll ? {
      breakBefore: "page",
      marginTop: 24
    } : {}
  }, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "Faits"
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "Faits"), /*#__PURE__*/React.createElement(TabFaits, {
    data: ofData.faits || {},
    onChange: function onChange(d) {
      return updateTab("faits", d);
    },
    user: user,
    perms: perms,
    faitTypes: faitTypes,
    onEditTypes: function onEditTypes() {
      return setShowFaitTypes(true);
    },
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "faits",
        row: row
      });
    }
  })), (!printAll && activeTab === "etuvage" || printAll) && /*#__PURE__*/React.createElement("div", {
    style: printAll ? {
      breakBefore: "page",
      marginTop: 24
    } : {}
  }, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "\xC9tuvages"
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "\xC9tuvages"), /*#__PURE__*/React.createElement(TabEtuvage, {
    data: ofData.etuvage,
    onChange: function onChange(d) {
      return updateTab("etuvage", d);
    },
    user: user,
    perms: perms,
    allRows: (_ofData$etuvage2 = ofData.etuvage) === null || _ofData$etuvage2 === void 0 ? void 0 : _ofData$etuvage2.rows,
    tstRows: (_ofData$testequip3 = ofData.testequip) === null || _ofData$testequip3 === void 0 ? void 0 : _ofData$testequip3.rows,
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "etuvage",
        row: row
      });
    }
  })), (!printAll && activeTab === "demating" || printAll) && /*#__PURE__*/React.createElement("div", {
    style: printAll ? {
      breakBefore: "page",
      marginTop: 24
    } : {}
  }, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "Mating"
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "Mating"), /*#__PURE__*/React.createElement(TabDeMating, {
    data: ofData.demating,
    onChange: function onChange(d) {
      return updateTab("demating", d);
    },
    user: user,
    perms: perms,
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "demating",
        row: row
      });
    }
  })), (!printAll && activeTab === "openwork" || printAll) && /*#__PURE__*/React.createElement("div", {
    style: printAll ? {
      breakBefore: "page",
      marginTop: 24
    } : {}
  }, /*#__PURE__*/React.createElement(ReportHead, {
    tab: "Open Work"
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "Open Work"), /*#__PURE__*/React.createElement(TabOpenWork, {
    data: ofData.openwork,
    onChange: function onChange(d) {
      return updateTab("openwork", d);
    },
    user: user,
    perms: perms,
    header: workHeader,
    forceShowDeleted: printAll,
    onCopyAcross: function onCopyAcross(row) {
      return setCopyAcrossRow({
        tab: "openwork",
        row: row
      });
    }
  })))), showConsoEditor && canManageLists(user) && /*#__PURE__*/React.createElement(ConsommableListManager, {
    items: consommables,
    onClose: function onClose() {
      return setShowConsoEditor(false);
    },
    onSave: saveConsommables
  }), showFaitTypes && canManageLists(user) && /*#__PURE__*/React.createElement(FaitTypesManager, {
    types: faitTypes,
    onClose: function onClose() {
      return setShowFaitTypes(false);
    },
    onSave: saveFaitTypes
  }), showStatusTypes && canManageLists(user) && /*#__PURE__*/React.createElement(StatusTypesManager, {
    types: statusTypes,
    onClose: function onClose() {
      return setShowStatusTypes(false);
    },
    onSave: saveStatusTypes
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
