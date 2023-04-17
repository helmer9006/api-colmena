# test-colmena

API development as test submission to access backend cargo with node

## Steps

## PART I: Download & Build on local

## Method 1: From github

### 1) Clone the repository, install node packages and verify routes locally

```
//on local
git clone https://github.com/helmer9006/api-colmena.git
cd api-colmena
npm install
npm start
```

Open your local browser and verify the test-api-soyyo is working by accessing:  
`http://localhost:4000/api/users/getAll`
`http://localhost:4000/api/auth`
`http://localhost:4000/api/users/getById/2`

### 2) Documentation API
visit url http://localhost:4000/api/docs

## 3) Execute TEST

npm test

### 4) create the docker image

docker build -t test-colmena:1 .

## 5) Create the api container docker

docker create -p4000:4000 --name api-colmena test-colmena:1

