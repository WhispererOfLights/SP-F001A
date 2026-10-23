r"""Create a complete, clearly isolated demonstration work order.

The database connection is read from the standard PG* environment variables.
Run this script only after loading C:\ProgramData\SP-F001A\server.env.
"""

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


OF_ID = "demo-sp-f0001"
DOCUMENT_KEY = f"of:{OF_ID}"


def scoped(unit_id: str) -> dict:
    return {"snScope": "custom", "snIds": [unit_id], "unitId": unit_id}


def comment(identifier: str, text: str, dt: str = "23/10/2026 08:15") -> dict:
    return {"id": identifier, "visa": "DEMO", "dt": dt, "text": text, "replies": []}


def build_demo_document() -> tuple[dict, dict]:
    created_dt = datetime.now().strftime("%d/%m/%Y %H:%M")
    units = [
        {"id": "demo-u1", "sn": "DEMO1", "unitKind": "sn", "status": "en_cours", "createdBy": "DEMO", "createdDT": created_dt, "comments": []},
        {"id": "demo-u2", "sn": "DEMO2", "unitKind": "sn", "status": "a_faire", "createdBy": "DEMO", "createdDT": created_dt, "comments": []},
        {"id": "demo-u3", "sn": "DEMO3", "unitKind": "sn", "status": "ip", "createdBy": "DEMO", "createdDT": created_dt, "comments": []},
        {"id": "demo-u4", "sn": "DEMO4", "unitKind": "sn", "status": "bloque", "createdBy": "DEMO", "createdDT": created_dt, "remarque": "Cas de démonstration bloqué", "comments": []},
        {"id": "demo-u5", "sn": "DEMO5", "unitKind": "sn", "status": "termine", "createdBy": "DEMO", "createdDT": created_dt, "comments": []},
    ]
    header = {
        "id": OF_ID,
        "of": "Demo",
        "typeOF": "production",
        "status": "en_cours",
        "codeArticle": "123456789",
        "description": "Article Demo",
        "otp": "SP-F0001",
        "createdBy": "DEMO",
        "createdDT": created_dt,
        "comments": [comment("demo-header-comment", "Dossier de démonstration : les données ne correspondent pas à une fabrication réelle.")],
        "_snRows": units,
    }

    common_rework = {
        "createdVisa": "DEMO",
        "validated": True,
        "fiche": "DOC-0013405_1",
        "etape": "0010",
        "ficheOpUpdatedAt": 1792742400000,
        "visaOper": "DEMO",
        "dateOper": "23/10/2026",
        "tracaOk": True,
        "visaTraca": "DEMO",
        "dateTraca": "23/10/2026 08:20",
        "comments": [],
        "editHistory": [],
    }
    rework_rows = [
        {**common_rework, **scoped("demo-u1"), "id": "demo-r-s", "createdDT": "23/10/2026 08:00", "repere": "R100", "qty": "1", "action1": "S", "codeERP": "2250000100", "valeur": "10 kOhm", "lot": "0000012345", "dc": "2026-40", "sn": "CMP-DEMO-001", "isAdjust": False, "visaCtrl": "CTRL", "dateCtrl": "23/10/2026 08:30"},
        {**common_rework, **scoped("demo-u1"), "id": "demo-r-d", "createdDT": "23/10/2026 08:40", "repere": "C100", "qty": "1", "action1": "D", "codeERP": "2250000200", "valeur": "100 nF mesuré 98 nF", "lot": "0000054321", "dc": "2025-48", "sn": "CMP-DEMO-002", "isAdjust": True, "remarques": "Composant dessoudé et conservé sur la feuille composants."},
        {**common_rework, **scoped("demo-u2"), "id": "demo-r-m", "createdDT": "23/10/2026 09:00", "repere": "U10", "qty": "1", "action1": "M", "codeERP": "2250000300", "valeur": "Circuit intégré", "lot": "0000077777", "dc": "2026-12", "sn": "IC-DEMO-003", "isAdjust": False},
        {**common_rework, **scoped("demo-u3"), "id": "demo-r-p", "createdDT": "23/10/2026 09:15", "repere": "TP5", "qty": "1", "action1": "P", "codeERP": "", "valeur": "Pointé, non soudé", "lot": "", "dc": "", "sn": "", "isAdjust": True},
        {**common_rework, **scoped("demo-u4"), "id": "demo-r-r", "createdDT": "23/10/2026 09:30", "repere": "R205", "qty": "1", "action1": "R", "codeERP": "2250000400", "valeur": "4,7 kOhm", "lot": "0000099999", "dc": "2026-08", "sn": "", "isAdjust": True, "visaCtrl": "CTRL", "dateCtrl": "23/10/2026 09:45"},
        {**common_rework, **scoped("demo-u5"), "id": "demo-r-o", "createdDT": "23/10/2026 10:00", "repere": "C250", "qty": "", "action1": "O", "codeERP": "", "valeur": "", "lot": "", "dc": "", "sn": "", "isAdjust": False, "remarques": "Observation longue de démonstration : légère marque visuelle constatée sur le composant, sans impact fonctionnel. Décision prise de conserver le composant en l'état après contrôle.", "comments": [comment("demo-r-o-comment", "Observation relue et acceptée pour la démonstration.", "23/10/2026 10:05")]},
        {**common_rework, **scoped("demo-u2"), "id": "demo-r-cancelled", "createdDT": "22/10/2026 16:00", "repere": "R999", "qty": "1", "action1": "S", "codeERP": "2250099999", "valeur": "Ligne annulée", "lot": "LOT-ANNULE", "dc": "2024-01", "sn": "", "isAdjust": False, "deleted": True, "deletedReason": "Erreur de saisie volontaire pour la démonstration", "deletedVisa": "DEMO", "deletedDate": "22/10/2026 16:10"},
        {**scoped("demo-u3"), "id": "demo-r-import", "createdVisa": "", "createdDT": "", "validated": False, "repere": "R300", "qty": "1", "action1": "S", "codeERP": "2250000500", "valeur": "22 kOhm", "lot": "", "dc": "", "sn": "", "fiche": "DOC-0013405_1", "etape": "0020", "isAdjust": False, "visaOper": "", "dateOper": "", "visaCtrl": "", "dateCtrl": "", "remarques": "Brouillon importé à compléter par l'opérateur", "tracaOk": False, "visaTraca": "", "dateTraca": "", "comments": [], "editHistory": [], "importOrigin": {"source": "clipboard", "batchId": "DEMO-IMPORT", "rowNumber": 2, "importedBy": "DEMO", "importedAt": created_dt, "modifiedBy": "", "modifiedAt": "", "originalFields": {}}},
    ]

    conso_ops = [
        {"id": "demo-conso-flux", **scoped("demo-u1"), "createdVisa": "DEMO", "createdDT": "23/10/2026 08:10", "fiche": "DOC-0013405_1", "op": "0010", "validated": True, "comments": [], "items": [
            {"id": "demo-conso-flux-item", "createdVisa": "DEMO", "createdDT": "23/10/2026 08:10", "consoId": "fx1", "echantillon": "", "lot": "0000020231", "dp": "31.12.26", "remarque": "Flux utilisé pour la reprise R100", "tracaOk": True, "visaTraca": "DEMO", "dateTraca": "23/10/2026 08:15", "validated": True, "comments": []},
            {"id": "demo-conso-solder-item", "createdVisa": "DEMO", "createdDT": "23/10/2026 08:12", "consoId": "sd2", "echantillon": "", "lot": "0000020452", "dp": "30.06.27", "remarque": "Soudure Sn63Pb37", "tracaOk": True, "visaTraca": "DEMO", "dateTraca": "23/10/2026 08:16", "validated": True, "comments": []},
        ]},
        {"id": "demo-conso-glue", **scoped("demo-u2"), "createdVisa": "DEMO", "createdDT": "22/10/2026 14:00", "fiche": "DOC-0013405_1", "op": "0020", "validated": True, "comments": [], "items": [
            {"id": "demo-conso-glue-item", "createdVisa": "DEMO", "createdDT": "22/10/2026 14:00", "consoId": "k6", "echantillon": "ECH-DEMO-01", "lot": "LOT-CV1152-DEMO", "dp": "15.01.27", "remarque": "Coating avec date de polymérisation disponible", "tracaOk": True, "visaTraca": "DEMO", "dateTraca": "22/10/2026 14:05", "validated": True, "comments": [comment("demo-conso-comment", "Échantillon commun utilisé sur DEMO2.", "22/10/2026 14:05")]},
        ]},
        {"id": "demo-conso-draft", **scoped("demo-u4"), "createdVisa": "DEMO", "createdDT": "23/10/2026 10:20", "fiche": "DOC-0013405_1", "op": "0030", "validated": False, "comments": [], "items": [
            {"id": "demo-conso-draft-item", "createdVisa": "DEMO", "createdDT": "23/10/2026 10:20", "consoId": "k1", "echantillon": "", "lot": "", "dp": "", "remarque": "Brouillon volontairement incomplet", "tracaOk": False, "visaTraca": "", "dateTraca": "", "validated": False, "comments": []},
        ]},
    ]

    equipment_rows = [
        {"id": "demo-eq-four", **scoped("demo-u1"), "createdVisa": "DEMO", "createdDT": "23/10/2026 07:45", "visa": "DEMO", "checkDate": "23/10/2026", "nInv": "FOUR-DEMO-01", "type": "Four", "designation": "Four de démonstration", "dateExpiration": "2027-12", "isFour": True, "validated": True, "comments": []},
        {"id": "demo-eq-valid", **scoped("demo-u2"), "createdVisa": "DEMO", "createdDT": "23/10/2026 07:50", "visa": "DEMO", "checkDate": "23/10/2026", "nInv": "INV-DEMO-OK", "type": "Multimètre", "designation": "Multimètre calibré", "dateExpiration": "2027-06", "isFour": False, "validated": True, "comments": []},
        {"id": "demo-eq-expired", **scoped("demo-u4"), "createdVisa": "DEMO", "createdDT": "23/10/2026 07:55", "visa": "DEMO", "checkDate": "23/10/2026", "nInv": "INV-DEMO-HS", "type": "Ohmmètre", "designation": "Appareil hors calibration", "dateExpiration": "2025-06", "isFour": False, "validated": True, "comments": [comment("demo-eq-comment", "Cas d'alerte hors calibration.", "23/10/2026 07:56")]},
    ]

    oven_rows = [
        {"id": "demo-oven-complete", **scoped("demo-u1"), "createdVisa": "DEMO", "createdDT": "21/10/2026 08:00", "fourN": "FOUR-DEMO-01", "duree": "2", "temp": "60", "entreeVisa": "DEMO", "entreeDT": "21/10/2026 08:00", "sortieVisa": "CTRL", "sortieDT": "21/10/2026 10:00", "validated": True, "comments": []},
        {"id": "demo-oven-running", **scoped("demo-u2"), "createdVisa": "DEMO", "createdDT": "23/10/2026 06:00", "fourN": "", "duree": "72", "temp": "85", "entreeVisa": "DEMO", "entreeDT": "23/10/2026 06:00", "sortieVisa": "", "sortieDT": "", "validated": True, "comments": [comment("demo-oven-comment", "Four non renseigné volontairement : durée et température restent présentes.", "23/10/2026 06:05")]},
        {"id": "demo-oven-draft", **scoped("demo-u3"), "createdVisa": "DEMO", "createdDT": "23/10/2026 10:30", "fourN": "", "duree": "", "temp": "", "entreeVisa": "", "entreeDT": "", "sortieVisa": "", "sortieDT": "", "validated": False, "validError": "Requis : Durée [H], Temp [°C]", "comments": []},
    ]

    facts_rows = [
        {"id": "demo-fact-nc", **scoped("demo-u1"), "createdVisa": "DEMO", "createdDT": "22/10/2026 09:00", "type": "NC", "numero": "NC-DEMO-001", "visa": "DEMO", "date": "22/10/2026", "lien": "", "commentaires": "Non-conformité ouverte de démonstration", "closedVisa": "", "closedDate": "", "validated": True, "comments": []},
        {"id": "demo-fact-dm", **scoped("demo-u2"), "createdVisa": "DEMO", "createdDT": "22/10/2026 09:15", "type": "DM", "numero": "DM-DEMO-001", "visa": "DEMO", "date": "22/10/2026", "lien": "", "commentaires": "Demande de modification clôturée", "closedVisa": "CTRL", "closedDate": "23/10/2026", "validated": True, "comments": []},
        {"id": "demo-fact-iss", **scoped("demo-u3"), "createdVisa": "DEMO", "createdDT": "22/10/2026 09:30", "type": "ISS", "numero": "ISS-DEMO-001", "visa": "DEMO", "date": "22/10/2026", "lien": "", "commentaires": "Information technique à prendre en compte", "closedVisa": "", "closedDate": "", "validated": True, "comments": [comment("demo-fact-comment", "Commentaire complémentaire sur le suivi technique.", "22/10/2026 09:35")]},
        {"id": "demo-fact-ow-open", **scoped("demo-u4"), "createdVisa": "DEMO", "createdDT": "22/10/2026 10:00", "type": "OW", "numero": "OW001", "visa": "DEMO", "date": "22/10/2026", "lien": "", "commentaires": "Open Work ouvert : reprise à terminer", "closedVisa": "", "closedDate": "", "validated": True, "comments": []},
        {"id": "demo-fact-ow-closed", **scoped("demo-u5"), "createdVisa": "DEMO", "createdDT": "20/10/2026 10:00", "type": "OW", "numero": "OW002", "visa": "DEMO", "date": "20/10/2026", "lien": "", "commentaires": "Open Work clôturé", "closedVisa": "CTRL", "closedDate": "21/10/2026", "validated": True, "comments": []},
        {"id": "demo-fact-deleted", **scoped("demo-u5"), "createdVisa": "DEMO", "createdDT": "20/10/2026 11:00", "type": "ISS", "numero": "ISS-DEMO-ANNULE", "visa": "DEMO", "date": "20/10/2026", "lien": "", "commentaires": "Suivi annulé visible en God mode", "closedVisa": "", "closedDate": "", "validated": True, "deleted": True, "deletedReason": "Doublon volontaire de démonstration", "deletedVisa": "DEMO", "deletedDate": "20/10/2026 11:05", "comments": []},
    ]

    connectors = [
        {"id": "demo-j1-u1", **scoped("demo-u1"), "nConect": "J1", "validated": True, "createdVisa": "DEMO", "createdDT": "23/10/2026 08:00", "comments": [], "events": [
            {"id": "demo-j1-u1-d", "dt": "23/10/2026 08:05", "visa": "DEMO", "action": "Demating", "remarque": "Déconnexion avant reprise", "comments": []},
            {"id": "demo-j1-u1-m", "dt": "23/10/2026 09:50", "visa": "DEMO", "action": "Mating", "remarque": "Reconnexion après contrôle", "comments": []},
        ]},
        {"id": "demo-j2-u2", **scoped("demo-u2"), "nConect": "J2", "validated": True, "createdVisa": "DEMO", "createdDT": "23/10/2026 08:10", "comments": [], "events": [
            {"id": "demo-j2-u2-d", "dt": "23/10/2026 08:15", "visa": "DEMO", "action": "Demating", "remarque": "Connecteur actuellement démonté", "comments": []},
        ]},
        {"id": "demo-j3-u3", **scoped("demo-u3"), "nConect": "J3", "validated": True, "createdVisa": "DEMO", "createdDT": "23/10/2026 08:20", "comments": [], "events": []},
    ]

    document = {
        "header": header,
        "units": {"mode": "multi", "rows": units},
        "rework": {"rows": rework_rows},
        "consommables": {"ops": conso_ops},
        "testequip": {"rows": equipment_rows},
        "faits": {"rows": facts_rows},
        "etuvage": {"rows": oven_rows},
        "demating": {"connectors": connectors},
        "openwork": {"rows": []},
        "lotSplits": [],
    }
    entry = {**header, "_snRows": units}
    return entry, document


def create_demo(replace: bool = False) -> None:
    entry, document = build_demo_document()
    with server.connect_db("postgresql-env") as conn:
        server.begin_write(conn)
        existing_document = server.read_document(conn, DOCUMENT_KEY)
        list_record = server.read_document(conn, "of-list")
        listing = list(list_record[0]) if list_record and isinstance(list_record[0], list) else []
        duplicate = next((row for row in listing if str(row.get("of", "")).strip().lower() == "demo"), None)
        if (existing_document or duplicate) and not replace:
            raise RuntimeError("Un OF Demo existe déjà. Utilisez --replace pour le remplacer explicitement.")

        listing = [row for row in listing if row.get("id") != OF_ID and str(row.get("of", "")).strip().lower() != "demo"]
        listing.append(entry)
        document_revision = server.write_document(
            conn,
            DOCUMENT_KEY,
            document,
            expected=existing_document[1] if existing_document else 0,
            enforce=True,
        )
        list_revision = server.write_document(
            conn,
            "of-list",
            listing,
            expected=list_record[1] if list_record else 0,
            enforce=True,
        )
        server.queue_upsert(conn, DOCUMENT_KEY, document, document_revision)
        server.queue_upsert(conn, "of-list", listing, list_revision)
        conn.commit()

    print(f"OF Demo créé : {len(document['units']['rows'])} SN, clé {DOCUMENT_KEY}, révision {document_revision}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Créer l'OF complet de démonstration SP-F001A")
    parser.add_argument("--replace", action="store_true", help="Remplacer un OF Demo déjà présent")
    args = parser.parse_args()
    create_demo(replace=args.replace)
