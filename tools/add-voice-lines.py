"""Adds missing spoken lines to audio/lines.json, ready for tools/make-voice.py to record.

The voice checker (tools/voice-check.js) saves what it finds as small files of { "sound file": "words" }.
Give this script one or more of those files:
  python tools/add-voice-lines.py .claude/missing-g2.json .claude/missing-g3.json
Lines already in the list are left alone, so running it twice does no harm.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOK = os.path.join(ROOT, "audio", "lines.json")


def who_says(path):
    """Whose voice a sound file is in, worked out from its folder."""
    parts = path.split("/")
    if "ch4" in parts:  # Grade 8 chapter 4 has its own reader (Dr. Somebody's own few lines there are marked by hand in lines.json)
        return "g8-ch4-reader"
    if "clock" in parts:  # words read aloud by the balloon's clock (Grade 5 and up)
        return "clock"
    if "doc" in parts:  # Dr. Somebody's guest lines inside Pip's and Dot's games
        return "dr-somebody"
    return {"pip": "pip", "dot": "dot"}.get(parts[1], "dr-somebody")


with open(BOOK, encoding="utf-8") as f:
    text = f.read()
book = json.loads(text)

new = {}
for name in sys.argv[1:]:
    with open(name, encoding="utf-8") as f:
        for path, words in json.load(f).items():
            if path not in book["lines"] and path not in new:
                new[path] = [who_says(path), words]

if not new:
    print("nothing new to add")
    sys.exit(0)

# The list is kept one line per recording, so add the new ones in the same style, just before the end.
end = text.rstrip().rfind("\n  }\n}")
if end < 0:
    sys.exit("could not find the end of the list in audio/lines.json")
added = ",\n\n" + ",\n".join(f"    {json.dumps(p)}: {json.dumps(v, ensure_ascii=False)}" for p, v in sorted(new.items()))
with open(BOOK, "w", encoding="utf-8", newline="") as f:
    f.write(text[:end] + added + text[end:])
json.load(open(BOOK, encoding="utf-8"))  # make sure the list still reads properly
print(f"added {len(new)} lines, about {sum(len(v[1]) for v in new.values())} credits to record")
