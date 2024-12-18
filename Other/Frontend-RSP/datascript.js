const apiUrl = '../Backend-RSP/articles?status=1&page=1&limit=6';

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('articles-container');

        data.forEach(article => {
            const cardHTML = `
               <div class="col">
                    <div class="card" style="width: 100%; background-color: #333; border: none;">
                        <img class="card-img-top" src="${article.pictureUrl}" alt="${article.name}" style="width: 100%; height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h4 class="card-title" style="color: #F5F5F5;">${article.name}</h4>
                            <p class="card-text" style="color: #F5F5F5;">${article.description}</p>
                            <div class="text-center mt-auto">
                                <a href="#" class="btn btn-primary">Read more</a>
                            </div>
                        </div>
                    </div>
                </div>            `;

            // Append each card HTML to the container
            container.innerHTML += cardHTML;
        });
    })
    .catch(error => console.error('Error fetching data:', error));

const carouselApiUrl = '../Backend-RSP/articles';

const articleIds = [72, 73, 74]; // Example IDs for articles

// Fetch and populate Articles Data
Promise.all(articleIds.map(id => 
    fetch(`${carouselApiUrl}/${id}/`) // Fetch article by ID
    .then(response => response.json())
    .catch(error => console.error(`Error fetching article ${id}:`, error))
)).then(data => {
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    // Loop through the data and create HTML for each article (used both for carousel and cards)
    data.forEach((article, index) => {
        // Create carousel indicator (dots)
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#demo');
        indicator.setAttribute('data-bs-slide-to', index);
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        carouselIndicators.appendChild(indicator);

        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }

        const image = document.createElement('img');
        image.src = article.article_picture;
        image.alt = article.author_name;
        image.classList.add('d-block', 'w-100');

        const caption = document.createElement('div');
        caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
        caption.style.bottom = '20rem';

        const title = document.createElement('h5');
        title.innerText = article.author_name;

        const description = document.createElement('p');
        description.innerText = article.article_name;

        caption.appendChild(title);
        caption.appendChild(description);
        carouselItem.appendChild(image);
        carouselItem.appendChild(caption);
        carouselInner.appendChild(carouselItem);
    });
}).catch(error => console.error('Error fetching articles:', error));
