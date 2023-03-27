# Projeto Sensor de Águas

Este é um projeto de sensor de águas que consiste em um dispositivo que pode ser colocado em rios, lagos ou outras fontes de água para monitorar a temperatura, a pressão, a acidez e outras características da água.

## Diagrama do Sensor de Águas

![Diagrama do Sensor de Águas](/public/assets/water-sensor_diagram.png "Diagrama do Sensor de Águas")

## Instalação e Uso

1. Clone este repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor com `npm start`.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Axios

## Licença

Este projeto está licenciado sob a licença ISC.

## Autor

O projeto foi desenvolvido por Wilder Carvalho como atividade para entrevista técnica da Hent.

## Rotas disponíveis

- **GET `/sensor`**: Retorna uma lista com todos os ids dos sensores.
- **POST `/sensor`**: Cria um novo sensor, com limite máximo de 100 sensores.
- **GET `/sensor/:id/medida`**: Pega todas as medidas do sensor, onde o parâmetro `id` é o id do sensor.
- **POST `/sensor/:id/medida`**: Cria uma nova medida no sensor, onde o parâmetro `id` é o id do sensor.
- **GET `/sensor/:id/status`**: Pega o status do sensor, que pode ser verde, amarelo e vermelho, e a média normalizada das medidas de pressão, temperatura e acidez, onde o parâmetro `id` é o id do sensor.
- **GET `/sensor/status`**: Mostra o status geral dos sensores e a média da média normalizada dos sensores.