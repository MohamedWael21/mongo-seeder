# Mongo Seeder

Advanced CLI tool to generate fake data and seed MongoDB with:

- Custom schemas
- Relationships (refs)
- Embedded documents
- Arrays
- Auto dependency resolution
- Faker-powered data generation

---

# Installation

```bash
npm install
npm link
```

---

# Usage

```bash
mongo-seeder seed --config ./config.json --uri mongodb://localhost:27017/testdb
```

---

# Config File Structure

```json
{
  "collections": {
    "collectionName": {
      "count": 10,
      "schema": {}
    }
  }
}
```

---

# Schema Types

## 1. Basic Faker Fields

```json
{
  "name": "name",
  "email": "email",
  "age": "number"
}
```

---

## 2. Relationships (References)

```json
{
  "userId": { "ref": "users" }
}
```

✔ Automatically links documents using `_id`
✔ Order of collections does NOT matter

---

## 3. Embedded Objects

```json
{
  "profile": {
    "age": "number",
    "address": {
      "city": "city",
      "country": "country"
    }
  }
}
```

---

## 4. Arrays

```json
{
  "tags": {
    "type": "array",
    "length": 3,
    "of": "word"
  }
}
```

---

## 5. Password Hashing

Passwords are automatically hashed using `bcryptjs`. By default, the `password` type uses `"12345"`.

```json
{
  "password": "password"
}
```

You can also provide a static value to be hashed:

```json
{
  "password": {
    "type": "password",
    "value": "mySecretPassword"
  }
}
```

---

## 6. Configurable Types (Number & Price)

You can restrict the range for `number` and `price` types:

```json
{
  "age": {
    "type": "number",
    "min": 18,
    "max": 65
  },
  "amount": {
    "type": "price",
    "min": 100,
    "max": 1000
  }
}
```

---

## 7. Enum Values

You can pick a random value from a predefined list:

```json
{
  "role": {
    "type": "enum",
    "values": ["admin", "user", "editor"]
  }
}
```

---

## Full Example

```json
{
  "collections": {
    "posts": {
      "count": 20,
      "schema": {
        "title": "sentence",
        "authorId": { "ref": "users" }
      }
    },
    "users": {
      "count": 10,
      "schema": {
        "name": "name",
        "email": "email",
        "profile": {
          "age": "number",
          "address": {
            "city": "city",
            "country": "country"
          }
        },
        "tags": {
          "type": "array",
          "length": 3,
          "of": "word"
        }
      }
    }
  }
}
```

---

# Available Faker Types

| Type      | Description     |
| --------- | --------------- |
| name      | Full name       |
| firstName | First name      |
| lastName  | Last name       |
| email     | Email           |
| username  | Username        |
| password  | Hashed "12345" (default) |
| sentence  | Random sentence |
| paragraph | Paragraph       |
| word      | Single word     |
| number    | Integer (Configurable) |
| float     | Float           |
| boolean   | true/false      |
| uuid      | UUID            |
| date      | Past date       |
| city      | City name       |
| country   | Country         |
| street    | Street address  |
| company   | Company name    |
| jobTitle  | Job title       |
| phone     | Phone number    |
| url       | URL             |
| image     | Image URL       |
| price     | Price (Configurable) |

---

# How It Works

1. Reads config file
2. Detects relationships (`ref`)
3. Builds dependency graph
4. Sorts collections automatically
5. Generates fake data
6. Inserts into MongoDB

---

# Errors

### Circular dependency

```
Circular dependency detected
```

### Missing reference

```
Missing reference data: users
```

---

# Development

```bash
npm start
```
