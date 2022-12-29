# WineGameDB

This is the repository containing the source code for the WineGameDB Website (`winegamedb.github.io`)

## Running locally

- Make sure `git` and `yarn` are installed
- Open a terminal, `git clone` this repository, `cd` into the cloned folder
- Run `yarn` to install all dependencies
- Obtain the latest WineGame.db from [WineGameDB/db](https://github.com/WineGameDB/db), place it into the `public` folder
- Run `yarn refreshImages` to download game covers
- Finally:
  - Start a development server with `yarn dev` or
  - Start a production server with `yarn build && yarn preview`
