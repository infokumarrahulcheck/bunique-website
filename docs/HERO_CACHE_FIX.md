# Hero Cache Fix v3

The hero previously appeared with the old long-scroll reference image because the browser/GitHub Pages cache could keep the old CSS asset. This version:
- cache-busts the CSS and JS with `?v=3`
- isolates the hero section stacking context
- keeps the hero background limited to the gradient/growth visual
- prevents the hero background layer from falling behind the page body

After replacing the repository files, hard-refresh the live page.
