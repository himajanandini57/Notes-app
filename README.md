# Notes App

A simple notes app that runs entirely in the browser. Write, search, edit, pin and delete notes, and they stay saved after you refresh the page.

Built with plain HTML, CSS and JavaScript. No frameworks, no backend.

## Features

- Add, edit and delete notes
- Live search by title or content
- Pin important notes to the top
- Notes saved in the browser with `localStorage`
- Created / edited timestamps
- Dark mode (remembers your choice)
- Export all notes as a `.txt` file
- Responsive layout for phones and desktops

## Getting started

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/notes-app.git
   ```
2. Open `index.html` in your browser. That's it.

## Project structure

```
notes-app/
├── index.html   # page structure
├── style.css    # styling and dark mode
├── script.js    # app logic
└── README.md
```

## Live demo

Enable GitHub Pages (Settings > Pages > Deploy from branch > `main`) and add your link here:

`https://<your-username>.github.io/notes-app/`

## What I learned

- DOM manipulation and event handling
- Storing and loading JSON with `localStorage`
- Filtering and sorting arrays
- CSS variables for theming

## Future improvements

- Tags and color-coded notes
- Markdown support
- Import notes from a file
- Rebuild with React
- Sync notes with a backend and database

## License

MIT
