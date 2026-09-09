document.addEventListener("DOMContentLoaded", function () {

    // ================= HEADER CSS =================
    const headerCSS = document.createElement("link");
    headerCSS.rel = "stylesheet";
    headerCSS.href = "../components/header.css";
    document.head.appendChild(headerCSS);


    // ================= FOOTER CSS =================
    const footerCSS = document.createElement("link");
    footerCSS.rel = "stylesheet";
    footerCSS.href = "../components/footer.css";
    document.head.appendChild(footerCSS);


    // ================= LOAD HEADER =================
    const header = document.getElementById("header");

    if (header) {
        fetch("../components/header.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Header file not found");
                }
                return response.text();
            })
            .then(data => {
                header.innerHTML = data;
            })
            .catch(error => {
                console.error("Header loading error:", error);
            });
    }


    // ================= LOAD FOOTER =================
    const footer = document.getElementById("footer");

    if (footer) {
        fetch("../components/footer.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Footer file not found");
                }
                return response.text();
            })
            .then(data => {
                footer.innerHTML = data;
            })
            .catch(error => {
                console.error("Footer loading error:", error);
            });
    }

});