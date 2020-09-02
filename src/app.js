const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequestsMiddleware(request, response, next) {
  const  { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
};

function validadeRepositoryId(request, response, next) {
  const { id } = request.params;
  const  { method, url } = request;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Invalid Repository ID'});
  }

  return next();
}

app.use(logRequestsMiddleware);
app.use("/repositories/:id", validadeRepositoryId);

// app.get("/repositories", aquiPodeUmMiddlewareTbm, aquiOutro,...eAssimVai, (request, response) => {
app.get("/repositories", (request, response) => {
  return response.json(repositories);  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);
  
  return response.json(repository)
});

app.put("/repositories/:id", validadeRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  var repository = repositories[repositoryIndex]
    
  repository.title = title;
  repository.url = url;
  repository.techs = techs;
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", validadeRepositoryId, (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  var repository = repositories[repositoryIndex]
    
  repository.likes ++;
  
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
