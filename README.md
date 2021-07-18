# Unitask

[Demo](https://unitask.tianpan.co/)

Unitask flattens all your recent tasks in Github and JIRA into one table.

![](https://tp-misc.b-cdn.net/unitask-demo.png)

All your credentials are stored in your browser local storage and only passed to the server for queries. Therefore, the server will never store your credentials. Use this service at your own risk.

## User Setup

If you are a user of this service, please go to https://unitask.tianpan.co/setup/ or http://localhost:5000/setup/

## Development

### Run the project

This is intended for \*nix users. If you use Windows, go to [Run on Windows](#run-on-windows). Let's first prepare the environment.

```bash
npm install
```

#### Development mode

To run your project in development mode, run:

```bash
npm run watch
```

The development site will be available at [http://localhost:5000](http://localhost:5000).

#### Production Mode

It's sometimes useful to run a project in production mode, for example, to check bundle size or to debug a production-only issue. To run your project in production mode locally, run:

```bash
npm run build-production
NODE_ENV=production npm run start
```

#### NPM scripts

- `npm run test`: test the whole project and generate a test coverage
- `npm run ava ./path/to/test-file.js`: run a specific test file
- `npm run build`: build source code from `src` to `dist`
- `npm run lint`: run the linter
- `npm run kill`: kill the node server occupying the port 5000.
