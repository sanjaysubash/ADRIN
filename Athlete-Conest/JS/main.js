document.addEventListener('DOMContentLoaded', function() {
    // Simulated fetch function to get news articles
    function fetchNewsArticles() {
        // Replace this with an actual API call to fetch sports news
        return [
            { title: "Exciting Match Highlights", content: "Details about the latest thrilling sports events" },
            { title: "Player of the Year Announced", content: "Top player of the year revealed in a grand ceremony" },
            { title: "Upcoming Tournaments", content: "List of major upcoming sports tournaments" }
        ];
    }

    // Function to display news articles
    function displayNewsArticles() {
        const articles = fetchNewsArticles();
        const newsContainer = document.getElementById('news-articles');
        
        articles.forEach(article => {
            const articleElement = document.createElement('article');
            const titleElement = document.createElement('h2');
            const contentElement = document.createElement('p');
            
            titleElement.textContent = article.title;
            contentElement.textContent = article.content;
            
            articleElement.appendChild(titleElement);
            articleElement.appendChild(contentElement);
            
            newsContainer.appendChild(articleElement);
        });
    }

    // Display the news articles on page load
    displayNewsArticles();
});
