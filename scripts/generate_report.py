#!/usr/bin/env python3
"""Generate a clean SP-F001A PDF report from an exported JSON file.

Usage:
  python scripts/generate_report.py path/to/SP-F001A_123_rapport.json
  python scripts/generate_report.py path/to/report.json --output output/pdf/report.pdf
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Flowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ORANGE = colors.HexColor("#e05c00")
BLUE = colors.HexColor("#1f6feb")
GREEN = colors.HexColor("#238636")
RED = colors.HexColor("#da3633")
YELLOW = colors.HexColor("#d29922")
INK = colors.HexColor("#111827")
MUTED = colors.HexColor("#4b5563")
LINE = colors.HexColor("#cbd5e1")
SOFT = colors.HexColor("#f8fafc")
SOFT_BLUE = colors.HexColor("#eff6ff")
SOFT_RED = colors.HexColor("#fee2e2")


def clean(value: Any) -> str:
    text = "" if value is None else str(value)
    text = text.replace("\u2192", "->").replace("\u2260", "!=")
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    return text if text.strip() else "-"


def safe_name(value: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9_-]+", "_", value.strip())
    return value.strip("_") or "rapport"


def row_deleted(row: dict[str, Any]) -> bool:
    return bool(row.get("deleted"))


def history_lines(row: dict[str, Any]) -> list[str]:
    out: list[str] = []
    for h in row.get("editHistory") or []:
        changes = []
        for c in h.get("changes") or []:
            changes.append(f'{clean(c.get("label"))}: "{clean(c.get("from"))}" -> "{clean(c.get("to"))}"')
        if changes:
            out.append(f'Modifie le {clean(h.get("dt"))} par {clean(h.get("visa"))} - ' + " ; ".join(changes))
    return out


def deleted_line(row: dict[str, Any]) -> str | None:
    if not row_deleted(row):
        return None
    return (
        f'Annule le {clean(row.get("deletedDate"))} par {clean(row.get("deletedVisa"))} - '
        f'Motif: {clean(row.get("deletedReason"))}'
    )


def visa_stamp(visa: Any, date_time: Any) -> str:
    parts = [clean(value) for value in (visa, date_time)]
    parts = [part for part in parts if part != "-"]
    return " - ".join(parts) if parts else "-"


class HeaderRule(Flowable):
    def __init__(self, width: float, color=ORANGE):
        super().__init__()
        self.width = width
        self.height = 2
        self.color = color

    def draw(self) -> None:
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(1.4)
        self.canv.line(0, 0, self.width, 0)


class ReportBuilder:
    def __init__(self, payload: dict[str, Any], output: Path):
        self.payload = payload
        self.of_data = payload.get("ofData") or {}
        self.header = self.of_data.get("header") or {}
        self.lists = payload.get("lists") or {}
        self.sn_rows = [
            unit for unit in (self.of_data.get("units", {}).get("rows") or [])
            if not unit.get("deleted") and clean(unit.get("sn")) != "-"
        ]
        self.output = output
        self.page_width = landscape(A4)[0] - 20 * mm
        self.styles = getSampleStyleSheet()
        self.styles.add(
            ParagraphStyle(
                "Small",
                parent=self.styles["Normal"],
                fontName="Helvetica",
                fontSize=6.7,
                leading=8,
                textColor=INK,
                alignment=TA_LEFT,
            )
        )
        self.styles.add(
            ParagraphStyle(
                "TinyMuted",
                parent=self.styles["Small"],
                fontSize=5.8,
                leading=7,
                textColor=MUTED,
            )
        )
        self.styles.add(
            ParagraphStyle(
                "Section",
                parent=self.styles["Heading2"],
                fontName="Helvetica-Bold",
                fontSize=12,
                leading=14,
                textColor=ORANGE,
                spaceBefore=4,
                spaceAfter=5,
            )
        )

    def p(self, text: Any, style: str = "Small") -> Paragraph:
        return Paragraph(clean(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), self.styles[style])

    def build(self) -> None:
        self.output.parent.mkdir(parents=True, exist_ok=True)
        doc = SimpleDocTemplate(
            str(self.output),
            pagesize=landscape(A4),
            leftMargin=10 * mm,
            rightMargin=10 * mm,
            topMargin=10 * mm,
            bottomMargin=9 * mm,
            title=f"SP-F001A - OF {clean(self.header.get('of'))}",
        )
        story: list[Any] = []
        self.add_cover(story, doc.width)
        sections = [
            ("Adjust / Rework", self.section_rework),
            ("Consommables", self.section_consommables),
            ("Test Equip.", self.section_test_equip),
            ("Faits", self.section_faits),
            ("Etuvages", self.section_etuvage),
            ("Matting / Dematting", self.section_demating),
            ("Open Work", self.section_openwork),
        ]
        for i, (title, fn) in enumerate(sections):
            if i:
                story.append(PageBreak())
            self.add_section_header(story, title, doc.width)
            fn(story, doc.width)
        doc.build(story, onFirstPage=self.footer, onLaterPages=self.footer)

    def footer(self, canvas, doc) -> None:
        canvas.saveState()
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MUTED)
        canvas.drawString(10 * mm, 6 * mm, f"SP-F001A - OF {clean(self.header.get('of'))}")
        canvas.drawRightString(287 * mm, 6 * mm, f"Page {doc.page}")
        canvas.restoreState()

    def add_cover(self, story: list[Any], width: float) -> None:
        story.append(Paragraph("Rapport complet SP-F001A", ParagraphStyle(
            "TitleCustom", parent=self.styles["Title"], fontName="Helvetica-Bold",
            fontSize=22, leading=26, textColor=INK
        )))
        story.append(HeaderRule(width))
        story.append(Spacer(1, 5 * mm))
        h = self.header
        meta = [
            ["OF", clean(h.get("of")), "Projet", clean(h.get("projet") or h.get("otp"))],
            ["SN composant", clean(h.get("sn")), "LOT", clean(h.get("lot"))],
            ["SN produit fini", clean(h.get("snProduitFini")), "Statut", clean(h.get("status") or "en_cours")],
            ["Code article", clean(h.get("codeArticle")), "Description", clean(h.get("description"))],
            ["Export", clean(self.payload.get("exportedAt")), "Operateur", clean(self.payload.get("exportedBy"))],
        ]
        story.append(self.table(meta, [28 * mm, 78 * mm, 32 * mm, 116 * mm], header=False))
        comments = h.get("comments") or []
        if comments:
            story.append(Spacer(1, 4 * mm))
            story.append(self.p("Commentaires dossier", "Section"))
            for c in comments:
                story.append(self.p(f'{clean(c.get("dt"))} - {clean(c.get("visa"))}: {clean(c.get("text"))}'))
        story.append(PageBreak())

    def add_section_header(self, story: list[Any], title: str, width: float) -> None:
        h = self.header
        story.append(KeepTogether([
            Paragraph(title, self.styles["Section"]),
            self.table(
                [[
                    "OF", h.get("of"), "Article OF", h.get("codeArticle") or h.get("description"),
                    "SN / LOT", f"{clean(h.get('sn'))} / {clean(h.get('lot'))}",
                ]],
                [14 * mm, 34 * mm, 27 * mm, 74 * mm, 22 * mm, 56 * mm],
                header=False,
                small=True,
            ),
            Spacer(1, 2 * mm),
        ]))

    def sn_title(self, unit: dict[str, Any]) -> str:
        lot = clean(unit.get("lot"))
        return f"{clean(unit.get('sn'))}{'' if lot == '-' else ' - LOT ' + lot}"

    def sn_scope_label(self, row: dict[str, Any]) -> str:
        ids = [x for x in (row.get("snIds") or []) if x]
        if not ids and row.get("unitId"):
            ids = [row.get("unitId")]
        ids = list(dict.fromkeys(ids))
        ids = [x for x in ids if any(unit.get("id") == x for unit in self.sn_rows)]
        if row.get("snScope") == "custom" or ids:
            labels = [self.sn_title(unit) for unit in self.sn_rows if unit.get("id") in ids]
            if len(labels) > 2:
                return f"{len(labels)} SN"
            return " + ".join(labels) if labels else "SN ?"
        return "Tous"

    def table(self, rows: list[list[Any]], widths: list[float], header=True, small=False) -> Table:
        if sum(widths) < self.page_width * 0.9:
            ratio = self.page_width / sum(widths)
            widths = [w * ratio for w in widths]
        data = [[self.p(cell, "TinyMuted" if small else "Small") for cell in row] for row in rows]
        table = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
        style = [
            ("GRID", (0, 0), (-1, -1), 0.35, LINE),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 3),
            ("RIGHTPADDING", (0, 0), (-1, -1), 3),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ]
        if header:
            style += [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e5e7eb")),
                ("TEXTCOLOR", (0, 0), (-1, 0), INK),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ]
        table.setStyle(TableStyle(style))
        return table

    def add_rows_with_trace(self, story: list[Any], table_rows: list[list[Any]], widths: list[float]) -> None:
        if len(table_rows) == 1:
            story.append(self.p("Aucune ligne.", "TinyMuted"))
            return
        story.append(self.table(table_rows, widths))

    def section_rework(self, story: list[Any], width: float) -> None:
        rows = [["Date", "Visa", "SN cible", "Repere", "Adj", "Action", "Code", "Valeur", "LOT", "DC", "SN", "Fiche", "Etape", "Ctrl", "Traca", "Trace"]]
        for r in self.of_data.get("rework", {}).get("rows") or []:
            trace = []
            trace.extend(history_lines(r))
            dl = deleted_line(r)
            if dl:
                trace.append(dl)
            rows.append([
                r.get("createdDT"), r.get("createdVisa"), self.sn_scope_label(r), r.get("repere"),
                "Oui" if r.get("isAdjust") else "Non", r.get("action1"), r.get("codeERP"), r.get("valeur"),
                r.get("lot"), r.get("dc"), r.get("sn"), r.get("fiche"), r.get("etape"),
                visa_stamp(r.get("visaCtrl"), r.get("dateCtrl")),
                visa_stamp(r.get("visaTraca"), r.get("dateTraca")),
                "\n".join(trace),
            ])
        self.add_rows_with_trace(story, rows, [22, 16, 24, 24, 14, 16, 29, 25, 22, 19, 18, 24, 15, 26, 26, 72])

    def section_consommables(self, story: list[Any], width: float) -> None:
        conso_map = {c.get("id"): f"{clean(c.get('sap'))} - {clean(c.get('label'))}" for c in self.lists.get("consommables") or []}
        rows = [["Fiche", "Op.", "SN cible", "Date", "Visa", "Consommable", "LOT", "DP", "Traca", "Trace"]]
        for op in self.of_data.get("consommables", {}).get("ops") or []:
            op_trace = "; ".join(history_lines(op) + ([deleted_line(op)] if deleted_line(op) else []))
            items = op.get("items") or []
            if not items:
                rows.append([op.get("fiche"), op.get("op"), self.sn_scope_label(op), op.get("createdDT"), op.get("createdVisa"), "-", "-", "-", "-", op_trace])
            for it in items:
                trace = history_lines(it)
                if op_trace:
                    trace.insert(0, "Operation: " + op_trace)
                dl = deleted_line(it)
                if dl:
                    trace.append(dl)
                rows.append([
                    op.get("fiche"), op.get("op"), self.sn_scope_label(op), it.get("createdDT"), it.get("createdVisa"),
                    conso_map.get(it.get("consoId"), it.get("consoId")), it.get("lot"), it.get("dp"),
                    visa_stamp(it.get("visaTraca"), it.get("dateTraca")), "\n".join(trace),
                ])
        self.add_rows_with_trace(story, rows, [24, 14, 26, 24, 16, 68, 28, 22, 26, 82])

    def section_test_equip(self, story: list[Any], width: float) -> None:
        rows = [["Date", "Visa", "SN cible", "Four", "N INV", "Type", "Designation", "Date calib", "Ctrl", "Trace"]]
        for r in self.of_data.get("testequip", {}).get("rows") or []:
            trace = history_lines(r)
            dl = deleted_line(r)
            if dl:
                trace.append(dl)
            rows.append([r.get("createdDT"), r.get("createdVisa"), self.sn_scope_label(r), "Oui" if r.get("isFour") else "Non", r.get("nInv"), r.get("type"), r.get("designation"), r.get("dateExpiration"), r.get("checkDate"), "\n".join(trace)])
        self.add_rows_with_trace(story, rows, [25, 16, 26, 15, 28, 28, 60, 28, 25, 96])

    def section_faits(self, story: list[Any], width: float) -> None:
        rows = [["Date", "Visa", "SN cible", "Type", "Numero", "Date ouv.", "Lien", "Commentaires", "Date clot.", "Visa clot.", "Trace"]]
        for r in self.of_data.get("faits", {}).get("rows") or []:
            trace = history_lines(r)
            dl = deleted_line(r)
            if dl:
                trace.append(dl)
            rows.append([r.get("createdDT"), r.get("createdVisa"), self.sn_scope_label(r), r.get("type"), r.get("numero"), r.get("date"), r.get("lien"), r.get("commentaires"), r.get("closedDate"), r.get("closedVisa"), "\n".join(trace)])
        self.add_rows_with_trace(story, rows, [24, 16, 26, 18, 28, 24, 55, 58, 24, 18, 77])

    def section_etuvage(self, story: list[Any], width: float) -> None:
        rows = [["Date", "Visa", "SN cible", "Four", "Duree", "Temp", "Entree", "Visa E", "Sortie", "Visa S", "Trace"]]
        for r in self.of_data.get("etuvage", {}).get("rows") or []:
            trace = history_lines(r)
            dl = deleted_line(r)
            if dl:
                trace.append(dl)
            rows.append([r.get("createdDT"), r.get("createdVisa"), self.sn_scope_label(r), r.get("fourN"), r.get("duree"), r.get("temp"), r.get("entreeDT"), r.get("entreeVisa"), r.get("sortieDT"), r.get("sortieVisa"), "\n".join(trace)])
        self.add_rows_with_trace(story, rows, [25, 16, 26, 25, 18, 18, 34, 18, 34, 18, 115])

    def section_demating(self, story: list[Any], width: float) -> None:
        rows = [["Connecteur", "SN cible", "Date", "Visa", "Action", "Cycle", "Trace"]]
        for c in self.of_data.get("demating", {}).get("connectors") or []:
            conn_trace = "; ".join(history_lines(c) + ([deleted_line(c)] if deleted_line(c) else []))
            events = c.get("events") or []
            if not events:
                rows.append([c.get("nConect"), self.sn_scope_label(c), "-", "-", "-", "-", conn_trace])
            for idx, ev in enumerate(events, start=1):
                trace = []
                if conn_trace:
                    trace.append("Connecteur: " + conn_trace)
                dl = deleted_line(ev)
                if dl:
                    trace.append(dl)
                rows.append([c.get("nConect"), self.sn_scope_label(c), ev.get("dt"), ev.get("visa"), ev.get("action"), idx / 2, "\n".join(trace)])
        self.add_rows_with_trace(story, rows, [32, 28, 32, 18, 30, 18, 142])

    def section_openwork(self, story: list[Any], width: float) -> None:
        rows = [["Date", "Visa", "SN cible", "N OW", "Description", "Ouverture", "Cloture", "Commentaires", "Trace"]]
        for r in self.of_data.get("openwork", {}).get("rows") or []:
            trace = history_lines(r)
            dl = deleted_line(r)
            if dl:
                trace.append(dl)
            rows.append([r.get("createdDT"), r.get("createdVisa"), self.sn_scope_label(r), r.get("nOW"), r.get("description"), f'{clean(r.get("openDate"))} / {clean(r.get("openVisa"))}', f'{clean(r.get("closedDate"))} / {clean(r.get("closedVisa"))}', r.get("commentaires"), "\n".join(trace)])
        self.add_rows_with_trace(story, rows, [25, 16, 26, 15, 74, 38, 38, 62, 74])


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate SP-F001A PDF report from exported JSON.")
    parser.add_argument("json_file", type=Path)
    parser.add_argument("--output", "-o", type=Path)
    args = parser.parse_args()

    payload = json.loads(args.json_file.read_text(encoding="utf-8-sig"))
    of_data = payload.get("ofData") or {}
    header = of_data.get("header") or {}
    output = args.output
    if output is None:
        output = Path("output/pdf") / f"SP-F001A_OF_{safe_name(clean(header.get('of')))}_rapport.pdf"

    ReportBuilder(payload, output).build()
    print(output.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
