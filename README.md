# Grey Hack scripts - WIP

Personal scripts for the **[Grey Hack](https://store.steampowered.com/app/605230/Grey_Hack/)** game. Still on early stage.

**You might be interested in just the `package.json` and the `watch.ts` files, so you can also have the automatic upload of source files to the game.** I don't use Greybel's build system, only its raw upload.

If so, you can clone this and remove all the contents in the `root` directory and have your own files there.

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
1) Run `setup home <password>` to secure your home computer and setup the auto-root Terminal on startup.

# Tips
- The VS Code extension https://github.com/ayecue/greybel-vs is recommended for syntax highlight.
