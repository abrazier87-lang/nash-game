"""Records the game's spoken lines with ElevenLabs.

It reads audio/lines.json and makes a sound file for every line that does not have one yet.
Lines that already have a file are skipped, so running it twice costs nothing extra.

The ElevenLabs key is read from a file OUTSIDE this folder, so it is never published with the game.

Run it with the Python that came with the picture generator:
  C:\\Users\\brazi\\ComfyUI\\ComfyUI_windows_portable\\python_embeded\\python.exe tools\\make-voice.py
Add the word  count  on the end to see how many credits it would use, without recording anything.
"""
import json, os, sys, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY_FILE = os.path.expanduser("~/elevenlabs-key.txt")
MODEL = "eleven_multilingual_v2"

with open(os.path.join(ROOT, "audio", "lines.json"), encoding="utf-8") as f:
    book = json.load(f)

todo = [(path, who, words) for path, (who, words) in book["lines"].items() if not os.path.exists(os.path.join(ROOT, path))]
letters = sum(len(words) for _, _, words in todo)
print(f"{len(book['lines'])} lines in the book, {len(todo)} still to record, about {letters} credits")
if "count" in sys.argv or not todo:
    sys.exit(0)

with open(KEY_FILE, encoding="utf-8") as f:
    key = f.read().strip()

failed = 0
for path, who, words in todo:
    out = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{book['voices'][who]}?output_format=mp3_44100_96"
    body = json.dumps({"text": words, "model_id": MODEL}).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            sound = r.read()
        with open(out, "wb") as f:
            f.write(sound)
        print(f"  recorded {path} ({len(sound) // 1024} KB)")
    except urllib.error.HTTPError as e:
        failed += 1
        print(f"  FAILED {path}: {e.code} {e.read()[:200].decode('utf-8', 'replace')}")
    except Exception as e:  # network trouble and the like
        failed += 1
        print(f"  FAILED {path}: {e}")
print("done" if not failed else f"done, but {failed} line(s) failed. Run it again to retry just those.")
