const { link } = require("joi");

const getInfo = async () => {
    const url = "url";
    try {
        const responce = await fetch(url);
        return await responce.json();
    }
    catch (error) {
        console.error('Error', error);
    }

};

const displayInfo = async () => {
    const info = await getInfo();
    const infoContainer = document.getElementById("books");
    info.forEach((info) => {
        infoContainer.appendChild(getSelectionInfo(info));
    });
};

const getSelectionInfo = (info) => {
    const section = document.createElement("section");

    const h2 = document.createElement("h2");
    h2.innerHTML = info.title;

    const description = document.createElement("p");
    description.innerHTML = '<strong> Description: <strong> ${info.description}';


    const auth = document.createElement("p");
    auth.innerHTML = '<strong> By: <strong> ${info.auth}';

    const img = document.createElement("img");
    img.src = 'https://242final.github.io/public/Part%1/cat/teen/${info.image}';

    section.appendChild(img);
    section.appendChild(h2);
    section.appendChild(auth);
    section.appendChild(description);

    return section;
}