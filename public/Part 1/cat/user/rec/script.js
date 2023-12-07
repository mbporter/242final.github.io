const submit = (e) => {
    e.preventDefault();
    const form = document.getElementById("form");
    const name = form.elements["name"].value;
    const authenticity = form.elements["authenticity"].value;
    const date = form.elements["date"].value;
    const description = form.elements["description"].value;
    const condition = getValue("condition");
    const image = form.elements["fileInput"].value;

    
    const successMessage = `
        <h2>Book Information</h2>
        <p><span class="bold">Name:</span> ${name}</p>
        <p><span class="bold">Release Date:</span> ${date}</p>
        <p><span class="bold">Amount read:</span> ${authenticity}%</p>
        <p><span class="bold">Type:</span> ${condition}</p>
        <p><span class="bold">Description:</span> ${description}</p>
        <p><span class="bold"></span> Book Added!</p>
    `;

    document.getElementById("form").classList.add("hidden");
    const successMessageDiv = document.getElementById("success-message");
    successMessageDiv.innerHTML = successMessage;
    successMessageDiv.classList.remove("hidden");
};

const getValue = (radio) => {
    const radios = document.getElementsByName(radio);

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return "";
};

window.onload = () => {
    document.getElementById("form").onsubmit = submit;
};
