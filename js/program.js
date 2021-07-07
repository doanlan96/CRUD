$(function() {
    $(".header").load("header.html");
    $(".main").load("home.html");
    $(".footer").load("footer.html");
});

function clickNavHome() {
    $(".main").load("home.html");
}

function clickNavViewListEmployees() {
    $(".main").load("viewlistemployees.html");
    // buildTable();
    renderEmployees();
}

let api = "https://6051796b5346090017671a0e.mockapi.io/api/v1/employees"

// let api = "https://jsonplaceholder.typicode.com/todos"

async function getListEmployees() {
    try {
        let res = await fetch(api);
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}


async function renderEmployees() {
    let employees = await getListEmployees();
    let html ='';
    employees.forEach(employee => {
        let htmlSegment =   `<tr class="employee-${employee.id}">
                            <td>${employee.id}</td>
                            <td>${employee.name}</td>
                            <td>${employee.department}</td>
                            <td>${employee.phone}</td>
                            <td>
                            <a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateModal(${employee.id} )"><i class="material-icons">&#xE254;</i></a>
                            <a class="delete" title="Delete" data-toggle="tooltip" onClick="deleteEmployee(${employee.id})"><i class="material-icons">&#xE872;</i></a>
                            </td>
                            </tr>`;
        html += htmlSegment;
    });

    let inner = document.querySelector('.inner');
    inner.innerHTML = html;
}

function buildTable() {
    $('tbody').empty();
    getListEmployees();
}

function openAddModal() {
    openModal();
}

function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("department").value = "";
    document.getElementById("phone").value = "";
}

function openModal() {
    $('#myModal').modal('show');
}

function hideModal() {
    $('#myModal').modal('hide');
}

async function addEmployee() {

    let name = document.getElementById("name").value;
    let department = document.getElementById("department").value;
    let phone = document.getElementById("phone").value;

    let formData = {
        name: name,
        department: department,
        phone: phone,
    }

    let options = {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    };

    await fetch(api, options)
        .then(function (response) {
            // console.log(options);
            response.json();
        })
        .then(console.log('Success: ', formData))
        .then(getListEmployees())
        .catch((error) => {
            console.error('Error:', error);
          });
}

async function openUpdateModal(id) {

    let employees = await getListEmployees();

    // get index from employee's id
    var index = employees.findIndex(x => x.id == id);

    // fill data
    document.getElementById("id").value = employees[index].id;
    document.getElementById("name").value = employees[index].name;
    document.getElementById("department").value = employees[index].department;
    document.getElementById("phone").value = employees[index].phone;

    openModal();
}

function save() {
    var id = document.getElementById("id").value;

    if (id == null || id == "") {
        addEmployee();
    } else {
        updateEmployee();
    }
}

async function updateEmployee() {

    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let department = document.getElementById("department").value;
    let phone = document.getElementById("phone").value;

    let formData = {
        name: name,
        department: department,
        phone: phone,
    }

    let options = {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    };

    await fetch(api + '/' + id, options)
        .then(function (response) {
            console.log(api + '/' + id);
            response.json();
        })
        .then(console.log('Success: ', formData))
        .catch((error) => {
            console.error('Error:', error);
        });
    }

function deleteEmployee(id) {

    options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    fetch(api + '/' + id, options)
        .then(function (response) {
            response.json();
        })
        .then(function () {
            let employee = document.querySelector('.employee-' + id);
            result = confirm("Want to delete " + "?");
            if (result) {
                employee.remove();
                alert("Success");
            }
        });
}

function showSuccessAlert() {
    $("#success-alert").fadeTo(2000, 500).slideDown(500, function() {
        $("#success-alert").slideDown(500);
    });
}

function selectResponse() {

    let selectResponsex = document.querySelector('#select-response');

    selectResponsex.onchange = function () {
        if (document.querySelector('#select-response').value == "json") {
            fetch(api)
            .then((response) => response.json())
            .then((json) => alert(json));
        }
        if (document.querySelector('#select-response').value == "text") {
            fetch(api)
            .then((response) => response.text())
            .then((text) => alert(text));
        }
    };
}