# Vivid-panda

Best `ZPI` in the entire universe, don't change my mind

## Folder structure

- api/ui/shared - UI components that are used across the entire app like buttons
- app/ui - reusable components, less atomic components such as headers, footers
- app/lib - anything related to any non UI components like API integration
- app - project template created folder used for routing
- public - all files available to user like the favicon

## Navigation

 The ```/app``` folder has `layout.tsx`, `page.tsx` and `loading.tsx` which show the static layout, the page and the loading page. Folders inside the ```/app``` beside `ui` and `lib` are routes in the URL. If you want a folder that is not a route (for example nested inside some other route) you should add parentheses to its name.

## Icons

https://react-icons.github.io/react-icons/


## Hooks

If you want to you use hooks the component/page should have `'use client'` on top of the file.

If you are creating functions that are used in client/server components add `'use server`

## Getting Started

- Install dependencies using
    ```bash
    npm install
    ```

- Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!