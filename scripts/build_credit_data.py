#!/usr/bin/env python3
"""Build canonical, names-first credits for every homepage project page."""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup


ORIGIN = "https://www.josdiazcontreras.com"
OUTPUT = Path(__file__).resolve().parents[1] / "jdc-credit-data-pilot54.js"
ROUTES = [
    "/day-one",
    "/lovb-adidas",
    "/bombas-dream-of-comfort",
    "/polymarket-documentary",
    "/bombas-spring",
    "/alignment-documentary",
    "/nike-aja-sabrina",
    "/siberia-hills",
    "/ggm-aguita",
    "/wynn-awakening",
    "/amber-mark-out-of-this-world",
    "/thom-yorke-last-i-heard",
    "/polymarket-make-your-own-market",
    "/nike-jordan",
    "/shaq-hbo",
    "/bright-eyes-mariana-trench",
    "/kings-of-tupelo",
    "/celeste-everyday",
    "/spotify-hip-hop-classics-1",
    "/armando-young-prizefighyer",
    "/kelsey-lu-boys-noize-ride-or-die",
    "/black-twitter",
    "/mitski-a-pearl",
    "/ggm-accoustic",
    "/kombilesa-mi-los-peinados",
    "/lovb-launch",
    "/diamond-terrifier-action-fortress",
    "/armando-young-belladonna",
    "/laufey-tour-visuals",
    "/dig-brand-identity",
    "/mtv-vote-early",
]

DESCRIPTION_FIRST = {
    "/bombas-dream-of-comfort",
    "/polymarket-documentary",
    "/alignment-documentary",
    "/siberia-hills",
    "/nike-jordan",
    "/kings-of-tupelo",
    "/black-twitter",
    "/lovb-launch",
    "/laufey-tour-visuals",
}

ROLE_RE = re.compile(
    r"\b(direct(?:or|ors|ed|ion)?|produc(?:er|ers|ed|tion)|prod co|executive|creative|"
    r"cinematograph(?:er|ers|y)|photograph(?:er|ers|y)|edit(?:or|ors|ed|ing)?|"
    r"design(?:er|ers|ed)?|animat(?:ion|ions|or|ors|ed)?|vfx|visual effects|"
    r"colou?r(?:ist|ists)?|music|compos(?:er|ers|ed)?|sound|audio|"
    r"stylist|stylists|styling|wardrobe|costume|hair|makeup|gaffer|electric|grip|"
    r"camera|operator|operators|assistant|assistants|agency|client|artist|artists|"
    r"featuring|cast|casting|choreograph(?:y|er|ers|ed)?|dancer|dancers|title|titles|"
    r"storyboard|storyboards|story|copywrit(?:er|ers|ing)?|label|"
    r"commission(?:er|ers|ed)?|post|supervisor|coordinator|manager|intern|interns|"
    r"modeler|modelers|illustration|illustrator|illustrators|compositing|simulation|"
    r"effects|assembly|research|curation|scout|consultant|diver|stand-in|special thanks|"
    r"artwork|script|type|dp|ep|pm|ad|ac|ae|slt|aclt|hmu|bts|bbg|bbe|pa|pas)\b",
    re.I,
)

ROLE_NORMALIZATION = {
    "directed": "Director",
    "co-directed": "Co-Director",
    "produced": "Producer",
    "co-produced": "Co-Producer",
    "executive produced": "Executive Producer",
    "co-executive produced": "Co-Executive Producer",
    "written": "Writer",
    "edited": "Editor",
    "designed": "Design",
    "animations": "Animation",
    "animation": "Animation",
    "cinematography": "Cinematography",
    "color": "Color",
    "styling + makeup": "Styling + Makeup",
    "audio mastering": "Audio Mastering",
    "artwork": "Artwork",
    "choreography": "Choreography",
    "set pas": "Set PA",
    "creative directors": "Creative Director",
    "art directors": "Art Director",
    "3d art directors": "3D Art Director",
    "2d animators": "2D Animator",
    "3d garment designers & modelers": "3D Garment Designer & Modeler",
}

LOVB_CREDITS = [
    ("League One Volleyball x Adidas Campaign", ""),
    ("Futuro LLC", "Production Company"),
    ("Jos Diaz", "Director & Executive Producer"),
    ("Jessica Flores", "Producer"),
    ("Jennifer Kim-Matsuzawa", "LOVB Producer"),
    ("Daniel Routh", "Director of Photography"),
    ("Michael Ciancio", "Camera Operator"),
    ("Justin Bowers", "Bolt Operator"),
    ("Michael Raphael Ciancio", "Phantom Operator"),
    ("Vincent Briseno", "Assistant Camera"),
    ("Ceasar Quintanilla", "Gaffer"),
    ("Billy Daniel", "Best Electric"),
    ("Jensen Tidwell", "Third Electric"),
    ("Pete Stockton", "Key Grip"),
    ("Sean Maxwell", "Best Grip"),
    ("Leo Talento", "Swing"),
    ("Gerald Morris", "Location Audio"),
    ("Dayna Bantz", "Hair and Makeup"),
    ("Sebastian Espinosa", "Stylist"),
    ("Karla Martinez", "Production Assistant"),
    ("Lexi Rodrigues", "Featuring"),
    ("Jordyn Poulter", "Featuring"),
    ("Clair Chaussee", "Featuring"),
    ("Jordan Thompson", "Featuring"),
    ("Tia Jimmerson", "Featuring"),
    ("Madi Skinner", "Featuring"),
]


def fetch_lines(route: str) -> list[str]:
    request = urllib.request.Request(
        ORIGIN + route,
        headers={"User-Agent": "Mozilla/5.0", "Cache-Control": "no-cache"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        soup = BeautifulSoup(response.read(), "html.parser")
    blocks = []
    for block in soup.select("main .fe-block"):
        lines = [" ".join(node.get_text(" ", strip=True).split()) for node in block.select(".sqs-html-content p")]
        lines = [line for line in lines if line]
        if lines:
            blocks.append(lines)
    if not blocks:
        raise RuntimeError(f"No credit block found for {route}")
    return max(blocks, key=len)


def normalize_role(value: str) -> str:
    clean = re.sub(r"\s+", " ", value).strip(" .:-–—")
    key = clean.lower()
    return ROLE_NORMALIZATION.get(key, clean)


def split_people(value: str) -> list[str]:
    clean = re.sub(r"\s+", " ", value).strip(" .")
    clean = re.sub(r",?\s+and\s+", ", ", clean, flags=re.I)
    clean = re.sub(r"\s+&\s+", ", ", clean)
    return [part.strip() for part in clean.split(",") if part.strip()]


def add_people(items: list[dict[str, str]], people: str | list[str], credit: str) -> None:
    names = split_people(people) if isinstance(people, str) else people
    for name in names:
        items.append({"name": name.strip(), "credit": normalize_role(credit)})


def add_description(items: list[dict[str, str]], text: str) -> None:
    items.append({"name": text.strip(), "credit": ""})


def role_score(value: str) -> int:
    return len(ROLE_RE.findall(value))


def parse_standard_line(line: str) -> list[dict[str, str]]:
    value = re.sub(r"\s+", " ", line).strip()
    if not value:
        return []

    featuring = re.match(r"^Featuring\s+(.+)$", value, re.I)
    if featuring:
        items: list[dict[str, str]] = []
        add_people(items, featuring.group(1), "Featuring")
        return items

    junior = re.match(r"^(Junior Designer)\s+(.+)$", value, re.I)
    if junior:
        return [{"name": junior.group(2).strip(" ."), "credit": junior.group(1)}]

    by = re.match(r"^(.{1,46}?)\s+by\s*:?[ ]*(.+)$", value, re.I)
    if by and role_score(by.group(1)):
        items = []
        add_people(items, by.group(2), by.group(1))
        return items

    separator = re.match(r"^(.+?)\s*(?:\.\.\.|\s[-–—]\s|\s*:\s*)\s*(.+)$", value)
    if separator:
        left, right = separator.group(1).strip(), separator.group(2).strip()
        left_score, right_score = role_score(left), role_score(right)
        items = []
        if left_score >= right_score and left_score:
            add_people(items, right, left)
            return items
        if right_score:
            add_people(items, left, right)
            return items

    return [{"name": value, "credit": ""}]


def parse_day_one(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    skip_next_bcam = False
    for line in lines:
        if line == "Producer - Danielle Wright Line":
            add_people(items, "Danielle Wright", "Line Producer")
        elif line == "Steadicam - Dan Wilard B-Cam":
            add_people(items, "Dan Wilard", "Steadicam")
            skip_next_bcam = True
        elif line == "1st AC - Philip Hoang" and skip_next_bcam:
            add_people(items, "Philip Hoang", "B-Cam 1st AC")
            skip_next_bcam = False
        elif line == "BBG - Thorn Shaffer B-Unit Gaffer - Trevor Dunnigan, Monty Sloan":
            add_people(items, "Thorn Shaffer", "BBG")
            add_people(items, ["Trevor Dunnigan", "Monty Sloan"], "B-Unit Gaffer")
        elif line == "AE - Josh Swieven, Dustin Foster Post":
            add_people(items, ["Josh Swieven", "Dustin Foster"], "AE")
        elif line == "EP - Ryan Turner Post Supervisor - Laurence Jacobs":
            add_people(items, "Ryan Turner", "Post EP")
            add_people(items, "Laurence Jacobs", "Post Supervisor")
        else:
            items.extend(parse_standard_line(line))
    return items


def parse_aguita(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    special = {
        "Dancers: Tania Cardona Laura Cano Jenny Restrepo Sara Uribe Kami Diaz Brahian Alvarez": [
            "Tania Cardona", "Laura Cano", "Jenny Restrepo", "Sara Uribe", "Kami Diaz", "Brahian Alvarez"
        ],
        "Medellin Cast UnoxUno: Valentina Fernandez Maria Jose Ramirez Raquel Zegarra Nico Moreno Felipe Bedoya Mauricio Espinal Andres Paz Mar Mejia": [
            "Valentina Fernandez", "Maria Jose Ramirez", "Raquel Zegarra", "Nico Moreno", "Felipe Bedoya", "Mauricio Espinal", "Andres Paz", "Mar Mejia"
        ],
        "Pereira Cast: Juanse Tabares Misael Vasco": ["Juanse Tabares", "Misael Vasco"],
    }
    for line in lines:
        if line in special:
            credit = "Dancer" if line.startswith("Dancers") else ("Medellin Cast" if line.startswith("Medellin") else "Pereira Cast")
            add_people(items, special[line], credit)
        elif line.startswith("Shot on location"):
            add_description(items, line)
        else:
            items.extend(parse_standard_line(line))
    return items


def parse_wynn(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_description(items, lines[0])
    add_people(items, ["Jos Diaz Contreras", "Santiago Carrasquilla"], "Director")
    add_people(items, ["Jos Diaz Contreras", "Kelly Sue DeConnick"], "Writer")
    add_people(items, ["Bernie Yuman", "Michael Curry"], "Co-Executive Producer")
    add_people(items, "Conor Hannon", "Co-Producer")
    add_people(items, "Brian Tyler", "Score")
    add_people(items, "Sara Jane Sherman", "Casting")
    add_people(items, "Claudia Jolly", "Darkness Voice")
    add_people(items, ["Angela Foster", "Mark Bracco", "Linda Gierahn"], "Executive Producer")
    add_people(items, ["Tom Pellegrini", "Troy Underwood", "Ines Palmas", "Baz Halpin", "Kelly Sue DeConnick"], "Producer")
    return items


def parse_thom(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_people(items, ["Jos Diaz Contreras", "Saad Moosajee", "Santiago Carrasquilla"], "Director")
    for line in lines[2:]:
        items.extend(parse_standard_line(line))
    return items


def parse_polymarket_commercial(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    items.extend(parse_standard_line(lines[0]))
    for name in lines[2:]:
        add_people(items, name, "Animation")
    return items


def parse_shaq(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_description(items, lines[0])
    headers = {"Creative Director", "Art Director", "Senior Animators", "Junior Animators", "Associate Art Directors"}
    current = ""
    for line in lines[1:]:
        if line in headers:
            current = line[:-1] if line.endswith("s") else line
        else:
            add_people(items, line, current)
    return items


def parse_prizefighter(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_people(items, ["Jos Diaz Contreras", "Santiago Carrasquilla"], "Director")
    add_people(items, ["Kazuki Ueda", "Sheri Yamanaka", "Sayuri Harling", "Alec & Syu from @Happy_Jpn"], "Featuring")
    for line in lines[2:-1]:
        items.extend(parse_standard_line(line))
    add_people(items, ["Ivan Cash", "Shane Busato", "The Tokyo American Club", "Jil Sander Tokyo", "Professor Matthew Waldman"], "Special Thanks")
    return items


def parse_kelsey(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_people(items, ["Jos Diaz Contreras", "Danae Gosset", "Danica Tan", "Art Camp"], "Director")
    for line in lines[2:]:
        items.extend(parse_standard_line(line))
    return items


def parse_mitski(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_people(items, ["Jos Diaz Contreras", "Saad Moosajee", "Art Camp"], "Director")
    for line in lines[2:]:
        items.extend(parse_standard_line(line))
    return items


def parse_belladonna(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for line in lines:
        if line == "Production Manager: Matt Knudsen Production":
            add_people(items, "Matt Knudsen", "Production Manager")
        elif line == "Coordinator: Matthew Kagen":
            add_people(items, "Matthew Kagen", "Production Coordinator")
        else:
            items.extend(parse_standard_line(line))
    return items


def parse_bombas_spring(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    add_description(items, "Web campaign")
    add_people(items, "Jos Diaz Contreras", "Director")
    add_people(items, "Jake Moore", "Cinematography")
    return items


def parse_spotify(lines: list[str]) -> list[dict[str, str]]:
    items: list[dict[str, str]] = []
    for line in lines[:-1]:
        items.extend(parse_standard_line(line))
    add_people(items, "Game Seven", "Agency")
    return items


PARSERS = {
    "/day-one": parse_day_one,
    "/ggm-aguita": parse_aguita,
    "/wynn-awakening": parse_wynn,
    "/thom-yorke-last-i-heard": parse_thom,
    "/polymarket-make-your-own-market": parse_polymarket_commercial,
    "/shaq-hbo": parse_shaq,
    "/armando-young-prizefighyer": parse_prizefighter,
    "/kelsey-lu-boys-noize-ride-or-die": parse_kelsey,
    "/mitski-a-pearl": parse_mitski,
    "/armando-young-belladonna": parse_belladonna,
    "/bombas-spring": parse_bombas_spring,
    "/spotify-hip-hop-classics-1": parse_spotify,
}


def parse_route(route: str, lines: list[str]) -> list[dict[str, str]]:
    if route == "/lovb-adidas":
        return [{"name": name, "credit": credit} for name, credit in LOVB_CREDITS]
    parser = PARSERS.get(route)
    if parser:
        return parser(lines)
    items: list[dict[str, str]] = []
    source = list(lines)
    if route in DESCRIPTION_FIRST and source:
        add_description(items, source.pop(0))
    for line in source:
        items.extend(parse_standard_line(line))
    return items


def build() -> dict[str, list[dict[str, str]]]:
    return {route: parse_route(route, fetch_lines(route)) for route in ROUTES}


def validate(data: dict[str, list[dict[str, str]]]) -> None:
    missing = [route for route in ROUTES if not data.get(route)]
    if missing:
        raise RuntimeError("Missing canonical credits for: " + ", ".join(missing))

    day_one = {(item["name"], item["credit"]) for item in data["/day-one"]}
    required = {
        ("Josh Swieven", "AE"),
        ("Dustin Foster", "AE"),
        ("Ryan Turner", "Post EP"),
        ("Laurence Jacobs", "Post Supervisor"),
        ("Kate Bellantoni", "Set PA"),
        ("Mafalda Pinto Correia", "Set PA"),
        ("Ryan Kelly", "Set PA"),
        ("Robby Rey", "Set PA"),
        ("Tate Duane", "Set PA"),
    }
    if not required.issubset(day_one):
        raise RuntimeError("Day One composite-credit repair is incomplete")

    allowed_collaborative_names = {"Alec & Syu from @Happy_Jpn"}
    for route, items in data.items():
        for item in items:
            name = item["name"]
            credit = item["credit"]
            if not name:
                raise RuntimeError(f"Blank credit name on {route}")
            if credit and ("," in name or " & " in name) and name not in allowed_collaborative_names:
                raise RuntimeError(f"Unsplit multi-person credit on {route}: {name}")


def main() -> None:
    data = build()
    validate(data)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text("window.JDC_CREDIT_DATA = " + payload + ";\n", encoding="utf-8")


if __name__ == "__main__":
    main()
