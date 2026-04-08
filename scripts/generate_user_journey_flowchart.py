#!/usr/bin/env python3
"""Generate a full FBLA Central user journey flowchart as an SVG.

The diagram is based on the current app navigation and cross-screen behavior:
- Sign in -> onboarding -> main tabs
- Home, Events, Study, Community, Profile primary journeys
- Cross-links into Resources, News, AI, Search, Social Hub, and detail screens
- Retention loops such as save, reminders, follow, reply, and profile updates

The output is a white-background SVG so it can be used in docs, slides, or export
workflows without additional dependencies.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Tuple
import html


@dataclass(frozen=True)
class Node:
    key: str
    title: str
    subtitle: str
    x: int
    y: int
    kind: str = "screen"


@dataclass(frozen=True)
class Edge:
    start: str
    end: str
    label: str = ""
    style: str = "primary"


WIDTH = 2440
HEIGHT = 1700
NODE_WIDTH = 250
NODE_HEIGHT = 104

PALETTE = {
    "bg": "#ffffff",
    "grid": "#eef2f7",
    "title": "#0f172a",
    "text": "#334155",
    "muted": "#64748b",
    "screen_fill": "#f8fafc",
    "screen_stroke": "#cbd5e1",
    "entry_fill": "#ecfeff",
    "entry_stroke": "#0891b2",
    "hub_fill": "#eff6ff",
    "hub_stroke": "#2563eb",
    "detail_fill": "#fefce8",
    "detail_stroke": "#ca8a04",
    "action_fill": "#fdf2f8",
    "action_stroke": "#db2777",
    "primary_edge": "#2563eb",
    "secondary_edge": "#94a3b8",
    "loop_edge": "#db2777",
}


def build_nodes() -> List[Node]:
    return [
        Node("launch", "App Launch", "Restore session and route user", 90, 85, "entry"),
        Node("signin", "Sign In", "Demo or production authentication", 90, 255, "entry"),
        Node("onboarding", "Onboarding", "Organization, basics, interests, alerts", 90, 445, "entry"),
        Node("tabs", "Main Tabs", "Home, Events, Study, Community, Profile", 90, 655, "hub"),
        Node("search", "Unified Search", "Cross-feature jump into detail screens", 90, 855, "hub"),
        Node("home", "Home", "Priority hero, quick actions, momentum", 420, 130, "hub"),
        Node("events", "Events", "Calendar, agenda, saved schedule", 420, 345, "screen"),
        Node("study", "Study", "Overview, practice, progress, review", 420, 560, "screen"),
        Node("community", "Community", "Browse topics, featured threads, ask", 420, 775, "screen"),
        Node("profile", "Profile", "Identity, activity, settings", 420, 990, "screen"),
        Node("social", "Social Hub", "Official channels and highlights", 420, 1205, "screen"),
        Node("news", "News", "Chapter/state/national updates", 760, 130, "screen"),
        Node("resources", "Resources", "Library, filters, saved docs", 760, 345, "screen"),
        Node("ai", "FBLA AI", "Context-aware assistant across the app", 760, 560, "hub"),
        Node("event_detail", "Event Detail", "Overview, prep, discussion, reminders", 760, 775, "detail"),
        Node("study_detail", "Study Track Detail", "Units, progress, linked resources", 760, 990, "detail"),
        Node("thread_detail", "Thread Detail", "Replies, linked context, sibling threads", 760, 1205, "detail"),
        Node("news_detail", "News Detail", "Full update plus related content", 1100, 130, "detail"),
        Node("resource_detail", "Resource Detail", "Open, save, share, related items", 1100, 345, "detail"),
        Node("pdf_viewer", "PDF Viewer", "Read local or linked documents", 1100, 560, "detail"),
        Node("community_list", "Thread List", "Category-specific discussion list", 1100, 775, "detail"),
        Node("create_thread", "Create Thread", "Post a new question or discussion", 1100, 990, "action"),
        Node("edit_profile", "Edit Profile", "Update identity and interests", 1100, 1205, "action"),
        Node("preferences", "Preferences", "Notifications, privacy, accessibility", 1100, 1420, "action"),
        Node("save_loop", "Save / Track Loop", "Saved events, resources, announcements", 1510, 180, "action"),
        Node("prep_loop", "Prep Loop", "Event -> resource -> study -> AI", 1510, 425, "action"),
        Node("community_loop", "Community Loop", "Question -> reply -> linked context", 1510, 670, "action"),
        Node("retention", "Retention Outcome", "Return via reminders, unread updates, resume study", 1510, 915, "hub"),
        Node("profile_loop", "Profile Personalization", "Edits reshape recommendations and scope", 1510, 1160, "action"),
        Node("complete", "Ongoing Member Journey", "Discover, plan, prepare, discuss, return", 1840, 580, "hub"),
    ]


def build_edges() -> List[Edge]:
    return [
        Edge("launch", "signin", "No session"),
        Edge("launch", "onboarding", "Signed in, incomplete"),
        Edge("launch", "tabs", "Returning member"),
        Edge("signin", "onboarding", "First-time / incomplete"),
        Edge("signin", "tabs", "Authenticated member"),
        Edge("onboarding", "tabs", "Complete profile"),
        Edge("tabs", "home", "Default tab"),
        Edge("tabs", "events", "Tab"),
        Edge("tabs", "study", "Tab"),
        Edge("tabs", "community", "Tab"),
        Edge("tabs", "profile", "Tab"),
        Edge("tabs", "search", "Header search"),
        Edge("home", "news", "Notifications"),
        Edge("home", "ai", "Ask AI"),
        Edge("home", "profile", "Avatar"),
        Edge("home", "events", "Quick action"),
        Edge("home", "study", "Quick action"),
        Edge("home", "resources", "Quick action"),
        Edge("home", "social", "Highlight"),
        Edge("home", "event_detail", "Hero / priority"),
        Edge("home", "thread_detail", "Momentum / discussion"),
        Edge("events", "event_detail", "Open event"),
        Edge("study", "study_detail", "Continue or recommended track"),
        Edge("community", "thread_detail", "Open featured/recommended thread"),
        Edge("community", "community_list", "Browse category"),
        Edge("community", "create_thread", "Ask question"),
        Edge("profile", "edit_profile", "Edit"),
        Edge("profile", "preferences", "Settings"),
        Edge("search", "event_detail", "Event result"),
        Edge("search", "resource_detail", "Resource result"),
        Edge("search", "news_detail", "News result"),
        Edge("search", "study_detail", "Study result"),
        Edge("search", "thread_detail", "Thread result"),
        Edge("news", "news_detail", "Open update"),
        Edge("resources", "resource_detail", "Open resource"),
        Edge("event_detail", "news_detail", "Linked announcements"),
        Edge("event_detail", "resource_detail", "Related resources"),
        Edge("event_detail", "study_detail", "Study help"),
        Edge("event_detail", "thread_detail", "Discussion"),
        Edge("event_detail", "ai", "Context AI"),
        Edge("study_detail", "resource_detail", "Related resources"),
        Edge("study_detail", "ai", "Turn into plan"),
        Edge("thread_detail", "event_detail", "Linked event"),
        Edge("thread_detail", "resource_detail", "Linked resource"),
        Edge("thread_detail", "study_detail", "Linked study"),
        Edge("resource_detail", "pdf_viewer", "Open PDF/document"),
        Edge("resource_detail", "study_detail", "Use in study"),
        Edge("resource_detail", "news_detail", "Related updates"),
        Edge("resource_detail", "event_detail", "Useful for"),
        Edge("news_detail", "event_detail", "Related event"),
        Edge("news_detail", "resource_detail", "Related resource"),
        Edge("news_detail", "thread_detail", "Related thread"),
        Edge("news_detail", "ai", "Ask AI"),
        Edge("social", "event_detail", "Linked spotlight"),
        Edge("social", "news_detail", "Linked highlight"),
        Edge("community_list", "thread_detail", "Open thread"),
        Edge("create_thread", "thread_detail", "New post"),
        Edge("edit_profile", "profile", "Return"),
        Edge("preferences", "profile", "Return"),
        Edge("event_detail", "save_loop", "Save + reminders", "loop"),
        Edge("resource_detail", "save_loop", "Save for later", "loop"),
        Edge("news_detail", "save_loop", "Save / mark read", "loop"),
        Edge("event_detail", "prep_loop", "Prep branching", "loop"),
        Edge("resource_detail", "prep_loop", "Study support", "loop"),
        Edge("study_detail", "prep_loop", "Continue prep", "loop"),
        Edge("ai", "prep_loop", "Guided plan", "loop"),
        Edge("community", "community_loop", "Ask / browse", "loop"),
        Edge("thread_detail", "community_loop", "Reply / follow", "loop"),
        Edge("create_thread", "community_loop", "Start discussion", "loop"),
        Edge("save_loop", "retention", "Pinned items"),
        Edge("prep_loop", "retention", "Resume prep"),
        Edge("community_loop", "retention", "Active participation"),
        Edge("profile", "profile_loop", "Identity / settings", "loop"),
        Edge("edit_profile", "profile_loop", "Update interests", "loop"),
        Edge("preferences", "profile_loop", "Tune alerts", "loop"),
        Edge("profile_loop", "retention", "Better personalization"),
        Edge("retention", "complete", "Member keeps returning"),
        Edge("tabs", "complete", "Connected app system", "secondary"),
        Edge("ai", "complete", "Support anywhere", "secondary"),
        Edge("social", "complete", "Beyond utility", "secondary"),
    ]


def node_colors(kind: str) -> Tuple[str, str]:
    if kind == "entry":
        return PALETTE["entry_fill"], PALETTE["entry_stroke"]
    if kind == "hub":
        return PALETTE["hub_fill"], PALETTE["hub_stroke"]
    if kind == "detail":
        return PALETTE["detail_fill"], PALETTE["detail_stroke"]
    if kind == "action":
        return PALETTE["action_fill"], PALETTE["action_stroke"]
    return PALETTE["screen_fill"], PALETTE["screen_stroke"]


def edge_color(style: str) -> str:
    if style == "loop":
        return PALETTE["loop_edge"]
    if style == "secondary":
        return PALETTE["secondary_edge"]
    return PALETTE["primary_edge"]


def edge_dash(style: str) -> str:
    if style == "loop":
        return "10 8"
    if style == "secondary":
        return "6 8"
    return ""


def escape(value: str) -> str:
    return html.escape(value, quote=True)


def wrap_text(text: str, max_chars: int) -> List[str]:
    words = text.split()
    lines: List[str] = []
    current = ""
    for word in words:
        tentative = word if not current else f"{current} {word}"
        if len(tentative) <= max_chars:
            current = tentative
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_grid() -> str:
    parts = []
    for x in range(0, WIDTH, 80):
        parts.append(
            f'<line x1="{x}" y1="0" x2="{x}" y2="{HEIGHT}" stroke="{PALETTE["grid"]}" stroke-width="1"/>'
        )
    for y in range(0, HEIGHT, 80):
        parts.append(
            f'<line x1="0" y1="{y}" x2="{WIDTH}" y2="{y}" stroke="{PALETTE["grid"]}" stroke-width="1"/>'
        )
    return "\n".join(parts)


def draw_marker_defs() -> str:
    return f"""
<defs>
  <marker id="arrow-primary" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
    <path d="M1,1 L13,7 L1,13 z" fill="{PALETTE["primary_edge"]}" />
  </marker>
  <marker id="arrow-secondary" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
    <path d="M1,1 L13,7 L1,13 z" fill="{PALETTE["secondary_edge"]}" />
  </marker>
  <marker id="arrow-loop" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
    <path d="M1,1 L13,7 L1,13 z" fill="{PALETTE["loop_edge"]}" />
  </marker>
  <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#cbd5e1" flood-opacity="0.45"/>
  </filter>
</defs>
""".strip()


def marker_id(style: str) -> str:
    if style == "loop":
        return "arrow-loop"
    if style == "secondary":
        return "arrow-secondary"
    return "arrow-primary"


def connect(nodes: Dict[str, Node], edge: Edge) -> Tuple[str, Tuple[float, float]]:
    start = nodes[edge.start]
    end = nodes[edge.end]

    sx = start.x + NODE_WIDTH
    sy = start.y + NODE_HEIGHT / 2
    ex = end.x
    ey = end.y + NODE_HEIGHT / 2

    if end.x <= start.x:
        sx = start.x + NODE_WIDTH / 2
        sy = start.y + NODE_HEIGHT
        ex = end.x + NODE_WIDTH / 2
        ey = end.y
        mid_y = sy + 34
        path = f"M {sx} {sy} L {sx} {mid_y} L {ex} {mid_y} L {ex} {ey}"
        label_pos = ((sx + ex) / 2, mid_y - 10)
        return path, label_pos

    horizontal_gap = ex - sx
    curve = min(100, max(40, horizontal_gap / 2))
    path = f"M {sx} {sy} C {sx + curve} {sy}, {ex - curve} {ey}, {ex} {ey}"
    label_pos = ((sx + ex) / 2, (sy + ey) / 2 - 12)
    return path, label_pos


def draw_edges(nodes: List[Node], edges: List[Edge]) -> str:
    lookup = {node.key: node for node in nodes}
    parts = []
    for edge in edges:
        path, (lx, ly) = connect(lookup, edge)
        dash = edge_dash(edge.style)
        dash_attr = f' stroke-dasharray="{dash}"' if dash else ""
        parts.append(
            f'<path d="{path}" fill="none" stroke="{edge_color(edge.style)}" stroke-width="3"{dash_attr} '
            f'marker-end="url(#{marker_id(edge.style)})" opacity="0.96"/>'
        )
        if edge.label:
            parts.append(
                f'<text x="{lx:.1f}" y="{ly:.1f}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" '
                f'font-size="14" fill="{PALETTE["muted"]}" font-weight="600">{escape(edge.label)}</text>'
            )
    return "\n".join(parts)


def draw_nodes(nodes: List[Node]) -> str:
    parts = []
    for node in nodes:
        fill, stroke = node_colors(node.kind)
        parts.append(
            f'<rect x="{node.x}" y="{node.y}" rx="24" ry="24" width="{NODE_WIDTH}" height="{NODE_HEIGHT}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="2.5" filter="url(#shadow)"/>'
        )
        parts.append(
            f'<text x="{node.x + 18}" y="{node.y + 34}" font-family="Arial, Helvetica, sans-serif" '
            f'font-size="22" font-weight="700" fill="{PALETTE["title"]}">{escape(node.title)}</text>'
        )
        subtitle_lines = wrap_text(node.subtitle, 32)
        for index, line in enumerate(subtitle_lines[:3]):
            parts.append(
                f'<text x="{node.x + 18}" y="{node.y + 62 + index * 18}" '
                f'font-family="Arial, Helvetica, sans-serif" font-size="15" '
                f'fill="{PALETTE["text"]}">{escape(line)}</text>'
            )
    return "\n".join(parts)


def draw_legend() -> str:
    items = [
        ("Entry / gate", PALETTE["entry_fill"], PALETTE["entry_stroke"]),
        ("Primary hub", PALETTE["hub_fill"], PALETTE["hub_stroke"]),
        ("Feature screen", PALETTE["screen_fill"], PALETTE["screen_stroke"]),
        ("Detail / deep dive", PALETTE["detail_fill"], PALETTE["detail_stroke"]),
        ("Action / retention loop", PALETTE["action_fill"], PALETTE["action_stroke"]),
    ]
    parts = [
        '<g transform="translate(1830, 80)">',
        f'<rect x="0" y="0" rx="22" ry="22" width="500" height="300" fill="#ffffff" stroke="{PALETTE["screen_stroke"]}" stroke-width="2"/>',
        f'<text x="24" y="38" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="{PALETTE["title"]}">Legend</text>',
    ]
    y = 74
    for label, fill, stroke in items:
        parts.append(
            f'<rect x="24" y="{y}" rx="12" ry="12" width="42" height="28" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
        )
        parts.append(
            f'<text x="82" y="{y + 20}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="{PALETTE["text"]}">{escape(label)}</text>'
        )
        y += 42

    parts.extend(
        [
            f'<line x1="26" y1="{y + 6}" x2="66" y2="{y + 6}" stroke="{PALETTE["primary_edge"]}" stroke-width="3"/>',
            f'<text x="82" y="{y + 12}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="{PALETTE["text"]}">Primary navigation / main action</text>',
            f'<line x1="26" y1="{y + 48}" x2="66" y2="{y + 48}" stroke="{PALETTE["secondary_edge"]}" stroke-width="3" stroke-dasharray="6 8"/>',
            f'<text x="82" y="{y + 54}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="{PALETTE["text"]}">Secondary connected experience</text>',
            f'<line x1="26" y1="{y + 90}" x2="66" y2="{y + 90}" stroke="{PALETTE["loop_edge"]}" stroke-width="3" stroke-dasharray="10 8"/>',
            f'<text x="82" y="{y + 96}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="{PALETTE["text"]}">Retention / personalization loop</text>',
            "</g>",
        ]
    )
    return "\n".join(parts)


def build_svg(nodes: List[Node], edges: List[Edge]) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">
<rect width="100%" height="100%" fill="{PALETTE["bg"]}"/>
{draw_marker_defs()}
{draw_grid()}
<text x="90" y="56" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="{PALETTE["title"]}">
  FBLA Central Full User Journey Flow
</text>
<text x="90" y="88" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="{PALETTE["muted"]}">
  Auth, onboarding, core tabs, cross-feature navigation, and retention loops shown on a white background
</text>
{draw_legend()}
{draw_edges(nodes, edges)}
{draw_nodes(nodes)}
</svg>
"""


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    output_dir = root / "generated"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / "user_journey_flowchart.svg"

    nodes = build_nodes()
    edges = build_edges()
    svg = build_svg(nodes, edges)
    output_path.write_text(svg, encoding="utf-8")

    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
