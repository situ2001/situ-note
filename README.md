# Situ Note

This is my honored self-made blog powered by Gatsby.

Still under development.

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
