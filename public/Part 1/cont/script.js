const showEmailResult = async (e) => {
    e.preventDefault();
    const results = document.getElementById("result");
    results.innerHTML = "Loading ..."; 
    try {
        const response = await getEmailResult();
        if (response.status === 200) {
            results.innerHTML = "Email Sent!";
        } else {
            results.innerHTML = "Sorry, email cannot be sent at this time.";
        }
    } catch (error) {
        results.innerHTML = "Sorry, email cannot be sent.";
    }
};

const getEmailResult = async () => {
    const form = document.getElementById("form");
    const data = new FormData(form);
    const object = Object.fromEntries(data);
    const json = JSON.stringify(object);

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: json,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

window.onload = () => {
    document.getElementById("form").onsubmit = showEmailResult;
};
