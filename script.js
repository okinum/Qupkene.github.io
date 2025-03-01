        function login() {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            if (username === "" && password === "") {
                document.getElementById("loginScreen").classList.add("fade-out");
                setTimeout(() => {
                    document.getElementById("loginScreen").style.display = "none";
                    document.getElementById("mainContent").classList.add("fade-in");
                    document.getElementById("mainContent").style.display = "block";
                    document.getElementById("loginSound").play();
                }, 1000);
            } else {
                alert("Vale kasutajanimi või parool.");
            }
        }
		
function loadData() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Laetud andmed:", data);
            processOfficers(data.officers);
            processPeople(data.people);
        })
        .catch(error => console.error("Andmete laadimine ebaõnnestus:", error));
}

function processOfficers(officers) {
    officers.forEach(officer => {
        console.log(`${officer.name} - ${officer.role}`);
    });
}

function processPeople(people) {
    people.forEach(person => {
        console.log(`${person.name}, ${person.age} aastat vana - ${person.job}`);
    });
}

// Laadib andmed kohe
loadData();


        function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active-tab";
        }
        let callCount = 0; // Hoia üleval callide arvu

        function addCall() {
    callCount++;
    const callList = document.getElementById("callList");
    const callItem = document.createElement("div");
    callItem.className = "call-item";
    const newCall = generateRandomCall();

    let nearestOfficer = -1;
    let nearestDistance = -1;

    officers.forEach(officer => {
        const officerDistance = parseFloat(officer.distance.split(' ')[0]);

        if (officerDistance > nearestDistance) {
            nearestDistance = officerDistance;
            nearestOfficer = officer;
        }
    });

    // Add the call content with hidden description
    callItem.innerHTML = `
        <strong>#${callCount} ${newCall.title}</strong><br>
        <span>Lähim Ohvitser: ${nearestOfficer.name} (${nearestOfficer.id}) ${nearestOfficer.distance}, ${nearestOfficer.time}</span><br>
        <span>Kontakt: ${newCall.name}, Tel: ${newCall.phone}</span><br>
        <div class="hidden-description">${newCall.fullDescription}</div>
        <button onclick="toggleDescription(this)" class="show-more">Näita rohkem</button><br>
        <button onclick="acceptCall(this, ${callCount})" class="accept-btn">Aktsepteeri</button>
        <button onclick="rejectCall(this)" class="reject-btn">Keeldu</button>
    `;

    callList.insertBefore(callItem, callList.firstChild);
    document.getElementById("newCallSound").play();
}

function toggleDescription(button) {
    var description = button.previousElementSibling; // Select the previous element which is the description
    if (description.classList.contains("hidden-description")) {
        description.classList.remove("hidden-description");
        button.innerText = "Näita vähem"; // Change button text
    } else {
        description.classList.add("hidden-description");
        button.innerText = "Näita rohkem"; // Change back to original text
    }
}



function acceptCall(button) {
    var callItem = button.parentElement;
    callItem.style.backgroundColor = '#ffecb3'; // Yellow background for ongoing call
    button.remove(); // Remove Accept button
    callItem.querySelector('.reject-btn').remove(); // Remove Reject button

    // Show the available officers for manual assignment
    document.getElementById('officerList').style.display = 'block'; // Ensure the officer list is visible
    assignOfficerToCall(callItem); // Proceed to assign officer manually
}

function assignOfficerToCall(callItem) {
    const officerButtons = document.querySelectorAll('.send-officer');

    officerButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function () {
            const officerId = newButton.getAttribute('data-officer-id');
            const assignedOfficer = officers.find(officer => officer.id === officerId);

            // Kontrollime, kas officer on juba määratud
            if (assignedOfficer.isAssigned) {
                alert(`${assignedOfficer.name} on juba määratud väljakutsele!`);
                return; // Vältime topeltmääramist
            }

            const travelTimeInMinutes = parseInt(assignedOfficer.time.split(' ')[0]);

            // Lisa officer info callile
            callItem.innerHTML += `
                <div class="officer-info">
                    <img src="${assignedOfficer.avatar}" class="officer-avatar">
                    <span>${assignedOfficer.id} ${assignedOfficer.name}</span>
                </div>
                <progress value="0" max="100" id="progress-${assignedOfficer.id}"></progress>
            `;

            // Muuda nupp kollaseks ja kirjuta peale "Assigned"
            newButton.classList.add("assigned-btn");
            newButton.innerHTML = "Assigned";
            assignedOfficer.isAssigned = true; // Märgime officeri määratuks

            // Algata progressBar update
            let progress = 0;
            const interval = setInterval(() => {
                progress += 100 / (travelTimeInMinutes * 2); // Call lahendamiseks lisatakse travelTime x2
                document.getElementById(`progress-${assignedOfficer.id}`).value = progress;

                if (progress >= 100) {
                    clearInterval(interval);
                    callItem.style.backgroundColor = '#d4edda'; // Lahendatud
                    callItem.innerHTML += '<span class="status-icon">✅</span>';
                    assignedOfficer.isAssigned = false; // Vabasta officer

                    // Muuda nupp tagasi "Send" olekusse ja algse värviga
                    newButton.classList.remove("assigned-btn");
                    newButton.classList.add("send-btn");
                    newButton.innerHTML = "Send";
                    newButton.disabled = false; // Aktiveeri nupp uuesti
                }
            }, 1000); // Update progress iga sekund

setTimeout(() => {
    callItem.remove ()
    }, 60000); 

        });
    });
}



function rejectCall(button) {
    var callItem = button.parentElement;
    callItem.style.backgroundColor = '#f8d7da'; // Red background for rejected
    callItem.innerHTML += '<span class="status-icon">❌</span>'; // Red cross
    button.remove(); // Remove Accept button
    callItem.querySelector('.reject-btn').remove(); // Remove Reject button
    button.remove(); // Remove Accept button
    callItem.querySelector('.accept-btn').remove(); // Remove Reject button
    
    
   setTimeout(() => {
    callItem.remove ()
   }, 20000); 
}

function populateOfficerList() {
    const officerMenu = document.getElementById("officerMenu");
    officerMenu.innerHTML = ''; // Puhasta olemasolev nimekiri

    officers.forEach((officer, index) => {
        if (!officer.isAssigned) {
            const officerItem = document.createElement("div");
            officerItem.className = "officer-item";
            officerItem.style.display = "inline-block"; // Kuvame kahes reas
            officerItem.style.width = "45%"; // Vähendame laiust

            officerItem.innerHTML = `
                <div class="officer-info">
                    <img src="${officer.avatar}" class="officer-avatar">
                    <span>${officer.id} ${officer.name}</span>
                </div>
                <button class="send-btn send-officer" data-officer-id="${officer.id}">Send</button>
            `;
            officerMenu.appendChild(officerItem);
        }
    });
}




// Call this function to populate the list when the page loads
populateOfficerList();


    setTimeout(() => {
        callItem.style.backgroundColor = '#d4edda'; // Green when complete
        callItem.innerHTML += '<span class="status-icon">✅</span>'; // Checkmark for completion
        assignedOfficer.isAssigned = false; // Free officer
    }, 3000);

function assignOfficers(callItem, availableOfficers) {
    let assignedOfficer = availableOfficers[0]; // Get available officer
    assignedOfficer.isAssigned = true;

    callItem.innerHTML += `
        <div class="officer-info">
            <img src="${assignedOfficer.avatar}" class="officer-avatar">
            <span>${assignedOfficer.id} ${assignedOfficer.name}: ${assignedOfficer.distance} - ${assignedOfficer.time}</span>
        </div>
    `;
}
        function toggleDescription(element) {
            var description = element.previousElementSibling;
            if (description.classList.contains("hidden-description")) {
                description.classList.remove("hidden-description");
                element.innerText = "Näita vähem";
            } else {
                description.classList.add("hidden-description");
                element.innerText = "Näita rohkem";
            }
        }

        function generateRandomCall() {
    var callPairs = [
    { title: "Pangarööv", description: "Vene tänava Swedpanka sisenesid 4 maskeeritud isikut tulirelvadega ning nõuavad raha." },
    { title: "Maja süttimine", description: "Tulime koju ja nägime, et meie naabermaja katus põleb. Palun abi!" },
    { title: "Kadunud laps", description: "9-aastane tüdruk jooksis kodust ära peale tüli vanematega, asukoht teadmata." },
    { title: "Relvastatud vargus", description: "Toidupoodi sisenes maskiga mees relvaga ja nõudis kassapidajalt raha." },
    { title: "Võltsitud dokument", description: "Autopesula töötaja kahtlustab kliendi dokumentide võltsimist." },
    { title: "Koduvägivald", description: "Korteris on kuulda karjeid ja tugevat kolinat, kahtlustan, et mees lööb oma naist." },
    { title: "Autoavarii", description: "Kahe auto kokkupõrge linna peaväljakul, üks juht tundub purjus olevat." },
    { title: "Leitud narkootikumid", description: "Kooli õpetaja leidis tualetist kahtlase valge pulbriga kotikese." },
    { title: "Jalgratta vargus", description: "Minu lapse jalgratas varastati meie hoovist öösel." },
    { title: "Korrarikkuja baaris", description: "Klient keeldub baarist lahkumast, on agressiivne ja ähvardab töötajaid." },
    { title: "Korteri sissemurdmine", description: "Koduuks oli lahti murtud ja korterist on kadunud väärisesemeid." },
    { title: "Pommiähvardus", description: "Kooli administraator sai tundmatu kõne pommiähvardusega, evakuatsioon on alustatud." },
    { title: "Kahtlane pakk rongijaamas", description: "Rongijaamas on maha jäetud suur kohver, keegi pole sellele ligi astunud." },
    { title: "Salaküttimine", description: "Kohalikud jahimehed teatavad salaküttimisest riikliku kaitse all olevas metsas." },
    { title: "Võltsitud raha", description: "Kassapidaja avastas kassa lugemisel võltsitud 50-eurose kupüüri." },
    { title: "Põgenenud vang", description: "Kinnipidamisasutuse lähedalt on kadunud kinnipeetav, teda peetakse ohtlikuks." },
    { title: "Arvutikelmus", description: "Firma sai kirja makse kinnitamise kohta, mida nad pole kunagi algatanud." },
    { title: "Sissetung vanainimese koju", description: "Vanainimene teatab, et keegi on öösel tema koduuksest sisse tunginud ja kappides sorinud." },
    { title: "Meeleavaldus", description: "Linnavalitsuse ees koguneb suur hulk inimesi protesteerima ja olukord hakkab eskaleeruma." },
    { title: "Kahtlane draakon", description: "Metsast kostub veider heli, justkui draakon hingaks tuld – kohalikud on hirmul." },
    { title: "Lennujaama turvaintsident", description: "Kahtlane isik keeldub lennujaamas turvakontrollist läbimast ja põhjustab häiret." },
    { title: "Küberrünnak", description: "Kohalik haigla IT-süsteemid on langenud küberrünnaku ohvriks, mis häirib tööprotsesse." },
    { title: "Loata tuletegemine", description: "Metsas süüdati lõke hoolimata kehtivast tuletegemise keelust, olukord näib kontrolli alt väljumas." },
    { title: "Plaaniline pangarööv", description: "Anonüümne vihje viitab, et järgmise nädala alguses plaanitakse pangaröövi." },
    { title: "Suvilate murdvargus", description: "Mitmes suvilas on sisse murtud ja varastatud väärtuslikke esemeid, sealhulgas paadid ja tööriistad." },
    { title: "Agressiivne koer", description: "Tänaval on valla pääsenud suur koer, kes on inimesi rünnanud." },
    { title: "Piraattaksod", description: "Kohalikud elanikud kahtlustavad, et linnas tegutseb suur piraattakso võrgustik." },
    { title: "Allakukkunud UFO", description: "Metsas nähti öösel tulukesi ja leitakse kahtlane metallist objekt – kohalikud räägivad UFO-st." },
    { title: "Pussitamine tänaval", description: "Vene tänaval oli kaklus, kus üks isik sai noaga haavata, ründaja on põgenenud." },
    { title: "Korteriühistu konflikt", description: "Naaber ei maksa korteriühistu arveid ja on hakanud teisi korteriomanikke ähvardama." },
    { title: "Öörahu rikkumine", description: "Noortekamp korraldab majade vahel valjuhäälseid pidusid ja rikub korduvalt öörahu." },
    { title: "Rongilt alla kukkunud inimene", description: "Raudteel on rongilt kukkunud reisija, kes vajab kiiret meditsiinilist abi." },
    { title: "Kahtlane jälitamine", description: "Mitu päeva on auto mind jälitanud kõikjale, kuhu ma lähen, kardan oma turvalisuse pärast." },
    { title: "Purjus autojuht", description: "Nägin, kuidas juhuslik auto sõitis ettevaatamatult ja kaldus korduvalt vastassuunavööndisse." },
    { title: "Sünnipäevapidu", description: "Laste sünnipäevalaadal puhkes suur tüli vanemate vahel, olukord on kontrolli alt väljas." },
    { title: "Kaupluse vandaalitsemine", description: "Kohalikus elektroonikapoes on purustatud mitmed seadmed ja kahtlustatakse röövimiskatset." },
    { title: "Naabrivalve kahtlus", description: "Naabruses elab tundmatu isik, kes käib öösiti ümber majade ja tundub kahtlane." },
    { title: "Tulnukate maandumine", description: "Kohalik karjakasvataja väidab, et tema heinamaale on maandunud tundmatu lendav objekt." },
    { title: "Varastatud auto", description: "Minu auto varastati öösel maja eest, jäljed viitavad murdvargusele." },
    { title: "Reostunud jõgi", description: "Jõkke on valgunud suur kogus õli, mis on ohtlik keskkonnale ja loomadele." },
    { title: "Tehnovõrgu saboteerimine", description: "Linna elektriliinidel toimus saboteerimine, mis põhjustas ulatusliku voolukatkestuse." },
    { title: "Spordivõistlusel kaklus", description: "Jalgpallimängul puhkes kaklus, kus üks mängija lõi teist rusikaga näkku." },
    { title: "Isik metsa eksinud", description: "Matkaja teatab, et tema kaaslane on metsas kaduma läinud ja telefonile ei vasta." },
    { title: "Salajane kokkusaamine", description: "Kohalik elanik kahtlustab, et mahajäetud laohoones toimub ebaseaduslik relvakaup." },
    { title: "Inimkaubandus", description: "Anonüümne vihje väidab, et korteris hoitakse kinni inimesi, keda sunnitakse tööle vastutahtmist." },
    { title: "Loata rallivõistlus", description: "Metsateedel toimub loata rallivõistlus, kus kihutavad autod ohustavad teisi liiklejaid." },
    { title: "Kontserdil vigastatu", description: "Rock-kontserdil kukkus inimene rahvamassi ja jäi jalge alla, vajab kiiret abi." },
    { title: "Kassipoeg puu otsas", description: "Kassipoeg on juba mitmendat päeva puu otsas ja ei tule alla, omanik on mures." },
    { title: "Põgenenud hobune", description: "Talu lähedal on vabadusse pääsenud hobune, kes jookseb mööda maanteed." },
    { title: "Kadunud ehted", description: "Peale külaliste lahkumist avastasime, et meie väärtuslikud ehted on kadunud." },
    { title: "Korterilõhkumine", description: "Minu allnaaber peksab oma korteri ust ja aknaid, ta on väga vihane ja purjus." },
    { title: "Lennuki kaaperdamine", description: "Lennukis teatas üks reisija, et tal on pomm ja nõuab kohest maandumist." },
    { title: "Jalakäija vigastamine", description: "Jalgrattur sõitis jalakäijale otsa ja vigastas teda, rattur põgenes sündmuskohalt." },
    { title: "Mehe enesetapukatse", description: "Nägin meest, kes seisis silla äärel ja ähvardas hüpata, abi on vaja kohe." },
    { title: "Ulmepargiga seotud viga", description: "Virtuaalreaalsuse pargis on juhtunud tõrge ja inimesed on 'lõksus' oma simulaatorites." },
    { title: "Pealtnäha mahajäetud maja", description: "Majas, mis peaks olema tühi, on valgust ja liikumist – naabrid kahtlustavad sissetungi." },
    { title: "Kummaline hääl kanalis", description: "Kanalisatsioonišahtist tuleb kummaline hääl, naabrid kardavad, et midagi ebatavalist toimub." },
    { title: "Vangla mäss", description: "Kohalikus vanglas on mässu olukord, vangid on kontrolli alt väljunud." },
    { title: "Häiriv hääl naaberkorterist", description: "Naaberkorterist kostub terve päev valju metalli kriginat, mis häirib kogu korrust." },
    { title: "Surnud isik hotellitoas", description: "Hotelli koristaja leidis toast isiku, kes ei hinga ja on nähtavasti surnud." },
    { title: "Kahtlustatav kodust väljumata", description: "Politseil on põhjus arvata, et otsitav isik peidab end oma korteris ega lahku sealt kunagi." }
    ];

    
    var randomPair = callPairs[Math.floor(Math.random() * callPairs.length)];
    var phone = "+372" + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    var randomName = names[Math.floor(Math.random() * names.length)];

    // Genereeri iga officerile random aeg ja kaugus
    officers.forEach(officer => {
        officer.distance = `${(Math.random() * 10).toFixed(1)} km`;
        officer.time = `${Math.floor(Math.random() * 15) + 1} min`;
    });

    return {
        title: randomPair.title,
        fullDescription: randomPair.description,
        phone: phone,
        name: randomName
    };
}

        function performSearch() {
            var query = document.getElementById("searchInput").value.toLowerCase();
            var results = names.filter(name => name.toLowerCase().includes(query));
            console.log("Otsingutulemused:", results);
        }

        addCall()

        function addRandomCall() {
    // Loo uus kõne
    addCall();
    
    // Määra randomiseeritud intervall (nt vahemikus 5 kuni 15 sekundit)
    let randomInterval = Math.floor(Math.random() * (55000 - 10000 + 1)) + 5000;

    // Rekursiivselt kutsu sama funktsioon random intervalliga
    setTimeout(addRandomCall, randomInterval);
}

// Algata esimene kõne
addRandomCall();

        addOfficers()

        //setInterval(addCall, 2000);


        function search() {
            var query = document.getElementById("searchInput").value.toLowerCase();
            var person = people.find(p => p.name.toLowerCase().includes(query));
            if (person) {
                showProfile(person);
            } else {
                alert("Isikut ei leitud.");
            }
        }


        function sendOfficer(button) {
            var officer = button.parentElement;
            officer.querySelector(".data").innerHTML += " Responting"

        }

        function showProfile(person) {
            document.getElementById("ProfileView").innerHTML = `
                <div class="profile">
                    <div class="profile-pic">
                        <img src="${person.avatar}" alt="${person.name}">
                    </div>
                    <div class="profile-info">
                        <h3>${person.name}</h3>
                        <p>Vanus: ${person.age}</p>
                        <p>Töökoht: ${person.job}</p>
                        <p>Elukoht: ${person.location}</p>
                        <div class="profile-crimes">
                            <h4>Varasemad juhtumid:</h4>
                            <ul>
                                ${person.previousCases.map(caseItem => `<li>${caseItem}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="wanted-status">
                            <h4>Tagaotsitavus: ${person.isWanted ? 'Jah' : 'Ei'}</h4>
                            <button onclick="toggleWantedStatus('${person.name}')">${person.isWanted ? 'Tühista tagaotsitavus' : 'Lisa tagaotsitavaks'}</button>
                        </div>
                    </div>
                </div>
            `;
            openTab({ currentTarget: document.querySelector(`button[onclick="openTab(event, 'ProfileView')"]`) }, 'ProfileView');
        }

        function toggleWantedStatus(name) {
            var person = people.find(p => p.name === name);
            if (person) {
                person.isWanted = !person.isWanted;
                showProfile(person);
            }
        }

        function performSearch() {
            var query = document.getElementById("searchInput").value.toLowerCase();
            var results = people.filter(person => person.name.toLowerCase().includes(query));
            console.log("Otsingutulemused:", results);
        }

        setInterval(() => {
            // Tegevused nagu andmete uuendamine
        }, 5000);
