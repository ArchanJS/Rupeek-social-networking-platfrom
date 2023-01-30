let container = document.getElementById('cont');
let all = document.getElementById('all');
let reg = document.getElementById('reg');
let sug = document.getElementById('sug');
let navbar = document.getElementById('navbar');

let baseUrl = 'http://localhost:8000/api/user';

if (!localStorage.getItem("userToken")) {
    // window.location.href="http://127.0.0.1:5500/client/index.html";
    navbar.style.display = 'none';
}


// const utils=require('./utils');
const config = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
    }
};

const register = async (id) => {
    try {
        ///event/:id
        if (!localStorage.getItem("userToken")) alert("Sign in required");
        else {
            await axios.put(baseUrl + `/event/${id}`, {register:true}, config);
            alert("Registration successful");
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

const cancel=async(id)=>{
    try {
        await axios.put(baseUrl + `/event/${id}`, {register:false}, config);
        alert("Cancellation successful");
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

let venueIdToCity = {
    "1234": "Kolkata",
    "2345": "Bangalore",
    "3456": "Pune",
    "4567": "Nagpur"
}

const getAllEvents = () => {
    if (localStorage.getItem("userToken")) {
        axios.get(baseUrl + '/events/private', config)
            .then(({ data }) => {
                console.log(data);
                let html = "";
                data.forEach((e) => {
                    // e[0]=e[0].toUpperCase();
                    let eventname = e.name.text;
                    eventname = eventname[0].toUpperCase() + eventname.slice(1);
                    let date = new Date(e.start.utc).toString().slice(0, 15);
                    console.log(date);
                    html += `<div class="card">
          <div class="box">
            <div class="content">
              <h3>${eventname}</h3>
              <p><i class="fa-regular fa-calendar"></i> ${date}</p>
              <p><i class="fa-solid fa-location-dot"></i> ${venueIdToCity[e.venue_id]}</p>
              <button onclick="register(${e.id})" >Register</button>
            </div>
          </div>
        </div>`
                })
                container.innerHTML = html;
                all.classList.add('active-tag');
                // console.log(all);
                sug.classList.remove('active-tag');
                reg.classList.remove('active-tag');
            })
            .catch((err) => {
                console.log(err);
            })
    }
    else {
        axios.get(baseUrl + '/events/public', config)
            .then(({ data }) => {
                console.log(data);
                let html = "";
                data.forEach((e) => {
                    // e[0]=e[0].toUpperCase();
                    let eventname = e.name.text;
                    eventname = eventname[0].toUpperCase() + eventname.slice(1);
                    let date = new Date(e.start.utc).toString().slice(0, 15);
                    console.log(date);
                    html += `<div class="card">
          <div class="box">
            <div class="content">
              <h3>${eventname}</h3>
              <p><i class="fa-regular fa-calendar"></i> ${date}</p>
              <p><i class="fa-solid fa-location-dot"></i> ${venueIdToCity[e.venue_id]}</p>
              <button onclick="register(${e.id})" >Register</button>
            </div>
          </div>
        </div>`
                })
                container.innerHTML = html;
                all.classList.add('active-tag');
                // console.log(all);
                sug.classList.remove('active-tag');
                reg.classList.remove('active-tag');
            })
            .catch((err) => {
                console.log(err);
            })
    }
}


const getSuggestions = async () => {
    try {
        const { data } = await axios.get(baseUrl + '/events/suggestions', config);
        let html = "";
        data.forEach((e) => {
            // e[0]=e[0].toUpperCase();
            let eventname = e.name.text;
            eventname = eventname[0].toUpperCase() + eventname.slice(1);
            let date = new Date(e.start.utc).toString().slice(0, 15);
            console.log(date);
            html += `<div class="card">
          <div class="box">
            <div class="content">
              <h3>${eventname}</h3>
              <p><i class="fa-regular fa-calendar"></i> ${date}</p>
              <p><i class="fa-solid fa-location-dot"></i> ${venueIdToCity[e.venue_id]}</p>
              <button onclick="register(${e.id})" >Register</button>
            </div>
          </div>
        </div>`
        })
        container.innerHTML = html;
        all.classList.remove('active-tag');
        // console.log(all);
        sug.classList.add('active-tag');
        reg.classList.remove('active-tag');
    } catch (error) {
        console.log(error);
    }
}

const getRegistered = async () => {
    try {
        const { data } = await axios.get(baseUrl + '/events/registered', config);
        let html = "";
        data.forEach((e) => {
            // e[0]=e[0].toUpperCase();
            let eventname = e.name.text;
            eventname = eventname[0].toUpperCase() + eventname.slice(1);
            let date = new Date(e.start.utc).toString().slice(0, 15);
            console.log(date);
            html += `<div class="card">
              <div class="box">
                <div class="content">
                  <h3>${eventname}</h3>
                  <p><i class="fa-regular fa-calendar"></i> ${date}</p>
                  <p><i class="fa-solid fa-location-dot"></i> ${venueIdToCity[e.venue_id]}</p>
                  <button onclick="cancel(${e.id})" >Cancel</button>
                </div>
              </div>
            </div>`
        })
        container.innerHTML = html;
        all.classList.remove('active-tag');
        // console.log(all);
        sug.classList.remove('active-tag');
        reg.classList.add('active-tag');
    } catch (error) {
        console.log(error);
    }
}


getAllEvents();

all.addEventListener('click', () => {
    console.log("clicked!")
    getAllEvents();
})

sug.addEventListener('click', async () => {
    console.log("clicked!")
    await getSuggestions();
})


reg.addEventListener('click', async () => {
    console.log("clicked!")
    await getRegistered();
})