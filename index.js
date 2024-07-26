#! /usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
// Class Customer
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// Class Bank
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(objCuss) {
        this.customer.push(objCuss);
    }
    addAccount(objAcc) {
        this.account.push(objAcc);
    }
    transaction(objAcc) {
        let newAmount = this.account.filter((val) => val.accNumber !== objAcc.accNumber);
        this.account = [...newAmount, objAcc];
    }
}
let autherName = "Huzaifa Abdulrab";
console.log(`>>>>>>>>>>>>>>>>>>>>>>>>${chalk.blueBright(autherName)}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
let bankAccountDetail = "This bank has created over 100 accounts, and all account passwords start from 1001.";
console.log(chalk.bgCyan.white(bankAccountDetail));
let myBank = new Bank();
// Customer Create
for (let i = 1; i <= 100; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let number = parseInt(faker.string.numeric(10));
    const cus = new Customer(fName, lName, 25 + i, "male", number, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccount({ accNumber: cus.accNumber, balance: 100 * i });
}
async function bankServices(bank) {
    do {
        let services = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Please select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });
        // View Balance
        if (services.select == "View Balance") {
            let res = await inquirer.prompt({
                name: "accNum",
                type: "input",
                message: "Please Enter Your Account Number :",
            });
            let account = myBank.account.find((acc) => acc.accNumber == parseInt(res.accNum));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            else {
                let name = myBank.customer.find((item) => item.accNumber == account.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your Account balance is ${chalk.yellow("$" + account.balance)}`);
            }
        }
        // Cash Withdraw
        if (services.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                name: "accNum",
                type: "input",
                message: "Please Enter Your Account Number :",
            });
            let account = myBank.account.find((acc) => acc.accNumber == parseInt(res.accNum));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            else {
                let ans = await inquirer.prompt({
                    name: "ansCash",
                    type: "input",
                    message: "Please Enter Amount",
                });
                let withdrawAmount = parseFloat(ans.ansCash);
                if (withdrawAmount > account.balance) {
                    console.log(chalk.red("Insufficient balance"));
                }
                else {
                    let newBalance = account.balance - withdrawAmount;
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(`Your new balance is ${chalk.yellow("$" + newBalance)}`);
                }
            }
        }
        // Cash Deposit
        if (services.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                name: "accNum",
                type: "input",
                message: "Please Enter Your Account Number :",
            });
            let account = myBank.account.find((acc) => acc.accNumber == parseInt(res.accNum));
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            else {
                let ans = await inquirer.prompt({
                    name: "ansCash",
                    type: "input",
                    message: "Please Enter Amount",
                });
                let depositAmount = parseFloat(ans.ansCash);
                let newBalance = account.balance + depositAmount;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(`Your new balance is ${chalk.yellow("$" + newBalance)}`);
            }
        }
        // Exit
        if (services.select == "Exit") {
            return;
        }
    } while (true);
}
bankServices(myBank);
