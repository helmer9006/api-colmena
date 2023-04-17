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
`http://localhost:4000/api/users/getAllUsers`

### 2) create the docker image

cd api-colmena
docker build -t test-colmena:1 .

## 3) Create the api container

docker create -p4000:4000 --name api-colmena test-colmena:1

## 4) Execute TEST

npm test
