# HarmoniCLI

This application lets you play music right in your terminal! You'll be
_flabberghasted_ by how fun and intuitive the interface is.

Get started by cloning this repo, and then run the following commands:

- `yarn`
- `yarn install:local`

This installs the `play` command globally and may require a password.
Alternatively, if you do not want to install the CLI globally or cannot sudo,
you can use `yarn dev` in place of `harmonicli`.

To play a song, simply append your search query to the `harmonicli` command like so:

`play old town road`

To change songs, use your arrow keys to choose one of the provided playback
controls ⏮, ⏯, and ⏭. Music Browser CLI uses Youtube Music under the hood, and
the playlist is determined randomly based on the song you select.

To adjust volume, arrow down to the volume control and press enter. Then use
left/right arrow keys to adjust and press enter again.

To search for a different song, enter your query in the search box and arrow
down to select a new song and press enter.

It's that easy!

## Contributing

If you want to contribute to this project, please reach out. We are still
planning to implement many features including using Spotify or Apple Music in
place of YTMusic, and could use help (especially if you're familiar with React,
Typescript, and Puppeteer).
