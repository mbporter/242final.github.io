const getBooks = async() => {
    try{
        return (await fetch("/api/books/")).json();
    }catch(error){
        console.log(error);
    }
};

const showBooks = async() => {
    let books = await getBooks();
    let booksDiv = document.getElementById("books-list");
    booksDiv.innerHTML = "";
    books.forEach((book) => {
        const section = document.createElement("section");
        section.classList.add("book");
        booksDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = book.name;
        a.append(h3);

        const img = document.createElement("img");
        img.src = book.img;
        section.append(img);

        

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(book);
        };
    });
};

const displayDetails = (book) => {
    const bookDetails = document.getElementById("books-details");
    bookDetails.innerHTML = "";

    const dLink = document.createElement("a");
    dLink.innerHTML = "	 &#x2715;";
    bookDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    bookDetails.append(eLink);
    eLink.id = "edit-link";

    const h3 = document.createElement("h3");
    h3.innerHTML = `<strong>Book Title: </strong> ${book.name}`;
    bookDetails.append(h3);

    const date = document.createElement("p");
    date.innerHTML = `<strong>Release Date: </strong> ${book.date}`;
    bookDetails.append(date);

    const authenticity = document.createElement("p");
    authenticity.innerHTML = `<strong>Amount read: </strong> ${book.authenticity}`;
    bookDetails.append(authenticity);

    const condition = document.createElement("p");
    condition.innerHTML = `<strong>Amount read: </strong> ${book.condition}`;
    bookDetails.append(condition);

    const description = document.createElement("p");
    description.innerHTML = `<strong>Description: </strong> ${book.description}`;
    bookDetails.append(description);

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("title").innerHTML = "Edit Book";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteBook(book);
    };

    populateEditForm(book); 
};

const deleteBook = async (book) => {
    let response = await fetch(`/api/books/${book._id}`, { 
        method: "DELETE",
        headers: {
        "Content-Type": "application/json;charset=utf-8",
        },
  });
 

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }
    
    let result = await response.json();
    showBooks();
    document.getElementById("books-details").innerHTML = "";
    resetForm();
}

const populateEditForm = (books) => {
    const form = document.getElementById("add-edit-book-form");
    form._id.value = book._id;
    form.name.value = book.name;
    form.date.value = book.date;
    form.querySelector('input[name="condition"]:checked').value = book.condition;
    form.description.value = book.description;
 
};

const addEditBook = async(e) => {
    e.preventDefault();
    const form =  document.getElementById("add-edit-book-form");
    const formData = new FormData(form);
    let response;
    // let book;
    if(form._id.value == -1){
        formData.delete("_id");
        
        console.log(...formData);

        response = await fetch("/api/books", {
            method: "POST",
            body: formData,
        });
        

    }

    else {

        console.log(...formData);

        response = await fetch(`/api/books/${form._id.value}`, {
            method: "PUT",
            body: formData,
        });
    }

    if(response.status != 200){
        console.log("Posting Error");
    }

    book = await response.json();

    if (form._id.value != -1) {
        displayDetails(book);
    }

    
    
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showBooks();
};


const resetForm = () => {
    const form = document.getElementById("add-edit-book-form");
    form.reset();
    form._id.value = "-1";
    
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("title").innerHTML = "Add Book";
    resetForm();
};




window.onload = () => {
    showBooks();
    document.getElementById("add-edit-book-form").onsubmit = addEditBook;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    
};
