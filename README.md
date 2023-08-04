# Ignite Node.JS - 2023 - Desafio 02

[![Node.JS](https://skills.thijs.gg/icons?i=nodejs)](https://skills.thijs.gg)

## Specs do desafio

[Notion](https://efficient-sloth-d85.notion.site/Desafio-02-be7cdb37aaf74ba898bc6336427fa410) do `Desafio 02`
[Figma](https://www.figma.com/community/file/1218573349379609244) do `Desafio 02`

## Start 🏁

No terminal, na pasta raiz do projeto, execute o comando:

```bash
npm install
```

Após a instalção das depêndencias, execute esse comando para iniciar o [husky](https://typicode.github.io/husky/):

```bash
npm run prepare
```

### .env

Copie o arquivo `.env.example` para `.env`
Altere conforme sua preferência

### Migrations

Após a configuração do seu arquivo `.env`, execute o comando:

```bash
npm run knex migrate:latest
```

Isso ira popular o banco de dados `sqlite` (quando em ambiente de `testes` e `local`) com as tabelas base

### Rodando o projeto

Basta executar o comando:

```bash
npm run dev
```

### Tests

A aplicação utiliza o [vitest](https://vitest.dev/) para a execução dos testes

Estão disponíveis os comandos:

- `test`
- `test:ui` para utilização do [vitest/ui](https://vitest.dev/guide/ui.html)
- `test:coverage` para averiguar a porcentagem de `coverage` (cobertura) do projeto utilizando o [istambul.js](https://istanbul.js.org/) como interface

### Requisitos do `Desafio 02`

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
      _As refeições devem ser relacionadas a um usuário._
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
