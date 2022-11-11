const axios = require("axios");
const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")();
const API = "https://random-data-api.com/api/v2/users";
const CsvFile = require("./CsvClass");



// API CALL
function apiCall() {
  axios
    .get(API)
    // .then((res) => createFileWithData(res.data))
    .then((res) => appendData(res.data))
    .then((_) => console.log("data saved"))
    .catch((err) => console.log(err));
}


const csvFile = new CsvFile({
  path: path.resolve(__dirname, "user.csv"),
  // headers to write
  headers: [
    "id",
    "first_name",
    "last_name",
    "username",
    "password",
    "email",
    "avatar",
    "gender",
    "dob",
    "address",
  ],
});

// CREATION OF FILE
function createFileWithData(data) {
  csvFile
    .create([
      {
        id: data?.id,
        first_name: data?.first_name,
        last_name: data?.last_name,
        username: data?.username,
        password: data?.password,
        email: data?.email,
        avatar: data?.avatar,
        gender: data?.gender,
        dob: data?.date_of_birth,
        address: `${data?.address.street_address} ${data?.address.city} ${data?.address.state} ${data?.address.country} ${data?.address.zip_code}`,
      },
    ])
    .then((_) => console.log("new file is created! and data is saved."))
    .catch((err) => console.log(err));
}


// SAVING THE DATA
function appendData(data) {
  csvFile
    .append([
      {
        id: data?.id,
        first_name: data?.first_name,
        last_name: data?.last_name,
        username: data?.username,
        password: data?.password,
        email: data?.email,
        avatar: data?.avatar,
        gender: data?.gender,
        dob: data?.date_of_birth,
        address: `${data?.address.street_address} ${data?.address.city} ${data?.address.state} ${data?.address.country} ${data?.address.zip_code}`,
      },
    ])
    .then((_) => console.log("data is appeneded!!"))
    .catch((err) => console.log(err));
}

// SORTING THE DATA
function sortData() {

  const data = [];
  csvFile
    .read()
    .on("data", (fectchedData) => data.push(fectchedData))
    .on("error", (err) => res.send(err))
    .on("end", (_) => {
      const csvObj2 = new CsvFile({
        path: path.resolve(__dirname, "user-sorted.csv"),
        // headers to write
        headers: [
          "id",
          "first_name",
          "last_name",
          "username",
          "password",
          "email",
          "avatar",
          "gender",
          "dob",
          "address",
        ],
      });

      const sortedData = sortAndCreate(data, "id");

      csvObj2
        .create(sortedData)
        .then((_) => console.log("data is sorted!!"))
        .catch((err) => console.log(err));
    });
}


// SORTING THE DATA
function sortAndCreate(arr, term) {
  return arr.sort((a, b) => {
    if (a[`${term}`] < b[`${term}`]) return -1;
    if (a[`${term}`] > b[`${term}`]) return 1;
    return 0;
  });
}


// FINDING THE DATA 
function findTheOne(arr, value) {
  return arr.find((item) => item.id == value);
}


// FIND USER DATA
function findData() {
  const id = prompt("what is the id?");

  const data = [];
  csvFile
    .read()
    .on("data", (fectchedData) => data.push(fectchedData))
    .on("error", (err) => res.send(err))
    .on("end", (_) => {
      const flag = findTheOne(data, id);

      flag ? console.log(flag) : console.log("Data not found!!");
    });
}


// READING DATA FROM FILE
function readData() {
  const data = [];
  csvFile
    .read()
    .on("data", (fectchedData) => data.push(fectchedData))
    .on("error", (err) => res.send(err))
    .on("end", (_) => console.log(data));
}


// for saving data from API
//  setInterval(() => {
//   apiCall()
//  },1000); 


// from reading data from CSV file..
// readData();


// from finding data from CSV file
// findData();


// for sorting data from CSV file and making new CSV file..
// sortData();
