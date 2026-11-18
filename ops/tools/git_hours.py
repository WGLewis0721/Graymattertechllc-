#!/usr/bin/env python3
"""Estimate billable hours from git commit history.

Method (the common "git-hours" approach):
  - Sort commit timestamps. Commits less than --gap minutes apart belong to the
    same work session.
  - A session's length = last commit - first commit + --lead minutes (the work
    done before the first commit of the session, which leaves no timestamp).
  - A session with one commit counts as --lead minutes.

It measures time between saves, not thinking time, meetings, or work never
committed. AI-assisted repos commit fast and in bursts, so treat the result as
a floor for your time on the build, then add non-repo time yourself.

  python3 ops/tools/git_hours.py <repo> [<repo> ...] [--rate 150] [--gap 120] [--lead 30]
        [--since 2026-09-01] [--until 2026-11-30] [--author "name"] [--csv sessions.csv]
"""
import argparse
import csv
import datetime as dt
import subprocess
import sys
from pathlib import Path


def commit_times(repo, since=None, until=None, author=None):
    cmd = ["git", "-C", str(repo), "log", "--all", "--no-merges", "--format=%at|%an|%s"]
    if since:
        cmd.append(f"--since={since}")
    if until:
        cmd.append(f"--until={until}")
    if author:
        cmd.append(f"--author={author}")
    out = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout
    rows = []
    for line in out.splitlines():
        ts, name, subject = line.split("|", 2)
        rows.append((int(ts), name, subject))
    shallow = subprocess.run(["git", "-C", str(repo), "rev-parse", "--is-shallow-repository"],
                             capture_output=True, text=True).stdout.strip() == "true"
    return sorted(set(rows)), shallow


def sessions(rows, gap_min, lead_min):
    out, start, last, count = [], None, None, 0
    for ts, _, _ in rows:
        if start is None:
            start, last, count = ts, ts, 1
        elif ts - last <= gap_min * 60:
            last, count = ts, count + 1
        else:
            out.append((start, last, count))
            start, last, count = ts, ts, 1
    if start is not None:
        out.append((start, last, count))
    return [(s, e, n, (e - s) / 3600 + lead_min / 60) for s, e, n in out]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("repos", nargs="+")
    ap.add_argument("--rate", type=float, default=150)
    ap.add_argument("--gap", type=int, default=120, help="minutes between commits that still count as one session")
    ap.add_argument("--lead", type=int, default=30, help="minutes credited before each session's first commit")
    ap.add_argument("--since")
    ap.add_argument("--until")
    ap.add_argument("--author")
    ap.add_argument("--csv")
    a = ap.parse_args()

    grand_h = 0.0
    writer = None
    if a.csv:
        f = open(a.csv, "w", newline="")
        writer = csv.writer(f)
        writer.writerow(["repo", "date", "start", "end", "commits", "hours"])
    for repo in a.repos:
        rows, shallow = commit_times(repo, a.since, a.until, a.author)
        if not rows:
            print(f"{repo}: no commits in range")
            continue
        sess = sessions(rows, a.gap, a.lead)
        hours = sum(h for *_, h in sess)
        grand_h += hours
        first = dt.datetime.fromtimestamp(rows[0][0]).date()
        last = dt.datetime.fromtimestamp(rows[-1][0]).date()
        days = len({dt.datetime.fromtimestamp(s).date() for s, *_ in sess})
        name = Path(repo).resolve().name
        print(f"{name}: {len(rows)} commits, {len(sess)} sessions on {days} days ({first} to {last})"
              f"{'  [SHALLOW CLONE: history incomplete]' if shallow else ''}")
        print(f"  estimated hours: {hours:.1f}  ->  ${hours * a.rate:,.0f} at ${a.rate:,.0f}/hr")
        for s, e, n, h in sess:
            if writer:
                writer.writerow([name, dt.datetime.fromtimestamp(s).date(),
                                 dt.datetime.fromtimestamp(s).strftime("%H:%M"),
                                 dt.datetime.fromtimestamp(e).strftime("%H:%M"), n, f"{h:.2f}"])
    if len(a.repos) > 1:
        print(f"TOTAL: {grand_h:.1f} hours -> ${grand_h * a.rate:,.0f} at ${a.rate:,.0f}/hr")
    print(f"(gap {a.gap} min, lead {a.lead} min; time between commits only, see --help)")


if __name__ == "__main__":
    main()
