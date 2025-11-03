# Ticket Sales

Esse repositório contempla as atividades práticas da disciplina de Sistemas WEB II (CSI607). A aplicação desenvolvida se trata de um serviço de Vendas de Ingressos.

**Aluno(a)**: Beatriz Dalfior - 22.1.8012

## Atividade Prática 1 - Implementação do microsserviço de Vendas de Ingressos

Foi desenvolvido o microsserviço de vendas (`Sales`) para a aplicação com **Spring Boot**.

O arquivo markdown com a descrição dos endpoints que foram definidos se encontra dentro da pasta `tickets`, denominado como `README.md`.

### Inicialização

Para iniciar o servidor, certifique-se que o **Docker Desktop** esteja em execução. Assim que inicializado, navegar até a pasta `docker` e executar o comando `up`:

```bash
docker-compose -f docker-compose-dev.yml up --build
```
