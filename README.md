# Ignite Node.JS - 2023

[![Node.JS](https://skills.thijs.gg/icons?i=nodejs)](https://skills.thijs.gg)

## Start 🏁

No terminal, na pasta raiz do projeto, execute o comando:

```bash
yarn
```

Após a instalção das depêndencias, execute esse comando para iniciar o [husky](https://typicode.github.io/husky/):

```bash
yarn prepare
```

### .env

Copie o arquivo `.env.example` para `.env`
Altere conforme sua preferência

### Migrations

Após a configuração do seu arquivo `.env`, execute o comando:

```bash
yarn knex migrate:latest
```

Isso ira popular o banco de dados `sqlite` (quando em ambiente de `testes` e `local`) com as tabelas base

### Rodando o projeto

Basta executar o comando:

```bash
yarn dev
```

### Tests

A aplicação utiliza o [vitest](https://vitest.dev/) para a execução dos testes

Estão disponíveis os comandos:

- `test`
- `test:ui` para utilização do [vitest/ui](https://vitest.dev/guide/ui.html)
- `test:coverage` para averiguar a porcentagem de `coverage` (cobertura) do projeto utilizando o [istambul.js](https://istanbul.js.org/) como interface
