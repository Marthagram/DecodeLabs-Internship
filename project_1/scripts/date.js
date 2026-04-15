const lastModified = document.getElementById('lastModified');
const year = document.querySelector(".year")
const today= new Date()

year.innerHTML = `&copy; ${today.getFullYear()} 🌼 Martha Itohan Otasowie 🌼 Nigeria `;  
lastModified.textContent = `Last Modified: ${document.lastModified}`;