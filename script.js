let sheepRecords = {};
let sheepCounter = 1; // Counter for unique sheep ID suffix

// Function to switch sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    updateAll();
}

// Generate Unique Sheep ID (9 Digits)
function generateSheepID(breed) {
    let date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let shortBreed = breed.substring(0, 3).toUpperCase();
    let suffix = String(sheepCounter).padStart(3, '0'); // 3-digit unique counter
    let newID = `${day}${month}${shortBreed}${suffix}`;
    
    // Ensure ID is unique
    while (sheepRecords[newID]) {
        sheepCounter++;
        suffix = String(sheepCounter).padStart(3, '0');
        newID = `${day}${month}${shortBreed}${suffix}`;
    }
    return newID;
}

// Add Sheep
function addSheep() {
    const breed = document.getElementById('sheepBreed').value;
    const price = parseFloat(document.getElementById('sheepPrice').value);
    const weight = parseFloat(document.getElementById('sheepWeight').value);

    if (breed && !isNaN(price) && !isNaN(weight)) {
        const id = generateSheepID(breed);
        sheepRecords[id] = { 
            breed, 
            purchasePrice: price, 
            purchaseWeight: weight, 
            weights: [weight], 
            sold: false, 
            deceased: false, 
            purchaseDate: new Date().toLocaleDateString(),
            sellingDate: null,
            mortalityDate: null,
            sellPrice: null,
            lastWeightUpdate: new Date().toLocaleDateString()
        };

        updateAll();
        
        // Clear input fields after adding sheep
        document.getElementById('sheepBreed').value = '';
        document.getElementById('sheepPrice').value = '';
        document.getElementById('sheepWeight').value = '';
    } else {
        alert("Please enter valid sheep details.");
    }
}

// Log Weight
function logWeight(sheepId) {
    const weight = parseFloat(prompt("Enter weight for Sheep ID " + sheepId + " (kg):"));

    if (!isNaN(weight) && weight > 0) {
        sheepRecords[sheepId].weights.push(weight);
        sheepRecords[sheepId].lastWeightUpdate = new Date().toLocaleDateString();
        updateAll();
        alert(`Weight logged successfully for Sheep ${sheepId}`);
    } else {
        alert("Invalid weight entry. Please enter a valid number.");
    }
}

// Sell Sheep
function sellSheep() {
    const sheepId = document.getElementById('sellSheepId').value;
    const livePricePerKg = parseFloat(document.getElementById('livePricePerKg').value);

    if (sheepId && !sheepRecords[sheepId].sold && !isNaN(livePricePerKg)) {
        let lastWeight = sheepRecords[sheepId].weights.slice(-1)[0];
        let sellPrice = lastWeight * livePricePerKg;
        sheepRecords[sheepId].sold = true;
        sheepRecords[sheepId].sellPrice = sellPrice;
        sheepRecords[sheepId].sellingDate = new Date().toLocaleDateString();
        updateAll();
    }
}

// Remove Dead Sheep
function removeDeadSheep() {
    const sheepId = document.getElementById('deadSheepId').value;
    if (sheepId && !sheepRecords[sheepId].sold) {
        sheepRecords[sheepId].deceased = true;
        sheepRecords[sheepId].mortalityDate = new Date().toLocaleDateString();
        updateAll();
    }
}

// Update Sheep List (Exclude Sold & Deceased)
function updateSheepList() {
    const sheepList = document.getElementById('sheepRecords');
    sheepList.innerHTML = '';

    Object.keys(sheepRecords).forEach(id => {
        const sheep = sheepRecords[id];
        if (!sheep.sold && !sheep.deceased) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>ID:</strong> ${id} | <strong>Breed:</strong> ${sheep.breed} | 
                <strong>Price:</strong> ₹${sheep.purchasePrice} | 
                <strong>Weight:</strong> ${sheep.weights[sheep.weights.length - 1]} kg 
                <button onclick="logWeight('${id}')">Log Weight</button>
            `;
            sheepList.appendChild(listItem);
        }
    });
    updateDropdowns();
    updateInventorySheet();
}

// Update Dropdowns (Exclude Sold & Deceased)
function updateDropdowns() {
    const sellDropdown = document.getElementById('sellSheepId');
    const deadDropdown = document.getElementById('deadSheepId');
    
    sellDropdown.innerHTML = `<option value="">Select Sheep</option>`;
    deadDropdown.innerHTML = `<option value="">Select Sheep</option>`;
    
    Object.keys(sheepRecords).forEach(id => {
        if (!sheepRecords[id].sold && !sheepRecords[id].deceased) {
            let option = document.createElement("option");
            option.value = id;
            option.textContent = `${sheepRecords[id].breed} (${id})`;
            sellDropdown.appendChild(option);
            
            let option2 = option.cloneNode(true);
            deadDropdown.appendChild(option2);
        }
    });
}

// Function to update all sections
function updateAll() {
    updateSheepList();
    updateDropdowns();
    updateInventorySheet();
}

// Update Sheep Inventory Sheet (Keep Sold & Deceased for Record)
function updateInventorySheet() {
    const inventoryTable = document.getElementById('inventoryRecords');
    inventoryTable.innerHTML = '';
    
    Object.keys(sheepRecords).forEach(id => {
        const sheep = sheepRecords[id];
        const lastWeight = sheep.weights.length > 0 ? sheep.weights.slice(-1)[0] : '-';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${id}</td>
            <td>${sheep.breed}</td>
            <td>${sheep.purchaseDate}</td>
            <td>₹${sheep.purchasePrice}</td>
            <td>${sheep.purchaseWeight} kg</td>
            <td>${lastWeight} kg</td>
            <td>${sheep.lastWeightUpdate || '-'} </td>
            <td>${sheep.sold ? sheep.weights.slice(-1)[0] + ' kg' : '-'}</td>
            <td>${sheep.sold ? '₹' + sheep.sellPrice.toFixed(2) : '-'}</td>
            <td>${sheep.sold ? sheep.sellingDate : '-'}</td>
            <td>${sheep.deceased ? sheep.mortalityDate : '-'}</td>
        `;
        inventoryTable.appendChild(row);
    });
}