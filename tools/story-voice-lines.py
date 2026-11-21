"""Lists the spoken lines of a storyboard game (Grade 5 and up) so they can be recorded.

  python tools/story-voice-lines.py <folder under audio/, e.g. g5/s> <out.json> <file> [<file> ...] [--skip N]

It reads the story lines (say: [...]), the choice questions (pick: "...") and the challenge intros (intro: "...")
from the given files, in order, and writes { "sound file": "words to say" } for tools/add-voice-lines.py.
Lines told by somebody else (a scene with who: "...") are left out: they are not in Dr. Somebody's voice.
Add --who to list ONLY those scenes instead: they are read by the clock (give a folder like g7/clock).
The words are made ready for speaking exactly as shared/chapters.js does it: the marks around special words are
taken off, and the page's SAY list (how to say some words) is applied. The sound file's name is worked out from
the words the same way shared/kit.js does (Kit.clipName), so the game finds each recording by its words.
"""
import json, re, sys

def clip_name(words):
    h = 0x811c9dc5
    for ch in words:
        h ^= ord(ch); h = (h * 0x01000193) & 0xFFFFFFFF
    slug = re.sub(r"[^a-z0-9]+", "-", words.lower()).strip("-")[:32].rstrip("-")
    return f"{slug}-{h:08x}"

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    only_who = "--who" in sys.argv
    folder, out, files = args[0].strip("/"), args[1], args[2:]
    say_list = []
    lines, order = {}, []
    for name in files:
        text = open(name, encoding="utf-8").read()
        m = re.search(r"const SAY = (\[\[.*?\]\]);", text, re.S)
        if m: say_list = json.loads(m.group(1))
        start = text.find("CHAPTERS[") if "const CHAPTERS = [" not in text else text.find("const CHAPTERS = [")
        if start < 0: continue
        body = text[start:]
        end = body.find("\nconst ASK = ")           # Grade 5 keeps its questions after the story
        if end > 0: body = body[:end]
        # one beat at a time, so a scene with who: "..." can be skipped whole
        for beat in re.finditer(r'\{ (?:who: "[^"]*", )?(?:art|ask): .*?(?=\n    \{ |\n  \] \}|\Z)', body, re.S):
            b = beat.group(0)
            spoken = []
            has_who = b.startswith('{ who:') or bool(re.search(r'who: "', b.split("say:")[0] if "say:" in b else b))
            if has_who != only_who: continue
            for m2 in re.finditer(r'intro: "([^"]+)"|pick: "([^"]+)"|say: \[(.*?)\]', b, re.S):
                if m2.group(1): spoken.append(m2.group(1))
                elif m2.group(2): spoken.append(m2.group(2))
                else: spoken += re.findall(r'"([^"]*)"', m2.group(3))
            for s in spoken:
                words = re.sub(r"<[^>]+>", "", s)
                for a, c in say_list: words = words.replace(a, c)
                path = f"audio/{folder}/{clip_name(words)}.mp3"
                if path not in lines: lines[path] = words; order.append(path)
    json.dump({p: lines[p] for p in order}, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"{len(order)} lines, about {sum(len(lines[p]) for p in order)} credits -> {out}")

main()
