# Odin

## Developer setup

### External dependencies

Install the following external dependencies:

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Go 1.18](https://go.dev/dl/) download arm64 if using Apple chip
- [nvm](https://github.com/nvm-sh/nvm#install--update-script)
- node: run `nvm install 16`
- [yarn](https://yarnpkg.com/getting-started/install)
- [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [aws sam cli](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [postgres-client](https://www.compose.com/articles/postgresql-tips-installing-the-postgresql-client/)
- [goose](https://github.com/pressly/goose#install)

### Clone Git Repository

1. [Generate new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
2. [Add a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
3. Choose a directory where you want to work. We'll call it WORKDIR
4. Open your Terminal and type: cd WORKDIR && git clone git@github.com:childrenofukiyo/odin.git
5. The previous command will create the directory: WORKDIR/odin

Initialize local postgres and server (Must run this script the first time)

1. Go to ./scripts
2. Run `./init-services.sh` (this script resets the database and runs migrations)

Start services

1. Go to ./scripts
2. Run `./start-services.sh` (this script keeps the database intact)

Run migrations

1. Go to ./scripts
2. Run `./migrate.sh`

Run Sanctuary

```shell
cd WORKDIR/sanctuary
yarn install
yarn dev
```

You should now be able to visit http://localhost:3000/

Run Website

```shell
cd WORKDIR/website
yarn install
yarn dev
```

You should now be able to visit http://localhost:3001/

### GoLand IDE (Recommended)

[Install GoLand](https://www.jetbrains.com/help/go/installation-guide.html)

Recommended plugins:

- Save Actions: Enables formatting code on save
- Grep Console: Color logs in console
- Prettier: Auto formatting for typescript and HTML
- Tailwind CSS: Tailwind class auto-complete
- One Dark Theme: Theme colors
- Atom Material Icons: Folder and file icons
- Nyan Progress Bar: Because lol

### AWS

[AWS Console](https://114892737845.signin.aws.amazon.com/console/)

![AWS diagram](aws_diagram.png)
