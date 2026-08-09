OUR STORY — a birthday scrapbook website
==========================================

HOW TO OPEN IT
  Double-click index.html to open it in your browser.
  (For swipe/touch testing, open it on your phone — you can
  copy the whole folder to your phone or host it online.)

WHAT'S ALREADY IN PLACE
  - His photo on Page 1 (assets/images/birthday-boy.jpg) is
    already the one you uploaded.
  - Every other photo is a clearly labeled placeholder image —
    just replace the file (same name) with your real photo.
  - The background music file is a silent placeholder —
    drop your own song in as assets/music.mp3 (keep that name,
    or update the <audio> src in index.html).

WHERE TO EDIT THINGS
  index.html   -> all the text you see (titles, memory captions,
                   dates, the final birthday message, your name).
                   Search for "EDIT HERE" comments — they mark
                   every spot you'll want to personalize.
  script.js    -> TIMELINE_DATA (top section) holds the 10 moon
                   phases: photo, age/year, title, description.
                   Delete entries you don't need.
                   TAUNT_MESSAGES holds the NO button's replies.
  style.css    -> All colors and fonts are CSS variables at the
                   very top of the file (:root). Change a hex
                   code there to re-theme the whole site at once.

REPLACING PHOTOS
  Keep the exact same file names so you don't have to touch the
  code — just overwrite:
    assets/images/birthday-boy.jpg
    assets/images/book-cover.jpg
    assets/images/memory-1.jpg ... memory-6.jpg
    assets/images/timeline-1.jpg ... timeline-10.jpg

  If you have fewer than 10 timeline photos, just delete the
  extra entries from TIMELINE_DATA in script.js — the layout
  adjusts automatically.

ENJOY! 🤍
