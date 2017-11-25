

let data = require("./data-service.js");

const path = require("path");
const express=require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
app.engine('.hbs', exphbs({extname: '.hbs' }));
app.set('view engine', '.hbs');


var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.engine(".hbs", exphbs({   
    extname: ".hbs",   
    defaultLayout: 'layout',   
    helpers: {     
        equal: function (lvalue, rvalue, options) {       
            if (arguments.length < 3)         
                throw new Error("Handlebars Helper equal needs 2 parameters");       
            if (lvalue != rvalue) {         
                return options.inverse(this);       
            } else {         
                return options.fn(this);       
            }     
        }   
    } 
})); 
app.set("view engine", ".hbs"); 

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    // res.sendFile(path.join(__dirname + "/views/home.html"));
    res.render("home");
});

app.get("/about", function(req, res){
    // res.sendFile(path.join(__dirname + "/views/about.html"));
    res.render("about");
});

app.get("/employees", function(req,res){
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then(function(data){
            // res.json(data);
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch(function(err){
            //res.json(err);
            res.render("employeeList", {data: {}, title: "Employees"});
        })
    } 
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department).then(function(data){
            // res.json(data);
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch(function(err){
            //res.json(err);
            res.render("employeeList", {data: {}, title: "Employees"});
        })
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager).then(function(data){
            //res.json(data);
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch(function(err){
            //res.json(err);
            res.render("employeeList", {data: {}, title: "Employees"});
        })
    }
    else{
        data.getAllEmployees().then(function(data){
            //res.json(data);
            res.render("employeeList", {data: data, title: "Employees"});
        }).catch(function(err){
            //res.json(err);
            res.render("employeeList", {data: {}, title: "Employees"});
        })
    }
});

app.get("/employee/:num", (req,res)=>{
    if(req.params.num){
        data.getEmployeeByNum(req.params.num).then(function(data){
            //res.json(data);
            res.render("employee", {data:data});
        }).catch(function(err){
            //res.json(err);
            res.status(404).send("Employee Not Found");
        })
    }
});

app.get("/managers", function(req,res){
    data.getManagers().then(function(data){
        //res.json(data);
        res.render("employeeList", {data: data, title: "Employees (Managers)"});
    }).catch(function(err){
        //res.json(err);
        res.render("employeeList", {data: {}, title: "Employees (Managers)"});
    })
})

app.get("/departments", function(req,res){
    data.getDepartments().then(function(data){
        //res.json(data);
        res.render("departmentList", {data: data, title: "Departments"});
    }).catch(function(err){
        //res.json(err);
        res.render("departmentList", {data: {}, title: "Departments"});
    });
})

app.get("/employees/add",(req,res)=>{
    res.render("addEmployee");
});

app.post("/employees/add", (req,res)=>{
    data.addEmployee(req.body).then(function(data){
        res.redirect("/employees");
    });
});

app.post("/employee/update", (req,res)=>{
    //console.log(req.body);
    data.updateEmployee(req.body).then(function(data){
        res.redirect("/employees");
    });
});

app.use((req,res)=>{
    res.status(404).send("404: Page Not Found");
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
	console.log("can't start the server -- file is broken");
})
