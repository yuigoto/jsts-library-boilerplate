# JS/TS Library Boilerplate

> A simple JavaScript/TypeScript NPM library boilerplate.

This boilerplate was built using Webpack, and it works for pure code libraries 
and React component libraries as well. The idea is to be as flexible and 
tweakable as possible, while being small and simple enough for you to just 
download/clone/fork and get things done.

Some of this library's features:

- Works for pure code libraries and React components (and probably other things 
  as well);
- PostCSS/SASS/SCSS/CSS Modules support;
- Absolute path resolution for JavaScript modules and SASS/SCSS inside the 
  `src` folder so you don't have to pinpoint your relative paths;
- Some very basic asset (mostly images) handling: really small images, like 
  icons can be embedded into the final builds;
- Local development server and minimal web project with hot reload, in case 
  you need to test things for the browser or build a demo page;
- Since there's support for a demo page, with some tweaks, can also be used to build a full-fledged SPA;

---

## Why?

I really like boilerplates as they really help you kickstart a project or prototype things really fast, but I don't like the fact that to achieve some degree of control on some of those boilerplates you need to either install _more_ libraries or do some workarounds.

But I wanted something simple that worked for me and let me have enough control over the whole build process. Also, I wanted some specific features.

I also wanted to study Webpack and have some minimum understanding for an educational project I'm working on (in Portuguese) about Webpack.

That's why this project exists.

---

## Requirements

- **Node** (`v14.x.x+`)
  - _I believe it also works with `12.x.x`, but latest LTS is always good! :+1:_

---

## Commands

Clone the repository, install dependencies (change'em as you wish, since there might be more than you need) then execute one of these commands:

- `npm run start` or `yarn start`:  to fire up the local development server and test application with watchers and hot reload;
- `npm run build` or `yarn build`: to generate a minified build of your library;

---
  
## How it works

I'm skipping a lot of stuff here. I advise you to read the code and change the functionality according to your needs, but basically:

- Write your library code _inside_ the `src` folder;
  - You can import anything from the `src` folder by absolute paths, since it'll be resolved as the root path so, for example:
    - You're on `src/index.tsx` and wants to import something from `src/demo/Test.tsx`;
    - Then just use: `import { Something } from "demo/Test";` and you're good to go!;
    - CSS/SASS/SCSS files imported _inside_ JS/TS files are also resolved too!;
    - `@import` rules for SASS/SCSS have a different resolver, though: they consider `src/styles` as their root. This was made so you can just place all your helpers/mixins/functions there an just import, without worrying about relative paths;
- If developing for the browser, write the code for your test application inside the `docs` folder, when running the local development server it'll be automatically injected into the HTML file inside `public`;
  - Anything inside the `docs` folder should be imported with the `@docs/` alias, so:
    - You're on `docs/index.jsx` and wants to import something from `docs/views/Demo.jsx`;
    - You'll have to use: `import { Demo } from "@docs/views/Demo";`;
  - To import things from your `src` folder into `docs`, you should use the `@lib` alias, then:
      - You're on `docs/index.jsx` and needs to import a component exported from `src/components/Demo.tsx`;
      - Just use: `import { TestComponent } from "@lib/components/Demo";`;
      - The `@src/` alias should _**only**_ used to alias the `src` path _inside_  your `docs` folder;
      - The import rules also work for CSS/SCSS/SASS files;
      - The `@import` rules, though, will _always_ point to `src/styles`, so _**keep your helpers in the same place!**_;
- When you build your library for publishing, everything inside your `docs` folder _is ignored_, as well as the `public` folder. You can, though, create another command/condition to build a documentation page;

> **NOTE**: you might have noticed I'm mixing `JSX` and `TSX` for the instructions above. This project supports the `TS`, `TSX`, `JS`, `JSX` and `MJS` extensions.

---

## Publishing Your Project

There are tons of places you can find about publishing to NPM or other repositories, so I leave it up to you to find the best practice for you.

The only thing to point is _pay attention to the name, version, author, license and repository URLs_ in `package.json`, don't forget to change it or you might find some problems.

---

## Authors

See `AUTHORS.md` for more information.

---

## License

This project is licensed under the `MIT License`. See `LICENSE.md` for more details.

-----

_&copy;2021 YUITI_
