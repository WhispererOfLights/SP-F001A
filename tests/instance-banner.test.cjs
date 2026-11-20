const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
const serverStatus = fs.readFileSync(path.join(root, "server-status.vbs"), "utf8");

assert.match(html, /#instance-banner\s*\{[\s\S]*?top:\s*0;/, "Le bandeau doit rester en haut");
assert.match(html, /production-instance #instance-banner[^}]*#1457a6/i, "La production doit être bleue");
assert.match(html, /test-instance #instance-banner[^}]*#b42318/i, "La base test doit être rouge");
assert.match(html, /BASE PRODUCTION/, "Le libellé de production doit être explicite");
assert.match(html, /BASE TEST/, "Le libellé de test doit être explicite");

assert.match(app, /top:"var\(--instance-banner-height, 0px\)"/, "La barre du dossier doit rester sous le bandeau");
assert.match(app, /top:"calc\(108px \+ var\(--instance-banner-height, 0px\)\)"/, "Les onglets doivent rester sous le bandeau climatique");
assert.match(app, /top:"calc\(151px \+ var\(--instance-banner-height, 0px\)\)"/, "L'entête OF doit rester sous le bandeau climatique");
assert.match(serverStatus, /For attempt = 1 To 30/, "Le raccourci serveur doit attendre une relance lente");

console.log("Bandeaux production/test et attente du serveur : OK");
