window.addEventListener('load', fetchData);

let computedData=[];
async function fetchData() {
    // Show loader
    document.getElementById('loader-wrapper').style.display = 'flex';
    try {
        let data=[];
        // fetch data from api
        const response = await fetch("https://datausa.io/api/data?drilldowns=Nation&measures=Population");
        data = await response.json().then((response) => {
            return response.data;
        }).finally(()=>{
            computedData = data.concat(generateRecords())
            document.querySelectorAll('button').forEach(button => {
                button.disabled = false;
            });
            // hide loader
            document.getElementById('loader-wrapper').style.display = 'none';
        });
    } catch (error) {
        console.error('Error fetching data :', error);
    }
    formatData();
}

function formatData() {
    // show the data in the table
    const tableBody = document.querySelector("#populationTable tbody");
    tableBody.innerHTML = "";

    computedData.forEach(entry => {
        const row = document.createElement("tr");
        Object.values(entry).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

document.getElementById('sortWithWebWorkers').addEventListener('click', function () {
    // Sorting with web workers
    const startTime = performance.now();
    const worker = new Worker('worker.js');
    const order = document.getElementById('order').value;
    worker.postMessage({ computedData, order });
    worker.onmessage = function (event) {
        computedData = event.data;
        formatData();
        const endTime = performance.now();
        console.log(endTime - startTime)
        document.getElementById('timeTaken').innerHTML = "<span>Time taken for data sorting <strong> web workers</strong>:"+String(endTime - startTime)+"ms</span>";
    };
});


document.getElementById('sortWithoutWebWorkers').addEventListener('click', function () {
    // sorting without web workers
    const startTime = performance.now();
    const order = document.getElementById('order').value;
    console.log(order)
    if(order == 'ascending'){
        // ascending sort
        computedData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    }
    else{
        // descending sort
        computedData.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    }
    const endTime = performance.now();
    formatData();
    console.log(endTime - startTime)
    document.getElementById('timeTaken').innerHTML = "<span>Time taken for data sorting <strong>without web workers</strong>:"+ String(endTime - startTime)+ "ms</span>";
    
});
function generateRecords() {
    // generate dummy records for testing
    const records = [];
    const populationBase = 170000000;

    for (let i = 1; i <= 1000; i++) {
        const record = {
            "ID Nation": "01000US",
            "Nation": "United States",
            "ID Year": i,
            "Year": i.toString(),
            "Population": populationBase + i,
            "Slug Nation": "united-states"
        };
        records.push(record);
    }

    return records;
}

