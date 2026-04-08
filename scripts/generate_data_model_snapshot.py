#!/usr/bin/env python3
"""
Generate a compact, presentation-ready FBLA Central data model snapshot PNG.

This version uses a manually positioned SVG layout so the result is tightly packed,
rectangular, and slide-friendly instead of relying on automatic graph layout.
"""

from __future__ import annotations

from dataclasses import dataclass
from html import escape
from pathlib import Path
import shutil
import subprocess
import tempfile
import textwrap


OUTPUT_FILE = "fbla_central_data_model_snapshot.png"
SVG_FILE = "fbla_central_data_model_snapshot.svg"
CANVAS_WIDTH = 2400
CANVAS_HEIGHT = 1350


COLORS = {
    "bg": "#FFFFFF",
    "text": "#14213D",
    "muted": "#5C677D",
    "panel_border": "#C5D0DD",
    "panel_fill": "#FAFBFD",
    "org_fill": "#EEF4FB",
    "org_border": "#335C81",
    "shared_fill": "#F8FAFC",
    "shared_border": "#64748B",
    "private_fill": "#FFF7ED",
    "private_border": "#B45309",
    "ai_fill": "#F4F1FF",
    "ai_border": "#7C3AED",
    "restricted_fill": "#FFF1F2",
    "restricted_border": "#BE123C",
    "accent": "#335C81",
    "accent_soft": "#6C8EAD",
    "private_line": "#C56A10",
    "ai_line": "#7C3AED",
    "restricted_line": "#BE123C",
    "personalize": "#0F766E",
    "divider": "#D7DEE8",
}


@dataclass(frozen=True)
class Rect:
    x: int
    y: int
    w: int
    h: int

    def top(self) -> tuple[int, int]:
        return (self.x + self.w // 2, self.y)

    def bottom(self) -> tuple[int, int]:
        return (self.x + self.w // 2, self.y + self.h)

    def left(self) -> tuple[int, int]:
        return (self.x, self.y + self.h // 2)

    def right(self) -> tuple[int, int]:
        return (self.x + self.w, self.y + self.h // 2)

    def center(self) -> tuple[int, int]:
        return (self.x + self.w // 2, self.y + self.h // 2)


def wrap_line(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False) or [text]


def svg_text(x: int, y: int, lines: list[str], size: int, color: str, weight: str = "400", line_gap: int = 16, anchor: str = "start") -> str:
    parts = [f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-family="Helvetica, Arial, sans-serif" font-weight="{weight}" text-anchor="{anchor}">']
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else line_gap
        parts.append(f'<tspan x="{x}" dy="{dy}">{escape(line)}</tspan>')
    parts.append("</text>")
    return "".join(parts)


def panel_svg(rect: Rect, title: str, fill: str) -> str:
    parts = [
        f'<rect x="{rect.x}" y="{rect.y}" width="{rect.w}" height="{rect.h}" rx="18" ry="18" fill="{fill}" stroke="{COLORS["panel_border"]}" stroke-width="1.4"/>',
        svg_text(rect.x + 18, rect.y + 28, [title], 16, COLORS["text"], "700"),
    ]
    return "".join(parts)


def entity_svg(rect: Rect, title: str, lines: list[str], fill: str, border: str, dashed: bool = False) -> str:
    stroke_dash = ' stroke-dasharray="7 6"' if dashed else ""
    parts = [
        f'<rect x="{rect.x}" y="{rect.y}" width="{rect.w}" height="{rect.h}" rx="12" ry="12" fill="{fill}" stroke="{border}" stroke-width="1.5"{stroke_dash}/>',
        svg_text(rect.x + 12, rect.y + 22, [title], 13, COLORS["text"], "700"),
        f'<line x1="{rect.x + 10}" y1="{rect.y + 30}" x2="{rect.x + rect.w - 10}" y2="{rect.y + 30}" stroke="{COLORS["divider"]}" stroke-width="1"/>',
    ]

    body_y = rect.y + 46
    for line in lines:
        wrapped = wrap_line(line, 34 if rect.w >= 300 else 26)
        parts.append(svg_text(rect.x + 12, body_y, wrapped, 8, COLORS["muted"], "400", 12))
        body_y += 12 * len(wrapped) + 4
    return "".join(parts)


def note_svg(rect: Rect, title: str, bullets: list[str]) -> str:
    parts = [
        f'<rect x="{rect.x}" y="{rect.y}" width="{rect.w}" height="{rect.h}" rx="14" ry="14" fill="{COLORS["panel_fill"]}" stroke="{COLORS["panel_border"]}" stroke-width="1.2"/>',
        svg_text(rect.x + 12, rect.y + 22, [title], 13, COLORS["text"], "700"),
        f'<line x1="{rect.x + 10}" y1="{rect.y + 30}" x2="{rect.x + rect.w - 10}" y2="{rect.y + 30}" stroke="{COLORS["divider"]}" stroke-width="1"/>',
    ]
    y = rect.y + 48
    for bullet in bullets:
        lines = wrap_line(f"• {bullet}", 42)
        parts.append(svg_text(rect.x + 12, y, lines, 8, COLORS["muted"], "400", 12))
        y += 12 * len(lines) + 6
    return "".join(parts)


def legend_svg(rect: Rect) -> str:
    parts = [
        f'<rect x="{rect.x}" y="{rect.y}" width="{rect.w}" height="{rect.h}" rx="14" ry="14" fill="{COLORS["panel_fill"]}" stroke="{COLORS["panel_border"]}" stroke-width="1.2"/>',
        svg_text(rect.x + 12, rect.y + 22, ["Legend"], 13, COLORS["text"], "700"),
    ]
    rows = [
        ("Canonical shared collection", COLORS["shared_fill"], COLORS["shared_border"], False),
        ("User-private collection / subcollection", COLORS["private_fill"], COLORS["private_border"], True),
        ("AI / derived content", COLORS["ai_fill"], COLORS["ai_border"], False),
        ("Moderation / restricted data", COLORS["restricted_fill"], COLORS["restricted_border"], False),
    ]
    y = rect.y + 44
    for label, fill, stroke, dashed in rows:
        dash = ' stroke-dasharray="7 6"' if dashed else ""
        parts.append(f'<rect x="{rect.x + 12}" y="{y}" width="26" height="16" rx="4" ry="4" fill="{fill}" stroke="{stroke}" stroke-width="1.3"{dash}/>')
        parts.append(svg_text(rect.x + 50, y + 12, [label], 8, COLORS["muted"]))
        y += 28

    parts.append(svg_text(rect.x + 12, y + 6, ["Arrow labels: scoped by, contains, references, authored by, derives from, personalizes"], 8, COLORS["muted"]))
    return "".join(parts)


def polyline(points: list[tuple[int, int]], color: str, width: float = 1.2, dashed: bool = False) -> str:
    dash = ' stroke-dasharray="7 6"' if dashed else ""
    point_str = " ".join(f"{x},{y}" for x, y in points)
    return f'<polyline points="{point_str}" fill="none" stroke="{color}" stroke-width="{width}"{dash} marker-end="url(#arrow-{color[1:]})"/>'


def label_svg(x: int, y: int, text: str, color: str) -> str:
    return svg_text(x, y, [text], 8, color, "600")


def orthogonal(start: tuple[int, int], end: tuple[int, int], mid_x: int | None = None, mid_y: int | None = None) -> list[tuple[int, int]]:
    sx, sy = start
    ex, ey = end
    if mid_x is not None:
        return [(sx, sy), (mid_x, sy), (mid_x, ey), (ex, ey)]
    if mid_y is not None:
        return [(sx, sy), (sx, mid_y), (ex, mid_y), (ex, ey)]
    return [(sx, sy), (ex, sy), (ex, ey)]


def render_svg() -> str:
    panels = {
        "org": Rect(60, 120, 400, 320),
        "shared": Rect(490, 120, 980, 390),
        "detail": Rect(490, 530, 980, 220),
        "ai": Rect(1500, 120, 430, 220),
        "private": Rect(60, 780, 1870, 510),
        "notes": Rect(1960, 120, 380, 1170),
    }

    boxes = {
        "organizations": Rect(80, 170, 160, 180),
        "users": Rect(260, 170, 180, 190),
        "org_hierarchy": Rect(80, 375, 160, 40),
        "org_scope": Rect(260, 375, 180, 40),
        "events": Rect(520, 170, 220, 180),
        "resources": Rect(760, 170, 200, 170),
        "news_posts": Rect(980, 170, 200, 165),
        "social_channels": Rect(1200, 170, 120, 105),
        "system_config": Rect(1340, 170, 110, 56),
        "study_tracks": Rect(520, 370, 220, 165),
        "forum_categories": Rect(760, 370, 180, 112),
        "forum_threads": Rect(960, 360, 330, 205),
        "study_units": Rect(520, 585, 170, 115),
        "user_study_progress": Rect(710, 570, 190, 130),
        "quiz_attempts": Rect(920, 570, 180, 130),
        "forum_replies": Rect(1120, 585, 170, 115),
        "forum_reports": Rect(1310, 585, 140, 115),
        "ai_conversations": Rect(1520, 175, 120, 120),
        "ai_messages": Rect(1660, 175, 110, 112),
        "ai_generated_assets_root": Rect(1790, 165, 120, 132),
        "user_doc": Rect(820, 800, 350, 36),
        "saved_items": Rect(80, 860, 400, 150),
        "event_saves": Rect(500, 860, 400, 150),
        "resource_state": Rect(920, 860, 400, 160),
        "news_state": Rect(1340, 860, 400, 150),
        "study_progress_private": Rect(80, 1050, 400, 170),
        "forum_follows": Rect(500, 1050, 400, 120),
        "notifications": Rect(920, 1050, 400, 150),
        "ai_generated_assets_user": Rect(1340, 1050, 400, 160),
        "arch_notes": Rect(1980, 160, 340, 250),
        "security_notes": Rect(1980, 430, 340, 280),
        "legend": Rect(1980, 730, 340, 180),
    }

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{CANVAS_WIDTH}" height="{CANVAS_HEIGHT}" viewBox="0 0 {CANVAS_WIDTH} {CANVAS_HEIGHT}">',
        f'<rect width="{CANVAS_WIDTH}" height="{CANVAS_HEIGHT}" fill="{COLORS["bg"]}"/>',
        "<defs>",
    ]

    marker_colors = {
        COLORS["accent"],
        COLORS["accent_soft"],
        COLORS["private_line"],
        COLORS["ai_line"],
        COLORS["restricted_line"],
        COLORS["personalize"],
        COLORS["org_border"],
    }
    for color in marker_colors:
        parts.append(
            f'<marker id="arrow-{color[1:]}" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">'
            f'<path d="M0,0 L9,4.5 L0,9 z" fill="{color}"/></marker>'
        )
    parts.append("</defs>")

    parts.append(svg_text(60, 55, ["FBLA Central Data Model Snapshot"], 28, COLORS["text"], "700"))
    parts.append(svg_text(60, 82, ["Compact Firestore-oriented data architecture with scoped shared content, private state, AI derivatives, and security boundaries"], 13, COLORS["muted"]))

    parts.append(panel_svg(panels["org"], "Organization and Identity", COLORS["org_fill"]))
    parts.append(panel_svg(panels["shared"], "Shared Canonical Collections", COLORS["shared_fill"]))
    parts.append(panel_svg(panels["detail"], "Supporting Forum and Study Detail", COLORS["shared_fill"]))
    parts.append(panel_svg(panels["ai"], "AI Subsystem / Derivative Content", COLORS["ai_fill"]))
    parts.append(panel_svg(panels["private"], "users/{userId} User-Private Subcollections / State", COLORS["private_fill"]))
    parts.append(panel_svg(panels["notes"], "Architecture Notes / Security / Legend", COLORS["panel_fill"]))

    parts.extend(
        [
            entity_svg(boxes["organizations"], "organizations", [
                "id, type",
                "parent_organization_id",
                "name, state_code",
                "subdivision_type_label",
                "school_name, status",
                "created_at, updated_at",
            ], COLORS["org_fill"], COLORS["org_border"]),
            entity_svg(boxes["users"], "users", [
                "id, email, full_name",
                "organization references",
                "grad_year, interests, goals",
                "notification_prefs",
                "privacy_prefs, accessibility_prefs",
                "created_at, updated_at",
            ], COLORS["org_fill"], COLORS["org_border"]),
            entity_svg(boxes["org_hierarchy"], "organization hierarchy", [
                "national → state → subdivision → local",
            ], COLORS["panel_fill"], COLORS["org_border"]),
            entity_svg(boxes["org_scope"], "scope keys", [
                "scope_type + organization_id + optional direct refs",
            ], COLORS["panel_fill"], COLORS["org_border"]),
            entity_svg(boxes["events"], "events", [
                "id, title, event_type",
                "scope_type, organization_id",
                "start_at, end_at, location",
                "related_resource_ids",
                "related_study_track_ids",
                "related_forum_thread_ids",
                "related_news_post_id",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["resources"], "resources", [
                "id, title, resource_type",
                "category, tags",
                "scope_type, organization_id",
                "source, updated_at",
                "linked_event_ids",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["news_posts"], "news_posts", [
                "id, title, body/summary",
                "scope_type, organization_id",
                "pinned",
                "created_at, updated_at",
                "related_event_ids",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["social_channels"], "social_channels", [
                "id",
                "organization_id",
                "platform, url",
                "status",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["system_config"], "system_config", [
                "global app config",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["study_tracks"], "study_tracks", [
                "id, title, track_type",
                "related_event_id",
                "related_resource_ids",
                "difficulty_level",
                "estimated_total_minutes",
                "tags, is_official",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["forum_categories"], "forum_categories", [
                "id, name",
                "scope_type, organization_id",
                "visibility_type",
                "sort_order",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["forum_threads"], "forum_threads", [
                "id, category_id, author_user_id",
                "title, body, thread_type",
                "status",
                "related_event_id / resource_id / study_track_id",
                "tags",
                "reply_count, helpful_count, view_count",
                "last_activity_at",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["study_units"], "study_units", [
                "id, study_track_id",
                "title, unit_type",
                "content_ref",
                "sequence_order",
                "estimated_minutes",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["user_study_progress"], "user_study_progress", [
                "id, user_id, study_track_id",
                "progress_percent",
                "last_opened_at, completed_at",
                "weak_topics",
                "next_recommended_unit_id",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["quiz_attempts"], "quiz_attempts", [
                "id, user_id, study_unit_id",
                "score_percent",
                "question_count, correct_count",
                "attempted_at",
                "missed_topic_tags",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["forum_replies"], "forum_replies", [
                "id, thread_id, author_user_id",
                "body, status",
                "helpful_count",
                "created_at",
            ], COLORS["shared_fill"], COLORS["shared_border"]),
            entity_svg(boxes["forum_reports"], "forum_reports", [
                "id, reporter_user_id",
                "content_type, content_id",
                "reason_code, status",
                "created_at",
            ], COLORS["restricted_fill"], COLORS["restricted_border"]),
            entity_svg(boxes["ai_conversations"], "ai_conversations", [
                "id, user_id",
                "context_type, context_id",
                "created_at, updated_at",
            ], COLORS["ai_fill"], COLORS["ai_border"]),
            entity_svg(boxes["ai_messages"], "ai_messages", [
                "id, conversation_id",
                "role",
                "content, source_links",
                "created_at",
            ], COLORS["ai_fill"], COLORS["ai_border"]),
            entity_svg(boxes["ai_generated_assets_root"], "ai_generated_assets", [
                "id, user_id",
                "asset_type",
                "source_item_type / source_item_id",
                "content_blob, created_at",
            ], COLORS["ai_fill"], COLORS["ai_border"], dashed=True),
            entity_svg(boxes["user_doc"], "users/{userId}", [
                "subcollection root",
            ], COLORS["panel_fill"], COLORS["private_border"]),
            entity_svg(boxes["saved_items"], "saved_items", [
                "id, user_id",
                "item_type, item_id",
                "saved_at",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["event_saves"], "event_saves", [
                "id, user_id, event_id",
                "reminder_pref",
                "private_notes",
                "saved_at",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["resource_state"], "resource_state", [
                "id, user_id, resource_id",
                "bookmarked, offline_saved",
                "notes",
                "last_opened_at",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["news_state"], "news_state", [
                "id, user_id, news_post_id",
                "saved, read, hidden",
                "interacted_at",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["study_progress_private"], "study_progress", [
                "id, user_id, study_track_id",
                "progress_percent",
                "last_opened_at, completed_at",
                "weak_topics",
                "next_recommended_unit_id",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["forum_follows"], "forum_follows", [
                "id, user_id, thread_id",
                "followed_at",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["notifications"], "notifications", [
                "id, user_id, type",
                "related_item_type / related_item_id",
                "read_at, created_at",
            ], COLORS["private_fill"], COLORS["private_border"], dashed=True),
            entity_svg(boxes["ai_generated_assets_user"], "ai_generated_assets", [
                "id, user_id",
                "asset_type",
                "source_item_type / source_item_id",
                "content_blob, created_at",
            ], COLORS["ai_fill"], COLORS["ai_border"], dashed=True),
            note_svg(boxes["arch_notes"], "Architecture Notes", [
                "Firestore root collections plus user subcollections",
                "Shared canonical content is separated from user-private state",
                "Organization-aware scoping supports national, state, subdivision, and local chapter",
                "AI content is derivative, not authoritative",
                "Private state isolation keeps security rules cleaner",
                "Personalization is driven by profile, goals, interests, and saved behavior",
            ]),
            note_svg(boxes["security_notes"], "Security / Integrity Rules", [
                "Immutable IDs",
                "Canonical organization references",
                "Controlled enums",
                "Least-privilege access",
                "Official shared content is read-only to members",
                "User-private data is only readable and writable by the owner",
                "Moderation fields are not member-editable",
                "Soft deletion where moderation or recovery matters",
            ]),
            legend_svg(boxes["legend"]),
        ]
    )

    connectors: list[str] = []

    def add_edge(points: list[tuple[int, int]], color: str, label: str = "", dashed: bool = False, lx: int | None = None, ly: int | None = None) -> None:
        connectors.append(polyline(points, color, 1.15, dashed))
        if label and lx is not None and ly is not None:
            connectors.append(label_svg(lx, ly, label, color))

    # Organization and scoping
    add_edge(orthogonal(boxes["organizations"].right(), boxes["users"].left(), mid_x=248), COLORS["org_border"], "references", False, 242, 252)
    add_edge(orthogonal(boxes["organizations"].right(), boxes["events"].left(), mid_x=470), COLORS["org_border"], "scoped by", False, 430, 216)
    add_edge(orthogonal(boxes["organizations"].right(), boxes["resources"].left(), mid_x=470), COLORS["org_border"], "scoped by", False, 430, 250)
    add_edge(orthogonal(boxes["organizations"].right(), boxes["news_posts"].left(), mid_x=470), COLORS["org_border"], "scoped by", False, 430, 284)
    add_edge(orthogonal(boxes["organizations"].right(), boxes["social_channels"].left(), mid_x=470), COLORS["org_border"], "scoped by", False, 430, 318)
    add_edge(orthogonal(boxes["organizations"].right(), boxes["forum_categories"].left(), mid_x=470), COLORS["org_border"], "scoped by", False, 430, 388)

    # Shared relationships
    add_edge(orthogonal(boxes["events"].right(), boxes["resources"].left(), mid_y=208), COLORS["accent"], "references", False, 748, 198)
    add_edge(orthogonal(boxes["events"].bottom(), boxes["study_tracks"].top(), mid_x=630), COLORS["accent"], "references", False, 642, 360)
    add_edge(orthogonal(boxes["events"].bottom(), boxes["forum_threads"].top(), mid_x=860), COLORS["accent"], "references", False, 878, 350)
    add_edge(orthogonal(boxes["events"].right(), boxes["news_posts"].left(), mid_y=228), COLORS["accent"], "references", False, 876, 218)
    add_edge(orthogonal(boxes["resources"].bottom(), boxes["study_tracks"].top(), mid_x=860), COLORS["accent_soft"], "references", False, 874, 352)
    add_edge(orthogonal(boxes["news_posts"].bottom(), boxes["events"].top(), mid_x=1090), COLORS["accent_soft"], "related to", True, 1104, 156)

    # Study / forum detail
    add_edge(orthogonal(boxes["study_tracks"].bottom(), boxes["study_units"].top(), mid_x=630), COLORS["accent"], "contains", False, 640, 548)
    add_edge(orthogonal(boxes["forum_categories"].right(), boxes["forum_threads"].left(), mid_y=426), COLORS["accent"], "contains", False, 946, 416)
    add_edge(orthogonal(boxes["forum_threads"].bottom(), boxes["forum_replies"].top(), mid_x=1180), COLORS["accent"], "contains", False, 1194, 548)
    add_edge(orthogonal(boxes["forum_threads"].bottom(), boxes["forum_reports"].top(), mid_x=1328), COLORS["restricted_line"], "moderation", False, 1338, 548)

    # User authorship and AI
    add_edge(orthogonal(boxes["users"].right(), boxes["forum_threads"].left(), mid_x=470), COLORS["accent_soft"], "authored by", True, 470, 454)
    add_edge(orthogonal(boxes["users"].right(), boxes["forum_replies"].left(), mid_x=470), COLORS["accent_soft"], "authored by", True, 470, 610)
    add_edge(orthogonal(boxes["users"].right(), boxes["ai_conversations"].left(), mid_x=1486), COLORS["ai_line"], "owns", True, 1492, 206)
    add_edge(orthogonal(boxes["ai_conversations"].right(), boxes["ai_messages"].left(), mid_y=214), COLORS["ai_line"], "contains", False, 1650, 204)
    add_edge(orthogonal(boxes["ai_messages"].right(), boxes["ai_generated_assets_root"].left(), mid_y=220), COLORS["ai_line"], "derives from", True, 1780, 210)

    # Users to private root and subcollections
    add_edge(orthogonal(boxes["users"].bottom(), boxes["user_doc"].top(), mid_x=350), COLORS["private_line"], "user-private root", True, 368, 640)
    for key, lx in [("saved_items", 140), ("event_saves", 560), ("resource_state", 980), ("news_state", 1400)]:
        add_edge(orthogonal(boxes["user_doc"].bottom(), boxes[key].top(), mid_x=boxes[key].center()[0]), COLORS["private_line"], "subcollection", True, lx, 844)
    for key, lx in [("study_progress_private", 140), ("forum_follows", 560), ("notifications", 980), ("ai_generated_assets_user", 1400)]:
        add_edge(orthogonal(boxes["user_doc"].bottom(), boxes[key].top(), mid_x=boxes[key].center()[0]), COLORS["private_line"] if key != "ai_generated_assets_user" else COLORS["ai_line"], "subcollection", True, lx, 1036)

    # Private state to shared content
    add_edge(orthogonal(boxes["event_saves"].top(), boxes["events"].bottom(), mid_x=700), COLORS["private_line"], "references", True, 712, 650)
    add_edge(orthogonal(boxes["resource_state"].top(), boxes["resources"].bottom(), mid_x=1080), COLORS["private_line"], "references", True, 1086, 628)
    add_edge(orthogonal(boxes["news_state"].top(), boxes["news_posts"].bottom(), mid_x=1440), COLORS["private_line"], "references", True, 1450, 620)
    add_edge(orthogonal(boxes["study_progress_private"].top(), boxes["study_tracks"].bottom(), mid_x=620), COLORS["private_line"], "references", True, 632, 1018)
    add_edge(orthogonal(boxes["forum_follows"].top(), boxes["forum_threads"].bottom(), mid_x=760), COLORS["private_line"], "references", True, 774, 960)

    # Additional shared/private detail
    add_edge(orthogonal(boxes["study_units"].right(), boxes["quiz_attempts"].left(), mid_y=640), COLORS["private_line"], "evaluated by", True, 808, 630)
    add_edge(orthogonal(boxes["users"].bottom(), boxes["user_study_progress"].top(), mid_x=610), COLORS["private_line"], "personal study state", True, 622, 548)
    add_edge(orthogonal(boxes["users"].bottom(), boxes["quiz_attempts"].top(), mid_x=820), COLORS["private_line"], "attempts", True, 834, 548)

    # AI asset source references
    add_edge(orthogonal(boxes["ai_generated_assets_user"].top(), boxes["study_tracks"].bottom(), mid_x=1550), COLORS["ai_line"], "source_item_id", True, 1564, 990)
    add_edge(orthogonal(boxes["ai_generated_assets_user"].top(), boxes["resources"].bottom(), mid_x=1680), COLORS["ai_line"], "source_item_id", True, 1694, 950)

    # Personalization
    add_edge(orthogonal(boxes["users"].right(), boxes["events"].top(), mid_x=450), COLORS["personalize"], "personalizes", True, 470, 150)
    add_edge(orthogonal(boxes["users"].right(), boxes["resources"].top(), mid_x=450), COLORS["personalize"], "personalizes", True, 470, 170)
    add_edge(orthogonal(boxes["users"].right(), boxes["news_posts"].top(), mid_x=450), COLORS["personalize"], "personalizes", True, 470, 190)
    add_edge(orthogonal(boxes["users"].right(), boxes["study_tracks"].top(), mid_x=450), COLORS["personalize"], "personalizes", True, 470, 390)
    add_edge(orthogonal(boxes["users"].right(), boxes["forum_threads"].top(), mid_x=450), COLORS["personalize"], "personalizes", True, 470, 410)

    parts.extend(connectors)
    parts.append("</svg>")
    return "".join(parts)


def main() -> None:
    svg_content = render_svg()
    svg_path = Path(SVG_FILE).resolve()
    png_path = Path(OUTPUT_FILE).resolve()

    svg_path.write_text(svg_content, encoding="utf-8")

    rsvg = shutil.which("rsvg-convert")
    if rsvg:
        subprocess.run(
            [rsvg, "-w", str(CANVAS_WIDTH), "-h", str(CANVAS_HEIGHT), "-o", str(png_path), str(svg_path)],
            check=True,
        )
    else:
        qlmanage = shutil.which("qlmanage")
        if not qlmanage:
            raise SystemExit("Neither `rsvg-convert` nor `qlmanage` was found in PATH.")
        with tempfile.TemporaryDirectory() as tmp_dir:
            subprocess.run(
                [qlmanage, "-t", "-s", str(CANVAS_WIDTH), "-o", tmp_dir, str(svg_path)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            generated = Path(tmp_dir) / f"{svg_path.name}.png"
            if not generated.exists():
                raise SystemExit("Preview conversion failed.")
            png_path.write_bytes(generated.read_bytes())

    print(f"Saved {png_path.name}")


if __name__ == "__main__":
    main()
