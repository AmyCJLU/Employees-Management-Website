const fs = require('fs');
let employees = [];
let deparments = [];
var empCount = 0;

module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json', (err,data)=>{
            if(err){
                reject("can't load employees")
            }else{
                employees=JSON.parse(data);

                fs.readFile('./data/departments.json', (err,data)=>{
                    if(err){
                        reject("can't load departments");
                    } else{
                        departments=JSON.parse(data);
                        if(departments.length > 0 && employees.length > 0){
                            empCount = employees.length;
                            resolve();
                        }else{
                            reject("employees or departments is empty");
                        }
                    }
                })
            }
        })      
    });
}

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve,reject){
        if(employees.length > 0){
            resolve(employees);
        } else {
            reject({message: "No result returned"});
        }
    });
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        let matchedRecord = [];
        for(let i=0; i<employees.length; i++){
            if(employees[i].status==status){
                matchedRecord.push(employees[i]);
            }
        }
        if(matchedRecord.length>0){
            resolve(matchedRecord);
        }
        else {
            reject({message: "No results returned"});
        }
    });
}

module.exports.getEmployeesByDepartment = function (department){
    return new Promise(function(resolve, reject){
        let matchedRecord = [];
        for(let i=0; i<employees.length; i++){
            if(employees[i].department==department){
                matchedRecord.push(employees[i]);
            }
        }
        if(matchedRecord.length>0){
            resolve(matchedRecord);
        }
        else {
            reject({message: "No results returned"});
        }
    });
}

module.exports.getEmployeesByManager = function (manager){
    return new Promise(function(resolve, reject){
        let matchedRecord = [];
        for(let i=0; i<employees.length; i++){
            if(employees[i].employeeManagerNum==manager){
                matchedRecord.push(employees[i]);
            }
        }
        if(matchedRecord.length>0){
            resolve(matchedRecord);
        }
        else {
            reject({message: "No results returned"});
        }
    });
}

module.exports.getEmployeeByNum = function (num){
    return new Promise(function(resolve, reject){
        for(let i=0; i<employees.length; i++){
            if(employees[i].employeeNum==num){
                resolve(employees[i]);
            }
        }   
        reject({message: "No results returned"});        
    });
}

module.exports.getManagers = function (){
    return new Promise(function(resolve, reject){
        let matchedRecord = [];
        for(let i=0; i<employees.length; i++){
            if(employees[i].isManager==true){
                matchedRecord.push(employees[i]);
            }
        }
        if(matchedRecord.length>0){
            resolve(matchedRecord);
        }
        else {
            reject({message: "No results returned"});
        }
    });
}

module.exports.getDepartments = function (){
    return new Promise(function(resolve,reject){
        if(departments.length > 0){
            resolve(departments);
        } else {
            reject({message: "No result returned"});
        }
    });
}

module.exports.addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        empCount += 1;
        employeeData.employeeNum = empCount;
        employees.push(employeeData);
        resolve();
    });
}

module.exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        for (let i=0; i<employees.length; i++){
            if(employees[i].employeeNum == employeeData.employeeNum){
                employees[i] = employeeData;
                resolve();
            }
        }
    });
}

