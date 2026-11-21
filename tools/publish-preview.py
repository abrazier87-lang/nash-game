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
import os, re, shutil, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "Pips Lost Eggs.html", "dots-busy-train.html", "grade1-space.html", "grade2-egypt.html",
         "grade3-china.html", "grade4-rome.html", "progress.html", "manifest.webmanifest",
         "new-dr-somebody.html", "grade5-canada.html", "grade6-east.html", "grade7-west.html", "grade8-north.html"]  # pages that are only on the preview so far (Grades 5 to 8 work) go at the end
BADGE = ('<div style="position:fixed;left:50%;bottom:6px;transform:translateX(-50%);z-index:99;background:#ff5a5f;color:#fff;'
         'font:bold 12px sans-serif;padding:3px 10px;border-radius:999px;pointer-events:none;opacity:.85">PREVIEW</div>')

def git(*args, capture=False):
    r = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)
    if r.returncode: sys.exit(f"git {' '.join(args)} failed:\n{r.stderr}")
    return r.stdout.strip() if capture else None

def git_try(*args, tries=1, wait=4):
    """Like git(), but never stops the script: returns the error text ("" when it worked). With tries > 1 it waits and
    tries again, because a file that was only just copied can be held for a moment (OneDrive, a virus scan, a local server)."""
    err = ""
    for n in range(tries):
        r = subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)
        if not r.returncode: return ""
        err = r.stderr.strip() or f"git {args[0]} failed"
        if n + 1 < tries: time.sleep(wait)
    return err

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
    new_audio = [f for f in git("diff", "--name-only", "main", "HEAD", "--", "audio", capture=True).splitlines() if f]  # only recordings main does not have yet (comparing with "main...HEAD" listed every recording ever made on the branch, and the list grew too long for Windows to run)
    for f in new_audio:                                                   # keep copies of new recordings to add to main
        os.makedirs(os.path.dirname(os.path.join(tmp, f)), exist_ok=True)
        if os.path.exists(os.path.join(ROOT, f)): shutil.copy(os.path.join(ROOT, f), os.path.join(tmp, f))
    git("checkout", "-q", "main"); git("pull", "-q", "--ff-only")
    try:
        shutil.rmtree(os.path.join(ROOT, "preview"), ignore_errors=True)
        shutil.copytree(os.path.join(tmp, "preview"), os.path.join(ROOT, "preview"), dirs_exist_ok=True)  # the old folder may linger if something (OneDrive, a local server) holds it open
        for f in new_audio:
            if os.path.exists(os.path.join(tmp, f)):
                os.makedirs(os.path.dirname(os.path.join(ROOT, f)), exist_ok=True); shutil.copy(os.path.join(tmp, f), os.path.join(ROOT, f))
        listed = os.path.join(tmp, "add-these.txt")                       # the names go in a file, because Windows cannot run a command longer than about 32,000 letters
        with open(listed, "w", encoding="utf-8", newline=chr(10)) as fh: fh.write(chr(10).join(["preview"] + [f for f in new_audio if os.path.exists(os.path.join(ROOT, f))]))
        err = git_try("add", "--pathspec-from-file=" + listed, tries=6)
        if err: sys.exit("Could not add the preview files, even after waiting and trying again: " + err)
        if git("diff", "--cached", "--name-only", capture=True):
            git("commit", "-q", "-m", f"Preview: {branch}\n\nThe preview copy (preview/) now shows the work on branch {branch}. The real games are unchanged.")
            git("push", "-q", "origin", "main")
            print("Preview published: https://abrazier87-lang.github.io/nash-game/preview/ (live in a minute or two)")
        else:
            print("The preview already shows this work; nothing to publish.")
    except BaseException as e:
        # Something went wrong half way. Say what it was, put main back as it was, and go back to the work branch,
        # so the folder is never left sitting on main with half a preview in it.
        print("The preview was NOT published. What went wrong: " + str(e), file=sys.stderr)
        git_try("reset", "-q")
        git_try("checkout", "-q", "--", "preview")
        git_try("clean", "-fdq", "preview")
        tracked = set(git("ls-files", "--", "audio", capture=True).splitlines())
        for f in new_audio:                                               # recordings copied in from the work branch (they are all saved there)
            if f in tracked: git_try("checkout", "-q", "--", f)
            elif os.path.exists(os.path.join(ROOT, f)): os.remove(os.path.join(ROOT, f))
        raise
    finally:
        err = git_try("checkout", "-q", branch, tries=3)
        if err: print(f"Could not switch back to {branch}. The folder is still on main: {err}", file=sys.stderr)
        shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
