self.onmessage = function(event) {
    const data = event.data.computedData;
    const sortedData = data.slice();
    if(event.data.order == 'ascending'){
        // ascending sort
        sortedData.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    }
    else{
        // descending sort
        sortedData.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    }

    self.postMessage(sortedData);
};
