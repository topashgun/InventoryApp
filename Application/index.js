const express = require('express')
const cors = require('cors')
const path = require('path')
const mysql = require('mysql');

const app = express()
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

const port = 4000
const connection = mysql.createPool({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    user: 'user1',
    password: 'user1',
    database: 'containers',
    port: 3306
});

app.get('/api/', (req, res) => res.send('Hello World!'))

app.get('/api/getcontainers', (req, res) => {
    const { parent } = req.query;
    connection.query("SELECT * FROM tbl_containers where parent='" + parent + "'", (error, result) => {
        return res.json(result)
    });
});

app.get('/api/getParents', (req, res) => {
    const { type } = req.query;
    connection.query("SELECT distinct name FROM tbl_containers where type='container' and (contains='" + type + "' || contains='-')", (error, result) => {
        return res.json(result)
    });
});

app.get('/api/add', (req, res) => {
    const { type, name, parent, quantity } = req.query;

    var d = new Date();
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ms = d.getMilliseconds();
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();

    var identifier = date + "" + month + "" + year + "" + hr + "" + min + "" + ms;
    console.log("identifier : " + identifier);
    if (type == "inventory") {
        connection.query('update tbl_containers set contains="inventory" where name="' + parent + '"');
    } else {
        connection.query('update tbl_containers set contains="container" where name="' + parent + '"');
    }

    connection.query("SELECT * FROM tbl_containers where name='" + parent + "'", (error, result) => {
        var hierarchy = "";
        if (result.length >> 0) {
            result[0].hierarchy == 0
                ? hierarchy = parent
                : hierarchy = result[0].hierarchy + "," + parent
        }

        connection.query('insert into tbl_containers values ("' + type + '","' + name + '","' + parent + '","' + quantity + '","-","' + hierarchy + '","' + identifier + '")');
        return res.send("added successfully");
    });
})

app.get('/api/getParentsToMove', (req, res) => {
    const { name, parent, type } = req.query;
    let resultsArray = [];
    connection.query("SELECT distinct name,hierarchy FROM tbl_containers where name != '" + name + "' and name !='" + parent + "' and type='container' and (contains='-' or contains='" + type + "')", (error, response) => {
        response.map(parents => {
            let tempParentArray = parents.hierarchy.split(',');
            if (tempParentArray.indexOf(name) == -1) {
                resultsArray.push(parents.name)
            }
        })
        return res.json(resultsArray)
    });
});

app.get('/api/deleteItem', (req, res) => {
    const { name, type } = req.query;
    connection.query('delete from tbl_containers where name = "' + name + '" or hierarchy like "%' + name + '%"')
    return res.send("deleted successfully");
});

app.get('/api/moveTo', (req, res) => {
    const { name, moveTo, currentParrent, type } = req.query;
    let oldParentHierarchy = currentParrent + ',' + name;

    connection.query('select * from tbl_containers where name="' + moveTo + '"', (error, response) => {
        let parentHiearachy = (response[0].hierarchy.length == 0 ? '' : response[0].hierarchy + ",") + moveTo
        connection.query("update tbl_containers set hierarchy='" + parentHiearachy + "' where name='" + name + "'");

        let newParentHierarchy = parentHiearachy + "," + name;
        connection.query("update tbl_containers set hierarchy='" + newParentHierarchy + "' where hierarchy like '%" + oldParentHierarchy + "'");
    })

    connection.query('update tbl_containers set parent="' + moveTo + '" where name="' + name + '"', () => {
        connection.query('select * from tbl_containers where parent="' + currentParrent + '"', (error, response) => {
            response.length == 0
                ? connection.query('update tbl_containers set contains="-" where name="' + currentParrent + '"')
                : ''
        })
    });

    connection.query('update tbl_containers set contains="' + type + '" where name="' + moveTo + '"');
    return res.send("added successfully");
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))