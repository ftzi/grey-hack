# Grey Hack scripts - WIP

Personal scripts for the **[Grey Hack](https://store.steampowered.com/app/605230/Grey_Hack/)** game. Still on early stage.

## **You might be particularly interested in:**
- **The `try` function**: https://github.com/ftzi/grey-hack/blob/main/root/try.src
- **The [compiler](https://github.com/ftzi/grey-hack/blob/main/root/c.src)**. It compiles your entry file and its imported files automatically. Supports watch mode, execute after build, [automated tests](https://github.com/ftzi/grey-hack/blob/main/root/utils/test.src), and an importable function to make your programs self-compile with the latest source when executed.
- **Automatic upload of the changed source files to the game while you use your favorite IDE. See [`package.json`](https://github.com/ftzi/grey-hack/blob/main/package.json) and [`watch.ts`](https://github.com/ftzi/grey-hack/blob/main/watch.ts)**. Note that by choice, I don't use Greybel's build system, only its raw upload.

# Setup
1) Install BepInEx 5.x.x: https://github.com/ayecue/greybel-vs#message-hook
1) Clone this repo.
1) Have [node](https://nodejs.org/en) installed. [Bun](https://bun.sh/), as an alternative, didn't work here with Greybel.
1) Run `npm i`

## Development / Play
1) Run the game.
1) Run `npm start`. All the files will be uploaded to the game and also any changes done to them.

# Game
1) Run `sudo -s` and enter your password.
1) Run `build c.src /root` to build the compilation tool.
1) Run `c` to build all the source files in the current directory (`/root`) and their required libraries.
1) Run `setup home` to secure your home computer and setup the auto-root Terminal on startup.

## Info
- You can run the program `clean` to remove all the source files and executables in `/root` and related subdirectories. Then you can run `npm start` in your real terminal to upload them again.

# Tips
- The VS Code extension https://github.com/ayecue/greybel-vs is recommended for syntax highlight.
