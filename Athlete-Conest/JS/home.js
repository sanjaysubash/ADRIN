document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

async function fetchNews() {
    try {
        // Fetch the news from the server (ensure your server has the /news route)
        const response = await fetch('/news');
        
        // Check if the response is successful (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response JSON
        const data = await response.json();

        // Check if articles are present in the fetched data
        if (data.articles) {
            const ticker = document.getElementById('ticker');
            const newsArticles = document.getElementById('news-articles');

            data.articles.forEach((article, index) => {
                // Populate news ticker (only showing first 5 articles)
                if (index < 5) {
                    const li = document.createElement('li');
                    li.innerText = article.title;
                    ticker.appendChild(li);
                }

                // Populate news articles section
                const articleElement = document.createElement('article');
                articleElement.innerHTML = `
                    <h2>${article.title}</h2>
                    <img src="${article.urlToImage || '../ASSETS/default.jpg'}" alt="News Image">
                    <p>${article.description || 'No description available.'}</p>
                `;
                newsArticles.appendChild(articleElement);
            });
        } else {
            console.error('No articles found');
        }
    } catch (err) {
        console.error('Error fetching news:', err);
    }
}
