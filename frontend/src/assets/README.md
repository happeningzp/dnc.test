# Assets

This directory is for static assets that are imported into the application, such as images, fonts, and global stylesheets.

Examples:
- `logo.svg`
- `background-image.png`
- `fonts/` (directory for font files)
- `styles/` (directory for global or theme-specific stylesheets, if not handled in index.css or App.css)

Note: Vite automatically handles assets in the `public` directory as static assets that are copied to the build output. Assets in `src/assets` are typically imported and processed by the build tool (e.g., optimized, bundled). Global stylesheets like `index.css` or `App.css` are often kept directly in the `src` directory but can also be organized here if preferred.
