"""Publishes the games you are working on to the PREVIEW copy of the website, without touching the real games.

The preview lives in the folder  preview/  on the same website:
    https://abrazier87-lang.github.io/nash-game/preview/
It is a copy of the pages and shared files, marked with a "PREVIEW" badge. It plays the real games'
recordings (from the main audio/ folder), so new recordings are copied into audio/ too. That is harmless:
the real games only play recordings they ask for.

How to use it, from the project folder, while on a work branch (not main):
    python tools/publish-preview.py
It builds the preview from this branch, switches to main, commits only preview/ and any new audio files,
pushes, and switches back to your branch. The real games on main are not changed.

Note: the preview and the real games share the same saved progress on a device (same website).
"""
import os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "Pips Lost Eggs.html", "dots-busy-train.html", "grade1-space.html", "grade2-egypt.html",
         "grade3-china.html", "grade4-rome.html", "progress.html", "manifest.webmanifest"]
BADGE = ('<div style="position:fixed;left:50%;bottom:6px;transform:translateX(-50%);z-index:99;background:#ff5a5f;color:#fff;'
         'font:bold 12px sans-serif;padding:3px 10px;border-radius:999px;pointer-events:none;opacity:.85">PREVIEW</div>')

def git(*args, capture=False):
    r = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)
    if r.returncode: sys.exit(f"git {' '.join(args)} failed:\n{r.stderr}")
    return r.stdout.strip() if capture else None

def build(dest):
    """Copies the pages and shared files into dest, pointing their recordings at the real audio folder."""
    os.makedirs(os.path.join(dest, "shared"), exist_ok=True)
    for p in PAGES:
        src = os.path.join(ROOT, p)
        if not os.path.exists(src): continue
        text = open(src, encoding="utf-8").read()
        if p.endswith(".html"):
            text = re.sub(r'(["\'`])audio/', r"\1../audio/", text)       # recordings come from the real audio/ folder
            text = text.replace("</body>", BADGE + "\n</body>", 1) if "</body>" in text else text + BADGE
        open(os.path.join(dest, p), "w", encoding="utf-8", newline="").write(text)
    for f in os.listdir(os.path.join(ROOT, "shared")):
        text = open(os.path.join(ROOT, "shared", f), encoding="utf-8").read()
        text = re.sub(r'(["\'`])audio/', r"\1../audio/", text)
        open(os.path.join(dest, "shared", f), "w", encoding="utf-8", newline="").write(text)
    for icon in ("icon-192.png", "icon-512.png", "icon.png"):
        if os.path.exists(os.path.join(ROOT, icon)): shutil.copy(os.path.join(ROOT, icon), dest)

def main():
    branch = git("branch", "--show-current", capture=True)
    if branch == "main": sys.exit("Switch to a work branch first: the preview shows work that is not on the real games yet.")
    if git("status", "--porcelain", capture=True): sys.exit("Commit your work on this branch first (there are unsaved changes).")
    tmp = tempfile.mkdtemp(prefix="nash-preview-")
    build(os.path.join(tmp, "preview"))
    new_audio = [f for f in git("diff", "--name-only", "main...HEAD", "--", "audio", capture=True).splitlines() if f]
    for f in new_audio:                                                   # keep copies of new recordings to add to main
        os.makedirs(os.path.dirname(os.path.join(tmp, f)), exist_ok=True)
        if os.path.exists(os.path.join(ROOT, f)): shutil.copy(os.path.join(ROOT, f), os.path.join(tmp, f))
    git("checkout", "-q", "main"); git("pull", "-q", "--ff-only")
    try:
        shutil.rmtree(os.path.join(ROOT, "preview"), ignore_errors=True)
        shutil.copytree(os.path.join(tmp, "preview"), os.path.join(ROOT, "preview"))
        for f in new_audio:
            if os.path.exists(os.path.join(tmp, f)):
                os.makedirs(os.path.dirname(os.path.join(ROOT, f)), exist_ok=True); shutil.copy(os.path.join(tmp, f), os.path.join(ROOT, f))
        git("add", "preview", *[f for f in new_audio if os.path.exists(os.path.join(ROOT, f))])
        if git("diff", "--cached", "--name-only", capture=True):
            git("commit", "-q", "-m", f"Preview: {branch}\n\nThe preview copy (preview/) now shows the work on branch {branch}. The real games are unchanged.")
            git("push", "-q", "origin", "main")
            print("Preview published: https://abrazier87-lang.github.io/nash-game/preview/ (live in a minute or two)")
        else:
            print("The preview already shows this work; nothing to publish.")
    finally:
        git("checkout", "-q", branch)
        shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
