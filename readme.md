# HarmoniCLI

This application lets you play music right in your terminal! You'll be
_flabberghasted_ by how fun and intuitive the interface is.

<img width="827" alt="image" src="https://github.com/WVAviator/harmonicli/assets/11326285/c24d30ed-dd6b-4b58-92a7-769d75353ab8">

Get started by cloning this repo, and then run the following commands:

- `yarn`
- `yarn install:local`

This installs the `harmonicli` command globally and may require a password.
Alternatively, if you do not want to install the CLI globally or cannot sudo,
you can use `yarn dev` in place of `harmonicli`.

To play the first search result by default, simply append your search query to the `harmonicli` command like so:

`harmonicli old town road`

To change songs, use your arrow keys or (h, j, k, l) vim direction keys to choose one of the provided playback
controls ⏮, ⏯, and ⏭. Music Browser CLI uses Youtube Music under the hood, and
the playlist is determined randomly based on your song search.

To adjust volume, move down to the volume control and press enter. Then use
left/right keys to adjust and press enter again.

To search for a different song, enter your query in the search box and move
down to select a new song and press enter.

<img width="830" alt="image" src="https://github.com/WVAviator/harmonicli/assets/11326285/f29fd0c7-5dff-4479-966b-53d9451630c6">

It's that easy!

## Contributing

If you want to contribute to this project, please reach out. We are still
planning to implement many features including using Spotify or Apple Music in
place of YTMusic, and could use help (especially if you're familiar with React,
Typescript, and Puppeteer).
