# Situ Note

This is my honored self-made blog powered by Gatsby.

Still under development.

![](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Gatsby-663399?style=for-the-badge&logo=gatsby&logoColor=white)
![](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
![](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=white)
![](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

## How to clone

For separately storing the blog posts, this repo currently works with submodule. Here are the commands for cloning this repo with its sub module.

If you are new to this repo.

```powershell
git clone --recurse-submodules https://github.com/situ2001/situ-note.git
```

## How to update blog posts

If you want to pull the commits from the origin [repo](https://github.com/situ2001/blog-posts) of submodule.

```powershell
git submodule update --remote --merge
```

Then you can commit this update.

```powershell
git add contents/blog-posts
git commit -m "blog-posts: update"
```
