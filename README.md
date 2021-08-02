# Situ Note

This is my honored self-made blog powered by Gatsby.

Still under development.

## How to clone

For separately storing the blog posts, this repo currently works with submodule. Here are the commands for cloning this repo with its sub module.

If you are about to newly clone this repo.

```powershell
git clone --recurse-submodules https://github.com/situ2001/situ-note.git
```

---

If you want to update the commits of submodule.

```powershell
git submodule update --remote --merge
```

Then you can commit this update.

```powershell
git add contents/blog-posts
git commit -m "blog-posts: update"
```
