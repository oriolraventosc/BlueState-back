# README API BlueState

## Public endpoints

## **POST**

### /users/login

- Log into BlueState
- **Body** => {"username": "example", "password": "example};
- **Response** => {"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzN2JiMjIzYWY1MTcxNTZhYTA5ODk5MiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2NjkwNTg0NDIsImV4cCI6MTY2OTMxNzY0Mn0.Ob5xXFgx491TU5psh4AfVUSPk4nob\_\_\_zJEfODIIrX0"}

## **POST**

### /users/register

- Register a new user
- **Body** => {"username": "example", "password": "example};
- **Response** => {"username": "example", "password": "example"}

## Protected endpoints

## **GET**

### /business/loadBusinesses

- Load a list of businesses
- **Body** => {}
- **Response** => {"name": "business name", "email": "@example", "telephone": "+34 556 223", "location": "Sant Cugat", service: "business activity", "website": "www.example.com"}

## **GET**

### /business/loadBusiness/:id

- Load the selected business
- **Body** => {"\_id": "1233j233414"}
- **Response** => {"name": "business name", "email": "@example", "telephone": "+34 556 223", "location": "Sant Cugat", service: "business activity", "website": "www.example.com"}

## **DELETE**

### /business/delete/:id

- Delete the selected business
- **Body** => {"\_id": "1233j233414"}
- **Response** => {"message": "Business deleted"}

## **POST**

### /business/create

- **Create a new business**
- **Body** => {"name": "business name", "email": "@example", "telephone": "+34 556 223", "location": "Sant Cugat", service: "business activity", "website": "www.example.com"}
  Response => {"name": "business name", "email": "@example", "telephone": "+34 556 223", "location": "Sant Cugat", service: "business activity", "website": "www.example.com"}

## **PUT**

### /business/update

- Update a business
- **Body** => {"name": "business name", "email": "@example", "telephone": "+34 556 223", "location": "Sant Cugat", service: "business activity", "website": "www.example.com"}
- **Response** => {"message": "Business updated"}
