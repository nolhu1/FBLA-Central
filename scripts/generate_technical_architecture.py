#!/usr/bin/env python3
"""
Generate a polished FBLA Central technical architecture diagram as a high-resolution PNG.

This script uses only the Python standard library plus the Graphviz `dot` binary.
It writes a temporary DOT graph, renders it to PNG, and saves:
    fbla_central_technical_architecture.png
"""

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path


OUTPUT_FILE = "fbla_central_technical_architecture.png"
GRAPH_NAME = "FBLA_Central_Technical_Architecture"


COLORS = {
    "bg": "#FFFFFF",
    "text": "#14213D",
    "muted": "#5C677D",
    "border": "#BAC7D5",
    "layer_fill": "#F8FAFC",
    "client_fill": "#EEF4FB",
    "service_fill": "#F3F7FC",
    "backend_fill": "#F2F6FB",
    "side_fill": "#FAFBFD",
    "feature_fill": "#F7FAFD",
    "shared_fill": "#EEF6FF",
    "private_fill": "#FFF7ED",
    "shared_border": "#1D4E89",
    "private_border": "#B45309",
    "accent": "#335C81",
    "accent_soft": "#6C8EAD",
    "ai": "#6B7280",
}


def esc(text: str) -> str:
    return text.replace('"', r"\"")


def html_label(title: str, items: list[str], title_size: int = 18, body_size: int = 11) -> str:
    """Build an HTML-like Graphviz table label."""
    rows = [
        f'<TR><TD ALIGN="CENTER"><FONT POINT-SIZE="{title_size}"><B>{esc(title)}</B></FONT></TD></TR>'
    ]
    for item in items:
        rows.append(
            f'<TR><TD ALIGN="CENTER"><FONT POINT-SIZE="{body_size}">{esc(item)}</FONT></TD></TR>'
        )
    return (
        '<<TABLE BORDER="0" CELLBORDER="0" CELLPADDING="2" CELLSPACING="0">'
        + "".join(rows)
        + "</TABLE>>"
    )


def box(node_id: str, label: str, fill: str, width: float = 2.0, height: float = 0.9) -> str:
    return (
        f'"{node_id}" [label="{esc(label)}", shape=box, style="rounded,filled", '
        f'fillcolor="{fill}", color="{COLORS["border"]}", fontcolor="{COLORS["text"]}", '
        f'fontsize=11, penwidth=1.3, width={width}, height={height}, margin="0.08,0.05"];'
    )


def html_box(node_id: str, title: str, items: list[str], fill: str, border: str | None = None, width: float = 2.7, height: float = 1.5) -> str:
    return (
        f'"{node_id}" [label={html_label(title, items)}, shape=box, style="rounded,filled", '
        f'fillcolor="{fill}", color="{border or COLORS["border"]}", fontcolor="{COLORS["text"]}", '
        f'fontsize=11, penwidth=1.4, width={width}, height={height}, margin="0.10,0.08"];'
    )


def edge(src: str, dst: str, label: str = "", color: str | None = None, style: str = "solid", penwidth: float = 1.7, constraint: str = "true") -> str:
    attrs = [
        f'color="{color or COLORS["accent"]}"',
        f'fontcolor="{color or COLORS["accent"]}"',
        f'style="{style}"',
        f'penwidth={penwidth}',
        f'constraint={constraint}',
        'arrowsize=0.8',
    ]
    if label:
        attrs.append(f'label="{esc(label)}"')
        attrs.append("fontsize=10")
    return f'"{src}" -> "{dst}" [{", ".join(attrs)}];'


def build_dot() -> str:
    return f"""
digraph {GRAPH_NAME} {{
  graph [
    rankdir=TB,
    splines=polyline,
    nodesep=0.36,
    ranksep=0.72,
    pad=0.35,
    dpi=300,
    bgcolor="{COLORS["bg"]}",
    fontname="Helvetica"
  ];

  node [
    shape=box,
    style="rounded,filled",
    fillcolor="{COLORS["layer_fill"]}",
    color="{COLORS["border"]}",
    fontname="Helvetica",
    fontcolor="{COLORS["text"]}"
  ];

  edge [
    color="{COLORS["accent"]}",
    fontname="Helvetica",
    fontcolor="{COLORS["accent"]}",
    arrowsize=0.8
  ];

  title [shape=plain, margin=0, label=<
    <TABLE BORDER="0" CELLBORDER="0" CELLPADDING="2" CELLSPACING="0">
      <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="28"><B>FBLA Central Technical Architecture</B></FONT></TD></TR>
      <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="13" COLOR="{COLORS["muted"]}">Layered client-cloud architecture for a cross-platform FBLA member experience</FONT></TD></TR>
    </TABLE>
  >];

  subgraph cluster_mobile {{
    label="1. Mobile Client";
    labelloc="t";
    labeljust="l";
    fontsize=18;
    fontname="Helvetica-Bold";
    fontcolor="{COLORS["text"]}";
    color="{COLORS["border"]}";
    penwidth=1.5;
    style="rounded,filled";
    fillcolor="{COLORS["client_fill"]}";

    {html_box("ui_nav", "UI + Navigation", ["UI screens", "navigation", "reusable components"], COLORS["layer_fill"], width=2.5, height=1.4)}
    {html_box("state_app", "Application State", ["state management", "client orchestration", "screen coordination"], COLORS["layer_fill"], width=2.5, height=1.4)}
    {html_box("ai_layer", "AI Interaction Layer", ["prompting", "context resolution", "grounded assistant UX"], COLORS["layer_fill"], border=COLORS["ai"], width=2.5, height=1.4)}
    {html_box("offline_cache", "Offline-Conscious Client", ["local cache", "offline storage", "resume and sync behavior"], COLORS["layer_fill"], width=2.6, height=1.4)}
    {html_box("scope_client", "Organization-Aware Experience", ["national", "state chapter", "local chapter", "optional subdivision"], COLORS["layer_fill"], width=2.7, height=1.4)}

    {{ rank=same; ui_nav; state_app; ai_layer; offline_cache; scope_client; }}
  }}

  subgraph cluster_services {{
    label="2. Application / Service Layer";
    labelloc="t";
    labeljust="l";
    fontsize=18;
    fontname="Helvetica-Bold";
    fontcolor="{COLORS["text"]}";
    color="{COLORS["border"]}";
    penwidth=1.5;
    style="rounded,filled";
    fillcolor="{COLORS["service_fill"]}";

    {box("auth_service", "Authentication\\nService", COLORS["layer_fill"])}
    {box("org_service", "Organization Directory\\nService", COLORS["layer_fill"])}
    {box("event_service", "Event\\nService", COLORS["layer_fill"])}
    {box("resource_service", "Resource\\nService", COLORS["layer_fill"])}
    {box("news_service", "News\\nService", COLORS["layer_fill"])}
    {box("social_service", "Social\\nService", COLORS["layer_fill"])}

    {box("study_service", "Study\\nService", COLORS["layer_fill"])}
    {box("forum_service", "Forum\\nService", COLORS["layer_fill"])}
    {box("ai_service", "AI\\nService", COLORS["layer_fill"])}
    {box("recommendation_service", "Recommendation\\nService", COLORS["layer_fill"])}
    {box("notification_service", "Notification\\nService", COLORS["layer_fill"])}
    {box("moderation_service", "Moderation\\nService", COLORS["layer_fill"])}

    {html_box("domain_data", "Domain + Data Responsibilities", [
        "Domain layer: business rules, ranking logic, scoping, recommendation logic",
        "Data layer: repositories, API adapters, persistence, local cache coordination"
    ], COLORS["layer_fill"], width=4.1, height=1.95)}

    {{ rank=same; auth_service; org_service; event_service; resource_service; news_service; social_service; }}
    {{ rank=same; study_service; forum_service; ai_service; recommendation_service; notification_service; moderation_service; }}
  }}

  subgraph cluster_backend {{
    label="3. Backend Platform";
    labelloc="t";
    labeljust="l";
    fontsize=18;
    fontname="Helvetica-Bold";
    fontcolor="{COLORS["text"]}";
    color="{COLORS["border"]}";
    penwidth=1.5;
    style="rounded,filled";
    fillcolor="{COLORS["backend_fill"]}";

    {box("firebase_auth", "Firebase\\nAuthentication", COLORS["layer_fill"], width=2.15)}
    {box("firestore", "Cloud\\nFirestore", COLORS["layer_fill"], width=2.0)}
    {box("functions", "Cloud\\nFunctions", COLORS["layer_fill"], width=2.0)}
    {box("storage", "Cloud\\nStorage", COLORS["layer_fill"], width=2.0)}
    {box("fcm", "Firebase Cloud\\nMessaging", COLORS["layer_fill"], width=2.2)}
    {box("analytics", "Optional\\nAnalytics", COLORS["layer_fill"], width=2.0)}

    {{ rank=same; firebase_auth; firestore; functions; storage; fcm; analytics; }}
  }}

  subgraph cluster_side {{
    label="Data Model Split";
    labelloc="t";
    labeljust="l";
    fontsize=18;
    fontname="Helvetica-Bold";
    fontcolor="{COLORS["text"]}";
    color="{COLORS["border"]}";
    penwidth=1.5;
    style="rounded,filled";
    fillcolor="{COLORS["side_fill"]}";

    data_note [shape=plain, label=<
      <TABLE BORDER="0" CELLBORDER="0" CELLPADDING="2" CELLSPACING="0">
        <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="11" COLOR="{COLORS["muted"]}">Shared official content is visually distinct from user-private state.</FONT></TD></TR>
      </TABLE>
    >];

    {html_box("shared_content", "Shared / Canonical Content", [
        "organizations",
        "events",
        "resources",
        "news_posts",
        "social_channels",
        "study_tracks",
        "forum_categories",
        "forum_threads"
    ], COLORS["shared_fill"], border=COLORS["shared_border"], width=3.25, height=3.0)}

    {html_box("private_state", "User-Private State", [
        "saved_items",
        "event_saves",
        "resource_state",
        "news_state",
        "study_progress",
        "forum_follows",
        "notifications",
        "ai_generated_assets"
    ], COLORS["private_fill"], border=COLORS["private_border"], width=3.25, height=3.2)}
  }}

  subgraph cluster_features {{
    label="Major Feature Domains";
    labelloc="t";
    labeljust="l";
    fontsize=14;
    fontname="Helvetica-Bold";
    fontcolor="{COLORS["text"]}";
    color="{COLORS["border"]}";
    penwidth=1.3;
    style="rounded,filled";
    fillcolor="{COLORS["feature_fill"]}";

    {box("profiles_feature", "Profiles", COLORS["layer_fill"], width=1.5, height=0.7)}
    {box("events_feature", "Events", COLORS["layer_fill"], width=1.4, height=0.7)}
    {box("resources_feature", "Resources", COLORS["layer_fill"], width=1.55, height=0.7)}
    {box("news_feature", "News", COLORS["layer_fill"], width=1.35, height=0.7)}
    {box("social_feature", "Social Hub", COLORS["layer_fill"], width=1.6, height=0.7)}
    {box("study_feature", "Study Tool", COLORS["layer_fill"], width=1.6, height=0.7)}
    {box("forums_feature", "Forums", COLORS["layer_fill"], width=1.35, height=0.7)}
    {box("ai_feature", "AI Assistant", COLORS["layer_fill"], width=1.75, height=0.7)}

    {{ rank=same; profiles_feature; events_feature; resources_feature; news_feature; social_feature; study_feature; forums_feature; ai_feature; }}
  }}

  title -> ui_nav [style=invis, weight=20];
  scope_client -> auth_service [style=invis, weight=5];
  domain_data -> firebase_auth [style=invis, weight=4];
  analytics -> shared_content [style=invis, weight=3];
  private_state -> profiles_feature [style=invis, weight=1];

  {edge("ui_nav", "state_app", "presentation flow", color=COLORS["accent_soft"], style="dashed", constraint="false")}
  {edge("state_app", "ai_layer", "AI requests", color=COLORS["ai"], style="dashed", constraint="false")}
  {edge("state_app", "offline_cache", "sync + persistence", color=COLORS["accent_soft"], style="dashed", constraint="false")}
  {edge("state_app", "scope_client", "scoped UX", color=COLORS["accent_soft"], style="dashed", constraint="false")}

  {edge("ui_nav", "event_service", "mobile client communicates with service layer")}
  {edge("state_app", "recommendation_service", "client state, personalization, ranking")}
  {edge("ai_layer", "ai_service", "grounded support requests", color=COLORS["ai"])}
  {edge("offline_cache", "domain_data", "local cache + repository coordination", color=COLORS["accent_soft"])}
  {edge("scope_client", "org_service", "organization-aware content scoping", color=COLORS["accent_soft"])}

  {edge("auth_service", "firebase_auth", "identity")}
  {edge("org_service", "firestore", "directory + scoping")}
  {edge("event_service", "firestore", "shared event content")}
  {edge("resource_service", "storage", "documents and media")}
  {edge("resource_service", "firestore", "resource metadata", color=COLORS["accent_soft"])}
  {edge("news_service", "firestore", "announcements")}
  {edge("social_service", "firestore", "official channels")}
  {edge("study_service", "firestore", "study tracks + progress")}
  {edge("forum_service", "firestore", "categories and threads")}
  {edge("ai_service", "functions", "grounded AI orchestration", color=COLORS["ai"])}
  {edge("recommendation_service", "functions", "ranking + suggestions")}
  {edge("notification_service", "fcm", "remote notifications")}
  {edge("notification_service", "domain_data", "local reminders", color=COLORS["accent_soft"], style="dashed")}
  {edge("moderation_service", "functions", "policy + review")}
  {edge("moderation_service", "firestore", "flags and status", color=COLORS["accent_soft"])}
  {edge("recommendation_service", "analytics", "optional signals", color=COLORS["accent_soft"], style="dashed")}

  {edge("firestore", "shared_content", "shared official content", color=COLORS["shared_border"])}
  {edge("firestore", "private_state", "user-private state", color=COLORS["private_border"])}
  {edge("storage", "shared_content", "documents / assets", color=COLORS["shared_border"], style="dashed")}
  {edge("functions", "private_state", "AI outputs, notifications, moderation actions", color=COLORS["private_border"], style="dashed")}

  {edge("profiles_feature", "recommendation_service", "profile drives recommendations", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("profiles_feature", "news_service", "news ranking", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("profiles_feature", "event_service", "event ranking", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("profiles_feature", "study_service", "study suggestions", color=COLORS["accent"], style="dashed", constraint="false")}

  {edge("events_feature", "resource_service", "events connect to resources", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("events_feature", "study_service", "events connect to study", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("events_feature", "forum_service", "events connect to forums", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("events_feature", "news_service", "events connect to news", color=COLORS["accent"], style="dashed", constraint="false")}
  {edge("events_feature", "ai_service", "events connect to AI", color=COLORS["accent"], style="dashed", constraint="false")}

  {edge("ai_feature", "ai_service", "grounded support layer", color=COLORS["ai"], style="dashed", constraint="false")}
  {edge("social_feature", "social_service", "official content domain", color=COLORS["accent_soft"], style="dashed", constraint="false")}
  {edge("forums_feature", "forum_service", "member discussion domain", color=COLORS["accent_soft"], style="dashed", constraint="false")}

  ai_note [shape=plain, label=<
    <TABLE BORDER="0" CELLBORDER="0" CELLPADDING="2" CELLSPACING="0">
      <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="10" COLOR="{COLORS["muted"]}">AI is a grounded support layer, not the authority layer.</FONT></TD></TR>
    </TABLE>
  >];
  notif_note [shape=plain, label=<
    <TABLE BORDER="0" CELLBORDER="0" CELLPADDING="2" CELLSPACING="0">
      <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="10" COLOR="{COLORS["muted"]}">Notifications combine remote pushes and local reminders.</FONT></TD></TR>
    </TABLE>
  >];

  ai_service -> ai_note [style=dotted, arrowhead=none, color="{COLORS["ai"]}", constraint=false];
  notification_service -> notif_note [style=dotted, arrowhead=none, color="{COLORS["accent_soft"]}", constraint=false];
}}
""".strip()


def main() -> None:
    dot_binary = shutil.which("dot")
    if not dot_binary:
        raise SystemExit("Graphviz `dot` binary not found in PATH.")

    output_path = Path(OUTPUT_FILE).resolve()
    dot_source = build_dot()

    with tempfile.TemporaryDirectory() as temp_dir:
        dot_path = Path(temp_dir) / "fbla_central_technical_architecture.dot"
        dot_path.write_text(dot_source, encoding="utf-8")

        subprocess.run(
            [dot_binary, "-Tpng", str(dot_path), "-o", str(output_path)],
            check=True,
        )

    print(f"Saved {output_path.name}")


if __name__ == "__main__":
    main()
