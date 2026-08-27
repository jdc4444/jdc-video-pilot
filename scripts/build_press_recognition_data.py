#!/usr/bin/env python3
"""Build project-page press data from the selected recognition review page."""

from __future__ import annotations

import json
from pathlib import Path

from bs4 import BeautifulSoup


SOURCE = Path(
    "/Users/alphaone/Documents/Code/fin_v1/output/html/"
    "Jos_Diaz_Contreras_Selected_Press_Recognition.html"
)
OUTPUT = Path(__file__).resolve().parents[1] / "jdc-press-recognition-pilot53.js"
ROUTES = {
    "Bon Iver — Day One": "/day-one",
    "Celeste — Everyday": "/celeste-everyday",
    "Netflix — The Kings of Tupelo": "/kings-of-tupelo",
    "Hulu — Black Twitter: A People’s History": "/black-twitter",
    "Wynn — Awakening: The First Day": "/wynn-awakening",
    "Spotify — Hip Hop Classics": "/spotify-hip-hop-classics-1",
    "HBO — Shaq": "/shaq-hbo",
    "Amber Mark — Out of This World": "/amber-mark-out-of-this-world",
    "Kelsey Lu & Boys Noize — Ride or Die": "/kelsey-lu-boys-noize-ride-or-die",
    "Bright Eyes — Mariana Trench": "/bright-eyes-mariana-trench",
    "Thom Yorke — Last I Heard (…He Was Circling the Drain)": "/thom-yorke-last-i-heard",
    "Mitski — A Pearl": "/mitski-a-pearl",
    "Gabriel Garzón-Montano — Agüita": "/ggm-aguita",
    "Diamond Terrifier — Action Fortress": "/diamond-terrifier-action-fortress",
    "U2 — You’re the Best Thing About Me (Lyric Video)": "/u2-the-best-thing-about-me",
    "Bombas — Dream of Comfort": "/bombas-dream-of-comfort",
}


def build() -> dict[str, object]:
    soup = BeautifulSoup(SOURCE.read_text(encoding="utf-8"), "html.parser")
    projects: dict[str, object] = {}
    for article in soup.select("article.project"):
        heading = article.select_one("h2")
        if not heading:
            continue
        title = heading.get_text(" ", strip=True)
        route = ROUTES.get(title)
        if not route:
            raise RuntimeError(f"Missing route for {title!r}")
        fields = []
        for field in article.select(".field"):
            label_node = field.select_one(".field-label")
            label = label_node.get_text(" ", strip=True) if label_node else ""
            links = [
                {"label": link.get_text(" ", strip=True), "url": link.get("href", "")}
                for link in field.select(".link-line a[href]")
            ]
            if links:
                fields.append({"label": label, "links": links})
        quotes = []
        for entry in article.select(".quote-entry"):
            paragraphs = entry.select(".quote-copy p")
            quote = " ".join(node.get_text(" ", strip=True) for node in paragraphs)
            source_node = entry.select_one("blockquote footer")
            source = source_node.get_text(" ", strip=True) if source_node else ""
            if quote:
                quotes.append({"text": quote, "source": source})
        projects[route] = {"title": title, "fields": fields, "quotes": quotes}
    return projects


def main() -> None:
    payload = json.dumps(build(), ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text(
        "window.JDC_PRESS_RECOGNITION = " + payload + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
