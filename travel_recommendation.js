class TravelRecommendation {
    static initEvents() {
        const searchInput = document.getElementById('search');
        const searchButton = document.getElementById('btn-search');
        const clearButton = document.getElementById('btn-clear');
        const recommendationsBlock = document.getElementById('block-recommendations');

        searchButton.addEventListener('click', async (e) => {
            e.preventDefault();

            let keyword = searchInput.value.trim();

            if (!keyword) {
                return;
            }

            keyword = keyword.toLowerCase();

            const data = await this.fetchRecommendations();

            const recommendations = [
                ...data.countries.flatMap(country => country.cities.filter(city => city.name.toLowerCase().includes(keyword) || city.description.toLowerCase().includes(keyword))),
                ...data.temples.filter(temple => temple.name.toLowerCase().includes(keyword) || temple.description.toLowerCase().includes(keyword)),
                ...data.beaches.filter(beach => beach.name.toLowerCase().includes(keyword) || beach.description.toLowerCase().includes(keyword)),
            ];

            const cards = recommendations.reduce((prev, curr) => prev + this.getCard(curr), '');

            recommendationsBlock.innerHTML = cards;
        });

        clearButton.addEventListener('click', (e) => {
            e.preventDefault();

            searchInput.value = '';
            recommendationsBlock.innerHTML = '';
        });
    }

    static async fetchRecommendations() {
        try {
            const response = await fetch('./travel_recommendation_api.json', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);
            return data;
        } catch (error) {
            console.log(error.message);
        }
    }

    static getCard(recommendation) {
        const timezones = [
            { country: 'New york', options: { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
            { country: 'Australia', options: { timeZone: 'Australia/Sydney', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
            { country: 'Japan', options: { timeZone: 'Asia/Tokyo', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
            { country: 'Brazil', options: { timeZone: 'America/Sao_Paulo', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
            { country: 'Cambodia', options: { timeZone: 'Asia/Phnom_Penh', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
            { country: 'French Polynesia', options: { timeZone: 'Pacific/Tahiti', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
            { country: 'India', options: { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' } },
        ];

        const timezone = timezones.find(timezone => recommendation.name.toLowerCase().includes(timezone.country.toLowerCase()));
        let timezoneAlert = '';

        if (timezone) {
            const time = new Date().toLocaleTimeString('en-US', timezone.options);
            console.log("Current time in New York:", time);
            timezoneAlert = `<div class="alert alert-success">${time}</div>`;
        }

        return `<div class="mb-4">
            ${timezoneAlert}
            <div class="card">
                <img src="${recommendation.imageUrl}" class="card-img-top" alt="${recommendation.name}">
                <div class="card-body">
                    <h5 class="card-title">${recommendation.name}</h5>
                    <p class="card-text">${recommendation.description}</p>
                    <a href="#" class="btn btn-secondary">Visit</a>
                </div>
            </div>
        </div>`;
    }

    static init() {
        this.initEvents();
    }
}

(() => TravelRecommendation.init())();
